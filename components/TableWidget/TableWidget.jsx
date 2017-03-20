import React from 'react';
import classNames from 'classnames';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import Widget from '../Widget';
import s from './TableWidget.css';
import TableRow from './TableRow';
import AnswerRow from './TableAnswerRow';

class TableWidget extends React.Component {

  constructor() {
    super();

    this.state = {
      rows: [],
      open: false
    };

    this.handleCallback = this.handleCallback.bind(this);
  }

  componentDidMount() {
    this.formatData();
  }

  componentWillReceiveProps(newprops) {
    this.formatData(newprops.data);
  }

  formatData(newprops) {
    let data = newprops;
    if (!data) {
      data = this.props.data;
    }
    if (!data) return;
    const rows = [];
    data.map((item, index) => {
      const id = index + 1;
      let open = false;
      if (this.state.open === id) {
        open = true;
      }

      // console.log(item);

      const row = {
        grupo: item.grupo,
        cuantos: item.cuantasDonacionesHizo,
        cantidad: item.cuantoDono,
        partidos: item.aQuePartidos,
        imagen: item.imagen,
        id,
        open
      };

      rows.push(row);

      if (open) {
        const openRow = {
          perfil: item.quienEs,
          imagen: item.imagen,
          id,
          type: 'answer'
        };
        rows.push(openRow)
      }
    });
    this.setState({ rows });
  }

  handleCallback(e) {
    if (this.state.open === e) {
      this.setState({open: false});
    } else {
      this.setState({ open: e });
    }
    setTimeout(() => {
      this.formatData();
    }, 10)
  }

  getRows() {
    return this.state.rows.map((item, index) => {
      let open = false;
      if (item.id == this.props.open) {
        open = true;
      }

      if (item.type == 'answer') {
        return (
          <AnswerRow
            {...item}
            open={open}
            key={index}
            callback={this.handleCallback}
          />
        )
      } else {
        return (
          <TableRow
            {...item}
            key={index}
            callback={this.handleCallback}
          />
        )
      }
    });
  };

  render() {
    const rows = this.getRows();
    return (
      <Widget
        upperTitle="Los grandes donantes"
        upperDescription="Los grandes grupos económicos fueron los principales financiadores. Haga click en cada grupo para conocer más detalles."
        floatTitle
      >
        <table className={s.root}>
          <thead className={s.head}>
          <tr>
            <th className={s.heading}/>
            <th className={s.heading}>Grupo</th>
            <th className={s.heading}>Cuántas donaciones hizo</th>
            <th className={s.heading}>Cuánto donó</th>
            <th className={s.heading}>A qué partidos</th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      </Widget>
    );
  }
}

export default TableWidget;
