import React from 'react';

export const PageWrapper = ({ children, className = '' }) => (
  <div className={`page-wrapper ${className}`.trim()}>{children}</div>
);

export const Container = ({ children, className = '' }) => (
  <div className={`container ${className}`.trim()}>{children}</div>
);

export const Section = ({ children, className = '' }) => (
  <section className={`section ${className}`.trim()}>{children}</section>
);