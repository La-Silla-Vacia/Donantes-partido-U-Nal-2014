import React, { PropTypes } from 'react';
import s from './Widget.css';

class Header extends React.Component {

   static propTypes = {
    select: PropTypes.node,
    children: PropTypes.node,
  };

  render() {
    const titleParts = this.props.title.split('%s');
    const title = (
      <h2 className={s.title}>
        {titleParts[0]}
        {this.props.select}
        {titleParts[1]}
      </h2>);

    return (
      <section className={s.root}>
        {title}
        {this.props.children}
      </section>
    );
  }

}

export default Header;
