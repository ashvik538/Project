
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ fullName: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Could not connect to server. Make sure backend is running.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.redBar} />
          <h1 style={styles.title}>Get In Touch</h1>
          <p style={styles.subtitle}>We'll get back to you within 24 hours.</p>
        </div>

        <div style={styles.fields}>
          {[
            { name: "fullName", placeholder: "Full Name", type: "text" },
            { name: "email", placeholder: "Email Address", type: "email" },
            { name: "phone", placeholder: "Phone Number", type: "tel" },
            { name: "subject", placeholder: "Subject", type: "text" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "#e53935")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
            />
          ))}

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            style={{ ...styles.input, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "#e53935")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
          />
        </div>

        {status === "success" && (
          <div style={styles.successBanner}>
            ✅ Message sent successfully! We'll be in touch soon.
          </div>
        )}

        {status === "error" && (
          <div style={styles.errorBanner}>⚠️ {errorMsg}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          style={{
            ...styles.button,
            opacity: status === "loading" ? 0.75 : 1,
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (status !== "loading") e.target.style.background = "#c62828";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#e53935";
          }}
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
  },
  header: {
    marginBottom: "28px",
  },
  redBar: {
    width: "48px",
    height: "5px",
    background: "#e53935",
    borderRadius: "3px",
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#888",
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: "12px",
    border: "1.5px solid #e8e8e8",
    background: "#f7f7f7",
    fontSize: "15px",
    color: "#222",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "18px",
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    transition: "background 0.2s, transform 0.1s",
  },
  successBanner: {
    background: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  errorBanner: {
    background: "#ffebee",
    color: "#c62828",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    marginBottom: "16px",
  },
};




