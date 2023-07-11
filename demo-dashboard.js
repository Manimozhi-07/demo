/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr(
  0,
  window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1
);
var config = {
  host: window.location.hostname,
  prefix: prefix,
  port: window.location.port,
  isSecure: window.location.protocol === "https:",
};
require.config({
  baseUrl:
    (config.isSecure ? "https://" : "http://") +
    config.host +
    (config.port ? ":" + config.port : "") +
    config.prefix +
    "resources",
});

require(["js/qlik"], function (qlik) {
  var app = qlik.openApp("a92e83cb-98b5-4c02-9dad-753067b309bd", config); //open app

  $(document).ready(function () {
    $("#ob").addClass("load");

    app.getObject("ob", "VPZjNP").then(function () {
      $("#ob").removeClass("load");
    });
    $("#table").addClass("load");
    app.getObject("table", "pvJDPB").then(function () {
      $("#table").removeClass("load");
    });
    $("#chartobj").addClass("load");
    app.getObject("chartobj", "tTZQUX").then(function () {
      $("#chartobj").removeClass("load");
    });

    //Data

    async function getObj() {
      const response = await fetch("object.json");
      const data = await response.json(); //object
      return data; // async function always returns promise
    }

    async function mainDisplay() {
      $("#kpi4").addClass("load");
      const val = await getObj(); //object ||r data
      console.log(val);
      const ob = Object.entries(val["Data"]);

      ob.forEach(([k, v]) => {
        console.log(k);
        console.log(v);
        app
          .createGenericObject({
            fields: {
              qValueExpression: "=" + v,
            },
          })
          .then(function (reply) {
            reply.getLayout().then(function (layout) {
              console.log(layout);

              var measureValue = layout.fields;
              console.log(k, measureValue);
              if (k === "indicator") {
                console.log(measureValue);
                if (measureValue > 5) {
                  var html =
                    "<span><i class='fa-solid fa-arrow-up'></i>&nbsp;" +
                    measureValue +
                    "</span>";
                  $("#" + k).append(html);
                  $("#" + k).addClass("green");
                } else {
                  var html =
                    "<span><i class='fa-solid fa-arrow-down'></i>&nbsp;" +
                    measureValue +
                    "</span>";
                  $("#" + k).append(html);
                  $("#" + k).addClass("red");
                }
              } else {
                var html = "<span>" + measureValue + "</span>";
                $("#" + k).append(html);
              }
            });
            $("#kpi4").removeClass("load");
          });
      });
    }

    mainDisplay();

    var tableProp = {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Product Category"],
          },
        },
      ],
      qMeasures: [
        {
          qDef: {
            qDef: "Sum(UnitPrice)",
          },
        },
        {
          qDef: {
            qDef: "Count(Product)",
          },
        },
        {
          qDef: {
            qDef: "Min(UnitPrice)",
          },
        },
      ],

      qInitialDataFetch: [
        {
          qTop: 0,
          qHeight: 20, // Number of rows to retrieve
          qLeft: 0,
          qWidth: 20, // Number of columns to retrieve
        },
      ],
    };

    //KPIs
    $(".wrap").addClass("load");
    app.createCube(tableProp, function (r) {
      var tdata = r.qHyperCube.qDataPages[0].qMatrix;
      console.log(tdata);

      function retriveData(title, main, sub, indi) {
        var titleId = "kpi-" + title;

        console.log(titleId);
        console.log(title);
        document.getElementById(title).innerText = title;
        document.getElementById("maindata-" + title).innerText = main;
        document.getElementById("subdata-" + title).innerText = sub;

        if (indi > 5) {
          console.log(indi);
          document.getElementById("indicator-" + title).innerHTML =
            "<i class='fa-solid fa-arrow-up'></i>&nbsp;" + indi;
          document
            .getElementById("indicator-" + title)
            .classList.add("positive");
        } else {
          console.log(indi);
          document.getElementById("indicator-" + title).innerHTML =
            "<i class='fa-solid fa-arrow-down'></i>&nbsp;" + indi;
          document
            .getElementById("indicator-" + title)
            .classList.add("negative");
        }
      }

      $.each(tdata, function (k, v) {
        if (v[0].qText === "Men's Clothes") {
          retriveData(v[0].qText, v[1].qText, v[2].qText, v[3].qText);
        } else if (v[0].qText === "Women's Clothes") {
          retriveData(v[0].qText, v[1].qText, v[2].qText, v[3].qText);
        } else if (v[0].qText === "Baby Clothes") {
          retriveData(v[0].qText, v[1].qText, v[2].qText, v[3].qText);
        }
      });
      $(".wrap").removeClass("load");
    });

    //3 Products
    // appendFn("second");
    $(".chartcont").addClass("load");
    app.createCube(tableProp, function (reply) {
      const d = reply.qHyperCube.qDataPages[0].qMatrix;
      var xArr = [];
      var yArr = [];

      $("#currency").empty();

      $.each(d, function (k, v) {
        var xVal;
        var yVal;
        if (k < 3) {
          xVal = v[0].qText;
          yVal = v[3].qText;
          xArr.push(xVal);
          yArr.push(yVal);

          const display =
            "<tr><td>" +
            v[0].qText +
            "</td><td style='color:" +
            (v[3].qText > 5 ? "green" : "red") +
            "'>" +
            (v[3].qText > 5
              ? '<i class="fa-solid fa-arrow-up" style="color:green;text-align:center"></i>&nbsp;'
              : '<i class="fa-solid fa-arrow-down" style="color:red;text-align:center"></i>&nbsp;') +
            v[3].qText +
            "</td></tr>";
          $("#currency").append(display);
        }
      });

      console.log(xArr, yArr);

      new Chart($("#pie"), {
        type: "doughnut",
        data: {
          labels: xArr,

          datasets: [
            {
              data: yArr,
              backgroundColor: ["#f49b41", "#6182fb", "#7545fa"],
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          cutoutPercentage: 70,
          elements: {
            arc: {
              borderWidth: 3,
            },
          },
        },
      });
      $(".chartcont").removeClass("load");
    });

    //Summary Table
    // appendFn("tbl");
    $("#tbl").addClass("load");
    app.getObjectProperties("pvJDPB").then(function (model) {
      model
        .getHyperCubeData("/qHyperCubeDef", [
          { qTop: 0, qLeft: 0, qWidth: 12, qHeight: 100 },
        ])
        .then((d) => {
          $("#tbl").removeClass("load");
          console.log(d[0].qMatrix); //8

          $.each(d[0].qMatrix, function (k, value) {
            var xAxis = [];
            var yAxis = [];

            if (k < 4) {
              console.log(value[3].qMiniChart.qMatrix); //12

              var xValue;
              var yValue;

              value[3].qMiniChart.qMatrix.map(function (val) {
                console.log(val);
                xValue = val[0].qText;
                yValue = val[1].qNum;
                xAxis.push(xValue);
                yAxis.push(yValue);
                console.log(xValue, yValue);
              });

              console.log(xAxis); //xAxis Array
              console.log(yAxis); //yAxis Array

              //Appending table data
              const htmlcont =
                "<tr><td>" +
                "<span >Product</span><br>" +
                value[0].qText +
                "</td>" +
                "<td>" +
                "<span >Count</span><br>" +
                value[1].qText +
                "</td>" +
                "<td style='color:" +
                (value[6].qText > 5 ? "green" : "red") +
                "'>" +
                "<span >Min(Unit Price)</span><br>" +
                (value[6].qText > 5
                  ? '<i class="fa-solid fa-arrow-up" style="color:green;text-align:center"></i>&nbsp;'
                  : '<i class="fa-solid fa-arrow-down" style="color:red;text-align:center"></i>&nbsp;') +
                value[6].qText +
                "</td>" +
                "<td style=color:" +
                (value[7].qText > 50 ? "green" : "red") +
                ">" +
                "<span>Max(Unit Price)</span><br>" +
                (value[7].qText > 50
                  ? '<i class="fa-solid fa-arrow-up" style="color:green;text-align:center"></i>&nbsp;'
                  : '<i class="fa-solid fa-arrow-down" style="color:red;text-align:center"></i>&nbsp;') +
                value[7].qText +
                "</td>" +
                "<td><canvas id='linecrt" +
                k +
                "'></canvas></td><td class='buttonbox'>" +
                "<button class='button sellbtn'>Sell</button>" +
                "<button class='button activebtn'>Buy</button>" +
                "</td></tr>";

              $("#tbl").append(htmlcont);
              const backgroundcolor = [];
              const bordercolor = [];
              if (value[7].qText > 50) {
                bordercolor.push("green");
                backgroundcolor.push("#bfebbf");
              } else {
                bordercolor.push("red");
                backgroundcolor.push("#f1caca");
              }
              new Chart($("#linecrt" + k), {
                type: "line",
                data: {
                  labels: xAxis,
                  datasets: [
                    {
                      fill: true,
                      lineTension: 0,
                      backgroundColor: backgroundcolor,
                      borderColor: bordercolor,
                      borderWidth: 2,
                      data: yAxis,
                      pointRadius: 0,
                    },
                  ],
                },
                options: {
                  legend: { display: false },
                  scales: {
                    yAxes: [{ ticks: { min: 100, max: 3000 } }],
                  },
                  scales: {
                    xAxes: [
                      {
                        display: false,
                      },
                    ],
                    yAxes: [
                      {
                        display: false,
                      },
                    ],
                  },
                },
              });
            }
          });
        });
    });
    //Bookmark
    $("#monthdd").change(function () {
      var val = $("#monthdd").val();
      console.log(val);
    });
    //Main-content Switch
    function removeActiveMain() {
      $("#list li").removeClass("activelist");
      $("#content .main").removeClass("activemain");
    }

    $("#list li").each(function (i) {
      $(this).on("click", function () {
        removeActiveMain();
        $(this).addClass("activelist");
        $("#content .main").eq(i).addClass("activemain");
        //qlik resize
        qlik.resize();
      });
    });

    //Tab Switch
    function removeActive() {
      $("#tabs span").removeClass("activetab");
      $(".tab-content").removeClass("activetab-content");
    }
    $("#tabs span").each(function (i) {
      $(this).on("click", function () {
        removeActive();
        $(this).addClass("activetab");
        $(".tab-content").eq(i).addClass("activetab-content");
        qlik.resize();
      });
    }); //Tab Switch
  });
});
