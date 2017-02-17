import React from 'react';
import cx from 'classnames';
import s from './PartipacionWidget.css';

class PartipacionWidgetNode extends React.Component {
  constructor() {
    super();

    this.state = {
      active: false,
      color: "",
      path: "",
      hover: false
    };

    this.mouseEnter = this.mouseEnter.bind(this);
  }

  mouseEnter() {
    // this.setState({hover: true});
    let type = "partido";
    let id = this.props.nodeId;
    if (this.props.y > 1) {
      type = "entidad";
      id = this.props.nodeId;
    }
    this.props.hoverCallback(type, id);
  }

  componentDidMount() {
    // console.log(this.props);
  }

  render() {

    let y = this.props.y;
    let text;
    let color = this.props.colorPartido;
    if (y > 1) {
      y += 30;
      text = <text textAnchor="left" x="30" y={`-${this.props.width / 2}`} dy=".35em"
                   transform="rotate(90)">{this.props.name}</text>;
      color = "#000";
    }

    return (
      <g
        onMouseEnter={this.mouseEnter}
        onClick={this.mouseEnter}
        className={cx(s.node, {[s.node__active]: this.props.active})}
        transform={`translate(${this.props.x},${y})`}>
        <rect height="20" width={this.props.width} style={{fill: color}}>
          <title>{this.props.name}</title>
        </rect>
        {text}
      </g>
    )
  }
}

export default PartipacionWidgetNode;
