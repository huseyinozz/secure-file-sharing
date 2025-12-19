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
    <div className="page-container">
      {" "}
      {/* Container sınıfı değişti */}
      <div className="form-card">
        {" "}
        {/* Kart yapısı eklendi */}
        <h2>Dosya Yükle ve Şifrele</h2>
        {/* Hata Mesajı */}
        {error && <div className="alert alert-error">{error}</div>}
        <div className="input-group">
          <label>Dosya Seçin</label>
          <input
            type="file"
            className="file-input"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        {/* Yükle Butonu */}
        <button
          className="btn btn-primary" /* Sınıf eklendi */
          onClick={handleUpload}
          disabled={loading || !file}
          style={{ width: "100%" }} /* Tek buton olduğu için tam genişlik */
        >
          {loading ? "Yükleniyor..." : "Yükle"}
        </button>
        {/* Sonuç Alanı */}
        {key && (
          <div className="result-area">
            <h3>Dosya Şifrelendi!</h3>
            <p>Erişim anahtarınız:</p>
            <div className="key-display">{key}</div>
            <button className="btn btn-success" onClick={copyToClipboard}>
              Anahtarı Kopyala
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
