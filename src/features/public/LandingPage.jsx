import React from "react";
import { Link } from "react-router-dom";
import {
  Vote,
  Shield,
  BarChart3,
  Lock,
  ArrowRight,
  CheckCircle2,
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
          <div className="animate-fade-in trust-badge-container">
            <div className="trust-badge">
              <CheckCircle2 size={16} color="var(--primary)" />
              <span className="trust-text">Trusted by 50+ Organizations</span>
            </div>
          </div>

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
              <button className="btn-premium btn-large">
                Start Voting <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="/login">
              <button className="sidebar-item btn-large">
                View Demo
              </button>
            </Link>
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
