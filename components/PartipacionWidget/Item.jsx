import React from 'react';
import cx from 'classnames';
import s from './PartipacionWidget.css';

class PartipacionWidgetItem extends React.Component {
  constructor() {
    super();

    this.state = {
      active: false,
      strokeWidth: 1,
      color: "#ff0000",
      path: "",
      hover: false,
      maskHeight: 0,
      going: false,
    };

    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
  }

  mouseEnter(e) {
    // this.setState({hover: true});
    this.props.hoverCallback(this.props.index);
  }

  mouseLeave(e) {
    this.setState({hover: false});
  }

  render() {

    let maskHeight = 0;
    if (this.props.active || this.state.hover) {
      maskHeight = 1000;
    }

    return (
      <g>
        <mask className={s.mask} id={`mask-${this.props.index + 1}`} x="-200" y="0" width="1500" height="1000">
          <rect x="-100" y="0" width="1600" height={maskHeight} className={s.maskLayer}
                style={{stroke: "none", fill: "#ffffff"}}/>
        </mask>
        <path className={cx(s.link)}
              d={this.props.path}
              style={{strokeWidth: this.props.strokeWidth, stroke: this.props.color}}
              transform="translate(0, 15)"
        />
        <path onMouseEnter={this.mouseEnter}
              onClick={this.mouseEnter}
              onMouseLeave={this.mouseLeave}
              className={cx(s.link__hover)}
              d={this.props.path}
              style={{strokeWidth: this.props.strokeWidth, stroke: this.props.color}}
              transform="translate(0, 15)"
              mask={`url(#mask-${this.props.index + 1})`}
        />
      </g>
    )
  }
}

export default PartipacionWidgetItem;
