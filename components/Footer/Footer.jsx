import React from 'react';
import Link from '../Link';
import s from './Footer.css';

function Footer() {
  return (
    <footer className={s.root}>
      <div className="mdl-mini-footer__left-section">
        <div className="mdl-logo">© Company Name</div>
        <ul className="mdl-mini-footer__link-list">
          <li><Link to="/privacy">Privacy & Terms</Link></li>
          <li><Link to="/not-found">Not Found</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
