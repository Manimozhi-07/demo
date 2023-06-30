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
  var app = qlik.openApp("a92e83cb-98b5-4c02-9dad-753067b309bd", config);
  var app1 = qlik.openApp("509332f9-1461-4a37-8b3f-84eab2666ec4", config);
  var tableapp = qlik.openApp("36d5ea82-cd8a-429f-9bd2-0fba39580bb9", config);
  var app2 = qlik.openApp("745e4bbe-8613-4999-b89f-8da89ed7985b", config);
  // app1.getObject("ob", "fxyuxvp");
  app1.getObject("pie", "cXahBQ");
  app1.getObject("lc1", "JRVHPjJ");
  app1.getObject("lc2", "nrEGj");
  app1.getObject("lc3", "JRVHPjJ");
  app1.getObject("lc4", "JRVHPjJ");
  app.getObject("table", "pvJDPB");
  app.getObject("chartobj", "tTZQUX");

  app.visualization
    .create(
      "linechart",
      ["Product Category", "OrderDate.autoCalendar.Month", "=Avg([Sales])"],
      {
        lineType: "area",
        nullMode: "connect",
        dataPoint: {
          show: true,
          showLabels: true,
        },
      }
    )
    .then(function (visual) {
      console.log(visual);
      visual.show("ob");
    });

  var tableProperties = {
    qInfo: {
      qType: "table",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Currency"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["Currency Code"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["24 hr change"],
          },
        },
      ],

      qInitialDataFetch: [
        {
          qTop: 0,
          qHeight: 4, // Number of rows to retrieve
          qLeft: 0,
          qWidth: 3, // Number of columns to retrieve
        },
      ],
    },
  };
  tableapp.createGenericObject(tableProperties, function (reply) {
    var tableData = reply.qHyperCube.qDataPages[0].qMatrix;
    console.log(tableData);
    $.each(reply.qHyperCube.qDataPages[0].qMatrix, function (k, val) {
      if (k < 3) {
        var html =
          "<tr><td>" +
          val[0].qText +
          "<br>" +
          val[1].qText +
          "</td>" +
          "<td style='color:" +
          (val[2].qNum > 0 ? "green" : "red") +
          "'>" +
          val[2].qText +
          "</td></tr>";

        $("#currency").append(html);
      }
    });
  });

  app.getObjectProperties("pvJDPB").then(function (model) {
    model
      .getHyperCubeData("/qHyperCubeDef", [
        { qTop: 0, qLeft: 0, qWidth: 12, qHeight: 100 },
      ])
      .then((d) => {
        console.log(d[0].qMatrix); //8
        $.each(d[0].qMatrix, function (k, value) {
          if (k < 4) {
            console.log(value[3].qMiniChart.qMatrix); //12
            var xValue ;
            value[3].qMiniChart.qMatrix.map(function (val) {
               xValue = val[0].qText;
              var yValue = val[1].qNum;
              console.log(xValue);
              console.log(xValue, yValue);
            });
            

            // Extract X and Y values from data points
            // const xValues = dataPoints.map(function (point) {
            //   console.log(point.x);
            //   return point.x;
            // });

            // const yValues = dataPoints.map(function (point) {
            //   return point.y;
            // });
            // $.each(xValues,function(xValue){
            //   xAxis.push(xValue);
            // });
            // Create the mini chart using Qlik Sense visualization API
            // const chartOptions = {
            //   title: "Mini Chart",
            //   type: "linechart", // Adjust the chart type as needed
            //   dimensions: {
            //     min: 2,
            //     max: 2,
            //   },
            //   measures: {
            //     min: 2,
            //     max: 2,
            //   },
            //   data: {
            //     targets: [0],
            //     rows: [
            //       xValues.map(function (xValue) {
            //         console.log(xValue);
            //         xAxis.append(xValue);
            //         return {
            //           qText: xValue,
            //         };
            //       }),
            //       yValues.map(function (yValue) {
            //         console.log(yValue);
            //         return {
            //           qNum: yValue,
            //         };
            //       }),
            //     ],
            //   },
            // };

            // const xAxis = [];
            // console.log(xAxis);
            // const yAxis = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

            // new Chart("tabledata" + k, {
            //   type: "line",
            //   data: {
            //     labels: xAxis,
            //     datasets: [
            //       {
            //         fill: false,
            //         lineTension: 0,
            //         backgroundColor: "rgba(0,0,255,1.0)",
            //         borderColor: "rgba(0,0,255,0.1)",
            //         data: yAxis,
            //       },
            //     ],
            //   },
            // });
            // console.log(
            //   value[0].qText,
            //   value[1].qNum,
            //   value[6].qNum,
            //   value[7].qNum
            // );
            // const dataval = "<tr><td>" + value[0].qText + "</td>" + "<td>";
          }
          
        });
      
      });
  });

  // Get the table data
  // hypercubeObject.getHyp('/qHyperCubeDef', [{ qTop: 0, qLeft: 0, qWidth: 10, qHeight: 100 }]).then(data => {
  // console.log(data);
  //   // const tbldata = data.qDataPages[0].qMatrix;
  //   // console.log(tbldata);
  // }).catch(error => {
  //   console.error('Error retrieving hypercube data:', error);
  // });

  async function getObj() {
    const response = await fetch("object.json");
    const data = await response.json(); //object
    return data; // async function always returns promise
  }
  async function mainDisplay() {
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

            var html = "<span>" + measureValue + "</span>";
            $("#" + k).append(html);
          });
        });
    });
  }
  mainDisplay();

  $(document).ready(function () {
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
    });
  });
});
