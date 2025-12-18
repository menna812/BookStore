import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";  // ← Import AuthPage
import { ToastProvider } from "./context/ToastContext";
import { HomeProvider } from "./context/HomeContext";
import { HomePage } from "./pages/Homepage";
import { Header } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import "./styles/auth.css";
import "./styles/homepage.css";
import './styles/layout.css';

// Layout wrapper to conditionally show Header/Footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Don't show Header/Footer on auth pages
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';
  
  if (hideLayout) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <HomeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Use AuthPage for both login and signup */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
            </Routes>
          </Layout>
        </HomeProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}