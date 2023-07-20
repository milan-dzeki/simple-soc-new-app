import { IUsePostsState, UsePostsAction, UsePostsActionTypes } from "./usePostsTypes";
import { createPostTextInput } from "../../config/posts/createPostTextInput";
// utils
import { 
  updatePostsAfterCommentDeletion,
  updatePostsAfterCommenting,
  updatePostsAfterLiking, updatePostsAfterLikingComment, updatePostsAfterUniking, updatePostsAfterUnlikingComment
} from './usePostsUtils';

const reducer = (state: IUsePostsState, action: UsePostsAction): IUsePostsState => {
  switch(action.type) {
    case UsePostsActionTypes.ON_POSTS_START:
      return {
        ...state,
        postsLoading: true
      };
    case UsePostsActionTypes.ON_POSTS_ERROR:
      return {
        ...state,
        postsLoading: false,
        postsErrorMsg: action.errorMsg
      };
    case UsePostsActionTypes.ON_CLEAR_POST_ERROR:
      return {
        ...state,
        postsErrorMsg: null
      };
    case UsePostsActionTypes.ON_OPEN_POST_MODAL:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          modalShow: true
        }
      };
    case UsePostsActionTypes.ON_CLOSE_POST_MODAL:
      return {
        ...state,
        createPostData: {
          modalShow: false,
          textInput: createPostTextInput,
          photoFiles: [],
          photoPreviews: [],
          photoDescriptions: [],
          taggs: []
        }
      };
    case UsePostsActionTypes.ON_FOCUS_CREATE_POST_TEXT_INPUT:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          textInput: {
            ...state.createPostData.textInput,
            postText: {
              ...state.createPostData.textInput.postText,
              focused: true,
              touched: true
            }
          }
        }
      };
    case UsePostsActionTypes.ON_UNFOCUS_CREATE_POST_TEXT_INPUT:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          textInput: {
            ...state.createPostData.textInput,
            postText: {
              ...state.createPostData.textInput.postText,
              focused: false
            }
          }
        }
      };
    case UsePostsActionTypes.ON_CHANGE_CREATE_POST_TEXT:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          textInput: {
            ...state.createPostData.textInput,
            postText: {
              ...state.createPostData.textInput.postText,
              value: action.postText
            }
          }
        }
      };
    case UsePostsActionTypes.ON_ADD_CREATE_POST_PHOTOS:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          photoFiles: action.photoFiles,
          photoPreviews: action.photoPreviews
        }
      };
    case UsePostsActionTypes.ON_CHANGE_CREATE_POST_PHOTO_DESCRIPTION:
      const copiedDescs = [...state.createPostData.photoDescriptions];
      copiedDescs[action.photoIndex] = action.descText;

      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          photoDescriptions: copiedDescs
        }
      };
    case UsePostsActionTypes.ON_REMOVE_CREATE_POST_PHOTO:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          photoPreviews: state.createPostData.photoPreviews.filter((_, i) => action.photoIndex !== i),
          photoFiles: state.createPostData.photoFiles.filter((_, i) => action.photoIndex !== i),
          photoDescriptions: state.createPostData.photoDescriptions.filter((_, i) => action.photoIndex !== i)
        }
      };
    case UsePostsActionTypes.ON_ADD_CREATE_POST_TAGGS:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          taggs: action.taggs
        }
      };
    case UsePostsActionTypes.ON_REMOVE_CREATE_POST_TAGG:
      return {
        ...state,
        createPostData: {
          ...state.createPostData,
          taggs: state.createPostData.taggs.filter(tagg => tagg.userId !== action.userId)
        }
      };
    case UsePostsActionTypes.ON_CREATE_POST_SUCCESS:
      return {
        ...state,
        postsLoading: false,
        posts: [
          action.newPost,
          ...state.posts
        ],
        createPostData: {
          modalShow: false,
          textInput: {...createPostTextInput},
          photoFiles: [],
          photoPreviews: [],
          photoDescriptions: [],
          taggs: []
        }
      };
    case UsePostsActionTypes.ON_GET_POSTS_SUCCESS:
      return {
        ...state,
        postsLoading: false,
        posts: action.posts
      };
    case UsePostsActionTypes.ON_LOAD_POSTS_SUCCESS:
      return {
        ...state,
        postsLoading: false,
        posts: action.posts
      };
    case UsePostsActionTypes.ON_PREPARE_DELETE_POST:
      return {
        ...state,
        postToDeleteId: action.postToDeleteId
      };
    case UsePostsActionTypes.ON_CANCEL_DELETE_POST:
      return {
        ...state,
        postToDeleteId: null
      };
    case UsePostsActionTypes.ON_DELETE_POST_SUCCESS:
      return {
        ...state,
        postsLoading: false,
        posts: state.posts.filter(post => post._id !== action.postToDeleteId),
        postToDeleteId: null
      };
    case UsePostsActionTypes.ON_LIKE_POST_SUCCESS:
      return {
        ...state,
        posts: updatePostsAfterLiking(state.posts, action.postId, action.userLiked)
      };
    case UsePostsActionTypes.ON_UNLIKE_POST_SUCCESS:
      return {
        ...state,
        posts: updatePostsAfterUniking(state.posts, action.postId, action.userUnlikedId)
      };
    case UsePostsActionTypes.ON_COMMENT_ON_POST_SUCCESS:
      return {
        ...state,
        posts: updatePostsAfterCommenting(state.posts, action.postId, action.comment)
      };
    case UsePostsActionTypes.ON_DELETE_POST_COMMENT_SUCCESS:
      return {
        ...state,
        posts: updatePostsAfterCommentDeletion(state.posts, action.postId, action.commentId)
      };
    case UsePostsActionTypes.ON_LIKE_POST_COMMENT_SUCCESS:
      return {
        ...state,
        posts: updatePostsAfterLikingComment(state.posts, action.postId, action.commentId, action.userLiked)
      };
    case UsePostsActionTypes.ON_UNLIKE_POST_COMMENT_SUCCESS:
      return {
        ...state,
        posts: updatePostsAfterUnlikingComment(state.posts, action.postId, action.commentId, action.userUnlikedId)
      };
    default:
      return state;
  }
};

export default reducer;