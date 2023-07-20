export interface IPhotoUser {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
}

export interface IComment {
  _id: string;
  commentator: IPhotoUser;
  text: string;
  photoId: string;
  photo?: {
    secure_url: string;
    public_id: string;
  };
  likes: IPhotoUser[];
  taggs: {
    userId: string;
    userFullName: string;
  }[];
  createdAt: Date;
  updatedAt: string;
}

export interface IPhoto {
  _id: string;
  description: string;
  photo: {
    secure_url: string;
    public_id: string;
  };
  likes: IPhotoUser[];
  comments: IComment[];
  taggs: {
    userId: string;
    userFullName: string;
  }[];
  post?: string;
  createdAt: Date;
}

export interface IPhotoAlbum {
  _id: string;
  albumName: string;
  user: string;
  photos: IPhoto[];
}