/* *************************************************************************
 * 
 * Main javascript for the html file 'text_env.html'
 * 
 * Executes the test with the specified numebr of nodes and iterations
 * 
 * 
 * 
 * 
 ***************************************************************************/

// checked in some functions so that you can run graphs not usually allowed
var test = true;

// required for the construction of a network (see main.js)
var options = {
  manipulation: { enabled: false }
};

/**
 * Here you can run the test with the desired number of nodes N and iterations
 * testFF(x, y) where x = N and y = iterations 
 * 
 * !! You may run out of memory if they're too high (N~=50 && iter = 10000) !!
 * !!  Recommend running this several times if testing on high values of N  !!
 */
testFF(30, 1000);


function testFF(n, iter){
  N = n;
  var FFMaxFlow, cutMaxFlow, cut = [], incorrect = 0, i;
  var path = [];
  for(i = 0; i < iter; i++){
    generateRandomGraph();            // creates a new random graph with N nodes
    FFMaxFlow = fordFulkerson();      // Runs Ford-Fulkerson and returns max flow
    cut = findMinimumCut();           // Finds set of edges in a minimum cut
    cutMaxFlow = removeEdgesInCut(cut); // Removes edges in cut from graph, and returns capacity of cut
    path = findPathInTop();           // Attempts to find a path from S to T in graph

    if(path != -1) {
      // If a path has been found then the minimum cut is not a correct cut
      $('body').append('<p>Path has been found, minimum cut is incorect!</p>');
      incorrect++;
      continue;
    }

    if(!(cutMaxFlow == FFMaxFlow)) {
      // Checks the (Max Flow - Min Cut theorem)
      $('body').append('<p>Minimum cut flow = ' + cutMaxFlow + '</p>');
      $('body').append('<p>Ford Fulkerson maximum flow = ' + FFMaxFlow + '</p>');

      // Prints more detailed graph data to console for debugging
      console.log(algTopEdges);
      console.log(algResEdges);
      console.log(resAdjMatrix);
      incorrect++;
    }
  }
  // Works out the percentage of failed tests, and prints out to the user.
  $('body').append('<p>Percentage incorrect = ' + (incorrect / iter)*100 + '</p>');
}

function removeEdgesInCut(cut) {
  var cutFlow = 0;
  for(var i = 0; i < cut.length; i++) {
    var edge = algTopEdges.get(cut[i]);           // retrieve edge from cut
    cutFlow += parseInt(getCapacity(edge.label)); // cutFlow = total sum of capacities in cut
    topAdjMatrix[edge.from][edge.to] = null;      // Removes connection of edge from matrix
    algTopEdges.remove(cut[i]);                   // Removes edge from network
  }
  return cutFlow;
}

/*
 *  Breadth-First search on network
 *  Attempts to find path from S to T
 */
function findPathInTop(){
  var i, j, parents = [], queue = [], visited = [];
  var nodes = topNodes, node, neighbour;
  for(i = 0; i < topNodes.length; i++){ 
    visited[i] = 0;
    parents.push({ node: i, parent: i});
  }
  visited[0] = 1;
  queue.push(0);
  while(queue.length > 0){
      node = queue.shift();
      var neighbours = getConnectedNodes(TOP, node, 'to');
      for(j = 0; j < neighbours.length; j++){
          neighbour = neighbours[j];
          if(visited[neighbour] == 0){
              visited[neighbour] = 1;
              parents[neighbour].parent = node;
              queue.push(neighbour);
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