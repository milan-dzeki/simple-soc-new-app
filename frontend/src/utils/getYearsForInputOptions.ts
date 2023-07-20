export const getYearsForInputOptions = (): string[] => {
  const yearNow = new Date().getFullYear();

  let years: string[] = [];
  for(let i = yearNow; i >= 1900; i--) {
    years.push(i.toString());
  }

  return years;
};