import React from 'react';
import d3 from 'd3';
import cx from 'classnames';
import 'whatwg-fetch';
import Legend from '../Legend';
import Widget from '../Widget';
import Select from '../Select';
import s from './PresupuestoWidget.css';

class PresupuestoWidget extends React.Component {

  constructor() {
    super();
    this.state = {
      selectOptions: [
        {
          label: "Partido Pólitico",
          value: "partidoPolitico",
        },
        {
          label: "Departemento",
          value: "departemento"
        },
        {
          label: "Entidade",
          value: "entidade"
        }
      ],
      partidos: [],
      hovering: false,
      data: [],
      formattedData: [],
      nodes: []
    };

    this.createWidget = this.createWidget.bind(this);
  }

  static switchOption(e) {
    console.log(e);
  }

  componentDidMount() {
    this.formatData(this.state.data, (data) => {
      this.createWidget(data);
    });
    window.addEventListener('resize', this.createWidget.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    // if (nextProps.data !== this.state.data) {
      console.log('updateing props');
      this.setState({data: nextProps.data});
      this.formatData(nextProps.data, this.createWidget);
    // }
  }

  createWidget() {
    const nodes = [];
    const data = this.state.formattedData;
    console.log(this.state.formattedData);
    this.setState({'partidos': data.partidos});
    const tree = {
      "children": data.children
    };

    const width = window.innerWidth,
      height = window.innerHeight / 3 * 2,
      div = d3.select("#presupuestoChart")
        .style("height", height + 'px');

    const treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function (d) {
        return d.presupuestoDeInversion;
      });

    const node = div.datum(tree).selectAll(".node")
      .data(treemap.nodes)
      .enter()
      .append("div")
      .call(this.getPosition)
      .text((d) => {
        nodes.push(d);
      })
      .remove();

    this.setState({nodes});
  }

  formatData(data, callback) {
    const children = [];
    const partidos = [];

    data.map((el, index) => {
      const partido = el.partido;
      const presupuesto = el.presupuestoDeInversion;
      if (presupuesto) {

        let inChildren = false;
        children.map((child) => {
          if (child.partido == partido) {
            inChildren = true;
            child.presupuestoDeInversion += Number(presupuesto);
          }
        });

        let inPartidos = false;
        partidos.map((node) => {
          if (node.name == partido) inPartidos = true;
        });
        if (!inPartidos) {
          partidos.push({name: partido, colorPartido: el.colorPartido, partidoId: index + 1});
        }

        if (!inChildren) children.push(el);
      }
    });

    this.setState({formattedData: {children, partidos}});
    if (callback) {
      setTimeout(() => {
        callback();
      }, 10);

    }
  }

  getPosition() {
    this.style("right", (d) => {
      return d.x + "px";
    })
      .style("top", (d) => {
        return d.y + "px";
      })
      .style("width", (d) => {
        return Math.max(0, d.dx) + "px";
      })
      .style("height", (d) => {
        return Math.max(0, d.dy) + "px";
      });
  }

  getNodes() {
    return this.state.nodes.map((node, index) => {
      let backgroundColor = node.colorPartido;
      if (!backgroundColor) backgroundColor = "#44a5db";
      const fontSize = Math.max(20, 0.05 * Math.sqrt(node.area)) + 'px';
      const amoundOfMoney = Math.round(node.presupuestoDeInversion / 1000000000);

      let hide = false;
      if (node.dx < 200 || node.dy < 200) hide = true;
      return (
        <div className={s.node} key={index} style={{
          backgroundColor: backgroundColor,
          fontSize: fontSize,
          height: node.dy,
          width: node.dx,
          right: node.x,
          top: node.y,
        }}>
          <h3 className={cx(s.partido, {[s.partido__hidden]: hide})}>{node.partido}</h3>
          <span className={cx(s.money, {[s.money__hidden]: hide})}>{amoundOfMoney} Mil Millones</span>
        </div>
      )
    });
  }

  render() {
    const select = (
      <Select
        className={s.select}
        value="Entidades"
        options={this.state.selectOptions}
        callback={PresupuestoWidget.switchOption}
      />
    );

    let nodes;
    if (this.state.nodes.length) nodes = this.getNodes();

    return (
      <Widget
        title="Presupuesto por %s"
        select={select}
        fullWidth={true}
      >

        <Legend
          partidos={this.state.partidos}
          hovering={this.state.hovering}
        />

        <div id="presupuestoChart" className={s.widget}>{nodes}</div>

      </Widget>
    );
  }

}

export default PresupuestoWidget;
