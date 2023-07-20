import { IForm } from "../types/formsAndInputs/form";

export const deepCloneInputs = (inputs: IForm["inputs"]): IForm["inputs"] => {
  let copiedInputs = {...inputs};
  for(const group in inputs) {
    copiedInputs = {
      ...inputs,
      [group]: {
        ...inputs[group]
      }
    };

    for(const input in inputs[group]) {
      copiedInputs[group] = {
        ...copiedInputs[group],
        [input]: {
          ...copiedInputs[group][input],
          attributes: {
            ...copiedInputs[group][input].attributes,
          },
          label: {
            ...copiedInputs[group][input].label
          },
          validation: {
            ...copiedInputs[group][input].validation
          }
        }
      };
    }
  }

  return copiedInputs;
};