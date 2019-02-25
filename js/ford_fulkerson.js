
function getCapacity(label){
    var capacity = label.split('/')[1];
    return capacity;
}

function getFlow(label){
    var flow = label.split('/')[0];
    return flow;
}

function setFlow(label, new_flow){
    var capacity = getCapacity(label);
    var label = new_flow + '/' + capacity;
    return label;
}

function addEdgeToRes(id, label, from, to, backwards){
  algResEdges.add({
    id:id,
    color: {color: '#0097A7'},
    label: label,
    from: from, to: to,
    arrows: {to : {enabled: true}},
    backwards,
  });
  resAdjMatrix[from][to] = id;
}

var edgeID = 0;
function buildResidualGraph(){
    // console.log("Building residual graph");
    prepareOutputLine(6);
    var edges = [];
    var cap, i;
    // build edges
    for(i = 0; i < algTopEdges.length; i++){
        var edge = algTopEdges.get(i);
        createHighlightAnimation(TOP, i, 0, '#757575');
        cap = getCapacity(edge.label);
        createAddEdgeAnimation(RES, edgeID, 0, cap, edge.from, edge.to, 2, cap);
        addEdgeToRes(edgeID, cap, edge.from, edge.to);
        edgeID++;
        createHighlightAnimation(TOP, i, 0, '#0097A7');
    }
    algResEdges.update(edges);
}

function updateResidualGraph(path){
//   console.log("Updating residual graph");
    prepareOutputLine(7);
  var edgeData, edge, flow, cap, forwards, backwards;
  var pseudocodeStep = 9;
  for(i = 1; i < path.length; i++){
    createDashEdgeAnimation(TOP, topAdjMatrix[path[i-1]][path[i]], pseudocodeStep, true);
    // createHighlightAnimation(TOP, topAdjMatrix[path[i-1]][path[i]], pseudocodeStep, '#FF9800');

    edgeData = findEdgeID(TOP, path[i-1], path[i]);
    edge = algTopEdges.get(edgeData.id);
    flow = getFlow(edge.label), cap = getCapacity(edge.label);

    forwards = resAdjMatrix[path[i-1]][path[i]];
    backwards = resAdjMatrix[path[i]][path[i-1]];

    if(forwards != null){
        if((cap - flow > 0) && (flow > 0)){
            algResEdges.update([{id:forwards, label: (cap - flow).toString()}]);
            createLabelEdgeAnimation(RES, forwards, pseudocodeStep, (cap - flow).toString(), 0, (cap-flow));
        } else {
            algResEdges.remove(forwards);
            createRemoveEdgeAnimation(RES, forwards, pseudocodeStep);
            resAdjMatrix[path[i-1]][path[i]] = null;
        }
    } else {
        addEdgeToRes(edgeID, (cap - flow).toString(), path[i-1], path[i]);
        createAddEdgeAnimation(RES, edgeID, pseudocodeStep, (cap-flow).toString(),path[i-1], path[i], 0, (cap - flow));
        edgeID++;
    }
    if(backwards != null){
        algResEdges.update([{id: backwards, label: flow}]);
        createLabelEdgeAnimation(RES, backwards, pseudocodeStep, flow, 1, flow);
    } else {
        if(flow == 0) {
            addEdgeToRes(edgeID, cap, path[i], path[i-1], true);
            createAddEdgeAnimation(RES, edgeID, pseudocodeStep, cap, path[i], path[i-1], 1, flow);
        } else {
            addEdgeToRes(edgeID, flow, path[i], path[i-1], true);
            console.log(algResEdges.get(edgeID));
            createAddEdgeAnimation(RES, edgeID, pseudocodeStep, flow, path[i], path[i-1], 1, flow);
        }
        edgeID++;
    }
    createHighlightAnimation(TOP, topAdjMatrix[path[i-1]][path[i]], pseudocodeStep, '#0097A7');
    if(topAdjMatrix[path[i]][path[i-1]] != null) createHighlightAnimation(TOP, topAdjMatrix[path[i]][path[i-1]], pseudocodeStep, '#0097A7');
  }
  addAnimationStep(null);
}

/*
Find a path from S to T

If successful, returns an array of node IDs (in order of the path)
If unsuccessful, returns -1
*/
function findPath(visited){
    // console.log("finding path");
    var i, j, parents = [], queue = [];
    var nodes = topNodes, node, neighbour;
    for(i = 0; i < topNodes.length; i++) parents.push({ node: i, parent: i});
    for(i = 0; i < topNodes.length; i++){

        visited[i] = 1;
        // console.log("visited: " + visited);
        queue.push(i);
        // console.log("queue: " + queue);
        while(queue.length > 0){
            node = queue.shift();
            // console.log("next node: " + node);
            var neighbours = getConnectedNodes(RES, node, 'to');
            // console.log("connected nodes: " + neighbours);
            for(j = 0; j < neighbours.length; j++){
                neighbour = neighbours[j];
                // console.log("neighbour: " + neighbour);
                if(visited[neighbour] == 0){
                  // console.log("neighbour not visited");
                    createDashEdgeAnimation(RES, resAdjMatrix[node][neighbour], 2, true);
                    // createHighlightAnimation(RES, resAdjMatrix[node][neighbour], 2, '#757575');
                    visited[neighbour] = 1;
                    parents[neighbour].parent = node;
                    queue.push(neighbour);
                }
            }
        }
    }
    if(parents[T].parent == T){
        return -1;
    } else {
        var path = [];
        node = T;
        while(true){
            path.push(node);
            if(node == 0){
                break;
            } else {
                var parent = parents[node].parent;
                if( parent == node) return -1; else node = parent;
            }
        }
    }
    return path.reverse();
}

function findMinimumCapacity(data, path){
    var i, minCap = 0, capacity, edge;
    var from, to;
    for(i = 1; i < path.length; i++){
        from = path[i-1];
        to = path[i];
        edge = data.edges.get(resAdjMatrix[from][to]);
        capacity = parseInt(edge.label);
        if((minCap == 0)||(capacity < minCap)) minCap = capacity;
    }
    return minCap;
}

function fordFulkerson(){
    var path = -1, visited = [];
    var i, id, totalFlow = 0;
    for(i = 0; i < topNodes.length; i++) visited.push(0);
    while(true){
        if (path == -1) buildResidualGraph(); else updateResidualGraph(path);
        for(i in visited) visited[i] = 0;
        prepareOutputLine(4);
        path = findPath(visited);
        // console.log("path: " + path);
        leavePathHighlighted(path);
        highlightAugmentingPath(path);
        if(path == -1){
            prepareOutputLine(5);
            break;
        } else {
            prepareOutputLine(3, path);
            var m = findMinimumCapacity(algResData, path);
            for(i = 1; i < path.length; i++){
                var edgeData = findEdgeID(TOP, path[i-1], path[i]);
                var resID = resAdjMatrix[path[i-1]][path[i]];
                var pseudocodeStep = 5;
                id = edgeData.id;
                if(edgeData.direction == 1){
                    createHighlightAnimation(RES, resID, pseudocodeStep, '#FF9800');
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) + m;
                }
                if(edgeData.direction == 0){
                    pseudocodeStep = 6;
                    createHighlightAnimation(RES, resID, pseudocodeStep, '#FF9800');
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) - m;
                }
                var label = setFlow(algTopEdges.get(id).label, flow)
                algTopEdges.update([{id: id, label: label}]);
                createHighlightAnimation(TOP, id, pseudocodeStep, '#FF9800');
                createLabelEdgeAnimation(TOP, id, pseudocodeStep, label, 8, [path[i-1], path[i]]);
                createHighlightAnimation(TOP, id, pseudocodeStep, '#757575');
                createHighlightAnimation(RES, resID, pseudocodeStep, '#0097A7');
            }

            totalFlow += m;
            // console.log(totalFlow);
            animationSteps.push({network: TOP, edgeID: resID, action: "updateFlow", m:totalFlow});
        }
    }
    // console.log(totalFlow);
    findMinimumCut();
    addAnimationStep(null);
    return totalFlow;
}

function bubbleSort(list){
    var i, j;
    for(i = 0; i < list.length-1; i++){
        for(j = 0; j < list.length-i-1; j++){
            if (list[j] > list[j+1]) {
                var temp = list[j];
                list[j] = list[j+1];
                list[j+1] = temp
            }
        }
    }
    return list;
}

function findMinimumCut(){
    var A = [], B = [], C = [], Q = [], i, j = 1;
    var visited = [];
    for(i = 0; i < topNodes.length; i++) visited.push(0);
    for(i = 1; i < N; i++) B.push(i);
    visited[0] = 1;
    Q.push(0);
    A.push(0);
    while(Q.length > 0) {
        var node = Q.pop();
        var connected = getConnectedNodes(RES, node, "to");
        for(i in connected){
            if(visited[connected[i]] == 0) {
                A.push(connected[i]);
                Q.push(connected[i]);
                visited[connected[i]] = 1;
            }
        }
    }
    A = bubbleSort(A);
    for(i = 1; i < A.length; i++) {
        B.splice((A[i]-j), 1);
        j++;
    }
    for(i = 0; i < A.length; i++) {
        for(j = 0; j < B.length; j++) {
            if(topAdjMatrix[A[i]][B[j]] != null) {
                C.push(topAdjMatrix[A[i]][B[j]]);
            }
        }
    }
    for(i = 0; i < C.length; i++){
        createHighlightAnimation(TOP, C[i], 10, '#FF9800');
    }
    return C;
}
