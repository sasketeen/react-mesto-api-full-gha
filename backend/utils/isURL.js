module.exports.isURL = (link) => /https?:\/\/(www\.)?([-\w]+)(\.[a-zA-Z.]+)([-\w()@:%_+.~#?&//=]+)/gi.test(link);
