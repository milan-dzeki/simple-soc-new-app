export interface ISettingsPageModalState {
  show: boolean;
  actionType: "deleteAccount" | "deactivateAccount" | null;
  title: string;
  text: string;
  confirmBtnText: "delete" | "deactivate" | null;
}