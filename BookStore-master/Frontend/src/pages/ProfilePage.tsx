import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    shipping_address: "",
  });
  const [original, setOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      const payload = {
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        phone_no: data.phone_no || "",
        shipping_address: data.shipping_address || "",
      };
      setForm(payload);
      setOriginal(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (original) setForm(original);
    setMessage(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Not authenticated");
      const payload: any = {
        firstname: form.firstname,
        lastname: form.lastname,
        phone_no: form.phone_no || null,
        shipping_address: form.shipping_address || null,
      };

      const res = await fetch("http://localhost:3000/api/customer/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const respBodyText = await res.text();
      let respBody: any = null;
      try {
        respBody = respBodyText ? JSON.parse(respBodyText) : null;
      } catch {}

      if (!res.ok) {
        const reason = respBody?.friendly || respBody?.message || respBodyText;
        setMessage("Failed to update profile: " + reason);
        return;
      }

      if (respBody && (respBody.firstname || respBody.email)) {
        const updated = respBody;
        setForm((prev) => ({
          ...prev,
          firstname: updated.firstname || prev.firstname,
          lastname: updated.lastname || prev.lastname,
          phone_no: updated.phone_no || prev.phone_no,
          shipping_address: updated.shipping_address || prev.shipping_address,
        }));
        setOriginal(updated);
      } else {
        await fetchProfile();
      }

      setMessage("Profile updated successfully.");
      setIsEditMode(false);

      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          u.firstname = form.firstname;
          u.lastname = form.lastname;
          u.fullName = `${form.firstname || ""} ${form.lastname || ""}`.trim();
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
      window.setTimeout(() => setMessage(null), 3500);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Please sign in</h2>
        <p>You must be signed in to view and edit your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  const fullName = `${form.firstname} ${form.lastname}`.trim() || "User";
  const initials = form.firstname?.[0]?.toUpperCase() || "U";

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <div className="sidebar-header">
          <h2>Welcome Back, {form.firstname || "User"}!</h2>
          <div className="profile-avatar-sidebar">
            {initials}
          </div>
          <div className="profile-name">{fullName}</div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "info" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("info");
              setIsEditMode(false);
            }}
          >
            <span className="nav-icon">👤</span>
            Personal Info
          </button>
          <button
            className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => navigate("/orders")}
          >
            <span className="nav-icon">🛍️</span>
            My Orders
          </button>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🔒</span>
            Logout
          </button>
        </nav>
      </aside>

      <main className="profile-main">
        {activeTab === "info" && (
          <div className="content-section">
            <div className="section-header">
              <h1 className="section-title">Personal Information</h1>
              {!isEditMode && (
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {message && <div className="profile-message">{message}</div>}
            
            {!isEditMode ? (
              <div className="profile-display">
                <div className="info-row">
                  <div className="info-item">
                    <label className="info-label">First Name</label>
                    <div className="info-value">{form.firstname || "Not provided"}</div>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Last Name</label>
                    <div className="info-value">{form.lastname || "Not provided"}</div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <label className="info-label">Email</label>
                    <div className="info-value">{form.email || "Not provided"}</div>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Phone</label>
                    <div className="info-value">{form.phone_no || "Not provided"}</div>
                  </div>
                </div>

                <div className="info-row full-width">
                  <div className="info-item">
                    <label className="info-label">Shipping Address</label>
                    <div className="info-value">
                      {form.shipping_address || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email (read-only)</label>
                    <input
                      name="email"
                      value={form.email}
                      readOnly
                      className="input input-readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      name="phone_no"
                      value={form.phone_no}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Shipping Address (optional)</label>
                  <textarea
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChange}
                    className="input textarea"
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;