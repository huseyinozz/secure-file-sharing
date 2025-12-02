// src/services/api.js
// Sprint 2: Backend simülasyonu ve bağlantı ayarları

const API_BASE_URL = "http://127.0.0.1:5000";
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
    }, 1500); // 1.5 saniye bekleme efekti
  });
};

// --- GERÇEK SERVİS ---
const realUpload = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Backend Bağlantı Hatası");
  return response.json();
};

export const uploadFile = USE_MOCK_DATA ? mockUpload : realUpload;
