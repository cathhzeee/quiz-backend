function maskName(name) {
  if (!name) return '';

  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 2) return word;

      const firstChar = word[0];
      const lastChar = word[word.length - 1];
      const masked = '*'.repeat(word.length - 2);

      return firstChar + masked + lastChar;
    })
    .join(' ');
}

module.exports = {
  maskName,
};
