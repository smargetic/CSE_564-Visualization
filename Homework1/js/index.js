var numberOfBoxes= 10;
var yAxisNumber = 10;
var activeSvg =0;
var paddingValue =0.1;
var currentGraphAttribute;


function changeNumberOfBoxes(number){
  numberOfBoxes = number;
}

function changeyAxisNumber(number){
  yAxisNumber = number;
}


//option to say hello!
function welcome(){
  window.alert("Hello!");
}

//shows graph and removes home menu
function showGraphMenuAndHideHomeMenu(){
  document.getElementById("vertical-menu").style.display = "block";
    document.getElementById("home-menu").style.display = "none";
}

//hides graphs and goes back to home menu
function hideGraphMenuAndShowHomeMenu(){
  document.getElementById("home-menu").style.display = "block";
  document.getElementById("vertical-menu").style.display = "none";
  document.getElementById("mySlider").style.display = "none";
  d3.select("svg").remove();
  activeSvg = 0;
  currentGraphAttribute = "";
}

function hideBigMenu(){
  document.getElementById("topnav").style.display = "none";
}

function createContinuousGraph(graphAttribute, tempArray, min, max){
  currentGraphAttribute = graphAttribute;
  if(activeSvg ==1){
    //checks if there is already a graph, and removes it
      d3.select("svg").remove();
  }
  activeSvg = 1;
  var eachGrouping = (max-min)/numberOfBoxes;
  var minXCounter = 0;


  //create the margins --> not sure if going to use
  var margin = {top: 40, right: 25, bottom: 40, left: 70},
    width = 700 - margin.right - margin.left,
    height = 500- margin.top - margin.bottom;


  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";

    //find out numbers on x axis
    var arrayOfXAxis = new Array(numberOfBoxes+1);
    for (var i=0; i<=numberOfBoxes; i++){
      //set value equal to the x axis value
      arrayOfXAxis[i] = i*eachGrouping + min;
      arrayOfXAxis[i] = arrayOfXAxis[i].toFixed(2);
      console.log("ARRAY OF AXIS:     " + arrayOfXAxis[i]);
      if(arrayOfXAxis[i]<0){
        minXCounter ++;
      }
    }

    //x scale attributes
    var xScale = d3.scaleBand()
      .domain(arrayOfXAxis) //values
      .range([0,width]) //location of start

      ;

    //had errors related to significant digits --> this fixes issue
    var arrayForXScale = new Array(numberOfBoxes);
    for(var j=0; j<numberOfBoxes ; j++){
      arrayForXScale[j] = (j*eachGrouping + min).toFixed(2);
      arrayForXScale[j] = xScale(arrayForXScale[j]);
      console.log("new x value:     " + arrayForXScale[j]);
    }

    var yScaleMax = 100;
    //add some extra padding to the top
    if (d3.max(tempArray)>100){
      yScaleMax = Math.ceil(d3.max(tempArray)/100)*100;
    }

    var tempScale = d3.scaleLinear()
      .domain([min, max])
      .range([0,width]);
    //y scale attributes
    var yScale = d3.scaleLinear()
      .domain([0, yScaleMax])
      .range([temp2, 0]);



    //create an instance of svg
    var svgTemp = d3.select("body").append("svg");

    //other attributes
    svgTemp.attr("id", graphAttribute); //need to fix
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
      .attr("font-family", "Comic Sans MS")
      .style("font-size", "16px");



    //yAxis instance
    var yAxis = svgTemp.append("g")
      .classed("yAxis", true)
      .attr("transform", "translate(" + margin.left  + "," +  margin.top+ ")")
      .call(d3.axisLeft(yScale).ticks(yAxisNumber));

    //yAxisLabel
    var yAxisLabel = svgTemp.append("text")
      .attr("transform", "translate(" + 30 + "," + (height/2+60) + ")rotate(-90)")
      .attr("font-family", "Comic Sans MS")
      .style("font-size", "16px");




    //size of each bar
    var differenceInPositions = arrayForXScale[1] - arrayForXScale[0];

    //to display data
    var tooltip = svgTemp
    .append("text")
    .data(tempArray)
    .style("position", "absolute")
    .style("visibility", "hidden")
    .attr("text-anchor", "right")
    .attr("font-family", "Comic Sans MS")
    .attr("fill", "#303030")
    .style("font-size", "12px")
    ;

    //brings object to front
    d3.selection.prototype.move2Front = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    //bar attributes
    var bar = svgTemp.append("g")
      .attr("transform", yAxisPosition)
      .selectAll(".bar")
      .data(tempArray)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width",   differenceInPositions)
      .attr("height", function(d,i){return (height- yScale(tempArray[i])+ margin.top)})
      .attr("x", function(d,i){return arrayForXScale[i] +  (differenceInPositions/2)})
      .attr("y", function(d){return  yScale(d)})
      .on("mouseover", function(d,i){
        //while hovering, changes color, width and height
        d3.select(this).style("fill", "red"); tooltip.style("visibility", "visible"); tooltip.text( "Count: " + d).move2Front();
                      tooltip.attr("x", (arrayForXScale[i] +  (differenceInPositions/2) + margin.left));
                      tooltip.attr("y",  yScale(d)+margin.top - 11);
                    d3.select(this).move2Front();
                    d3.select(this).attr("width", (differenceInPositions+3));
                    d3.select(this).attr("height", height- yScale(tempArray[i])+ margin.top +6);
                    if(graphAttribute=="Years on Fortune 500 List"){
                      d3.select(this).attr("y", yScale(d+3.5))
                    } else if (graphAttribute=="Improved Rank"){
                      d3.select(this).attr("y", yScale(d+9))
                    }else if (graphAttribute =="Revenue Change"){
                      d3.select(this).attr("y", yScale(d+9))
                    } else if (graphAttribute == "Profit Over Revenue"){
                      if((numberOfBoxes>15)&&(numberOfBoxes<30)){
                        d3.select(this).attr("y", yScale(d+4));
                      } else if ((numberOfBoxes>30)&&(numberOfBoxes<40)){
                        d3.select(this).attr("y", yScale(d+2));
                      }else if (numberOfBoxes>40)  {
                        d3.select(this).attr("y", yScale(d+6));
                      }else{
                        d3.select(this).attr("y", yScale(d+10));
                      }

                    }else{
                      d3.select(this).attr("y", yScale(d+10))
                    }
                  }
      )
      //when not hovering, changes color, width, and height back
      .on("mouseout", function(d,i){
        d3.select(this).style("fill", "#8CD3DD"); tooltip.style("visibility", "hidden");
        d3.select(this).attr("width",   differenceInPositions);
        d3.select(this).attr("height", height- yScale(tempArray[i])+ margin.top);
        d3.select(this).attr("y", yScale(d));
        }
      )
    ;


    //title
    var tempTitle = svgTemp.append("text")
        .attr("y",  15)
        .attr("x", width/2+50)
        .attr("text-anchor", "middle")
        .attr("font-family", "Comic Sans MS")
        .style("font-size", "22px")
        .style("font-weight", "bold");

        //need to tilt text if the number of boxes is too large
        if(numberOfBoxes>13){
          xAxis.selectAll("text").attr("transform", "translate(" + (-3) + "," +  (6) + ")rotate(-45)")
          .attr("text-anchor", "end");
          xAxisLabel.attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 75) + ")");
        }

    //specific attribute based of chart
    if (graphAttribute == "Revenue Change"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Revenue Change");
      tempTitle.text("Change in Revenue Versus Number of Companies");
    } else if(graphAttribute == "Revenues ($M)"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Revenues ($M)");
      tempTitle.text("Revenues ($M) Versus Number of Companies");
    } else if(graphAttribute == "Profits ($M)"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Profits ($M)");
      tempTitle.text("Profits ($M) Versus Number of Companies");
    } else if (graphAttribute == 'Profit Change'){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Profit Change");
      tempTitle.text("Profit Change Versus Number of Companies");
    } else if (graphAttribute == "Assets ($M)"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Assets ($M)");
      tempTitle.text("Assets ($M) Versus Number of Companies");
    } else if (graphAttribute == "Mkt Value as of 3/29/18 ($M)"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Mkt Value as of 3/29/18 ($M)");
      tempTitle.text("Mkt Value as of 3/29/18 ($M) Versus Number of Companies");
    } else if (graphAttribute == "Employees"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Employees");
      tempTitle.text("Employees Versus Number of Companies");
    } else if (graphAttribute == "Years on Fortune 500 List"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Years on Fortune 500 List");
      tempTitle.text("Years on Fortune 500 List Versus Number of Companies");
    } else if (graphAttribute == "Improved Rank"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Improved Rank");
      tempTitle.text("Improved Rank Versus Number of Companies");
    } else if (graphAttribute == "Profit Over Revenue"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Profit Over Revenue");
      tempTitle.text("Profit Over Revenue Versus Number of Companies");
    }


  document.getElementById("mySlider").style.display = "block";

}

//function produces discrete graphs
function createDiscreteGraph(graphAttribute, unique, numberOfCompaniesForUnique, countOfUnique){
  document.getElementById("mySlider").style.display = "none";
  currentGraphAttribute = graphAttribute;
  if(activeSvg ==1){
    //checks if there is already a graph, and removes it
      d3.select("svg").remove();
  }
  activeSvg = 1;
  var minXCounter = 0;

  //margin values changed based on type of graph
  var top = 25;
  var right = 25;
  var bottom =25;
  var left =70;
  if(graphAttribute == "Industry"){
    bottom = 200;
  }
  if(graphAttribute=="Sector"){
    bottom =100;
  }
  if(graphAttribute=="CEO Title"){
    bottom =200;
    top = 50;
  }

  //create the margins --> not sure if going to use
  var margin = {top: top, right: right, bottom: bottom, left: left},
    width = 700 - margin.right - margin.left,
    height = 500- margin.top - margin.bottom;

  var svgTemp = d3.select("body").append("svg");

  //industry is wider
  if(graphAttribute =="Industry"){
    width = 1100;

  }

  //variables written for simplicity
  var temp1 = width + margin.right + margin.left;
  var temp2 = height + margin.top;
  var xAxisPosition = "translate(" + margin.left + "," + (height + margin.top) + ")";
  var yAxisPosition = "translate(" + margin.left + "," +  margin.top + ")";

    //x scale attributes
    var xScale = d3.scaleBand()
      .domain(unique) //values -->MIGHT GIVE ERRORS
      .range([0,width]) //location of start
      ;


    var yScaleMax = 100;
    //add some extra padding to the top
    if (d3.max(numberOfCompaniesForUnique)>100){
      yScaleMax = Math.ceil(d3.max(numberOfCompaniesForUnique)/100)*100;
    }


    //y scale attributes
    var yScale = d3.scaleLinear()
      .domain([0, yScaleMax])
      .range([temp2, 0]);

    //other attributes
    svgTemp.attr("id", graphAttribute); //need to fix

    //set attributes of svg
    svgTemp.attr("height", width).attr("width", width+100);

    //xAxis instance
    var xAxis = svgTemp.append("g")
      .classed("xAxis", true)
      .attr("transform", "translate(" + margin.left + "," + (height + 2*margin.top ) + ")")
      .call(d3.axisBottom(xScale))
      ;

    //max value
    var max =0;
    for (var i=0; i<countOfUnique; i++){
        if(unique[i].length >max){
          max = unique[i].length;
        }
    }

    var differenceInPositions = xScale(unique[1]) - xScale(unique[0]);


    //label xAxis
    var xAxisLabel = svgTemp.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (width/2 + 30) + "," + (height+margin.top + margin.bottom + 50) + ")")
      .attr("font-family", "Comic Sans MS")
      .style("font-size", "16px");


    //yAxis instance
    var yAxis = svgTemp.append("g")
      .classed("yAxis", true)
      .attr("transform", "translate(" + margin.left + "," +  margin.top+ ")")
      .call(d3.axisLeft(yScale).ticks(yAxisNumber));

    //yAxisLabel
    var yAxisLabel = svgTemp.append("text")
      .attr("transform", "translate(" + 30 + "," + (height/2+60) + ")rotate(-90)")
      .attr("font-family", "Comic Sans MS")
      .style("font-size", "16px");


    //to display data
    var tooltip = svgTemp
    .append("text")
    .data(numberOfCompaniesForUnique)
    .attr("class", ".tip")
    .style("position", "absolute")
    //.style("visibility", "hidden")
    .style("background", "#ddd")
    .attr("text-anchor", "right")
    .attr("font-family", "Comic Sans MS")
    //.attr("fill", "#707070")
    .attr("fill", "#303030")
    .style("font-size", "12px")

    ;


//brings attribute to front
d3.selection.prototype.move2Front = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });

};
    //bar attributes
    var bar = svgTemp.append("g")
      .attr("transform", yAxisPosition)
      .selectAll(".bar")
      .data(numberOfCompaniesForUnique)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width",   differenceInPositions)
      .attr("height", function(d,i){return (height- yScale(numberOfCompaniesForUnique[i])+ margin.top)})
      .attr("x", function(d,i){return xScale(unique[i]) +  (differenceInPositions/2)})
      .attr("y", function(d){return  yScale(d)})
      .on("mouseover", function(d,i){
        //when hovering, adds text, color, and increases size
        d3.select(this).style("fill", "red"); tooltip.style("visibility", "visible"); tooltip.text( "Count: " + d).move2Front();
                      tooltip.attr("x", (xScale(unique[i]) +  (differenceInPositions/2) + margin.left));
                      tooltip.attr("y",  yScale(d)+margin.top - 9);
                      //d3.select(this).raise()//;
                      d3.select(this).move2Front();
                      d3.select(this).attr("width", (differenceInPositions+4));
                      d3.select(this).attr("height", height- yScale(numberOfCompaniesForUnique[i])+ margin.top +6);

                      if(graphAttribute == "Region"){
                        d3.select(this).attr("y", yScale(d+1.2));
                      } else if (graphAttribute == "Industry") {
                        d3.select(this).attr("y", yScale(d+1.7));
                      }else if(graphAttribute == "CEO Title"){
                        d3.select(this).attr("y", yScale(d+8));
                      }else if(graphAttribute=="City"){
                        d3.select(this).attr("y", yScale(d+1.2));
                      }else{
                          d3.select(this).attr("y", yScale(d+2.5));
                      }
                      //tool_tip.show
                    }
      )
      //changes color and size back when not hovering
      .on("mouseout", function(d,i){
        d3.select(this).style("fill", "#8CD3DD"); tooltip.style("visibility", "hidden");
        d3.select(this).attr("width",   differenceInPositions);
        d3.select(this).attr("height", height- yScale(numberOfCompaniesForUnique[i])+ margin.top);
        d3.select(this).attr("y", yScale(d))}
      )
    ;


    var tempTitle = svgTemp.append("text")
        .attr("y",  15)
        .attr("x", width/2+50)
        .attr("text-anchor", "middle")
        .attr("font-family", "Comic Sans MS")
        .style("font-size", "22px")
        .style("font-weight", "bold");

    //Industry is wider
    if(graphAttribute=="Industry"){
          document.getElementById(graphAttribute).style.top = "300px";
          document.getElementById(graphAttribute).style.left= "350px";

        }
    var x=0;
    var y = 10;

    //labels for each attribute
    //also shifts labels accordingly
    if(graphAttribute=="Industry"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("Industry");
      tempTitle.text("Industry Versus Number of Companies");
      x=-7;
      //y=10;
    } else if(graphAttribute=="City"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.attr("transform", "translate(" + (width/2+50) + "," + (height+150) + ")")
      xAxisLabel.text("City");
      tempTitle.text("City Versus Number of Companies");
      x=-9;
    } else if(graphAttribute=="State"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("State");
      tempTitle.attr("x",  width/2+100)
      tempTitle.text("State Versus Number of Companies");
      //tempTitle.attr("x",  width/2+80)
      x=-6;
    } else if(graphAttribute=="Region"){
      yAxisLabel.text("Number of Companies");
      x=differenceInPositions/2;
      xAxisLabel.attr("transform", "translate(" + (width/2+50) + "," + (height+150) + ")")
      xAxisLabel.text("Region");
      tempTitle.text("Region Versus Number of Companies");
    } else if(graphAttribute=="Sector"){
      yAxisLabel.text("Number of Companies");
      xAxisLabel.attr("transform", "translate(" + (width/2+50) + "," + (height+200) + ")")
      xAxisLabel.text("Sector");
      tempTitle.text("Sector Versus Number of Companies");
    } else if(graphAttribute=="CEO Title"){
      yAxisLabel.attr("transform", "translate(" + 30 + "," + (height/2+130) + ")rotate(-90)")
      yAxisLabel.text("Number of Companies");
      xAxisLabel.text("CEO Title");
      xAxisLabel.attr("transform", "translate(" + (width/2+50) + "," + (height+355) + ")")
      tempTitle.text("CEO Title Versus Number of Companies");
    }

    xAxis.selectAll("text")
        .attr("transform", "translate(" +x+ "," + y+ ")rotate(-90)")
        .attr("text-anchor", "end");
}

//returns unique values of an array
function uniqueValues(value, index, self){
  return self.indexOf(value) === index;
}


//function gets data to make discrete graph
//calls upon function to create discrete graph
function getDataToMakeDiscreteGraph(attribute){
  d3.csv("fortune1000-final.csv", function(data){
    var tempArray = new Array(data.length);
    for (var i=0; i<data.length;i++){
      if(data[i][attribute]!= undefined){
        tempArray[i]=data[i][attribute];
      }
    }
    var countOfUnique =-1;
    //filtered out the unique values
    var unique = tempArray.filter(uniqueValues);
    for(var j=0; j<data.length;j++){
          if(unique[j]==undefined){
            break;
          }
          countOfUnique++;
    }
    //to get rid of undefined values
    var uniqueXValues = new Array(countOfUnique);
    var count =0;
    for(var i=0; i<countOfUnique; i++){
      //to remove words with initials
      if((unique[i]=="Puerto Rico")&&(count==0)){
        uniqueXValues[i] = "PR";
      } else if((unique[i+1]=="Puerto Rico")&&(count==1)){
        uniqueXValues[i] = "PR";
      }else if(unique[i]=="Michigan"){ //there were 2 forms of michigan
        count =1;
        console.log("michigan found")
        uniqueXValues[i]= unique[i+1];
      } else if (count==0){
        uniqueXValues[i] = unique[i];
      } else if(count ==1) {
        uniqueXValues[i]= unique[i+1];
      }
    }


    //count how many of each unique value there is
    var numberOfCompaniesForUnique = new Float32Array(countOfUnique);
    //initialize array at 0
    for(var i=0; i<countOfUnique; i++){
      numberOfCompaniesForUnique[i]=0;
    }

    //count number of states for each Region
    //Michigan and puerto rico were not written in initials
    for (var i=0; i<data.length; i++){
      for(var j=0; j<countOfUnique;j++){
        if(data[i][attribute]==uniqueXValues[j]){
          numberOfCompaniesForUnique[j]++;
        }else if((data[i][attribute]=="Michigan")&&(uniqueXValues[j]=="MI")){
          numberOfCompaniesForUnique[j]++;
        } else if((data[i][attribute]=="Puerto Rico")&&(uniqueXValues[j]=="PR")){
          numberOfCompaniesForUnique[j]++;
        }
      }
    }



    createDiscreteGraph(attribute, uniqueXValues, numberOfCompaniesForUnique, countOfUnique);

  })
}

//function to break each state into its respective Regions
//calls createDiscreteGraph to create corresponding graph
function getDataToMakeDiscreteRegionGraph(attribute){
  d3.csv("fortune1000-final.csv", function(data){
    //initials of each state associated with each region
    var northEastStates = ["ME", "MA", "RI", "CT", "NH", "VT", "NY", "PA", "NJ", "DE", "MD"];
    var southEastStates = ["WV", "VA", "KY", "TN", "NC", "SC", "GA", "AL", "MS", "AR", "LA", "FL"]
    var midWestStates = ["OH", "IN", "MI", "IL", "MO", "WI", "MN", "IA", "KS", "NE", "SD", "ND", "Michigan"];
    var southWestStates = ["TX", "OK", "NM", "AZ"];
    var westStates = ["CO", "WY", "MT", "ID", "WA", "OR", "UT", "NV", "CA", "AK", "HI"];

    var uniqueXValues = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];
    var countOfUnique = 5;

    //initializes number of companies for each location to 0
    var numberOfCompaniesForUnique = new Array(5);
    for(var i=0; i<5;i++){
      numberOfCompaniesForUnique[i] =0;
    }

    for (var i=0; i<data.length; i++){
      //assign each state to its respective Region
      if(northEastStates.indexOf(data[i]["State"])==0){
        numberOfCompaniesForUnique[0]++;
      } else if(southEastStates.indexOf(data[i]["State"])==0){
        numberOfCompaniesForUnique[1]++;
      } else if(midWestStates.indexOf(data[i]["State"])==0){
        numberOfCompaniesForUnique[2]++;
      } else if (southWestStates.indexOf(data[i]["State"])==0){
        numberOfCompaniesForUnique[3]++;
      } else if(westStates.indexOf(data[i]["State"])==0){
        numberOfCompaniesForUnique[4]++;
      }
    }

    createDiscreteGraph(attribute, uniqueXValues, numberOfCompaniesForUnique, countOfUnique);

})

}

//function to calculate data for continuous graph
function getDataToMakeContinuousGraph(attribute){
  var max=-1000000000.0;
  var min =1000000000.0;

  var arrayOfData; //index is rank

  d3.csv("fortune1000-final.csv", function(data){
    var tempArrayOfData = new Float32Array(data.length);
    for(var i=0; i<data.length; i++){
      var attribute_data;
      var attribute_data_Float;
      //gets the attribute data for each company
      if(attribute!="Improved Rank"){
        attribute_data = data[i][attribute].replace("%", "").replace("$", "").replace(",", "");
        attribute_data_Float = parseFloat(attribute_data);
      } else{
        //if it is improved rank --> needs to be calculated differently
        var prevRank = data[i]["Previous Rank"].replace("%", "").replace("$", "").replace(",", "");
        var currentRank =data[i]["rank"].replace("%", "").replace("$", "").replace(",", "");
        attribute_data = prevRank - currentRank;
        attribute_data_Float = parseFloat(attribute_data);
      }

      //find max and min
      if((attribute_data_Float>max)&&(!isNaN(attribute_data_Float))){
        max = attribute_data_Float;
      }
      if((attribute_data_Float<min)&&(!isNaN(attribute_data_Float))){
        min = attribute_data_Float;

      }
      tempArrayOfData[i] = attribute_data_Float;

    }
    max = Math.ceil(max);
    min = Math.floor(min);


    //array that holds soley the values
    var arrayOfData = new Float32Array(numberOfBoxes);
    for(var i=0; i<numberOfBoxes;i++){
      arrayOfData[i] =0;
    }

    var maxAndMinDif = max -min;
    var widthOfEachBin = (max - min)/numberOfBoxes;

    //count how many instances in each group
    for(var i=0; i<data.length; i++){
      if(!isNaN(tempArrayOfData[i])){
        for(var j=1; j<=numberOfBoxes; j++){
          var temp = (min+(j*widthOfEachBin));
          if(tempArrayOfData[i]<=(min+(j*widthOfEachBin))){
            arrayOfData[j-1] = arrayOfData[j-1]+1;
            break;
          }
        }
      }
    }


    createContinuousGraph(attribute, arrayOfData, min, max);


  })

}



//function to get data over profit data
function getDataForProfitOverRevenue(){
  var max=-1000000000.0;
  var min =1000000000.0;
  currentGraphAttribute = "Profit Over Revenue";

  var arrayOfData; //index is rank

  d3.csv("fortune1000-final.csv", function(data){
    var tempArrayOfData = new Float32Array(data.length);
    for(var i=0; i<data.length; i++){
      //get data for profits and revenues
      var profit_data = data[i]["Profits ($M)"].replace("%", "").replace("$", "").replace(",", "");
      var profit_data_Float = parseFloat(profit_data);
      var revenue_data = data[i]["Revenues ($M)"].replace("%", "").replace("$", "").replace(",", "");
      var revenue_data_Float = parseFloat(revenue_data);

      var profitOverRevenue = parseFloat(profit_data_Float/revenue_data_Float);
          console.log("is not nan");
            tempArrayOfData[i] = parseFloat(profit_data_Float/revenue_data_Float)



      //min and max values
      if((profitOverRevenue>max)&&(!isNaN(profitOverRevenue))){
        max = tempArrayOfData[i];
      }
      if((profitOverRevenue<min)&&(!isNaN(profitOverRevenue))){
        min = tempArrayOfData[i];
      }

    }



  max = parseFloat(max);
  min = Math.floor(min);

  //holds the profit/revenue data for each company
  var arrayOfData = new Float32Array(numberOfBoxes);
  for(var i=0; i<numberOfBoxes;i++){
    arrayOfData[i] =0;
  }

  var maxAndMinDif = max -min;
  var widthOfEachBin = (max - min)/numberOfBoxes;

  //count how many instances in each group
  for (var i =0; i<data.length; i++){
    if(!isNaN(tempArrayOfData[i])){
      for(var j=1;j<=numberOfBoxes;j++){
              if(tempArrayOfData[i]<=(min+(j*widthOfEachBin))){
                arrayOfData[j-1] = arrayOfData[j-1]+1;
                break;
              }
      }
    }
  }


  createContinuousGraph("Profit Over Revenue", arrayOfData, min, max);

}
)
}


function mySliderFunction(){
  //this function changes the number of boxes and recompiles the graph accordingly
  var numberOfBoxesInput = document.getElementById("mySlider").value;
  numberOfBoxes = numberOfBoxesInput;
  if(currentGraphAttribute!="Profit Over Revenue"){
    getDataToMakeContinuousGraph(currentGraphAttribute);
  } else{
    getDataForProfitOverRevenue();
  }

}


function getDataToMakeDiscreteCityGraph(attribute){
  d3.csv("fortune1000-final.csv", function(data){
    var tempArray = new Array(data.length);
    for (var i=0; i<data.length;i++){
      if(data[i][attribute]!= undefined){
        tempArray[i]=data[i][attribute];
        console.log("temp Array of data:      " + tempArray[i]);
      }
    }
    var countOfUnique =-1;
    //filtered out the unique values
    var unique = tempArray.filter(uniqueValues);
    for(var j=0; j<data.length;j++){
          console.log("UNIQUE        " + unique[j]);
          if(unique[j]==undefined){
            break;
          }
          countOfUnique++;
    }

    var tempNumberOfCompanies4Unique = new Array(countOfUnique);
    for(var i=0; i<countOfUnique; i++){
      tempNumberOfCompanies4Unique[i] =0;
    }


    for(var i=0; i<data.length; i++){
      //count how many there are of each group
      for(var j=0; j<countOfUnique; j++){
        if(data[i][attribute]==unique[j]){
          tempNumberOfCompanies4Unique[j]++;
          console.log("in here    " + tempNumberOfCompanies4Unique[j]);
        }
      }
    }

    for (var i = 0; i<countOfUnique; i++){
      console.log("number of uniqueValues   " + tempNumberOfCompanies4Unique[i]);
    }

    var newCount =0; //new number of unique
    var valueOfMin = 3;

    for(var i=0; i<countOfUnique; i++){
      //filters out city with too few elements
      if(tempNumberOfCompanies4Unique[i]>valueOfMin){
        newCount++;
      }
    }

    var newUniqueX = new Array(newCount);
    var numberOfCompaniesForUnique = new Array(newCount);

    var indexValue = 0;

    //makes a new xAxis with values accordingly
    for(var i=0; i<countOfUnique; i++){
      if(tempNumberOfCompanies4Unique[i]>valueOfMin){
        newUniqueX[indexValue] = unique[i];
        //console.log("unique i values      " + unique[i]);
        numberOfCompaniesForUnique[indexValue] = tempNumberOfCompanies4Unique[i];
        indexValue ++;
      }
    }

    for(var i=0; i<newCount; i++){
      console.log("New x value        " + newUniqueX);
    }

    createDiscreteGraph(attribute, newUniqueX, numberOfCompaniesForUnique, newCount);

  })
}
