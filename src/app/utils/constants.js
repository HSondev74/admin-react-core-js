// So sánh Array
export const arraysEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.sort().toString() === b.sort().toString();
};

//check response code
export const isSuccessCode = (code) => code >= 200 && code < 300;
