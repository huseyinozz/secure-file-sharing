import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Navbar = () => {
 return (
    <nav style={{ background: '#333', padding: '15px', color: 'white' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Ana Sayfa</Link></li>
        <li><Link to="/upload" style={{ color: 'white', textDecoration: 'none' }}>Dosya Yükle</Link></li>
        <li><Link to="/download" style={{ color: 'white', textDecoration: 'none' }}>Dosya İndir</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
