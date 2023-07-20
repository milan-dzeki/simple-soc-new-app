import { allMonths } from "../config/datesStuff/months";

export const formatDateToYearMonthAndDay = (date: Date): string => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();

  let formatedDate = `${day.toString()}th`;
  if(formatedDate.endsWith("1")) {
    formatedDate = `${formatedDate}st`;
  } else if(formatedDate.endsWith("2")) {
    formatedDate = `${formatedDate}st`;
  } else if(formatedDate.endsWith("3")) {
    formatedDate = `${formatedDate}rd`;
  }

  return `${allMonths[month]}, ${formatedDate} ${year}`;
};