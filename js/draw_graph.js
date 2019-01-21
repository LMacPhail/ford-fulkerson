var drawingEnabled = false;
var nodeID;

function drawNewGraph(){
    toggleDisableDrawBtns();
    document.getElementById('drawing_instructions').display = 'inline-block';
    newNodeID = 1;
    newEdgeID = 0;
    nodes = [];
    addNode(nodes, 0, 'S', -300, 0);
    addNode(nodes, -1, 'T', 300, 0);

    edges = [];

    initialiseDataSets(nodes, edges);
    topGraph.setData(topData);
    resGraph.setData(resData);

    options.manipulation.enabled = true;
    topGraph.setOptions(options);
}

function saveDrawnGraph(){
    topNodes = topData.nodes;
    topEdges = topData.edges; 
    
    nodes = addNode(nodes, newNodeID, 'T', 300, 0);
    T = newNodeID;
    N = T + 1;
    E = topEdges.length;

    initialiseMatrices();
    
    for(var i = 0; i < topEdges.length; i++){
        var edge = topEdges.get(i);
        var from = edge.from, to = edge.to;
        if(from == -1){ 
            topEdges.update({id: i, from: T});
            edges[i].from = T;
            from = T; 
        }
        if(to == -1) { 
            topEdges.update({id: i, to: T}); 
            edges[i].to = T;
            to = T; 
        }
        topAdjMatrix[from][to] = i;
    }

    topNodes.remove(-1);
    nodes.splice(1, 1);

    initialiseDataSets(nodes, edges);
    

    options.manipulation.enabled = false;
    topGraph.setOptions(options);
    setNewGraph();
    toggleDisableDrawBtns();
}
