export const removeUnderscoresBetweenWords = (text: string): string => {
  if(text.includes("_")) {
    return text.split("_").join(" ");
  }
  return text;
};