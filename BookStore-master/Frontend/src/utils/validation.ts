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
    return {
      isValid: false,
      error: "Invalid email format (e.g., you@email.com)",
    };
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

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }

  return { isValid: true };
};

/**
 * Validate name (for signup)
 */
export const validateName = (
  name: string,
  fieldName: string = "Name"
): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`,
    };
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed 100 characters`,
    };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
};

/**
 * Validate phone number (optional)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: true }; // Phone is optional
  }

  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
    return { isValid: false, error: "Invalid phone number format" };
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
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  errors: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
} => {
  const errors: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  // Validate first name
  const firstnameValidation = validateName(firstname, "First name");
  if (!firstnameValidation.isValid) {
    errors.firstname = firstnameValidation.error;
  }

  // Validate last name
  const lastnameValidation = validateName(lastname, "Last name");
  if (!lastnameValidation.isValid) {
    errors.lastname = lastnameValidation.error;
  }

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  // Validate confirm password - this is the critical part
  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
