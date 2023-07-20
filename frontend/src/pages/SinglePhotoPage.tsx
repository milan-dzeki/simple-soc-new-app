import { FC, useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import axiosPhotoAlbum from '../axios/axiosPhotoAlbum';
import { IPhoto, IPhotoUser } from '../types/profilePages/photoAlbum';
import PageContainer from '../components/Shared/PageContainer';
import SinglePhoto from '../components/PhotosAndAlbums/SinglePhoto';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';

const SinglePhotoPage: FC = () => {
  const { albumId, photoId } = useParams();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoErrorMsg, setPhotoErrorMsg] = useState<string | null>(null);
  const [photoUser, setPhotoUser] = useState<IPhotoUser | null>(null);
  const [photo, setPhoto] = useState<IPhoto | null>(null);

  const [deleteCommentInfo, setDeleteCommentInfo] = useState<{
    albumId: string | null;
    photoId: null | string;
    commentId: string | null;
  }>({
    albumId: null,
    photoId: null,
    commentId: null
  });

  const onCloseDeleteCommentModal = (): void => {
    setDeleteCommentInfo({
      albumId: null,
      photoId: null,
      commentId: null
    });
  };

  const onGetPhoto = useCallback(async(): Promise<void> => {
    setPhotoLoading(true);
    if(!albumId || !photoId) {
      return setPhotoErrorMsg("Photo not found. Maybe it was deleted in the meantime.");
    }

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } =  await axiosPhotoAlbum.get<{status: string; photo: IPhoto; user: IPhotoUser}>(`/photo/${albumId}/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPhoto(data.photo);
      setPhotoUser(data.user);
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }

    setPhotoLoading(false);
  }, [albumId, photoId]);

  useEffect(() => {
    onGetPhoto();
  }, [onGetPhoto]);

  const onCommentOnPhoto = async(
    _: string,
    commentTextValue: string,
    commentPhoto: File | null,
    commentTaggs: {userId: string, userFullName: string}[]
  ): Promise<void> => {
    if(!albumId) {
      setPhotoErrorMsg("Can't locate photo album id. Try refreshing the page");
      return;
    }
    if(commentTextValue.trim().length === 0 && !commentPhoto && commentTaggs.length === 0) {
      setPhotoErrorMsg("Comment requires at least text, photo or 1 tagged friend.");
      return;
    }

    const formData = new FormData();

    formData.append("albumId", albumId);
    formData.append("commentText", commentTextValue);
    formData.append("photoId", photo!._id);
    if(commentPhoto) {
      formData.append("commentPhoto", commentPhoto);
    }
    formData.append("taggs", JSON.stringify(commentTaggs));

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post("/photoComment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(data);
      setPhoto(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          comments: [
            data.newComment,
            ...prev.comments
          ]
        };
      });
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }
  };

  const onPrepareDeletePhotoComment = useCallback((photoId: string, commentId: string): void => {
    if(!albumId) {
      setPhotoErrorMsg("Album not found. Try refreshing the page");
      return;
    }

    setDeleteCommentInfo({
      albumId: albumId,
      photoId,
      commentId
    });
  }, [albumId]);

  const onCancelDeletePhotoComment = useCallback((): void => {
    setDeleteCommentInfo({
      albumId: null,
      photoId: null,
      commentId: null
    });
  }, []);

  const onDeletePhotoComment = useCallback(async(): Promise<void> => {
    if(!deleteCommentInfo.albumId || !deleteCommentInfo.photoId || !deleteCommentInfo.commentId) {
      setPhotoErrorMsg("Comment not found. Try refreshing the page");
      return;
    }

    const token = localStorage.getItem("socNetAppToken");
    setPhotoLoading(true);
    try {
      await axiosPhotoAlbum.delete(`/photoComment/${deleteCommentInfo.albumId}/${deleteCommentInfo.photoId}/${deleteCommentInfo.commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPhoto(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.filter(comment => comment._id !== deleteCommentInfo.commentId)
        };
      });
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }
    setPhotoLoading(false);
    onCloseDeleteCommentModal();
  }, [deleteCommentInfo]);

  const onLikePhoto = async(): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post("/photo/like", {
        albumId: albumId,
        photoId: photo!._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPhoto(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          likes: [
            data.userLiked,
            ...prev.likes
          ]
        };
      });
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }
  };

  const onUnlikePhoto = async(): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post("/photo/unlike", {
        albumId: albumId,
        photoId: photo!._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPhoto(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          likes: prev.likes.filter(like => like._id !== data.userUnlikedId)
        };
      });
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }
  };

  const onLikePhotoComment = async(photoId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    console.log(commentId);
    

    try {
      const { data } = await axiosPhotoAlbum.post("/photoCommentLike", {
        albumId: albumId,
        photoId,
        commentId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      setPhoto(prev => {
        if(!prev) return prev;
        const targetCommentIndex = prev.comments.findIndex(comment => comment._id === commentId);
        if(targetCommentIndex < 0) return prev;

        const copiedComments = [...prev.comments];
        copiedComments[targetCommentIndex].likes.unshift(data.userLiked);

        return {
          ...prev,
          comments: copiedComments
        };
      });
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }
  };

  const onUnlikePhotoComment = async(_: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post("/photoCommentUnlike", {commentId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      setPhoto(prev => {
        if(!prev) return prev;

        const targetCommentIndex = prev.comments.findIndex(comment => comment._id === commentId);
        if(targetCommentIndex < 0) return prev;

        const copiedComments = [...prev.comments];
        const newCommentLikes = prev.comments[targetCommentIndex].likes.filter(like => like._id !== data.userUnlikedId);
        copiedComments[targetCommentIndex].likes = newCommentLikes;
        return {
          ...prev,
          comments: copiedComments
        };
      });
    } catch(error) {
      setPhotoErrorMsg((error as any).response.data.message);
    }
  };
  
  return (
    <>
      {deleteCommentInfo.albumId !== null && deleteCommentInfo.photoId !== null && deleteCommentInfo.commentId !== null && (
        <DefaultModal
          isErrorModal={false}
          show={deleteCommentInfo.albumId !== null && deleteCommentInfo.photoId !== null && deleteCommentInfo.commentId !== null}
          title="Prepairing to delete comment"
          text="Are you sure you want to delete this comment?"
          onClose={onCancelDeletePhotoComment}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={onCancelDeletePhotoComment} />
          <ModalBtn
            btnType="button"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={onDeletePhotoComment} />
        </DefaultModal>
      )}
      <PageContainer
        display="container__block"
        loading={photoLoading}
        width="big"
        hasPageTitle={false}>
        {
          photo && photoUser && (
            <SinglePhoto
              photo={photo}
              loading={photoLoading}
              photoUser={photoUser}
              onLikePhoto={onLikePhoto}
              onUnlikePhoto={onUnlikePhoto}
              onLikePhotoComment={onLikePhotoComment}
              onUnlikePhotoComment={onUnlikePhotoComment}
              onCommentOnPhoto={onCommentOnPhoto}
              onPrepareDeletePhotoComment={onPrepareDeletePhotoComment} />
          )
        }
      </PageContainer>
    </>
  );
};

export default SinglePhotoPage