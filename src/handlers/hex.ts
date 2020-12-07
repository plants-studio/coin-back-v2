export default (str: string) => {
  let result = '';
  for (let i = 0; i < str.length; i += 1) {
    result += str.charCodeAt(i);
  }
  return Number.parseInt(result, 10);
};
