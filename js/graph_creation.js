/*****************************************************************************

  Contains higher level functions to create graphs, one of the default
    graph, a random graph, uploading a graph, or drawing a graph. Also handles
    most of the functions relating to actions on the graph canvas. 
    graph_data.js contains the more detailed functions used often in this file.

  Functions:

    (30) loadNewGraph(graphGenCallBack, nodes, edges)
    (45) resetCanvas()
    (60) resetAnimation()
    (80) initialiseMatrices()
    (95) populateTopAdjMatrix(edges)
    (105) assignDataSets(nodes, edges)
    (125) addDragListener()

    (140) generateDefaultGraph()
    (180) generateRandomGraph()
    (220) createGraphFromUpload(fileNodes, fileEdges)
    (320) drawNewGraph()
    (340) saveDrawnGraph()

******************************************************************************/

/*
    Function:   loadNewGraph
    Purpose:    Whenever a new graph is created or uploaded, this function is 
                called to reset the interface so it is suitable to run the animation
                for the new graph.
*/
function loadNewGraph(graphGenCallback, nodes, edges) {
    if(playState == PLAY) {
        playPause();
    }
    disableDrawingMode();
    graphGenCallback(nodes, edges); // The function to create a new graph, such as generateDefaultGraph()
    resetCanvas();
    resetAnimation();
    fordFulkerson();
}

/*
    Function:   resetCanvas
    Purpose:    Resizes the top graph to take up 100% of the canvas
*/
function resetCanvas(){
    document.getElementById("top_graph").style.height = "100%";
    document.getElementById("res_graph").style.height = "0%";
    topGraph = new vis.Network(mainContainer, topData, options);
    addDragListener();
    topGraph.fit();
    topGraph.storePositions();
}

/*
    Function:   resetAnimation
    Purpose:    Empties animationStep array, sets the index to 0, and resets other elements to their
                starting state. Pushes the step which reveals the residual graph onto the array.
*/
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


/*
    Function:   initialiseMatrices
    Purpose:    Creates empty adjacency matrices for top graph and residual graph with NxN nodes
*/
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

/*
    Function:   populateTopAdjMatrix
    Purpose:    Populates topAdjMatrix with the data from topEdges
*/
function populateTopAdjMatrix(edges) {
    for(var i = 0; i < edges.length; i++){
        var from = edges[i].from, to = edges[i].to;
        topAdjMatrix[from][to] = edges[i].id;
    }
}

/*
    Function:   assignDataSets
    Purpose:    Takes arrays 'nodes' and 'edges' and creates vis.DataSets with them.
*/
function assignDataSets(nodes, edges){
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
    Function:   addDragListener
    Purpose:    So that if a node is dragged in the top graph, its movement is copied in the 
                residual graph, and vice versa.
*/
function addDragListener() {
    topGraph.addEventListener("dragEnd", function(){
        topGraph.storePositions();
        resGraph.storePositions();
    });
    resGraph.addEventListener("dragEnd", function(){
        topGraph.storePositions();
        resGraph.storePositions();
    });
}

/*
    Function:   generateDefaultGraph
    Purpose:    Creates a graph with hard-coded arrays of nodes and edges. Sets this graph as 
                the top graph.
*/
function generateDefaultGraph(){
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

/*
    Function:   generateRandomGraph
    Purpose:    Generates a graph such that:
                - There is a source node S and a sink node T
                - S is the leftmost node and T is the rightmost
                - There are no loops or dead ends (all nodes are on a path from S to T)
                - S has no incoming edges and T has no outgoing edges
                - All edges have a capacity from 1 to 10

*/
function generateRandomGraph(){
    if(!test) N = document.getElementById("N_picker").value;
    if(N < 4) {
      alert("There must be at least 4 nodes!");
      return;
    } else if((N > 50) && !test){
      alert(N + " is far too many nodes, the algorithm will be unreadable!");
      return;
    }
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
}

/*
    Function:   connectNodesToSink
    Purpose:    Stage 1 of generating a random graph. Connects all nodes except for S
                so that they are all connected to, or on a path to, T.

*/
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

/*
    Function:   connectNodesFromSource
    Purpose:    Stage 2 of generating a random graph. Connects nodes with no incoming
                from, or on a path from, S. All nodes at the end of this stage are now
                on a path from S to T.

*/
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

/*
    Function:   addRemainingEdges
    Purpose:    Stage 3 of generating a random graph. Adds edges randomly between nodes
                until the number of edges == E.

*/
function addRemainingEdges(edges, E){
    for (i = newEdgeID; i < E; i++){
        do {  // prevents loops and duplicate parallel edges
            from = (Math.random() * T | 0); to = (Math.random() * N | 1);
        } while ((from == to) || (findDuplicateEdges(TOP, from, to) == 1));
        edges = addEdge(edges, newEdgeID, from, to, null);
        newEdgeID++;
    }
}

/*
    Function:   createGraphFromUpload
    Purpose:    Called after a json file uploaded by the user has been found to be correctly
                formatted. Creates a graph using the nodes and edges in the file.

*/
function createGraphFromUpload(fileNodes, fileEdges){
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

/*
    Function:   drawNewGraph
    Purpose:    Adds S and T on the left and right of a blank canvas. Enables drawing mode,
                which allows the user to draw the rest of the graph. 

*/
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
    resetCanvas();
}

/*
    Function:   saveDrawnGraph
    Purpose:    When a user has pressed "save" after drawing their graph, this makes the id
                of T equal to N-1, and updates the edges connecting to T accordingly. The DataSets
                are saved, and the drawing mode is disabled.

*/
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
