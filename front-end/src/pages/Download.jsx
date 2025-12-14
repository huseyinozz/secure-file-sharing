import React, { useState } from "react";
import { downloadFile } from "../services/api";

const Download = () => {
  // --- STATE TANIMLARI (Logic) ---
  const [filename, setFilename] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Başarı mesajı için

  // --- YARDIMCI FONKSİYONLAR ---

  // Formu Temizleme (3. Hafta Retrospective & UI İsteği)
  const handleClear = () => {
    setFilename("");
    setKey("");
    setError(null);
    setSuccess(null);
  };

  // Panodan Yapıştır (Clipboard API)
  const pasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setKey(text);
    } catch {
      alert("Panodan okuma izni verilmedi.");
    }
  };

  // --- API İSTEĞİ (Handle Download) ---
  const handleDownload = async () => {
    // Önceki mesajları temizle
    setError(null);
    setSuccess(null);

    // Validasyon (Boş alan kontrolü)
    if (!filename.trim() || !key.trim()) {
      setError("Lütfen dosya adı ve anahtarı eksiksiz girin!");
      return;
    }

    setLoading(true);

    try {
      const blob = await downloadFile(filename, key);

      // Blob -> Dosya İndirme Mantığı
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Temizlik
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Başarı Mesajı
      setSuccess("Dosyanız başarıyla indirildi!");

      // İsteğe bağlı: İndirme bitince formu temizlemek istersen şu satırı aç:
      // handleClear();
    } catch (err) {
      console.error(err);
      if (err.status === 403) {
        setError("Hatalı Anahtar! Erişim reddedildi.");
      } else if (err.status === 404) {
        setError("Dosya Bulunamadı (İsmi kontrol edin).");
      } else {
        setError("Bir hata oluştu: " + (err.message || "Bilinmiyor"));
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ARAYÜZ (UI) ---
  return (
    <div className="page-container">
      <div className="form-card">
        <h2>Dosya İndir</h2>

        {/* Başarı Mesajı */}
        {success && (
          <div
            className="alert alert-success"
            style={{
              color: "green",
              padding: "10px",
              border: "1px solid green",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {success}
          </div>
        )}

        {/* Hata Mesajı */}
        {error && (
          <div
            className="alert alert-error"
            style={{
              color: "red",
              padding: "10px",
              border: "1px solid red",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}

        {/* Dosya Adı Girişi */}
        <div className="input-group">
          <label>Dosya Adı</label>
          <input
            type="text"
            placeholder="örnek-dosya.txt"
            className="text-input"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Şifre Girişi */}
        <div className="input-group">
          <label>Şifre Anahtarı</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Size verilen anahtarı yapıştırın"
              className="text-input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={loading}
              style={{ flexGrow: 1 }}
            />
            <button
              className="btn btn-secondary"
              onClick={pasteKey}
              disabled={loading}
              type="button" // Form submit tetiklemesin diye
            >
              Yapıştır
            </button>
          </div>
        </div>

        {/* Butonlar Grubu */}
        <div
          className="button-group"
          style={{ marginTop: "20px", display: "flex", gap: "10px" }}
        >
          {/* İndirme Butonu */}
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            // Validasyon: Alanlar boşsa veya yükleniyorsa basılamaz
            disabled={loading || !filename || !key}
            style={{
              flex: 1,
              padding: "10px",
              cursor: loading || !filename || !key ? "not-allowed" : "pointer",
              opacity: loading || !filename || !key ? 0.6 : 1,
            }}
          >
            {loading ? "İndiriliyor..." : "Dosyayı İndir"}
          </button>

          {/* Temizleme Butonu */}
          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;
