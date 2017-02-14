import React from 'react';
import Layout from '../../components/Layout';
import Tendencias from '../../components/TendenciasWidget';
import Partipacion from '../../components/PartipacionWidget';
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

        <Tendencias/>
        <Partipacion/>
      </Layout>
    );
  }

}

export default HomePage;
