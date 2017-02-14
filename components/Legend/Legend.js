import React from 'react';
import cx from 'classnames';
import Link from '../Link';
import s from './Legend.css';

class Legend extends React.Component {

  constructor() {
    super();

  }

  getPartidos() {
    return this.props.partidos.map((partido, index) => {
      return (
        <li className={cx(s.item, {[s.item__hover]: (partido.partidoId == this.props.hovering)})}
            key={partido.partidoId}
        >
          <span className={s.bullet} style={{backgroundColor: partido.colorPartido}}/>
          {partido.name}
        </li>
      );
    });
  }

  render() {
    const partidos = this.getPartidos();

    return (
      <nav className={cx(s.root, {[s.root__hovering]: this.props.hovering})} ref={node => (this.root = node)}>
        <ul className={s.list}>
          {partidos}
        </ul>
      </nav>
    );
  }

}

export default Legend;
