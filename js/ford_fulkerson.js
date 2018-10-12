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


/*
Find a path from S to T

If successful, returns an array of node IDs (in order of the path)
If unsuccessful, returns -1
*/

function findPath(data){

}


function fordFulkerson(data){
  var nodes = data.nodes, edges = data.edges, resEdges = [];
  var resData, path;
  var i;

  for(i = 0; i < edges.length; i++){
    edges[i].label = setFlow(edges[i].label, 0);
  }

  while(true){
    resData = buildResidualGraph(data);
    path = findPath(resData);
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
