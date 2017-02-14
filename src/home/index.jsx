import React from 'react';
import Layout from '../../components/Layout';
import Tendencias from '../../components/TendenciasWidget';
import Partipacion from '../../components/PartipacionWidget';
import Presupuesto from '../../components/PresupuestoWidget';
import s from './styles.css';
import { title, html } from './index.md';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout>
        <div className={s.content} dangerouslySetInnerHTML={{ __html: html }} />
        {/*<Tendencias/>*/}
        <Partipacion/>

        <Presupuesto/>
      </Layout>
    );
  }

}

export default HomePage;
