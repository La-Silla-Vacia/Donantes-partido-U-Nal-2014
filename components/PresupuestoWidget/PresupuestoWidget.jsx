import React from 'react';
import d3 from 'd3';
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

    d3.json("https://rayos-x-al-clientelismo.firebaseio.com/data.json", function (data) {

      const children = [];

      data.map((el) => {
        const partido = el.partido;
        const presupuesto = el.presupuestoDeInversion;
        if (partido !== 'Sin definir' && presupuesto) {

          let inChildren = false;
          children.map((child) => {
            if (child.partido == partido) {
              console.log(partido + " " + child.presupuestoDeInversion);
              inChildren = true;
              child.presupuestoDeInversion += Number(presupuesto);
            }
          });

          if (!inChildren) children.push(el);
        }
      });

      const tree = {
        "name": "hihi",
        "children": children
      };

      const width = 1200,
        height = 600,
        color = d3.scale.category20c(),
        div = d3.select("#presupuestoChart").append("div")
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
        .append('div')
        .style("font-size", function (d) {
          // compute font size based on sqrt(area)
          return Math.max(20, 0.18 * Math.sqrt(d.area)) + 'px';
        })
        .text(function (d) {
          return d.children ? null : d.partido;
        });

      function position() {
        this.style("left", function (d) {
          return d.x + "px";
        })
          .style("top", function (d) {
            return d.y + "px";
          })
          .style("width", function (d) {
            return Math.max(0, d.dx - 1) + "px";
          })
          .style("height", function (d) {
            return Math.max(0, d.dy - 1) + "px";
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
      >

        <div id="presupuestoChart"/>

      </Widget>
    );
  }

}

export default PresupuestoWidget;
