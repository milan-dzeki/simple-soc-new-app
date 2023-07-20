export type IFormModalType = "editInfo" | "addCurrJob" | "editCurrJob" | "addPrevJob" | "editPrevJob" | "addOrEditHighSchool" | "addCollege" | "editCollege" | "addEduOther" | "editEduOther" | "addOrEditCurrRes" | "addPrevRes" | "editPrevRes" | "";

export interface IFormModalInfo {
  show: boolean;
  formTitle: string;
  formType: IFormModalType;
  itemId?: string | null;
}