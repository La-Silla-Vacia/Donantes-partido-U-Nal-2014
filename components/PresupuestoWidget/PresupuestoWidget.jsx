import React from 'react';
import d3 from 'd3';
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
      hovering: false
    };
  }

  static switchOption(e) {
    console.log(e);
  }

  componentDidMount() {
    const self = this;

    d3.json("https://rayos-x-al-clientelismo.firebaseio.com/data.json", function (data) {

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

      self.setState({'partidos': partidos});

      const tree = {
        "name": "Album",
        "children": children
      };

      const width = window.innerWidth,
        height = window.innerHeight / 3 * 2,
        color = d3.scale.category20c(),
        div = d3.select("#presupuestoChart")
          .style("height", height + 'px')
          .append("div")
          .style("position", "relative");

      const treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function (d) {
          return d.presupuestoDeInversion;
        });

      const node = div.datum(tree).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", s.node)
        .call(position)
        .style("background-color", function (d) {
          return d.partido == 'tree' ? '#fff' : d.colorPartido;
        })
        .append('h3')
        .attr("class", s.partido)
        .style("font-size", function (d) {
          // compute font size based on sqrt(area)
          return Math.max(20, 0.05 * Math.sqrt(d.area)) + 'px';
        })
        .text(function (d) {
          return d.children ? null : d.partido;
        })
        .append('span')
        .attr("class", s.money)
        .text(function (d) {
          return d.children ? null : `${Math.round((d.presupuestoDeInversion / 1000000000))} Mil Millones`;
        });

      function position() {
        this.style("right", function (d) {
          return d.x + "px";
        })
          .style("top", function (d) {
            return d.y + "px";
          })
          .style("width", function (d) {
            return Math.max(0, d.dx) + "px";
          })
          .style("height", function (d) {
            return Math.max(0, d.dy) + "px";
          });
      }
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

        <div id="presupuestoChart" className={s.widget} />

      </Widget>
    );
  }

}

export default PresupuestoWidget;
