import { ChangeEvent, FormEvent, FormEventHandler, useCallback, useReducer } from "react";
import { nameInput } from "../../config/profilePhotos/profileAlbumNameInput";
import reducer from "./usePhotosReducer";
import { IAddPhotosToAlbumResponse, ICommentOnPhotoResponse, ICreateAlbumResponse, IGetAlbumsResponse, ILikePhotoCommentResponse, ILikePhotoResponse, IPhotoAlbum, IUnlikePhotoCommentResponse, IUnlikePhotoResponse, IUsePhotosActionTypes, IUsePhotosState } from "./usePhotosTypes";
import axiosPhotoAlbum from "../../axios/axiosPhotoAlbum";
import socket from "../../socketIo";

const initState: IUsePhotosState = {
  photosLoading: false,
  photosErrorMsg: null,
  albums: [],
  selectedAlbum: null,
  albumModalInfo: {
    albumId: null,
    actionType: null,
    nameInput: {...nameInput},
    photoFiles: [],
    photoPreviews: [],
    photoDescriptions: [],
    modalFormValid: false
  },
  photoSliderInfo: {
    show: false,
    currentPhotoIndex: 0
  },
};

export const usePhotos = (): {
  photosLoading: boolean;
  photosErrorMsg: string | null;
  onClearPhotosError: () => void;
  albums: IPhotoAlbum[];
  selectedAlbum: IPhotoAlbum | null;
  albumModalInfo: IUsePhotosState["albumModalInfo"];
  photoSliderInfo: IUsePhotosState["photoSliderInfo"];
  onGetPhotoAlbums: (url: string) => Promise<void>;
  onSelectPhotoAlbum: (selectedAlbum: IPhotoAlbum) => void;
  onUnselectPhotoAlbum: () => void;
  onOpenPhotoAlbumModal: (albumId: string | null, actionType: "create" | "editName" | "addPhotos", targetAlbumName: string | null) => void;
  onClosePhotoAlbumModal: () => void;
  onPhotoAlbumModalInputNameFocused: () => void;
  onPhotoAlbumModalInputNameUnfocused: () => void;
  onPhotoAlbumModalInputNameChanged: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhotoAlbumModalUploadPhotos: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhotoAlbumModalRemovePhoto: (photoIndex: number) => void;
  onPhotoAlbumModalPhotoDescriptionChanged: (event: ChangeEvent<HTMLInputElement>, descIndex: number) => void;
  onCreatePhotoAlbum: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onEditAlbumName: FormEventHandler<HTMLFormElement>;
  onAddPhotosToAlbum: FormEventHandler<HTMLFormElement>;
  onDeletePhotoAlbum: (albumToDeleteId: string) => Promise<void>;
  onDeleteSinglePhotoFromPhotoAlbum: (photoId: string) => Promise<void>;
  onOpenPhotoSlider: (currentPhotoIndex: number) => void;
  onClosePhotoSlider: () => void;
  onSliderPrevPhoto: () => void;
  onSliderNextPhoto: () => void;
  onLikePhoto: (albumId: string, photoId: string) => Promise<void>;
  onUnlikePhoto: (albumId: string, photoId: string) => Promise<void>;
  onCommentOnPhoto: (
    albumId: string, 
    photoId: string,
    commentTextValue: string,
    commentPhoto: File | null,
    commentTaggs: {userId: string, userFullName: string}[]
  ) => Promise<void>;
  onDeletePhotoComment: (albumId: string, photoId: string, commentId: string) => Promise<void>;
  onLikePhotoComment: (albumId: string, photoId: string, commentId: string) => Promise<void>;
  onUnlikePhotoComment: (albumId: string, photoId: string, commentId: string) => Promise<void>;
  onChangePhotoDescription: (albumId: string, photoId: string, newDescriptionValue: string) => Promise<void>;
} => {
  const [state, dispatch] = useReducer(reducer, initState);

  const onClearPhotosError = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_CLEAR_PHOTOS_ERROR });
  }, []);

  const onGetPhotoAlbums = useCallback(async(url: string): Promise<void> => {
    dispatch({ type: IUsePhotosActionTypes.ON_PHOTOS_START });

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.get<IGetAlbumsResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      dispatch({
        type: IUsePhotosActionTypes.ON_GET_PHOTO_ALBUMS_SUCCESS,
        albums: data.photoAlbums
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  // ALBUM VIEWING
  const onSelectPhotoAlbum = useCallback((selectedAlbum: IPhotoAlbum): void => {
    dispatch({
      type: IUsePhotosActionTypes.ON_SELECT_PHOTO_ALBUM_SUCCESS,
      selectedAlbum
    });
  }, []);

  const onUnselectPhotoAlbum = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_UNSELECT_PHOTO_ALBUM_SUCCESS });
  }, []);

  /////////////////////////////////////////////////////////////////////////////////

  // ALBUM MODAL / ACTIONS
  const onOpenPhotoAlbumModal = useCallback((albumId: string | null, actionType: "create" | "editName" | "addPhotos", targetAlbumName: string | null): void => {
    if(!actionType) return;

    dispatch({
      type: IUsePhotosActionTypes.ON_OPEN_PHOTO_ALBUM_MODAL,
      albumId,
      actionType,
      targetAlbumName
    });
  }, []);

  const onClosePhotoAlbumModal = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_CLOSE_PHOTO_ALBUM_MODAL });
  }, []);

  const onPhotoAlbumModalInputNameFocused = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_FOCUSED });
  }, []);

  const onPhotoAlbumModalInputNameUnfocused = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_UNFOCUSED });
  }, []);

  const onPhotoAlbumModalInputNameChanged = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;

    dispatch({ 
      type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_CHANGED,
      inputValue: target.value 
    });
  }, []);

  const onPhotoAlbumModalUploadPhotos = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;

    let photoFiles: File[] = [];
    let photoPreviews: string[] = [];
    let emptyDescriptions: string[] = [];

    if(target.files && target.files.length > 0) {
      photoFiles = Array.from(target.files);
      photoPreviews = photoFiles.map(file => URL.createObjectURL(file));
      photoFiles.forEach(_ => {
        emptyDescriptions.push("");
      });
    }

    dispatch({
      type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_UPLOAD_PHOTOS,
      photoFiles,
      photoPreviews,
      photoDescriptions: emptyDescriptions
    });
  }, []);

  const onPhotoAlbumModalRemovePhoto = useCallback((photoIndex: number): void => {
    dispatch({
      type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_REMOVE_PHOTO,
      photoIndex
    });
  }, []);

  const onPhotoAlbumModalPhotoDescriptionChanged = useCallback((event: ChangeEvent<HTMLInputElement>, descIndex: number): void => {
    const target = event.target;

    dispatch({
      type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_PHOTO_DESCRIPTION_CHANGED,
      descIndex,
      descValue: target.value
    });
  }, []);
  /////////////////////////////////////////////////////////////////////////////////////////////

  // ALBUM / PHOTOS ASYNC
  const onCreatePhotoAlbum = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const token = localStorage.getItem("socNetAppToken");

    dispatch({ type: IUsePhotosActionTypes.ON_PHOTOS_START });

    const formData = new FormData();

    const albumName = state.albumModalInfo.nameInput.albumName.value;

    if(albumName.trim().length === 0) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Album name is required"
      });
    }

    formData.append("name", albumName);
    formData.append("photoDescriptions", JSON.stringify(state.albumModalInfo.photoDescriptions));

    if(state.albumModalInfo.photoFiles) {
      state.albumModalInfo.photoFiles.forEach((photo, i) => {
        formData.append(`photo_${i + 1}`, photo);
      });
    }
    try {
      const { data } = await axiosPhotoAlbum.post<ICreateAlbumResponse>("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      
      dispatch({
        type: IUsePhotosActionTypes.ON_CREATE_PHOTO_ALBUM_SUCCESS,
        photoAlbum: data.photoAlbum
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.albumModalInfo]);

  const onEditAlbumName = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const newName = state.albumModalInfo.nameInput.albumName.value;
    
    if(newName.trim().length === 0) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Album Name must have at least 1 character"
      });

      return;
    }

    let albumId: string | null = null;
    if(state.selectedAlbum) {
      albumId = state.selectedAlbum._id;
    } else {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Album not found. Try refreshing the page"
      });

      return;
    }

    dispatch({ type: IUsePhotosActionTypes.ON_PHOTOS_START });

    const token = localStorage.getItem("socNetAppToken");

    try {
      await axiosPhotoAlbum.post("/editAlbumName", {albumId, newName}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_EDIT_PHOTO_ALBUM_NAME_SUCCESS,
        albumId,
        newName
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.albumModalInfo.nameInput.albumName.value, state.selectedAlbum]);

  const onAddPhotosToAlbum = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    let albumId: string | null = null;
    if(state.albumModalInfo.albumId) {
      albumId = state.albumModalInfo.albumId;
    } else {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Album not found. Try refreshing the page"
      });

      return;
    }

    if(state.albumModalInfo.photoFiles.length === 0) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "No photos selected. Select photos to proceed"
      });

      return;
    }

    dispatch({ type: IUsePhotosActionTypes.ON_PHOTOS_START });

    const formData = new FormData();
    formData.append("albumId", state.albumModalInfo.albumId);
    formData.append("photoDescriptions", JSON.stringify(state.albumModalInfo.photoDescriptions));

    state.albumModalInfo.photoFiles.forEach((photo, i) => {
      formData.append(`photo_${i + 1}`, photo);
    });
    
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post<IAddPhotosToAlbumResponse>("/addPhotosToAlbum", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_ADD_PHOTOS_TO_PHOTO_ALBUM_SUCCESS,
        albumId: albumId,
        updatedPhotos: data.updatedPhotos
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.albumModalInfo.albumId, state.albumModalInfo.photoFiles, state.albumModalInfo.photoDescriptions]);

  const onDeletePhotoAlbum = useCallback(async(albumToDeleteId: string): Promise<void> => {
    if(!albumToDeleteId) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Album id not found. Try refreshing the page"
      });

      return;
    }

    const token = localStorage.getItem("socNetAppToken");

    dispatch({ type: IUsePhotosActionTypes.ON_PHOTOS_START });

    try {
      await axiosPhotoAlbum.delete(`/${albumToDeleteId}`, {
        headers : {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_DELETE_PHOTO_ALBUM_SUCCESS,
        albumToDeleteId
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onDeleteSinglePhotoFromPhotoAlbum = useCallback(async(photoId: string): Promise<void> => {
    dispatch({ type: IUsePhotosActionTypes.ON_PHOTOS_START });

    let albumId: string | null = null;

    if(state.selectedAlbum) {
      albumId = state.selectedAlbum._id;
    } else {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Album not found. Try refreshing the page"
      });

      return;
    }

    const token = localStorage.getItem("socNetAppToken");

    try {
      await axiosPhotoAlbum.delete(`/deletePhoto/${albumId}/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_DELETE_SINGLE_PHOTO_FROM_PHOTO_ALBUM_SUCCESS,
        albumId,
        photoId
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.selectedAlbum]);
  ///////////////////////////////////////////////////////////////////////

  // SLIDER STUFF
  const onOpenPhotoSlider = useCallback((currentPhotoIndex: number): void => {
    dispatch({
      type: IUsePhotosActionTypes.ON_OPEN_PHOTO_SLIDER,
      currentPhotoIndex
    });
  }, []);

  const onClosePhotoSlider = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_CLOSE_PHOTO_SLIDER });
  }, []);

  const onSliderPrevPhoto = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_SLIDER_PREV_PHOTO });
  }, []);

  const onSliderNextPhoto = useCallback((): void => {
    dispatch({ type: IUsePhotosActionTypes.ON_SLIDER_NEXT_PHOTO });
  }, []);
  /////////////////////////////////////////////////////////////////////////////

  // PHOTO LIKES / COMMENTS
  const onLikePhoto = useCallback(async(albumId: string, photoId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post<ILikePhotoResponse>("/photo/like", {
        albumId,
        photoId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_LIKE_PHOTO_SUCCESS,
        albumId,
        photoId,
        userLiked: data.userLiked
      });

      if(data.userNotification) {
        socket.emit("sendSingleNotification", {notification: data.userNotification});
      }
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onUnlikePhoto = useCallback(async(albumId: string, photoId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post<IUnlikePhotoResponse>("/photo/unlike", {
        albumId,
        photoId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_UNLIKE_PHOTO_SUCCESS,
        albumId,
        photoId,
        userUnlikedId: data.userUnlikedId
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onCommentOnPhoto = useCallback(async(
    albumId: string, 
    photoId: string,
    commentTextValue: string,
    commentPhoto: File | null,
    commentTaggs: {userId: string, userFullName: string}[]
  ): Promise<void> => {
    if(!albumId) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Can't locate photo album id. Try refreshing the page"
      });
      return;
    }
    if(commentTextValue.trim().length === 0 && !commentPhoto && commentTaggs.length === 0) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Comment requires at least text, photo or 1 tagged friend."
      });
      return;
    }

    if(!photoId) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Photo not found. Maybe it was deleted in the meantime. Try refreshing the page."
      });
      return;
    }
    const formData = new FormData();

    formData.append("albumId", albumId);
    formData.append("commentText", commentTextValue);
    formData.append("photoId", photoId);
    if(commentPhoto) {
      formData.append("commentPhoto", commentPhoto);
    }
    formData.append("taggs", JSON.stringify(commentTaggs));

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post<ICommentOnPhotoResponse>("/photoComment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_COMMENT_ON_PHOTO_SUCCESS,
        albumId,
        photoId,
        comment: data.newComment
      });

      if(data.userNotification) {
        socket.emit("sendSingleNotification", {notification: data.userNotification});
      }

      if(data.commentTaggsNotifications && data.commentTaggsNotifications.length > 0) {
        socket.emit("sendNotificationList", {notifications: data.commentTaggsNotifications});
      }
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onDeletePhotoComment = useCallback(async(albumId: string, photoId: string, commentId: string): Promise<void> => {
    if(
      !albumId
      || !photoId
      || !commentId
    ) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: "Comment not found. Try refreshing the page"
      });
      return;
    }

    const token = localStorage.getItem("socNetAppToken");

    try {
      await axiosPhotoAlbum.delete(`/photoComment/${albumId}/${photoId}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_DELETE_PHOTO_COMMENT_SUCCESS,
        albumId,
        photoId,
        commentId
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onLikePhotoComment = useCallback(async(albumId: string, photoId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post<ILikePhotoCommentResponse>("/photoCommentLike", {
        albumId,
        photoId,
        commentId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_LIKE_PHOTO_COMMENT_SUCCESS,
        albumId,
        photoId,
        commentId,
        userLiked: data.userLiked
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onUnlikePhotoComment = useCallback(async(albumId: string, photoId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosPhotoAlbum.post<IUnlikePhotoCommentResponse>("/photoCommentUnlike", {commentId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_UNLIKE_PHOTO_COMMENT_SUCCESS,
        albumId,
        photoId,
        commentId,
        userUnlikedId: data.userUnlikedId
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);

  const onChangePhotoDescription = useCallback(async(albumId: string, photoId: string, newDescriptionValue: string): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try { 
      await axiosPhotoAlbum.post("/photoDescriptionChange", {
        albumId,
        photoId,
        newDescription: newDescriptionValue
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch({
        type: IUsePhotosActionTypes.ON_CHANGE_PHOTO_DESCRIPTION_SUCCESS,
        albumId,
        photoId,
        newDescriptionValue
      });
    } catch(error) {
      dispatch({
        type: IUsePhotosActionTypes.ON_PHOTOS_ERROR,
        errorMsg: (error as any).response.data.message
      });
    }
  }, []);
  /////////////////////////////////////////////////////////////////////////////

  return {
    photosLoading: state.photosLoading,
    photosErrorMsg: state.photosErrorMsg,
    albums: state.albums,
    selectedAlbum: state.selectedAlbum,
    albumModalInfo: state.albumModalInfo,
    photoSliderInfo: state.photoSliderInfo,
    onClearPhotosError,
    onGetPhotoAlbums,
    onSelectPhotoAlbum,
    onUnselectPhotoAlbum,
    onOpenPhotoAlbumModal,
    onClosePhotoAlbumModal,
    onPhotoAlbumModalInputNameFocused,
    onPhotoAlbumModalInputNameUnfocused,
    onPhotoAlbumModalInputNameChanged,
    onPhotoAlbumModalUploadPhotos,
    onPhotoAlbumModalRemovePhoto,
    onPhotoAlbumModalPhotoDescriptionChanged,
    onCreatePhotoAlbum,
    onEditAlbumName,
    onAddPhotosToAlbum,
    onDeletePhotoAlbum,
    onDeleteSinglePhotoFromPhotoAlbum,
    onOpenPhotoSlider,
    onClosePhotoSlider,
    onSliderPrevPhoto,
    onSliderNextPhoto,
    onLikePhoto,
    onUnlikePhoto,
    onCommentOnPhoto,
    onDeletePhotoComment,
    onLikePhotoComment,
    onUnlikePhotoComment,
    onChangePhotoDescription
  };
};