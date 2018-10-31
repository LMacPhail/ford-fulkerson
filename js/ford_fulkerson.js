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

function buildResidualGraph(data){
    var resNodes = data.nodes, edges = data.edges, resEdges = [];
    var cap, flow, edgeID = 0, i;

    // build edges
    for(i = 0; i < edges.length; i++){
        cap = getCapacity(edges[i].label);
        flow = getFlow(edges[i].label);
        if((flow > 0) && (flow <= cap)){
        resEdges.push({
            id: edgeID++, label: flow, from: edges[i].to, to: edges[i].from,
            arrows: {
                to : {enabled: true}
            },
        });
        }
        if((0 <= flow) && (flow < cap)){
        resEdges.push({
            id: edgeID++, label: (cap - flow).toString(), from: edges[i].from, to: edges[i].to,
            arrows: {
                to : {enabled: true}
            },
        });
        }
    }

    var graphData = {
        nodes: resNodes,
        edges: resEdges,
    }

    return graphData;
}



/*
Find a path from S to T

If successful, returns an array of node IDs (in order of the path)
If unsuccessful, returns -1
*/

function findPath(resData, visited){
    var i, j, parents = [], queue = [];
    var nodes = resData.nodes;
    var x, y;

    for(i = 0; i < nodes.length; i++){
        parents.push({
            node: i,
            parent: i,
        });
    }
    console.log(parents);

    for(i = 0; i < nodes.length; i++){
        visited[i] = 1;
        queue.push(i);
        while(queue.length > 0){
            x = queue.pop();
            var L = getConnectedNodes(resData, x, 'to');
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
            edge = data.edges[j];
            if((edge.from == from) && (edge.to == to)){
                capacity = parseInt(edge.label);
                if((minCap == 0)||(capacity < minCap)) minCap = capacity;
            }
        }
    }
    return minCap;
}


function fordFulkerson(data){
    var nodes = data.nodes, edges = data.edges, resEdges = [];
    var residualGraph, path, visited = [];
    var animationStep;
    var i, id;
    var counter = 0;

    for(i = 0; i < edges.length; i++){
        edges[i].label = setFlow(edges[i].label, 0);
    }
    for(i in nodes){
        visited.push(0);
    }
    while(true){
        resData = buildResidualGraph(data);
        residualGraph = new vis.Network(resContainer, resData, options);
       
        for(i in visited) visited[i] = 0;
        path = findPath(resData, visited);
        console.log("path: " + path);
        residualGraph.setData(highlightAugmentingPath(path));
        // animationSteps.concat(highlightAugmentingPath(path));
        if(path == -1){
            break;
        } else {
            var m = findMinimumCapacity(resData, path);
            // console.log("m: " + m);
            for(i = 1; i < path.length; i++){
                var edgeData = findEdgeID(data, path[i-1], path[i]);
                id = edgeData.id;
                if(edgeData.direction == 1){
                    var flow = parseInt(getFlow(edges[id].label)) + m;
                    data.edges[id].label = setFlow(edges[id].label, flow);
                    // console.log("forwards, new label: " + data.edges[id].label);
                }
                if(edgeData.direction == 0){
                    var flow = parseInt(getFlow(edges[id].label)) - m;
                    data.edges[id].label = setFlow(edges[id].label, flow);
                    // console.log("backwards, new label: " + data.edges[id].label);
                }
            }
        }
        network.setData(data);
        break;
    }
}
