export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format(you@g.com)" };
  }

  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }

  return { isValid: true };
};

/**
 * Validate name (for signup)
 */
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: "Name can only contain letters and spaces" };
  }

  return { isValid: true };
};

/**
 * Validate phone number (optional)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
    return { isValid: false, error: "Invalid phone number" };
  }

  return { isValid: true };
};

/**
 * Validate login form
 */
export const validateLoginForm = (
  email: string,
  password: string
): { isValid: boolean; errors: { email?: string; password?: string } } => {
  const errors: { email?: string; password?: string } = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate signup form
 */
export const validateSignupForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
} => {
  const errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};