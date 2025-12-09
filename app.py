import os
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
import firebase_admin
from firebase_admin import credentials, storage
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# --- FIREBASE BAĞLANTISI (Rapor 2'den gelen kısım) ---
cred_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': app.config['STORAGE_BUCKET']
        })
        print("Firebase baglantisi basarili.")
    except Exception as e:
        print(f"Firebase baglanti hatasi: {e}")

# --- YARDIMCI FONKSİYONLAR (Backend 2'den gelen kısımlar) ---

def allowed_file(filename):
    # Güvenli dosya uzantısı kontrolü
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def generate_key():
    # Şifreleme için rastgele anahtar üretir
    return Fernet.generate_key().decode()

def encrypt_file(file_path, key):
    # Dosyayı okur, şifreler ve .enc uzantısıyla kaydeder
    f = Fernet(key.encode())
    
    with open(file_path, 'rb') as file:
        file_data = file.read()
        
    encrypted_data = f.encrypt(file_data)
    encrypted_path = file_path + ".enc"
    
    with open(encrypted_path, 'wb') as file:
        file.write(encrypted_data)
        
    return encrypted_path

# --- API ENDPOINTLERİ (Rapor 3: Senin Görevin) ---

@app.route('/')
def home():
    return jsonify({"message": "Secure File Sharing API Calisiyor (v0.3)"})

@app.route('/upload', methods=['POST'])
def upload_file():
    # 1. Dosya kontrolü
    if 'file' not in request.files:
        return jsonify({"error": "Dosya parçası bulunamadı"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "Dosya seçilmedi"}), 400

    # 2. Uzantı kontrolü ve Geçici Kayıt
    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            
            # 'uploads' klasörü yoksa oluştur
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
                
            temp_path = os.path.join('uploads', filename)
            file.save(temp_path)

            # 3. Şifreleme (Encryption)
            key = generate_key()
            encrypted_path = encrypt_file(temp_path, key) # .enc uzantılı dosya oluşur

            # 4. Firebase Storage'a Yükleme (Rapor 3 Asıl Görev)
            bucket = storage.bucket()
            blob = bucket.blob(filename + ".enc") # Buluta .enc adıyla kaydet
            blob.upload_from_filename(encrypted_path)

            # 5. Temizlik (Cleanup)
            # Güvenlik gereği sunucuda dosya bırakmıyoruz
            if os.path.exists(temp_path):
                os.remove(temp_path) # Orijinal dosyayı sil
            if os.path.exists(encrypted_path):
                os.remove(encrypted_path) # Şifreli yerel kopyayı sil

            return jsonify({
                "message": "Dosya basariyla sifrelendi ve Firebase'e yuklendi!",
                "filename": filename,
                "key": key  # Bu anahtarı saklamalısın, indirme için lazım olacak!
            }), 200

        except Exception as e:
            return jsonify({"error": f"Sunucu hatası: {str(e)}"}), 500
    else:
        return jsonify({"error": "İzin verilmeyen dosya türü"}), 400

if __name__ == '__main__':
    app.run(debug=True)
