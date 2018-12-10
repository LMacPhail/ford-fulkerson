
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

function addEdgeToRes(id, label, from, to){
  algResEdges.add({
    id:id,
    color: {color: 'blue'},
    label: label,
    from: from, to: to,
    arrows: {to : {enabled: true}},
  });
  resAdjMatrix[from][to] = id;
}

var edgeID = 0;
function buildResidualGraph(){
    // console.log("Building residual graph");
    var edges = [];
    var cap, flow, i;
    // build edges
    for(i = 0; i < algTopEdges.length; i++){
        var edge = algTopEdges.get(i);
        addAnimationStep("top", "highlight", i, 0, 'red', null, null, null);
        cap = getCapacity(edge.label);
        flow = getFlow(edge.label);
        if((flow > 0) && (flow <= cap)){
            addAnimationStep("res", "add", edgeID, 0, null, flow, edge.to, edge.from);
            addEdgeToRes(edgeID, label, edge.to, edge.from);
            edgeID++;
        }
        if((0 <= flow) && (flow < cap)){
            addAnimationStep("res", "add", edgeID, 0, null, (cap - flow).toString(), edge.from, edge.to);
            addEdgeToRes(edgeID, (cap - flow).toString(), edge.from, edge.to);
            edgeID++;
        }
        addAnimationStep("top", "highlight", i, 0, 'blue', null, null, null);
    }
    algResEdges.update(edges);
}

function updateResidualGraph(path){
//   console.log("Updating residual graph");
  var edgeData, edge, flow, cap, forwards, backwards;
  for(i = 1; i < path.length; i++){
    addAnimationStep("top", "highlight", topAdjMatrix[path[i-1]][path[i]], 0, 'red', null, null, null);

    edgeData = findEdgeID("top", path[i-1], path[i]);
    edge = algTopEdges.get(edgeData.id);
    flow = getFlow(edge.label), cap = getCapacity(edge.label);

    forwards = resAdjMatrix[path[i-1]][path[i]];
    backwards = resAdjMatrix[path[i]][path[i-1]];

    if(forwards != null){
      if(cap - flow > 0){
        algResEdges.update([{id:forwards, label: (cap - flow).toString()}]);
        addAnimationStep("res", "label", forwards, 0, null, (cap - flow).toString(), null, null);
      } else {
        algResEdges.remove(forwards);
        addAnimationStep("res", "remove", forwards, 0,  null,  null,  null,  null);
        resAdjMatrix[path[i-1]][path[i]] = null;
      }
    } else {
      addEdgeToRes(edgeID, (cap - flow).toString(), path[i-1], path[i]);
      addAnimationStep("res", "add", edgeID, 0, null, (cap - flow).toString(), path[i-1], path[i]);
      edgeID++;
    }
    if(backwards != null){
      algResEdges.update([{id: backwards, label: flow}]);
      addAnimationStep("res", "label", backwards, 0, null, flow, null, null);
    } else {
      addEdgeToRes(edgeID, flow, path[i], path[i-1]);
      addAnimationStep("res", "add", edgeID, 0, null, flow, path[i], path[i-1]);
      edgeID++;
    }
    addAnimationStep("top", "highlight", topAdjMatrix[path[i-1]][path[i]], 0, 'blue', null, null, null);
  }
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
    for(i = 0; i < nodes.length; i++) parents.push({ node: i, parent: i});
    for(i = 0; i < nodes.length; i++){

        visited[i] = 1;
        queue.push(i);
        while(queue.length > 0){
            node = queue.pop();
            var neighbours = getConnectedNodes("res", node, 'to');
            for(j = 0; j < neighbours.length; j++){
                neighbour = neighbours[j];
                if(visited[neighbour] == 0){
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
    console.log("Running Ford Fulkerson...");
    var path = -1, visited = [];
    var i, id;
    var count = 0;
    for(i in topNodes){
        visited.push(0);
    }
    while(true){
        if (path == -1) buildResidualGraph(); else updateResidualGraph(path);
        for(i in visited) visited[i] = 0;
        path = findPath(visited);
        console.log("path: " + path);
        highlightAugmentingPath(path, 'red');
        if(path == -1){
            break;
        } else {
            var m = findMinimumCapacity(algResData, path);
            for(i = 1; i < path.length; i++){
                var edgeData = findEdgeID("top", path[i-1], path[i]);
                id = edgeData.id;
                if(edgeData.direction == 1){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) + m;
                }
                if(edgeData.direction == 0){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) - m;
                }
                var label = setFlow(algTopEdges.get(id).label, flow)
                algTopEdges.update([{id: id, label: label}]);
                addAnimationStep("top", "label", id, 2, null, label, null, null);
            }
        }
        highlightAugmentingPath(path, 'blue');
        count++;
        // break;
    }
}
