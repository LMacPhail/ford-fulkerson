/*****************************************************************************

  File for generating data to populate graphs with

  Variables:
    nodes:    array to temporarily store nodes (may edit and then update DataSet)
    edges:    array to temporarily store edges

    topNodes: vis DataSet representing the nodes in the top and residual graph
    topEdges: vis DataSet representing the edges in the top graph
    topData:  combination of top graph nodes and edges

    resEdges: vis DataSet representing the edges in the residual graph
    resData:  combination of residual graph nodes and edges

    algTopData: A copy of top data for the algorithm to run on
    algResData: A copy of the residual data for the algorithm to run on

    topAdjMatrix, resAdjMatrix: Adjacency martix representations for the top
                                and residual graphs.

    N:  int, number of nodes in the graph (when generated)
    E:  int, number of edges in the graph (when generated)
    T:  int, N-1


  Functions:
    General graph data functions:
    (65)  getMatrix(networkID)
    (75)  findDuplicateEdges(networkID, from, to)
    (85)  addEdge(localEdges, id, from, to, cap)
    (100)  addNode(localNodes, id, label, x, y)
    (125)  getConnectedNodes(networkID, nodeID, direction)
    (145)  getEdgeData(data, from, to)
    (165)  reverseEdgeIDs(edges)


    Downloading graph data functions:
    (180)  downloadGraphAsTxt(filename)
    (195)  createTxtFileFromGraph()
    (205)  constructJsonArray(type)
    (216)  constructJsonObject(obj, id, type)

    Uploading graph data functions:
    (230)  checkValidGraph(fileNodes, fileEdges)
    (275)  checkNodesAndEdgesExist(n, e)
    (295)  checkNodeIdsConsecutive(nodes)

    (305-380)  drawing add/delete node/edge functions

******************************************************************************/

var nodes, edges, topNodes, topEdges, resEdges;
var algTopEdges, algResEdges;
var topData, resData, algTopData, algResData;
var N, E, T;
var resAdjMatrix = [], topAdjMatrix = [];
var TOP = 0, RES = 1;
var newNodeID, newEdgeID, edgeID;

/*
  Returns the adjacency matrix of the network specified by networkID.
*/
function getMatrix(networkID){
    if (networkID == RES) return resAdjMatrix; else if (networkID == TOP) return topAdjMatrix; else return networkID;
}

/*
  Given a set of edges and an id of the nodes 'from' and 'to', returns 1 if there
  is already an edge with these nodes and -1 if there is not
*/
function findDuplicateEdges(networkID, from, to){
    var matrix = getMatrix(networkID);
    if(matrix[from][to] != null) return 1;
    return -1;
}

/*
  Adds an edge to the array localEdges, and returns the array. Also includes the new
    edge in the top adjacency matrix.
*/
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

/*
  Adds a node to the array localNodes, and returns the array.
*/
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

/*
Given a node id and a direction:

direction = 'to' - returns array of nodeIds that node connects to
direction = 'from' - returns array of nodeIds that connect to node

*/
function getConnectedNodes(networkID, nodeID, direction) {
    // console.log("getting connected nodes");
    var nodeList = [], tfList = [], matrix = getMatrix(networkID);
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
function getEdgeData(networkID, from, to){
    var edgeData = {}, matrix = getMatrix(networkID);
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

/*
  Reverses the ids of the edges in the top graph when the graph has been randomly generated.
    This is because the graph builds backwards from T, so the order of the residual graph
    being built looks confusing. It doesn't solve the issue, but mitigates it.
*/
function reverseEdgeIDs(edges){
    var revEdges = [], j = 0;
    for(i = newEdgeID-1; i >= 0; i--){
        revEdges = addEdge(revEdges, j, edges[i].from, edges[i].to, getCapacity(edges[i].label));
        j++;
    }
    return revEdges;
}

/*
  =================================================================================
  Downloading graph data functions. Constructs and downloads a graph as a text file`

  Creates a file, adds a json representation of the graph to it, then downloads it.
*/
function downloadGraphAsTxt(filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(createTxtFileFromGraph()));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/*
  Constructs a string of the graph as a json file.
*/
function createTxtFileFromGraph(){
    var NODES = 0, EDGES = 1;
    return "{\n\"nodes\" : [" + constructJsonArray(NODES)
            + "\n],\n\"edges\" : [" + constructJsonArray(EDGES)
            + "\n]\n}";
}

/*
  Constructs and returns a string of a json array of nodes or edges (depending on type).
*/
function constructJsonArray(type) {
    var text = "", array, i;
    if(type == 0) array = topNodes; else if (type == 1) array = topEdges;
    for (i = 0; i < array.length; i++){
        text += constructJsonObject(array.get(i), i, type);
        if(i < array.length -1) text += ",";
    }
    return text;
}

/*
  Constructs a json object to be added into the array.
*/
function constructJsonObject(obj, id, type){
    if(type == 0){
        return "\n{ \"id\": " + id + ", \"x\": " + obj.x + ", \"y\": " + obj.y + "}";
    } else if(type == 1) {
        return "\n{ \"from\": " + obj.from + ", \"to\": "
            + obj.to + ", \"capacity\": " + getCapacity(obj.label) + "}";
    }
}

/*
  =================================================================================
  Uploading graph data functions. These are to validate an uploaded file contents.
*/
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

function isBetween(comp, lower, upper){
    if((comp >= lower) && (comp < upper)) return true; else return false;
}

/*
  Ensures that there is a at least one edge and two nodes (S and T) in the file.
*/
function checkNodesAndEdgesExist(n, e){
    if((n < 2) && (e == 0)) {
        alert("not enough nodes, and no edges in file!");
        return false;
    } else if (e == 0) {
        alert("no edges in file!");
        return false;
    } else if (n < 2) {
        alert("not enough nodes in file!");
        return false;
    } else {
        return true;
    }
}

/*
  Node IDs must be consecutive, as specified in the instructions.
*/
function checkNodeIdsConsecutive(nodes){
    for(var i = 0; i < nodes.length; i++) if (nodes[i].id != i) return false;
    return true;
}

/*
  =================================================================================
  Drawing graph data functions. For the addition and deletion of nodes and edges.


  Adds a node in the correct`style and format.
*/
function drawAddNode(nodeData, callback) {
  nodeData.id = newNodeID, nodeData.label = "n" + newNodeID, nodeData.physics = false;
  nodeData.color = {
      background: '#00BCD4', border: '#00BCD4',
      highlight: { background :'#757575', border: '#212121'},
      hover: { background :'#757575', border: '#212121'}
  };
  nodeData.font = { color: '#ffffff'};
  callback(nodeData);
  nodes = addNode(nodes, newNodeID, nodeData.label, nodeData.x, nodeData.y);
  newNodeID++;
}

/*
  Adds an edge in the correct style and format
*/
function drawAddEdge(edgeData, capacity, callback){
  edgeData.id = newEdgeID, edgeData.arrows = {to: {enabled: true}}, edgeData.font = {strokeWidth: 5};
  edgeData.width = 3, edgeData.arrowStrikethrough = false;
  edgeData.label = 0 + '/' + capacity;
  edges = addEdge(edges, newEdgeID, edgeData.from, edgeData.to, capacity);
  topEdges.update(edges);
  newEdgeID++;
  callback(edgeData);
}

/*
  Deletes a node, decrements each node ID greater than the deleted node's (so that)
      they remain consecutive), and updates the labels.
      Calls updateEdgesToFrom(i) so that edges remain connected to the correct nodes.
*/
function drawDeleteNode(nodeData, callback){
  var nodeIds = nodeData.nodes, i;
  nodes.splice(nodeIds[0] + 1, 1);
  topNodes.remove(nodeIds[0]);
  for(i = nodeIds[0] + 1; i < nodes.length; i++){
      nodes[i].id = i - 1;
      nodes[i].label = "n" + (i-1);
      updateEdgesToFrom(i);
      topNodes.remove(i);
  }
  newNodeID--;
  drawDeleteEdge(nodeData);
  topNodes.update(nodes);
  callback(nodeData);
}

/*
  Multiple edges may be deleted at a time. This goes through the list of edges being
      deleted, and treats them in much the same way as deleted nodes.
*/
function drawDeleteEdge(edgeData) {
    var  edgeIds = edgeData.edges, i, victim;
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
