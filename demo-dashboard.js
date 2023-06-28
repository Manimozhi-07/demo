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
  var app2 = qlik.openApp("745e4bbe-8613-4999-b89f-8da89ed7985b", config);
  app1.getObject("ob", "fxyuxvp");
  // app1.getObject("kpi1", "JRNGq");
  // app1.getObject("kpi2", "PUpAQty");
  // app1.getObject("kpi3", "sKDevh");
  // app2.getObject("kpi4", "jkzTx");
  // app2.getObject("kpi5", "PhSaEN");
  // app2.getObject("kpi6", "PhSaEN");
  app1.getObject("pie", "cXahBQ");
  app1.getObject("lc1", "JRVHPjJ");
  app1.getObject("lc2", "nrEGj");
  app1.getObject("lc3", "JRVHPjJ");
  app1.getObject("lc4", "JRVHPjJ");
  app.getObject("table", "pvJDPB");
  app.getObject("chartobj", "tTZQUX");
  //callbacks -- inserted here --

  // function kpi4(reply, app) {
  //   $.each(reply.qHyperCube.qDataPages[0].qMatrix, function (k, val) {
  //     function data() {
  //       var html = "<span>" + val[1].qText + "</span>";
  //       return html;
  //     }
  //     if (val[0].qText === "Men's Clothes") {
  //       $("#kpi4").append(data());
  //     }
  //     // else if(val[0].qText === "Sportswear"){

  //     //   $("#kpi1").append(data());
  //     // }
  //   });
  //   console.log(reply);
  // }

  // app.createCube(
  //   {
  //     qInitialDataFetch: [
  //       {
  //         qHeight: 20,
  //         qWidth: 2,
  //       },
  //     ],
  //     qDimensions: [
  //       {
  //         qDef: {
  //           qFieldDefs: ["Product Category"],
  //         },
  //         qNullSuppression: true,
  //         qOtherTotalSpec: {
  //           qOtherMode: "OTHER_OFF",
  //           qSuppressOther: true,
  //           qOtherSortMode: "OTHER_SORT_DESCENDING",
  //           qOtherCounted: {
  //             qv: "5",
  //           },
  //           qOtherLimitMode: "OTHER_GE_LIMIT",
  //         },
  //       },
  //     ],
  //     qMeasures: [
  //       {
  //         qDef: {
  //           qDef: "Count(Product)",
  //         },

  //         qLabel: "Product",

  //         qLibraryId: null,
  //         qSortBy: {
  //           qSortByState: 0,
  //           qSortByFrequency: 0,
  //           qSortByNumeric: 0,
  //           qSortByAscii: 1,
  //           qSortByLoadOrder: 0,
  //           qSortByExpression: 0,
  //           qExpression: {
  //             qv: " ",
  //           },
  //         },
  //       },
  //     ],
  //     qSuppressZero: false,
  //     qSuppressMissing: false,
  //     qMode: "S",
  //     qInterColumnSortOrder: [],
  //     qStateName: "$",
  //   },
  //   kpi4
  // );

 
  //single value

  // async function test(objectId) {
  //   var object = await app2.getObject(objectId);
  //   var layout = await object.getLayout();

  //   console.log(layout);
  //   return layout.qHyperCube.qDataPages[0].qMatrix[0][0].qNum;
  // }
  // async function value(objectId,id) {
  //   var html = "<span>" + (await test(objectId)) + "</span>";
  //   $(id).append(html);
  // }
  // value("jkzTx","#kpi4");
  // value("PhSaEN","#kpi5");
  // value("PhSaEN","#kpi6");
  async function getObj() {
    const response = await fetch("object.json");
    const data = await response.json(); //object
    return data; // async function always returns promise
  }
  async function mainDisplay() {
    const val = await getObj(); //object ||r data
    console.log(val);
    const ob = Object.entries(val); 
    
    ob.forEach(([k, v]) => {
      console.log(k);
      console.log(v);
      app.createGenericObject({
        fields: {
          qValueExpression: "="+v
        }
      }).then(function(reply) {
        reply.getLayout().then(function(layout) {
          console.log(layout);
          var measureValue = layout.fields;
    
          var html="<span>"+measureValue+"</span>";
          $("#"+k).append(html);
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

