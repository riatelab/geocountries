import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3array from "d3-array";
import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3scalechromatic, d3array, d3selection,d3scale);

function getsize(elt) {
  const clonetxt = elt.clone(true);
  const svg = d3.create("svg");
  svg.node().appendChild(clonetxt.node());
  document.body.appendChild(svg.node());
  const { x, y, width, height } = clonetxt.node().getBBox();
  document.body.removeChild(svg.node());
  let dims = { x, y, width, height };
  return dims;
}

export function view(result){
  const fontsize = 15;
  const wmargin = 5;
  const width = 1000;

  // get sizes
  const data = Array.from(result.values());
  const sizes = [];
  let svg = d3.create("svg");
  data.forEach((e) => {
    const txt = svg
      .append("text")
      .attr("font-size", `${fontsize}px`)
      .text(e.name);
    sizes.push(getsize(txt));
  });
  svg.remove();

  let newdata = [];
  const widths = sizes.map((d) => d.width);
  const h = sizes[0].height;

  let y = h / 2;

  let dx = 0;
  for (let i = 0; i < widths.length; i++) {
    if (dx + widths[i] + wmargin > width) {
      dx = 0;
      y = y + h;
    }

    let x = dx + wmargin;
    dx = x + widths[i] + wmargin;

    newdata.push({
      name: data[i].name,
      score: data[i].score,
      x: x,
      y: y,
      w: widths[i],
      h: h
    });
  }

  // return newdata;

  // draw
  const height = d3.max(newdata.map((d) => d.y)) + h / 2;

  const quantile = d3
    .scaleQuantile()
    .domain(newdata.map((d) => d.score))
    .range(d3.schemeRdYlGn[11]);
  const colbyid = new Map(newdata.map((d) => [d.name, quantile(d.score)]));

  svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", `max-width: 100%; height: auto; height: intrinsic`);

  svg
    .append("g")
    .selectAll("rect")
    .data(newdata)
    .join("rect")
    .attr("x", (d) => d.x - wmargin)
    .attr("y", (d) => d.y - d.h / 2)
    .attr("height", (d) => d.h)
    .attr("width", (d) => d.w + wmargin * 2)
    .attr("fill", (d) => colbyid.get(d.name))
    .attr("fill-opacity", 0.3)
    .attr("stroke", "none")
    .lower();

  svg
    .append("g")
    .selectAll("text")
    .data(newdata)
    .join("text")
    .attr("dominant-baseline", "middle")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("font-weight", (d) => (d.score < 0.9 ? "bold" : "normal"))
    .attr("font-size", fontsize)
    .attr("fill", (d) => colbyid.get(d.name))
    .text((d) => d.name);

  return svg.node();
}
