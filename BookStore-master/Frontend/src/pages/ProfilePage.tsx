import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    shipping_address: "",
    avatar: "",
  });
  const [original, setOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Avatar helpers
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fetchProfile extracted so we can call it after save/cancel
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
        avatar: data.avatar || "",
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
    const { name, value } = e.target as any;
    // Special-case avatar text input length to avoid DB errors
    if (name === "avatar") {
      // clear selected file since user is entering a URL
      setSelectedFileName(null);
      if (value && value.length > 240) {
        setAvatarError(
          "Avatar URL or data is too long for storage (max ~255 chars). Use a shorter URL or upload via the avatar endpoint."
        );
        setForm((prev) => ({ ...prev, avatar: "" }));
        return;
      } else {
        setAvatarError(null);
        setForm((prev) => ({ ...prev, avatar: value }));
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError(null);
    if (!file) {
      setSelectedFileName(null);
      return;
    }
    setSelectedFileName(file.name);

    // Limit by file size (50KB) to avoid oversized base64 strings that won't fit DB columns
    const MAX_BYTES = 50 * 1024; // 50 KB
    if (file.size > MAX_BYTES) {
      setAvatarError(
        "File is too large. Please choose an image smaller than 50 KB or paste an image URL."
      );
      setForm((prev) => ({ ...prev, avatar: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // guard against overly long data URIs (DB avatar column is varchar(255))
      if (dataUrl.length > 240) {
        setAvatarError(
          "Encoded image is too long for storage (max ~255 chars). Use an external image URL or the avatar upload endpoint."
        );
        setForm((prev) => ({ ...prev, avatar: "" }));
        return;
      }
      setForm((prev) => ({ ...prev, avatar: dataUrl }));
      setAvatarError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    if (original) setForm(original);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarError) {
      setMessage(avatarError);
      return;
    }
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
      if (form.avatar) payload.avatar = form.avatar;

      console.log("Submitting profile payload:", payload);

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
        console.error("Server response:", res.status, respBodyText);
        return;
      }

      // If server returns updated profile object, use it to refresh UI
      if (respBody && (respBody.firstname || respBody.email)) {
        const updated = respBody;
        // merge into form
        setForm((prev) => ({
          ...prev,
          firstname: updated.firstname || prev.firstname,
          lastname: updated.lastname || prev.lastname,
          phone_no: updated.phone_no || prev.phone_no,
          shipping_address: updated.shipping_address || prev.shipping_address,
          avatar: updated.avatar || prev.avatar,
        }));
      } else {
        // fallback: re-fetch
        await fetchProfile();
      }

      setMessage("Profile updated successfully.");

      // Update local user info if present
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

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Please sign in</h2>
        <p>You must be signed in to view and edit your profile.</p>
      </div>
    );
  }

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>;

  return (
    <div style={{ padding: 24 }}>
      <div className="profile-card">
        <div className="profile-left">
          {form.avatar ? (
            <img src={form.avatar} alt="avatar" className="profile-avatar" />
          ) : (
            <div className="profile-avatar profile-avatar-placeholder">
              {(form.firstname?.[0] || "A").toUpperCase()}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginTop: 12,
            }}
          >
            <input
              ref={fileInputRef}
              id="avatarFileInput"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />

            <button
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>

            <div
              className="file-name"
              style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}
            >
              {selectedFileName || "No file chosen"}
            </div>
            {avatarError && (
              <div
                className="avatar-error"
                style={{ color: "#b91c1c", marginTop: 8 }}
              >
                {avatarError}
              </div>
            )}

            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
              Or paste an image URL below
            </div>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="input"
              placeholder="Avatar URL or data URI"
              style={{ marginTop: 8 }}
            />
          </div>
        </div>

        <div className="profile-right">
          <h2 style={{ marginTop: 0 }}>Edit Your Profile</h2>
          {message && <div className="profile-message">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                First name
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label>
                Last name
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label>
                Email (read-only)
                <input
                  name="email"
                  value={form.email}
                  readOnly
                  className="input"
                />
              </label>

              <label>
                Phone
                <input
                  name="phone_no"
                  value={form.phone_no}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Shipping Address (optional)
                <textarea
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
