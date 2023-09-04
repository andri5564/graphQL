async function makePieChart(transactions) {
  const val1D = document.getElementById("donut-segment1");
  const val2D = document.getElementById("donut-segment2");
  const val3D = document.getElementById("donut-segment3");
  const totalValue = document.getElementById("totalValue");
  const tasks = getTasksCounts(transactions);
  const text1 = "Go piscine: " + tasks.piscine_go;
  const text2 = "JavaScript piscine: " + tasks.piscine_js;
  const text3 = "Projects: " + tasks.project;
  const svg = d3.select("#textSvg").attr("transform", `translate(0,0)`);

  calculate(tasks, val1D, val2D, val3D, totalValue);
  createTextSection(svg, text1, text2, text3);
}

async function makeXPPieChart(transactions) {
  const val1D = document.getElementById("donut-segment6");
  const val2D = document.getElementById("donut-segment5");
  const val3D = document.getElementById("donut-segment4");
  const totalValue = document.getElementById("totalValue2");
  const tasks = getTasksXP(transactions);
  const text1 = "Go piscine: " + tasks.piscine_go + "kB";
  const text2 = "JavaScript piscine: " + tasks.piscine_js + "kB";
  const text3 = "Div 01: " + tasks.project + "kB";
  const svg = d3.select("#textSvg2").attr("transform", `translate(0,0)`);

  calculate(tasks, val1D, val2D, val3D, totalValue);
  createTextSection(svg, text1, text2, text3);
}
async function calculate(tasks, val1D, val2D, val3D, totalValue) {
  var val1 = tasks.project;
  var val2 = tasks.piscine_go;
  var val3 = tasks.piscine_js;

  var total = val1 + val2 + val3;

  var per1 = (val1 / total) * 100;
  var per2 = (val2 / total) * 100;
  var per3 = (val3 / total) * 100;
  var offset = 25;

  totalValue.textContent = total;

  val1D.style.strokeDasharray = per1 + " " + (100 - per1);
  val1D.style.strokeDashoffset = offset;

  val2D.style.strokeDasharray = per2 + " " + (100 - per2);
  val2D.style.strokeDashoffset = 100 - per1 + offset;

  val3D.style.strokeDasharray = per3 + " " + (100 - per3);
  val3D.style.strokeDashoffset = 100 - (per1 + per2) + offset;

  const textSection = d3.select("#textSection");
  textSection.attr("transform", `translate(0,0)`);
}

function createTextSection(svg, text1, text2, text3) {
  const rectSize = 10;
  const textLeftOffset = 15;
  const blockBaseY = 10;
  const textBaseY = 20;
  const textHeightOffset = 25;

  svg.append("rect").attr("width", rectSize).attr("height", rectSize).attr("y", blockBaseY).attr("fill", "#b1c94e");

  svg
    .append("rect")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("y", blockBaseY + textHeightOffset)
    .attr("fill", "#aaddff");

  svg
    .append("rect")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("y", blockBaseY + textHeightOffset * 2)
    .attr("fill", "#ce4b99");

  svg.append("text").attr("x", textLeftOffset).attr("y", textBaseY).text(text1);

  svg
    .append("text")
    .attr("x", textLeftOffset)
    .attr("y", textBaseY + textHeightOffset)
    .text(text2);

  svg
    .append("text")
    .attr("x", textLeftOffset)
    .attr("y", textBaseY + textHeightOffset * 2)
    .text(text3);
}

function getTasksCounts(transactions) {
  const tasks = {
    piscine_js: 0,
    piscine_go: 0,
    project: 0,
  };
  transactions.forEach((elem) => {
    if (elem.type == "xp") {
      if (elem.path.includes("piscine-js")) {
        tasks.piscine_js += 1;
      } else if (elem.path.includes("piscine-go")) {
        tasks.piscine_go += 1;
      } else {
        tasks.project += 1;
      }
    }
  });
  return tasks;
}

function getTasksXP(transactions) {
  const tasks = {
    piscine_js: 0,
    piscine_go: 0,
    project: 0,
  };
  transactions.forEach((elem) => {
    if (elem.type == "xp") {
      if (elem.path.includes("piscine-js")) {
        tasks.piscine_js += elem.amount;
      } else if (elem.path.includes("piscine-go")) {
        tasks.piscine_go += elem.amount;
      } else {
        tasks.project += elem.amount;
      }
    }
  });
  for (const key in tasks) {
    tasks[key] = Math.round(tasks[key] / 1000);
  }
  return tasks;
}
