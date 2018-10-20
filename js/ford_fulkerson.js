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
Takes 2 node ids and finds the id of the edge between them and its direction
direction 0 if backwards, 1 if forwards
*/

function findEdgeID(data, node1, node2){
    var edge;
    var edgeData = {};
    for (var i = 0; i < data.edges.length; i++){
        edge = data.edges[i];
        if((edge.from == node1) && (edge.to == node2)){
            edgeData = {id: edge.id, direction: 1}
            return edgeData;
        }
        if((edge.from == node2) && (edge.to == node1)){
            edgeData = {id: edge.id, direction: 0}
            return edgeData;
        }
    }
}

/*
Find a path from S to T

If successful, returns an array of node IDs (in order of the path)
If unsuccessful, returns -1
*/

function findPath(resData, visited, from, to){
    var i, j;
    visited[from] = 1;
    var path = [from];
    var toVisit = getConnectedNodes(resData, from, 'to');

    if(toVisit.length == 0){
        return -1;
    } else if ( toVisit.indexOf(to) > -1 ) {
        path.push(to);
        return path;
    } else {
        for(i in toVisit){
            if(visited[toVisit[i]] == 1) continue;
            if((next = findPath(resData, visited, toVisit[i], to)) != -1) {
                for(j in next){
                    path.push(next[j]);
                }
                return path;
            } else {
                continue;
            }
        }
        return -1;
    }

}


function fordFulkerson(data){
    var nodes = data.nodes, edges = data.edges, resEdges = [];
    var resData, residualGraph, path, visited = [];
    var animationSteps = [];
    var i, id;

    for(i = 0; i < edges.length; i++){
        edges[i].label = setFlow(edges[i].label, 0);
    }
    for(i in nodes){
        visited.push(0);
    }
    function frame(){
        if(path == -1){
            clearInterval(interval);
        } else {

        }
    }
    while(true){
        resData = buildResidualGraph(data);
        // residualGraph = new vis.Network(resContainer, resData, options);
        animationSteps.push({
          "network": "residualGraph",
          "data": resData,
        });
        for(i in visited) visited[i] = 0;
        path = findPath(resData, visited, 0, nodes.length - 1);
        console.log("path: " + path);
        if(path == -1){
            break;
        } else {
            for(i = 1; i < path.length; i++){
                var edgeData = findEdgeID(data, path[i-1], path[i]);
                id = edgeData.id;
                if(edgeData.direction == 1){
                    var flow = parseInt(getFlow(edges[id].label)) + 1;
                    data.edges[id].label = setFlow(edges[id].label, flow);
                    // console.log("forwards, new label: " + data.edges[id].label);
                }
                if(edgeData.direction == 0){
                    var flow = parseInt(getFlow(edges[id].label)) - 1;
                    data.edges[id].label = setFlow(edges[id].label, flow);
                    // console.log("backwards, new label: " + data.edges[id].label);
                }
            }
        }
        animationSteps.push({
          "network": "network",
          "data": data,
        });
        // network.setData(data);
    }
    animate(animationSteps);
}
