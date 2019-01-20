var drawingEnabled = false;
var nodeID;

function draw(){
    document.getElementById('drawing_instructions').display = 'inline-block';
    newNodeID = 1;
    newEdgeID = 0;
    nodes = [];
    addNode(nodes, 0, 'S', -300, 0);
    addNode(nodes, -1, 'T', 300, 0);

    edges = [];

    // TODO change this to use initialiseDataSets when it works
    initialiseDataSets(nodes, edges);
    initialiseMatrices();
    topGraph.setData(topData);
    resGraph.setData(resData);

    options.manipulation = {
        enabled: true,
        addNode: function (data, callback) {
            data.id = nodeID;
            data.label = "n" + (nodeID).toString();
            data.physics = false;
            callback(data);
            console.log(topNodes);
            nodeID++;
        },
        addEdge: function (data, callback) {
            var validEdge = 0;
            data.id = newEdgeID;
            data.arrows = {to: {enabled: true}};
            var capacity = prompt("Please enter capacity of new edge (whole number)", 4);
            if(Number.isInteger(parseInt(capacity))){
                data.label = 0 + '/' + capacity;
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                        callback(data);
                    }
                } else {
                    callback(data);
                }
            }
            console.log(topEdges);
            newEdgeID++;
        }
    },
    topGraph.setOptions(options);
    console.log(options);  
}

function finishDrawing(){
    topNodes = topData.nodes;
    topEdges = topData.edges; 
    
    topNodes.add({
        id: newNodeID,
        label: 'T',
        physics: false,
        x: 300,
        y: 0
    });
    T = newNodeID;
    E = topEdges.length;
    for(var i = 0; i < topEdges.length; i++){
        var edge = topEdges.get(i);
        var from = edge.from, to = edge.to;
        if(from == -1) topEdges.update({id: i, from: T}); from = T;
        if(to == -1) topEdges.update({id: i, to: T}); to = T;
        topAdjMatrix[from][to] = edge.id;
    }
    topNodes.remove(-1);
    options.manipulation.enabled = false;
    topGraph.setOptions(options);
    setNewGraph();
}

function destroy() {
    if (topGraph !== null) {
      topGraph.destroy();
      topGraph = null;
      resGraph.destroy();
      resGraph = null;
    }
}
function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}


function saveData(data,callback) {
    data.id = nodeID;
    data.label = "n" + nodeID.toString();
    nodeID++;
    callback(data);
}

function init() {
    setDefaultLocale();
    draw();
}

function incrementT() {
    var TNode = topNodes.get(T);
    addNode(nodes, T+1, 'T', TNode.x, TNode.y);
    T++;
    TNode = null; 
}