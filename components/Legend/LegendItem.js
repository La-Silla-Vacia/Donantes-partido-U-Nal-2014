import React from 'react';
import cx from 'classnames';
import s from './Legend.css';

class LegendItem extends React.Component {
  constructor() {
    super();

    this.mouseEnter = this.mouseEnter.bind(this);
  }

  mouseEnter() {
    this.props.hoverCk(this.props.nodeId);
  }

  render() {
    const partido = this.props;

    return (
      <li className={cx(s.item, {[s.item__hover]: this.props.hovering})}
          key={partido.nodeId}
          onMouseEnter={this.mouseEnter}
          onClick={this.mouseEnter}
      >
        <span className={s.bullet} style={{backgroundColor: partido.colorPartido}}/>
        {partido.name}
      </li>
    )
  }

}

export default LegendItem;
