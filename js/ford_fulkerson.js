
function getCapacity(label){
    // console.log("in get capacity");
    var capacity = label.split('/')[1];
    // console.log("capacity: " + capacity);
    return capacity;
}

function getFlow(label){
    // console.log("in get flow");
    var flow = label.split('/')[0];
    // console.log("flow: "+ flow);
    return flow;
}

function setFlow(label, new_flow){
    // console.log("in set flow");
    var capacity = getCapacity(label);
    var label = new_flow + '/' + capacity;
    // console.log("new label: " + label);
    return label;
}

function buildResidualGraph(){
    console.log("\nBuilding residual graph");
    console.log(algResData);
    var edges = [];
    var cap, flow, algEdgeID = 0, edgeID = 0, i;
    animationSteps.push({
        network: "residualGraph",
        action: "destroyRes"
    });
    // build edges
    for(i = 0; i < algTopEdges.length; i++){
        var edge = algTopEdges.get(i);

        animationSteps.push({
            network: "topGraph",
            action: "highlight",
            edge_id: i,
            colour: {color: 'red'}
        });

        cap = getCapacity(edge.label);
        flow = getFlow(edge.label);
        // console.log("to: " + edge.to + ", from: "+ edge.from + ", capacity: " + cap + ", flow: " + flow);
        if((flow > 0) && (flow <= cap)){

            animationSteps.push({
                network: "residualGraph",
                action: "add",
                label: flow,
                edge_id: edgeID++,
                from: edge.to,
                to: edge.from
            });

            edges.push({
                id: algEdgeID++, label: flow, from: edge.to, to: edge.from,
                arrows: {
                    to : {enabled: true}
                },
            });
        }
        if((0 <= flow) && (flow < cap)){

            animationSteps.push({
                network: "residualGraph",
                action: "add",
                label: (cap - flow).toString(),
                edge_id: edgeID++,
                from: edge.from,
                to: edge.to
            });

            edges.push({
                id: algEdgeID++, label: (cap - flow).toString(), from: edge.from, to: edge.to,
                arrows: {
                    to : {enabled: true}
                },
            });
        }
        animationSteps.push({
            network: "topGraph",
            action: "highlight",
            edge_id: i,
            colour: {color: 'blue'}
        });
    }
    // algResNodes.update(nodes);
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
    console.log(parents);
    console.log(nodes.length);

    for(i = 0; i < nodes.length; i++){
        visited[i] = 1;
        queue.push(i);
        while(queue.length > 0){
            x = queue.pop();
            var L = getConnectedNodes(algResData, x, 'to');
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
    console.log(algTopData);
    console.log(algResData);
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
        buildResidualGraph();
        // residualGraph = new vis.Network(resContainer, algResData, options);
       
        for(i in visited) visited[i] = 0;
        path = findPath(visited);
        console.log("path: " + path);
        highlightAugmentingPath(path);
        if(path == -1){
            break;
        } else {
            var m = findMinimumCapacity(algResData, path);
            // console.log("m: " + m);
            for(i = 1; i < path.length; i++){
                var edgeData = findEdgeID(algTopData, path[i-1], path[i]);
                
                id = edgeData.id;
                if(edgeData.direction == 1){
                    var flow = parseInt(getFlow(algTopEdges.get(id).label)) + m;
                    // console.log("forwards, new label: " + algTopEdges.get(i).label);
                }
                if(edgeData.direction == 0){
                    var flow = parseInt(getFlow(algTopEdges.get(i).label)) - m;      // console.log("backwards, new label: " + algTopEdges.get(i).label);
                }
                var label = setFlow(algTopEdges.get(id).label, flow)
                algTopEdges.update([{id: id, label: label}]);
                animationSteps.push({
                    network: "topGraph",
                    action: "label",
                    edge_id: id,
                    label: label
                });
            }
        }
        // network.setData(data);
        // console.log(animationSteps);
        // break;
    }
}
