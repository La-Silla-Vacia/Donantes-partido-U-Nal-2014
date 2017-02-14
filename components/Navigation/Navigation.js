import React from 'react';
import cx from 'classnames';
import Link from '../Link';
import s from './Navigation.css';

class Navigation extends React.Component {

  constructor() {
    super();

    this.navItems = [
      {
        title: 'Las sillas',
        link: '/',
      },
      {
        title: 'Temas',
        link: '/',
      },
      {
        title: 'Quien es Quien',
        link: '/',
      },
      {
        title: 'Album del clientelismo',
        link: '/',
        active: true,
      },
      {
        title: 'Hagame el cruce',
        link: '/',
      },
      {
        title: 'IQ',
        link: '/',
      },
      {
        title: 'Opinión',
        link: '/',
      },
      {
        title: 'En vivo',
        link: '/',
      },
      {
        title: 'Laboratorio',
        link: '/',
      },
      {
        title: 'La Silla Llena',
        link: '/',
      },
    ];
  }

  getNavItems() {
    const activeClassName = s.link__active;
    return this.navItems.map((item, key) => {
      return (
        <li className={s.list__item} key={key}>
          <Link
            className={cx(s.link, {[activeClassName]: item.active})}
            to="/">
            { item.title }
          </Link>
        </li>
      );
    });
  }

  render() {
    const navItems = this.getNavItems();

    return (
      <nav className={s.root} ref={node => (this.root = node)}>
        <ul className={s.list}>
          {navItems}
        </ul>
      </nav>
    );
  }

}

export default Navigation;
