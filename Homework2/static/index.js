var yAxisNumber = 10;
var activeSvg =0;
var paddingValue =0.1;





function changeyAxisNumber(number){
  yAxisNumber = number;
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

//creates scree plots
function screePlot(a, dataType){
  console.log("we are here");
  
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


  if(activeSvg ==1){
    //checks if there is already a graph, and removes it
      d3.select("svg").remove();
  }
  activeSvg = 1;
  // var eachGrouping = (max-min)/numberOfBoxes;
  // var minXCounter = 0;


  //create the margins
  var margin = {top: 40, right: 25, bottom: 40, left: 70},
    width = 700 - margin.right - margin.left,
    height = 500- margin.top - margin.bottom;


  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";


  //get values for x axis
  var arrayOfXAxis = [];
  for (var i=-1; i<(data.length ); i++){
    arrayOfXAxis[i+1] = i+1;
    console.log(arrayOfXAxis[i+1]);
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
  var svgTemp = d3.select("body").append("svg");
  console.log("here i am");
  //other attributes
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
  .attr("d", valueline(dataForSum));

//instance of a line
  var valueline2 = d3.line()
  .x(function(d,i){return arrayForXScale[seventyfivePos] + differenceInPositions + 70;})
  .y(function(d){return yScale(d);})

  var seventyfivePosArray = [dataForSum[seventyfivePos]-1, data[seventyfivePos]-1];
  
  //draws line connecting sum of eigen value data points
  svgTemp.append("path")
  .attr("class", "line")
  .style("stroke", "red")
  .attr("d", valueline2(seventyfivePosArray));

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
.attr("y",  45)
.attr("x", width/2+60)
.attr("text-anchor", "middle")
.attr("font-family", "Courier")
.style("font-size", "24px")
.style("font-weight", "bold");

if(dataType =="strat"){
  tempTitle.text("PCA EigenValues For Stratified Data");
} else if(dataType =="rand"){
  tempTitle.text("PCA EigenValues For Random Data");
} else if(dataType=="org"){
  tempTitle.text("PCA EigenValues For Original Data");
} 

//legend
var colors = ["#8CD3DD","#0000A0", "red"]
var keys = ["EigenValues", "Sum of EigenValues", "75% of Variance"]

svgTemp.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", arrayForXScale[8] +differenceInPositions/4)
    .attr("cy", function(d,i){ return yScale(3.5+(.5*i)+.13)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 6)
    .style("fill", function(d,i){ return colors[i]})

svgTemp.selectAll("mylabels")
     .data(keys)
     .enter()
     .append("text")
     .attr("x", arrayForXScale[8] +differenceInPositions/2)
     .attr("y", function(d,i){return yScale(3.5+(.5*i))})
     .text(function(d){return d})
     .style("fill", function(d,i){return colors[i]})
     .attr("text-anchor", "left")
}
  



// function displayPCALoadings(a){
//   if(activeSvg ==1){
//     //checks if there is already a graph, and removes it
//       d3.select("svg").remove();
//   }
//   activeSvg = 1;

//   var tempA = JSON.parse(a);

// }

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
  var svgTemp = d3.select("body").append("svg");

  //other attributes
  svgTemp.attr("id", dataType); //need to fix
  svgTemp.attr("class", ".background_svg_color");
  svgTemp.attr("height", width).attr("width", width+100);

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
  .attr("transform", "translate(" + 30 + "," + (height) + ")rotate(-90)")
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
  console.log("data");
  console.log(colors[data[1][2]]);

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
      tempTitle.text("MDS via Euclidean Distance on Original Data");
    } else{
      tempTitle.text("MDS via Correlation Distance on Original Data");
    }
    yAxisLabel.text("Component 2");
    xAxisLabel.text("Component 1");
  } else{
  tempTitle.text("Orig. Data Projected on Top Two PCA Vectors");
  yAxisLabel.text("Principal Component 2");
  xAxisLabel.text("Principal Component 1");
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
  if(activeSvg ==1){
    //checks if there is already a graph, and removes it
      d3.select("svg").remove();
  }
  activeSvg = 1;

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
  var svg = d3.select("body").append("svg")
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
    document.getElementById("t1").value = "Original Data Scatter Plot Matrix";
  } else if(dataType=="rand"){
    document.getElementById("t1").value = "Random Data Scatter Plot Matrix";
  } else if (dataType=="strat"){
    document.getElementById("t1").value = "Stratified Data Scatter Plot Matrix";
  }

}