/*****************************************************************************

  File for generating data to populate graphs with

  Variables:
    nodes:    array to temporarily store nodes
    edges:    array to temporarily store edges

    topNodes: vis DataSet representing the nodes in the top and residual graph
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

    (300)      getEdgeData(data, node1, node2)

******************************************************************************/

var nodes, edges, topNodes, topEdges, resEdges;
var algTopEdges, algResEdges;
var topData, resData, algTopData, algResData;
var N, E, T;
var resAdjMatrix = [], topAdjMatrix = [];
var TOP = 0, RES = 1;
var newNodeID, newEdgeID, edgeID;


function getMatrix(data){
    if (data == RES) return resAdjMatrix; else if (data == TOP) return topAdjMatrix; else return data;
}

/*
Given a set of edges and an id of the nodes 'from' and 'to', returns 1 if there
is already an edge with these nodes and -1 if there is not
*/
function findDuplicateEdges(data, from, to){
    var matrix = getMatrix(data);
    if(matrix[from][to] != null) return 1;
    return -1;
}

function addEdge(localEdges, id, from, to, cap){
    if(cap == null) cap = Math.random() * 10 | 1;
    localEdges.push({
        id, color: {color: '#0097A7'}, arrows: {to : {enabled: true}},
        font: {strokeWidth: 5}, chosen: false, width: 3, label: 0 + '/' + cap, from, to,
        arrowStrikethrough: false,
    });
    if(((from != -1) || (to != -1)) && (!options.manipulation.enabled)) topAdjMatrix[from][to] = id;
    return localEdges;
}

function addNode(localNodes, id, label, x, y){
    var color = {background: '#00BCD4', border: '#00BCD4',
                highlight: { background :'#757575', border: '#212121'},
                hover: { background :'#757575', border: '#212121'}
    },
    font = {color: '#ffffff'};
    if(x == null && y == null){
        localNodes.push({
            id, label, physics: false, color, font
        });
    } else {
      localNodes.push({
          id, label, x, y, physics: false, color, font
      });
    }
    return localNodes;
}

function connectNodesToSink(edges) {
    var nodesToSink = [], //  Nodes that are connected to T (or T itself)
        onlyOutgoing = [],  //  Nodes that are in nodesToSink but have no incoming edges
        rand_id;

    nodesToSink.push(T);

    /* Construct graph from right to left, beginning at T */
    for(i = T - 1; i > 0; i--){
        if(i > T-3){    // To ensure that T has at least 2 incoming edges
          edges = addEdge(edges, newEdgeID, i, T, null);
        } else {
          // Connect to either T or one of the nodes already connected to T
          do rand_id = (Math.random() * nodesToSink.length | 0); while (i == nodesToSink[rand_id]);
          edges = addEdge(edges, newEdgeID, i, nodesToSink[rand_id], null);
        }
        newEdgeID++;

        onlyOutgoing.push(i);    // add 'from' node to onlyOutgoing
        if((nodesToSink[rand_id] != T) && (onlyOutgoing.indexOf(nodesToSink[rand_id]) != -1)){
            // if 'to' not != T remove it from onlyOutgoing
            onlyOutgoing.splice(onlyOutgoing.indexOf(nodesToSink[rand_id]), 1);
        }
        nodesToSink.push(i);  // add node to nodesToSink
    }
    return onlyOutgoing;
}

function connectNodesFromSource(edges, onlyOutgoing){
    var from;
    while(onlyOutgoing.length > 0){
        if(newEdgeID == E) break;
        if(i < 2){
            // To ensure that S has at least 2 outgoing edges
            edges = addEdge(edges, newEdgeID, 0, onlyOutgoing[i], null);
        } else {
            do from = (Math.random() * T | 0); while (onlyOutgoing[i] == from);
            edges = addEdge(edges, newEdgeID, from, onlyOutgoing[i], null);

        }
        newEdgeID++;
        onlyOutgoing.splice(i, 1);
    }
}

function addRemainingEdges(edges, E){
    for (i = newEdgeID; i < E; i++){
        do {  // prevents loops and duplicate parallel edges
            from = (Math.random() * T | 0); to = (Math.random() * N | 1);
        } while ((from == to) || (findDuplicateEdges(TOP, from, to) == 1));
        edges = addEdge(edges, newEdgeID, from, to, null);
        newEdgeID++;
    }
}

function reverseEdgeIDs(edges){
    var revEdges = [], j = 0;
    for(i = newEdgeID-1; i >= 0; i--){
        revEdges = addEdge(revEdges, j, edges[i].from, edges[i].to, getCapacity(edges[i].label));
        j++;
    }
    return revEdges;
}

function downloadGraphAsTxt(filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(createTxtFileFromGraph()));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function createTxtFileFromGraph(){
    var NODES = 0, EDGES = 1;
    return "{\n\"nodes\" : [" + constructJsonArray(NODES)
            + "\n],\n\"edges\" : [" + constructJsonArray(EDGES)
            + "\n]\n}";
}

function constructJsonArray(type) {
    var text = "", array, i;
    if(type == 0) array = topNodes; else if (type == 1) array = topEdges;
    for (i = 0; i < array.length; i++){
        text += constructJsonObject(array.get(i), i, type);
        if(i < array.length -1) text += ",";
    }
    return text;
}

function constructJsonObject(data, id, type){
    if(type == 0){
        return "\n{ \"id\": " + id + ", \"x\": " + data.x + ", \"y\": " + data.y + "}";
    } else if(type == 1) {
        return "\n{ \"from\": " + data.from + ", \"to\": "
            + data.to + ", \"capacity\": " + getCapacity(data.label) + "}";
    }
}


/*
Given a node id and a direction:

direction = 'to' - returns array of nodeIds that node connects to
direction = 'from' - returns array of nodeIds that connect to node

*/
function getConnectedNodes(data, nodeID, direction) {
    // console.log("getting connected nodes");
    var nodeList = [], tfList = [], matrix = getMatrix(data);
    if (direction == 'to'){
        tfList = matrix[nodeID];
    } else if (direction == 'from') {
        tfList = getFromList(matrix);
    }
    for(var i = 0; i < tfList.length; i++) if (tfList[i] != null) nodeList.push(i);
    return nodeList;
}

function getFromList(matrix, nodeID){
    var toList = [];
    for(var i = 0; i < N; i++){
        toList.push(matrix[i][nodeID]);
    }
    return toList;
}


/*
Takes 2 node ids and finds the id of the edge between them and its direction
direction 0 if backwards, 1 if forwards
*/
function getEdgeData(data, from, to){
    var edgeData = {}, matrix = getMatrix(data);
    // console.log(matrix);
    var resEdge = algResEdges.get(resAdjMatrix[from][to]);
    // console.log(resEdge.backwards);
    if(resEdge.backwards == null){
      edgeData = {id: matrix[from][to], direction: 1}
    } else if (resEdge.backwards){
      edgeData = {id: matrix[to][from], direction: 0}
    }
    return edgeData;
}

function isBetween(comp, lower, upper){
    if((comp >= lower) && (comp < upper)) return true; else return false;
}

function checkValidGraph(fileNodes, fileEdges){
    var nl = fileNodes.length, el = fileEdges.length;

    if(!checkNodesAndEdgesExist(nl, el)) return false;
    if(!checkNodeIdsConsecutive(fileNodes)) return false;

    var edge, invalidEdges = [], i;

    var testMatrix = [];
    for(var y = 0; y < nl; y++){
        testMatrix[y] = [];
        for(var x = 0; x < nl; x++){
          testMatrix[y][x] = null;
        }
    }

    for(i = 0; i < el; i++) {
        edge = fileEdges[i];
        if(!(isBetween(edge.to, 0, nl)) || !(isBetween(edge.from, 0, nl))) {
            invalidEdges.push({id:i, problem: " is going to or from a node that doesn't exist!"});
        }
        if(edge.to == edge.from) invalidEdges.push({id:i, problem: " is going to and from the same node!"});
        if(edge.capacity <= 0) invalidEdges.push({id: i, problem: " must have a capacity greater than 0!"});

        if(findDuplicateEdges(testMatrix, edge.from, edge.to) == 1) {
            invalidEdges.push({id: i, problem: " is a duplicate edge!"});
        }
        testMatrix[edge.from][edge.to] = i;
    }
    if(invalidEdges.length > 0) {
        var errorMsg = "Invalid edges!\n";
        for (i in invalidEdges){
            errorMsg += "edge " + (invalidEdges[i].id + 1).toString() + invalidEdges[i].problem + "\n";
        }
        alert(errorMsg);
        return false;
    }
    return true;
}

function checkNodesAndEdgesExist(n, e){
    if((n == 0) && (e == 0)) {
        alert("no nodes or edges in file!");
        return false;
    } else if (e == 0) {
        alert("no edges in file!");
        return false;
    } else if (n == 0) {
        alert("no nodes in file!");
        return false;
    } else {
        return true;
    }
}

function checkNodeIdsConsecutive(nodes){
    for(var i = 0; i < nodes.length; i++) if (nodes[i].id != i) return false;
    return true;
}

function drawAddNode(data, callback) {
  data.id = newNodeID, data.label = "n" + newNodeID, data.physics = false;
  data.color = {
      background: '#00BCD4', border: '#00BCD4',
      highlight: { background :'#757575', border: '#212121'},
      hover: { background :'#757575', border: '#212121'}
  };
  data.font = { color: '#ffffff'};
  callback(data);
  nodes = addNode(nodes, newNodeID, data.label, data.x, data.y);
  newNodeID++;
}

function drawAddEdge(data, capacity, callback){
  data.id = newEdgeID, data.arrows = {to: {enabled: true}}, data.font = {strokeWidth: 5};
  data.width = 3, data.arrowStrikethrough = false;
  data.label = 0 + '/' + capacity;
  edges = addEdge(edges, newEdgeID, data.from, data.to, capacity);
  topEdges.update(edges);
  newEdgeID++;
  callback(data);
}

function drawDeleteNode(data, callback){
  var nodeIds = data.nodes, i;
  nodes.splice(nodeIds[0] + 1, 1);
  topNodes.remove(nodeIds[0]);
  for(i = nodeIds[0] + 1; i < nodes.length; i++){
      nodes[i].id = i - 1;
      nodes[i].label = "n" + (i-1);
      updateEdgesToFrom(i);
      topNodes.remove(i);
  }
  newNodeID--;
  drawDeleteEdge(data);
  topNodes.update(nodes);
  callback(data);
}

function drawDeleteEdge(data) {
    var  edgeIds = data.edges, i, victim;
    while(edgeIds.length > 0){
      victim = edgeIds.pop();
      for(i = victim + 1; i < edges.length; i++){
        edges[i].id = edges[i].id-1;
        topEdges.remove(i);
      }
      edges.splice(victim, 1);
      topEdges.remove(victim);
      newEdgeID--;
    }
    topEdges.update(edges);
}

function updateEdgesToFrom(node){
  var edge, i;
  for(i = 0; i < edges.length; i++){
    edge = edges[i];
    if(edge.to == node) edge.to = edge.to - 1;
    if(edge.from == node) edge.from = edge.from - 1;
  }
}

