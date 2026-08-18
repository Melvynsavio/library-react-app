const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanText = (value) =>
  typeof value === "string" ? value.trim() : "";

const isValidEmail = (value) => {
  const email = cleanText(value);
  return email.length <= 254 && EMAIL_PATTERN.test(email);
};

const isValidPhone = (value) => {
  const phone = cleanText(value);
  const digits = phone.replace(/\D/g, "");

  return (
    phone.length <= 25 &&
    /^[+()\d\s.-]+$/.test(phone) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
};

const isValidIsbn = (value) => {
  const isbn = cleanText(value).replace(/[\s-]/g, "").toUpperCase();

  if (/^\d{13}$/.test(isbn)) {
    const sum = isbn
      .slice(0, 12)
      .split("")
      .reduce(
        (total, digit, index) =>
          total + Number(digit) * (index % 2 === 0 ? 1 : 3),
        0
      );

    return (10 - (sum % 10)) % 10 === Number(isbn[12]);
  }

  if (/^\d{9}[\dX]$/.test(isbn)) {
    const sum = isbn.split("").reduce((total, character, index) => {
      const value = character === "X" ? 10 : Number(character);
      return total + value * (10 - index);
    }, 0);

    return sum % 11 === 0;
  }

  return false;
};

const isValidDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return date.toISOString().slice(0, 10) === value;
  }

  return true;
};

const pick = (source, allowedFields) =>
  allowedFields.reduce((result, field) => {
    if (source && Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }
    return result;
  }, {});

const sendValidationError = (res, errors) =>
  res.status(400).json({
    success: false,
    message: Object.values(errors)[0],
    errors,
  });

module.exports = {
  cleanText,
  isValidDate,
  isValidEmail,
  isValidIsbn,
  isValidPhone,
  pick,
  sendValidationError,
};
