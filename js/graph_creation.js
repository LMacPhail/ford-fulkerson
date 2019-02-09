function loadNewGraph(graphGenCallback, nodes, edges) {
    if(playState == PLAY) {
        togglePlayPause();
    }
    disableDrawingMode();
    graphGenCallback(nodes, edges);
    resetCanvas();
    
    fordFulkerson();
}

function generateDefaultGraph(){
    console.log("default graph data");
    N = 6;
    T = N-1;

    initialiseMatrices();
    nodes = [];
    // addNode(nodes, id, label, x, y);
    addNode(nodes, 0, 'S', -300, 0);
    addNode(nodes, 1, 'n1', -150, -140);
    addNode(nodes, 2, 'n2', 130, -130);
    addNode(nodes, 3, 'n3', -150, 130);
    addNode(nodes, 4, 'n4', 150, 140);
    addNode(nodes, 5, 'T', 300, 0);
    //     {id: 5, label: 'T', x: 300, y: 0, /*color: {border: '#308c92', background: '#c0d6ba'},*/ physics: false}
    
    edges = [];
    // addEdge(edges, id, from, to, capacity)
    addEdge(edges, 0, 0, 1, 2);
    addEdge(edges, 1, 0, 3, 4);
    addEdge(edges, 2, 1, 2, 1);
    addEdge(edges, 3, 1, 4, 3);
    addEdge(edges, 4, 3, 2, 3);
    addEdge(edges, 5, 3, 4, 1);
    addEdge(edges, 6, 4, 3, 1);
    addEdge(edges, 7, 2, 5, 2);
    addEdge(edges, 8, 4, 5, 4);

    // Adjacency matrix initialising
    assignDataSets(nodes, edges);
    populateTopAdjMatrix(edges);
}

function initialiseMatrices(){
    topAdjMatrix = [], resAdjMatrix = [];
    for(var y = 0; y < N; y++){
        topAdjMatrix[y] = [];
        resAdjMatrix[y] = [];
        for(var x = 0; x < N; x++){
            topAdjMatrix[y][x] = null;
            resAdjMatrix[y][x] = null;
        }
    }
}

function assignDataSets(nodes, edges){
    console.log("initialising data sets");
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

function populateTopAdjMatrix(edges) {
    for(var i = 0; i < edges.length; i++){
        var from = edges[i].from, to = edges[i].to;
        topAdjMatrix[from][to] = edges[i].id;
    }
}

/*
Generates a graph using N and E, such that:
    - There is a source node S and a sink node T
    - S is the leftmost node and T is the rightmost
    - There are no loops or dead ends (all nodes are on a path from S to T)
*/
function generateRandomGraph(){
    N = document.getElementById("N_picker").value;
    E = N*2 - 3;
    T = N-1;

    newEdgeID = 0;
    initialiseMatrices();

    var i, nodes = [], edges = [];

    /* initialise nodes */
    nodes = addNode(nodes, 0, 'S', null, null);
    for(i = 1; i < T; i++) nodes = addNode(nodes, i, 'n' + i, null, null);

    /* Connect nodes 'randomly' */
    var noIncomingEdges = connectNodesToSink(edges);
    connectNodesFromSource(edges, noIncomingEdges);
    addRemainingEdges(edges, E); 
    edges = reverseEdgeIDs(edges);

    nodes = addNode(nodes, T, 'T', null, null);

    assignDataSets(nodes, edges);
    topNodes.update([{id:0, x: -250},{id:T, x:300}]);
    console.log(nodes);
}

function resetCanvas(){
    setNewTopGraph();
    resetAnimation();
}

function setNewTopGraph(){
    document.getElementById("top_graph").style.height = "100%";
    document.getElementById("res_graph").style.height = "0%";
    topGraph = new vis.Network(mainContainer, topData, options);
    topGraph.fit();
    topGraph.storePositions();
}

function resetAnimation(){
    animationSteps = [];
    step = 0;
    resetFlowCounter();
    resetTraceback();
    animationSteps.push({
        network: TOP,
        action: "reveal",
        pStep: 0
    });
}


function createGraphFromUpload(fileNodes, fileEdges){
    console.log("creating graph from upload");
    nodes = [], edges = [];
    var node, edge, i, label;
    N = fileNodes.length;
    T = N -1;
    E = fileEdges.length;
    
    initialiseMatrices();
    for(i = 0; i < N; i++){
        node = fileNodes[i];
        if(i == 0) label = 'S'; else if (i == T) label = 'T'; else label = 'n' + i;
        nodes = addNode(nodes, i, label, node.x, node.y);
    }
    for(i = 0; i < E; i++){
        edge = fileEdges[i];
        edges = addEdge(edges, i, edge.from, edge.to, edge.capacity);
    }
    assignDataSets(nodes, edges);
}

function drawNewGraph(){
    enableDrawingMode();
    document.getElementById('drawing_instructions').display = 'block';
    newNodeID = 1;
    newEdgeID = 0;
    nodes = [];
    addNode(nodes, 0, 'S', -300, 0);
    addNode(nodes, -1, 'T', 300, 0);

    edges = [];

    assignDataSets(nodes, edges);
    setNewTopGraph();
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

    assignDataSets(nodes, edges);
    options.manipulation.enabled = false;
}
