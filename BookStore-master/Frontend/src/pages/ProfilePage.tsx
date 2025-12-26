import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    shipping_address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [original, setOriginal] = useState<typeof form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

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

    fetchProfile();
  }, [isAuthenticated]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (original) setForm(original);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditMode(false);
    setMessage(null);
  };

  /* ---------------- SUBMIT HANDLER - NO BACKEND CHANGES NEEDED ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const wantsPasswordChange =
        passwordForm.currentPassword ||
        passwordForm.newPassword ||
        passwordForm.confirmPassword;

      // Validate password fields if user wants to change password
      if (wantsPasswordChange) {
        if (
          !passwordForm.currentPassword ||
          !passwordForm.newPassword ||
          !passwordForm.confirmPassword
        ) {
          setMessage("Fill all password fields to change password");
          setSaving(false);
          return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          setMessage("Passwords do not match");
          setSaving(false);
          return;
        }
      }

      // Build update payload
      const updatePayload: any = {
        firstname: form.firstname,
        lastname: form.lastname,
        phone_no: form.phone_no || null,
        shipping_address: form.shipping_address || null,
      };

      // Add password to payload if changing
      if (wantsPasswordChange) {
        updatePayload.password = passwordForm.newPassword;
      }

      // Send update request
      const res = await fetch("http://localhost:3000/api/customer/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || data.friendly || "Failed to update profile");
        setSaving(false);
        return;
      }

      // Update local state with new data
      const newFormData = {
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        phone_no: data.phone_no || "",
        shipping_address: data.shipping_address || "",
      };
      setForm(newFormData);
      setOriginal(newFormData);

      const successMsg = wantsPasswordChange
        ? "Profile and password updated successfully"
        : "Profile updated successfully";

      setMessage(successMsg);
      setIsEditMode(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /* ---------------- STATES ---------------- */
  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Not signed in</h2>
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  // Calculate fullName and initials here (before render)
  const fullName = `${form.firstname} ${form.lastname}`.trim();
  const initials = form.firstname?.[0]?.toUpperCase() || "U";

  /* ---------------- RENDER ---------------- */
  return (
    <div className="profile-layout">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="profile-sidebar">
        <div className="sidebar-header">
          <div className="profile-avatar-sidebar">{initials}</div>
          <div className="profile-name">{fullName}</div>
          <div className="profile-member">Member</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">👤</span> Profile
          </button>
          <button className="nav-item" onClick={() => navigate("/orders")}>
            <span className="nav-icon">🛍️</span> My Orders
          </button>
          <button className="nav-item logout-btn" onClick={logout}>
            <span className="nav-icon">🚪</span> Logout
          </button>
        </nav>
      </aside>

      {/* ---------- MAIN ---------- */}
      <main className="profile-main">
        <div className="content-section">
          <div className="section-header">
            <h1 className="section-title">Personal Information</h1>
            {!isEditMode && (
              <button className="btn-edit" onClick={() => setIsEditMode(true)}>
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {message && <div className="profile-message">{message}</div>}

          {/* ---------- DISPLAY MODE ---------- */}
          {!isEditMode ? (
            <div className="profile-display">
              <div className="info-row">
                <div className="info-item">
                  <label className="info-label">First Name</label>
                  <div className="info-value">
                    {form.firstname || "Not provided"}
                  </div>
                </div>
                <div className="info-item">
                  <label className="info-label">Last Name</label>
                  <div className="info-value">
                    {form.lastname || "Not provided"}
                  </div>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{form.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{form.phone_no || "—"}</span>
                </div>
              </div>

              <div className="info-row full-width">
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">
                    {form.shipping_address || "—"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ---------- EDIT MODE ---------- */
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    className="input"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="input"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Email</label>
                <input
                  className="input input-readonly"
                  value={form.email}
                  readOnly
                />
              </div>

              <div className="form-group full-width">
                <label>Phone</label>
                <input
                  className="input"
                  name="phone_no"
                  value={form.phone_no}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  className="input textarea"
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Change Password (optional)</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Current password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
                <input
                  className="input"
                  type="password"
                  placeholder="New password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
                <input
                  className="input"
                  type="password"
                  placeholder="Confirm new password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
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
      </main>
    </div>
  );
};

export default ProfilePage;
