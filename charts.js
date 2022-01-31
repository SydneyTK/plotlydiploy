function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var resultSample = resultSampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = resultSample.otu_ids;
    var otuLabels = resultSample.otu_labels;
    var sampleValues= resultSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuId.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var trace ={
      y: yticks,
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };
    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
          
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // Deliverable 2- below creates the bubble chart, using same variables as found above with d3 call 
    // 1. Create the trace for the bubble chart.
    var trace2 ={
      y: sampleValues,
      x: otuId,
      text: otuLabels,
      mode:"markers", 
      marker: {
        color:otuId,
        size: sampleValues,
        colorscale: "Earth"
      },
    };
    var bubbleData = [trace2];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      xaxis: {title: "OTU ID"}, 
      hovermode: "closest", 
      margin: { t: 30}
        };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata;
       
    // Create a variable that holds the first sample in the array.
    var resultMetaArray = metaData.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var resultMeta = resultMetaArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washing= resultMeta.wfreq;
    var washingFloat=parseFloat(washing);
    
    // 4. Create the trace for the gauge chart.
    var trace3 =[{
      domain: {x:[0,1], y:[0,1]},
      value: washingFloat,
      title: {text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number"
    }];
    //var gaugeData = [trace3];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 }
        };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", trace3, gaugeLayout);
  });
  
}

 