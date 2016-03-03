//helpers
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

//http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays @pimvdb
function splitUp(arr, n) {
    var rest = arr.length % n, // how much to divide
        restUsed = rest, // to keep track of the division over the elements
        partLength = Math.floor(arr.length / n),
        result = [];

    for(var i = 0; i < arr.length; i += partLength) {
        var end = partLength + i,
            add = false;

        if(rest !== 0 && restUsed) { // should add one element for the division
            end++;
            restUsed--; // we've used one division element now
            add = true;
        }

        result.push(arr.slice(i, end)); // part of the array

        if(add) {
            i++; // also increment i in the case we added an extra element for division
        }
    }

    return result;
}
//end helpers

var nodes = new vis.DataSet([
    {id: 1, label: '', fixed: {x:true,y:true}},
    {id: 2, label: '', fixed: {x:true,y:true}}
]);

var layers = [
    {layer:0, indices:[1]},
    {layer:1, indices:[2]}
];

// create an array with edges
//can spoof the hubsize organizer by adding bogus self-connections
var edges = new vis.DataSet([
    {from: 1, to: 2, width: 4}
]);

var container = document.getElementById('visbody');
var CurrentLayer = 1;
var CurrentIndexStop = 2;
var BroadestLayer = 6;

function Init(){
    container = document.getElementById('visbody');
    i = 6;
    j = 5;
    CurrentLayer = 1;
    CurrentIndexStop = 2;
    BroadestLayer = 6;
    nodes = new vis.DataSet([
        {id: 1, label: '', fixed: {x:true,y:true}},
        {id: 2, label: '', fixed: {x:true,y:true}}
    ]);
    layers = [
        {layer:0, indices:[1]},
        {layer:1, indices:[2]}
    ];
    edges = new vis.DataSet([
        {from: 1, to: 2, width: 4}
    ]);
}

function addTreeLayer(){
    var newNodeIndices = [];
    if(CurrentLayer == 1){
        addDummyEdges((BroadestLayer * 2), 1);
        nodes.add({id: 3, label: ''});
        newNodeIndices.push(3);
        nodes.add({id: 4, label: ''});
        newNodeIndices.push(4);
        nodes.add({id: 5, label: ''});
        newNodeIndices.push(5);
    }
    //TODO: incrementality
    else{
        if(CurrentLayer == 2){
        addDummyEdges(BroadestLayer, 1);
        addDummyEdges(BroadestLayer, 2);
        }
        for (i = 1; i <= BroadestLayer; i++) { 
            var myId = CurrentIndexStop+i;
            nodes.add({id: myId, label: ''});
            newNodeIndices.push(myId);
        }
    }
    CurrentIndexStop = getMaxOfArray(newNodeIndices);
    layers.push({layer: CurrentLayer + 1, indices: newNodeIndices});
    establishEdges(newNodeIndices);
    lockLastLayer();
    // reconcileSorting();
    CurrentLayer++;
}

function establishEdges(newNodes){
    //var splitFactor = (CurrentLayer > 1) ? CurrentLayer/2 : CurrentLayer;
    var linkTo;
    var currWidth = 1;
    if(CurrentLayer == 1){
        linkTo = layers.filter(function(obj){
            return obj.layer === CurrentLayer;
        })[0];
        currWidth = 2;
    }else{
        linkTo = layers.filter(function(obj){
            return obj.layer === CurrentLayer-1;
        })[0];
    }
    
    if(linkTo == null) return;

    for (var i = 0; i < newNodes.length; i++) {
        var linkTarget = linkTo.indices[Math.floor(Math.random()*linkTo.indices.length)];
        edges.add({from: newNodes[i], to: linkTarget, width: currWidth});
    }
}

function lockLastLayer(){
    
}
//TODO: flesh this out so when layers are added, 'weight' is added to existing layers to preserve sorting heirarchy
// function reconcileSorting(){
//     for(var thislayer in layers){
//         if(thislayer.layer < CurrentLayer){
//             thislayer.indices.forEach(
//                 //addDummyEdge(value);
                
//             );
//         }
//     }
// }

function addNode() {
    var newId = i;
    nodes.add({id:newId, label:""});
    edges.add({from: newId, to: j});
    i++;
    j++;
}
    
function addDummyEdge(target) {
    var d = ({
    from: target, 
    to: target, 
    width: 0, 
    color: '#222',
    shadow:{enabled: false}
    });
    edges.add(d);
}

function addDummyEdges(amount, target) {
    for(i = 0; i<amount; i++){
        var d = ({
            from: target, 
            to: target, 
            width: 0, 
            color: '#222',
            shadow:{enabled: false}
        });
        edges.add(d);
    }
}

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    locale: 'en',
    edges:{
        shadow:{
        enabled: true,
        color: 'rgba(0,0,0,1)',
        size:10,
        x:2,
        y:2
        }
    },
    nodes:{
    borderWidth: 1,
    borderWidthSelected: 2,
    brokenImage:undefined,
    color: {
      border: '#888',
      background: '#97C2FC',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      },
      hover: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      }
    },
    fixed: {
      x:false,
      y:false
    },
    font: {
      color: '#888',
      size: 0, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 0, // px
      strokeColor: '#ffffff',
      align: 'horizontal'
    },
    group: undefined,
    hidden: false,
    image: undefined,
    label: undefined,
    labelHighlightBold: true,
    level: undefined,
    mass: 1,
    physics: true,
    shadow:{
      enabled: true,
      color: 'rgba(0,0,0,1)',
      size:15,
      x:5,
      y:5
    },
    shape: 'dot',
    shapeProperties: {
      borderDashes: false, // only for borders
      borderRadius: 6,     // only for box shape
      interpolation: false,  // only for image and circularImage shapes
      useImageSize: false,  // only for image and circularImage shapes
      useBorderWithImage: false  // only for image shape
    },
    size: 2,
    title: undefined,
    value: undefined,
    x: undefined,
    y: undefined
  },
  layout: {
        hierarchical: {
            direction: 'DU',
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            sortMethod: 'hubsize'
        }
    },
    physics:{
        enabled: true,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
        },
        hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 100,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'barnesHut',
        stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 100,
        onlyDynamicEdges: false,
        fit: true
        },
        timestep: 0.9,
        adaptiveTimestep: true
    }
}

var network = new vis.Network(container, data, options);
addDummyEdge(1);
addDummyEdge(1);
network.on("stabilized", function (params) {
    //lock down the bottom of the tree; all nodes except the last set that popped into existance
});
  
var intervalID = window.setInterval(myCallback, 4500);

function myCallback() {
  addTreeLayer();
}
