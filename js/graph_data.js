/*****************************************************************************

  File for generating data to populate graphs with

  Variables:
    nodes:    array to temporarily store nodes
    edges:    array to temporarily store edges

    topNodes: vis DataSet representing the nodes in the top graph
    topEdges: vis DataSet representing the edges in the top graph
    topData:  combination of top graph nodes and edges

    resNodes: vis DataSet representing the nodes in the residual graph
    resEdges: vis DataSet representing the edges in the residual graph
    resData:  combination of residual graph nodes and edges

    algTopData: A copy of top data for the algorithm to run on
    algResData: A copy of the residual data for the algorithm to run on

    N:  int, number of nodes in the graph (when generated)
    E:  int, number of edges in the graph (when generated)

  Functions:

    (40)    defaultGraphData()

    (100)   findDuplicateEdges(edges, from, to)

    (110)      generateGraphData()

    (270)      getConnectedNodes(data, nodeId, direction)

    (300)      findEdgeID(data, node1, node2)

******************************************************************************/

var nodes, edges, topNodes, topEdges, resNodes, resEdges;
var algTopEdges, algResEdges;
var topData, resData, algTopData, algResData;
var N = 6, E = 10;

/*
Generates a graph with default valuse
*/
function defaultGraphData(){
    console.log("default graph data");
    N = 5;
    nodes = [
        {id: 0, label: 'S', x: -300, y: 0, physics: false},
        {id: 1, label: 'n1', x: -150, y: -140, physics: false},
        {id: 2, label: 'n2', x: 130, y: -130, physics: false},
        {id: 3, label: 'n3', x: -150, y: 130, physics: false},
        {id: 4, label: 'n4', x: 150, y: 140, physics: false},
        {id: 5, label: 'T', x: 300, y: 0, physics: false}
    ];

    topNodes = new vis.DataSet(nodes);

    edges = [
        { id: 0, label: '0/2', from: 0, to: 1,
            arrows: { to : {enabled: true}},
        },{ id: 1, label: '0/4', from: 0, to: 3,
            arrows: { to : {enabled: true}},
        },{ id: 2, label: '0/1', from: 1, to: 2,
            arrows: { to : {enabled: true}},
        },{ id: 3, label: '0/3', from: 1, to: 4,
            arrows: { to : {enabled: true}},
        },{ id: 4, label: '0/3', from: 3, to: 2,
            arrows: { to : {enabled: true}},
        },{ id: 5, label: '0/1', from: 3, to: 4,
            arrows: { to : {enabled: true}},
        },{ id: 6, label: '0/1', from: 4, to: 3,
            arrows: { to : {enabled: true}},
        },{ id: 7, label: '0/2', from: 2, to: 5,
            arrows: { to : {enabled: true}},
        },{ id: 8, label: '0/4', from: 4, to: 5,
            arrows: { to : {enabled: true}},
        },
    ];
    topEdges = new vis.DataSet(edges);
    topData = {
        nodes: topNodes,
        edges: topEdges
    };
    algTopEdges = new vis.DataSet(edges);
    algTopData = {
        nodes: topNodes,
        edges: algTopEdges
    }
    // resNodes = new vis.DataSet([]);

    resEdges = new vis.DataSet([]);
    resData = {
        nodes: topNodes,
        edges: resEdges
    };
    algResEdges = new vis.DataSet([]);
    algResData = {
        nodes: topNodes,
        edges: algResEdges
    }

}

/*
Given a set of edges and an id of the nodes 'from' and 'to', returns 1 if there
is already an edge with these nodes and -1 if there is not
*/
function findDuplicateEdges(edges, from, to){
    var i;
    for(i = 0; i < edges.length; i++){
        if((edges[i].from == from) && (edges[i].to == to)){
            return 1;
        }
    }
    return -1;
}


/*
Generates a graph using N and E, such that:
    - There is a source node S and a sink node T
    - S is the leftmost node and T is the rightmost
    - There are no loops or dead ends (all nodes are on a path from S to T)
*/
function generateGraphData(){
    console.log("generate graph data");
    var   i,
        edge_id = 0,
        nodesToSink = [], //  Nodes that are connected to T (or T itself)
        leftNodes = [];   //  Nodes that are in nodesToSink but have no incoming edges
    nodes = [];
    edges = [];
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

    // Construct graph from right to left, beginning at T
    for(i = N - 1; i > 0; i--){

        if(i > N-3){
          // To ensure that T has at least 2 incoming edges
          edges.push({
              id: edge_id++,
              arrows: {to : {enabled: true}},
              label: 0 + '/' + (Math.random() * 10 | 1),
              from: i,
              to: N,
          });
        } else {
          // Connect to either T or one of the nodes already connected to T
          do{
              rand_id = (Math.random() * nodesToSink.length | 0);
          } while (i == nodesToSink[rand_id]);
          edges.push({
              id: edge_id++,
              arrows: {to : {enabled: true}},
              label: 0 + '/' + (Math.random() * 10 | 1),
              from: i,
              to: nodesToSink[rand_id],
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
    }

    // Ensure that all nodes in leftNodes have an incoming edge from S
    while(leftNodes.length > 0){
        if(edge_id == E){break;}
        if(i < 2){
            // To ensure that S has at least 2 outgoing edges
            edges.push({
                id: edge_id++,
                arrows: {to: { enabled: true }},
                label: 0 + '/' + (Math.random() * 10 | 1),
                from: 0,
                to: leftNodes[i],
            });
        } else {
            do {
                from = (Math.random() * N | 0);
            } while (leftNodes[i] == from);

            edges.push({
                id: edge_id++,
                arrows: {to: { enabled: true }},
                label: 0 + '/' + (Math.random() * 10 | 1),
                from: from,
                to: leftNodes[i],
            });


        }
        leftNodes.splice(i, 1);
    }

    // Once all nodes are connected, add remaining edges
    for (i = edge_id; i < E; i++){
        do {
            // prevents loops and duplicate parallel edges
            from = (Math.random() * N | 0);
            to = (Math.random() * N + 1 | 0);
        }
        while ((from == to) || (findDuplicateEdges(edges, from, to) == 1));
        edges.push({
            id: edge_id++,
            arrows: {to : {enabled: true}},
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: from,
            to: to,
        });
    }

    nodes.push({
        id: N, label: 'T',
        x: 300, // y: Math.random() * 220 + 180,
        physics: false
    });

    topNodes = new vis.DataSet(nodes);
    topEdges = new vis.DataSet(edges);
    topData = {
        nodes: topNodes,
        edges: topEdges
    };

    algTopEdges = new vis.DataSet(edges);
    algTopData = {
        nodes: topNodes,
        edges: algTopEdges
    }
    // resNodes = new vis.DataSet([]);
    resEdges = new vis.DataSet([]);
    resData = {
        nodes: topNodes,
        edges: resEdges
    };
    algResEdges = new vis.DataSet([]);
    algResData = {
        nodes: topNodes,
        edges: algResEdges
    }

}

/*
Given a node id and a direction:

direction = 'to' - returns array of nodeIds that node connects to
direction = 'from' - returns array of nodeIds that connect to node
*/
function getConnectedNodes(data, nodeId, direction) {
    var nodeList = [];
    if (data.nodes.get(nodeId) !== undefined) {
      var node = data.nodes.get(nodeId);
      var nodeObj = {}; // used to quickly check if node already exists
      for (var i = 0; i < data.edges.length; i++) {
        var edge = data.edges.get(i);
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
        edge = data.edges.get(i);
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
