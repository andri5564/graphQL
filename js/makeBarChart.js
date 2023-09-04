const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

function render(data) {
  const xValue = (d) => d.xp;
  const yValue = (d) => d.task;
  const margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 150,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = d3.scaleBand().domain(data.map(yValue)).range([0, innerHeight]).padding(0.21);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g").call(d3.axisLeft(yScale));
  g.append("g").call(d3.axisBottom(xScale)).attr("transform", `translate(0,${innerHeight})`);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth());

  g.append("text")
    .attr("y", 40)
    .attr("x", -60)
    .attr("dy", ".75em")
    .attr("transform", `translate(${innerWidth / 2},${innerHeight})`)
    .attr("class", "chartLabel")
    .text("XP gained");
}

async function getDoneTasks(transactions) {
  const elements = [];
  transactions.forEach((elem) => {
    if (elem.type == "xp" && !elem.path.includes("piscine")) {
      const pathParts = elem.path.split("/");
      const result = {
        task: pathParts[pathParts.length - 1],
        xp: elem.amount,
      };
      elements.push(result);
    }
  });
  return elements;
}

async function makeGraph(transactions) {
  const elements = await getDoneTasks(transactions);
  render(elements);
}
