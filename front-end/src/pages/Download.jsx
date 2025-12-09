import React, { useState } from "react";
import { downloadFile } from "../services/api";

const Download = () => {
  const [filename, setFilename] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API İsteği Atan Fonksiyon (Scrum 1 Hedefi)
  const handleDownload = async () => {
    if (!filename || !key) {
      setError("Lütfen dosya adı ve anahtarı girin.");
      return;
    }

    setLoading(true);
    setError(null);
    console.log("İndirme isteği başlatılıyor...");

    try {
      const blob = await downloadFile(filename, key);
      console.log("Veri alındı (Blob):", blob);
      // Blob'dan sanal bir URL oluşturuldu
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Geçici bir <a> etiketi oluşturuldu
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // İndirilecek dosya adı

      // <a> etiketine tıkla ve indir
      document.body.appendChild(link);
      link.click();

      // Temizlik
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Dosya indirme tetiklendi.");
    } catch (err) {
      console.error(err);
      if (err.status === 403) {
        setError("Hatalı Anahtar! Erişim reddedildi.");
      } else if (err.status === 404) {
        setError("Dosya Bulunamadı!");
      } else {
        setError("Bir hata oluştu: " + (err.message || "Bilinmiyor"));
      }
    } finally {
      setLoading(false);
    }
  };

  const pasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setKey(text);
    } catch {
      alert("Panodan okuma izni verilmedi.");
    }
  };
  return (
    // Sadece yazılan fonksiyonların işlev testi için basit inputlar koydum.
    // Hüseyin burayı silip sıfırdan yapabilirsin problem yok.
    // Ek olarak onChange ve onClick eventlere benim yazdığım fonksiyonları burdaki örnekte olduğu gibi bağlayabilirsin
    <div>
      <h2>Download Logic Test</h2>
      <input
        type="text"
        placeholder="Dosya Adı"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
      />
      <br />
      <div>
        <input
          type="text"
          placeholder="Anahtar"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={pasteKey}>Yapıştır</button>
      </div>
      <br />

      {/* deneme.txt gibi txt uzantili bir dosya ismi ve 5'den uzun bir anahtar ile mock data versiyon test edilebiliyor */}
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "İstek Atılıyor..." : "İndir (API Test)"}
      </button>

      {/* Hata Mesajı Gösterimi */}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Download;
