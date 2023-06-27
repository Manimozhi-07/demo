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
  var app2=qlik.openApp("745e4bbe-8613-4999-b89f-8da89ed7985b",config);
  app1.getObject("ob", "fxyuxvp");
  app1.getObject("kpi1", "JRNGq");
  app1.getObject("kpi2", "PUpAQty");
  app1.getObject("kpi3", "sKDevh");
  app2.getObject("kpi4", "jkzTx");
  app2.getObject("kpi5","PhSaEN");
  app2.getObject("kpi6","PhSaEN");
  app1.getObject("pie", "cXahBQ");
  app1.getObject("lc1","JRVHPjJ");
  app1.getObject("lc2","nrEGj");
  app1.getObject("lc3","JRVHPjJ");
  app1.getObject("lc4","JRVHPjJ");
  app.getObject("table", "pvJDPB");
  app.getObject("chartobj", "tTZQUX");
  //callbacks -- inserted here --
  function CustomTable(reply, app) {
    $.each(reply.qHyperCube.qDataPages[0].qMatrix, function (k, val) {
      if (k <4) {
        var html =
          "<tr><td>" +
          val[0].qText +
          "</td>" +
          "<td>" +
          val[1].qText +
          "</td></tr>";
       
        $("#customTable").append(html);
      }
     
    });
  }

  //create cubes and lists -- inserted here --
  app.createCube(
    {
      qInitialDataFetch: [
        {
          qHeight: 20,
          qWidth: 2,
        },
      ],
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Product Category"],
          },
          qNullSuppression: true,
          qOtherTotalSpec: {
            qOtherMode: "OTHER_OFF",
            qSuppressOther: true,
            qOtherSortMode: "OTHER_SORT_DESCENDING",
            qOtherCounted: {
              qv: "5",
            },
            qOtherLimitMode: "OTHER_GE_LIMIT",
          },
        },
      ],
      qMeasures: [
        {
          qDef: {
            qDef: "Count(Product)",
          },
          qLabel: "Product",
          qLibraryId: null,
          qSortBy: {
            qSortByState: 0,
            qSortByFrequency: 0,
            qSortByNumeric: 0,
            qSortByAscii: 1,
            qSortByLoadOrder: 0,
            qSortByExpression: 0,
            qExpression: {
              qv: " ",
            },
          },
        },
      ],
      qSuppressZero: false,
      qSuppressMissing: false,
      qMode: "S",
      qInterColumnSortOrder: [],
      qStateName: "$",
    },
    CustomTable
  );

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

//callbacks -- inserted here --
function CustomTable(reply, app) {}

//create cubes and lists -- inserted here --
app.createCube(
  {
    qInitialDataFetch: [
      {
        qHeight: 20,
        qWidth: 2,
      },
    ],
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ["Product Category"],
        },
        qNullSuppression: true,
        qOtherTotalSpec: {
          qOtherMode: "OTHER_OFF",
          qSuppressOther: true,
          qOtherSortMode: "OTHER_SORT_DESCENDING",
          qOtherCounted: {
            qv: "5",
          },
          qOtherLimitMode: "OTHER_GE_LIMIT",
        },
      },
    ],
    qMeasures: [
      {
        qDef: {
          qDef: "Count(Product)",
        },
        qLabel: "Count(Product)",
        qLibraryId: null,
        qSortBy: {
          qSortByState: 0,
          qSortByFrequency: 0,
          qSortByNumeric: 0,
          qSortByAscii: 1,
          qSortByLoadOrder: 0,
          qSortByExpression: 0,
          qExpression: {
            qv: " ",
          },
        },
      },
    ],
    qSuppressZero: false,
    qSuppressMissing: false,
    qMode: "S",
    qInterColumnSortOrder: [],
    qStateName: "$",
  },
  CustomTable
);
