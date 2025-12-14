import React, { useState } from "react";

const LoginPage: React.FC<{ onSwitchToSignup: () => void }> = ({
  onSwitchToSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log("Login:", { email, password, rememberMe });
    alert("Login successful!");
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
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </button>
        </div>
      </div>

      {/* Remember / Forgot */}
      <div className="remember-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <a className="forgot-link">Forgot password?</a>
      </div>

      {/* Submit */}
      <button className="submit-btn" onClick={handleSubmit}>
        Login
      </button>

      {/* Switch to Signup */}
      <div className="switch-link">
        Don’t have an account?{" "}
        <span onClick={onSwitchToSignup} className="link-text">
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
