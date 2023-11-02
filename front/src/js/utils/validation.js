const isValidPassword = (password) => {
  const validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  return validPasswordPattern.test(password);
};

export default isValidPassword;
