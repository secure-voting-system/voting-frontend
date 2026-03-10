import React from "react";
import { Link } from "react-router-dom";
import {
  Vote,
  Shield,
  BarChart3,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Database,
  Activity,
  Award
} from "lucide-react";
import ThemeToggle from "../../shared/components/ThemeToggle";
import "./LandingPage.css";

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "End-to-end encrypted voting with immutable records",
    },
    {
      icon: Vote,
      title: "Easy to Use",
      description: "Simple interface for voters and administrators",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Live turnout monitoring and instant results",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Anonymous voting with verifiable receipts",
    },
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="glass landing-nav">
        <div className="nav-content">
          <h2 className="brand-title">Secure Voting</h2>
          <div className="nav-actions">
            <ThemeToggle />
            <Link to="/login">
              <button className="sidebar-item nav-btn-login">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-premium">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">


          <h1 className="animate-fade-in hero-title">
            Democracy in Every Vote
          </h1>

          <p className="animate-fade-in hero-description">
            Empowering India's democratic spirit with secure, transparent
            digital voting.
            <br />
            From student councils to community decisions - every voice matters.
          </p>

          <div className="animate-fade-in hero-actions">
            <Link to="/register">
              <button className="btn-premium btn-large" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', padding: '1.25rem 2.5rem', fontSize: '1.25rem' }}>
                Start Voting <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="/login">
              <button className="sidebar-item btn-large hover-glow" style={{ border: '1px solid var(--glass-border)', padding: '1.25rem 2.5rem', margin: 0 }}>
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Network Stats */}
      <section style={{ padding: '0 2rem 4rem', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
           <div className="card glass animate-fade-in" style={{ padding: '2rem', textAlign: 'center', borderTop: '2px solid var(--primary)' }}>
             <div className="stat-glow" style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>142k+</div>
             <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 700 }}>VERIFIED VOTERS</p>
           </div>
           <div className="card glass animate-fade-in" style={{ padding: '2rem', textAlign: 'center', borderTop: '2px solid var(--accent)', animationDelay: '0.1s' }}>
             <div className="stat-glow" style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>9,840</div>
             <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 700 }}>ACTIVE ELECTIONS</p>
           </div>
           <div className="card glass animate-fade-in" style={{ padding: '2rem', textAlign: 'center', borderTop: '2px solid #10b981', animationDelay: '0.2s' }}>
             <div className="stat-glow" style={{ fontSize: '3rem', marginBottom: '0.25rem', color: '#10b981', background: 'none', WebkitTextFillColor: '#10b981' }}>100%</div>
             <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 700 }}>SYSTEM UPTIME</p>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Why Choose Secure Voting?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card glass animate-fade-in feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon-wrapper">
                  <feature.icon size={32} color="var(--primary)" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="features-section" style={{ background: 'transparent', paddingBottom: '2rem' }}>
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative' }}>
            <div className="card glass animate-fade-in step-card">
               <div className="step-number">01</div>
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Register Identity</h3>
               <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Create a secure profile that separates your true identity from your ballot.</p>
            </div>
            <div className="card glass animate-fade-in step-card" style={{ animationDelay: '0.1s' }}>
               <div className="step-number">02</div>
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Navigate & Select</h3>
               <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Review candidate manifestos and securely register your preference.</p>
            </div>
            <div className="card glass animate-fade-in step-card" style={{ animationDelay: '0.2s' }}>
               <div className="step-number">03</div>
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Cryptographic Proof</h3>
               <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Receive an immutable receipt hash to verify your vote in the public ledger.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="card glass cta-card">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-text">
            Join thousands of voters and administrators using Secure Voting for
            secure elections.
          </p>
          <Link to="/register">
            <button className="btn-premium btn-cta">
              Create Free Account <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          © {new Date().getFullYear()} Secure Voting. Empowering Democratic India.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
