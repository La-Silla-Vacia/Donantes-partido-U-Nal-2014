import React from 'react';
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
import cx from 'classnames';

import s from './TableWidget.css';

class TableRow extends React.Component {

  constructor() {
    super();
    this.state = {
      isSelected: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.id);
  }

  render() {
    const {grupo, cantidad,	valor, partidos, id, open} = this.props;
    let imagen = this.props.imagen;
    if (!imagen) {
      imagen = 'http://archivo.lasillavacia.com/archivos/historias/odebrecht/15.jpg';
    }

    return (
      <tr
        onClick={this.handleClick}
        className={cx(
          s.row,
          {[s.rowStriped]: id % 2},
          {[s.rowOpen]: open}
        )}
      >
        <td className={s.cell}>
          <figure className={s.imageContainer}>
            <img className={s.image} width="100" src={ imagen } alt="" />
          </figure>
        </td>
        <td className={cx(s.cell, s.grupo)} dangerouslySetInnerHTML={{ __html: md.render(grupo) }} />
        <td className={s.cell} dangerouslySetInnerHTML={{ __html: md.render(cantidad) }} />
        <td className={s.cell} dangerouslySetInnerHTML={{ __html: md.render(valor) }} />
        <td className={s.cell} dangerouslySetInnerHTML={{ __html: md.render(partidos) }} />
      </tr>
  );
  }
}

export default TableRow;
