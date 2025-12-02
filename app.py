import os
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, storage
from config import Config

app = Flask(__name__)

# Rapor 2: Config ayarlarinin yuklenmesi
app.config.from_object(Config)

# Rapor 2: Firebase Baglantisi
# serviceAccountKey.json dosyasi proje ana dizininde olmalidir (GitHub'a yuklenmez)
cred_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

# Baglanti kontrolu (Singleton yapisi - Uygulama yeniden baslatilmadan tekrar initialize edilmesini onler)
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': app.config['STORAGE_BUCKET']
        })
        print("Firebase baglantisi basarili.")
    except Exception as e:
        print(f"Firebase baglanti hatasi: {e}")

@app.route('/')
def home():
    # Rapor 2'de henuz upload/download fonksiyonlari yok, sadece baglanti testi var.
    return jsonify({"message": "Secure File Sharing API - Firebase Baglantisi Aktif (v0.2)"})

if __name__ == '__main__':
    app.run(debug=True)
    
    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSiONS']


def generate_key():
    return Fernet.generate_key().decode()


# Dosya sifreleme
def encrypt_file(file_path, key):
    cipher = Fernet(key.encode())
    with open(file_path, 'rb') as f:
        encrypted_data = cipher.encrypt(f.read())
    # Şifrelenmiş veriyi FARKLI BİR DOSYAYA yazıyoruz
    encrypted_path = file_path + ".enc"
    with open(encrypted_path, 'wb') as f:
        f.write(encrypted_data)
    os.remove(file_path)  # Orijinal dosyayı sil
    return encrypted_path

