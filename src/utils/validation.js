export const isValidEmail = (value) => {
  const email = value.trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (value) => {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");
  return (
    phone.length <= 25 &&
    /^[+()\d\s.-]+$/.test(phone) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
};

export const isValidIsbn = (value) => {
  const isbn = value.trim().replace(/[\s-]/g, "").toUpperCase();

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
      const digit = character === "X" ? 10 : Number(character);
      return total + digit * (10 - index);
    }, 0);
    return sum % 11 === 0;
  }

  return false;
};

export const validatePassword = (password) => {
  if (password.length < 8 || password.length > 72) {
    return "Password must be between 8 and 72 characters";
  }
  if (!/[a-z]/.test(password)) return "Password needs a lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password needs an uppercase letter";
  if (!/\d/.test(password)) return "Password needs a number";
  return "";
};
