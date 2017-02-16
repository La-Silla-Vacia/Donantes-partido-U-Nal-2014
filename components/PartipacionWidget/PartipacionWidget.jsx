import React from 'react';
import d3 from 'd3';
import sankeyLib from '../Sankey/Sankey.js';
import Widget from '../Widget';
import Select from '../Select';
import Legend from '../Legend';
import Item from './Item.jsx';
import Node from './Node.jsx';
import s from './PartipacionWidget.css';

class PartipacionWidget extends React.Component {

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
          label: "Entidades",
          value: "entidades"
        }
      ],
      legendItems: [],
      hovering: false,
      items: [],
      nodes: [],
      nodeActive: [],
      activeText: "Hoi"
    };

    this.getHoverItem = this.getHoverItem.bind(this);
    this.getHoverNode = this.getHoverNode.bind(this);
    this.getHoverLegend = this.getHoverLegend.bind(this);
  }

  static switchOption(e) {
    console.log(e);
  }

  getItems() {
    return this.state.items.map((item, index) => {
      const strokeWidth = Math.max(1, item.dy);
      const data = {
        path: item.path,
        strokeWidth,
        color: item.source.colorPartido,
        sourceName: item.source.name,
        targetName: item.target.name,
        value: item.theValue,
        hoverCallback: this.getHoverItem,
        index
      };

      const sourceId = item.source.nodeId;
      const entidadId = item.source.nodeId;

      if ((
        this.state.nodeActive.indexOf(sourceId) !== -1 ||
        this.state.nodeActive.indexOf(entidadId) !== -1) &&
        this.state.madeActiveBy == "node") {
        data.active = true;
      }

      return (
        <Item key={index} {...data} />
      )
    });
  }

  getHoverItem(index) {
    const item = this.state.items[index];
    const text = `${item.source.name} → ${item.target.name}`;
    const amount = this.formatCurrency(item.theValue);
    this.setState({activeText: text});
    this.setState({activeAmount: amount});

    this.setState({nodeActive: [item.source.nodeId, item.target.nodeId]});
    this.setState({madeActiveBy: "item"})
  }

  getHoverNode(type, id) {
    const activeNodes = [id];

    this.state.nodes.map((node) => {
      if (node.nodeId == id) {
        if (type == "partido") {
          node.sourceLinks.map((link) => {
            activeNodes.push(link.target.nodeId);
          })
        } else {
          node.targetLinks.map((link) => {
            activeNodes.push(link.source.nodeId);
          })
        }
      }
    });

    this.setState({nodeActive: activeNodes});
    this.setState({madeActiveBy: "node"})
  }

  getHoverLegend(id) {
    this.setState({nodeActive: [id]})
  }

  getNodes() {
    return this.state.nodes.map((item, index) => {
      const data = item;
      data.active = false;
      data.hoverCallback = this.getHoverNode;

      if (this.state.nodeActive.indexOf(data.nodeId) !== -1 ||
        this.state.nodeActive.indexOf(data.nodeId) !== -1) {
        data.active = true;
      }
      return (
        <Node key={index} {...data} />
      )
    });
  }

  render() {
    const select = (
      <Select
        className={s.select}
        value="Entidades"
        options={this.state.selectOptions}
        callback={PartipacionWidget.switchOption}
      />
    );

    const items = this.getItems();
    const nodes = this.getNodes();

    return (
      <Widget
        title="Partipación de los Partidos Póliticos en %s"
        select={select}
      >

        <Legend
          items={this.state.legendItems}
          hovering={this.state.nodeActive}
          hoverCallback={this.getHoverLegend}
        />

        <div id="chart" hidden></div>

        <div className={s.chartRoot}>
          <svg className={s.chart} width="1200" height="1000">
            <g transform="translate(1,10)">
              <g>
                { items }
              </g>
              <g>
                { nodes }
              </g>
            </g>
          </svg>
          <div className={s.textBox}>
            <span className={s.activeText}>{this.state.activeText}</span>
            <span className={s.activeAmount}>{this.state.activeAmount}</span>
          </div>
        </div>

      </Widget>
    );
  }

  componentDidMount() {
    const self = this;

    d3.sankey = sankeyLib;
    const chart = document.querySelector('#chart');
    const chartWidth = 1200;

    const width = chartWidth, // was 960
      //height = 1500 - margin.top - margin.bottom; // was 500
      height = 650; // UBS Example

    const svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const sankey = d3.sankey()
      .nodeWidth(20) // was 15
      .nodePadding(10) // was 10
      .size([width, height]);

    const path = sankey.link();

    d3.json("https://rayos-x-al-clientelismo.firebaseio.com/data.json", function (energy) {

      const partidos = [];
      const nodes = [];
      const links = [];

      const items = [];
      const nodeEls = [];

      energy.map((el) => {
        const partido = el.partido;
        const presupuesto = el.presupuestoDeInversion;

        if (presupuesto) {
          const entidad = el.entidad;
          let partidoInNodes = false;
          let entidadInNodes = false;
          nodes.map((node) => {
            if (node.name == partido) partidoInNodes = true;
            if (node.name == entidad) entidadInNodes = true;
          });
          if (!partidoInNodes) {
            nodes.push({name: partido, colorPartido: el.colorPartido});
          }
          if (!entidadInNodes) nodes.push({name: entidad});

          let partidoIndex = 0;
          let entidadIndex = 0;
          nodes.map((node, index) => {
            node.nodeId = index + 1;
            if (node.name == partido) {
              node.type = "partido";
              partidoIndex = index;
            }
            if (node.name == entidad) {
              entidadIndex = index;
            }
            node.presupuesto = presupuesto;
          });

          let linkInLinks = false;
          const value = presupuesto / 1000;
          const result = {"source": partidoIndex, "target": entidadIndex, "value": value, "theValue": value};

          links.map((link) => {
            if (link.source === partidoIndex && link.target === entidadIndex) {
              link.value += value;
              linkInLinks = true;
            }
          });

          if (!linkInLinks) links.push(result);
        }
      });

      nodes.map((node) => {
        if (node.type == "partido") partidos.push(node);
      });

      self.setState({legendItems: partidos});

      sankey
        .nodes(nodes)
        .links(links)
        .layout(32); // what is this? iterations

      const link = svg.append("g").selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .sort(function (a, b) {
          return b.dy - a.dy;
        })
        .text((d) => {
          const item = d;
          item.path = path(d);
          items.push(item);
        })
        .remove();
      self.setState({items});

      const node = svg.append("g").selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .text((d) => {
          const item = d;
          item.width = d.dy;
          nodeEls.push(item);
        });

      self.setState({nodes: nodeEls});
    });
  }

  formatCurrency(x) {
    let number = Math.round(x / 1000000);
    return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " millones";
  }

}

export default PartipacionWidget;
