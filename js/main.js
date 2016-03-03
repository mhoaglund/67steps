var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1', fixed: {
      x:true,
      y:true
    } },
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
]);

// create an array with edges
//can spoof the hubsize organizer by adding bogus self-connections
var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

// create a network
var container = document.getElementById('visbody');
var i = 6;
var j = 5;
var CurrentLayer = 0;

function addTreeLayer(layerno){
    
}

function addNode() {
    var newId = i;
    nodes.add({id:newId, label:""});
    edges.add({from: newId, to: j});
    i++;
    j++;
}
    
    
function addDummyEdge(t) {
    var d = ({
    from: t, 
    to: t, 
    width: 0, 
    color: '#222',
    shadow:{
        enabled: false,
        color: 'rgba(0,0,0,1)',
        size:15,
        x:5,
        y:5
        }
    });
    edges.add(d);
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
        timestep: 0.5,
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
  addNode();
}