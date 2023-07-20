export const getMonthDaysForInputOptions = (topNumber: number): string[] => {
  let days: string[] = [];
  for(let i = 1; i <= topNumber; i++) {
    days.push(i.toString());
  }

  return days;
};