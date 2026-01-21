export const generateArray = size =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 20);
