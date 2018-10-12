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
        console.log("capacity: " + cap + ", flow: " + flow);
        resEdges.push({
            id: edgeID++, label: flow, from: edges[i].to, to: edges[i].from,
            arrows: {
                to : {enabled: true}
            },
        });
        }
        if((0 <= flow) && (flow < cap)){
        console.log("capacity: " + cap + ", flow: " + flow + ", cap - flow: " + (cap-flow));
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


function getConnectedNodes(data, nodeId, direction) {
    var nodeList = [];
    if (data.nodes[nodeId] !== undefined) {
      var node = data.nodes[nodeId];
      var nodeObj = {}; // used to quickly check if node already exists
      for (var i = 0; i < data.edges.length; i++) {
        var edge = data.edges[i];
        if (direction !== 'to' && edge.to == node.id) {
          // these are double equals since ids can be numeric or string
          if (nodeObj[edge.from] === undefined) {
            nodeList.push(edge.from);
            nodeObj[edge.from] = true;
          }
        } else if (direction !== 'from' && edge.from == node.id) {
          // these are double equals since ids can be numeric or string
          if (nodeObj[edge.to] === undefined) {
            nodeList.push(edge.to);
            nodeObj[edge.to] = true;
          }
        }
      }
    }
    return nodeList;
}

/*
Find a path from S to T

If successful, returns an array of node IDs (in order of the path)
If unsuccessful, returns -1
*/

function findPath(resData, visited, from, to){
    var i;
    visited[from] = 1;
    var path = [from];
    var toVisit = getConnectedNodes(resData, from, 'to');
    console.log("to visit: " + toVisit);

    if(toVisit.length == 0){
        return -1;
    } else if ( toVisit.indexOf(to) > -1 ) {
        path.push(to);
        return path;
    } else {
        for(i in toVisit){
            if(visited[toVisit[i]] == 1) continue;
            if((next = findPath(resData, visited, toVisit[i], to)) != -1) {
                path.push(next);
                return path;
            } else {
                return -1;
            }
        }
    }

}


function fordFulkerson(data){
    var nodes = data.nodes, edges = data.edges, resEdges = [];
    var resData, residualGraph, path, visited = [];
    var i;

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
        path = findPath(resData, visited, 0, 5);
        console.log("path: " + path);
        break;
        if(path == -1){
            break;
        } else {

        }
    }
    // set all edges flow to 0
    // while(){
    //    build residual graph
    //    find path from S to T
    //    if(path exists)
    //        m = minimum capacity of edges in path
    //        for edges in path:
    //            if edge is forwards, capacity += m
    //            if edge is backwards, capacity -= m
    //    else
    //      break;
    //  }
}
