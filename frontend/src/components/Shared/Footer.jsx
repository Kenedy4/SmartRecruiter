import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Smart Recruiter. All rights reserved.</p>
      <p>
        <a href="/contact">Contact Us</a> | <a href="/privacy">Privacy Policy</a>
      </p>
    </footer>
  );
};

export default Footer;
