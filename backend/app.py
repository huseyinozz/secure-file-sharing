import os
import datetime
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS # <--- 1. YENİ EKLENDİ
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
import firebase_admin
from firebase_admin import credentials, storage, firestore
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# CORS EKLENDİ (React'in backend'e erişmesine izin verir)
CORS(app)

# --- FIREBASE BAĞLANTISI ---
cred_path = os.path.join(os.path.dirname(__file__), '../serviceAccountKey.json')

if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': app.config['STORAGE_BUCKET']
        })
        print("Firebase baglantisi basarili.")
    except Exception as e:
        print(f"Firebase baglanti hatasi: {e}")

# Firestore Istemcisi (Veritabani Baglantisi) - Rapor 4 Eklentisi
db = firestore.client()

# --- YARDIMCI FONKSİYONLAR ---

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def generate_key():
    return Fernet.generate_key().decode()

def encrypt_file(file_path, key):
    f = Fernet(key.encode())
    with open(file_path, 'rb') as file:
        file_data = file.read()
    encrypted_data = f.encrypt(file_data)
    encrypted_path = file_path + ".enc"
    with open(encrypted_path, 'wb') as file:
        file.write(encrypted_data)
    return encrypted_path

def decrypt_file(encrypted_path, key, original_filename):
    f = Fernet(key.encode())
    
    with open(encrypted_path, 'rb') as file:
        encrypted_data = file.read()
    
    decrypted_data = f.decrypt(encrypted_data)
    
    # Şifresi çözülmüş dosyayı kaydedeceğimiz yol
    decrypted_path = os.path.join('uploads', "decrypted_" + original_filename)
    
    with open(decrypted_path, 'wb') as file:
        file.write(decrypted_data)
        
    return decrypted_path

# --- API ENDPOINTLERİ ---

@app.route('/')
def home():
    return jsonify({"message": "Secure File Sharing API - Firestore Aktif (v0.4)"})

@app.route('/upload', methods=['POST'])
def upload_file():
    # 1. Dosya kontrolü
    if 'file' not in request.files:
        return jsonify({"error": "Dosya parçası bulunamadı"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "Dosya seçilmedi"}), 400
    
    # Filename tanimlamasi (Hata duzeltildi)
    filename = secure_filename(file.filename)

    if len(filename) > 100:
        return jsonify({"error": "Dosya adı çok uzun"}), 400

    # 2. Uzantı kontrolü ve Geçici Kayıt
    if file and allowed_file(file.filename):
        try:
            # Klasör kontrolü
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
                
            temp_path = os.path.join('uploads', filename)
            file.save(temp_path)

            # 3. Şifreleme (Encryption)
            key = generate_key()
            encrypted_path = encrypt_file(temp_path, key)

            # 4. Firebase Storage'a Yükleme
            bucket = storage.bucket()
            blob = bucket.blob(filename + ".enc")
            blob.upload_from_filename(encrypted_path)

            # --- RAPOR 4: FIRESTORE KAYDI (Metadata) ---
            # Dosya bilgilerini ve ANAHTARI veritabanina kaydediyoruz.
            doc_ref = db.collection('files').document(filename)
            doc_ref.set({
                'filename': filename,
                'original_name': file.filename,
                'encryption_key': key, # Anahtarı burada saklıyoruz!
                'upload_date': firestore.SERVER_TIMESTAMP,
                'status': 'active'
            })

            # 5. Temizlik (Cleanup)
            if os.path.exists(temp_path):
                os.remove(temp_path)
            if os.path.exists(encrypted_path):
                os.remove(encrypted_path)

            return jsonify({
                "message": "Dosya yüklendi, şifrelendi ve veritabanına kaydedildi!",
                "filename": filename,
                "firestore_status": "saved",
                "key": key
            }), 200

        except Exception as e:
            return jsonify({"error": f"Sunucu hatası: {str(e)}"}), 500
    else:
        return jsonify({"error": "İzin verilmeyen dosya türü"}), 400

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
    
        provided_key = request.args.get("key")
        if not provided_key:
            return jsonify({"error": "Şifre anahtarı gerekli"}), 400

        # 1. Firestore'dan dosya bilgisini ve ANAHTARI çek
        doc_ref = db.collection('files').document(filename)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Dosya bulunamadı"}), 404

        file_data = doc.to_dict()
        key = file_data.get('encryption_key')
        
        if provided_key != key:
            return jsonify({"error": "Geçersiz şifre anahtarı"}), 403
        
        # 2. Storage'dan şifreli dosyayı indir
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
            
        encrypted_filename = filename + ".enc"
        local_encrypted_path = os.path.join('uploads', encrypted_filename)
        
        bucket = storage.bucket()
        blob = bucket.blob(encrypted_filename)
        blob.download_to_filename(local_encrypted_path)

        # 3. Şifreyi Çöz (Decryption)
        decrypted_path = decrypt_file(local_encrypted_path, key, filename)

        # 4. Dosyayı Kullanıcıya Gönder
        # as_attachment=True sayesinde tarayıcı dosyayı direkt indirir.
        return send_file(decrypted_path, as_attachment=True, download_name=filename)

    except Exception as e:
        return jsonify({"error": f"İndirme hatası: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
