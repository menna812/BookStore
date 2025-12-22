import React, { useEffect, useState } from "react";
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
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // Fetch admin profile for header display
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      // If no token, but we have a cached email from login, show it
      const cached = localStorage.getItem("adminEmail");
      if (cached)
        setAdminProfile((prev: any) => ({ ...(prev || {}), email: cached }));
      return;
    }

    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/profile", {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAdminProfile({
            name: `${data.firstname || ""} ${data.lastname || ""}`.trim(),
            email: data.email,
            avatar: data.avatar,
          });
        } else {
          // fallback to cached email if profile fetch fails
          const cached = localStorage.getItem("adminEmail");
          if (cached)
            setAdminProfile((prev: any) => ({
              ...(prev || {}),
              email: cached,
            }));
        }
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        const cached = localStorage.getItem("adminEmail");
        if (cached)
          setAdminProfile((prev: any) => ({ ...(prev || {}), email: cached }));
      }
    })();
  }, []);

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
        className={`sidebar ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
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
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              localStorage.removeItem("userRole");
              localStorage.removeItem("adminEmail");
              window.location.href = "/";
            }}
          >
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
              <p>{adminProfile?.name || "Admin User"}</p>
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                {adminProfile?.email || "admin@booktopia.com"}
              </p>
            </div>
            {adminProfile?.avatar ? (
              <img
                src={adminProfile.avatar}
                alt="avatar"
                className="profile-circle"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="profile-circle">
                {(adminProfile?.name?.charAt(0) || "A").toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

interface Book {
  isbn: string;
  title: string;
  author: string; // combined author names from backend
  category: string;
  stock: number;
  price: number;
  avatar?: string;
  rating?: number;
  rating_count?: number;
}

// Books Management Component
const BooksManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    console.log("Dashboard sees token:", t);
    setToken(t);
  }, []);

  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBook, setNewBook] = useState<any>({
    isbn: "",
    title: "",
    year: "",
    stock: "",
    threshold: "",
    category: "Science",
    price: "",
    publisher_id: "",
    author_ids: "", // comma-separated list for convenience
    avatar: "",
    rating: "",
    rating_count: "",
  });

  const mapBookFromApi = (b: any): Book => ({
    isbn: b.ISBN,
    title: b.Title,
    author: b.authors || "",
    category: b.Category,
    stock: b.stock_quantity,
    price: b.sellingPrice,
    avatar: b.avatar || "",
    rating: typeof b.rating !== "undefined" ? Number(b.rating) : undefined,
    rating_count:
      typeof b.rating_count !== "undefined"
        ? Number(b.rating_count)
        : undefined,
  });

  const fetchBooks = async (keyword?: string, category?: string) => {
    try {
      // Build query depending on inputs
      if (keyword) {
        // Query both keyword (title/isbn) and author filters in parallel, include category if present
        const url1 = new URL("http://localhost:3000/api/books/search");
        url1.searchParams.set("keyword", keyword);
        if (category) url1.searchParams.set("category", category);

        const url2 = new URL("http://localhost:3000/api/books/search");
        url2.searchParams.set("author", keyword);
        if (category) url2.searchParams.set("category", category);

        const [r1, r2] = await Promise.all([
          fetch(url1.toString()),
          fetch(url2.toString()),
        ]);
        const data1 = r1.ok ? await r1.json() : [];
        const data2 = r2.ok ? await r2.json() : [];

        // Merge and dedupe by ISBN
        const combined: any[] = [];
        const seen = new Set<string>();
        for (const item of [...data1, ...data2]) {
          const isbn = item.ISBN || item.isbn;
          if (!seen.has(isbn)) {
            seen.add(isbn);
            combined.push(item);
          }
        }

        const uiBooks = combined.map((b: any) => ({
          ...mapBookFromApi(b),
          avatar: b.avatar || "",
        }));
        setBooks(uiBooks);
        return;
      }

      // If only category selected, query by category
      if (category) {
        const url = new URL("http://localhost:3000/api/books/search");
        url.searchParams.set("category", category);
        const res = await fetch(url.toString());
        const data = await res.json();
        const uiBooks = data.map((b: any) => ({
          ...mapBookFromApi(b),
          avatar: b.avatar || "",
        }));
        setBooks(uiBooks);
        return;
      }

      // No filters — fetch all
      const res = await fetch("http://localhost:3000/api/books/search");
      const data = await res.json();
      console.log("Fetched books:", data);

      const uiBooks = data.map((b: any) => ({
        ...mapBookFromApi(b),
        avatar: b.avatar || "",
      }));
      setBooks(uiBooks);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setNewBook({
      isbn: "",
      title: "",
      year: "",
      stock: "",
      threshold: "",
      category: "Science",
      price: "",
      publisher_id: "",
      author_ids: "",
      avatar: "",
      rating: "",
      rating_count: "",
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (book: any) => {
    // Prefill form with what we have; some fields (like author IDs) may need manual input
    setNewBook({
      isbn: book.isbn,
      title: book.title,
      year: (book as any).Publication_year || "",
      stock: String(book.stock || ""),
      threshold: String((book as any).threshold || ""),
      category: book.category || "Science",
      price: String(book.price || ""),
      publisher_id: String((book as any).Publisher_id || ""),
      author_ids: "",
      avatar: book.avatar || "",
      rating: book.rating != null ? String(book.rating) : "",
      rating_count: book.rating_count != null ? String(book.rating_count) : "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBook((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Avoid sending very large data URLs that won't fit in DB (<=255)
      if (dataUrl.length > 240) {
        alert(
          "Selected image is too large to store as a data URL (DB limit). Please provide an image URL or choose a smaller image."
        );
        return;
      }
      setNewBook((prev: any) => ({ ...prev, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: any = {
      isbn: newBook.isbn ? newBook.isbn.replace(/-/g, "") : undefined,
      title: newBook.title,
      year: newBook.year ? Number(newBook.year) : undefined,
      stock: newBook.stock ? Number(newBook.stock) : undefined,
      threshold: newBook.threshold ? Number(newBook.threshold) : undefined,
      category: newBook.category,
      price: newBook.price ? Number(newBook.price) : undefined,
      publisher_id: newBook.publisher_id
        ? Number(newBook.publisher_id)
        : undefined,
      author_ids: newBook.author_ids
        ? newBook.author_ids
          .split(",")
          .map((id: string) => id.trim())
          .filter(Boolean)
          .map((id: string) => Number(id))
        : undefined,
      avatar: newBook.avatar || undefined,
      rating:
        typeof newBook.rating !== "undefined" && newBook.rating !== ""
          ? Number(newBook.rating)
          : undefined,
      rating_count:
        typeof newBook.rating_count !== "undefined" &&
          newBook.rating_count !== ""
          ? Number(newBook.rating_count)
          : undefined,
    };

    try {
      if (!token) throw new Error("Missing auth token");

      if (isEditing) {
        const res = await fetch(
          `http://localhost:3000/api/books/${newBook.isbn}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to update book:", txt);
          alert(`Failed to update book: ${txt}`);
          return;
        }

        await fetchBooks();
      } else {
        const res = await fetch("http://localhost:3000/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to add book:", txt);
          alert(`Failed to add book: ${txt}`);
          return;
        }

        await fetchBooks();
      }

      setShowForm(false);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Network or auth error");
    }
  };

  const handleDelete = async (isbn: string) => {
    if (!confirm(`Delete book ${isbn}? This cannot be undone.`)) return;
    try {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(`http://localhost:3000/api/books/${isbn}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Delete failed:", txt);
        alert(`Failed to delete book: ${txt}`);
        return;
      }
      setBooks((prev) => prev.filter((b) => b.isbn !== isbn));
    } catch (err) {
      console.error(err);
      alert("Network or auth error");
    }
  };

  return (
    <>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? "Edit Book" : "Add New Book"}</h2>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="isbn"
                placeholder="ISBN (13 digits, no hyphens)"
                value={newBook.isbn}
                onChange={handleChange}
                required={!isEditing}
                disabled={isEditing}
              />
              <input
                name="title"
                placeholder="Title"
                value={newBook.title}
                onChange={handleChange}
                required
              />
              <input
                name="year"
                type="number"
                placeholder="Publication Year"
                value={newBook.year}
                onChange={handleChange}
                required
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock quantity"
                value={newBook.stock}
                onChange={handleChange}
                required
              />
              <input
                name="threshold"
                type="number"
                placeholder="Threshold"
                value={newBook.threshold}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={newBook.category}
                onChange={handleChange}
                required
              >
                <option value="Science">Science</option>
                <option value="Art">Art</option>
                <option value="Religion">Religion</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={newBook.price}
                onChange={handleChange}
                required
              />

              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5, optional)"
                value={newBook.rating}
                onChange={handleChange}
              />
              <input
                name="rating_count"
                type="number"
                min="0"
                placeholder="Rating count (optional)"
                value={newBook.rating_count}
                onChange={handleChange}
              />

              <input
                name="publisher_id"
                type="number"
                placeholder="Publisher ID"
                value={newBook.publisher_id}
                onChange={handleChange}
                required
              />
              <input
                name="author_ids"
                placeholder="Author IDs (comma separated, e.g. 1,2,3)"
                value={newBook.author_ids}
                onChange={handleChange}
                // optional for edits
                required={!isEditing}
              />

              {/* Optional avatar upload (file becomes data URL) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 12, color: "#6b7280" }}>
                  Optional cover image (data URL must be 255 chars or less;
                  otherwise provide an image URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <input
                  name="avatar"
                  placeholder="Or provide an image URL"
                  value={newBook.avatar}
                  onChange={handleChange}
                />
                {newBook.avatar && (
                  <img
                    src={newBook.avatar}
                    alt="cover"
                    style={{ width: 80, height: 100, objectFit: "cover" }}
                  />
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? "Save Changes" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              placeholder="Search by ISBN, title, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  fetchBooks(searchTerm, categoryFilter);
                }
              }}
              className="search-input"
            />

            <select
              className="category-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                fetchBooks(searchTerm, e.target.value);
              }}
            >
              <option value="">All categories</option>
              <option value="Science">Science</option>
              <option value="Art">Art</option>
              <option value="Religion">Religion</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>
            <button
              className="search-btn"
              type="button"
              onClick={() => fetchBooks(searchTerm, categoryFilter)}
            >
              <Search size={16} />
              Search
            </button>
            <button
              className="clear-btn"
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                fetchBooks();
              }}
            >
              Clear
            </button>
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
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books?.map((book, index) => (
                  <tr key={index}>
                    <td>{book.isbn}</td>
                    <td style={{ width: 72 }}>
                      {book.avatar ? (
                        <img
                          src={book.avatar}
                          alt="cover"
                          style={{ width: 48, height: 64, objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ color: "#9ca3af" }}>—</span>
                      )}
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <span className="badge badge-green">{book.category}</span>
                    </td>
                    <td>
                      <span
                        className={
                          book.stock < 20 ? "stock-red" : "stock-green"
                        }
                      >
                        {book.stock}
                      </span>
                    </td>
                    <td>${book.price}</td>
                    <td>
                      {typeof book.rating !== "undefined" &&
                        book.rating !== null
                        ? `${book.rating} (${book.rating_count ?? 0})`
                        : "—"}
                    </td>
                    <td>
                      <div className="flex gap-4">
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(book)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(book.isbn)}
                        >
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
    </>
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
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Report data states
  const [lastMonthSales, setLastMonthSales] = useState<number | null>(null);
  const [dailySales, setDailySales] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topBooks, setTopBooks] = useState<any[]>([]);
  const [replenishmentData, setReplenishmentData] = useState<any>(null);
  const [searchIsbn, setSearchIsbn] = useState<string>("");

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3000/api";

  const fetchReport = async (endpoint: string, params?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = params ? `${API_URL}${endpoint}?${params}` : `${API_URL}${endpoint}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch report");
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLastMonthSales = async () => {
    setActiveReport("lastMonth");
    const data = await fetchReport("/reports/sales/last-month");
    if (data) setLastMonthSales(data.total_sales || 0);
  };

  const handleDailySales = async () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }
    setActiveReport("daily");
    const data = await fetchReport("/reports/sales/day", `date=${selectedDate}`);
    if (data) setDailySales(data.daily_sales || 0);
  };

  const handleTopCustomers = async () => {
    setActiveReport("topCustomers");
    const data = await fetchReport("/reports/customers/top5");
    if (data) setTopCustomers(data);
  };

  const handleTopBooks = async () => {
    setActiveReport("topBooks");
    const data = await fetchReport("/reports/books/top10");
    if (data) setTopBooks(data);
  };

  const handleReplenishment = async () => {
    if (!searchIsbn) {
      setError("Please enter an ISBN");
      return;
    }
    setActiveReport("replenishment");
    const data = await fetchReport(`/reports/books/replenishment/${searchIsbn}`);
    if (data) setReplenishmentData(data);
  };

  return (
    <div className="flex-column gap-4">
      {/* Report Buttons */}
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
            <button className="report-button" onClick={handleLastMonthSales}>
              <p className="card-title" style={{ fontSize: "14px" }}>
                Total Sales - Last Month
              </p>
              <p className="card-subtitle">View monthly sales summary</p>
            </button>
            <div className="flex-column gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                }}
              />
              <button className="report-button" onClick={handleDailySales}>
                <p className="card-title" style={{ fontSize: "14px" }}>
                  Total Sales - Specific Day
                </p>
                <p className="card-subtitle">Select a date to view sales</p>
              </button>
            </div>
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
            <button className="report-button" onClick={handleTopCustomers}>
              <p className="card-title" style={{ fontSize: "14px" }}>
                Top 5 Customers (Last 3 Months)
              </p>
              <p className="card-subtitle">Highest spending customers</p>
            </button>
            <button className="report-button" onClick={handleTopBooks}>
              <p className="card-title" style={{ fontSize: "14px" }}>
                Top 10 Selling Books (Last 3 Months)
              </p>
              <p className="card-subtitle">Best performing books</p>
            </button>
          </div>
        </div>

        <div className="card" style={{ flex: "1 1 260px", borderLeft: "none" }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Package size={24} />
            Inventory Reports
          </h3>
          <div className="flex-column gap-4" style={{ marginTop: "16px" }}>
            <input
              type="text"
              placeholder="Enter ISBN"
              value={searchIsbn}
              onChange={(e) => setSearchIsbn(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
            />
            <button className="report-button" onClick={handleReplenishment}>
              <p className="card-title" style={{ fontSize: "14px" }}>
                Book Replenishment Count
              </p>
              <p className="card-subtitle">Times book was reordered</p>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ borderLeft: "none", textAlign: "center" }}>
          <p>Loading report...</p>
        </div>
      )}

      {/* Report Results */}
      {!loading && activeReport === "lastMonth" && lastMonthSales !== null && (
        <div className="card card-green" style={{ borderLeft: "4px solid #16a34a" }}>
          <h3 className="card-title">Last Month Sales</h3>
          <p className="card-number" style={{ color: "#16a34a", fontSize: "36px" }}>
            ${lastMonthSales.toFixed(2)}
          </p>
          <p className="card-subtitle">Total revenue from previous month</p>
        </div>
      )}

      {!loading && activeReport === "daily" && dailySales !== null && (
        <div className="card card-blue" style={{ borderLeft: "4px solid #2563eb" }}>
          <h3 className="card-title">Sales on {selectedDate}</h3>
          <p className="card-number" style={{ color: "#2563eb", fontSize: "36px" }}>
            ${dailySales.toFixed(2)}
          </p>
          <p className="card-subtitle">Total revenue for selected day</p>
        </div>
      )}

      {!loading && activeReport === "topCustomers" && topCustomers.length > 0 && (
        <div className="card" style={{ borderLeft: "none" }}>
          <h3 className="card-title" style={{ marginBottom: "16px" }}>
            Top 5 Customers (Last 3 Months)
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Customer Name</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>
                    <span
                      style={{
                        backgroundColor: index === 0 ? "#fbbf24" : index === 1 ? "#9ca3af" : index === 2 ? "#cd7f32" : "#e5e7eb",
                        color: index < 3 ? "#fff" : "#374151",
                        padding: "4px 10px",
                        borderRadius: "50%",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td>{customer.firstname} {customer.lastname}</td>
                  <td style={{ fontWeight: "600", color: "#16a34a" }}>
                    ${parseFloat(customer.total_spent).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeReport === "topBooks" && topBooks.length > 0 && (
        <div className="card" style={{ borderLeft: "none" }}>
          <h3 className="card-title" style={{ marginBottom: "16px" }}>
            Top 10 Selling Books (Last 3 Months)
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Book Title</th>
                <th>Copies Sold</th>
              </tr>
            </thead>
            <tbody>
              {topBooks.map((book, index) => (
                <tr key={index}>
                  <td>
                    <span
                      style={{
                        backgroundColor: index === 0 ? "#fbbf24" : index === 1 ? "#9ca3af" : index === 2 ? "#cd7f32" : "#e5e7eb",
                        color: index < 3 ? "#fff" : "#374151",
                        padding: "4px 10px",
                        borderRadius: "50%",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td>{book.Title}</td>
                  <td style={{ fontWeight: "600", color: "#2563eb" }}>
                    {book.total_copies_sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeReport === "replenishment" && replenishmentData && (
        <div className="card card-orange" style={{ borderLeft: "4px solid #ea580c" }}>
          <h3 className="card-title">{replenishmentData.Title || "Book"}</h3>
          <p className="card-number" style={{ color: "#ea580c", fontSize: "36px" }}>
            {replenishmentData.times_replenished || 0}
          </p>
          <p className="card-subtitle">Times this book has been replenished</p>
        </div>
      )}

      {!loading && activeReport === "topCustomers" && topCustomers.length === 0 && (
        <div className="card" style={{ borderLeft: "none", textAlign: "center" }}>
          <p className="card-subtitle">No customer data available for the last 3 months</p>
        </div>
      )}

      {!loading && activeReport === "topBooks" && topBooks.length === 0 && (
        <div className="card" style={{ borderLeft: "none", textAlign: "center" }}>
          <p className="card-subtitle">No book sales data available for the last 3 months</p>
        </div>
      )}
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
