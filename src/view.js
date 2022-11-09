import { csv } from "d3-fetch";
import { similarity } from "./levenshtein.js";
import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3array from "d3-array";
import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3scalechromatic, d3array, d3selection, d3scale);

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

export async function view(
  params = {
    json: undefined,
    name: "name",
    threshold: 0.75,
    patch: undefined,
  }
) {
  let codes = await csv(
    `https://raw.githubusercontent.com/neocarto/geocountries/main/data/countries.csv`
  );

  function getcode(str, threshold = 0.9) {
    let result = [];

    codes.forEach((e) => {
      for (let i = 1; i < Object.keys(e).length; i++) {
        let sim = similarity(str, Object.values(e)[i]);

        result.push([Object.values(e)[0], sim]);
      }
    });

    result = result.sort((a, b) => {
      return b[1] - a[1];
    })[0];

    if (result[1] < threshold) {
      result = [undefined, 0];
    }

    return { name: str, iso3: result[0], score: result[1] };
  }

  const data = JSON.parse(JSON.stringify(params.json));
  const name = params.name;
  const threshold = params.threshold;
  const patch = params.patch;

  const result = [];
  const names = Array.from(new Set(data.map((d) => d[name])));
  names.forEach((e) => {
    const add = patch ? patch.find((d) => d.name == e) : undefined;
    if (add == undefined) {
      result.push([e, getcode(e, threshold)]);
    } else {
      result.push([e, { name: e, iso3: add.iso3, score: add.iso3 ? 1 : 0 }]);
    }
  });

  let mapcodes = new Map(result);

  // ON REPREND ICI !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const fontsize = 15;
  const wmargin = 5;
  const width = 1000;

  // get sizes
  const data2 = Array.from(mapcodes.values());
  const sizes = [];
  let svg = d3.create("svg");
  data2.forEach((e) => {
    const txt = svg
      .append("text")
      .attr("font-size", `${fontsize}px`)
      .text(`${e.iso3 ? "[" + e.iso3 + "] " : ""}${e.name}`);
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
      name: data2[i].name,
      iso3: data2[i].iso3,
      score: data2[i].score,
      x: x,
      y: y,
      w: widths[i],
      h: h,
    });
  }

  console.log(newdata);

  const height = d3.max(newdata.map((d) => d.y)) + h / 2;

  const getcol = (d) => {
    let col = "#c26932";
    if (d == 0) {
      col = "#696969";
    }
    if (d == 1) {
      col = "#17802e";
    }
    return col;
  };

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
    .attr("fill", (d) => getcol(d.score))
    .attr("fill-opacity", (d) => (d.score == 0 ? 0 : 0.3))
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .lower();

  svg
    .append("g")
    .selectAll("text")
    .data(newdata)
    .join("text")
    .attr("dominant-baseline", "middle")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    //.attr("text-decoration", (d) => (d.score == 0 ? "line-through" : "none"))
    .attr("font-size", fontsize)
    .attr("fill", (d) => getcol(d.score))
    .text((d) => `${d.iso3 ? "[" + d.iso3 + "] " : ""}${d.name}`);

  return svg.node();
}
