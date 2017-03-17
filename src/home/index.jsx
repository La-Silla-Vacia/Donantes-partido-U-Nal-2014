import React from 'react';
import 'whatwg-fetch';
import Layout from '../../components/Layout';
import TableWidget from '../../components/TableWidget';
import Partipacion from '../../components/PartipacionWidget';
import Presupuesto from '../../components/PresupuestoWidget';
import s from './styles.css';
import { title, html } from './index.md';

class HomePage extends React.Component {

  constructor() {
    super();

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch('https://lsv-data-visualizations.firebaseio.com/donantesPartidoUNal2014.json')
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.setState({data: json});
      })
      .catch((ex) => {
        console.log('parsing failed', ex)
      })
  }

  render() {
    return (
      <Layout>
        {/*<div className={s.content} dangerouslySetInnerHTML={{ __html: html }} />*/}
        {/*<Departementos data={this.state.data} />*/}
        <TableWidget data={this.state.data.grupo} />
        <Partipacion data={this.state.data.main} width="1032" height="650" />
        <Presupuesto data={this.state.data.main} />
      </Layout>
    );
  }

}

export default HomePage;
