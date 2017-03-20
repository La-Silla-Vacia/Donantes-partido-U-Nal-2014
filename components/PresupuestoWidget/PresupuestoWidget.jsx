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
          label: "Grupo empresarial",
          value: "grupoEmpresarial",
        },
        {
          label: "Estado origen",
          value: "estadoOrigen"
        },
        {
          label: "Sector económico",
          value: "sectorEconomico"
        },
        {
          label: "De capital extranjero",
          value: "deCapitalExtranjero"
        }
      ],
      viewType: "grupoEmpresarial",
      legendItems: [],
      hovering: false,
      data: [],
      formattedData: [],
      nodes: []
    };

    this.createWidget = this.createWidget.bind(this);
    this.switchOption = this.switchOption.bind(this);
  }

  switchOption(e) {
    this.setState({ viewType: e.value });
    setTimeout(() => {
      this.formatData(this.state.data);
    }, 10);
  }

  componentDidMount() {
    this.formatData(this.state.data);
    window.addEventListener('resize', this.createWidget.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
    this.formatData(nextProps.data);
  }

  createWidget() {
    const nodes = [];
    const data = this.state.formattedData;
    this.setState({ 'legendItems': data.legendItems });

    const tree = {
      "children": data.children
    };

    let width = window.innerWidth,
      height = window.innerHeight / 3 * 2;

    if (width > 1032) {
      width = 1032;
    }

    const div = d3.select("#presupuestoChart")
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

    this.setState({ nodes });
  }

  formatData(data) {
    const children = [];
    const legendItems = [];
    let i = 0;

    const sortBy = this.state.viewType;

    data.map((el, index) => {
        let category = el.grupoEmpresarial;
        if (sortBy == "estadoOrigen") {
          category = el.departamento;
          // console.log(el.departamento);
        } else if (sortBy == "sectorEconomico") {
          category = el.sectorEconomico;
        } else if (sortBy == "deCapitalExtranjero") {
          category = el.deCapitalExtranjero;
          if (category) {
            category = 'Con capital extranjero';
          } else {
            category = 'Sin capital extranjero';
          }
        }

        if (!category) category = 'Sin definir';

        const presupuesto = el.montoDonacion;

        // only continue if there is money involved
        if (presupuesto) {

          let inChildren = false;
          children.map((child) => {
            if (child.categoryName == category) {
              inChildren = true;
              // console.log(child);
              child.presupuestoDeInversion += Number(presupuesto);
            }
          });

          if (!inChildren) {
            i += 1;

            let thisColor = el.grupoColor;
            // console.log(source, el);
            function colores_google(n) {
              const colores_g = ["#00537f", "#1c7b8d", "#904091", "#a6d164", "#b5805d", "#cd2843", "#f6b220", "#033a5a", "#904091", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
              return colores_g[n % colores_g.length];
            }

            if (!thisColor) thisColor = colores_google(i);

            const newEl = {
              partido: el.grupoEmpresarial,
              categoryName: category,
              color: thisColor,
              departamento: el.departamento,
              presupuestoDeInversion: presupuesto,
              id: i
            };

            children.push(newEl);
            // console.log(thisColor);
            legendItems.push({ name: category, color: thisColor, nodeId: index + 1 });
          }
        }
      }
    );

    this.setState({ formattedData: { children, legendItems } });
    setTimeout(() => {
      this.createWidget();
    }, 10);
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

  mouseMove(e) {
    // console.log(e.target);
  }

  getNodes() {
    return this.state.nodes.map((node, index) => {
      let backgroundColor = node.color;

      const fontSize = Math.max(20, 0.05 * Math.sqrt(node.area)) + 'px';
      const amoundOfMoney = Math.round(node.presupuestoDeInversion / 1000000000);

      let hideTitle = false;
      if (node.dx < 100 || node.dy < 80) hideTitle = true;

      let hideMoney = false;
      if (node.dx < 100 || node.dy < 80) hideMoney = true;
      // console.log(node);
      return (
        <div onMouseEnter={this.mouseMove} className={s.node} key={index} style={{
          backgroundColor: backgroundColor,
          fontSize: fontSize,
          height: node.dy,
          width: node.dx,
          right: node.x,
          top: node.y,
        }}>
          <h3 className={cx(s.partido, { [s.partido__hidden]: hideTitle })}>{node.categoryName}</h3>
          <span className={cx(s.money, { [s.money__hidden]: hideMoney })}>{amoundOfMoney} Mil Millones</span>
        </div>
      )
    });
  }

  render() {
    const select = (
      <Select
        className={s.select}
        value="Grupo empresarial"
        options={this.state.selectOptions}
        callback={this.switchOption}
      />
    );

    let nodes;
    if (this.state.nodes.length) nodes = this.getNodes();

    return (
      <Widget
        upperTitle="Las donaciones, comparadas"
        upperDescription="Una docena de grupos concentra casi 3 de cada 4 pesos donados."
        title="Presupuesto por %s"
        select={select}
        floatTitle
      >

        <div className={s.legend}>
          <Legend
            items={this.state.legendItems}
            hovering={this.state.hovering}
          />
        </div>

        <div id="presupuestoChart" className={s.widget}>{nodes}</div>

      </Widget>
    );
  }

  shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    let RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    let GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    let BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

}

export default PresupuestoWidget;
