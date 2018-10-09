// var nodes = new vis.DataSet([
//   {id: 0, label: 'S', x: 10, y: 50,},
//   {id: 1, label: 'a', x: 30, y: 30,},
//   {id: 2, label: 'b', x: 70, y: 30,},
//   {id: 3, label: 'c', x: 30, y: 70,},
//   {id: 4, label: 'd', x: 70, y: 70,},
//   {id: 5, label: 'T', x: 90, y: 50,}
// ]);
var   i,
      edge_id = 0,
      N = 6,
      E = 12,
      nodes = [],
      edges = [],
      nodes_to_sink = [],
      left_nodes = [];

/* initialise nodes */
nodes.push(
    {id: 0, label: 'S',
        x: -250, // y: Math.random() * 220 + 180, 
        physics: false},
    {id: N, label: 'T',
        x: 300, // y: Math.random() * 220 + 180, 
        physics: false},
);

for(i = 1; i < N; i++){
    nodes.push({
        id: i,
        label: 'n' + i,
        physics: false,
       // x: (Math.random() * 490 - 230),
    });
}
nodes_to_sink.push(N);
var rand_id, from, to;

for(i = N - 1; i >= 1; i--){ // go backwards to do S last
    rand_id = (Math.random() * nodes_to_sink.length | 0);
    // connect node to node in nodes_to_sink or T
    // console.log("from: " + i);
    // console.log("to: " + nodes_to_sink[rand_id]);
    edges.push({
        id: edge_id++,
        arrows: {
          to : {enabled: true}
        },
        label: 0 + '/' + (Math.random() * 10 | 1),
        from: i,
        to: nodes_to_sink[rand_id],
    });
    
    // add 'from' node to left_nodes
    left_nodes.push(i);
    
    // if connecting to !T remove 'to' node from left_nodes
    if((nodes_to_sink[rand_id] != N) && (left_nodes.indexOf(nodes_to_sink[rand_id]) != -1)){
        left_nodes.splice(left_nodes.indexOf(nodes_to_sink[rand_id]), 1);
    }

    // add node to nodes_to_sink
    nodes_to_sink.push(i);

    //also make node.x < T.x
}

console.log(left_nodes);

// positions = getPositions(nodes.id);
while(left_nodes.length > 2){
    
    rand_id = (Math.random() * left_nodes.length + 1 | 0);

    do {
        from = (Math.random() * N | 0);
    } while (left_nodes[rand_id] == from);
    
    // console.log("from: " + from);
    // console.log("to: " + left_nodes[rand_id]);

    edges.push({
        id: edge_id++,
        arrows: {
            to: { enabled: true }
        },
        label: 0 + '/' + (Math.random() * 10 | 1),
        from: from,
        to: left_nodes[rand_id],
    });

    left_nodes.splice(rand_id, 1);
}

// Make sure S has at least 2 outgoing nodes
for(i = 0; i < 2; i++){
    edges.push({
        id: edge_id++,
        arrows: {
            to: { enabled: true }
        },
        label: 0 + '/' + (Math.random() * 10 | 1),
        from: 0,
        to: left_nodes[i],
    });
}

// add remaining edges
for (i = edge_id; i < E; i++)
    do {
        from = (Math.random() * N | 0);
        console.log("from: "+ from);
        to = (Math.random() * N + 1 | 0);
        console.log("to: "+ to);
    }
    while (edges.includes({from:from, to:to}) && (from == to)); // there exists an edge with from == from and to == to
    edges.push({
        id: edge_id++,
        arrows: {
            to : {enabled: true}
        },
        label: 0 + '/' + (Math.random() * 10 | 1),
        from: from,
        to: to,
    });

// for (i = edge_id; i < E; i++){
//     var from = (Math.random() * N | 0), 
//         to = (Math.random() * N + 1 | 0);
  
//     do {
//         to = (Math.random() * N + 1 | 0);
//     } while(from == to);

//     edges.push({
//         id: edge_id++,
//         arrows: {
//         to : {enabled: true}
//         },
//         label: 0 + '/' + (Math.random() * 10 | 1),
//         from: from,
//         to: to,
//     });
// }

// create a network
var container = document.getElementById('mynetwork');
var data = {
  nodes: nodes,
  edges: edges
};
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

console.log(network.getPositions(nodes.id));
