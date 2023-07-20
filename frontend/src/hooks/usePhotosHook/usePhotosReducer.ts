import { nameInput } from "../../config/profilePhotos/profileAlbumNameInput";
import { IUsePhotosState, IUsePhotosAction, IUsePhotosActionTypes } from "./usePhotosTypes";
import { deepCloneSelectedAlbum, updateAlbumsAfterAddingPhotosToAlbum, updateAlbumsAfterChangingAlbumName, updateAlbumsAfterChangingPhotoDescription, updateAlbumsAfterCommentingOnPhoto, updateAlbumsAfterDeleteingPhotoComment, updateAlbumsAfterDeletingSinglePhoto, updateAlbumsAfterLikingPhoto, updateAlbumsAfterLikingPhotoComment, updateAlbumsAfterUnlikingPhoto, updateAlbumsAfterUnlikingPhotoComment } from "./usePhotosUtils";

const resetAlbumModalInfo = {
  albumId: null,
  actionType: null,
  nameInput: {...nameInput},
  photoFiles: [],
  photoPreviews: [],
  photoDescriptions: [],
  modalFormValid: false
};

const reducer = (state: IUsePhotosState, action: IUsePhotosAction): IUsePhotosState => {
  switch(action.type) {
    case IUsePhotosActionTypes.ON_PHOTOS_START:
      return {
        ...state,
        photosLoading: true
      };
    case IUsePhotosActionTypes.ON_PHOTOS_ERROR:
      return {
        ...state,
        photosLoading: false,
        photosErrorMsg: action.errorMsg
      };
    case IUsePhotosActionTypes.ON_CLEAR_PHOTOS_ERROR:
      return {
        ...state,
        photosErrorMsg: null
      };
    case IUsePhotosActionTypes.ON_GET_PHOTO_ALBUMS_SUCCESS:
      return {
        ...state,
        photosLoading: false,
        albums: action.albums
      };
    case IUsePhotosActionTypes.ON_SELECT_PHOTO_ALBUM_SUCCESS:
      return {
        ...state,
        selectedAlbum: deepCloneSelectedAlbum(action.selectedAlbum)
      };
    case IUsePhotosActionTypes.ON_UNSELECT_PHOTO_ALBUM_SUCCESS:
      return {
        ...state,
        selectedAlbum: null
      };
    case IUsePhotosActionTypes.ON_OPEN_PHOTO_ALBUM_MODAL:
      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          albumId: action.albumId,
          actionType: action.actionType,
          nameInput: action.targetAlbumName ? {
            ...state.albumModalInfo.nameInput,
            albumName: {
              ...state.albumModalInfo.nameInput.albumName,
              value: action.targetAlbumName,
              valid: true,
              touched: true
            }
          } : state.albumModalInfo.nameInput,
          modalFormValid: action.targetAlbumName ? true : false
        }
      };
    case IUsePhotosActionTypes.ON_CLOSE_PHOTO_ALBUM_MODAL:
      return {
        ...state,
        albumModalInfo: resetAlbumModalInfo
      };
    case IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_FOCUSED:
      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          nameInput: {
            ...state.albumModalInfo.nameInput,
            albumName: {
              ...state.albumModalInfo.nameInput.albumName,
              focused: true,
              touched: true
            }
          }
        }
      };
    case IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_UNFOCUSED:
      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          nameInput: {
            ...state.albumModalInfo.nameInput,
            albumName: {
              ...state.albumModalInfo.nameInput.albumName,
              focused: false
            }
          }
        }
      };
    case IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_CHANGED:
      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          nameInput: {
            ...state.albumModalInfo.nameInput,
            albumName: {
              ...state.albumModalInfo.nameInput.albumName,
              value: action.inputValue,
              valid: action.inputValue.trim().length > 0
            }
          },
          modalFormValid: action.inputValue.trim().length > 0 || state.albumModalInfo.photoFiles.length > 0 ? true : false
        }
      };
    case IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_UPLOAD_PHOTOS:
      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          photoFiles: action.photoFiles,
          photoPreviews: action.photoPreviews,
          photoDescriptions: action.photoDescriptions,
          modalFormValid: state.albumModalInfo.nameInput.albumName.value.trim().length > 0 || action.photoFiles.length > 0 ? true : false
        }
      };
    case IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_REMOVE_PHOTO:
      let photoFilesUpdated = state.albumModalInfo.photoFiles.filter((_, i) => i !== action.photoIndex);

      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          photoFiles: photoFilesUpdated,
          photoPreviews: state.albumModalInfo.photoPreviews.filter((_, i) => i !== action.photoIndex),
          photoDescriptions: state.albumModalInfo.photoDescriptions.filter((_, i) => i !== action.photoIndex),
          modalFormValid: state.albumModalInfo.nameInput.albumName.value.trim().length > 0 || photoFilesUpdated.length > 0 ? true : false
        }
      };
    case IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_PHOTO_DESCRIPTION_CHANGED:
      const copiedDescriptions = [...state.albumModalInfo.photoDescriptions];
      copiedDescriptions[action.descIndex] = action.descValue;

      return {
        ...state,
        albumModalInfo: {
          ...state.albumModalInfo,
          photoDescriptions: copiedDescriptions
        }
      };
    case IUsePhotosActionTypes.ON_CREATE_PHOTO_ALBUM_SUCCESS:
      return {
        ...state,
        photosLoading: false,
        albums: [
          action.photoAlbum,
          ...state.albums
        ],
        albumModalInfo: resetAlbumModalInfo
      };
    case IUsePhotosActionTypes.ON_EDIT_PHOTO_ALBUM_NAME_SUCCESS:
      return {
        ...state,
        photosLoading: false,
        albums: updateAlbumsAfterChangingAlbumName(state.albums, action.albumId, action.newName),
        selectedAlbum: state.selectedAlbum ? {
          ...state.selectedAlbum,
          albumName: action.newName
        } : null,
        albumModalInfo: resetAlbumModalInfo
      };
    case IUsePhotosActionTypes.ON_ADD_PHOTOS_TO_PHOTO_ALBUM_SUCCESS:
      return {
        ...state,
        photosLoading: false,
        albums: updateAlbumsAfterAddingPhotosToAlbum(state.albums, action.albumId, action.updatedPhotos),
        selectedAlbum: state.selectedAlbum ? {
          ...state.selectedAlbum,
          photos: action.updatedPhotos
        } : null,
        albumModalInfo: resetAlbumModalInfo
      };
    case IUsePhotosActionTypes.ON_DELETE_PHOTO_ALBUM_SUCCESS:
      return {
        ...state,
        photosLoading: false,
        selectedAlbum: null,
        albums: state.albums.filter(album => album._id !== action.albumToDeleteId)
      };
    case IUsePhotosActionTypes.ON_DELETE_SINGLE_PHOTO_FROM_PHOTO_ALBUM_SUCCESS:
      return {
        ...state,
        photosLoading: false,
        selectedAlbum: state.selectedAlbum ? {
          ...state.selectedAlbum,
          photos: state.selectedAlbum.photos.filter(photo => photo._id !== action.photoId)
        }
        : null,
        albums: updateAlbumsAfterDeletingSinglePhoto(state.albums, action.albumId, action.photoId)
      };
    case IUsePhotosActionTypes.ON_LIKE_PHOTO_SUCCESS:
      const updateResult = updateAlbumsAfterLikingPhoto(state.albums, action.albumId, action.photoId, action.userLiked);
      return {
        ...state,
        albums: updateResult !== null ? updateResult.copiedAlbums : state.albums,
        selectedAlbum: state.selectedAlbum && updateResult !== null ? {
          ...state.selectedAlbum,
          photos: updateResult.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_UNLIKE_PHOTO_SUCCESS:
      const updatedResults = updateAlbumsAfterUnlikingPhoto(state.albums, action.albumId, action.photoId, action.userUnlikedId);

      return {
        ...state,
        albums: updatedResults !== null ? updatedResults.copiedAlbums : state.albums,
        selectedAlbum: state.selectedAlbum && updatedResults !== null ? {
          ...state.selectedAlbum,
          photos: updatedResults.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_COMMENT_ON_PHOTO_SUCCESS:
      const updatedState = updateAlbumsAfterCommentingOnPhoto(state.albums, action.albumId, action.photoId, action.comment);

      return {
        ...state,
        albums: updatedState !== null ? updatedState.copiedAlbums : state.albums,
        selectedAlbum: updatedState !== null && state.selectedAlbum ? {
          ...state.selectedAlbum,
          photos: updatedState.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_DELETE_PHOTO_COMMENT_SUCCESS:
      const afterUpdate = updateAlbumsAfterDeleteingPhotoComment(state.albums, action.albumId, action.photoId, action.commentId);

      return {
        ...state,
        albums: afterUpdate !== null ? afterUpdate.copiedAlbums : state.albums,
        selectedAlbum: state.selectedAlbum && afterUpdate !== null ? {
          ...state.selectedAlbum,
          photos: afterUpdate.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_LIKE_PHOTO_COMMENT_SUCCESS:
      const updated = updateAlbumsAfterLikingPhotoComment(state.albums, action.albumId, action.photoId, action.commentId, action.userLiked);

      return {
        ...state,
        albums: updated !== null ? updated.copiedAlbums : state.albums,
        selectedAlbum: updated !== null && state.selectedAlbum ? {
          ...state.selectedAlbum,
          photos: updated.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_UNLIKE_PHOTO_COMMENT_SUCCESS:
      const updatedSt = updateAlbumsAfterUnlikingPhotoComment(state.albums, action.albumId, action.photoId, action.commentId, action.userUnlikedId);

      return {
        ...state,
        albums: updatedSt !== null ? updatedSt.copiedAlbums : state.albums,
        selectedAlbum: updatedSt !== null && state.selectedAlbum ? {
          ...state.selectedAlbum,
          photos: updatedSt.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_CHANGE_PHOTO_DESCRIPTION_SUCCESS:
      const afterDescChanged = updateAlbumsAfterChangingPhotoDescription(state.albums, action.albumId, action.photoId, action.newDescriptionValue);

      return {
        ...state,
        albums: afterDescChanged !== null ? afterDescChanged.copiedAlbums : state.albums,
        selectedAlbum: afterDescChanged !== null && state.selectedAlbum ? {
          ...state.selectedAlbum,
          photos: afterDescChanged.newPhotos
        } : null
      };
    case IUsePhotosActionTypes.ON_OPEN_PHOTO_SLIDER:
      return {
        ...state,
        photoSliderInfo: {
          show: true,
          currentPhotoIndex: action.currentPhotoIndex
        }
      };
    case IUsePhotosActionTypes.ON_CLOSE_PHOTO_SLIDER:
      return {
        ...state,
        photoSliderInfo: {
          show: false,
          currentPhotoIndex: 0
        }
      };
    case IUsePhotosActionTypes.ON_SLIDER_PREV_PHOTO:
      return {
        ...state,
        photoSliderInfo: {
          ...state.photoSliderInfo,
          currentPhotoIndex: state.photoSliderInfo.currentPhotoIndex === 0 ? 0 : state.photoSliderInfo.currentPhotoIndex - 1
        }
      };
    case IUsePhotosActionTypes.ON_SLIDER_NEXT_PHOTO:
      return {
        ...state,
        photoSliderInfo: {
          ...state.photoSliderInfo,
          currentPhotoIndex: !state.selectedAlbum
            ? state.photoSliderInfo.currentPhotoIndex
            : state.photoSliderInfo.currentPhotoIndex === state.selectedAlbum.photos.length - 1
            ? state.photoSliderInfo.currentPhotoIndex
            : state.photoSliderInfo.currentPhotoIndex + 1
        }
      };
    default:
      return state
  }
};

export default reducer;