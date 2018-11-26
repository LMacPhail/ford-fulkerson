
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

var edgeID = 0;
function buildResidualGraph(){
    // console.log("\nBuilding residual graph");
    // console.log(algResData);
    var edges = [];
    var cap, flow, algEdgeID = 0, i;
    // build edges
    for(i = 0; i < algTopEdges.length; i++){
        var edge = algTopEdges.get(i);
        // console.log("top edge" + edge);
        animationSteps.push({
            network: "topGraph",
            action: "highlight",
            edge_id: i,
            colour: {color: 'red'}
        });
        cap = getCapacity(edge.label);
        flow = getFlow(edge.label);
        if((flow > 0) && (flow <= cap)){
            animationSteps.push({
                network: "residualGraph",
                action: "add",
                label: flow,
                edge_id: edgeID,
                from: edge.to,
                to: edge.from
            });
            edges.push({
                id: edgeID, label: flow, from: edge.to, to: edge.from,
                arrows: {
                    to : {enabled: true}
                },
            });
            resAdjMatrix[edge.to][edge.from] = edgeID++;
        }
        if((0 <= flow) && (flow < cap)){
            animationSteps.push({
                network: "residualGraph",
                action: "add",
                label: (cap - flow).toString(),
                edge_id: edgeID,
                from: edge.from,
                to: edge.to
            });
            edges.push({
                id: edgeID, label: (cap - flow).toString(), from: edge.from, to: edge.to,
                arrows: {
                    to : {enabled: true}
                },
            });
            resAdjMatrix[edge.from][edge.to] = edgeID++;
        }
        animationSteps.push({
            network: "topGraph",
            action: "highlight",
            edge_id: i,
            colour: {color: 'blue'}
        });
    }
    algResEdges.update(edges);
}

function updateResidualGraph(path){
  console.log("updating residual graph");
  console.log(algResEdges);
  for(i = 1; i < path.length; i++){
    var edgeData = findEdgeID(1, path[i-1], path[i]);
    animationSteps.push({
        network: "topGraph",
        action: "highlight",
        edge_id: topAdjMatrix[path[i-1]][path[i]],
        colour: {color: 'red'}
    });
    var edge = algTopEdges.get(edgeData.id);
    // console.log(edge);
    var flow = getFlow(edge.label), cap = getCapacity(edge.label);
    // console.log("from: " + path[i-1] + ", to: " + path[i] + ", flow: " + flow + ", capacity: " + cap);
    var forwards = resAdjMatrix[path[i-1]][path[i]],
        backwards = resAdjMatrix[path[i]][path[i-1]];
    if(forwards != null){
      if(cap - flow > 0){
        algResEdges.update([{id:forwards, label: (cap - flow).toString()}]);
        animationSteps.push({
            network: "residualGraph",
            action: "label",
            label: (cap - flow).toString(),
            edge_id: forwards
        });
      } else {
        algResEdges.remove(forwards);
        animationSteps.push({
            network: "residualGraph",
            action: "remove",
            edge_id: forwards
        });
        resAdjMatrix[path[i-1]][path[i]] = null;
      }
      // console.log("updating algResEdges");
      // console.log(algResEdges);
    } else {
      algResEdges.add([{id:edgeID++,
                        label: (cap - flow).toString(),
                        from: path[i-1],
                        to: path[i],
                        arrows: {
                          to : {enabled: true}
                        },
                      }]);
      animationSteps.push({
          network: "residualGraph",
          action: "add",
          label: (cap - flow).toString(),
          edge_id: edgeID,
          from: path[i-1],
          to: path[i]
      });
      resAdjMatrix[path[i-1]][path[i]] = edgeID++;
      // console.log("adding to algResEdges");
      // console.log(algResEdges);
    }
    if(backwards != null){
      algResEdges.update([{id: backwards, label: flow}]);
      // console.log("updating algResEdges");
      // console.log(algResEdges);
      animationSteps.push({
          network: "residualGraph",
          action: "label",
          label: flow,
          edge_id: backwards
      });
    } else {
      algResEdges.add([{id:edgeID,
                        label: flow,
                        from: path[i],
                        to: path[i-1],
                        arrows: {
                          to : {enabled: true}
                        },
                      }]);
      animationSteps.push({
          network: "residualGraph",
          action: "add",
          label: flow,
          edge_id: edgeID,
          from: path[i],
          to: path[i-1]
      });
      resAdjMatrix[path[i]][path[i-1]] = edgeID++;
      // console.log("adding to algResEdges");
      // console.log(algResEdges);
    }
    animationSteps.push({
        network: "topGraph",
        action: "highlight",
        edge_id: topAdjMatrix[path[i-1]][path[i]],
        colour: {color: 'blue'}
    });
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
    var x, y;

    for(i = 0; i < nodes.length; i++){
        parents.push({
            node: i,
            parent: i,
        });
    }

    for(i = 0; i < nodes.length; i++){
        visited[i] = 1;
        queue.push(i);
        while(queue.length > 0){
            x = queue.pop();
            var L = getConnectedNodes(0, x, 'to');
            for(j = 0; j < L.length; j++){
                y = L[j];
                if(visited[y] == 0){
                    visited[y] = 1;
                    parents[y].parent = x;
                    queue.push(y);
                }
            }
        }
    }
    if(parents[N].parent == N){
        return -1;
    } else {
        var path = [];
        x = N;
        while(true){
            path.push(x);
            if(x == 0){
                break;
            } else {
                y = parents[x].parent;
                if( y == x){
                    return -1;
                } else {
                    x=y;
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
        // for(j = 0; j < data.edges.length; j++){
        //     edge = data.edges.get(j);
            if((edge.from == from) && (edge.to == to)){
                capacity = parseInt(edge.label);
                if((minCap == 0)||(capacity < minCap)) minCap = capacity;
            }
        // }
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
                var orig_label = algTopEdges.get(id).label;

                id = edgeData.id;
                if(edgeData.direction == 1){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) + m;
                    var highlightStep = "step7";
                }
                if(edgeData.direction == 0){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) - m;
                    var highlightStep = "step7";
                }
                var label = setFlow(algTopEdges.get(id).label, flow)
                console.log("Updating edge: from = " + path[i-1]
                            + ", to = " + path[i]
                            + ", old flow: " + algTopEdges.get(id).label
                            + ", new flow: " + label);
                algTopEdges.update([{id: id, label: label}]);
                animationSteps.push({
                    network: "topGraph",
                    action: "label",
                    edge_id: id,
                    label: label,
                });
            }
        }
        highlightAugmentingPath(path, 'blue');
        count++;
        // break;
    }
}
