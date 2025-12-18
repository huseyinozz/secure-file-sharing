import os

class Config:
    # Rapor 2: Config ayarlari ve Bucket tanimlamasi
    # Guvenlik icin SECRET_KEY ortam degiskeninden alinmali
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'guvenli-bir-anahtar-varsayilan'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    MAX_CONTENT_LENGTH = 20 * 1024 * 1024  # 20 MB

    
    # Firebase Storage Bucket Adi
    STORAGE_BUCKET = 'file-sharing-master-fbccc.appspot.com'
