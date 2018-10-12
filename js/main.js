
// create a network
var container = document.getElementById('mynetwork');
 
// var data = generate_graph_data(6, 12);
var data = default_graph_data();
var options = {
  layout: {
    improvedLayout:true,
    hierarchical: {
      enabled: false,
      nodeSpacing: 300,
    //   direction: 'LR',
    }
  },
  physics: {
    stabilization: {
      // onlyDynamicEdges: true,
      fit: true,
    }
  }
  // physics: false,
};
var network = new vis.Network(container, data, options);

var new_flow;

for(i = 0; i < data.edges.length; i++){
    new_flow = Math.random() * 10 | 0;
    data.edges[i].label = setFlow(data.edges[i].label, new_flow);
    // console.log("edge " + i + " new flow: " + data.edges[i].label);
}

console.log(data.edges);
network.setData(data);

