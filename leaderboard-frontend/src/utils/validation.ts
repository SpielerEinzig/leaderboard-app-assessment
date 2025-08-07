export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) {
    return "Username is required";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }

  if (username.length > 20) {
    return "Username must be less than 20 characters";
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  return null;
};

export const validateRequired = (
  value: string,
  fieldName: string
): string | null => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }

  return null;
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};
