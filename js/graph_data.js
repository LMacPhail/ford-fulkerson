function defaultGraphData(){
    var nodes = [
        {id: 0, label: 'S', x: -300, y: 0, physics: false},
        {id: 1, label: 'n1', x: -150, y: -140, physics: false},
        {id: 2, label: 'n2', x: 130, y: -130, physics: false},
        {id: 3, label: 'n3', x: -150, y: 130, physics: false},
        {id: 4, label: 'n4', x: 150, y: 140, physics: false},
        {id: 5, label: 'T', x: 300, y: 0, physics: false}
    ];

    var edges = [
        { id: 0, label: '0/2', from: 0, to: 1,
            arrows: { to : {enabled: true}},
        },{ id: 1, label: '0/4', from: 0, to: 3,
            arrows: { to : {enabled: true}},
        },{ id: 2, label: '0/1', from: 1, to: 2,
            arrows: { to : {enabled: true}},
        },{ id: 3, label: '0/3', from: 1, to: 4,
            arrows: { to : {enabled: true}},
        },{ id: 4, label: '0/3', from: 3, to: 2,
            arrows: { to : {enabled: true}},
        },{ id: 5, label: '0/1', from: 3, to: 4,
            arrows: { to : {enabled: true}},
        },{ id: 6, label: '0/1', from: 4, to: 3,
            arrows: { to : {enabled: true}},
        },{ id: 7, label: '0/2', from: 2, to: 5,
            arrows: { to : {enabled: true}},
        },{ id: 8, label: '0/4', from: 4, to: 5,
            arrows: { to : {enabled: true}},
        },
    ];
    var graphData = {
        nodes: nodes,
        edges: edges,
    }
    return graphData;
}

function generateGraphData(N, E){
    var   i,
        edge_id = 0,
        nodes = [],
        edges = [],
        nodesToSink = [],
        leftNodes = [];

    /* initialise nodes */
    nodes.push(
        {id: 0, label: 'S',
            x: -250, // y: Math.random() * 220 + 180,
            physics: false},
    );

    for(i = 1; i < N; i++){
        nodes.push({
            id: i,
            label: 'n' + i,
            physics: false,
        });
    }
    nodesToSink.push(N);
    var rand_id, from, to;

    for(i = N - 1; i > 0; i--){ // go backwards to do S last
        if(i > N-3){
          edges.push({
              id: edge_id++,
              arrows: {to : {enabled: true}},
              label: 0 + '/' + (Math.random() * 10 | 1),
              from: i,
              to: N,
          });
        } else {
          do{
              rand_id = (Math.random() * nodesToSink.length | 0);
          } while (i == nodesToSink[rand_id]);

          console.log("from: " + i);
          console.log("to: " + nodesToSink[rand_id]);

          // connect node to node in nodesToSink or T
          edges.push({
              id: edge_id++,
              arrows: {to : {enabled: true}},
              label: 0 + '/' + (Math.random() * 10 | 1),
              from: i,
              to: nodesToSink[rand_id],
          });
        }

        // add 'from' node to leftNodes
        leftNodes.push(i);

        // if 'to' not != T remove it from leftNodes
        if((nodesToSink[rand_id] != N) && (leftNodes.indexOf(nodesToSink[rand_id]) != -1)){
            leftNodes.splice(leftNodes.indexOf(nodesToSink[rand_id]), 1);
        }
        // add node to nodesToSink
        nodesToSink.push(i);

        console.log("leftNodes: " + leftNodes);
        console.log("nodesToSink: " + nodesToSink);

    }


    // positions = getPositions(nodes.id);
    for(i in leftNodes){
        // rand_id = (Math.random() * (leftNodes.length - 1) + 1 | 0);

        if(i < 2) {
            console.log("from: " + 0);
            console.log("to: " + leftNodes[i]);
            edges.push({
                id: edge_id++,
                arrows: {to: { enabled: true }},
                label: 0 + '/' + (Math.random() * 10 | 1),
                from: 0,
                to: leftNodes[i],
            });
        } else {
            do {
                from = (Math.random() * N | 0);
            } while (leftNodes[o] == from);

            console.log("from: " + from);
            console.log("to: " + leftNodes[i]);
            edges.push({
                id: edge_id++,
                arrows: {to: { enabled: true }},
                label: 0 + '/' + (Math.random() * 10 | 1),
                from: from,
                to: leftNodes[rand_id],
            });


        }
        leftNodes.splice(i, 1);
        console.log("leftNodes: " + leftNodes);
    }

    // add remaining edges
    for (i = edge_id; i < E; i++){
        do {
            from = (Math.random() * N | 0);
            console.log("from: "+ from);
            to = (Math.random() * N + 1 | 0);
            console.log("to: "+ to);
        }
        while (from == to); // there exists an edge with from == from and to == to
        edges.push({
            id: edge_id++,
            arrows: {to : {enabled: true}},
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: from,
            to: to,
        });
    }

    nodes.push({
        id: N, label: 'T',
        x: 300, // y: Math.random() * 220 + 180,
        physics: false
    });


    console.log(nodes);
    console.log(edges);
    var graphData = {
        nodes: nodes,
        edges: edges
    };
    return graphData;
}
