
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

function addEdgeToRes(edges, id, label, from, to){
  edges.push({
    id: id,
    arrows: {to : {enabled: true}},
    label: label,
    from: from,
    to: to,
  });
  resAdjMatrix[from][to] = id;
  return edges;
}

var edgeID = 0;
function buildResidualGraph(){
    // console.log("Building residual graph");
    var edges = [];
    var cap, flow, i;
    // build edges
    for(i = 0; i < algTopEdges.length; i++){
        var edge = algTopEdges.get(i);
        animateHighlightEdge("top", i, 0, 'red');
        cap = getCapacity(edge.label);
        flow = getFlow(edge.label);
        if((flow > 0) && (flow <= cap)){
            animateAddEdge("res", edgeID, 0, flow, edge.to, edge.from);
            edges = addEdgeToRes(edges, edgeID, label, edge.to, edge.from);
            edgeID++;
        }
        if((0 <= flow) && (flow < cap)){
            animateAddEdge("res", edgeID, 0, (cap - flow).toString(), edge.from, edge.to);
            edges = addEdgeToRes(edges, edgeID, (cap - flow).toString(), edge.from, edge.to);
            edgeID++;
        }
        animateHighlightEdge("top", i, 0, 'blue');
    }
    algResEdges.update(edges);
}

function updateResidualGraph(path){
  // console.log("Updating residual graph");
  var edgeData, edge, flow, cap, forwards, backwards;
  for(i = 1; i < path.length; i++){
    animateHighlightEdge("top", topAdjMatrix[path[i-1]][path[i]], 0, 'red');

    edgeData = findEdgeID("top", path[i-1], path[i]);
    edge = algTopEdges.get(edgeData.id);
    flow = getFlow(edge.label), cap = getCapacity(edge.label);

    forwards = resAdjMatrix[path[i-1]][path[i]];
    backwards = resAdjMatrix[path[i]][path[i-1]];

    if(forwards != null){
      if(cap - flow > 0){
        algResEdges.update([{id:forwards, label: (cap - flow).toString()}]);
        animateLabelEdge("res", forwards, 0, (cap - flow).toString());
      } else {
        algResEdges.remove(forwards);
        animateRemoveEdge("res", forwards, 0);
        resAdjMatrix[path[i-1]][path[i]] = null;
      }
    } else {
      algResEdges.add([{id:edgeID++, label: (cap - flow).toString(),
                        from: path[i-1], to: path[i],
                        arrows: {to : {enabled: true}},
                      }]);
      animateAddEdge("res", edgeID, 0, (cap - flow).toString(), path[i-1], path[i]);
      resAdjMatrix[path[i-1]][path[i]] = edgeID++;
    }
    if(backwards != null){
      algResEdges.update([{id: backwards, label: flow}]);
      animateLabelEdge("res", backwards, 0, flow);
    } else {
      algResEdges.add([{id:edgeID, label: flow, from: path[i], to: path[i-1],
                        arrows: {to : {enabled: true}},
                      }]);
      animateAddEdge("res", edgeID, 0, flow, path[i], path[i-1]);
      resAdjMatrix[path[i]][path[i-1]] = edgeID++;
    }
    animateHighlightEdge("top", topAdjMatrix[path[i-1]][path[i]], 0, 'blue');
  }
}

/*
Find a path from S to T

If successful, returns an array of node IDs (in order of the path)
If unsuccessful, returns -1
*/
function findPath(visited){
    var i, j, parents = [], queue = [];
    var nodes = topNodes;
    var node, neighbour;
    for(i = 0; i < nodes.length; i++) parents.push({ node: i, parent: i});

    for(i = 0; i < nodes.length; i++){
        visited[i] = 1;
        queue.push(i);
        while(queue.length > 0){
            node = queue.pop();
            var neighbours = getConnectedNodes("res", node, 'to');
            console.log(node);
            console.log(neighbours);
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
                if( parent == node){
                    return -1;
                } else {
                    node = parent;
                }
            }
        }
    }
    return path.reverse();
}

function findMinimumCapacity(data, path){
    var i, j, minCap = 0, capacity, edge;
    var from, to;
    for(i = 1; i < path.length; i++){
        from = path[i-1];
        to = path[i];
        edge = data.edges.get(resAdjMatrix[from][to]);
        if((edge.from == from) && (edge.to == to)){
            capacity = parseInt(edge.label);
            if((minCap == 0)||(capacity < minCap)) minCap = capacity;
        }
    }
    return minCap;
}


function fordFulkerson(){
    console.log("Running Ford Fulkerson...");
    var path = -1, visited = [];
    var i, id;
    var count = 0;

    // for(i = 0; i < algTopEdges.length; i++){
    //     algTopEdges.update([{id: i, label: setFlow(algTopEdges.get(i).label, 0)}]);
    // }
    for(i in topNodes){
        visited.push(0);
    }
    while(true){
        if (path == -1) { buildResidualGraph(); } else { updateResidualGraph(path);}
        for(i in visited) visited[i] = 0;
        path = findPath(visited);
        console.log("path: " + path);
        highlightAugmentingPath(path, 'red');
        if(path == -1){
            break;
        } else {
            var m = findMinimumCapacity(algResData, path);
            console.log("minimum capacity: " + m);
            for(i = 1; i < path.length; i++){
                var edgeData = findEdgeID(1, path[i-1], path[i]);

                id = edgeData.id;
                if(edgeData.direction == 1){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) + m;
                }
                if(edgeData.direction == 0){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) - m;
                }
                var label = setFlow(algTopEdges.get(id).label, flow)
                console.log("Updating edge: from = " + path[i-1]
                            + ", to = " + path[i]
                            + ", old flow: " + algTopEdges.get(id).label
                            + ", new flow: " + label);
                algTopEdges.update([{id: id, label: label}]);
                animateLabelEdge("top", id, 2, label);
            }
        }
        highlightAugmentingPath(path, 'blue');
        count++;
        // break;
    }
}
