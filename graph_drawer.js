// var nodes = new vis.DataSet([
//   {id: 0, label: 'S', x: 10, y: 50,},
//   {id: 1, label: 'a', x: 30, y: 30,},
//   {id: 2, label: 'b', x: 70, y: 30,},
//   {id: 3, label: 'c', x: 30, y: 70,},
//   {id: 4, label: 'd', x: 70, y: 70,},
//   {id: 5, label: 'T', x: 90, y: 50,}
// ]);
var   i,
      edge_id = 0,
      N = 6,
      E = 12,
      nodes = [],
      edges = [];
nodes.push(
  {id: 0, label: 'S',
    physics: false},
  {id: N, label: 'T',
    physics: false}
);

for(i = 1; i < N - 1 ; i++){
  nodes.push({
    id: i,
    label: 'n' + i,
    physics: false
  });
}

for(i = 0; i <= N; i++){
  var j, f1, f2, to1, to2;
    if(i == 0){
      f1 = 0;
      f2 = 0;
      to1 = (Math.random() * N + 1 | 0);
      // console.log("to1: " + to1);
      do {
        to2 = (Math.random() * N + 1 | 0);
        // console.log("to2: " + to2);
      } while (to1==to2);

    } else if (i == N){
      f1 = (Math.random() * N | 0); 
      do {
        f2 = (Math.random() * N | 0);
      } while (f1 == f2);
      to1 = N;
      to2 = N;

    } else {
      /*
      either: from = current node, to = random (ex. S)
      or: from = random (ex. T), to = current node
      */
      var rand_int = (Math.random() * 100 | 0);
      if (rand_int < 50){
        f1 = i;
        do {
          to1 = (Math.random() * N + 1 | 0);
        } while(f1 == to1);
      } else {
        to1 = i;
        do {
          f1 = (Math.random() * N | 0);
        } while(f1 == to1);
      }
      rand_int = (Math.random() * 100 | 0);
      if (rand_int < 50){
        f2 = i;
        do {
          to2 = (Math.random() * N + 1 | 0);
        } while(f2 == to2);
      } else {
        to2 = i;
        do {
          f2 = (Math.random() * N | 0);
        } while(f2 == to2);
      }
    }
    console.log("edge number: " + edge_id);
  
    edges.push({
      id: edge_id++,
      arrows: {
        to : {enabled: true}
      },
      label: 0 + '/' + (Math.random() * 10 | 1),
      from: f1,
      to: to1,
    },{
      id: edge_id++,
      arrows: {
        to : {enabled: true}
      },
      label:  0 + '/' + (Math.random() * 10 | 1),
      from: f2,
      to: to2,
    });
}

for (i = edge_id; i < E; i++){
  var f = (Math.random() * N | 0), 
      t = (Math.random() * N + 1 | 0);
  
  while(f == t){
    t = (Math.random() * (N + 1) | 0);
  }
  edges.push({
    id: edge_id++,
    arrows: {
      to : {enabled: true}
    },
    label: 0 + '/' + (Math.random() * 10 | 1),
    from: f,
    to: t,
  });
}

// create a network
var container = document.getElementById('mynetwork');
var data = {
  nodes: nodes,
  edges: edges
};
var options = {
  layout: {
    improvedLayout:true,
    hierarchical: {
      enabled: false,
      nodeSpacing: 200,
      direction: 'LR',
    }
  },
  physics: {
    stabilization: {
      // onlyDynamicEdges: true,
      fit: true,
    }
  }
  // physics: false,
};
var network = new vis.Network(container, data, options);
