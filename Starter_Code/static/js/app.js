
// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata= data.metadata;

    // Filter the metadata for the object with the desired sample number
    //Are we reading the sample d
    let resultname = metadata.filter(samplenum => samplenum.id == sample);
    let result = resultname[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in result){
      panel.append("h6").text(result[key])
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesfield= data.samples;

    // Filter the samples for the object with the desired sample number
    let samplesarray = samplesfield.filter(samplenum => samplenum.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids= samplesarray[0].otu_ids;
    let otu_labels= samplesarray[0].otu_labels;
    let sample_values = samplesarray[0].sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    };
  
    //var data = [trace1];
    
    let layout = {
      title: {
        text: "Bacteria Cultures Per Sample"
      },
      showlegend: false,
      height: 600,
      width: 600
    };

    // Render the Bubble Chart
    
    Plotly.newPlot('bubble', [trace1], layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // Build a Bar Chart
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Sample Values"},
      yaxis: { title: "OTU ID"}
    };

  
    // Don't forget to slice and reverse the input data appropriately

    
    // Render the Bar Chart
   Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let samplenames= data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i =0; i<samplenames.length; i++){
      selector
        .append("option")
        .text(samplenames[i])
        .property("value", samplenames[i]);
    };

    // Get the first sample from the list
    let firstsample = samplenames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstsample);
    buildCharts(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
