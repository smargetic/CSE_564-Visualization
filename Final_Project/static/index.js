var yAxisNumber = 10;
var activeSvg =0;
var paddingValue =0.1;
var mapExists =0;
var mapGlo = null;

var attrState = "";
var attrBuis = "";
var lastHoveredOver = "";

var stateSet = 0;
var scatterPlotActive =0;
var barGraphActive =0;



changeNums = {"Alabama": 1, "Alaska": 2, "Arizona": 3, "Arkansas": 4, "California": 5, "Colorado": 6, "Connecticut": 7, "Delaware": 8,
              "Florida": 9, "Georgia": 10, "Hawaii": 11, "Idaho": 12, "Illinois": 13, "Indiana": 14, "Iowa": 15, "Kansas": 16,
              "Kentucky": 17, "Louisiana": 18, "Maine": 19, "Maryland": 20, "Massachusetts": 21, "Michigan": 22, "Minnesota": 23, "Mississippi": 24,
              "Missouri": 25, "Montana": 26, "Nebraska": 27, "Nevada": 28, "New Hampshire": 29, "New Jersey": 30, "New Mexico": 31, "New York": 32,
              "North Carolina": 33, "North Dakota": 34, "Ohio": 35, "Oklahoma": 36, "Oregon": 37, "Pennsylvania": 38, "Rhode Island": 39, "South Carolina": 40,
              "South Dakota": 41, "Tennessee": 42, "Texas": 43, "Utah": 44, "Vermont": 45, "Virginia": 46, "Washington": 47, "West Virginia": 48,
              "Wisconsin": 49, "Wyoming": 50, "Puerto Rico": 51, "District of Columbia" : 52
              }
changeWords = {1:"Alabama", 2:"Alaska", 3: "Arizona",4: "Arkansas", 5:"California", 6:"Colorado", 7:"Connecticut", 8:"Delaware",
              9: "Florida", 10:"Georgia", 11:"Hawaii", 12:"Idaho", 13:"Illinois", 14:"Indiana", 15:"Iowa", 16:"Kansas",
              17: "Kentucky",18: "Louisiana", 19:"Maine", 20:"Maryland",21:"Massachusetts", 22:"Michigan", 23:"Minnesota", 24:"Mississippi",
              25: "Missouri",26: "Montana", 27:"Nebraska", 28:"Nevada", 29:"New Hampshire", 30:"New Jersey",31: "New Mexico", 32:"New York",
              33: "North Carolina",  34:"North Dakota", 35:"Ohio", 36:"Oklahoma", 37:"Oregon", 38:"Pennsylvania", 39:"Rhode Island",40: "South Carolina",
              41: "South Dakota",  42:"Tennessee",43: "Texas", 44:"Utah", 45:"Vermont",  46:"Virginia", 47:"Washington",  48:"West Virginia",
              49: "Wisconsin",50 : "Wyoming",  51:"Puerto Rico", 52:"District of Columbia"
              }

function changeyAxisNumber(number){
  yAxisNumber = number;
}


function changeStateName(name){
  var temp = name.split("<");
  var bigTemp =[]
  count =0
  for (var i=0;i<temp.length;i++){
    var anotherTemp = temp[i].split(">")
    for(var j=0; j<anotherTemp.length; j++){
      bigTemp[count] = anotherTemp[j]
      count = count+1
    }
  }
  if(bigTemp.length>5){
    lastHoveredOver = bigTemp[6]
  }
}

//shows graph and removes home menu
function showGraphMenuAndHideHomeMenu(){
  document.getElementById("screeVirticleMenu").style.display = "block";
    document.getElementById("home-menu").style.display = "none";
    document.getElementById("anotherBox").style.display = "none";
}

//hides graphs and goes back to home menu
function hideGraphMenuAndShowHomeMenu(){
  document.getElementById("home-menu").style.display = "block";
  document.getElementById("screeVirticleMenu").style.display = "none";
  document.getElementById("anotherBox").style.display= "block";
  document.getElementById("mySlider").style.display = "none";
  d3.select("svg").remove();
  activeSvg = 0;
  currentGraphAttribute = "";
}

function hideBigMenu(){
  document.getElementById("topnav").style.display = "none";
}

function screePlot4All3(a){
  //gets data for all three
  var tempA = JSON.parse(a);
  stratData = tempA.stratEigVal;
  orgData = tempA.orgEigVal;
  randData = tempA.randEigVal;

  if(activeSvg ==1){
    //checks if there is already a graph, and removes it
      d3.select("svg").remove();
  }
  activeSvg = 1;


  //create the margins
  var margin = {top: 40, right: 25, bottom: 40, left: 70},
    width = 700 - margin.right - margin.left,
    height = 500- margin.top - margin.bottom;


  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";


  var arrayOfXAxis = [];
  for (var i=0; i<stratData.length; i++){
    arrayOfXAxis[i] = i+1;
  }

  var xScale = d3.scaleBand()
  .domain(arrayOfXAxis) //values
  .range([0,width]) //location of start

  ;

  //y scale range
  var yScaleMax = Math.ceil(stratData[0]);
  if(orgData[0]>yScaleMax){
    yScaleMax = Math.ceil(orgData[0]);
  }
  if(randData[0]>yScaleMax){
    yScaleMax = Math.ceil(randData[0]);
  }

  //where to place data points in terms of x-axis
  var arrayForXScale = new Array(arrayOfXAxis.length);
  for(var j=0; j<arrayOfXAxis.length ; j++){
    arrayForXScale[j] = xScale(arrayOfXAxis[j]);
  }

  //y scale attributes
  var yScale = d3.scaleLinear()
  .domain([0, yScaleMax])
  .range([temp2, 0]);

  //create an instance of svg
  var svgTemp = d3.select("body").append("svg");

  //other attributes
  var dataType = "All Three"
  svgTemp.attr("id", dataType); //need to fix
  svgTemp.attr("class", ".background_svg_color");
  
  //set attributes of svg
  svgTemp.attr("height", width).attr("width", width+100);


  //xAxis instance
  var xAxis = svgTemp.append("g")
  .classed("xAxis", true)
  .attr("transform", "translate(" + margin.left + "," + (height + margin.top + margin.bottom) + ")")
  .call(d3.axisBottom(xScale))
  ;

  //label xAxis
  var xAxisLabel = svgTemp.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 50) + ")")
  .attr("font-family", "Courier")
  .style("font-size", "20px");

  //yAxis instance
  var yAxis = svgTemp.append("g")
  .classed("yAxis", true)
  .attr("transform", "translate(" + margin.left  + "," +  margin.top+ ")")
  .call(d3.axisLeft(yScale).ticks(yAxisNumber));

  //yAxisLabel
  var yAxisLabel = svgTemp.append("text")
  .attr("transform", "translate(" + 30 + "," + (height/2+60) + ")rotate(-90)")
  .attr("font-family", "Courier")
  .style("font-size", "20px");

  //shows data for strat data line graph
  var tooltipStrat = svgTemp
  .append("text")
  .data(stratData)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;

    //shows data for rand data line graph
  var tooltipRand = svgTemp
  .append("text")
  .data(randData)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;

  //shows data for original data line graph
  var tooltipOrg = svgTemp
  .append("text")
  .data(orgData)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;
  


  //brings object to front
  d3.selection.prototype.move2Front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  //size of each bar
  var differenceInPositions = arrayForXScale[1] - arrayForXScale[0];

//scales for lines
var valuelineRand = d3.line()
  .x(function(d,i) { return arrayForXScale[i] + differenceInPositions*2 -18; })
  .y(function(d) { return yScale(d-.355); });

// line for rand data
svgTemp.append("path")
  .attr("class", "line")
  .style("stroke","rgba(198, 45, 205, 0.8)" )
  .attr("d", valuelineRand(randData));

//line for org data
svgTemp.append("path")
  .attr("class", "line")
  .style("stroke","#8CD3DD" )
  .attr("d", valuelineRand(orgData));

//line for strat data
svgTemp.append("path")
  .attr("class", "line")
  .style("stroke","#FF8C00" )
  .attr("d", valuelineRand(stratData));

  //rand data points
  var randDataPoints = svgTemp.append("g")
  .attr("transform", yAxisPosition)
  .selectAll("dot")
  .data(randData)
  .enter()
  .append("circle")
  .attr("fill", "rgba(198, 45, 205, 0.8)")
  .attr("cx", function(d,i){ 
    return arrayForXScale[i] + differenceInPositions/2 })
  .attr("cy", function(d){return  yScale(d)})
  .attr("r", 5.0)
  .on("mouseover", function(d,i){
  //   //while hovering, changes color, width and height
     d3.select(this).style("fill", "red"); tooltipRand.style("visibility", "visible"); 
                  tooltipRand.text( "EigenValue: " + Math.round(d*1000)/1000).move2Front();
                  tooltipRand.attr("x", (arrayForXScale[i] + margin.left +40 ));
                  tooltipRand.attr("y",  yScale(d) +20);
                  tooltipRand.move2Front();
                  d3.select(this).attr("r", 6.0);
              }
   )
  // //when not hovering, changes color, width, and height back
   .on("mouseout", function(d,i){
     d3.select(this).style("fill", "rgba(198, 45, 205, 0.8)"); tooltipRand.style("visibility", "hidden");
     d3.select(this).attr("r", 5.0);
  });


  //strat data points
   var stratDataPoints = svgTemp.append("g")
   .attr("transform", yAxisPosition)
   .selectAll("dot")
   .data(stratData)
   .enter()
   .append("circle")
   .attr("fill", "#FF8C00")
   .attr("cx", function(d,i){ 
     return arrayForXScale[i] + differenceInPositions/2})
   .attr("cy", function(d){return  yScale(d)})
   .attr("r", 5.0)
   .on("mouseover", function(d,i){
   //   //while hovering, changes color, width and height
      d3.select(this).style("fill", "red"); tooltipStrat.style("visibility", "visible"); 
                   tooltipStrat.text( "EigenValue: " + Math.round(d*1000)/1000).move2Front();
                   tooltipStrat.attr("x", (arrayForXScale[i] + margin.left  +40));
                   tooltipStrat.attr("y",  yScale(d) +20);
                   tooltipStrat.move2Front();
                   d3.select(this).attr("r", 6.0);
               }
    )
   // //when not hovering, changes color, width, and height back
    .on("mouseout", function(d,i){
      d3.select(this).style("fill", "#FF8C00"); tooltipStrat.style("visibility", "hidden");
      d3.select(this).attr("r", 5.0);
    });


    //org data points 
    var orgDataPoints = svgTemp.append("g")
    .attr("transform", yAxisPosition)
    .selectAll("dot")
    .data(orgData)
    .enter()
    .append("circle")
    .attr("fill", "#8CD3DD")
    .attr("cx", function(d,i){ 
      return arrayForXScale[i] +differenceInPositions/2})
    .attr("cy", function(d){return  yScale(d)})
    .attr("r", 5.0)
    .on("mouseover", function(d,i){
    //   //while hovering, changes color, width and height
       d3.select(this).style("fill", "red"); tooltipOrg.style("visibility", "visible"); 
                    tooltipOrg.text( "EigenValue: " + Math.round(d*1000)/1000).move2Front();
                    tooltipOrg.attr("x", (arrayForXScale[i] + margin.left +40));
                    tooltipOrg.attr("y",  yScale(d) +20);
                    tooltipOrg.move2Front();
                    d3.select(this).attr("r", 6.0);
                }
     )
    // //when not hovering, changes color, width, and height back
     .on("mouseout", function(d,i){
       d3.select(this).style("fill", "#8CD3DD"); tooltipOrg.style("visibility", "hidden");
       d3.select(this).attr("r", 5.0);
     });


//axis labels
yAxisLabel.text("EigenValue");
xAxisLabel.text("Principal Component");

//title
var tempTitle = svgTemp.append("text")
.attr("y",  70)
.attr("x", width/2+80)
.attr("text-anchor", "middle")
.attr("font-family", "Courier")
.style("font-size", "24px")
.style("font-weight", "bold");


tempTitle.text("PCA EigenValues For All Types of Data");

//puts a legend
var keys = ["Original Data", "Random Data", "Stratified Data"];
var colors = ["#8CD3DD", "rgba(198, 45, 205, 0.8)", "#FF8C00"];

svgTemp.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", arrayForXScale[8] +differenceInPositions/4)
    .attr("cy", function(d,i){ return yScale(2.5+(.25*i)+.065)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 6)
    .style("fill", function(d,i){ return colors[i]})

svgTemp.selectAll("mylabels")
     .data(keys)
     .enter()
     .append("text")
     .attr("x", arrayForXScale[8] +differenceInPositions/2)
     .attr("y", function(d,i){return yScale(2.5+(.25*i))})
     .text(function(d){return d})
     .style("fill", function(d,i){return colors[i]})
     .attr("text-anchor", "left")
}


//creates scatter plots
function scatterPlot(a, dataType, analysisType, typeMDS){
  var tempA = JSON.parse(a);
  
  //gets the data for the scatter plot
  var data;
  if(dataType == "strat"){
    if(analysisType=="mds"){
      if(typeMDS=="euc"){
        data = tempA.stratMDSDataEuc;
      } else{
        data = tempA.stratMDSDataCor;
      }
    } else{
      data=tempA.pca2StratValues;
    }
  } else if(dataType =="rand"){
    if(analysisType=="mds"){
      if(typeMDS=="euc"){
        data = tempA.randMDSDataEuc;
      } else{
        data = tempA.randMDSDataCor;
      }
    } else{
      data=tempA.pca2RandValues;
    }
  } else if(dataType == "org"){
    data=tempA.pca2OrgValues;
    if(analysisType=="mds"){
      if(typeMDS=="euc"){
        data = tempA.orgMDSDataEuc;
      } else{
        data = tempA.orgMDSDataCor;
      }
    } else{
      data=tempA.pca2OrgValues;
    }
  } else{

  }


  //var keys = ["Original Data", "Random Data", "Stratified Data"];
  var colors = ["#19DC13", "#FF8C00", "#1407B6", "#DC1356"];

  // if(activeSvg ==1){
  //   //checks if there is already a graph, and removes it
  //     d3.select("svg").remove();
  // }
  // activeSvg = 1;


  //create the margins
  // var margin = {top: 40, right: 25, bottom: 40, left: 70},
  //   width = 700 - margin.right - margin.left,
  //   height = 500- margin.top - margin.bottom;
  var margin = {top: 35, right: 25, bottom: 40, left: 70},
    width = 550 - margin.right - margin.left,
    height = 323- margin.top - margin.bottom;

  if(analysisType =="mds"){
    height = 290 - margin.top - margin.bottom;
  }
  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";

  //for domain of x axis
  var maxX =0;
  var minX =10000000;
  for(var i =0; i<data.length; i++){
    if(data[i][0]>maxX){
      maxX = Math.ceil(data[i][0]);
    }
    if(data[i][0]<minX){
      minX = Math.floor(data[i][0]);
    }
  }


  //x scale attributes
  var xScale = d3.scaleLinear()
    .domain([minX, maxX])
    .range([0,width]);

  //y scale attributes
  var yScaleMax = 0;
  var yScaleMin = 0;
  var valueToAdd = 0;

  //for domain of y axis
  for (var i=0; i<data.length;i++){
    if(data[i][1]>yScaleMax){
      yScaleMax = Math.ceil(data[i][1])+valueToAdd;
    }
    if(data[i][1]<yScaleMin){
      yScaleMin = Math.floor(data[i][1]);
    }
  }


  //y scale attributes
  var yScale = d3.scaleLinear()
  .domain([yScaleMin, yScaleMax])
  .range([temp2, 0]);

  //create an instance of svg
  var svgTemp
  if(analysisType=="pca"){
    svgTemp = d3.select("#pcaPlot").append("svg");
  }else{
    if(typeMDS=="euc"){
      svgTemp = d3.select("#mdsEucPlot").append("svg");      
    } else{
      svgTemp = d3.select("#mdsCorPlot").append("svg");       
    }
  }

  //other attributes
  svgTemp.attr("id", dataType); //need to fix
  svgTemp.attr("class", ".background_svg_color");
  svgTemp.attr("height", height +140)
  .attr("width", width+100);
  

  //moves X-axis up
  var xAxisShift =0;
  if(yScaleMin<0){
    xAxisShift = margin.top + yScale(0);
  } else if(yScaleMin>0){
    xAxisShift = margin.top + yScale(yScaleMin); //DOUBLE CHECK -->TOO TIRED :/
  }
  //xAxis instance
  var xAxis = svgTemp.append("g")
  .classed("xAxis", true)
  .attr("transform", "translate(" + margin.left + "," + (xAxisShift) + ")")
  .call(d3.axisBottom(xScale).ticks(15))
  ;


  //label xAxis
  var xAxisLabel = svgTemp.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 50) + ")")
  .attr("font-family", "Courier")
  .style("font-size", "20px");

  xAxis.selectAll("text").attr("transform", "translate(" + (-3) + "," +  (6) + ")rotate(-45)")
          .attr("text-anchor", "end");


  //moves y-axis to the right
  var yAxisShift;
  if(minX<0){
    yAxisShift = margin.left + xScale(0);
  } else if (minX >0){
    yAxisShift = margin.left  + xScale(minX);
  }
  //creates x axis
  var yAxis = svgTemp.append("g")
  .classed("yAxis", true)
  .attr("transform", "translate(" + (yAxisShift)  + "," +  margin.top+ ")")
  .call(d3.axisLeft(yScale).ticks(yAxisNumber));

  //yAxisLabel
  var yAxisLabel = svgTemp.append("text")
  .attr("transform", "translate(" + 37 + "," + (height+70) + ")rotate(-90)")
  .attr("font-family", "Courier")
  .style("font-size", "20px");

  yAxis.selectAll("text").attr("transform", "translate(" + (-3) + "," +  (6) + ")rotate(-45)")
  .attr("text-anchor", "end");
  

  //to display text
  var tooltip = svgTemp
  .append("text")
  .data(data)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  //.attr("width", "5px")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;

  //brings object to front
  d3.selection.prototype.move2Front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };


//plots the data points
  var dataPoints = svgTemp.append("g")
.attr("transform", yAxisPosition)
.selectAll("dot")
.data(data)
.enter()
.append("circle")
.attr("fill", function(d,i){
  return colors[data[i][2]]
})
.attr("r", "3.0")
.attr("cx", function(d,i){ 
  return  xScale(data[i][0])})
.attr("cy", function(d,i){
  return yScale(data[i][1])

})
.on("mouseover", function(d,i){
  //   //while hovering, changes color, width and height
     d3.select(this).style("fill", "red");
     d3.select(this).move2Front();
    tooltip.style("visibility", "visible");
    tooltip.text("(" + Math.round(data[i][0]*1000)/1000 + ", " + Math.round(data[i][1]*1000)/1000 + ")");
    if(typeMDS!="cor"){
      tooltip.attr("y",  yScale(data[i][1] -.7));
      tooltip.attr("x", (xScale(data[i][0]+.7)));
    }else{
      tooltip.attr("y", yScale(data[i][1]-.1));
      tooltip.attr("x", (xScale(data[i][0]+.05)));
    }
    tooltip.move2Front();

  })
.on("mouseout", function(d,i){
      d3.select(this).style("fill", colors[data[i][2]]);
      tooltip.style("visibility", "hidden");
});



//attributes for title
var tempTitle = svgTemp.append("text")
.attr("y",  25)
.attr("x", width/2+60)
.attr("text-anchor", "middle")
.attr("font-family", "Courier")
.style("font-size", "24px")
.style("font-weight", "bold");


//labeling
if(dataType=="strat"){
  if(analysisType=="mds"){
    if(typeMDS=="euc"){
      tempTitle.text("MDS via Euclidean Distance on Stratified Data");
    } else{
      tempTitle.text("MDS via Correlation Distance on Stratified Data");
    }
    yAxisLabel.text("Component 2");
    xAxisLabel.text("Component 1");
  }else{
    tempTitle.text("Strat. Data Projected on Top Two PCA Vectors");
    yAxisLabel.text("Principal Component 2");
    xAxisLabel.text("Principal Component 1");
  }
}else if(dataType=="rand"){
  if(analysisType=="mds"){
    if(typeMDS=="euc"){
      tempTitle.text("MDS via Euclidean Distance on Random Data");
    } else{
      tempTitle.text("MDS via Correlation Distance on Random Data");
    }
    yAxisLabel.text("Component 2");
    xAxisLabel.text("Component 1");
  }else{
    tempTitle.text("Rand. Data Projected on Top Two PCA Vectors");
    yAxisLabel.text("Principal Component 2");
    xAxisLabel.text("Principal Component 1");
  }
} else if(dataType=="org"){
  if(analysisType=="mds"){
    if(typeMDS=="euc"){
      tempTitle.text("MDS via Euclidean Distance on Data");
      document.getElementById("mdsEucPlot").style.transform = "translate(" + (-485) + "px," + (260) + "px)";
    } else{
      tempTitle.text("MDS via Correlation Distance on Data");
      document.getElementById("mdsCorPlot").style.transform = "translate(" + (150) + "px," + (260) + "px)";
    }
    yAxisLabel.text("Component 2");
    xAxisLabel.text("Component 1");
  } else{
  tempTitle.text("Data Projected on Top Two PCA Vectors");
  yAxisLabel.text("Principal Component 2");
  xAxisLabel.text("Principal Component 1");
  document.getElementById("pcaPlot").style.transform = "translate(" + (150) + "px," + (-150) + "px)";
  }
}



}

//cross function  
function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) {
    for (j = -1; ++j < m;) {
      c.push({x: a[i], i: i, y: b[j], j: j})
    }
  };
  return c;
}


//creates the scatter plot matrixes
function scatterPlotMatrix(a, dataType){
  // if(activeSvg ==1){
  //   //checks if there is already a graph, and removes it
  //     d3.select("svg").remove();
  // }
  // activeSvg = 1;

  var tempA = JSON.parse(a);

  //get the data and put it into the right format
  var data;
  var tempData = new Array([]);
  var temp1 = [];
  var temp2 =[];
  var temp3 = [];

  if(dataType=="rand"){
    data = tempA.rand3LoadData;
    attributeNames = tempA.rand3AttrNames;
    bigData = tempA.bigRand3Array;
  } else if(dataType=="strat"){
    data = tempA.strat3LoadData;
    attributeNames = tempA.strat3AttrNames;
    bigData = tempA.bigStrat3Array;
  } else{
    data = tempA.org3LoadData;
    attributeNames = tempA.org3AttrNames;
    bigData = tempA.bigOrg3Array;
  }
  for(var i=0;i<data.length;i++){
    var superTempArray = [];
    for(var j=0;j<3;j++){
      superTempArray[j] = data[i][j];
      //tempData[i][j] = data[i][j];
    }
    tempData[i]= superTempArray;
  }
  for (var i=0; i<data.length;i++){
    //in order to get a column of features
    temp1[i] = tempData[i][0]
    temp2[i]= tempData[i][1]
    temp3[i] = tempData[i][2]
  }

  //standart parameters
  n = 3;
  var size = 230,
    padding  = 60;

  var padDiv2 = padding/2;
  var sizeMinPadDiv2 = size - (padding/2);
  var sizeTnPlusPad = (size*n)+padding;

  //scales
  var yScale = d3.scaleLinear()
  .range([sizeMinPadDiv2, padDiv2]);

  var xScale = d3.scaleLinear()
    .range([padDiv2, sizeMinPadDiv2]);

  var yAxis = d3.axisLeft()
    .ticks(6)
    .tickFormat(d3.format("d"))
    .scale(yScale)
    .tickSize(-size*n)
    ;
  var xAxis = d3.axisBottom()
    .ticks(6)
    .tickFormat(d3.format("d"))
    .scale(xScale)
    .tickSize(size*n)
    ;

  
  var colors = ["FA8D62","#7D26CD","#42C0FB", "E6D72A"];
  var ftrNames = Object.keys(attributeNames);
  // console.log("ftr Names " + ftrNames)
  var ftrs = [temp1, temp2,temp3]


  //gives domain for each attribute
  var domainByFtr ={};
  ftrNames.forEach(function(ftr) {
    var tempHere = d3.values(tempData[ftr])
    domainByFtr[ftr] = d3.extent(tempHere);
  })
  ;

  //create instance of svg
  var svg = d3.select("#scatterPlotMatrix").append("svg")
    .attr("x", 70)
    .attr("height", sizeTnPlusPad)
    .attr("width", sizeTnPlusPad)
    .attr('id', 'svg')
    .append("g")
    .attr("transform", "translate(" + padding + "," + padDiv2+ ")")
  ;

  //create instance of x axis
  svg.selectAll(".x.axis")
      .data(ftrNames)
      .enter()
      .append("g")
      .attr("class", "x axis")
      .attr("transform", function(d,i){return "translate(" + ((-1-d+n)*size) + ",0)";})
      .each(function(d,i) { 
        xScale
        .domain(domainByFtr[d]); 
        d3.select(this)
        .call(xAxis); 
      });

  //labels the x axis by attribute names
  for(var i=0; i<3; i++){
    var xAxisLabel = svg.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Courier")
    .style("font-size", "20px")
    .attr("transform", "translate(" + ((size/2)+(size*i)) +","+ (0) + ")" )
    .text(attributeNames[2-i]);
  }

  //creates an instance of the y axis
  svg.selectAll(".y.axis")
      .data(ftrNames)
      .enter()
      .append("g")
      .attr("class", "y axis")
      .attr("transform", function(d,i) { return "translate(0," + (i * size) + ")"; })
      .each(function(d,i) { 
        yScale
        .domain(domainByFtr[d]); 
        d3.select(this)
        .call(yAxis)
       });
  
  //labels the y axis
  for(var i=0; i<3; i++){
      var yAxisLabel = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-family", "Courier")
      .style("font-size", "20px")
      .attr("transform", "translate(" + (-padding/2) +","+ ((size/2)+(size*i)) + ")rotate(-90)" )
      .text(attributeNames[i]);
      }

  //brings object to front
  d3.selection.prototype.move2Front = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
  var tempCross = cross(ftrs, ftrs);
  //create an instance of a cell
  var cell = svg.selectAll(".cell")
       .data(tempCross)
       .enter()
       .append("g")
       .attr("class", "cell")
       .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
       .each(plot)
  ;

  //in order to plot each cell and data associated with cell
  function plot(p){
    var cell = d3.select(this);

    //sets the x and y domain of each corresponding cell
    xScale.domain([d3.min(p.x),d3.max(p.x)]);
    yScale.domain([d3.min(p.y),d3.max(p.y)]);

    //creates the instance of the cell
    cell.append("rect")
        .attr("class", "frame")
        .attr("y", padDiv2)
        .attr("x", padDiv2)
        .attr("height", size - padding)
        .attr("width", size - padding)
        .attr("fill", "none")
        .attr("stroke", "black");

    //just so that I go through the appropriate amount of data points
    var arrayForIndex = new Array(data.length)

    cell.selectAll("circle")
        .data(arrayForIndex)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { 
          return xScale(p.x[i]); })
        .attr("cy", function(d,i) { 
          return yScale(p.y[i]); 
        })
        .attr("r", 3)
        .style("fill",function(d,i){
          if(data[i][3]!=2){
            d3.select(this).move2Front();
          }
          return colors[data[i][3]]})
        .on("mouseover", function(d,i){
          d3.select(this).style("fill", "red");
        })
        .on("mouseout", function(d,i){
          d3.select(this).style("fill", colors[data[i][3]]);
        });
  }
  //for title
  document.getElementById("t1").style.color = "#4682b4";
  document.getElementById("t1").style.textDecoration = "underline";
  if(dataType=="org"){
    document.getElementById("t1").value = "Scatter Plot Matrix";
  } else if(dataType=="rand"){
    document.getElementById("t1").value = "Random Data Scatter Plot Matrix";
  } else if (dataType=="strat"){
    document.getElementById("t1").value = "Stratified Data Scatter Plot Matrix";
  }
  document.getElementById("topnav").style.width ="1350px";
  document.getElementById("topnav").style.transform = "translate(" + (-10) + "px," + (-8) + "px)";
  document.getElementById("topnav").style.height ="41px";
  // document.getElementById("topnav").style.transform = "translate(" + (-10) + "px," + (-428) + "px)";

  document.getElementById("scatterPlotMatrix").style.transform = "translate(" + (-100) + "px," + (-130) + "px)";
  document.getElementById("t1").style.transform ="translate(" + (0) + "px," + (-110) + "px)";
}


function usMap(jsonData, secondAttribute, orig, tic){
  document.getElementById("dot").style.transform ="translate(" + (620) + "px," + (0) + "px)";
  document.getElementById("cell").style.transform ="translate(" + (643) + "px," + (0) + "px)";

  document.getElementById("drpdown2").style.transform = "translate(" + (870) + "px," + (335) + "px)";
  document.getElementById("drpdownCont2").style.transform = "translate(" + (870) + "px," + (335) + "px)";
  if (mapExists == 1) {
    // console.log("in here to removeEEEEE")
    mapGlo.remove();
    mapGlo = null;
  }
  mapExists =1
  if(tic =="1"){
    secondAttribute = attrState
  }
  document.getElementById("topnav").style.height ="41px";
  // document.getElementById("topnav").style.transform = "translate(" + (-10) + "px," + (-428) + "px)";
  // document.getElementById("topnav").style.transform = "translate(" + (-30) + "px," + (-428) + "px)";
    document.getElementById("topnav").style.transform = "translate(" + (-10) + "px," + (-450) + "px)";
  var origData = JSON.parse(orig);
  var stratLat = origData.stratLat
  var stratLong = origData.stratLong
  var lat= origData.lat
  var long = origData.long
  var numberInEachState = origData.numberInEachState
 
  var moneyWord =0;
  var percentWord = 0;


  var data = JSON.parse(jsonData);
  var bigData = data.bigData;

  max=-1000;
  min=1000;
  var words;
  // console.log(bigData[1])
  // console.log(secondAttribute)

  data2Use = []
  if(secondAttribute=="trev"){
    data2Use = bigData[1]
    max = d3.max(bigData[1])
    words = "Total Revenue"
    moneyWord =1;
  }
  if(secondAttribute=="frev"){
    data2Use = bigData[2]
    max = d3.max(bigData[2])
    words = "Federal Revenue"
    moneyWord =1;
  }
  if(secondAttribute=="srev"){
    data2Use = bigData[3]
    max = d3.max(bigData[3])
    words = "State Revenue"
    moneyWord =1;
  }
  if(secondAttribute=="texp"){
    data2Use = bigData[4]
    max = d3.max(bigData[4])
    words = "Total Expenditure"
    moneyWord =1;
  }
  if(secondAttribute=="iexp"){
    data2Use = bigData[5]
    max = d3.max(bigData[5])
    words = "Instructional Expenditure"
    moneyWord =1;
  }
  if(secondAttribute=="gdp2010"){
    data2Use = bigData[6]
    max = d3.max(bigData[6])
    words = "GDP"
  }
  if(secondAttribute=="cen2010"){
    data2Use = bigData[7]
    max = d3.max(bigData[7])
    words = "Census"
  }
  if(secondAttribute=="inc"){
    data2Use = bigData[8]
    max = d3.max(bigData[8])
    words = "Median Household Income"
    moneyWord =1;
  }
  if(secondAttribute=="unemp"){
    data2Use = bigData[9]
    max = d3.max(bigData[9])
    words = "Unemployment Rate"
  }
  if(secondAttribute=="aviq"){
    data2Use = bigData[10]
    max = d3.max(bigData[10])
    words = "Average IQ"
  }
  if(secondAttribute=="hsdeg"){
    data2Use = bigData[11]
    max = d3.max(bigData[11])
    words = "High School Graduate"
    percentWord = 1;
  }
  if(secondAttribute=="bacdeg"){
    data2Use = bigData[12]
    max = d3.max(bigData[12])
    words = "Bachelors Graduate"
    percentWord = 1;
  }
  if(secondAttribute=="masdeg"){
    data2Use = bigData[13]
    max = d3.max(bigData[13])
    words = "Masters Graduate"
    percentWord = 1;
  }

  //get min
  for (i=0;i<data2Use.length;i++){
    if(data2Use[i]<min){
      min = data2Use[i]
    }
  }
  // console.log("min and max")
  // console.log(min)
  min = Math.floor(min)
  // console.log(min)
  max = Math.ceil(max)
  // console.log(max)


  numberOfColors =7;
  difference = (max-min)/numberOfColors
  var array4Colors = []
  //max number within each range
  for (i=0;i<numberOfColors-1;i++){
    array4Colors[i] = Math.round(difference*(i+1)+min)
  }
  array4Colors[6] = max
  // console.log(max)
  // console.log(min)
  
  var map = L.map('map').setView([37.8, -96], 4);
  
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
      maxZoom: 18,
      id: 'mapbox/light-v9',
      attribution: false,
      tileSize: 512,
      zoomOffset: -1
  }).addTo(map);
  

  // console.log("this is statesdata")
  // console.log(statesData)
  // console.log(statesData.features.length)
  var arrayOfDictionaries = []

  //change data for map
  for( i=0; i<statesData.features.length; i++){
    // console.log(statesData.features[i].properties.name)
    var name = statesData.features[i].properties.name
    var stateNum = changeNums[name]
    var densityValue =0
    for(m=0; m<bigData[0].length; m++){
      if(stateNum== bigData[0][m]){
        densityValue = data2Use[m]
      }
    }
    statesData.features[i].properties.density = densityValue

  }

  L.geoJson(statesData).addTo(map);

  // HOW TO ADD TOPOLOGY
  // L.geoJson(newYorkDistricts).addTo(map);


  // console.log("right before")
  // d3.select("map").remove();

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        // color: '#666',
        color: 'black',
        dashArray: '',
        fillOpacity: 1,
        // zoom: 13
        // brightness: 1
        // fillColor: '#dd3497'
    });
    // circle.remove()
    // circle.bringToFront()
    // circles()
    // circle().opacity(1)
    // circle().radius(50)
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
    circles()
}

// function getColor(d){
//   console.log("value of d")
//   console.log(d)
//   return '#800026'
// }
// function getColor(d)

// '#fdd49e'
function getColor(d) {
  return d > array4Colors[5] ? '#500000': 
      d > array4Colors[4] ? '#a50f15' :
      d > array4Colors[3] ? '#A00000 ' :
      d > array4Colors[2]  ? '#ef3b2c' :
      d > array4Colors[1]  ? '#fc9272' :
      d > array4Colors[0]   ? '#fee0d2' :

      // d > array4Colors[3] ? '#d7301f' :
      // d > array4Colors[2]  ? '#fc8d59' :
      // d > array4Colors[1]  ? '#fdd49e' :
      // d > array4Colors[0]   ? '#fff7ec' :

      // d > array4Colors[3]   ? '#FEB24C' :
      d == 0   ? '#FED976' :
            '#fff5f0';
}

arrayOfColorValues = ['#fee0d2', '#fc9272', '#ef3b2c','#A00000','#a50f15','#500000']

function style(feature) {
  return {
    weight: .5,
    opacity: 1,
    color: 'black',
    // dashArray: '3',
    fillOpacity: .8,
    fillColor: getColor(feature.properties.density)
  };
}
var geojson;

function resetHighlight(e) {
  circles()
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  // console.log(e)
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}


geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0, array4Colors[1], array4Colors[2], array4Colors[3], array4Colors[4], array4Colors[5]];


  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i class = "square" style="background: ' + arrayOfColorValues[i] + '"></i>    '  + 
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

return div;

//   div.innerHTML = labels.join('<br>');
//   return div;
};

legend.addTo(map);


var info = L.control( {position:'bottomleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {


  if(moneyWord==1){
    this._div.innerHTML = '<h4></h4>' +  (props ?
      // '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
      '<b>' + props.name + '</b><br />' + 'Number of Companies: ' + numberInEachState[changeNums[props.name]-1] +'<br />' +words + ': $'+ props.density 
      : 'Hover over a state');

    
  }else if(percentWord ==1){
    this._div.innerHTML = '<h4></h4>' +  (props ?
      // '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
      '<b>' + props.name + '</b><br />' + 'Number of Companies: ' + numberInEachState[changeNums[props.name]-1] +'<br />' +words + ': '+ props.density + '%'
      : 'Hover over a state');
    
  } else{
    this._div.innerHTML = '<h4></h4>' +  (props ?
      // '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
      '<b>' + props.name + '</b><br />' + 'Number of Companies: ' + numberInEachState[changeNums[props.name]-1] +'<br />' +words + ': '+ props.density 
      : 'Hover over a state');

  }

  changeStateName(this._div.innerHTML)
};


info.addTo(map);


for (i=0; i<lat.length; i++){
  var circle = L.circle([lat[i], long[i]], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: .7,
    radius: 25
  }).addTo(map);
  // circle.bringToFront()
}


function circles(){ 
  for (i=0; i<lat.length; i++){
    var circle = L.circle([lat[i], long[i]], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 1,
      radius: 1000
    }).addTo(map);
    circle.bringToFront()
  } 
}

mapGlo = map

map.on('click', function(e){
  console.log("CLICKEDDDDDD")
  // console.log(e)
  console.log(lastHoveredOver)

  parallelCoordinate2(jsonData, orig, attrState, 1)
  barGraph(orig, jsonData, 0)
  barGraph(orig, jsonData, 1)
  document.getElementById("drpdown2").style.display = "none";
  // document.getElementById("drpdownCont2").style.display = "none";
});

map.on('zoomed', function(e){
  console.log("ZOOOMED")
  console.log(map.getZoom())
})

document.getElementById("map").style.transform = "translate(" + (13) + "px," + (25) + "px)";
// document.getElementById("drpdown").style.transform = "translate(" + (610) + "px," + (-460) + "px)";
// document.getElementById("drpdownCont").style.transform = "translate(" + (610) + "px," + (-460) + "px)";
document.getElementById("drpdown").style.transform = "translate(" + (575) + "px," + (-375) + "px)";
document.getElementById("drpdownCont").style.transform = "translate(" + (575) + "px," + (-375) + "px)";

document.getElementById("map").style.height ="420px";
document.getElementById("map").style.width ="750px";
// console.log(words)
setTimeout(function(){ map.invalidateSize()}, 500);
document.getElementById("drpdown").textContent=words;

}

// 

function parallelCoordinate(newD, orig, secondAttribute){
  var origData = JSON.parse(orig);
  var newData = JSON.parse(newD);


  var allNewData = newData.bigData


  var actualOrigData = origData.origData

  var bigData =[]
  var count =0
  var count1 =0


  var bigDataArray = []
  for (i=0;i<actualOrigData.length;i++){
  // for (i=0;i<50;i++){
    tempDic = {
    // "name" : String(i),
    "Change In Rank": actualOrigData[i][0],
    "Revenue" :actualOrigData[i][1],
    "Revenue Change" :actualOrigData[i][2],
    "Profit":actualOrigData[i][3],
    "Profit Change":actualOrigData[i][4],
    "Assets" :actualOrigData[i][5],
    "Market Value" :actualOrigData[i][6],
    "Employees"  :actualOrigData[i][7],
    "Years on Fortune 500 List" :actualOrigData[i][8],

   
    "Total Revenue" :allNewData[1][actualOrigData[i][9]+1],
    "Federal Revenue" :allNewData[2][actualOrigData[i][9]+1],
    "State Revenue" :allNewData[3][actualOrigData[i][9]+1],
    "Total Expenditure" :allNewData[4][actualOrigData[i][9]+1],
    "Instruction Expenditure" :allNewData[5][actualOrigData[i][9]+1],
    "GDP" :allNewData[6][actualOrigData[i][9]+1],

    "Census" :allNewData[7][actualOrigData[i][9]+1],
    "Median Household Income":allNewData[8][actualOrigData[i][9]+1],
    "Unemployment Rate" :allNewData[9][actualOrigData[i][9]+1],
    "Average IQ" :allNewData[10][actualOrigData[i][9]+1],

    "High School Grad." :allNewData[11][actualOrigData[i][9]+1],
    "Bachelors Grad." :allNewData[12][actualOrigData[i][9]+1],
    "Masters Grad." : allNewData[13][actualOrigData[i][9]+1]
  }
    // console.log(actualOrigData[i][0])
    bigDataArray[i] = tempDic
  }



  names = ["Change In Rank","Revenue","Revenue Change","Profit","Profit Change","Assets","Market Value","Employees",
  "Years on Fortune 500 List","Total Revenue","Federal Revenue","State Revenue","Total Expenditure","Instruction Expenditure",
  "GDP","Census","Median Household Income","Unemployment Rate","Average IQ","High School Graduate","Bachelors Graduate","Masters Graduate"]
	var margin = {top: 80, right: 30, bottom: 30, left: 30},
	    width = 1200 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	var dim = [

		{
			name: "Change In Rank",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Revenue",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Revenue Change",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Profit",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
		{
			name: "Profit Change",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Assets",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Market Value",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Employees",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
    {
			name: "Years on Fortune 500 List",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Total Revenue",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Federal Revenue",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "State Revenue",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
    {
			name: "Total Expenditure",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Instruction Expenditure",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "GDP",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Census",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
    
    {
			name: "Median Household Income" ,
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Unemployment Rate",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Average IQ",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    }, 
    {
			name: "High School Grad.",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Bachelors Grad.",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
		{
			name: "Masters Grad.",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
		}
  ];
  function moveToFront() {
    this.parentNode.appendChild(this);
    }
  
  var x = d3.scaleBand()
    .domain(dim.map(function(d) { 
      
    return d.name; }))
    .range([0, width])
    .padding(0.1);

  var line = d3.line()
  // .defined(function(d){return d[1];})
    .defined(function(d) { 

    return !isNaN(d[1]); 
  });

var yAxis = d3.axisLeft();

var svg = d3.select("#parallelGraph").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dimension = svg.selectAll(".dimension")
.data(dim)
.enter().append("g")
.attr("class", "dimension")
.attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });


dim.forEach(function(dimension) {
  dimension.scale.domain(dimension.type === "number"
  ? d3.extent(bigDataArray, function(d) { return +d[dimension.name]; })
  : bigDataArray.map(function(d) { return d[dimension.name]; }).sort());
});

svg.append("g")
.attr("class", "background")
.selectAll("path")
.data(bigDataArray)
.enter().append("path")
.attr("d", draw);

svg.append("g")
.attr("class", "foreground")
.selectAll("path")
.data(bigDataArray)
.enter().append("path")
.attr("d", draw)
.attr("opacity", 1);

dimension.append("g")
  // .attr("class", "axis")
  .classed("xAxis", true)
  .each(function(d) { 
    // console.log(d.scale)
    d3.select(this).call(yAxis.scale(d.scale)); })
  .append("text")
  .attr("class", "title")
  .attr("text-anchor", "middle")

  .text(function(d) { 
    // console.log(d.name);
    return (d.name); });


var xAxisLabel = dimension.append("text")
    .attr("text-anchor", "left")
    .attr("transform", "translate(" + (0) + "," + (-5) + ")rotate(-20)")
    .attr("font-family", "Courier")
    .style("font-size", "12px")
    .attr("fill", "black")
    .text(function(d){
      return d.name;
    });

var ordinal_labels = svg.selectAll(".axis text")
.on("mouseover", mouseover)
.on("mouseout", mouseout);

var projection = svg.selectAll(".background path,.foreground path")
.on("mouseover", mouseover)
.on("mouseout", mouseout);

function mouseover(d) {
svg.classed("active", true);



if (typeof d === "string") {
  projection.classed("inactive", function(p) { return p.name !== d; });
  projection.filter(function(p) { return p.name === d; }).each(moveToFront);
  ordinal_labels.classed("inactive", function(p) { return p !== d; });
  ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
} else {

  projection.classed("inactive", function(p) { return p !== d; });
  // projection.attr("opacity", 1);
  projection.filter(function(p) { return p === d; }).each(moveToFront);
  ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
  ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
}
}

function mouseout(d) {
  svg.classed("active", false);
  projection.classed("inactive", false);
  ordinal_labels.classed("inactive", false);
  }

function moveToFront() {
this.parentNode.appendChild(this);
}

function draw(d) {

  return line(dim.map(function(dimension) {
  return [x(dimension.name), dimension.scale(d[dimension.name])];
}));
}



document.getElementById("parallelGraph").style.transform = "translate(" + (150) + "px," + (-150) + "px)";

document.getElementById("topnav").style.width ="1300px";
document.getElementById("topnav").style.transform = "translate(" + (-10) + "px," + (-8) + "px)";
document.getElementById("topnav").style.height ="41px";


}




function pieChart(newD, orig, secondAttribute){
  var origData = JSON.parse(orig);
  var newData = JSON.parse(newD);

  var numberCompanies = origData.numberInEachState

 

  var sum =0;
  for(i=0;i<numberCompanies.length;i++){
    sum = sum+numberCompanies[i]
  }

  var arrayOfPercent = []

  for (i=0;i<numberCompanies.length;i++){
    arrayOfPercent[i] = (numberCompanies[i]/sum)*100
  }


d3.selection.prototype.move2Front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  // var svg = d3.select("svg"),
  //   height = 350,
  //   width = 450,
  //   radius = Math.min(width, height) / 2;

  
var width = 375,
height = 265,
radius = Math.min(width, height) / 2;

var svg = d3.select("#pie-chart").append("svg")
// .attr("width", 375)
.attr("width", 400)
.attr("height", 305)
.append("g")
// .attr("transform", "translate(" + ((width/2)-50)+ "," + (height/2) + ")")
.attr("transform", "translate(" + ((width/2))+ "," + ((275/2)+5) + ")")
;

var tooltip = svg
  .append("text")
  .data(numberCompanies)
  .style("position", "absolute")
  .style("visibility", "hidden")
  // .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  //.attr("width", "5px")
  .attr("fill", "#303030")
  .style("font-size", "14px")
  ;
  var tooltip2 = svg
  .append("text")
  .data(numberCompanies)
  .style("position", "absolute")
  .style("visibility", "hidden")
  // .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  //.attr("width", "5px")
  .attr("fill", "#303030")
  .style("font-size", "14px")
  ;
  var pie = d3.pie()
    .sort(null)
    .value(function(d) {

      return d;
    });

  var arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);
  
  var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // svg.attr("transform", "translate(" + 200+ "," + (-5000)+ ")");

  // colors = ["#00BFFF", "#F4A460","#A52A2A", "#A52A2A", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
  colors = ["#98abc5","#98abc5","#B0C4DE", "#B0C4DE", "#87CEFA", "#00BFFF", "#1E90FF", "#4169E1","#4B0082","#663399", "#483D8B", "#6A5ACD",
          "#9370DB", "#8B008B", "#9400D3", "#BA55D3", "#DA70D6", "#C71585", "#DB7093","#FF69B4","#20B2AA", "#008080", "#228B22",
          "#3CB371", "#00CED1", "#6495ED", 
          "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", 
          "#D2691E", 
          "#FF8C00", "#FF6347","#FF4500", "#CC3232", "#E60000", "#FF6D6D", "#F22C1E", "#FF3300", "#3579DC", "#009ACD",
          "#6FBEDA", "#2BCAFF", "#38B0DE", "#0198E1", "#5D92B0", "#35586C"

]
  // for (i=0;i<numberCompanies.length;i++){
  //   colors[i] = "black"
  // }

  //new
// var svg = d3.select("#pie-chart").append("svg")
//   .attr("width", 450)
//   .attr("height", 350)
//   .append("g")
//   .attr("transform", "translate(" + (width/2)+ "," + (height/2) + ")")
//   ;

var g = svg.selectAll(".arc")
    .data(pie(arrayOfPercent))
    .enter().
    append("g")
    .attr("class", "arc");


g.append("path")
    .attr("d", arc)
    .style("fill", function(d,i) { return colors[i]; })
    // .attr("stroke-opacity", .7)
    .style("opacity", .84)
    .on("mouseover", function(d,i){
      // d3.select(this).style("fill", "black");
      d3.select(this).style("opacity", 1);
      tooltip.style("visibility", "visible"); 
      tooltip.text("State: "+ changeWords[i+1]).move2Front();
      // tooltip.text("Number Of Companies: " + numberCompanies[i]).move2Front();

      // tooltip.attr("x", (d.startAngle + (d.endAngle - d.startAngle)/2));
      // tooltip.attr("y",  d.startAngle + (d.endAngle - d.startAngle)/2);
      // tooltip.attr("x", 50);
      // tooltip.attr("y",  -115);
      tooltip.attr("x", -57);
      tooltip.attr("y",  120);
      tooltip2.style("visibility", "visible"); 
      tooltip2.text("Number Of Companies: " + numberCompanies[i]).move2Front();
      // tooltip2.attr("x", 50);
      // tooltip2.attr("y",  -95);
      tooltip2.attr("x", -84);
      tooltip2.attr("y",  140);
      // tooltip.move2Front();
    })
    .on("mouseout", function(d,i){
      d3.select(this).style("fill", colors[i]);
      d3.select(this).style("opacity", .84);
      tooltip.style("visibility", "hidden");
      tooltip2.style("visibility", "hidden");
    })
    ;

var text = svg.select(".labels").selectAll("text")
	.data(pie(arrayOfPercent));

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d,i) {
			return changeWords[i];
		});
	
	// function midAngle(d){
	// 	return d.startAngle + (d.endAngle - d.startAngle)/2;
  // }


  // document.getElementById("pie-chart").style.transform = "translate(" + (700) + "px," + (-675) + "px)";
  document.getElementById("pie-chart").style.transform = "translate(" + (650) + "px," + (-675) + "px)";  

  svg.append("text")
    .attr("x", (0))             
    .attr("y", (-120))
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .style('fill', 'Black')
    .style("font-size", "19px")  
    .text("Number of Companies Per State")
  // text.transition().duration(1000)
  // .attrTween("transform", function(d) {
  //   this._current = this._current || d;
  //   var interpolate = d3.interpolate(this._current, d);
  //   this._current = interpolate(0);
  //   return function(t) {
  //     var d2 = interpolate(t);
  //     var pos = outerArc.centroid(d2);
  //     pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
  //     return "translate("+ pos +")";
  //   };
  // })
  // .styleTween("text-anchor", function(d){
  //   this._current = this._current || d;
  //   var interpolate = d3.interpolate(this._current, d);
  //   this._current = interpolate(0);
  //   return function(t) {
  //     var d2 = interpolate(t);
  //     return midAngle(d2) < Math.PI ? "start":"end";
  //   };
  // });

// g.append("text")
//     .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
//     .attr("dy", ".35em")
//     .text(function(d) { return d.data; });

  // var slice = svg
  //   .select(".slices").selectAll("path.slice")
  //   .data(pie(arrayOfPercent));

  // slice.enter()
  //   .insert("path")
  //   .style("fill", function(d,i) {console.log(d)
  //     console.log(i)
  //     console.log(colors[i])
  //     return colors[i]; })
  //   .attr("class", "slice");

    // var arc = svg.selectAll(".arc")
    //   .data(pie(arrayOfPercent))
    //   .enter().append("g")
    //   .attr("class", "arc");
    
    // arc.enter()
    // .insert("path")
    //   .attr("d", path)
    //   .attr("fill", function(d) { return '#4daf4a'; });


  // slice		
  // .transition().duration(1000)
  // .attrTween("d", function(d) {
  //   this._current = this._current || d;
  //   var interpolate = d3.interpolate(this._current, d);
  //   this._current = interpolate(0);
  //   return function(t) {
  //     return arc(interpolate(t));
  //   };
  // })

  // slice.exit()
  // .remove();
  // var pie = d3.pie()
  //       .value(function(d) { return d
  //       })

  


  // var path = d3.arc()
  //   .outerRadius(radius - 10)
  //   .innerRadius(0);

  //   console.log(numberCompanies)
  // // for(i=0;i<numberCompanies.length;i++){
  //   var arc = g.selectAll(".arc")
  //     .data(pie(arrayOfPercent))
  //     .enter().append("g")
  //     .attr("class", "arc");
    
  //   arc.append("path")
  //     .attr("d", path)
  //     .attr("fill", function(d) { return '#4daf4a'; });



      // svg.append("g")
      // .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
      // .append("text")
      // .text("Browser use statistics - Jan 2017")
      // .attr("class", "title")
  // }
} 

function scatterPlot2(additionalData, origData, secondAttribute, plotNum, xAttr, dropDown){
  document.getElementById("stateBarGraph").style.display = "none";
  document.getElementById("buisBarGraph").style.display = "none";

  document.getElementById("drpdown2").style.display = "block";
  // document.getElementById("drpdownCont2").style.display = "block";
  
  var additionalData= JSON.parse(additionalData);
  var origData= JSON.parse(origData);
  
  var bigData = additionalData.bigData;
  // console.log(additionalData)
  var words;
  var numberCompanies = origData.numberInEachState
  // console.log(numberCompanies)


  var actualOrigData = origData.origData
  if(dropDown=="0"){
      attrState = secondAttribute
    if(plotNum=="scatterPlot2"){
      xAttr = attrBuis

    }
    // }
  } else if (dropDown=="1"){
    console.log("comes in this thing")
    secondAttribute = attrState
    if(plotNum=="scatterPlot2"){
      attrBuis = xAttr
      console.log("in here")
    } 
    // else{
    //   secondAttribute = attrState      
    // }   
  } else{
    attrState = secondAttribute
    if(plotNum=="scatterPlot2"){
      attrBuis = xAttr

    }  
  }
  console.log(xAttr)
  // console.log("PRINGTING HERE")
  // console.log(attrBuis)
  // console.log(attrState)
  //gets the data for the scatter plot
  var data;
  if(secondAttribute=="trev"){
    data = bigData[1]
    max = d3.max(bigData[1])
    words = "Total Revenue"
    moneyWord =1;
  }
  if(secondAttribute=="frev"){
    data = bigData[2]
    max = d3.max(bigData[2])
    words = "Federal Revenue"
    moneyWord =1;
  }
  if(secondAttribute=="srev"){
    data = bigData[3]
    max = d3.max(bigData[3])
    words = "State Revenue"
    moneyWord =1;
  }
  if(secondAttribute=="texp"){
    data = bigData[4]
    max = d3.max(bigData[4])
    words = "Total Expenditure"
    moneyWord =1;
  }
  if(secondAttribute=="iexp"){
    data = bigData[5]
    max = d3.max(bigData[5])
    words = "Instructional Expenditure"
    moneyWord =1;
  }
  if(secondAttribute=="gdp2010"){
    data = bigData[6]
    max = d3.max(bigData[6])
    words = "GDP"
  }
  if(secondAttribute=="cen2010"){
    data = bigData[7]
    max = d3.max(bigData[7])
    words = "Census"
  }
  if(secondAttribute=="inc"){
    data = bigData[8]
    max = d3.max(bigData[8])
    words = "Median Household Income"
    moneyWord =1;
  }
  if(secondAttribute=="unemp"){
    data= bigData[9]
    max = d3.max(bigData[9])
    words = "Unemployment Rate"
  }
  if(secondAttribute=="aviq"){
    data = bigData[10]
    max = d3.max(bigData[10])
    words = "Average IQ"
  }
  if(secondAttribute=="hsdeg"){
    data= bigData[11]
    max = d3.max(bigData[11])
    words = "High School Graduate"
    percentWord = 1;
  }
  if(secondAttribute=="bacdeg"){
    data = bigData[12]
    max = d3.max(bigData[12])
    words = "Bachelors Graduate"
    percentWord = 1;
  }
  if(secondAttribute=="masdeg"){
    data = bigData[13]
    max = d3.max(bigData[13])
    words = "Masters Graduate"
    percentWord = 1;
  }
  // console.log(data)

  var xData
  var buisWord
  // console.log(actualOrigData)
  temp1 =[]
  temp2 =[]
  temp3=[]
  temp4 =[]
  temp5 =[]
  temp6=[]
  temp7 =[]
  temp8=[]
  temp9 =[]
  var count = 0
  for(i=0; i<actualOrigData.length;i++){
    // if(stateOrNot==0){
      temp1[i] =actualOrigData[i][0]
      temp2[i] =actualOrigData[i][1]
      temp3[i]=actualOrigData[i][2]
      temp4[i] =actualOrigData[i][3]
      temp5[i] =actualOrigData[i][4]
      temp6[i]=actualOrigData[i][5]
      temp7[i] =actualOrigData[i][6]
      temp8[i]=actualOrigData[i][7]
      temp9[i]=actualOrigData[i][8]
    // } else{
    //   if(actualOrigData[i][9]
    // }
  }
  //xaxis data
  if(xAttr=="cr"){
    xData = temp1
    buisWord = "Change In Rank"
  } else if(xAttr=="r"){
    xData = temp2
    buisWord = "Revenue"
  }else if (xAttr=="rc"){
    xData = temp3
    buisWord = "Revenue Change"
  } else if(xAttr=="p"){
    xData = temp4
    buisWord = "Profit"
  } else if(xAttr=="pc"){
    xData = temp5
    buisWord = "Profit Change"
  } else if(xAttr=="a"){
    xData = temp6
    buisWord = "Assets"
  } else if(xAttr=="mv"){
    xData = temp7
    buisWord = "Market Value"
  } else if (xAttr=="e"){
    xData = temp8 
    buisWord = "Employees"
  } else if(xAttr=="yf5l"){
    xData = temp9
    buisWord = "Years on Fortune 500 List"
  } else{
    xData = numberCompanies
  }




  //var keys = ["Original Data", "Random Data", "Stratified Data"];
  var colors = ["#19DC13", "#FF8C00", "#1407B6", "#DC1356"];

  // if(activeSvg ==1){
  //   //checks if there is already a graph, and removes it
  //     d3.select("svg").remove();
  // }
  // activeSvg = 1;


  //create the margins
  var margin = {top: 40, right: 25, bottom: 40, left: 70},
    width = 450 - margin.right - margin.left,
    height = 355- margin.top - margin.bottom;

  if(plotNum =="scatterPlot2"){
    height = 278 - margin.top - margin.bottom;
  }

  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";

  //for domain of x axis
  var maxX =-1000;
  var minX =10000000;
  var secondMax = -1000;
  for(var i =0; i<xData.length; i++){
    if(xData[i]>maxX){
      secondMax = maxX
      maxX = Math.ceil(xData[i]);
    }
    if(xData[i]<minX){
      minX = Math.floor(xData[i]);
    }
  }
  // if((maxX-secondMax)>10){
  //   maxX = secondMax;
  // }


  //x scale attributes
  var xScale = d3.scaleLinear()
    .domain([minX, maxX])
    .range([0,width]);

  //y scale attributes
  var yScaleMax = 0;
  var yScaleMin = 0;
  var valueToAdd = 0;

  //for domain of y axis
  for (var i=0; i<data.length;i++){
    if(data[i]>yScaleMax){
      yScaleMax = Math.ceil(data[i])+valueToAdd;
    }
    if(data[i]<yScaleMin){
      yScaleMin = Math.floor(data[i]);
    }
  }

  // console.log("this is data")
  // console.log(data)
  // console.log("num companies")
  // console.log(numberCompanies)

  //y scale attributes
  var yScale = d3.scaleLinear()
  .domain([yScaleMin, yScaleMax])
  .range([temp2, 0]);

  //create an instance of svg
  var fullName = "#"+plotNum
  var svgTemp = d3.select(fullName).append("svg");

  //other attributes
  svgTemp.attr("id", secondAttribute); //need to fix
  svgTemp.attr("class", ".background_svg_color");
  svgTemp.attr("height", (height+140))
  .attr("width", width+100);

  // svgTemp.attr("transform", "translate(" + (200) + "," + (0) + ")")

  

  //moves X-axis up
  xAxisShift = margin.top + yScale(0);
  var xAxisShift =0;
  if(yScaleMin<0){
    xAxisShift = margin.top + yScale(0);
  } else if(yScaleMin>0){
    xAxisShift = margin.top + yScale(yScaleMin); //DOUBLE CHECK -->TOO TIRED :/
  }

  //xAxis instance
  var xAxis = svgTemp.append("g")
  .classed("xAxis", true)
  .attr("transform", "translate(" + margin.left + "," + (height -5 +margin.top+margin.bottom) + ")")
  .call(d3.axisBottom(xScale).ticks(15))
  ;


  //label xAxis
  var xAxisLabel = svgTemp.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 50) + ")")
  // .attr("font-family", "Courier")
  .style("fill", "black")
  .style("font-size", "20px");

  xAxis.selectAll("text").attr("transform", "translate(" + (-3) + "," +  (6) + ")rotate(-30)")
          .attr("text-anchor", "end");


  //moves y-axis to the right
  var yAxisShift;
  if(minX<0){
    yAxisShift = margin.left + xScale(0);
  } else if (minX >0){
    yAxisShift = margin.left  + xScale(minX);
  }
  //creates x axis
  var yAxis = svgTemp.append("g")
  .classed("yAxis", true)
  .attr("transform", "translate(" + (70)  + "," +  (margin.top-5)+ ")")
  .call(d3.axisLeft(yScale).ticks(yAxisNumber));

  //yAxisLabel
  var yAxisLabel = svgTemp.append("text")
  .attr("transform", "translate(" + 25 + "," + (height) + ")rotate(-90)")
  // .attr("font-family", "Courier")
  .style("fill", "black")
  .style("font-size", "20px");

  yAxis.selectAll("text").attr("transform", "translate(" + (-3) + "," +  (6) + ")rotate(-55)")
  .attr("text-anchor", "end");
  

  //to display text
  var tooltip = svgTemp
  .append("text")
  .data(data)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  //.attr("width", "5px")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;

  //brings object to front
  d3.selection.prototype.move2Front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  // console.log("data");
  // console.log(colors[data[1][2]]);

//plots the data points
  var dataPoints = svgTemp.append("g")
.attr("transform", yAxisPosition)
.selectAll("dot")
.data(data)
.enter()
.append("circle")
.attr("fill", "black"
// function(d,i){
//   return colors[data[i]]
//}
)
.attr("r", "3.0")
.attr("cx", function(d,i){ 
  return  xScale(xData[i])})
.attr("cy", function(d,i){
  return yScale(data[i])

})
.on("mouseover", function(d,i){
  //   //while hovering, changes color, width and height
     d3.select(this).style("fill", "red");
     d3.select(this).move2Front();
    tooltip.style("visibility", "visible");
    tooltip.text(
      "(" + Math.round(xData[i]*1000)/1000 + ", " + Math.round(data[i]*1000)/1000 + ")");
    // if(typeMDS!="cor"){
      tooltip.attr("y",  yScale(data[i])+20);
      tooltip.attr("x", (xScale(xData[i]+.7)));
    // }else{
    //   tooltip.attr("y", yScale(data[i][1]-.1));
    //   tooltip.attr("x", (xScale(data[i][0]+.05)));
    // }
    tooltip.move2Front();

  })
.on("mouseout", function(d,i){
      d3.select(this).style("fill", "black");
      tooltip.style("visibility", "hidden");
});



//attributes for title
var tempTitle = svgTemp.append("text")
.attr("y",  25)
.attr("x", width/2+60)
.attr("text-anchor", "middle")
// .attr("font-family", "Courier")
.style("fill", "black")
.style("font-size", "21px")
.style("font-weight", "bold");

if(plotNum=="scatterPlot1"){
  document.getElementById("scatterPlot1").style.transform = "translate(" + (690) + "px," + (-595) + "px)";
  

  tempTitle.style("font-size", "18px")
  titleWords = "Number of Companies versus " + words
  tempTitle.text(titleWords)
  xAxisLabel.text("Number of Companies (in each state)")
  yAxisLabel.text(words)

} else{
  document.getElementById("scatterPlot2").style.transform = "translate(" + (690) + "px," + (-160) + "px)";
  // ocument.getElementById("drpdownCont2").style.width ="150px"
  yAxisLabel.attr("transform", "translate(" + 25 + "," + (height+90) + ")rotate(-90)")
  titleWords = buisWord + " versus " +words
  //  + " (per State)"
  tempTitle.text(titleWords)
  xAxisLabel.text(buisWord)
  yAxisLabel.text(words + " (per State)")

  document.getElementById("drpdown2").style.transform = "translate(" + (870) + "px," + (349) + "px)";
  document.getElementById("drpdownCont2").style.transform = "translate(" + (870) + "px," + (349) + "px)";
  document.getElementById("drpdown2").textContent=buisWord;


  document.getElementById("drpdown2").style.width ="280px";
  document.getElementById("drpdownCont2").style.width ="280px";

  document.getElementById("drpdown2").style.height="37px";
}


//labeling
// if(dataType=="strat"){
//   if(analysisType=="mds"){
//     if(typeMDS=="euc"){
//       tempTitle.text("MDS via Euclidean Distance on Stratified Data");
//     } else{
//       tempTitle.text("MDS via Correlation Distance on Stratified Data");
//     }
//     yAxisLabel.text("Component 2");
//     xAxisLabel.text("Component 1");
//   }else{
//     tempTitle.text("Strat. Data Projected on Top Two PCA Vectors");
//     yAxisLabel.text("Principal Component 2");
//     xAxisLabel.text("Principal Component 1");
//   }
// }else if(dataType=="rand"){
//   if(analysisType=="mds"){
//     if(typeMDS=="euc"){
//       tempTitle.text("MDS via Euclidean Distance on Random Data");
//     } else{
//       tempTitle.text("MDS via Correlation Distance on Random Data");
//     }
//     yAxisLabel.text("Component 2");
//     xAxisLabel.text("Component 1");
//   }else{
//     tempTitle.text("Rand. Data Projected on Top Two PCA Vectors");
//     yAxisLabel.text("Principal Component 2");
//     xAxisLabel.text("Principal Component 1");
//   }
// } else if(dataType=="org"){
//   if(analysisType=="mds"){
//     if(typeMDS=="euc"){
//       tempTitle.text("MDS via Euclidean Distance on Original Data");
//     } else{
//       tempTitle.text("MDS via Correlation Distance on Original Data");
//     }
//     yAxisLabel.text("Component 2");
//     xAxisLabel.text("Component 1");
//   } else{
//   tempTitle.text("Orig. Data Projected on Top Two PCA Vectors");
//   yAxisLabel.text("Principal Component 2");
//   xAxisLabel.text("Principal Component 1");
//   }
// }

}



function parallelCoordinate2(newD, orig, secondAttribute, stateOrNot){
  var origData = JSON.parse(orig);
  var newData = JSON.parse(newD);

  if(secondAttribute=="trev"){
    secondAttribute = "Total Revenue"
  }
  if(secondAttribute=="frev"){
    secondAttribute = "Federal Revenue"
  }
  if(secondAttribute=="srev"){
    secondAttribute = "State Revenue"
  }
  if(secondAttribute=="texp"){
    secondAttribute = "Total Expenditure"
  }
  if(secondAttribute=="iexp"){
    secondAttribute = "Instructional Expenditure"
  }
  if(secondAttribute=="gdp2010"){
    secondAttribute = "GDP"
  }
  if(secondAttribute=="cen2010"){
    secondAttribute = "Census"
  }
  if(secondAttribute=="inc"){
    secondAttribute = "Median Household Income"
  }
  if(secondAttribute=="unemp"){
    secondAttribute= "Unemployment Rate"
  }
  if(secondAttribute=="aviq"){
    secondAttribute = "Average IQ"
  }
  if(secondAttribute=="hsdeg"){
    secondAttribute = "High School Grad."
  }
  if(secondAttribute=="bacdeg"){
    secondAttribute = "Bachelors Grad."
  }
  if(secondAttribute=="mas"){
    secondAttribute = "Masters Grad."
  }
  // console.log(stateOrNot)
  // console.log(stateOrNot ==0)
  var allNewData = newData.bigData
  // console.log(allNewData)

  var actualOrigData = origData.origData

  var bigData =[]
  var count =0


  var bigDataArray = []

  for (i=0;i<actualOrigData.length;i++){
  // for (i=0;i<50;i++){
    var value;
    if(secondAttribute=="Total Revenue"){
      value = allNewData[1][actualOrigData[i][9]+1]
    } else if(secondAttribute=="Federal Revenue"){
      value = allNewData[2][actualOrigData[i][9]+1]
    } else if(secondAttribute=="State Revenue"){
      value = allNewData[3][actualOrigData[i][9]+1]
    } else if(secondAttribute=="Total Expenditure"){
      value = allNewData[4][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Instruction Expenditure"){
      value = allNewData[5][actualOrigData[i][9]+1]
    }else if(secondAttribute=="GDP"){
      value = allNewData[6][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Census"){
      value = allNewData[7][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Median Household Income"){
      value = allNewData[8][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Unemployment Rate"){
      value = allNewData[9][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Average IQ"){
      value = allNewData[10][actualOrigData[i][9]+1]
    }else if(secondAttribute=="High School Grad."){
      value = allNewData[11][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Bachelors Grad."){
      value = allNewData[12][actualOrigData[i][9]+1]
    }else if(secondAttribute=="Masters Grad."){
      value = allNewData[13][actualOrigData[i][9]+1]
    }

    if(stateOrNot ==0){
      tempDic = {
      // "name" : String(i),
      "Change In Rank": actualOrigData[i][0],
      "Revenue" :actualOrigData[i][1],
      "Revenue Change" :actualOrigData[i][2],
      "Profit":actualOrigData[i][3],
      "Profit Change":actualOrigData[i][4],
      "Assets" :actualOrigData[i][5],
      "Market Value" :actualOrigData[i][6],
      "Employees"  :actualOrigData[i][7],
      "Years on Fortune 500 List" :actualOrigData[i][8],

    }
      tempDic[secondAttribute] = value;
      bigDataArray[i] = tempDic
    }else{
      if(changeWords[actualOrigData[i][9]]==lastHoveredOver){
        tempDic = {
          // "name" : String(i),
          "Change In Rank": actualOrigData[i][0],
          "Revenue" :actualOrigData[i][1],
          "Revenue Change" :actualOrigData[i][2],
          "Profit":actualOrigData[i][3],
          "Profit Change":actualOrigData[i][4],
          "Assets" :actualOrigData[i][5],
          "Market Value" :actualOrigData[i][6],
          "Employees"  :actualOrigData[i][7],
          "Years on Fortune 500 List" :actualOrigData[i][8],
    
        }
          // tempDic[secondAttribute] = value;
          bigDataArray[count] = tempDic

          count = count+1
      }
    } 
  }




  names = ["Change In Rank","Revenue","Revenue Change","Profit","Profit Change","Assets","Market Value","Employees",
  "Years on Fortune 500 List","Total Revenue","Federal Revenue","State Revenue","Total Expenditure","Instruction Expenditure",
  "GDP","Census","Median Household Income","Unemployment Rate","Average IQ","High School Graduate","Bachelors Graduate","Masters Graduate"]
	var margin = {top: 80, right: 40, bottom: 30, left: 30},
	    width = 743 - margin.left - margin.right,
		  height = 340 - margin.top - margin.bottom;

  
	var dim = [

		{
			name: "Change In Rank",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Revenue",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Revenue Change",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Profit",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
		{
			name: "Profit Change",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Assets",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Market Value",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "Employees",
			scale: d3.scaleLinear().range([0,height]),
			type: "number"
    },
    {
			name: "Years on Fortune 500 List",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		}
		
  ];

  if(stateOrNot==0){
    tempDic = 		{
			name: secondAttribute,
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
    }
    dim[dim.length] = tempDic
  }

  
  
  var x = d3.scaleBand()
    .domain(dim.map(function(d) { 
      
    return d.name; }))
    .range([0, width])
    .padding(0.1);

  var line = d3.line()
    .defined(function(d) { 

    return !isNaN(d[1]); 
  });

var yAxis = d3.axisLeft();

var svg = d3.select("#parallelSmall")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
.attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

var dimension = svg.selectAll(".dimension")
.data(dim)
.enter().append("g")
.attr("class", "dimension")
.attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });


dim.forEach(function(dimension) {
  dimension.scale.domain(dimension.type === "number"
  ? d3.extent(bigDataArray, function(d) { return +d[dimension.name]; })
  : bigDataArray.map(function(d) { return d[dimension.name]; }).sort());
});

svg.append("g")
.attr("class", "background")
.selectAll("path")
.data(bigDataArray)
.enter().append("path")
.attr("d", draw);

svg.append("g")
.attr("class", "foreground")
.selectAll("path")
.data(bigDataArray)

.enter().append("path")
// .attr("opacity", 1)
.attr("d", draw)
// .attr("opacity", 1)
;

dimension.append("g")
  .classed("xAxis", true)
  .each(function(d) { 
    d3.select(this).call(yAxis.scale(d.scale)); })
  .append("text")
  .attr("class", "title")
  .attr("text-anchor", "middle")
  .text(function(d) { 
    // console.log(d.name);
    return (d.name); });



var xAxisLabel = dimension.append("text")
    .attr("text-anchor", "left")
    .attr("transform", "translate(" + (0) + "," + (-5) + ")rotate(-20)")
    .style("font-size", "12px")
    .attr("font-family", "Courier")
    
    .attr("fill", "black")
    .text(function(d){
      return d.name;
    });

var ordinal_labels = svg.selectAll(".axis text")
.on("mouseover", mouseover)
.on("mouseout", mouseout);

var projection = svg.selectAll(".background path,.foreground path")
.on("mouseover", mouseover)
.on("mouseout", mouseout);

function mouseover(d) {
svg.classed("active", true);

if (typeof d === "string") {
  // projection.attr("fill", "black")
  projection.classed("inactive", function(p) { return p.name !== d; });
  projection.filter(function(p) { return p.name === d; }).each(moveToFront);
  ordinal_labels.classed("inactive", function(p) { return p !== d; });
  ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
} else {
  // console.log("came hither")
  projection.classed("inactive", function(p) { return p !== d; });
  // projection.attr("opacity", 1);
  projection.filter(function(p) { return p === d; }).each(moveToFront);
  ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
  ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
}
}

function mouseout(d) {
  svg.classed("active", false);
  projection.classed("inactive", false);
  ordinal_labels.classed("inactive", false);
  }

function moveToFront() {
this.parentNode.appendChild(this);
}

function draw(d) {

  return line(dim.map(function(dimension) {
  return [x(dimension.name), dimension.scale(d[dimension.name])];
}));
}


document.getElementById("parallelSmall").style.transform = "translate(" + (210) + "px," + (-160) + "px)";

}


function barGraph(origData, additionalData, stateOrBuis){
  document.getElementById("stateBarGraph").style.display = "block";
  document.getElementById("buisBarGraph").style.display = "block";
  var additionalData= JSON.parse(additionalData);
  var origData= JSON.parse(origData);
  
  var bigData = additionalData.bigData;

  //gets data
  var data =[];
  var averageData =[];
  var otherData = [];
  // var dataForSum;
  if(stateOrBuis == 0){
    //state
    averageData= additionalData.avArray;
    // console.log(averageData)
    tempData = additionalData.bigData

    for(i=1;i<tempData.length;i++){
      otherData[i-1] = tempData[i][changeNums[lastHoveredOver]-1]
    }
    
    // for(i=0;i<tempData[0].length; i++){

    // }
  } else{
    //buis
    bigOrigData = origData.origData;
    averageData= origData.avArray;
    var stateNum = parseInt(changeNums[lastHoveredOver])
    var sumArrayForBuis = [0,0,0,0,0,0,0,0,0]
    var count =0
    // console.log(stateNum)

    for(j=0;j<bigOrigData.length;j++){

      if(parseInt(bigOrigData[j][9])==stateNum){
        for(i=0;i<9;i++){
          sumArrayForBuis[i] = sumArrayForBuis[i] + parseFloat(bigOrigData[j][i])
        }
        count = count +1
      }
    }

    for(j=0;j<sumArrayForBuis.length;j++){
      otherData[j] = sumArrayForBuis[j]/count
    }


  }

  // get data
  if(stateOrBuis==0){
    for(i=0;i<(otherData.length);i++){
      data[i] = parseFloat(otherData[i])/parseFloat(averageData[i+1])
    }
  }else{
    for(i=0;i<otherData.length;i++){
      data[i] = Math.abs(parseFloat(otherData[i])/parseFloat(averageData[i]))
    }
  }




  // if(activeSvg ==1){
  //   //checks if there is already a graph, and removes it
  //     d3.select("svg").remove();
  // }
  // activeSvg = 1;
  // var eachGrouping = (max-min)/numberOfBoxes;
  // var minXCounter = 0;


  //create the margins
  var margin = {top: 40, right: 25, bottom: 40, left: 70},
    width = 450 - margin.right - margin.left,
    height = 305- margin.top - margin.bottom;

  if(stateOrBuis==1){
    height = 225 - margin.top - margin.bottom;
  }


  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.bottom) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";


  //get values for x axis
  var arrayOfXAxis = [];
  // for (var i=-1; i<(data.length ); i++){
  //   arrayOfXAxis[i+1] = i+1;
  // }
  if(stateOrBuis==0){
    arrayOfXAxis = ["Total Revenue", "Federal Revenue","State Revenue","Total Expenditure", "Instruction Expenditure",
                  "GDP", "Census", "Median Household Income", "Unemployment Rate","Average IQ","High School Grad.","Bachelors Grad.",
                  "Masters Grad", ""]
  } else{
    arrayOfXAxis = ["Change in Rank", "Revenue", "Revenue Change", "Profit", "Profit Change", "Assets", "Market Value", 
                  "Employees", "Years on Fortune 500 List", ""]   
  }


  var xScale = d3.scaleBand()
  .domain(arrayOfXAxis) //values
  .range([0,width]) //location of start

  ;



  var yScaleMax = Math.ceil(d3.max(data)) +1

  //values for x axis --> used for bar graph
  var arrayForXScale = new Array(arrayOfXAxis.length);
  for(var j=0; j<arrayOfXAxis.length ; j++){
    arrayForXScale[j] = xScale(arrayOfXAxis[j]);
  }

  //y scale attributes
  var yScale = d3.scaleLinear()
  .domain([0, yScaleMax])
  .range([temp2, 0]);

  //create an instance of svg
  var svgTemp;
  //other attributes
  if(stateOrBuis==0){
    svgTemp = d3.select("#stateBarGraph").append("svg")
    // .attr("transform", "translate(" + 1000 + "," + (1000) + ")");
    svgTemp.attr("id", "stateBarGraph")
    ;
  } else{
    svgTemp = d3.select("#buisBarGraph").append("svg");
    svgTemp.attr("id", "buisBarGraph"); //need to fix    
  }
    // svgTemp.attr("id", ""); //need to fix
  svgTemp.attr("class", ".background_svg_color");
  
  //set attributes of svg
  // svgTemp.attr("height", width)
  //       .attr("width", width+100);
  svgTemp.attr("height", (height+190))
  .attr("width", width+100);

  //xAxis instance
  var xAxis = svgTemp.append("g")
  .classed("xAxis", true)
  .attr("transform", "translate(" + margin.left + "," + (height + margin.top + margin.bottom) + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("transform", "rotate(-35)");
  ;

  //label xAxis
  var xAxisLabel = svgTemp.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 100) + ")")
  // .attr("font-family", "Courier")
  .attr("fill", "black")
  .style("font-size", "20px");

  //yAxis instance
  var yAxis = svgTemp.append("g")
  .classed("yAxis", true)
  .attr("transform", "translate(" + margin.left  + "," +  margin.top+ ")")
  .call(d3.axisLeft(yScale).ticks(yAxisNumber));

  //yAxisLabel
  var yAxisLabel = svgTemp.append("text")
  .attr("transform", "translate(" + 30 + "," + (height/2+160) + ")rotate(-90)")
  // .attr("font-family", "Courier")
  .attr("fill", "black")
  .style("font-size", "19px");

  //to display data on top
  var tooltip = svgTemp
  .append("text")
  .data(data)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  //.attr("width", "5px")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;

  //brings object to front
  d3.selection.prototype.move2Front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  //size of each bar
  var differenceInPositions = arrayForXScale[1] - arrayForXScale[0];



  //draws bar graph of eigenvalues
  var barGraph = svgTemp.append("g")
  .attr("transform", yAxisPosition)
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("fill", "#8CD3DD")
  .attr("width",   differenceInPositions)
  .attr("height", function(d,i){return (height- yScale(data[i])+ margin.top)})
  .attr("x", function(d,i){ 
    return arrayForXScale[i+1] -  (differenceInPositions/2)})
  .attr("y", function(d){return  yScale(d)})
  .on("mouseover", function(d,i){
  //   //while hovering, changes color, width and height
     d3.select(this).style("fill", "red"); tooltip.style("visibility", "visible"); 
                  tooltip.text( "Percent: " + Math.round(d*1000)/1000).move2Front();
                  tooltip.attr("x", (arrayForXScale[i+1] + margin.left -60));
                  tooltip.attr("y",  yScale(d) +30);
                  tooltip.move2Front();
                 d3.select(this).move2Front();
                 d3.select(this).attr("width", (differenceInPositions+3));
                 d3.select(this).attr("height", height- yScale(data[i])+ margin.top +6);
                 d3.select(this).attr("y", yScale(d+.1));
              }
   )
  // //when not hovering, changes color, width, and height back
   .on("mouseout", function(d,i){
     d3.select(this).style("fill", "#8CD3DD"); tooltip.style("visibility", "hidden");
     d3.select(this).attr("width",   differenceInPositions);
     d3.select(this).attr("height", (height- yScale(data[i])+ margin.top));
     d3.select(this).attr("y",  yScale(d));
   });


//labels
yAxisLabel.text("Percent Compared to Mean");
if(stateOrBuis==0){
  xAxisLabel.text("State Attributes");  
} else{
  yAxisLabel.attr("transform", "translate(" + 30 + "," + (height/2+180) + ")rotate(-90)")
  xAxisLabel.text("Buisness Attributes");    
}



var tempTitle = svgTemp.append("text")
.attr("y",  45)
.attr("x", width/2+60)
.attr("text-anchor", "middle")
.attr("fill", "black")
// .attr("font-family", "Courier")
.style("font-size", "21px")
.style("font-weight", "bold");



if(stateOrBuis==0){
  tempTitle.text("State Attributes Compared to Mean Values")
} else{
  tempTitle.style("font-size", "19px")
  tempTitle.text("Buisness Attributes Compared to Mean Values")  
}

// //legend
// var colors = ["#8CD3DD","#0000A0", "red"]

if(stateOrBuis ==0){
  document.getElementById("stateBarGraph").style.transform = "translate(" + (690) + "px," + (-595) + "px)";
  // document.getElementById("stateBarGraph").style.transform = "translate(" + (1690) + "px," + (-1595) + "px)";
} else{
  document.getElementById("buisBarGraph").style.transform = "translate(" + (690) + "px," + ((-160)) + "px)";

}
// var keys = ["EigenValues", "Sum of EigenValues", "75% of Variance"]

// svgTemp.selectAll("mydots")
//   .data(keys)
//   .enter()
//   .append("circle")
//     .attr("cx", arrayForXScale[8] +differenceInPositions/4)
//     .attr("cy", function(d,i){ return yScale(3.5+(.5*i)+.13)}) // 100 is where the first dot appears. 25 is the distance between dots
//     .attr("r", 6)
//     .style("fill", function(d,i){ return colors[i]})

// svgTemp.selectAll("mylabels")
//      .data(keys)
//      .enter()
//      .append("text")
//      .attr("x", arrayForXScale[8] +differenceInPositions/2)
//      .attr("y", function(d,i){return yScale(3.5+(.5*i))})
//      .text(function(d){return d})
//      .style("fill", function(d,i){return colors[i]})
//      .attr("text-anchor", "left")
}


//creates scree plots
function screePlot2(a, dataType){

  
  var tempA = JSON.parse(a);

  //gets data
  var data;
  var dataForSum;
  var seventyfivePos;
  if (dataType=="strat"){
    data = tempA.stratEigVal;
    dataForSum = tempA.sumOfStratEig;
    seventyfivePos = tempA.stratSigNum;
  } else if(dataType=="org"){
    data = tempA.orgEigVal;
    dataForSum = tempA.sumOfOrgEig;
    seventyfivePos = tempA.orgSigNum;
  } else if(dataType=="rand"){
    data = tempA.randEigVal;
    dataForSum = tempA.sumOfRandEig;
    seventyfivePos = tempA.randSigNum;
  } else{
    //function that plots all three attributes and plots eigenvalues
    screePlot4All3(a);
    return;
  }


  // if(activeSvg ==1){
  //   //checks if there is already a graph, and removes it
  //     d3.select("svg").remove();
  // }
  // activeSvg = 1;
  // var eachGrouping = (max-min)/numberOfBoxes;
  // var minXCounter = 0;


  //create the margins
  var margin = {top: 35, right: 25, bottom: 40, left: 70},
    width = 550 - margin.right - margin.left,
    height = 320- margin.top - margin.bottom;

  // if(plotNum =="scatterPlot2"){
  //   height = 275 - margin.top - margin.bottom;
  // }


  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";


  //get values for x axis
  var arrayOfXAxis = [];
  for (var i=-1; i<(data.length ); i++){
    arrayOfXAxis[i+1] = i+1;
  }

  var xScale = d3.scaleBand()
  .domain(arrayOfXAxis) //values
  .range([0,width]) //location of start

  ;



  var yScaleMax = Math.ceil(dataForSum[9])

  //values for x axis --> used for bar graph
  var arrayForXScale = new Array(arrayOfXAxis.length);
  for(var j=0; j<arrayOfXAxis.length ; j++){
    arrayForXScale[j] = xScale(arrayOfXAxis[j]);
  }

  //y scale attributes
  var yScale = d3.scaleLinear()
  .domain([0, yScaleMax])
  .range([temp2, 0]);

  //create an instance of svg
  // var svgTemp = d3.select("body").append("svg");
  // // .attr("transform", "translate(" + 500 + "," + (0) + ")");
  // //other attributes
  // svgTemp.attr("id", dataType); //need to fix
  // svgTemp.attr("class", ".background_svg_color");

  var svgTemp = d3.select("#screePlot").append("svg");
  // .attr("transform", "translate(" + 500 + "," + (0) + ")");
  //other attributes
  svgTemp.attr("id", dataType); //need to fix
  svgTemp.attr("class", ".background_svg_color");
  
  //set attributes of svg
  svgTemp.attr("height", width-68).attr("width", width+100);


  //xAxis instance
  var xAxis = svgTemp.append("g")
  .classed("xAxis", true)
  .attr("transform", "translate(" + margin.left + "," + (height + margin.top + margin.bottom -5) + ")")
  .call(d3.axisBottom(xScale))
  ;

  //label xAxis
  var xAxisLabel = svgTemp.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 50) + ")")
  .attr("font-family", "Courier")
  .style("font-size", "20px");

  //yAxis instance
  var yAxis = svgTemp.append("g")
  .classed("yAxis", true)
  .attr("transform", "translate(" + margin.left  + "," +  margin.top+ ")")
  .call(d3.axisLeft(yScale).ticks(yAxisNumber));

  //yAxisLabel
  var yAxisLabel = svgTemp.append("text")
  .attr("transform", "translate(" + 30 + "," + (height/2+60) + ")rotate(-90)")
  .attr("font-family", "Courier")
  .style("font-size", "20px");

  //to display data on top
  var tooltip = svgTemp
  .append("text")
  .data(data)
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("text-anchor", "right")
  .attr("font-family", "Courier")
  //.attr("width", "5px")
  .attr("fill", "#303030")
  .style("font-size", "12px")
  ;

  //brings object to front
  d3.selection.prototype.move2Front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  //size of each bar
  var differenceInPositions = arrayForXScale[1] - arrayForXScale[0];

  //scales for lines
  var valueline = d3.line()
  .x(function(d,i) { return arrayForXScale[i] + differenceInPositions +70 ; })
  .y(function(d) { return yScale(d-1); });

  // line for sum data
  svgTemp.append("path")
  .attr("class", "line")
  .style("stroke","#0000A0" )
  .attr("d", valueline(dataForSum))
  .attr("transform", "translate(" + 0 + "," + (22) + ")");

//instance of a line
  var valueline2 = d3.line()
  .x(function(d,i){return arrayForXScale[seventyfivePos] + differenceInPositions + 70;})
  .y(function(d){return yScale(d);})

  var seventyfivePosArray = [dataForSum[seventyfivePos]-1, data[seventyfivePos]-1];
  
  //draws line connecting sum of eigen value data points
  svgTemp.append("path")
  .attr("class", "line")
  .style("stroke", "red")
  .attr("d", valueline2(seventyfivePosArray))
  .attr("transform", "translate(" + 0 + "," + (25) + ")");

  //draws bar graph of eigenvalues
  var barGraph = svgTemp.append("g")
  .attr("transform", yAxisPosition)
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("fill", "#8CD3DD")
  .attr("width",   differenceInPositions)
  .attr("height", function(d,i){return (height- yScale(data[i])+ margin.top)})
  .attr("x", function(d,i){ 
    return arrayForXScale[i+1] -  (differenceInPositions/2)})
  .attr("y", function(d){return  yScale(d)})
  .on("mouseover", function(d,i){
  //   //while hovering, changes color, width and height
     d3.select(this).style("fill", "red"); tooltip.style("visibility", "visible"); 
                  tooltip.text( "EigenValue: " + Math.round(d*1000)/1000).move2Front();
                  tooltip.attr("x", (arrayForXScale[i+1] + margin.left -60));
                  tooltip.attr("y",  yScale(d) +24);
                  tooltip.move2Front();
                 d3.select(this).move2Front();
                 d3.select(this).attr("width", (differenceInPositions+3));
                 d3.select(this).attr("height", height- yScale(data[i])+ margin.top +6);
                 d3.select(this).attr("y", yScale(d+.44));
              }
   )
  // //when not hovering, changes color, width, and height back
   .on("mouseout", function(d,i){
     d3.select(this).style("fill", "#8CD3DD"); tooltip.style("visibility", "hidden");
     d3.select(this).attr("width",   differenceInPositions);
     d3.select(this).attr("height", (height- yScale(data[i])+ margin.top));
     d3.select(this).attr("y",  yScale(d));
   });

  //shows data associated with the line --> sum of eigenvalues
  var tooltipLine = svgTemp
   .append("text")
   .data(dataForSum)
   .style("position", "absolute")
   .style("visibility", "hidden")
   .attr("text-anchor", "right")
   .attr("font-family", "Courier")
   .attr("fill", "#303030")
   .style("font-size", "12px")
   ;

//data points of sum of previous eigenvalues
var dataPoints = svgTemp.append("g")
.attr("transform", yAxisPosition)
.selectAll("dot")
.data(dataForSum)
.enter()
.append("circle")
.attr("fill", "#0000A0")
.attr("r", "5.0")
.attr("cx", function(d,i){ 
  return arrayForXScale[i+1] })
.attr("cy", function(d){
  return yScale(d)

})
.on("mouseover", function(d,i){
  //   //while hovering, changes color, width and height
     d3.select(this).style("fill", "red");
     d3.select(this).attr("r", "6.0");
    tooltipLine.style("visibility", "visible");
    tooltipLine.text("Sum " + Math.round(dataForSum[i]*1000)/1000);
    tooltipLine.attr("x", (arrayForXScale[i+1] ));
    tooltipLine.attr("y",  yScale(d) +30);
    tooltipLine.move2Front();

  })
.on("mouseout", function(d,i){
      d3.select(this).style("fill", "#0000A0");
      d3.select(this).attr("r", "6.0");
      tooltipLine.style("visibility", "hidden");
});

//labels
yAxisLabel.text("EigenValue");
xAxisLabel.text("Principal Component");

var tempTitle = svgTemp.append("text")
// .attr("y",  45)
.attr("y",  75)
.attr("x", width/2+160)
.attr("text-anchor", "middle")
// .attr("font-family", "Courier")
.style("font-size", "22px")
.style("font-weight", "bold");

if(dataType =="strat"){
  tempTitle.text("PCA EigenValues For Stratified Data");
} else if(dataType =="rand"){
  tempTitle.text("PCA EigenValues For Random Data");
} else if(dataType=="org"){
  tempTitle.text("PCA EigenValues");
} 

//legend
var colors = ["#8CD3DD","#0000A0", "red"]
var keys = ["EigenValues", "Sum of EigenValues", "75% of Variance"]

svgTemp.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", arrayForXScale[8]+160 +differenceInPositions/4)
    .attr("cy", function(d,i){ return yScale(3.5+(1.1*i)+.13)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 6)
    .style("fill", function(d,i){ return colors[i]})

svgTemp.selectAll("mylabels")
     .data(keys)
     .enter()
     .append("text")
     .attr("x", arrayForXScale[8]+170 +differenceInPositions/2)
     .attr("y", function(d,i){return yScale(3.5+(1*i))})
     .text(function(d){return d})
     .style("fill", function(d,i){return colors[i]})
     .attr("text-anchor", "left")
    //  .attr("transform", "translate(" + 25 + "," + (0) + ")")

    //  document.getElementById("screePlot").style.transform = "translate(" + (540) + "px," + (-150) + "px)";
    document.getElementById("screePlot").style.transform = "translate(" + (-483) + "px," + (-150) + "px)";
    document.getElementById("topnav").style.width ="1300px";
    document.getElementById("topnav").style.transform = "translate(" + (-10) + "px," + (-8) + "px)";
    document.getElementById("topnav").style.height ="41px";

}