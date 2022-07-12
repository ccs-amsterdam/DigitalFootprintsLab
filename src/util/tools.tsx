export const urlParamString = (params) => {
  return Object.keys(params).reduce((str, param) => {
    if (params[param] === null) return str;
    str += str === "" ? "?" : "&";
    return (str += `${param}=${params[param]}`);
  }, "");
};
