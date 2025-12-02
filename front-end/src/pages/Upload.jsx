import React, { useState } from "react";
import { uploadFile } from "../services/api";

const Upload = () => {
  //Capture file in React state
  const [file, setFile] = useState(null);
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Code the onChange event handler
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setKey(null);
    }
  };

  //Write the handleUpload function
  const handleUpload = async () => {
    if (!file) {
      setError("Lütfen bir dosya seçin.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    //Implement try-catch blocks
    try {
      const result = await uploadFile(formData);

      // Rapordaki "Capture the Key" maddesi
      setKey(result.key);
    } catch (err) {
      console.error(err);
      setError("Yükleme sırasında hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Anahtarı Kopyalama Fonksiyonu (Ekstra)
  const copyToClipboard = () => {
    if (key) {
      navigator.clipboard.writeText(key);
      alert("Anahtar kopyalandı!");
    }
  };

  return (
    <div className="container">
      <h2>Dosya Yükle ve Şifrele</h2>

      <div className="upload-form">
        <input
          type="file"
          className="file-input"
          onChange={handleFileChange}
          disabled={loading}
        />
        <br />
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? "Yükleniyor..." : "Yükle"}
        </button>
      </div>

      {/* Error Mesage */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {key && (
        <div
          className="result-area"
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <h3>İşlem Sonucu</h3>
          <p>Dosyanız şifrelendi! Erişim anahtarınız:</p>
          <div
            className="key-display"
            style={{
              background: "#e8f0fe",
              padding: "10px",
              fontFamily: "monospace",
              fontSize: "1.2em",
              wordBreak: "break-all",
            }}
          >
            {key}
          </div>
          <button
            style={{ marginTop: "10px", backgroundColor: "#2ecc71" }}
            onClick={copyToClipboard}
          >
            Anahtarı Kopyala
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
