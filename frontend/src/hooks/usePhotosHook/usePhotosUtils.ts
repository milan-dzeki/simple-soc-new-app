import { IComment, IPhotoAlbum, IPhotoUser } from "./usePhotosTypes";

export const deepCloneSelectedAlbum = (selectedAlbum: IPhotoAlbum): IPhotoAlbum => {
  const copiedAlbum = {...selectedAlbum};
  const copiedAlbumPhotos = selectedAlbum.photos.map(photo => {
    return {
      ...photo,
      likes: photo.likes.map(like => ({...like})),
      comments: photo.comments.map(comment => ({...comment})),
      taggs: photo.taggs.map(tagg => ({...tagg}))
    };
  });
  
  copiedAlbum.photos = copiedAlbumPhotos;
  return copiedAlbum;
};

export const updateAlbumsAfterChangingAlbumName = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, newAlbumName: string): IPhotoAlbum[] => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return oldAlbums;

  copiedAlbums[targetAlbumIndex].albumName = newAlbumName;

  return copiedAlbums;
};

export const updateAlbumsAfterAddingPhotosToAlbum = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, updatedPhotos: IPhotoAlbum["photos"]): IPhotoAlbum[] => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return oldAlbums;

  copiedAlbums[targetAlbumIndex].photos = updatedPhotos;

  return copiedAlbums;
};

export const updateAlbumsAfterDeletingSinglePhoto = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string): IPhotoAlbum[] => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return oldAlbums;

  const newPhotos = copiedAlbums[targetAlbumIndex].photos.filter(photo => photo._id !== targetPhotoId);

  copiedAlbums[targetAlbumIndex].photos = newPhotos;

  return copiedAlbums;
};

export const updateAlbumsAfterLikingPhoto = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, userLiked: IPhotoUser): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null;

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetPhotoIndex === -1) return null;

  const newPhoto = {
    ...copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex]
  };

  const newPhotoLikes = [
    userLiked,
    ...newPhoto.likes
  ];

  newPhoto.likes = newPhotoLikes;

  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = newPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};

export const updateAlbumsAfterUnlikingPhoto = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, userUnlikedId: string): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetPhotoIndex === -1) return null;

  const newPhoto = {
    ...copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex]
  };

  const newPhotoLikes = newPhoto.likes.filter(user => user._id !== userUnlikedId);

  newPhoto.likes = newPhotoLikes;

  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = newPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};

export const updateAlbumsAfterCommentingOnPhoto = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, comment: IComment): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null;

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetPhotoIndex === -1) return null;

  const newPhoto = {
    ...copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex]
  };

  const newPhotoComments = [
    comment,
    ...newPhoto.comments
  ];

  newPhoto.comments = newPhotoComments;
  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = newPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};

export const updateAlbumsAfterDeleteingPhotoComment = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, commentId: string): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null;

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetPhotoIndex === -1) return null;

  const newPhoto = {
    ...copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex]
  };

  const newPhotoComments = newPhoto.comments.filter(comment => comment._id !== commentId);
  newPhoto.comments = newPhotoComments;

  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = newPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};

export const updateAlbumsAfterLikingPhotoComment = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, commentId: string, userLiked: IPhotoUser): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null;

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetAlbumIndex === -1) return null;
  
  const targetCommentIndex = copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex].comments.findIndex(comment => comment._id === commentId);
  if(targetCommentIndex === -1) return null;

  const newPhotos = [
    ...copiedAlbums[targetAlbumIndex].photos
  ];

  const updatedPhoto = {...newPhotos[targetPhotoIndex]};

  const newPhotoComments = [...updatedPhoto.comments];

  const updatedComment = {...newPhotoComments[targetCommentIndex]};
  const newPhotoCommentLikes = [
    userLiked,
    ...updatedComment.likes
  ];

  updatedComment.likes = newPhotoCommentLikes;
  updatedPhoto.comments[targetCommentIndex] = updatedComment;

  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = updatedPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};

export const updateAlbumsAfterUnlikingPhotoComment = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, commentId: string, userUnlikedId: string): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null;

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetAlbumIndex === -1) return null;
  
  const targetCommentIndex = copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex].comments.findIndex(comment => comment._id === commentId);
  if(targetCommentIndex === -1) return null;

  const newPhoto = {
    ...copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex]
  };

  const newPhotoComment = {...newPhoto.comments[targetCommentIndex]};
  const newPhotoCommentLikes = newPhotoComment.likes.filter(user => user._id !== userUnlikedId);

  newPhotoComment.likes = newPhotoCommentLikes;
  newPhoto.comments[targetCommentIndex] = newPhotoComment;

  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = newPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};

export const updateAlbumsAfterChangingPhotoDescription = (oldAlbums: IPhotoAlbum[], targetAlbumId: string, targetPhotoId: string, newPhotoDescription: string): {
  copiedAlbums: IPhotoAlbum[];
  newPhotos: IPhotoAlbum["photos"];
} | null => {
  const copiedAlbums = oldAlbums.map((album) => {
    return deepCloneSelectedAlbum(album);
  });

  const targetAlbumIndex = copiedAlbums.findIndex(album => album._id === targetAlbumId);
  if(targetAlbumIndex === -1) return null;

  const targetPhotoIndex = copiedAlbums[targetAlbumIndex].photos.findIndex(photo => photo._id === targetPhotoId);
  if(targetAlbumIndex === -1) return null;

  const newPhoto = {...copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex]};
  newPhoto.description = newPhotoDescription;
  copiedAlbums[targetAlbumIndex].photos[targetPhotoIndex] = newPhoto;

  return {
    copiedAlbums,
    newPhotos: copiedAlbums[targetAlbumIndex].photos
  };
};