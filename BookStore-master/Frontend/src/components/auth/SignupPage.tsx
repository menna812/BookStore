import React, { useState } from "react";
import axios from "axios";
import { SignupData } from "../../types/auth";

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

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const signupData: SignupData = {
      firstname: firstname,
      lastname: lastname,
      email,
      password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        signupData
      );

      // Axios automatically parses JSON
      alert(`Account created successfully! Your ID: ${res.data.id}`);
      onSwitchToLogin(); // switch to login page after signup
    } catch (err: any) {
      if (err.response) {
        // server responded with status code outside 2xx
        alert("Signup error: " + err.response.data.message);
      } else {
        alert("Server error. Try again later.");
      }
    }
  };

  return (
    <div className="auth-form">
      {/* Header: no logo, gradient title */}
      {/* first Name */}
      <div className="form-group">
        <label className="form-label">First Name</label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            className="form-input"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="firstname"
          />
        </div>
      </div>

      {/* lastname */}
      <div className="form-group">
        <label className="form-label">Last Name</label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            className="form-input"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="lastname"
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
