import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import CheckoutPage from "./pages/CheckoutPage";
import AllBooksPage from "./pages/AllBooksPage";
import AuthorBooksPage from "./pages/AuthorBooksPage";
import AllAuthorsPage from "./pages/AllAuthorsPage";
import { SearchBar } from "./components/search/SearchBar";
import SearchResultsPage from './components/search/SearchResultsPage';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from "./context/ToastContext";
import { HomeProvider } from "./context/HomeContext";
import { CartProvider } from "./context/CartContext";
import { HomePage } from "./pages/Homepage";
import { Header } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { AuthProvider } from './context/AuthContext';


import "./styles/auth.css";
import "./styles/homepage.css";
import "./styles/bookgallery.css";
import "./styles/allbooks.css";
import "./styles/authorbooks.css";
import "./styles/allauthors.css";
import "./styles/categoryicons.css";
import "./styles/layout.css";
import "./styles/cart.css";
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
      <Header /> {/* Cart is now integrated inside Header */}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <HomeProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<AllBooksPage />} />
                    <Route path="/authors" element={<AllAuthorsPage />} />
                    <Route path="/author/books" element={<AuthorBooksPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    {/* Use AuthPage for both login and signup */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    {/* Cart is now a sidebar, no separate route needed */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  </Routes>
                </Layout>
              </HomeProvider>
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter> 
    </ToastProvider>
  );
}