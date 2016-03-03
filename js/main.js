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

function isOdd(num) { return num % 2;}

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
var overlaycontainer = document.getElementById('visoverlay');
var CurrentLayer = 1;
var CurrentIndexStop = 2;
var BroadestLayer = 6;
var network = null;

var ystep = 150; //this is basically ~ layout.levelSeparation
var xstep = 100;//this is basically ~ layout.nodeSpacing
//x=0 is the vertical center of the canvas
//y=0 is the vertical bottom of the canvas

var scrheight = $(window).height();
var scrwidth = $(window).width();
var overlaydivisions = 18;
var overlayWidths = 100 / overlaydivisions;
var shouldCalibrateOverlay = true;
var steptime = 1000;

function calibrateOverlay(){
    if(network == null || !shouldCalibrateOverlay) return;
    var pos = network.getPositions([1,2]);

    for(var i = 0; i< overlaydivisions; i++){
        var $subdiv = $( "<div class='subdivider'/>" );
        var myid = i + 'sd';
        var myleft = (overlayWidths * i).toString() + '%';
        var mybtm = 155 + 'px';
        var mywdth = overlayWidths + '%';
        $subdiv.attr('id', myid);
        $subdiv.css('left', myleft);
        $subdiv.css('bottom', mybtm);
        $subdiv.css('width', mywdth);
        $('#visoverlay').append($subdiv);
    }
    shouldCalibrateOverlay = false;
}

var overlaystep = 0;
var direction = true;
var mqhidden = false;
function shiftOverlay(){
    if(overlaystep == 0){
        clearInterval(intervalID);
        intervalID = null;
        direction = true;
        $('.subdivider').each(function(){
            $(this).css({
                bottom: '155px' }
            );
        });
        $('.marqueeoverlay').fadeTo((steptime/2), 1.0, function(){
            mqhidden = true;
            treeMake();
        });
    }
    if(overlaystep == 10){
        direction = false;
    }
    if(direction){
        $('.subdivider').each(function(){
            var delay = steptime * Math.random();
            $(this).animate({
                bottom: '+=75' }, delay);
        });
        overlaystep++;
        if(overlaystep == 2){
            $('.marqueeoverlay').fadeTo((steptime/2), 0.0, function(){
                mqhidden = false;
            });
        }
    }
    else{
         $('.subdivider').each(function(){
            var delay = steptime * Math.random();
            $(this).animate({
                bottom: '-=75' }, delay);
        });
        overlaystep--;
    }
}

function addTreeLayer(){
    var newNodeIndices = [];
    calibrateOverlay();
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
    CurrentLayer++;
}

function establishEdges(newNodes){
    var linkTo;
    var currWidth = 1;
    if(CurrentLayer == 1 || CurrentLayer == 2) currWidth = 2;
    if(CurrentLayer == 1){
        linkTo = layers.filter(function(obj){
            return obj.layer === CurrentLayer;
        })[0];
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
    
function addDummyEdge(target) {
    var d = ({
    from: target, 
    to: target, 
    hidden: true
    });
    edges.add(d);
}

function addDummyEdges(amount, target) {
    for(var i = 0; i<amount; i++){
        var d = ({
            from: target, 
            to: target, 
            hidden: true
        });
        edges.add(d);
    }
}

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
            gravitationalConstant: -18000,
            centralGravity: 1.25,
            springLength: 95,
            springConstant: 0.05,
            damping: 0.29,
            avoidOverlap: 0.03
        },
        maxVelocity: 30,
        minVelocity: 0.1,
        solver: 'barnesHut',
        stabilization: {
        enabled: true,
        iterations: 40,
        updateInterval: 100,
        onlyDynamicEdges: false,
        fit: false
        },
        timestep: 0.5,
        adaptiveTimestep: true
    }
}

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
    data = {
        nodes: nodes,
        edges: edges
    };
    if(!network) network = new vis.Network(container, data, options);
    else{
        network.setData(data);
    }
    addDummyEdge(1);
    network.on("startStabilizing", function (params) {
        var options = {
        position: {x:0,y:0},
        scale: 0.5,
        locked: true,
        offset: {x:20,y:250},
        animation: false
      };
      network.focus(2, options);
      calibrateOverlay();
    });
    
}

var totalLayers = 10;

var intervalID = window.setInterval(shiftOverlay, steptime);
function treeMake() {
    Init();
    for(var i = 0; i<totalLayers; i++){
        addTreeLayer();
        if(i == 9){
            intervalID = window.setInterval(shiftOverlay, steptime);
        }
    }
}
