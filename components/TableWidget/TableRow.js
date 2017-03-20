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
    const {grupo, cuantos, cantidad, partidos, id, open} = this.props;
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
        <td className={s.cell}>{cuantos}</td>
        <td className={s.cell} dangerouslySetInnerHTML={{ __html: (cantidad).formatMoney(0, '.', ',') }} />
        <td className={s.cell} dangerouslySetInnerHTML={{ __html: md.render(partidos) }} />
        {/*<td className={s.cell} dangerouslySetInnerHTML={{ __html: md.render(partidos) }} />*/}
      </tr>
  );
  }
}

Number.prototype.formatMoney = function(w, x, y){
  let n = this,
    c = isNaN(w = Math.abs(w)) ? 2 : w,
    d = x == undefined ? "." : x,
    t = y == undefined ? "," : y,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

export default TableRow;
