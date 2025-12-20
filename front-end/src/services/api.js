const API_BASE_URL = "http://127.0.0.1:5000";
/**
 * --------------------------------------------------------------------------
 * [GELİŞTİRİCİ NOTU - BACKEND ENTEGRASYONU]
 * --------------------------------------------------------------------------
 * Varsayılan Durum: TRUE (Mock Data)
 * * Neden?
 * Her geliştiricinin local ortamında farklı Firebase hesapları ve Config dosyaları
 * bulunduğu için, proje pull edildiğinde doğrudan çalışabilmesi adına
 * varsayılan olarak 'Mock Data' (Sahte Veri) ile çalışmaktadır.
 * * Gerçek Backend İle Test Etmek İçin Adımlar:
 * 1. Aşağıdaki 'USE_MOCK_DATA' değişkenini 'false' yapın.
 * 2. Backend sunucusunun (app.py) 5000 portunda çalıştığından emin olun.
 * 3. Backend tarafında 'flask-cors' kütüphanesinin kurulu olduğunu doğrulayın.
 * 4. 'config.py' içinde geçerli bir Firebase Bucket adresi tanımlı olmalıdır.
 */
const USE_MOCK_DATA = true; // Backend hazır olana kadar TRUE kalsın

// --- MOCK (SAHTE) SERVİS ---
const mockUpload = () => {
  return new Promise((resolve) => {
    console.log("📡 Mock Service: Dosya gönderiliyor...");
    setTimeout(() => {
      // Başarılı bir senaryo uyduruyoruz
      resolve({
        success: true,
        key:
          "TEST-KEY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: "Dosya başarıyla şifrelendi (Simülasyon)",
      });
    }, 2000);
  });
};

const mockDownload = (filename, key) => {
  return new Promise((resolve, reject) => {
    console.log(`Mock Download: ${filename} dosyası indiriliyor...`);
    setTimeout(() => {
      // Basit bir doğrulama simülasyonu
      if (!key || key.length < 5) {
        reject({ status: 403, message: "Hatalı veya eksik anahtar!" });
      } else {
        // Başarılı ise sahte bir dosya (Blob) döndür
        const mockContent = "Bu, şifresi çözülmüş gizli dosya içeriğidir.";
        const blob = new Blob([mockContent], { type: "text/plain" });
        resolve(blob);
      }
    }, 2000);
  });
};

// --- GERÇEK SERVİS ---
const realUpload = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Backend Yükleme Hatası");
  }
  return response.json();
};

const realDownload = async (filename, key) => {
  // Backend'e POST isteği atıyoruz, cevap tipi 'blob' (dosya) olmalı
  const url = `${API_BASE_URL}/download/${filename}?key=${encodeURIComponent(
    key
  )}`;

  const response = await fetch(url, {
    method: "GET", // Backend GET istiyor, POST değil. Burası düzeltildi.
  });

  if (!response.ok) {
    // Hata durumunda JSON cevabını okumaya çalış
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.error || "İndirme Hatası",
    };
  }

  return response.blob(); // Dosya verisini döndür
};

export const uploadFile = USE_MOCK_DATA ? mockUpload : realUpload;
export const downloadFile = USE_MOCK_DATA ? mockDownload : realDownload;
