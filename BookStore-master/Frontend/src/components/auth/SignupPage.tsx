import React, { useState } from "react";
import axios from "axios";
import { validateSignupForm } from "../../utils/validation";
import { useToast } from "../../context/ToastContext";

const SignupPage: React.FC<{ onSwitchToLogin: () => void }> = ({
  onSwitchToLogin,
}) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "admin">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form using the utility function
    const validation = validateSignupForm(
      firstname,
      lastname,
      email,
      password,
      confirmPassword
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Show first error as toast
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        showError(firstError);
      }
      return;
    }

    // Prepare signup data
    const signupData = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    console.log("Signup data:", signupData); // Debug log

    // Determine the endpoint based on user type
    const endpoint =
      userType === "customer"
        ? "http://localhost:3000/api/auth/register"
        : "http://localhost:3000/api/admin/register";

    setIsLoading(true);
    try {
      const res = await axios.post(endpoint, signupData);

      console.log("Signup response:", res.data); // Debug log

      // Show success toast
      showSuccess(
        `${
          userType === "customer" ? "Customer" : "Admin"
        } account created successfully!`
      );

      // Clear form
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("customer");

      // Redirect to login after a short delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (err: any) {
      console.error("Signup error:", err); // Debug log

      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data.message || "Signup failed";
        showError(errorMessage);

        // If email already exists, highlight email field
        if (errorMessage.toLowerCase().includes("email")) {
          setErrors({ email: errorMessage });
        }
      } else if (err.request) {
        // Request made but no response
        showError("Cannot connect to server. Please check your connection.");
      } else {
        // Something else happened
        showError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="auth-form">
      {/* First Name */}
      <div className="form-group">
        <label className="form-label">First Name</label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            className={`form-input ${errors.firstname ? "error" : ""}`}
            value={firstname}
            onChange={(e) => {
              setFirstname(e.target.value);
              if (errors.firstname) {
                setErrors({ ...errors, firstname: undefined });
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="first Name"
            disabled={isLoading}
          />
        </div>
        {errors.firstname && (
          <span className="error-text">{errors.firstname}</span>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label className="form-label">Last Name</label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            className={`form-input ${errors.lastname ? "error" : ""}`}
            value={lastname}
            onChange={(e) => {
              setLastname(e.target.value);
              if (errors.lastname) {
                setErrors({ ...errors, lastname: undefined });
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Last name"
            disabled={isLoading}
          />
        </div>
        {errors.lastname && (
          <span className="error-text">{errors.lastname}</span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <div className="input-wrapper">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            className={`form-input ${errors.email ? "error" : ""}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-input ${errors.password ? "error" : ""}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`form-input ${errors.confirmPassword ? "error" : ""}`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error-text">{errors.confirmPassword}</span>
        )}
      </div>

      {/* User Type */}
      <div className="form-group">
        <label className="form-label">Account Type</label>
        <div className="radio-group">
          <label className="radio-circle-label">
            <input
              type="radio"
              name="userType"
              value="customer"
              checked={userType === "customer"}
              onChange={() => setUserType("customer")}
              disabled={isLoading}
            />
            <span className="radio-circle"></span>
            Customer
          </label>

          <label className="radio-circle-label">
            <input
              type="radio"
              name="userType"
              value="admin"
              checked={userType === "admin"}
              onChange={() => setUserType("admin")}
              disabled={isLoading}
            />
            <span className="radio-circle"></span>
            Admin
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Creating account...
          </>
        ) : (
          "Sign Up"
        )}
      </button>

      {/* Switch to Login */}
      <div className="switch-link">
        Already have an account?{" "}
        <span onClick={onSwitchToLogin} className="link-text">
          Login
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
