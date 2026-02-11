import React from 'react';
import { Link } from 'react-router-dom';
import { Container, PageWrapper, Section } from '../components/Layout';

const Landing = () => {
  return (
    <PageWrapper className="page-full">
      <Container className="container-narrow">
        <Section className="section-center text-center">
          <div className="card auth-card stack">
            <div className="stack">
              <h1>Secure Vote</h1>
              <p className="helper">Blockchain-secured digital voting platform</p>
            </div>
            <div className="stack">
              <Link className="button" to="/login">Sign in</Link>
              <Link className="button secondary" to="/register">Create account</Link>
            </div>
          </div>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default Landing;
