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
  // for edges:
  //    cap = getCapacity(edge.label);
  //    flow = getCapacity(edge.label);
  //    if(0 < flow <= cap) add backwards edge w/ flow = flow
  //    if(0 <= flow < cap) add forwards edge w/ flow = cap-flow
  // return residualGraphData
  var graphData = {
      nodes: resNodes,
      edges: resEdges,
  }

  return graphData;
}

function fordFulkerson(){
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
