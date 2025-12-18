import React, { useState } from "react";
import {
  BookOpen,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import "../styles/dashboard.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("books");

  const menuItems = [
    { id: "books", label: "Books Management", icon: BookOpen },
    { id: "stock", label: "Stock Management", icon: Package },
    { id: "orders", label: "Publisher Orders", icon: ShoppingCart },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "books":
        return <BooksManagement />;
      case "stock":
        return <StockManagement />;
      case "orders":
        return <PublisherOrders />;
      case "reports":
        return <Reports />;
      case "customers":
        return <Customers />;
      case "settings":
        return <SettingsPage />;
      default:
        return <BooksManagement />;
    }
  };

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        {/* Logo & Toggle */}
        <div className="sidebar-header">
          {sidebarOpen && (
            <div className="flex gap-4">
              <BookOpen size={24} />
              <div>
                <h1>Booktopia</h1>
                <p>Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="menu-toggle-btn"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`menu-btn ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="topbar">
          <div>
            <h2>{menuItems.find((item) => item.id === activeMenu)?.label}</h2>
          </div>

          <div className="flex gap-4">
            <div>
              <p>Admin User</p>
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                admin@booktopia.com
              </p>
            </div>
            <div className="profile-circle">A</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

// Books Management Component
const BooksManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([
    {
      isbn: "978-0-123456-78-9",
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      category: "Science",
      stock: 150,
      price: 89.99,
    },
    {
      isbn: "978-0-987654-32-1",
      title: "The Art of War",
      author: "Sun Tzu",
      category: "History",
      stock: 45,
      price: 15.99,
    },
    {
      isbn: "978-1-234567-89-0",
      title: "World Geography Atlas",
      author: "National Geographic",
      category: "Geography",
      stock: 12,
      price: 34.99,
    },
  ]);
  const handleAddBook = () => {};
  return (
    <div className="flex-column gap-4">
      {/* Action Bar */}
      <div className="flex gap-4">
        <div className="search-container">
          <Search
            size={20}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.6,
            }}
          />
          <input
            type="text"
            placeholder="Search books by ISBN, title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="add-btn" onClick={handleAddBook}>
          <Plus size={20} />
          Add New Book
        </button>
      </div>

      {/* Books Table */}
      <div className="table-wrapper">
        <div style={{ overflowX: "auto" }}>
          <table
            className="table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{book.isbn}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className="badge badge-green">{book.category}</span>
                  </td>
                  <td>
                    <span
                      className={book.stock < 20 ? "stock-red" : "stock-green"}
                    >
                      {book.stock}
                    </span>
                  </td>
                  <td>${book.price}</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="action-btn edit">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stock Management Component
const StockManagement = () => {
  return (
    <div className="flex-column gap-4">
      <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
        <div className="card card-red" style={{ flex: "1 1 220px" }}>
          <div
            className="flex"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h3 className="card-title">Low Stock Books</h3>
              <p className="card-number" style={{ color: "#dc2626" }}>
                12
              </p>
              <p className="card-subtitle">Books below threshold</p>
            </div>
            <Package size={60} style={{ opacity: 0.2 }} />
          </div>
        </div>

        <div className="card card-orange" style={{ flex: "1 1 220px" }}>
          <div
            className="flex"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h3 className="card-title">Out of Stock</h3>
              <p className="card-number" style={{ color: "#ea580c" }}>
                5
              </p>
              <p className="card-subtitle">Books need reordering</p>
            </div>
            <Package size={60} style={{ opacity: 0.2 }} />
          </div>
        </div>

        <div className="card card-green" style={{ flex: "1 1 220px" }}>
          <div
            className="flex"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h3 className="card-title">Total Books</h3>
              <p className="card-number" style={{ color: "#16a34a" }}>
                458
              </p>
              <p className="card-subtitle">Books in inventory</p>
            </div>
            <BookOpen size={60} style={{ opacity: 0.2 }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ borderLeft: "none" }}>
        <h3 className="card-title">Books Requiring Attention</h3>
        <p className="card-subtitle">
          Stock management table will appear here...
        </p>
      </div>
    </div>
  );
};

// Publisher Orders Component
const PublisherOrders = () => {
  return (
    <div className="flex-column gap-4">
      <div className="card" style={{ borderLeft: "none" }}>
        <h3 className="card-title">Pending Orders from Publishers</h3>
        <p className="card-subtitle">
          Publisher orders list will appear here...
        </p>
      </div>
    </div>
  );
};

// Reports Component
const Reports = () => {
  return (
    <div className="flex-column gap-4">
      <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
        <div className="card" style={{ flex: "1 1 260px", borderLeft: "none" }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <BarChart3 size={24} />
            Sales Reports
          </h3>
          <div className="flex-column gap-4" style={{ marginTop: "16px" }}>
            <button className="report-button">
              <p className="card-title" style={{ fontSize: "14px" }}>
                Total Sales - Last Month
              </p>
              <p className="card-subtitle">View monthly sales summary</p>
            </button>
            <button className="report-button">
              <p className="card-title" style={{ fontSize: "14px" }}>
                Total Sales - Specific Day
              </p>
              <p className="card-subtitle">Select a date to view sales</p>
            </button>
          </div>
        </div>

        <div className="card" style={{ flex: "1 1 260px", borderLeft: "none" }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Users size={24} />
            Top Performers
          </h3>
          <div className="flex-column gap-4" style={{ marginTop: "16px" }}>
            <button className="report-button">
              <p className="card-title" style={{ fontSize: "14px" }}>
                Top 5 Customers (Last 3 Months)
              </p>
              <p className="card-subtitle">Highest spending customers</p>
            </button>
            <button className="report-button">
              <p className="card-title" style={{ fontSize: "14px" }}>
                Top 10 Selling Books (Last 3 Months)
              </p>
              <p className="card-subtitle">Best performing books</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Customers Component
const Customers = () => {
  return (
    <div className="flex-column gap-4">
      <div className="card" style={{ borderLeft: "none" }}>
        <h3 className="card-title">Customer Management</h3>
        <p className="card-subtitle">
          Customer list and details will appear here...
        </p>
      </div>
    </div>
  );
};

// Settings Component
const SettingsPage = () => {
  return (
    <div className="flex-column gap-4">
      <div className="card" style={{ borderLeft: "none" }}>
        <h3 className="card-title">System Settings</h3>
        <p className="card-subtitle">Settings options will appear here...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
