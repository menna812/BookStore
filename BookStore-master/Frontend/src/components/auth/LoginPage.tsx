import React, { useState } from "react";
import { validateLoginForm } from "../../utils/validation";
import { authService } from "../../services/authService";
import { useToast } from "../../context/ToastContext";

const LoginPage: React.FC<{ onSwitchToSignup: () => void }> = ({
  onSwitchToSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { showSuccess, showError } = useToast();

  const handleSubmit = async () => {
    setErrors({});

    // Frontend validation
    const validation = validateLoginForm(email, password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Show error toasts for validation
      if (validation.errors.email) {
        showError(validation.errors.email);
      }
      if (validation.errors.password) {
        showError(validation.errors.password);
      }
      return;
    }

    // Call backend API
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      // Store token
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", response.userId.toString());
      localStorage.setItem("userRole", response.role);

      // Show success toast
      showSuccess("Login successful! Redirecting...");
      
      // Redirect based on role after a short delay
      setTimeout(() => {
        if (response.role === 'admin') {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1000);

    } catch (error: any) {
      // Show error toast
      showError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="auth-form">
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
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      {/* Remember / Forgot */}
      <div className="remember-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          Remember me
        </label>
        <a className="forgot-link">Forgot password?</a>
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
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {/* Switch to Signup */}
      <div className="switch-link">
        Don't have an account?{" "}
        <span onClick={onSwitchToSignup} className="link-text">
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default LoginPage;