/*****************************************************************************

  File for generating data to populate graphs with

  Variables:
    nodes:    array to temporarily store nodes
    edges:    array to temporarily store edges

    topNodes: vis DataSet representing the nodes in the top graph
    topEdges: vis DataSet representing the edges in the top graph
    topData:  combination of top graph nodes and edges

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

var nodes, edges, topNodes, topEdges, resEdges;
var algTopEdges, algResEdges;
var topData, resData, algTopData, algResData;
var N, E;
var T;
var resAdjMatrix = [], topAdjMatrix = [];

function newGraphOptions() {
    document.getElementById("newGraphOptions").classList.toggle("show");
}

/*
Generates a graph with default valuse
*/
function defaultGraphData(){
    console.log("default graph data");
    N = 6;
    T = N-1;
    nodes = [
        {id: 0, label: 'S', x: -300, y: 0, physics: false},
        {id: 1, label: 'n1', x: -150, y: -140, physics: false},
        {id: 2, label: 'n2', x: 130, y: -130, physics: false},
        {id: 3, label: 'n3', x: -150, y: 130, physics: false},
        {id: 4, label: 'n4', x: 150, y: 140, physics: false},
        {id: 5, label: 'T', x: 300, y: 0, physics: false}
    ];

    edges = [
        { id: 0, label: '0/2', from: 0, to: 1,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 1, label: '0/4', from: 0, to: 3,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 2, label: '0/1', from: 1, to: 2,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 3, label: '0/3', from: 1, to: 4,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 4, label: '0/3', from: 3, to: 2,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 5, label: '0/1', from: 3, to: 4,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 6, label: '0/1', from: 4, to: 3,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 7, label: '0/2', from: 2, to: 5,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },{ id: 8, label: '0/4', from: 4, to: 5,
            color: {color: 'blue'},
            arrows: { to : {enabled: true}},
        },
    ];

    // Adjacency matrix initialising
    initialiseDataSets(nodes, edges);
    initialiseMatrices();
    for(var i = 0; i < edges.length; i++){
      var from = edges[i].from, to = edges[i].to;
      topAdjMatrix[from][to] = edges[i].id;
    }
}

function initialiseMatrices(){
  for(var y = 0; y < N; y++){
    topAdjMatrix[y] = [];
    resAdjMatrix[y] = [];
    for(var x = 0; x < N; x++){
      topAdjMatrix[y][x] = null;
      resAdjMatrix[y][x] = null;
    }
  }
}

function initialiseDataSets(nodes, edges){
  topNodes = new vis.DataSet(nodes);
  topEdges = new vis.DataSet(edges);
  algTopEdges = new vis.DataSet(edges);

  topData = {nodes: topNodes, edges: topEdges};
  algTopData = {nodes: topNodes, edges: algTopEdges};

  resEdges = new vis.DataSet([]);
  algResEdges = new vis.DataSet([]);

  resData = { nodes: topNodes, edges: resEdges};
  algResData = {nodes: topNodes, edges: algResEdges};
}

/*
Given a set of edges and an id of the nodes 'from' and 'to', returns 1 if there
is already an edge with these nodes and -1 if there is not
*/
function findDuplicateEdges(edges, from, to){
  if(topAdjMatrix[from][to] != null) return 1;
    return -1;
}

function addEdge(edges, id, from, to){
  edges.push({
      id: id,
      color: {color: 'blue'},
      arrows: {to : {enabled: true}},
      label: 0 + '/' + (Math.random() * 10 | 1),
      from: from,
      to: to,
  });
  topAdjMatrix[from][to] = id;
  return edges;
}

function addNode(nodes, id, label){
  nodes.push({
    id: id,
    label: label,
    physics: false,
  });
  return nodes;
}

/*
Generates a graph using N and E, such that:
    - There is a source node S and a sink node T
    - S is the leftmost node and T is the rightmost
    - There are no loops or dead ends (all nodes are on a path from S to T)
*/
function generateGraphData(){
    N = document.getElementById("N").value;
    E = N*2 - 3;
    T = N-1;
    initialiseMatrices();
    console.log("generating graph data");
    var i,
        edgeID = 0,
        nodesToSink = [], //  Nodes that are connected to T (or T itself)
        onlyOutgoing = [];   //  Nodes that are in nodesToSink but have no incoming edges
    nodes = [];
    edges = [];

    /* initialise nodes */
    nodes = addNode(nodes, 0, 'S');
    for(i = 1; i < T; i++) nodes = addNode(nodes, i, 'n' + i);

    nodesToSink.push(T);
    var rand_id, from, to;

    /* Construct graph from right to left, beginning at T */
    for(i = T - 1; i > 0; i--){
        if(i > T-3){    // To ensure that T has at least 2 incoming edges
          edges = addEdge(edges, edgeID, i, T);
        } else {
          // Connect to either T or one of the nodes already connected to T
          do rand_id = (Math.random() * nodesToSink.length | 0); while (i == nodesToSink[rand_id]);
          edges = addEdge(edges, edgeID, i, nodesToSink[rand_id]);
        }
        edgeID++;

        onlyOutgoing.push(i);    // add 'from' node to onlyOutgoing
        if((nodesToSink[rand_id] != T) && (onlyOutgoing.indexOf(nodesToSink[rand_id]) != -1)){
            // if 'to' not != T remove it from onlyOutgoing
            onlyOutgoing.splice(onlyOutgoing.indexOf(nodesToSink[rand_id]), 1);
        }
        nodesToSink.push(i);  // add node to nodesToSink
    }

    /* Ensure that all nodes in onlyOutgoing have an incoming edge from S */
    while(onlyOutgoing.length > 0){
        if(edgeID == E) break;
        if(i < 2){
            // To ensure that S has at least 2 outgoing edges
            edges = addEdge(edges, edgeID, 0, onlyOutgoing[i]);
        } else {
            do from = (Math.random() * T | 0); while (onlyOutgoing[i] == from);
            edges = addEdge(edges, edgeID, from, onlyOutgoing[i]);

        }
        edgeID++;
        onlyOutgoing.splice(i, 1);
    }

    // Once all nodes are connected, add remaining edges
    for (i = edgeID; i < E; i++){
        do {  // prevents loops and duplicate parallel edges
              from = (Math.random() * T | 0);
              to = (Math.random() * N | 0);
        } while ((from == to) || (findDuplicateEdges(edges, from, to) == 1));
        edges = addEdge(edges, edgeID, from, to);
        edgeID++;
    }
    nodes = addNode(nodes, T, 'T');
    initialiseDataSets(nodes, edges);
    topNodes.update([{id:0, x: -250},{id:T, x:300}]);
}

/*
Given a node id and a direction:

direction = 'to' - returns array of nodeIds that node connects to
direction = 'from' - returns array of nodeIds that connect to node

*/
function getConnectedNodes(data, nodeId, direction) {
    // console.log("getting connected nodes");
    var nodeList = [], matrix;
    if (data == "res") matrix = resAdjMatrix; else matrix = topAdjMatrix;
    if (direction == 'from') {
      var fromList = matrix[nodeId];
      for(var i = 0; i < fromList.length; i++) if (fromList[i] != null) nodeList.push(i);
    }
    else if (direction == 'to') {
      var toList = matrix[nodeId];
      for(var i = 0; i < toList.length; i++) if (toList[i] != null) nodeList.push(i);
    }
    return nodeList;
}


/*
Takes 2 node ids and finds the id of the edge between them and its direction
direction 0 if backwards, 1 if forwards
*/
function findEdgeID(data, node1, node2){
    var edge, edgeData = {}, matrix;
    if(data == "res") matrix = resAdjMatrix; else matrix = topAdjMatrix;
    if(matrix[node1][node2] != null){
      edgeData = {id: matrix[node1][node2], direction: 1}
    } else if (matrix[node2][node1] != null){
      edgeData = {id: matrix[node2][node1], direction: 0}
    }
    return edgeData;
}
