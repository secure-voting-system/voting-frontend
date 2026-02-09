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
  Zap,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        color: "var(--text-primary)",
      }}
    >
      {/* Navbar */}
      <nav
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "1.5rem 2rem",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 800,
              background:
                "linear-gradient(to right, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BHARAT VOTE
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <ThemeToggle />
            <Link to="/login">
              <button
                className="sidebar-item"
                style={{ margin: 0, padding: "0.75rem 1.5rem" }}
              >
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-premium">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="animate-fade-in" style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(99, 102, 241, 0.1)",
                padding: "0.5rem 1.25rem",
                borderRadius: "999px",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                marginBottom: "2rem",
              }}
            >
              <CheckCircle2 size={16} color="var(--primary)" />
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                }}
              >
                Trusted by 50+ Organizations
              </span>
            </div>
          </div>

          <h1
            className="animate-fade-in"
            style={{
              fontSize: "4rem",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              background:
                "linear-gradient(135deg, var(--primary), white, var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Democracy in Every Vote
          </h1>

          <p
            className="animate-fade-in"
            style={{
              fontSize: "1.25rem",
              color: "var(--text-secondary)",
              marginBottom: "3rem",
              lineHeight: 1.6,
              animationDelay: "0.1s",
            }}
          >
            Empowering India's democratic spirit with secure, transparent
            digital voting.
            <br />
            From student councils to community decisions - every voice matters.
          </p>

          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              animationDelay: "0.2s",
            }}
          >
            <Link to="/register">
              <button
                className="btn-premium"
                style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
              >
                Start Voting <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="/login">
              <button
                className="sidebar-item"
                style={{ margin: 0, padding: "1rem 2rem", fontSize: "1.1rem" }}
              >
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{ padding: "4rem 2rem", background: "rgba(255,255,255,0.02)" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            Why Choose BHARAT VOTE?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="card glass animate-fade-in"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "1.25rem",
                    background: "rgba(99, 102, 241, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <feature.icon size={32} color="var(--primary)" />
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <div
          className="card glass"
          style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 3rem" }}
        >
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
            }}
          >
            Join thousands of voters and administrators using BHARAT VOTE for
            secure elections.
          </p>
          <Link to="/register">
            <button
              className="btn-premium"
              style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}
            >
              Create Free Account <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: "1px solid var(--glass-border)",
        }}
      >
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          © 2024 BHARAT VOTE. Empowering Democratic India.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
