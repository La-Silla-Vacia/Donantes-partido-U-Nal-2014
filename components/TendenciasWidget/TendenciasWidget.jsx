import React from 'react';
import Widget from '../Widget';
import Select from '../Select';
import s from './TendenciasWidget.css';

class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      selectOptions: [
        {
          label: "Partidos Póliticos",
          value: "partidosPoliticos",
        },
        {
          label: "Departemento",
          value: "departemento"
        },
        {
          label: "Entidad",
          value: "entidad"
        }
      ],
    }
  }

  static switchOption(e) {
    console.log(e);
  }

  render() {
    const select = (
      <Select
        className={s.select}
        value="Partidos Póliticos"
        options={this.state.selectOptions}
        callback={Header.switchOption}
      />
    );

    return (
      <Widget
        title="Tendencias por %s para las Elecciones 2018"
        select={select}
      />
    );
  }

}

export default Header;
