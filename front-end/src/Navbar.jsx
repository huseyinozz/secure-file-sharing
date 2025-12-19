import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Navbar = () => {
  const navStyle = {
    background: '#333',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  };

  const ulStyle = {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold'
  };

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li><Link to="/" style={linkStyle}>Ana Sayfa</Link></li>
        <li><Link to="/upload" style={linkStyle}>Dosya Yükle</Link></li>
        <li><Link to="/download" style={linkStyle}>Dosya İndir</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
