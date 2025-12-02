from flask import Flask, jsonify

app = Flask(__name__)

# Rapor 1: Flask sunucusunun ayaga kaldirilmasi
@app.route('/')
def home():
    return jsonify({"message": "Secure File Sharing API Calisiyor (v0.1)"})

if __name__ == '__main__':
    app.run(debug=True)
