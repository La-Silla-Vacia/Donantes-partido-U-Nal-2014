import React from 'react';
import Link from '../Link';
import s from './Footer.css';

function Footer() {
  return (
    <footer className={s.root}>
      <span className={s.text}>© La Silla Vacía 2017</span>
    </footer>
  );
}

export default Footer;
