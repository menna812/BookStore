import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import CheckoutPage from "./pages/CheckoutPage";
import AllBooksPage from "./pages/AllBooksPage";
import { ToastProvider } from "./context/ToastContext";
import { HomeProvider } from "./context/HomeContext";
import { HomePage } from "./pages/Homepage";
import { Header } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";

import "./styles/auth.css";
import "./styles/homepage.css";
import "./styles/bookgallery.css";
import "./styles/allbooks.css";
import "./styles/categoryicons.css";
import "./styles/layout.css";
import AdminDashboard from "./pages/AdminDashBoardPage";

// Layout wrapper to conditionally show Header/Footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Don't show Header/Footer on auth pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

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
              <Route path="/books" element={<AllBooksPage />} />
              {/* Use AuthPage for both login and signup */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </HomeProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}
