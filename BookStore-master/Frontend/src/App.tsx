import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import CheckoutPage from "./pages/CheckoutPage";
import AllBooksPage from "./pages/AllBooksPage";
import AuthorBooksPage from "./pages/AuthorBooksPage";
import AllAuthorsPage from "./pages/AllAuthorsPage";
import { SearchBar } from "./components/search/SearchBar";
import SearchResultsPage from "./components/search/SearchResultsPage";
import { SearchProvider } from "./context/SearchContext";
import { ToastProvider } from "./context/ToastContext";
import { HomeProvider } from "./context/HomeContext";
import { CartProvider } from "./context/CartContext";
import { HomePage } from "./pages/Homepage";
import { Header } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoute, ProtectedRoute } from "./components/auth/ProtectedRoute";
import { BookDetailsPage } from "./pages/BookDetailsPage";
import OrdersHistoryPage from "./pages/OrdersHistoryPage";

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
import ProfilePage from "./pages/ProfilePage";
import { useState } from "react";


// Layout wrapper to conditionally show Header/Footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  // Don't show Header/Footer on auth pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup" || isAdminPage;

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
  const [isCartOpen, setIsCartOpen] = useState(false);
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
                    <Route
                      path="/book/:isbn"
                      element={
                        <BookDetailsPage
                          onCartOpen={() => setIsCartOpen(true)}
                        />
                      }
                    />
                    <Route path="/authors" element={<AllAuthorsPage />} />
                    <Route path="/author/books" element={<AuthorBooksPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/orders" element={<OrdersHistoryPage />} />
                    {/* Use AuthPage for both login and signup */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    {/* Cart is now a sidebar, no separate route needed */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
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
