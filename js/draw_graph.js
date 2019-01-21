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
    topGraph.setData(topData);
    resGraph.setData(resData);

    options.manipulation = {
        enabled: true,
        addNode: function (data, callback) {
            data.id = newNodeID;
            data.label = "n" + (newNodeID).toString();
            data.physics = false;
            callback(data);
            console.log(topNodes);
            nodes = addNode(nodes, newNodeID, data.label, data.x, data.y);
            newNodeID++;
        },
        addEdge: function (data, callback) {
            data.id = newEdgeID;
            data.arrows = {to: {enabled: true}};
            var capacity = prompt("Please enter capacity of new edge (whole number)", 4);
            if(Number.isInteger(parseInt(capacity))){
                data.label = 0 + '/' + capacity;
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                        callback(data);
                        edges = addEdge(edges, newEdgeID, data.from, data.to, capacity);
                    }
                } else {
                    callback(data);
                    edges = addEdge(edges, newEdgeID, data.from, data.to, capacity);
                }
            }
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
    N = T + 1;
    E = topEdges.length;
    initialiseMatrices();
    
    console.log(topAdjMatrix);
    
    for(var i = 0; i < topEdges.length; i++){
        var edge = topEdges.get(i);
        var from = edge.from, to = edge.to;
        if(from == -1){ 
            topEdges.update({id: i, from: T}); from = T;
        }
        if(to == -1) {
            topEdges.update({id: i, to: T}); to = T;
        }
        topAdjMatrix[from][to] = i;
    }
    console.log(topAdjMatrix);
    topNodes.remove(-1);
    options.manipulation.enabled = false;
    topGraph.setOptions(options);
    initialiseDataSets(nodes, edges);
    setNewGraph();
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