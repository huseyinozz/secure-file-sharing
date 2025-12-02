import React, { useState } from 'react';

const Upload = () => {
  return (
    <div className="container">
      <h2>Dosya Yükle ve Şifrele</h2>
      
      <div className="upload-form">    // Yükle-Input butonu
        <input type="file" className="file-input" />
        <br />
        <button className="upload-btn">Yükle</button>
      </div>
      <div className="result-area" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>     // Key gösterim alanı
        <h3>İşlem Sonucu</h3>
        <p>Dosyanız şifrelendi! Erişim anahtarınız:</p>
        <div className="key-display" style={{ background: '#e8f0fe', padding: '10px', fontFamily: 'monospace', fontSize: '1.2em' }}>
            A1b2-C3d4-E5f6-G7h8 
        </div>
        <button style={{ marginTop: '10px', backgroundColor: '#2ecc71' }}>     // Kopyala butonu
          Anahtarı Kopyala
        </button>
      </div>
    </div>
  );
};

export default Upload;
