import { FC, useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosPost from '../axios/axiosPost';
import { usePosts } from '../hooks/usePostsHook/usePosts';
import { IPost } from '../types/shared/post';
import SinglePost from '../components/Posts/SinglePost';
import Spinner from '../components/Shared/Spinner';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';

const SinglePostPage: FC = () => {
  const { postId } = useParams();

  const {
    postsLoading,
    postsErrorMsg,
    postToDeleteId,
    posts,
    onClearPostsError,
    onGetPosts,
    onPrepareDeletePost,
    onCancelDeletePost,
    onDeletePost,
    onLikePost,
    onUnlikePost,
    onCommentOnPost,
    onDeletePostComment,
    onLikePostComment,
    onUnlikePostComment
  } = usePosts();

  const location = useLocation();
  const [postErrorMsg, setPostErrorMsg] = useState<string | null>(null);

  const [deleteCommentInfo, setDeleteCommentInfo] = useState<{postId: string | null; commentId: string | null}>({
    postId: null,
    commentId: null
  });

  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

  useEffect(() => {
    if(location.state && location.state.commentId) {
      setHighlightedCommentId(location.state.commentId);
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      window.history.replaceState({}, document.title);
    };
  }, []);

  useEffect(() => {
    if(!postId) {
      setPostErrorMsg("Post not found");
    } else {
      onGetPosts(`${postId}`);
    }
  }, [postId, onGetPosts]);

  const clearPostErrorMsg = useCallback((): void => {
    setPostErrorMsg(null);
  }, []);

  // const onGetPost = useCallback(async(): Promise<void> => {
  //   if(!postId) return setPostErrorMsg("Post not found");

  //   const token = localStorage.getItem("socNetAppToken");

  //   setPostLoading(true);

  //   try {
  //     const { data } = await axiosPost.get(`/${postId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     console.log(data);
  //     setPost(data.post);
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  //   setPostLoading(false);
  // }, [postId]);

  // useEffect(() => {
  //   onGetPost();
  // }, [onGetPost]);

  const onCloseDeletePostCommentModal = useCallback((): void => {
    setDeleteCommentInfo({
      postId: null,
      commentId: null
    });
  }, []);

  const onPrepareDeletePostComment = useCallback((postId: string, commentId: string): void => {
    setDeleteCommentInfo({
      postId,
      commentId
    });
  }, []);

  const deletePostComment = useCallback(async(): Promise<void> => {
    if(deleteCommentInfo.postId && deleteCommentInfo.commentId) {
      await onDeletePostComment(deleteCommentInfo.postId, deleteCommentInfo.commentId);
      onCloseDeletePostCommentModal();
    } else {
      setPostErrorMsg("Post id not found");
    }
  }, [deleteCommentInfo.commentId, deleteCommentInfo.postId, onCloseDeletePostCommentModal, onDeletePostComment]);

  // const onCommentOnPost = useCallback(async( 
  //   postId: string,
  //   commentTextValue: string,
  //   commentPhoto: File | null,
  //   commentTaggs: {userId: string, userFullName: string}[]
  // ): Promise<void> => {
  //   const formData = new FormData();
  //   formData.append("postId", postId);
  //   formData.append("commentText", commentTextValue);
  //   if(commentPhoto) {
  //     formData.append("photo", commentPhoto);
  //   }
    
  //   formData.append("taggs", JSON.stringify(commentTaggs));

  //   const token = localStorage.getItem("socNetAppToken");

  //   try {
  //     const { data } = await axiosPost.post("/comment", formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data"
  //       }
  //     });
  //     console.log(data);
  //     setPost(prev => {
  //       if(!prev) return null
  //       return {
  //         ...prev,
  //         comments: [
  //           data.comment,
  //           ...prev.comments
  //         ]
  //       };
  //     });
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  // }, []);

  // const onDeletePostComment = useCallback(async(postId: string, commentId: string): Promise<void> => {
  //   const token = localStorage.getItem("socNetAppToken");

  //   try {
  //     await axiosPost.delete(`/comment/${postId}/${commentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     onCloseDeletePostCommentModal();
  //     setPost(prev => {
  //       if(!prev) return null
  //       return {
  //         ...prev,
  //         comments: prev.comments.filter(comment => comment._id !== commentId)
  //       };
  //     });
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  // }, [onCloseDeletePostCommentModal]);

  // const onLikePost = useCallback(async(postId: string): Promise<void> => {
  //   const token = localStorage.getItem("socNetAppToken");

  //   try {
  //     const { data } = await axiosPost.post("/like", {postId}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     console.log(data);
      

  //     setPost(prev => {
  //       if(!prev) return prev;
  //       return {
  //         ...prev,
  //         likes: [
  //           data.userLiked,
  //           ...prev.likes
  //         ]
  //       };
  //     });
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  // }, []);

  // const onUnlikePost = useCallback(async(postId: string): Promise<void> => {
  //   const token = localStorage.getItem("socNetAppToken");

  //   try {
  //     const { data } = await axiosPost.post("/unlike", {postId}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     setPost(prev => {
  //       if(!prev) return prev;
  //       return {
  //         ...prev,
  //         likes: prev.likes.filter(like => like._id !== data.userUnlikedId)
  //       };
  //     });
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  // }, []);

  // const onLikePostComment = useCallback(async(postId: string, commentId: string): Promise<void> => {
  //   const token = localStorage.getItem("socNetAppToken");

  //   try {
  //     const { data } = await axiosPost.post("/comment/like", {postId, commentId}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     setPost(prev => {
  //       if(!prev) return prev;

  //       const targetCommentIndex = prev.comments.findIndex(comment => comment._id === commentId);
  //       if(targetCommentIndex < 0) return prev;

  //       const copiedComments = [...prev.comments];
  //       copiedComments[targetCommentIndex].likes.unshift(data.userLiked);

  //       return {
  //         ...prev,
  //         comments: copiedComments
  //       };
  //     });
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  // }, []);

  // const onUnlikePostComment = useCallback(async(_: string, commentId: string): Promise<void> => {
  //   const token = localStorage.getItem("socNetAppToken");

  //   try {
  //     const { data } = await axiosPost.post("/comment/unlike", {commentId}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     setPost(prev => {
  //       if(!prev) return prev;

  //       const targetCommentIndex = prev.comments.findIndex(comment => comment._id === commentId);
  //       if(targetCommentIndex < 0) return prev;

  //       const copiedComments = [...prev.comments];

  //       const newCommentLikes = copiedComments[targetCommentIndex].likes.filter(like => like._id !== data.userUnlikedId);
  //       copiedComments[targetCommentIndex].likes = newCommentLikes;

  //       return {
  //         ...prev,
  //         comments: copiedComments
  //       };
  //     });
  //   } catch(error) {
  //     setPostErrorMsg((error as any).response.data.message);
  //   }
  // }, []);

  return (
    <>
      {(postErrorMsg !== null || postsErrorMsg !== null) && (
        <DefaultModal
          show={postErrorMsg !== null || postsErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={
            postErrorMsg ? postErrorMsg : postsErrorMsg ? postsErrorMsg : "Error unknown"
          }
          onClose={
            postErrorMsg
            ? clearPostErrorMsg
            : postsErrorMsg
            ? onClearPostsError
            : () => {return}
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="ok"
            onClick={
              postErrorMsg
              ? clearPostErrorMsg
              : postsErrorMsg
              ? onClearPostsError
              : () => {return}
            } />
        </DefaultModal>
      )}
      {((deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null) || postToDeleteId !== null) && (
        <DefaultModal
          show={((deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null) || postToDeleteId !== null)}
          isErrorModal={false}
          title="Prepairing to delete comment"
          text="Are you sure you want to delete this post's comment?"
          onClose={
            deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null
            ? onCloseDeletePostCommentModal
            : postToDeleteId !== null
            ? onCancelDeletePost
            : () => {return}
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={
              deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null
              ? onCloseDeletePostCommentModal
              : postToDeleteId !== null
              ? onCancelDeletePost
              : () => {return}
            } />
          <ModalBtn
            btnType="button"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={
              deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null
              ? deletePostComment
              : postToDeleteId !== null
              ? onDeletePost
              : () => {return}
            } />
        </DefaultModal>
      )}
      <main style={{margin: "2rem 0"}}>
        {
          postsLoading
          ? <Spinner />
          : posts === null || posts.length === 0
          ? <p style={{textAlign: "center", fontSize: "2rem"}}>No post found</p>
          : (
            <SinglePost
              post={posts[0]}
              highlightedCommentId={highlightedCommentId}
              onCommentOnPost={onCommentOnPost}
              onLikePost={onLikePost}
              onUnlikePost={onUnlikePost}
              onLikePostComment={onLikePostComment}
              onUnlikePostComment={onUnlikePostComment}
              onPrepareDeletePostComment={onPrepareDeletePostComment}
              onPrepareDeletePost={onPrepareDeletePost} />
          )
        }
        {/* {
          postsLoading
          ? <Spinner />
          : !postsLoading && posts.length > 0 && (
            <SinglePost
              post={posts[0]}
              highlightedCommentId={highlightedCommentId}
              onCommentOnPost={onCommentOnPost}
              onLikePost={onLikePost}
              onUnlikePost={onUnlikePost}
              onLikePostComment={onLikePostComment}
              onUnlikePostComment={onUnlikePostComment}
              onPrepareDeletePostComment={onPrepareDeletePostComment}
              onPrepareDeletePost={onPrepareDeletePost} />
          )
        } */}
      </main>
    </>
  );
};

export default SinglePostPage;