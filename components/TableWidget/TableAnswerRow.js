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
    const { perfil } = this.props;

    return (
      <tr className={cx(s.row, s.answerRow)}>
        <td colSpan="5" className={cx(s.cell, s.answerCell)}>
          <div className={s.triangle} />
          <button className={s.closeBtn} onClick={this.handleClick}>
            <svg width="41px" height="41px" viewBox="545 936 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polygon id="Page-1" stroke="none"
                       points="585.513587 938.104807 583.892261 936.483481 565.258261 955.120414 546.621327 936.483481 545 938.104807 563.636934 956.741741 545 975.378674 546.621327 977 565.258261 958.363067 583.892261 977 585.513587 975.378674 566.879587 956.741741"/>
            </svg>
          </button>
          <div className={s.content}>
            <h4>Quién es</h4>
            <div dangerouslySetInnerHTML={{ __html: md.render(perfil) }}/>
          </div>
        </td>
      </tr>
    );
  }
}

export default TableRow;
