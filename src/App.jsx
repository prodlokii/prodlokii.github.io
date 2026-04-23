import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play, MapPin, Mail } from 'lucide-react';
import { FaInstagram, FaSoundcloud } from 'react-icons/fa';

const ReactiveHeader = () => {
  const characters = "LOKI".split("");

  return (
    <div className="reactive-header-container">
      <div className="reactive-header">
        <h1 className="neon-glow-text">
          {characters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
      </div>
    </div>
  );
};

const TRACKS = [
  { id: 1, title: 'Bubble', url: 'https://soundcloud.com/lok-19200522/bubble-loki' },
  { id: 2, title: 'Switch', url: 'https://soundcloud.com/lok-19200522/switch-loki' },
];

const App = () => {
  return (
    <div className="app-container">
      {/* Background System */}
      <div className="bg-system">
        <div className="noise-overlay"></div>
        <div className="bg-blobs">
          <motion.div
            animate={{
              x: [0, 200, -100, 0],
              y: [0, 100, 200, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="blob blob-1"
          />
          <motion.div
            animate={{
              x: [0, -150, 150, 0],
              y: [0, 200, -100, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="blob blob-2"
          />
          <motion.div
            animate={{
              x: [0, 100, -200, 0],
              y: [0, -150, 100, 0],
              scale: [1, 1.1, 0.8, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="blob blob-3"
          />
        </div>

        {/* Playful Decorations */}
        <div className="decorations">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh"
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                position: 'absolute',
                fontSize: 20 + Math.random() * 20 + "px",
                color: ['#fff', '#39ff14', '#00ffff', '#ffeb3b'][Math.floor(Math.random() * 4)]
              }}
            >
              ★
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navbar - Floating Pill */}
      <nav className="navbar-container">
        <div className="navbar-pill glass">
          <a href="#tracks" className="nav-item">TRACKS</a>
          <div className="nav-divider"></div>
          <a href="https://soundcloud.com/lok-19200522" target="_blank" rel="noreferrer" className="nav-icon"><FaSoundcloud size={20} /></a>
          <a href="https://instagram.com/prodlokii" target="_blank" rel="noreferrer" className="nav-icon"><FaInstagram size={20} /></a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <ReactiveHeader />
          <p className="hero-subtitle">BEATMAKER / PRODUCER</p>
          <div className="hero-cta">
            <a href="#tracks" className="btn btn-primary glow">LISTEN NOW</a>
            <a href="https://soundcloud.com/lok-19200522" target="_blank" rel="noreferrer" className="btn btn-secondary">SOUNDCLOUD</a>
          </div>
        </motion.div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="tracks">
        <div className="section-header">
          <h2>LATEST RELEASES</h2>
          <div className="header-line"></div>
        </div>
        <div className="track-grid">
          {TRACKS.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="track-card glass"
            >
              <div className="track-info">
                <h3>{track.title}</h3>
                <p>Loki</p>
              </div>
              <a
                href={track.url}
                target="_blank"
                rel="noreferrer"
                className="play-btn"
              >
                <Play fill="white" size={20} />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer glass">
        <p>&copy; {new Date().getFullYear()} prodlokii.</p>
      </footer>

      {/* Embedded Styles for App specific components */}
      <style>{`
        .app-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .bg-system {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(135deg, #ff00ff, #00ffff, #39ff14, #ffeb3b);
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite, hue-rotate 20s linear infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes hue-rotate {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(360deg); }
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.15;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
        }

        .bg-blobs {
          position: absolute;
          inset: 0;
          opacity: 0.8;
          filter: blur(80px);
        }

        .blob {
          position: absolute;
          width: 50vw;
          height: 50vw;
          border-radius: 50%;
        }

        .blob-1 { background: #ffeb3b; top: -10%; left: -5%; opacity: 0.6; }
        .blob-2 { background: #00ffff; bottom: -10%; right: -5%; opacity: 0.6; }
        .blob-3 { background: #ff00ff; top: 40%; left: 30%; opacity: 0.4; }

        .navbar-container {
          position: fixed;
          top: 30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 1000;
        }

        .navbar-pill {
          padding: 12px 35px;
          display: flex;
          align-items: center;
          gap: 25px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .nav-item {
          font-size: 1rem;
          font-weight: 800;
          color: white;
          font-family: var(--font-heading);
          transition: 0.3s;
        }

        .nav-item:hover {
          color: #f06292;
          transform: translateY(-2px);
        }

        .nav-icon {
          color: white;
          display: flex;
          align-items: center;
          transition: 0.3s;
        }

        .nav-icon:hover {
          color: #f06292;
          transform: scale(1.2);
        }

        .nav-divider {
          width: 2px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        .neon-glow-text {
          font-size: clamp(4rem, 15vw, 12rem);
          font-family: var(--font-heading);
          color: white;
          position: relative;
          text-transform: uppercase;
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.5);
          text-shadow: 8px 8px 0px rgba(240, 98, 146, 0.2),
                       16px 16px 0px rgba(255, 255, 255, 0.1);
          animation: float 5s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }

        .hero-subtitle {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ad1457;
          background: rgba(255, 255, 255, 0.6);
          display: inline-block;
          padding: 8px 25px;
          border-radius: 50px;
          border: 2px solid white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          margin: 0 auto 40px;
          letter-spacing: 2px;
          text-align: center;
        }

        .hero-cta {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .btn {
          padding: 18px 40px;
          border-radius: 100px;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f48fb1, #f06292);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 15px 30px rgba(240, 98, 146, 0.3);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #90caf9, #64b5f6);
          color: white;
        }

        .btn-secondary:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 15px 30px rgba(100, 181, 246, 0.3);
        }

        section {
          padding: 120px 5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .hero {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        .section-header h2 {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 10px;
          text-align: center;
        }

        .header-line {
          width: 80px;
          height: 6px;
          background: #f06292;
          border-radius: 10px;
          margin: 10px auto 40px;
        }

        .track-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .track-card {
          padding: 30px;
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid white;
          border-radius: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          transition: 0.4s;
        }

        .track-card:hover {
          transform: translateY(-10px);
          background: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        }

        .track-info h3 {
          font-size: 1.6rem;
          margin-bottom: 5px;
          color: #ad1457;
        }

        .track-info p {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .play-btn {
          width: 65px;
          height: 65px;
          background: #e1f5fe;
          color: #03a9f4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          border: 2px solid white;
        }

        .play-btn:hover {
          transform: scale(1.15) rotate(15deg);
          background: #f06292;
        }

        .play-btn:hover svg {
          stroke: white;
          fill: white;
        }

        .footer {
          margin: 40px 20px 20px;
          padding: 15px 30px;
          background: rgba(255, 255, 255, 0.6);
          border: 2px solid white;
          border-radius: 100px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
          width: calc(100% - 40px);
        }

        .footer p {
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
          letter-spacing: 1px;
        }

        @media (max-width: 600px) {
          .hero-cta { flex-direction: column; width: 100%; }
          .btn { width: 100%; }
          .footer { flex-direction: column; text-align: center; gap: 30px; }
        }
      `}</style>
    </div>
  );
};

export default App;
