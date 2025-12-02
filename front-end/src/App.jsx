import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Primitive Navbar (Gezinme Menüsü) */}
      <nav>
        <Link to="/">Ana Sayfa</Link> | <Link to="/upload">Dosya Yükle</Link> |{" "}
        <Link to="/download">Dosya İndir</Link>
      </nav>

      {/* Sayfa Yönlendirmeleri (Router Structure) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </Router>
  );
}

export default App;
