import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import axiosChat from '../axios/axiosChat';
// hooks
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
// types
import { IMessage, ISelectedChat, IChatUserLastSeen, IChatLastMsg } from '../store/types/chatsTypes';
// components
import ChatsPageContainer from '../components/ChatsAndMessages/ChatsPageContainer';
import ChatsBox from '../components/ChatsAndMessages/ChatsBox';
import SelectedChat from '../components/ChatsAndMessages/SelectedChat';
import SelectedChatPhotos from '../components/ChatsAndMessages/SelectedChatPhotos';
// redux
import { getChats, markMessagesAsSeenSuccess, receiveMessageSuccess, sendMessageSuccess, userSeenMyMsgs } from '../store/actions/chatsActions';
import socket from '../socketIo';

const ChatsPage: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [selectedChat, setSelectedChat] = useState<ISelectedChat | null>(null);
  const [selectedChatLoading, setSelectedChatLoading] = useState(false);
  const [selectedChatErrorMsg, setSelectedChatErrorMsg] = useState<string | null>(null);
  const [showChatPhotos, setShowChatPhotos] = useState(false);

  const [sliderShow, setSliderShow] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [isScrolling, setIsScrolling] = useState(false);

  const onOpenPhotoSlider = (photoIndex: number): void => {
    console.log(photoIndex);
    
    setPhotoIndex(photoIndex);
    setSliderShow(true);
  };

  const onChatPhotoSliderClose = (): void => {
    setSliderShow(false);
  };

  const onPrevPhoto = (): void => {
    if(selectedChat && selectedChat.photoMessages.length > 0) {
      setPhotoIndex(prev => {
        if(prev === 0) return selectedChat.photoMessages.length - 1;
        return prev - 1;
      })
    };
  };

  const onNextPhoto = (): void => {
    if(selectedChat && selectedChat.photoMessages.length > 0) {
      setPhotoIndex(prev => {
        if(prev === selectedChat.photoMessages.length - 1) return 0;
        return prev + 1;
      });
    }
  };

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  useEffect(() => {
    socket.on("receiveMessage", ({userId, chatId, newLastMessage, message}) => {
      console.log("WTF");
      
      dispatch(receiveMessageSuccess(chatId, newLastMessage, userId));

      setSelectedChat(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            message
          ],
          unreadMessages: prev.unreadMessages.concat(message._id)
        };
      });
    });

    socket.on("seenMessages", ({userId, chatId, newUnreadMsgsList, hasLastMsg}) => {
      console.log("SEEN", userId, chatId, newUnreadMsgsList, hasLastMsg);
      dispatch(userSeenMyMsgs(userId, chatId, newUnreadMsgsList, hasLastMsg));

      setSelectedChat(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          unreadMessages: newUnreadMsgsList,
          messages: prev.messages.map(msg => {
            if(msg.sender !== userId && !newUnreadMsgsList.includes(msg._id)) {
              return {
                ...msg,
                status: "seen"
              };
            }

            return { ...msg };
          })
        };
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("seenMessages");
    };
  }, [dispatch]);

  const onChatPhotosToggle = (): void => {
    setShowChatPhotos(prev => !prev);
  };

  const onChatPhotosClose = useCallback((): void => {
    setShowChatPhotos(false);
  }, []);

  const onGetSingleChat = async(chatId: string, userId: string): Promise<void> => {
    setIsScrolling(false);
    const token = localStorage.getItem("socNetAppToken");

    setSelectedChatLoading(true);

    try {
      const { data } = await axiosChat.get<{status: string; chatId: string; messages: IMessage[]; user: IChatUserLastSeen; unreadMessages: string[]}>(`/${chatId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      
      setSelectedChat({
        chatId,
        messages: data.messages,
        photoMessages: data.messages.filter(msg => msg.photo && msg.photo.secure_url),
        user: data.user,
        unreadMessages: data.unreadMessages
      });
    } catch(error) {
      setSelectedChatErrorMsg((error as any).response.data.message);
    }
    setSelectedChatLoading(false);
  };

  useEffect(() => {
    if(location.state && location.state.clickedChatId && location.state.userId) {
      onGetSingleChat(location.state.clickedChatId, location.state.userId);
    }
  }, [location.state]);

  // useEffect();

  const onSendMessage = async(event: FormEvent<HTMLFormElement>, messageText: string, messagePhoto: File | null): Promise<void> => {
    event.preventDefault();
    if(!selectedChat) return;
    const token = localStorage.getItem("socNetAppToken");

    const formData = new FormData();
    formData.append("chatId", selectedChat.chatId);
    formData.append("userId", selectedChat.user._id);
    formData.append("messageText", messageText);
    if(messagePhoto) {
      formData.append("messagePhoto", messagePhoto);
    }

    try {
      const { data } = await axiosChat.post<{status: string; newLastMessage: IChatLastMsg; newMessage: IMessage}>("/sendMessage", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedChat(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            data.newMessage
          ]
        };
      });

      
      dispatch(sendMessageSuccess(selectedChat.chatId, data.newLastMessage, data.newMessage.receiver._id));
      socket.emit("sendMessage", {userId: selectedChat.user._id, chatId: selectedChat.chatId, newLastMessage: data.newLastMessage, message: data.newMessage});
    } catch(error) {
      setSelectedChatErrorMsg((error as any).response.data.message);
    }
  };

  const onMarkMessagesAsSeen = async(messages: string[]): Promise<void> => {
    if(!selectedChat) return;
    const token = localStorage.getItem("socNetAppToken");

    const stringMessages = JSON.stringify(messages);
    try {
      const { data } = await axiosChat.post("/markMessagesAsSeen", {
        chatId: selectedChat.chatId,
        messageIds: stringMessages
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(markMessagesAsSeenSuccess(selectedChat.chatId, data.newUnreadMsgsList, data.userId, data.hasLastMsg));
      
      setSelectedChat(prev => {
        if(!prev) return prev;

        const newMessages = prev.messages.map(message => {
          if(message.status !== "seen" && messages.includes(message._id)) {
            message.status = "seen";
          }
          return message;
        });
        // console.log(newMessages);
        
        
        return {
          ...prev,
          messages: newMessages,
          unreadMessages: prev.unreadMessages.filter(msg => !messages.includes(msg))
        };
      });

      socket.emit("userSeenMessages", {userId: selectedChat.user._id, chatId: selectedChat.chatId, newUnreadMsgsList: data.newUnreadMsgsList, hasLastMsg: data.hasLastMsg});
    } catch(error) {
      return;
    }
  };

  return (
    <ChatsPageContainer>
      <ChatsBox
        onGetSingleChat={onGetSingleChat} />
      {
        selectedChat && (
          <SelectedChat
            loading={selectedChatLoading}
            errorMsg={selectedChatErrorMsg}
            chat={selectedChat}
            photoMessages={selectedChat.photoMessages}
            onSendMessage={onSendMessage}
            onMarkMessagesAsSeen={onMarkMessagesAsSeen}
            chatPhotosShow={showChatPhotos}
            onChatPhotosToggle={onChatPhotosToggle}
            onOpenPhotoSlider={onOpenPhotoSlider}
            isScrolling={isScrolling}
            setIsScrolling={setIsScrolling} />
        )
      }
      {
        selectedChat && (
          <SelectedChatPhotos
            show={showChatPhotos}
            photoMessages={selectedChat.photoMessages}
            currentPhotoIndex={photoIndex}
            sliderShow={sliderShow}
            onPrevPhoto={onPrevPhoto}
            onNextPhoto={onNextPhoto}
            onOpenPhotoSlider={onOpenPhotoSlider}
            onChatPhotoSliderClose={onChatPhotoSliderClose}
            onChatPhotosClose={onChatPhotosClose} />
        )
      }
    </ChatsPageContainer>
  );
};

export default ChatsPage;