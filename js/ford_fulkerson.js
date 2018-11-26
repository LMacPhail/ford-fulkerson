
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

function buildResidualGraph(){
    // console.log("\nBuilding residual graph");
    // console.log(algResData);
    var edges = [];
    var cap, flow, algEdgeID = 0, edgeID = 0, i;
    animationSteps.push({
        network: "residualGraph",
        action: "destroyRes",
        old_edges: algResData.edges,
        pStep: "step3",
    });
    // build edges
    for(var y = 0; y <= N; y++){
      for(var x = 0; x <= N; x++){
        resAdjMatrix[y][x] = null;
      }
    }
    for(i = 0; i < algTopEdges.length; i++){
        var edge = algTopEdges.get(i);
        // console.log("top edge" + edge);

        animationSteps.push({
            network: "topGraph",
            action: "highlight",
            edge_id: i,
            colour: {color: 'red'},
            orig_colour: {color: 'blue'}
        });

        cap = getCapacity(edge.label);
        flow = getFlow(edge.label);
        console.log("to: " + edge.to + ", from: "+ edge.from + ", capacity: " + cap + ", flow: " + flow);
        if((flow > 0) && (flow <= cap)){

            animationSteps.push({
                network: "residualGraph",
                action: "add",
                label: flow,
                edge_id: edgeID,
                from: edge.to,
                to: edge.from
            });
            console.log("adding edge from: " + edge.to + ", to: " + edge.from + ", flow: " + flow );
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
            console.log("adding edge from: " + edge.from + ", to: " + edge.to + ", flow: " + flow );
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
            orig_colour: {color: 'red'},
            colour: {color: 'blue'}
        });
    }
    algResEdges.update(edges);

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
            console.log("node: " + x + ", connected to: " + L);
            for(j = 0; j < L.length; j++){
                y = L[j];
                console.log("y: " + y);
                if(visited[y] == 0){
                    console.log("y is not visited");
                    visited[y] = 1;
                    parents[y].parent = x;
                    console.log(x + " is a parent of " + y);
                    queue.push(y);
                }
            }
        }
    }
    console.log("parents: " + parents);
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
        for(j = 0; j < data.edges.length; j++){
            edge = data.edges.get(j);
            if((edge.from == from) && (edge.to == to)){
                capacity = parseInt(edge.label);
                if((minCap == 0)||(capacity < minCap)) minCap = capacity;
            }
        }
    }
    return minCap;
}


function fordFulkerson(){
    console.log("Running Ford Fulkerson...");
    var path, visited = [];
    var i, id;
    var count = 0;

    // for(i = 0; i < algTopEdges.length; i++){
    //     algTopEdges.update([{id: i, label: setFlow(algTopEdges.get(i).label, 0)}]);
    // }
    for(i in topNodes){
        visited.push(0);
    }
    while(true){
        console.log("building residual graph");
        buildResidualGraph();
        for(i in visited) visited[i] = 0;
        path = findPath(visited);
        console.log("path: " + path);
        highlightAugmentingPath(path);
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
                    orig_label: algTopEdges.get(id).label,
                    pStep: highlightStep,
                });
            }
        }
        // break;
    }
}
