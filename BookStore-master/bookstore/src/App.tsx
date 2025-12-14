import { useState } from "react";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import "./styles/auth.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login');

  const logoEmoji = "📖";
  const useImageLogo = false;
  const logoImageUrl = "";

  return (
    <div className="auth-page">
      {/* Left side: image */}
      <div className="auth-image-side">
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
          alt="Books"
        />
      </div>

      {/* Right side: login/signup container */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            {currentPage === 'login' ? (
              <>
                <div className="logo-icon">
                    <img 
                      src="\assets\images\logo.png"
                      alt="Booktopia Logo" 
                    />
                </div>
                <div className="auth-title gradient-title">Booktopia</div>
                <div className="logo-subtext">Your literary adventure awaits</div>
              </>
            ) : (
              <>
                <div className="auth-title gradient-title">Booktopia</div>
                <div className="logo-subtext">Create your account</div>
              </>
            )}
          </div>
          {/* Pages */}
          {currentPage === 'login' ? (
            <LoginPage onSwitchToSignup={() => setCurrentPage('signup')} />
          ) : (
            <SignupPage onSwitchToLogin={() => setCurrentPage('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
