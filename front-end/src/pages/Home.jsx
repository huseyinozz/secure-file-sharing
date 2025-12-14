import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div style={{ marginTop: "50px" }}>
        <h1 style={{ fontSize: "3rem", color: "#333", marginBottom: "20px" }}>
          Güvenli Dosya Paylaşımı
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "40px" }}>
          Dosyalarınızı uçtan uca şifreleyin ve güvenle paylaşın.
        </p>
      </div>
    </div>
  );
};

export default Home;
