import React from 'react';
import cx from 'classnames';
import Widget from '../Widget';
import Legend from '../Legend';
import s from './DepartementosWidget.css';

class Navigation extends React.Component {

  constructor() {
    super();

    this.state = {
      departemento: 'Bogotá',
      columns: 0,
      context: [],
      loading: true
    };


    this.processData = this.processData.bind(this);
  }

  componentWillReceiveProps(newprops) {
    if (newprops.data.length) {
      this.setState({loading: false});
      this.processData(newprops.data);
    }
  }

  processData(data) {
    const thisdata = [];

    for (let i = 0; i < data.length; i += 1) {
      const thisDepart = this.state.departemento.toLowerCase();
      const newDepart = data[i].departamento.toLowerCase();

      if (thisDepart === newDepart) {
        thisdata.push(data[i]);
      }
    }

    const columnCount = thisdata.length;
    this.setState({columns: columnCount});

    this.data = thisdata;
    this.mergeData();
  }

  mergeData() {
    const data = this.data;
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];

      item.PartidoEscaped = item.partido.replace(/ /g, '');
      // console.log(item);
      let budgetWidth = item.presupuestoDeInversion;
      // budgetWidth = budgetWidth.replace('$', '').replace('"', '');
      budgetWidth = (budgetWidth / 1000000000) * 1.25;
      if (budgetWidth < 35) budgetWidth = 35;
      const halfBudgetWidth = budgetWidth / 2;

      item.BudgetWidth = budgetWidth;
      item.halfBudgetWidth = halfBudgetWidth;

      item.itterator = i;

      if (item.fotoDeLaCabeza === '') item.fotoDeLaCabeza = './images/avatars/undefined.jpg';
      if (item.fotoDelPadrino === '') item.fotoDelPadrino = './images/avatars/undefined.jpg';
    }

    const context = data;

    this.setState({context});

    // const cabezasSource = $('#cabezas-template').html();
    // const cabezasTemplate = Handlebars.compile(cabezasSource);
    // $('#cabezas').append(cabezasTemplate(context));
    //
    // const presupuestsSource = $('#presupuests-template').html();
    // const presupuestsTemplate = Handlebars.compile(presupuestsSource);
    // $('#presupuests').append(presupuestsTemplate(context));
    //
    // const destinationsSource = $('#destinations-template').html();
    // const destinationsTemplate = Handlebars.compile(destinationsSource);
    // $('#destinations').append(destinationsTemplate(context));
    //
    // this.watch();
  }

  getPadrinos() {
    return this.state.context.map((padrino, index) => {
      return (
        <div key={index} className={cx(
          s.row__column,
          s.person,
          s.personWidthArrow
        )}>
          <div className={s.column__inner}>
            <figure className={s.person__avatar}>
              <img src={ padrino.fotoDelPadrino } width="100" alt={ padrino.padrino }/>
            </figure>
            <h3 className={s.person__name}>{ padrino.padrino }</h3>
            <p className={s.person__function}>{ padrino.cargoDelPadrino }</p>
          </div>
        </div>
      )
    });
  }

  getCabezas() {
    return this.state.context.map((cabeza, index) => {
      return (
        <div key={index} className={cx(
          s.row__column,
          s.person,
          s.personSmall
        )}>
          <div className={s.column__inner}>
            <figure className={s.person__avatar}>
              <img src={ cabeza.fotoDeLaCabeza } width="100" alt={ cabeza.nombreDeLaCabeza}/>
            </figure>
            <h3 className={s.person__name}>{ cabeza.nombreDeLaCabeza }</h3>
            <p className={s.person__function}>{ cabeza.cargoDeLaCabeza }</p>
          </div>
        </div>
      )
    })
  }

  getPresupuests() {

    return this.state.context.map((item, index) => {
      let inversion;
      if (item.presupuestoDeInversion) {
        inversion = (
          <div>
            <div className={s.budget__circle}/>
            <div className={s.budget__spend}
                 style={{
                   width: `${item.BudgetWidth}px`,
                   height: `${item.halfBudgetWidth}px`,
                   borderRadius: `${item.BudgetWidth}px ${item.BudgetWidth}px 0 0`
                 }}/>
          </div>
        )
      }

      return (
        <div key={index} className={cx(
          s.row__column,
          s.columnLineCenter,
          s.budget
        )}
             style={{color: item.colorPartido, minHeight: `${item.halfBudgetWidth}px`}}>
          <div className={s.column__inner}>
            {inversion}
          </div>
        </div>
      )
    });
  }

  getEntidades() {
    return this.state.context.map((item, index) => {
      let logo = (<span className={s.imgFallback}>{ item.entidad }</span>);
      if (item.logo) {
        logo = (<img src={ item.logo } width="50" alt={ item.entidad }/>);
      }

      let presupuestoDeInversion = (<span className={s.destination__amound}>Sin definir</span>);
      if (item.presupuestoDeInversion) {
        presupuestoDeInversion = (<span className={s.destination__amound}>{this.formatCurrency(item.presupuestoDeInversion)}<br/>millones</span>)
      }

      return (
        <div key={index} className={cx(
          s.row__column,
          s.destination
        )}>

          <div className={s.column__inner}>
            <figure className={s.destination__brand} style={{color: item.colorPartido}}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.53 49.16">
                <path style={{fill: 'currentColor'}}
                      d="M20,48.69,1.78,38.17A3.55,3.55,0,0,1,0,35.1v-21A3.55,3.55,0,0,1,1.78,11L20,.48a3.55,3.55,0,0,1,3.55,0L41.75,11a3.55,3.55,0,0,1,1.78,3.08v21a3.55,3.55,0,0,1-1.78,3.08L23.54,48.69A3.55,3.55,0,0,1,20,48.69Z"/>
              </svg>
              {logo}
            </figure>
            <p className={s.destination__title}>{ item.entidad }</p>
            {presupuestoDeInversion}
          </div>
        </div>
      )
    })
  }

  formatCurrency(value) {
    if (value) {
      const number = Math.round(value / 1000000);
      return "$" + number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
    } else {
      return ""
    }
  }

  render() {

    const padrinos = this.getPadrinos();
    const cabezas = this.getCabezas();
    const presupuests = this.getPresupuests();
    const entidades = this.getEntidades();

    let loadText;
    if (this.state.loading) {
      loadText = (
        <div className={cx(s.row__column, s.loading, s.row__columnTitle)}>
          <h2 className={s.row__title}>Cargando visualización...</h2>
        </div>
      )
    }

    return (
      <Widget
        upperTitle="Lorem ipsum"
        upperDescription="Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
        title="Hoi"
      >

        <div className={cx(
          s.container,
          {[s[`colCount_${this.state.columns}`]]: true}
        )}>

          <Legend />
          <div className={s.tableLayout}>

            <div id="padrinos" className={s.row}>
              {loadText}
              <div className={cx(
                s.row__column,
                s.row__columnTitle
              )}>
                <h2 className={s.row__title}>Padrino</h2>
              </div>
              {padrinos}
            </div>

            <div id="cabezas" className={s.row}>
              <div className={cx(
                s.row__column,
                s.row__columnTitle
              )}>
                <h2 className={s.row__title}>Cabezas</h2>
              </div>
              {cabezas}
            </div>

            <div id="presupuests" className={cx(s.row, s.rowLineBelow)}>
              <div className={cx(
                s.row__column,
                s.row__columnTitle
              )}>
                <h2 className={s.row__title}>Presupuesto <br />de inversión</h2>
              </div>
              {presupuests}
            </div>

            <div id="destinations" className={s.row}>
              <div className={cx(
                s.row__column,
                s.row__columnTitle)}>
                <h2 className={cx(
                  s.row__title,
                  s.visuallyHidden)}>Entidad</h2>
              </div>
              {entidades}
            </div>

            <div className={cx(s.content, s.contentHidden)}>
              <header className={s.content__header}>
                <h2 style={{opacity: 0, visibility: 'hidden'}}>La historia</h2>
                <button id="close__content" className={s.content__closeButton}>
                  <svg className={s.closebtn} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                    <path className="a"
                          d="M17.45,6.84,12.5,11.79,7.55,6.84l-.71.71,4.95,4.95L6.84,17.45l.71.71,4.95-4.95,4.95,4.95.71-.71L13.21,12.5l4.95-4.95Z"/>
                    <path className="a"
                          d="M12.5,0A12.5,12.5,0,1,0,25,12.5,12.5,12.5,0,0,0,12.5,0Zm0,24A11.5,11.5,0,1,1,24,12.5,11.53,11.53,0,0,1,12.5,24Z"/>
                  </svg>
                </button>
              </header>
              <div className={s.content__inner}></div>
            </div>
          </div>
        </div>

      </Widget>
    );
  }

}

export default Navigation;
