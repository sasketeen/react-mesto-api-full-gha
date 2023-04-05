const urlRegExp = /https?:\/\/(www\.)?([-\w]+)(\.[a-zA-Z.]+)([-\w()@:%_+.~#?&//=]+)/;
const isURL = (link) => urlRegExp.test(link);

module.exports = {
  isURL,
  urlRegExp,
};
