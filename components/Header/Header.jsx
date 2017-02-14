/* eslint-disable */
import React from 'react';
/* eslint-enable */
import Navigation from '../Navigation';
import Link from '../Link';
import s from './Header.css';

class Header extends React.Component {
  render() {
    return (
      <header className={s.root} ref={node => (this.root = node)}>
        <div className={s.row}>
          <Link className={s.title} to="/">
            <img src="logo_silla_logosimbolo.svg" width="240" alt="Logo La Silla Vacía" />
          </Link>
          <Navigation />
        </div>
      </header>
    );
  }

}

export default Header;
