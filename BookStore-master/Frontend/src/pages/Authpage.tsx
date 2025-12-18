import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginPage from "../components/auth/LoginPage";
import SignupPage from "../components/auth/SignupPage";

const AuthPage = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<"login" | "signup">("login");

  // Update the current page based on the route
  useEffect(() => {
    if (location.pathname === "/signup") {
      setCurrentPage("signup");
    } else {
      setCurrentPage("login");
    }
  }, [location.pathname]);

  return (
    <div className="auth-page">
      <div className="auth-image-side">
        <img
          src="/assets/images/books.png"
          alt="Books"
        />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-icon">
              <img src="/assets/images/logo.png" alt="Booktopia Logo" />
            </div>
            <div className="auth-title gradient-title">Booktopia</div>
            <div className="logo-subtext">
              {currentPage === "login"
                ? "Your literary adventure awaits"
                : "Create your account"}
            </div>
          </div>

          {currentPage === "login" ? (
            <LoginPage onSwitchToSignup={() => setCurrentPage("signup")} />
          ) : (
            <SignupPage onSwitchToLogin={() => setCurrentPage("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;