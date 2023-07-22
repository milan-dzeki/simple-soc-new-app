import { FC, ChangeEventHandler, FormEvent, useState, useEffect } from 'react';
import styles from '../../styles/components/likesAndComments/likesAndCommentsContainer.module.scss';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
// types
import { IComment, IPhotoUser } from '../../types/profilePages/photoAlbum';
import { IFriend } from '../../store/types/friendsTypes';
// components
import TaggFriendsModal from '../Modals/TaggFriendsModal';
import FriendsAndUsersModal from '../Modals/FriendsAndUsersModal';
import SingleComment from './SingleComment';

interface Props {
  currentUserId?: string;
  itemId?: string;
  likes: IPhotoUser[];
  comments: IComment[];
  onSubmitComment: (itemId: string, commentTextValue: string, commentPhoto: File | null, commentTaggs: {
    userId: string;
    userFullName: string;
  }[]) => Promise<void>;
  onPrepareDeleteComment?: (itemId: string, commentId: string) => void;
  onLikeItem?: (itemId: string) => Promise<void>;
  onUnlikeItem?: (itemId: string) => Promise<void>;
  onLikeComment?: (itemId: string, commentId: string) => Promise<void>;
  onUnlikeComment?: (itemId: string, commentId: string) => Promise<void>;
  hideLikingOption?: boolean;
  hideCommentingOption?: boolean;
  highlightedCommentId?: string | null;
}

const LikesAndCommentsContainer: FC<Props> = (props) => {
  const { authUser } = useTypedSelector(state => state.auth);

  const [showComments, setShowComments] = useState(false);
  const [commentFormShow, setCommentFormShow] = useState(false);
  const [commentTextValue, setCommentTextValue] = useState("");
  const [commentPhoto, setCommentPhoto] = useState<File | null>(null);
  const [commentTaggs, setCommentTaggs] = useState<{userId: string; userFullName: string}[]>([]);
  const [friendsModalShow, setFriendsModalShow] = useState(false);
  const [likesModalShow, setLikesModalShow] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if(props.highlightedCommentId) {
      setShowComments(true);
    }
  }, [props.highlightedCommentId]);

  const isAuthUserInLikes = (): boolean => {
    return props.likes.find(like => like._id === authUser!._id!) !== undefined;
  };

  const onLikeOrUnlike = async(): Promise<void> => {
    setActionLoading(true);
    if(!isAuthUserInLikes()) {
      await props.onLikeItem!(props.itemId!);
    } else {
      await props.onUnlikeItem!(props.itemId!);
    }
    setActionLoading(false);
  };

  const onOpenFriendsTaggsModal = (): void => {
    setFriendsModalShow(true);
  };

  const onCloseFriendsTaggModal = (): void => {
    setFriendsModalShow(false);
  };

  const onToggleCommentFormShow = (): void => {
    if(props.hideCommentingOption) {
      setCommentFormShow(false);
      return;
    }
    setCommentFormShow(prev => !prev);
    setCommentTextValue("");
    setCommentPhoto(null);
    setCommentTaggs([]);
  };

  const onWriteCommentText: ChangeEventHandler<HTMLTextAreaElement> = (event): void => {
    const target = event.target;
    setCommentTextValue(target.value);
  };

  const onUploadCommentPhoto: ChangeEventHandler<HTMLInputElement> = (event): void => {
    const target = event.target;
    
    if(target.files && target.files.length > 0) {
      setCommentPhoto(target.files[0]);
    } else {
      setCommentPhoto(null);
    }
  };

  const onRemoveCommentPhoto = (): void => {
    setCommentPhoto(null);
  };

  const onSetCommentTaggs = (friends: IFriend[], checked: {[name: string]: boolean}): void => {
    const taggs = friends.filter(friend => checked[friend.user._id] === true).map(friend => ({userId: friend.user._id, userFullName: friend.user.fullName}));
    setCommentTaggs(taggs);
    setFriendsModalShow(false);
  };

  const onRemoveSingleTagg = (userId: string): void => {
    setCommentTaggs(prev => {
      return prev.filter(tagg => tagg.userId !== userId);
    });
  };

  const onSubmitComment = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionLoading(true);
    await props.onSubmitComment(props.itemId!, commentTextValue, commentPhoto, commentTaggs);
    onToggleCommentFormShow();
    setShowComments(true);
    setActionLoading(false);
  };

  return (
    <>
      {friendsModalShow && (
        <TaggFriendsModal
          show={friendsModalShow}
          onClose={onCloseFriendsTaggModal}
          taggs={commentTaggs}
          onSetTaggs={onSetCommentTaggs} />
      )}
      {likesModalShow && (
        <FriendsAndUsersModal
          show={likesModalShow}
          title="Users that like this"
          friends={props.likes || []}
          onClose={() => setLikesModalShow(false)} />
      )}
      <div className={styles.container}>
        <div className={styles.container__top}>
          <p className={`${styles.container__likes} ${props.likes.length === 0 ? styles.container__likes_empty : ""}`} onClick={props.likes.length > 0 ? () => setLikesModalShow(true) : () =>{return}}>
            {props.likes ? props.likes.length : 0} likes
          </p>
          <p className={styles.container__comments}>
            {props.comments.length} {props.comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
        <div className={styles.container__middle}>
          {!props.hideLikingOption && (
            <div 
              className={`${styles.container__like} ${isAuthUserInLikes() ? styles.container__like_me : ""}`}
              onClick={!actionLoading ? onLikeOrUnlike : () => {return}}>
              <span className={styles.container__like_icon}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg>
              </span>
              <span className={styles.container__like_text}>
                {isAuthUserInLikes() ? "Liked" : "like"}
              </span>
            </div>
          )}
          {!props.hideCommentingOption && (
            <button 
              type="button"
              className={styles.container__comment}
              onClick={onToggleCommentFormShow}>
              <span className={styles.container__comment_icon}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m13.771 9.123-1.399-1.398-3.869 3.864v1.398h1.398zM14.098 6l1.398 1.398-1.067 1.067-1.398-1.398z"></path><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path></svg>
              </span>
              <span className={styles.container__comment_text}>
                {
                  commentFormShow ? "hide comment form" : "write a comment"
                }
              </span>
            </button>
          )}
        </div>
        {commentFormShow && (
          <form onSubmit={!actionLoading ? onSubmitComment: (event) => {
            event.preventDefault();
            return;
          }}>
            <div className={styles.container__comment_input}>
              <textarea
                className={styles.container__comment_input_text} 
                placeholder="Write a comment..."
                value={commentTextValue}
                onChange={onWriteCommentText}  />
              <label htmlFor="commentPhoto" className={styles.container__comment_input_photo}>
                <span className={styles.container__comment_input_photo_icon}>
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </span>
                <span className={styles.container__comment_input_photo_text}>upload photo</span>
                <input 
                  type="file"
                  accept="image/*"
                  id="commentPhoto"
                  name="commentPhoto"
                  onChange={onUploadCommentPhoto} />
              </label>
              <div 
                className={styles.container__comment_input_tag}
                onClick={onOpenFriendsTaggsModal}>
                <span className={styles.container__comment_input_tag_icon}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path><path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path></svg>
                </span>
                <span className={styles.container__comment_input_tag_text}>
                  tag friends
                </span>
              </div>
            </div>
            {
              commentPhoto && (
                <div className={styles.container__comment_input_photo_preview}>
                  <div className={styles.container__comment_input_photo_preview_image}>
                    <img src={URL.createObjectURL(commentPhoto)} alt="commentPhoto" />
                  </div>
                  <button
                    type="button"
                    className={styles.container__comment_input_photo_preview_remove}
                    onClick={onRemoveCommentPhoto}>
                    remove photo
                  </button>
                </div>
              )
            }
            {
              commentTaggs.length > 0 && (
                <div className={styles.container__taggs}>
                  <p className={styles.container__taggs_title}>
                    tagged friends:
                  </p>
                  <div className={styles.container__taggs_list}>
                    {commentTaggs.map(friend => {
                      return (
                        <div className={styles.container__tagg} key={friend.userId}>
                          <p className={styles.container__tagg_name}>
                            {friend.userFullName}
                          </p>
                          <button
                            type="button"
                            className={styles.container__tagg_remove}
                            onClick={() => onRemoveSingleTagg(friend.userId)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            }
            <button
              type="submit"
              className={styles.container__comment_post}
              disabled={!commentTextValue.trim() && !commentPhoto && commentTaggs.length === 0}>
              post comment
            </button>
          </form>
        )}
        <div className={styles.container__comment_list}>
          <p className={styles.container__comment_list_title} onClick={() => setShowComments(prev => !prev)}>
            {showComments ? "Hide Comments" : "Show Comments"}
          </p>
          {
            showComments && (
              <div className={styles.container__comment_list_comments}>
                {
                  props.comments.length === 0
                  ? <p className={styles.container__comment_list_empty}>No comments</p>
                  : props.comments.map(comment => {
                    return (
                      <SingleComment
                        key={comment._id}
                        parentId={props.itemId!}
                        comment={comment}
                        onPrepareDeleteComment={props.onPrepareDeleteComment!}
                        onLikeComment={props.onLikeComment!}
                        onUnlikeComment={props.onUnlikeComment!}
                        highlightedCommentId={props.highlightedCommentId && props.highlightedCommentId === comment._id ? true : false} />
                    );
                  })
                }
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default LikesAndCommentsContainer;