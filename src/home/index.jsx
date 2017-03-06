import React from 'react';
import 'whatwg-fetch';
import Layout from '../../components/Layout';
import Departementos from '../../components/DepartementosWidget';
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
    document.title = title;

    this.getData();
  }

  getData() {
    fetch('https://rayos-x-al-clientelismo.firebaseio.com/data.json')
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
        <div className={s.content} dangerouslySetInnerHTML={{ __html: html }} />
        <Departementos data={this.state.data} />
        <Partipacion data={this.state.data} width="1168" height="650" />
        <Presupuesto data={this.state.data} />
      </Layout>
    );
  }

}

export default HomePage;
