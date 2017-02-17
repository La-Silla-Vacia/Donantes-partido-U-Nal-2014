import React from 'react';
import cx from 'classnames';
import Item from './Item';
import s from './Select.css';

class Select extends React.Component {

  constructor() {
    super();

    this.state = {
      open: false,
      currentOption: "",
      options: [],
    };

    this.openSelect = this.openSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getOptions() {
    return this.state.options.map((option, index) => {
      return (
        <Item
          key={index}
          value={option}
          callback={this.handleClick}
        >
          {option.label}
        </Item>
      );
    });
  }

  handleClick(option) {
    this.setState({
      currentOption: option.label
    });
    this.props.callback(option);

    const optionIndex = this.props.options.indexOf(option);

    const newOptions = [
      this.props.options[optionIndex]
    ];
    for (let i = 0; i < this.props.options.length; i += 1) {
      if (i != optionIndex)
        newOptions.push(this.props.options[i]);
    }

    this.state.options = newOptions;
    this.setState({open: false});
  }

  componentWillMount() {
    this.state.currentOption = this.props.value;
    this.state.options = this.props.options;
  }

  render() {
    const options = this.getOptions();

    return (
      <div className={cx(s.root, {[s.root__open]: this.state.open})}
           onClick={this.openSelect}
           onKeyDown={this.openSelect} tabIndex="0">
        <span>{this.state.currentOption}</span>
        <div className={s.inner}>
          {options}
        </div>
      </div>
    );
  }

  openSelect(e) {
    if (e.type === "keydown") {
      if (e.keyCode === 13) {
        this.setState({open: !this.state.open});
      }
    } else {
      this.setState({open: !this.state.open});
    }
  }

}

export default Select;
