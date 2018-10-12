function defaultGraphData(){
    var nodes = [
        {
            id: 0, label: 'S', x: -300, y: 0, physics: false
        },{
            id: 1, label: 'a', x: -150, y: -140, physics: false
        },{
            id: 2, label: 'b', x: 130, y: -130, physics: false
        },{
            id: 3, label: 'c', x: -150, y: 130, physics: false
        },{
            id: 4, label: 'd', x: 150, y: 140, physics: false
        },{
            id: 5, label: 'T', x: 300, y: 0, physics: false
        }
    ];

    var edges = [
        {
            id: 0, label: '0/2', from: 0, to: 1,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 1, label: '0/4', from: 0, to: 3,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 2, label: '0/1', from: 1, to: 2,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 3, label: '0/3', from: 1, to: 4,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 4, label: '0/3', from: 3, to: 2,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 5, label: '0/1', from: 3, to: 4,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 6, label: '0/1', from: 4, to: 3,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 7, label: '0/2', from: 2, to: 5,
            arrows: {
                to : {enabled: true}
            },
        },{
            id: 8, label: '0/4', from: 4, to: 5,
            arrows: {
                to : {enabled: true}
            },
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
        {id: N, label: 'T',
            x: 300, // y: Math.random() * 220 + 180,
            physics: false},
    );

    for(i = 1; i < N; i++){
        nodes.push({
            id: i,
            label: 'n' + i,
            physics: false,
        // x: (Math.random() * 490 - 230),
        });
    }
    nodesToSink.push(N);
    var rand_id, from, to;

    for(i = N - 1; i >= 1; i--){ // go backwards to do S last
        rand_id = (Math.random() * nodesToSink.length | 0);
        // connect node to node in nodesToSink or T
        // console.log("from: " + i);
        // console.log("to: " + nodesToSink[rand_id]);
        edges.push({
            id: edge_id++,
            arrows: {
            to : {enabled: true}
            },
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: i,
            to: nodesToSink[rand_id],
        });

        // add 'from' node to leftNodes
        leftNodes.push(i);

        // if connecting to !T remove 'to' node from leftNodes
        if((nodesToSink[rand_id] != N) && (leftNodes.indexOf(nodesToSink[rand_id]) != -1)){
            leftNodes.splice(leftNodes.indexOf(nodesToSink[rand_id]), 1);
        }

        // add node to nodesToSink
        nodesToSink.push(i);

        //also make node.x < T.x
    }

    console.log(leftNodes);

    // positions = getPositions(nodes.id);
    while(leftNodes.length > 2){

        rand_id = (Math.random() * leftNodes.length + 1 | 0);

        do {
            from = (Math.random() * N | 0);
        } while (leftNodes[rand_id] == from);

        // console.log("from: " + from);
        // console.log("to: " + leftNodes[rand_id]);

        edges.push({
            id: edge_id++,
            arrows: {
                to: { enabled: true }
            },
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: from,
            to: leftNodes[rand_id],
        });

        leftNodes.splice(rand_id, 1);
    }

    // Make sure S has at least 2 outgoing nodes
    for(i = 0; i < 2; i++){
        edges.push({
            id: edge_id++,
            arrows: {
                to: { enabled: true }
            },
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: 0,
            to: leftNodes[i],
        });
    }

    // add remaining edges
    for (i = edge_id; i < E; i++)
        do {
            from = (Math.random() * N | 0);
            console.log("from: "+ from);
            to = (Math.random() * N + 1 | 0);
            console.log("to: "+ to);
        }
        while (edges.includes({from:from, to:to}) && (from == to)); // there exists an edge with from == from and to == to
        edges.push({
            id: edge_id++,
            arrows: {
                to : {enabled: true}
            },
            label: 0 + '/' + (Math.random() * 10 | 1),
            from: from,
            to: to,
        });

    // for (i = edge_id; i < E; i++){
    //     var from = (Math.random() * N | 0),
    //         to = (Math.random() * N + 1 | 0);

    //     do {
    //         to = (Math.random() * N + 1 | 0);
    //     } while(from == to);

    //     edges.push({
    //         id: edge_id++,
    //         arrows: {
    //         to : {enabled: true}
    //         },
    //         label: 0 + '/' + (Math.random() * 10 | 1),
    //         from: from,
    //         to: to,
    //     });
    // }
    var graphData = {
        nodes: nodes,
        edges: edges
    };
    return graphData;
}
