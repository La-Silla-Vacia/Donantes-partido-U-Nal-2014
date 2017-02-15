import React from 'react';
import d3 from 'd3';
import sankeyLib from '../Sankey/Sankey.js';
import Widget from '../Widget';
import Select from '../Select';
import Legend from '../Legend';
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
      hovering: false
    };
  }

  static switchOption(e) {
    console.log(e);
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

    return (
      <Widget
        title="Partipación de los Partidos Póliticos en %s"
        select={select}
      >

        <Legend
          items={this.state.legendItems}
          hovering={this.state.hovering}
        />

        <div id="chart"></div>

      </Widget>
    );
  }

  componentDidMount() {
    const self = this;

    d3.sankey = sankeyLib;
    const chart = document.querySelector('#chart');
    const chartWidth = 1200;

    const margin = {top: 10, right: 1, bottom: 6, left: 1},
      width = chartWidth - margin.left - margin.right, // was 960
      //height = 1500 - margin.top - margin.bottom; // was 500
      height = 650; // UBS Example

    const formatNumber = d3.format(",.0f"),
      format = function (d) {
        return formatNumber(d / 1000).replace(",", ".") + " millones";
      },
      color = d3.scale.category20();

    const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const sankey = d3.sankey()
      .nodeWidth(20) // was 15
      .nodePadding(10) // was 10
      .size([width, height]);

    const path = sankey.link();

    d3.json("https://rayos-x-al-clientelismo.firebaseio.com/data.json", function (energy) {

      const partidos = [];
      const nodes = [];
      const links = [];

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
            if (node.name == partido) {
              node.partidoId = index + 1;
              partidoIndex = index;
            }
            if (node.name == entidad) {
              node.entidadId = index + 1;
              entidadIndex = index;
            }
          });

          if (presupuesto) {
            let linkInLinks = false;
            const value = presupuesto / 1000;
            const result = {"source": partidoIndex, "target": entidadIndex, "value": value};

            links.map((link) => {
              if (link.source === partidoIndex && link.target === entidadIndex) {
                link.value += value;
                linkInLinks = true;
              }
            });

            if (!linkInLinks) links.push(result);
          }
        }
      });


      nodes.map((node) => {
        if (node.partidoId) partidos.push(node);
      });

      self.setState({legendItems: partidos});

      sankey
        .nodes(nodes)
        .links(links)
        .layout(32); // what is this? iterations

      const link = svg.append("g").selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", function (d) {
          return `link link--entidad-${d.target.entidadId} link--partido-${d.source.partidoId}`
        })
        .attr("d", path)
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .style("stroke", function (d) {
          return d.source.color = d.source.colorPartido;
        })
        // .style("transform=")
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

      link.on('mouseenter', (el) => {
        self.setState({'hovering': el.source.partidoId});
        const partidoClass = ".node--partido-" + el.source.partidoId;
        const entidadClass = ".node--entidad-" + el.target.entidadId;
        document.querySelector(partidoClass).classList.add('node--active');
        document.querySelector(entidadClass).classList.add('node--active');
      });

      link.on('mouseleave', (el) => {
        self.setState({'hovering': false});
        const partidoClass = ".node--partido-" + el.source.partidoId;
        const entidadClass = ".node--entidad-" + el.target.entidadId;
        document.querySelector(partidoClass).classList.remove('node--active');
        document.querySelector(entidadClass).classList.remove('node--active');
      });

      link.append("title")
        .text(function (d) {
          return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });
      // title is an SVG standard way of providing tooltips, up to the browser how to render this, so changing the style is tricky

      const node = svg.append("g").selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", function (d) {
          if (d.entidadId) {
            return "node node--entidad-" + d.entidadId;
          } else {
            return "node node--partido-" + d.partidoId;
          }
        })
        .attr("transform", function (d) {

          let y = d.y + sankey.nodeWidth();
          if (d.y == 0) {
            y = d.y - sankey.nodeWidth();
          }

          return "translate(" + d.x + "," + d.y + ")";
        });

      node.on('mouseenter', (el) => {
        if (el.partidoId) {
          const id = el.partidoId;
          document.querySelector('.node--partido-' + id).classList.add('node--active');
          const links = document.querySelectorAll('.link--partido-' + id);
          for (let i = 0; i < links.length; i++) {
            links[i].classList.add("link--active");
          }
        } else {
          const id = el.entidadId;
          document.querySelector('.node--entidad-' + id).classList.add('node--active');
          const links = document.querySelectorAll('.link--entidad-' + id);
          for (let i = 0; i < links.length; i++) {
            links[i].classList.add("link--active");
          }
        }
      });

      node.on('mouseleave', (el) => {
        if (el.partidoId) {
          const id = el.partidoId;
          document.querySelector('.node--partido-' + id).classList.remove('node--active');
          const links = document.querySelectorAll('.link--partido-' + id);
          for (let i = 0; i < links.length; i++) {
            links[i].classList.remove("link--active");
          }
        } else {
          const id = el.entidadId;
          document.querySelector('.node--entidad-' + id).classList.remove('node--active');
          const links = document.querySelectorAll('.link--entidad-' + id);
          for (let i = 0; i < links.length; i++) {
            links[i].classList.remove("link--active");
          }
        }
      });

      node.append("rect")
        .attr("height", sankey.nodeWidth())
        .attr("width", function (d) {
          return d.dy;
        })
        .style("fill", function (d) {
          if (d.colorPartido) {
            return d.color = d.colorPartido;
          } else {
            return d.color = "";
          }
        })
        .style("stroke", "#fff")
        .append("title")
        .text(function (d) {
          return d.name + "\n" + format(d.value);
        });

      node.append("text")
        .attr("text-anchor", "left")
        .attr("x", sankey.nodeWidth() * 1.5)
        .attr("y", (d) => {
          return -(d.dy / 2)
        })
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .text(function (d) {
          if (d.y > 1)
            return d.name;
        })
        .filter(function (d) {
          return d.x < width / 2;
        });
    });
  }

}

export default PartipacionWidget;
