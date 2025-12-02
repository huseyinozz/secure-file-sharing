import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        Anasayfa
      </Link>
      <Link to="/upload" className="nav-link">
        Dosya Yükle
      </Link>
      <Link to="/download" className="nav-link">
        Dosya İndir
      </Link>
    </nav>
  );
};

export default Navbar;
