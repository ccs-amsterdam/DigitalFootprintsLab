const transCommon = (term, t) => {
  if (term === null || term == null) return term;
  const lterm = term.toLowerCase();
  console.log(t("common.title"));
  const tterm = t(`common.${lterm}`, term);

  if (allUpper(term)) return tterm.toUpperCase();
  if (firstUpper(term)) return makeFirstUpper(tterm);
  console.log(tterm);
  return tterm;
};

const firstUpper = (word) => {
  return word.charAt(0) === word.charAt(0).toUpperCase();
};

const makeFirstUpper = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const allUpper = (word) => {
  return word === word.toUpperCase();
};

export default transCommon;
