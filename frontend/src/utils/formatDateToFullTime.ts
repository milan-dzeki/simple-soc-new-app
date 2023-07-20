import { allMonths } from "../config/datesStuff/months";

export const formatDateToFullTime = (date: Date): string => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
  let hours: number | string = new Date(date).getHours();
  let minutes: number | string = new Date(date).getMinutes();

  let formatedDate = `${day.toString()}th`;
  if(formatedDate.endsWith("1")) {
    formatedDate = `${formatedDate}st`;
  } else if(formatedDate.endsWith("2")) {
    formatedDate = `${formatedDate}st`;
  } else if(formatedDate.endsWith("3")) {
    formatedDate = `${formatedDate}rd`;
  }

  if(hours < 9) {
    hours = `0${hours}`;
  }
  if(minutes < 9) {
    minutes = `0${minutes}`;
  }

  return `${allMonths[month]}, ${formatedDate} ${year}, ${hours}:${minutes}`;
};