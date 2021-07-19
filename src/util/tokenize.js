const tokenize = text => {
  return text.split(/\W+/).filter(token => {
    token = token.toLowerCase();
    if (token.length <= 1) return false;
    if (token === "and" || token === "or" || token === "not") return false;
    return true;
  });
};

export default tokenize;
