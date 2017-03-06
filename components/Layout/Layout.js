import React, {PropTypes} from 'react';
import cx from 'classnames';
import Footer from '../Footer';
import s from './Layout.css';

class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={s.root} ref={node => (this.root = node)}>
        <main>
          <div {...this.props} className={cx(s.content, this.props.className)}/>
        </main>
      </div>
    );
  }
}

export default Layout;
