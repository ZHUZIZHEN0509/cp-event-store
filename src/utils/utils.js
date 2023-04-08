const handleError = (errorMessage, error = TypeError) => {
  throw error(errorMessage);
};

const isObject = (obj) => {
  return obj !== null && typeof obj === "object";
};

module.exports = {
  handleError,
  isObject,
};
