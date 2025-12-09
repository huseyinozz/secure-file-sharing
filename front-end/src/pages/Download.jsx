import React, { useState } from 'react';
import { downloadFile } from '../services/api';

const Download = () => {
  const [filename, setFilename] = useState("");
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);

    // API İsteği Atan Fonksiyon (Scrum 1 Hedefi)
    const handleDownload = async () => {
        if (!filename || !key) {
            alert("Lütfen dosya adı ve anahtar girin!");
            return;
        }

        setLoading(true);
        console.log("İndirme isteği başlatılıyor...");

        try {
            const blob = await downloadFile(filename, key);
            console.log("Veri alındı (Blob):", blob);
            // Blob işleme kısmı sonraki scrum'da yapılacak
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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
            onChange={(e) => setFilename(e.target.value)} 
        />
        <br />
        <input 
            type="text" 
            placeholder="Anahtar" 
            onChange={(e) => setKey(e.target.value)} 
        />
        <br />
        <button onClick={handleDownload} disabled={loading}>
            {loading ? "İstek Atılıyor..." : "İndir (API Test)"}
        </button>
    </div>
  );
};

export default Download;
