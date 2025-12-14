import React, { useState } from "react";

const SignupPage: React.FC<{ onSwitchToLogin: () => void }> = ({
  onSwitchToLogin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "admin">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup:", { name, email, password, userType });
    alert(`Account created successfully as ${userType}!`);
  };

  return (
    <div className="auth-form">
      {/* Header: no logo, gradient title */}
      {/* Name */}
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
      </div>

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

      {/* Confirm Password */}
      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            👁️
          </button>
        </div>
      </div>
      {/* User Type */}
      <div className="form-group">
        <div className="radio-group">
          <label className="radio-circle-label">
            <input
              type="radio"
              name="userType"
              value="customer"
              checked={userType === "customer"}
              onChange={() => setUserType("customer")}
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
            />
            <span className="radio-circle"></span>
            Admin
          </label>
        </div>
      </div>
      {/* Submit */}
      <button className="submit-btn" onClick={handleSubmit}>
        Sign Up
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
