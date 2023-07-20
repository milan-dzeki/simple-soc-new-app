import { useReducer, useCallback, ChangeEvent, FormEvent, FormEventHandler } from "react";
import { ICommentOnPostResponse, ICreatePostData, ICreatePostResponse, IGetPostsResponse, ILikePostResponse, IPost, IUnlikePostResponse, IUsePostsState, UsePostsAction, UsePostsActionTypes } from "./usePostsTypes";
import reducer from "./usePostsReducer";
import axiosPost from "../../axios/axiosPost";
import { createPostTextInput } from "../../config/posts/createPostTextInput";
import { IFriend } from "../../store/types/friendsTypes";
import socket from "../../socketIo";

const initState: IUsePostsState = {
  postsLoading: false,
  postsErrorMsg: null,
  posts: [],
  createPostData: {
    modalShow: false,
    photoFiles: [],
    photoPreviews: [],
    photoDescriptions: [],
    taggs: [],
    textInput: createPostTextInput
  },
  postToEditId: null,
  postToDeleteId: null
};

export const usePosts = (): {
  postsLoading: boolean;
  postsErrorMsg: string | null;
  postToDeleteId: string | null;
  createPostData: IUsePostsState["createPostData"];
  posts: IPost[];
  onClearPostsError: () => void;
  onOpenCreatePostModal: () => void;
  onCloseCreatePostModal: () => void;
  onFocusCreatePostTextInput: () => void;
  onUnfocusCreatePostTextInput: () => void;
  onChangeCreatePostText: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onAddCreatePostPhotos: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeCreatePostPhotoDescription: (event: ChangeEvent<HTMLInputElement>, photoIndex: number) => void;
  onRemoveCreatePostPhoto: (photoIndex: number) => void;
  onAddCreatePostTaggs: (friends: IFriend[], checked: {[name: string]: boolean}) => void;
  onRemoveCreatePostTagg: (userId: string) => void;
  onCreatePost: FormEventHandler<HTMLFormElement>;
  onGetPosts: (url: string) => Promise<void>;
  onLoadPosts: (posts: IPost[]) => void;
  onPrepareDeletePost: (postToDeleteId: string) => void;
  onCancelDeletePost: () => void;
  onDeletePost: () => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onUnlikePost: (postId: string) => Promise<void>;
  onCommentOnPost: (
    postId: string,
    commentTextValue: string,
    commentPhoto: File | null,
    commentTaggs: {userId: string, userFullName: string}[]
  ) => Promise<void>;
  onDeletePostComment: (postId: string, commentId: string) => Promise<void>;
  onLikePostComment: (postId: string, commentId: string) => Promise<void>;
  onUnlikePostComment: (postId: string, commentId: string) => Promise<void>;
} => {
  const [state, dispatch] = useReducer(reducer, initState);

  const onClearPostsError = useCallback((): void => {
    dispatch({ type: UsePostsActionTypes.ON_CLEAR_POST_ERROR });
  }, []);

  // OPEN / CLOSE MODAL
  const onOpenCreatePostModal = useCallback((): void => {
    dispatch({ type: UsePostsActionTypes.ON_OPEN_POST_MODAL });
  }, []);

  const onCloseCreatePostModal = useCallback((): void => {
    dispatch({ type: UsePostsActionTypes.ON_CLOSE_POST_MODAL });
  }, []);
  //////////////////////////////////////////////////////////////////////////////////

  // CREATE POST INPUT TEXT FUNCTIONS
  const onFocusCreatePostTextInput = useCallback((): void => {
    dispatch({ type: UsePostsActionTypes.ON_FOCUS_CREATE_POST_TEXT_INPUT });
  }, []);

  const onUnfocusCreatePostTextInput = useCallback((): void => {
    dispatch({ type: UsePostsActionTypes.ON_UNFOCUS_CREATE_POST_TEXT_INPUT });
  }, []);

  const onChangeCreatePostText = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, _: string): void => {
    const target = event.target;

    dispatch({
      type: UsePostsActionTypes.ON_CHANGE_CREATE_POST_TEXT,
      postText: target.value
    });
  }, []);
  ///////////////////////////////////////////////////////////////////////////////

  // CREATE POST PHOTOS FUNCTIONS
  const onAddCreatePostPhotos = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;

    let photoFiles: File[] = [];
    let photoPreviews: string[] = [];
    let emptyDescs: string[] = [];

    if(target.files && target.files.length > 0) {
      photoFiles = Array.from(target.files);
      photoPreviews = Array.from(target.files).map(file => URL.createObjectURL(file));

      photoPreviews.forEach(_ => {
        emptyDescs.push("");
      });
    } else {
      photoFiles = [];
      photoPreviews = [];
      emptyDescs = [];
    }

    dispatch({
      type: UsePostsActionTypes.ON_ADD_CREATE_POST_PHOTOS,
      photoFiles,
      photoPreviews,
      photoDescriptions: emptyDescs
    });
  }, []);

  const onChangeCreatePostPhotoDescription = useCallback((event: ChangeEvent<HTMLInputElement>, photoIndex: number): void => {
    const target = event.target;

    dispatch({
      type: UsePostsActionTypes.ON_CHANGE_CREATE_POST_PHOTO_DESCRIPTION,
      photoIndex,
      descText: target.value
    });
  }, []);

  const onRemoveCreatePostPhoto = useCallback((photoIndex: number): void => {
    dispatch({
      type: UsePostsActionTypes.ON_REMOVE_CREATE_POST_PHOTO,
      photoIndex
    });
  }, []);
  ////////////////////////////////////////////////////////////////////////////

  // CREATE POST ADD / REMOVE TAGGS
  const onAddCreatePostTaggs = useCallback((friends: IFriend[], checked: {[name: string]: boolean}): void => {
    const taggs = friends.filter(friend => checked[friend.user._id] === true).map(friend => ({userId: friend.user._id, userFullName: friend.user.fullName}));
    dispatch({
      type: UsePostsActionTypes.ON_ADD_CREATE_POST_TAGGS,
      taggs
    });
  }, []);

  const onRemoveCreatePostTagg = useCallback((userId: string): void => {
    dispatch({
      type: UsePostsActionTypes.ON_REMOVE_CREATE_POST_TAGG,
      userId
    });
  }, []);
  /////////////////////////////////////////////////////////////////////////////

  // POST CRUD
  const onGetPosts = useCallback(async(url: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    dispatch({ type: UsePostsActionTypes.ON_POSTS_START });

    try {
      const { data } = await axiosPost.get<IGetPostsResponse>(`/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_GET_POSTS_SUCCESS,
        posts: data.posts
      });
      return;
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onLoadPosts = useCallback((posts: IPost[]): void => {
    dispatch({
      type: UsePostsActionTypes.ON_LOAD_POSTS_SUCCESS,
      posts
    });
  }, []);

  const onCreatePost = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if(
      state.createPostData.textInput.postText.value.trim().length === 0 
      && state.createPostData.photoFiles.length === 0
      && state.createPostData.taggs.length === 0
    ) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: "To create a post you must at least have text or photo or tagg someone."
      });

      return;
    }

    dispatch({ type: UsePostsActionTypes.ON_POSTS_START });
    
    const formData = new FormData();

    formData.append("text", state.createPostData.textInput.postText.value);

    if(state.createPostData.photoFiles.length > 0) {
      state.createPostData.photoFiles.forEach((file, i) => {
        formData.append(`photo_${i + 1}`, file);
      });
    }
    if(state.createPostData.taggs.length > 0) {
      const taggIds = state.createPostData.taggs.map(tagg => tagg.userId);
      formData.append("taggs", JSON.stringify(taggIds));
    }

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPost.post<ICreatePostResponse>("/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_CREATE_POST_SUCCESS,
        newPost: data.post
      });

      if(data.usersTaggedNotifications && data.usersTaggedNotifications.length > 0) {
        socket.emit("sendNotificationList", {notifications: data.usersTaggedNotifications});
      }
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.createPostData]);

  const onPrepareDeletePost = useCallback((postToDeleteId: string): void => {
    dispatch({
      type: UsePostsActionTypes.ON_PREPARE_DELETE_POST,
      postToDeleteId
    });
  }, []);

  const onCancelDeletePost = useCallback((): void => {
    dispatch({ type: UsePostsActionTypes.ON_CANCEL_DELETE_POST });
  }, []);

  const onDeletePost = useCallback(async(): Promise<void> => {
    if(!state.postToDeleteId) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: "Can't find post id. Try refreshing the page"
      });

      return;
    }

    const token = localStorage.getItem("socNetAppToken");

    dispatch({ type: UsePostsActionTypes.ON_POSTS_START });

    try {
      await axiosPost.delete(`/${state.postToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_DELETE_POST_SUCCESS,
        postToDeleteId: state.postToDeleteId
      });
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.postToDeleteId]);
  /////////////////////////////////////////////////////////////////////////////

  // POST LIKES 
  const onLikePost = useCallback(async(postId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPost.post<ILikePostResponse>("/like", {postId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_LIKE_POST_SUCCESS,
        postId,
        userLiked: data.userLiked
      });

      if(data.userNotification) {
        socket.emit("sendSingleNotification", {notification: data.userNotification});
      }
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onUnlikePost = useCallback(async(postId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPost.post<IUnlikePostResponse>("/unlike", {postId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_UNLIKE_POST_SUCCESS,
        postId,
        userUnlikedId: data.userUnlikedId
      });
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);
  //////////////////////////////////////////////////////////////////////////

  // POST COMMENTS
  const onCommentOnPost = useCallback(async(
    postId: string,
    commentTextValue: string,
    commentPhoto: File | null,
    commentTaggs: {userId: string, userFullName: string}[]
  ): Promise<void> => {
    if(
      commentTextValue.trim().length === 0
      && !commentPhoto
      && commentTaggs.length === 0
    ) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: "Comment must have at least text or photo or tagg"
      });
    }

    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("commentText", commentTextValue);
    if(commentPhoto) {
      formData.append("photo", commentPhoto);
    }
    
    formData.append("taggs", JSON.stringify(commentTaggs));

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPost.post<ICommentOnPostResponse>("/comment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_COMMENT_ON_POST_SUCCESS,
        postId,
        comment: data.comment
      });

      if(data.userNotification) {
        socket.emit("sendSingleNotification", {notification: data.userNotification});
      }

      if(data.commentTaggsNotifications && data.commentTaggsNotifications.length > 0) {
        socket.emit("sendNotificationList", {notifications: data.commentTaggsNotifications});
      }
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onDeletePostComment = useCallback(async(postId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      await axiosPost.delete(`/comment/${postId}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_DELETE_POST_COMMENT_SUCCESS,
        postId,
        commentId
      });
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onLikePostComment = useCallback(async(postId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPost.post<ILikePostResponse>("/comment/like", {postId, commentId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_LIKE_POST_COMMENT_SUCCESS,
        postId,
        commentId,
        userLiked: data.userLiked
      });

      if(data.userNotification) {
        socket.emit("sendSingleNotification", {notification: data.userNotification});
      }
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onUnlikePostComment = useCallback(async(postId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPost.post<IUnlikePostResponse>("/comment/unlike", {commentId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: UsePostsActionTypes.ON_UNLIKE_POST_COMMENT_SUCCESS,
        postId,
        commentId,
        userUnlikedId: data.userUnlikedId
      });
    } catch(error) {
      dispatch({
        type: UsePostsActionTypes.ON_POSTS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  //////////////////////////////////////////////////////////////////////////

  return {
    postsLoading: state.postsLoading,
    postsErrorMsg: state.postsErrorMsg,
    createPostData: state.createPostData,
    postToDeleteId: state.postToDeleteId,
    posts: state.posts,
    onClearPostsError,
    onOpenCreatePostModal,
    onCloseCreatePostModal,
    onFocusCreatePostTextInput,
    onUnfocusCreatePostTextInput,
    onChangeCreatePostText,
    onAddCreatePostPhotos,
    onChangeCreatePostPhotoDescription,
    onRemoveCreatePostPhoto,
    onAddCreatePostTaggs,
    onRemoveCreatePostTagg,
    onCreatePost,
    onGetPosts,
    onLoadPosts,
    onPrepareDeletePost,
    onCancelDeletePost,
    onDeletePost,
    onLikePost,
    onUnlikePost,
    onCommentOnPost,
    onDeletePostComment,
    onLikePostComment,
    onUnlikePostComment
  };
};