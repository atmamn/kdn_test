// generate 6 random numbers that will be sent to the email address of the assumed user
export const generateRandomNumbers = () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
