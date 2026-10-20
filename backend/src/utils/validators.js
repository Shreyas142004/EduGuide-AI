const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validateScore = (score, maxScore = 100) => {
  const num = Number(score);
  return !isNaN(num) && num >= 0 && num <= Number(maxScore);
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

module.exports = {
  validateEmail,
  validateScore,
  sanitizeString,
};
