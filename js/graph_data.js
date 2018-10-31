var animationSteps = [];
var nodes = [], edges = [];
var N = 8, E = 13;

function defaultGraphData(){
    N = 5;
    var nodes = [
        {id: 0, label: 'S', x: -300, y: 0, physics: false},
        {id: 1, label: 'n1', x: -150, y: -140, physics: false},
        {id: 2, label: 'n2', x: 130, y: -130, physics: false},
        {id: 3, label: 'n3', x: -150, y: 130, physics: false},
        {id: 4, label: 'n4', x: 150, y: 140, physics: false},
        {id: 5, label: 'T', x: 300, y: 0, physics: false}
    ];

    var edges = [
        { id: 0, label: '0/2', from: 0, to: 1, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 1, label: '0/4', from: 0, to: 3, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 2, label: '0/1', from: 1, to: 2, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 3, label: '0/3', from: 1, to: 4, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 4, label: '0/3', from: 3, to: 2, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 5, label: '0/1', from: 3, to: 4, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 6, label: '0/1', from: 4, to: 3, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 7, label: '0/2', from: 2, to: 5, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },{ id: 8, label: '0/4', from: 4, to: 5, color: {color: '#41f447'},
            arrows: { to : {enabled: true}},
        },
    ];
    var graphData = {
        nodes: nodes,
        edges: edges,
    }
    return graphData;
}

function findDuplicateEdges(edges, from, to){
    var i;
    for(i = 0; i < edges.length; i++){
        if((edges[i].from == from) && (edges[i].to == to)){
            return 1;
        }
    }
    return -1;
}

function generateGraphData(N, E){
    var   i,
        edge_id = 0,
        nodes = [],
        edges = [],
        nodesToSink = [],
        leftNodes = [];

    /* initialise nodes */
    nodes.push(
        {id: 0, label: 'S',
            x: -250, // y: Math.random() * 220 + 180,
            physics: false},
    );

    for(i = 1; i < N; i++){
        nodes.push({
            id: i,
            label: 'n' + i,
            physics: false,
        });
    }
    nodesToSink.push(N);
    var rand_id, from, to;
    // console.log("constructing network backwards from T");
    for(i = N - 1; i > 0; i--){ // go backwards to do S last

        if(i > N-3){
        // console.log("from: " + i);
        // console.log("to: " + N);
          edges.push({
              id: edge_id++,
              arrows: {to : {enabled: true}},
              label: 0 + '/' + (Math.random() * 10 | 1),
              from: i,
              to: N,
              color: {color: '#41f447'},
          });
        } else {
          do{
              rand_id = (Math.random() * nodesToSink.length | 0);
          } while (i == nodesToSink[rand_id]);

        //   console.log("from: " + i);
        //   console.log("to: " + nodesToSink[rand_id]);

          // connect node to node in nodesToSink or T
          edges.push({
              id: edge_id++,
              arrows: {to : {enabled: true}},
              label: 0 + '/' + (Math.random() * 10 | 1),
              from: i,
              to: nodesToSink[rand_id],
              color: {color: '#41f447'},
          });
        }
        // add 'from' node to leftNodes
        leftNodes.push(i);
        // if 'to' not != T remove it from leftNodes
        if((nodesToSink[rand_id] != N) && (leftNodes.indexOf(nodesToSink[rand_id]) != -1)){
            leftNodes.splice(leftNodes.indexOf(nodesToSink[rand_id]), 1);
        }
        // add node to nodesToSink
        nodesToSink.push(i);
        // console.log("leftNodes: " + leftNodes);
        // console.log("nodesToSink: " + nodesToSink);
    }

    // console.log("Connecting left nodes");
    while(leftNodes.length > 0){
        if(edge_id == E){break;}
        if(i < 2){
            // console.log("from: " + 0);
            // console.log("to: " + leftNodes[i]);
            edges.push({
                id: edge_id++,
                arrows: {to: { enabled: true }},
                label: 0 + '/' + (Math.random() * 10 | 1),
                from: 0,
                to: leftNodes[i],
                color: {color: '#41f447'},
            });
        } else {
            do {
                from = (Math.random() * N | 0);
            } while (leftNodes[i] == from);

            // console.log("from: " + from);
            // console.log("to: " + leftNodes[i]);
            edges.push({
                id: edge_id++,
                arrows: {to: { enabled: true }},
                label: 0 + '/' + (Math.random() * 10 | 1),
                from: from,
                to: leftNodes[i],
                color: {color: '#41f447'},
            });


        }
        leftNodes.splice(i, 1);
        // console.log("leftNodes: " + leftNodes);
    }

    // console.log("add remaining edges");
    // add remaining edges
    for (i = edge_id; i < E; i++){
        do {
            from = (Math.random() * N | 0);
            // console.log("from: "+ from);
            to = (Math.random() * N + 1 | 0);
            // console.log("to: "+ to);
        }
        while ((from == to) || (findDuplicateEdges(edges, from, to) == 1)); // there exists an edge with from == from and to == to
        edges.push({
            id: edge_id++,
            arrows: {to : {enabled: true}},
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: from,
            to: to,
            color: {color: '#41f447'},
        });
    }

    nodes.push({
        id: N, label: 'T',
        x: 300, // y: Math.random() * 220 + 180,
        physics: false
    });

    // console.log(nodes);
    // console.log(edges);
    var graphData = {
        nodes: nodes,
        edges: edges
    };
    return graphData;
}


function getConnectedNodes(data, nodeId, direction) {
    var nodeList = [];
    if (data.nodes[nodeId] !== undefined) {
      var node = data.nodes[nodeId];
      var nodeObj = {}; // used to quickly check if node already exists
      for (var i = 0; i < data.edges.length; i++) {
        var edge = data.edges[i];
        if (direction !== 'to' && edge.to == node.id) {
          // these are double equals since ids can be numeric or string
          if (nodeObj[edge.from] === undefined) {
            nodeList.push(edge.from);
            nodeObj[edge.from] = true;
          }
        } else if (direction !== 'from' && edge.from == node.id) {
          // these are double equals since ids can be numeric or string
          if (nodeObj[edge.to] === undefined) {
            nodeList.push(edge.to);
            nodeObj[edge.to] = true;
          }
        }
      }
    }
    return nodeList;
}

/*
Takes 2 node ids and finds the id of the edge between them and its direction
direction 0 if backwards, 1 if forwards
*/

function findEdgeID(data, node1, node2){
    var edge;
    var edgeData = {};
    for (var i = 0; i < data.edges.length; i++){
        edge = data.edges[i];
        if((edge.from == node1) && (edge.to == node2)){
            edgeData = {id: edge.id, direction: 1}
            return edgeData;
        }
        if((edge.from == node2) && (edge.to == node1)){
            edgeData = {id: edge.id, direction: 0}
            return edgeData;
        }
    }
}
