(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
require.config({
    paths: {
      vis: 'node_modules/vis/dist/vis.js',
    }
  });
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
    do {
        to2 = (Math.random() * N + 1 | 0);
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

    edges.push({
    id: edge_id++,
    arrows: {
        to : {enabled: true}
    },
    label: 'e' + i,//0 + '/' + (Math.random() * 10 | 1),
    from: f1,
    to: to1,
    },{
    id: edge_id++,
    arrows: {
        to : {enabled: true}
    },
    label: 'e' + i,//0 + '/' + (Math.random() * 10 | 1),
    from: f2,
    to: to2,
    });
}

for (i = N; i < E; i++){
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
},{}]},{},[1]);
