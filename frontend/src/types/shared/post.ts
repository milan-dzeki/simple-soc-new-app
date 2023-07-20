export interface IPostUser {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
}

export interface IComment {
  _id: string;
  commentator: IPostUser;
  text: string;
  photoId: string;
  photo?: {
    secure_url: string;
    public_id: string;
  };
  likes: IPostUser[];
  taggs: {
    _id: string;
    userId: string;
    userFullName: string;
  }[];
  createdAt: Date;
  updatedAt: string;
}

export interface IPostPhoto {
  _id: string;
  albumId: string;
  photo: {
    secure_url: string;
    public_id: string;
  };
  decription: string;
  taggs: {
    _id: string;
    userId: string;
    fullName: string;
  }[];
  likes: any;
  comments: IComment[];
}

export interface IPost {
  _id: string;
  user: IPostUser;
  text: string;
  photos: IPostPhoto[];
  taggs: {
    _id: string;
    fullName: string;
  }[];
  likes: IPostUser[];
  comments: IComment[];
  createdAt: Date;
}

export interface ICreatePostData {
  modalShow: boolean;
  photoFiles: File[];
  photoPreviews: string[];
  photoDescriptions: string[];
  taggs: {
    userId: string; 
    userFullName: string
  }[];
}