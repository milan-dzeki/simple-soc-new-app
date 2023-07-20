export interface IHighSchool {
  name: string;
  country: string;
  state: string;
  city: string;
  status: "studying" | "finished" | string;
  graduateDate: Date;
}

export interface ICurrentResidence {
  country: string;
  state: string;
  city: string;
  from: Date;
}

export interface IPreviousResidence {
  _id: string;
  country: string;
  state: string;
  city: string;
  from: Date;
  to: Date;
} 

export interface ICollege {
  _id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  status: "studying" | "finished" | string;
  graduateDate: Date;
}

export interface IEducationOther {
  _id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  status: "studying" | "finished" | string;
  graduateDate: Date;
}

export interface ICurrentJob {
  _id: string;
  role: string;
  company: string;
  country: string;
  state: string;
  city: string;
  from: Date;
}

export interface IPreviousJob {
  _id: string;
  role: string;
  company: string;
  country: string;
  state: string;
  city: string;
  from: Date;
  to: Date;
}

export interface IProfile {
  currentResidence: ICurrentResidence;
  previousResidences: IPreviousResidence[];
  highSchool: IHighSchool;
  colleges: ICollege[];
  educationOther: IEducationOther[]; 
  jobs: ICurrentJob[];
  previousJobs: IPreviousJob[];
}

export interface IProfileResponseData {
  status: string;
  profile: IProfile;
}

export type IProfileInfoType = (
  "highSchool" |
  "currentResidence" |
  "previousResidences" |
  "colleges" |
  "educationOther" |
  "jobs" |
  "previousJobs"
);