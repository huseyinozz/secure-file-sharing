import React, { useState } from "react";
import { downloadFile } from "../services/api";

const Download = () => {
  const [filename, setFilename] = useState("");import React, { useState } from "react";
// Mevcut import'ları koru
import { downloadFile } from "../services/api";

const Download = () => {
  const [filename, setFilename] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Başarı durumunu tutmak için yeni state ekle (4. Hafta Görevi)
  const [success, setSuccess] = useState(null); 

  // Formu temizlemek için yeni fonksiyon ekle (3. Hafta Görevi)
  const handleClear = () => {
    setFilename("");
    setKey("");
    setError(null);
    setSuccess(null);
  };
  
  // API İsteği Atan Fonksiyon (Hayati'nin yazdığı kod)
  const handleDownload = async () => {
    // Hata ve Başarı mesajlarını sıfırla
    setError(null);
    setSuccess(null); 
    
    if (!filename || !key) {
      setError("Lütfen dosya adı ve anahtarı girin.");
      return;
    }

    setLoading(true);
    console.log("İndirme isteği başlatılıyor...");

    try {
      const blob = await downloadFile(filename, key);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Başarı durumunu ayarla
      setSuccess("Dosyanız başarıyla indirildi!");
      // İndirme sonrası formu temizle (3. Hafta Retrospective)
      handleClear();

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
  
  // --------------------------------------------------------
  // Senin (Frontend Dev 2) UI ve Stil Kodun Buraya Başlıyor
  // --------------------------------------------------------
  return (
    <div className="page-container">
      <div className="form-card">
        <h2>Dosya İndir</h2>
        
        {/* 4. Hafta Görevi: Başarı/Hata Mesajı Kutuları */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
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
            disabled={loading} // Yüklenirken inputu pasif yap
          />
        </div>

        {/* Şifre Girişi */}
        <div className="input-group">
          <label>Şifre Anahtarı</label>
          <div style={{ display: 'flex', gap: '10px' }}>
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
              style={{ flexGrow: 0, padding: '10px' }}
            >
              Yapıştır
            </button>
          </div>
        </div>

        {/* Butonlar Grubu (3. Hafta Görevi) */}
        <div className="button-group">
          {/* İndirme Butonu: 'handleDownload' fonksiyonuna bağlandı */}
          <button 
            className="btn btn-primary" 
            onClick={handleDownload} 
            disabled={loading || !filename || !key} // Pasif stil burada çalışır
          >
            {loading ? "İndirme İsteği Atılıyor..." : "Dosyayı İndir"}
          </button>
          
          {/* Temizleme Butonu: Yeni 'handleClear' fonksiyonuna bağlandı */}
          <button 
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Formu Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;
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
