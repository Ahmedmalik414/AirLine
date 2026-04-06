export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validatePassport = (passport) => {
  return passport.length >= 6;
};

export const validateCreditCard = (cardNumber) => {
  const re = /^[0-9]{16}$/;
  return re.test(cardNumber.replace(/\s/g, ''));
};

export const validateExpiryDate = (expiry) => {
  const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!re.test(expiry)) return false;
  
  const [month, year] = expiry.split('/');
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  return expiryDate > now;
};

export const validateCVV = (cvv) => {
  const re = /^[0-9]{3,4}$/;
  return re.test(cvv);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};
