import React from 'react';
import cx from 'classnames';
import Item from './LegendItem';
import s from './Legend.css';

class Legend extends React.Component {

  constructor() {
    super();

    this.state = {
      items: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({items: nextProps.items});
  }

  Cbf(id) {
    if (this.props.hoverCallback)
      this.props.hoverCallback(id);
  }

  getPartidos() {
    if (!this.state.items) return;
    return this.state.items.map((partido, index) => {
      let hovering = false;
      if (this.props.hovering.length) {
        if (this.props.hovering.indexOf(partido.nodeId) !== -1) {
          hovering = true;
        }
      }

      return (
        <Item key={index} hovering={hovering} index={index} hoverCk={this.Cbf.bind(this)} {...partido} />
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
