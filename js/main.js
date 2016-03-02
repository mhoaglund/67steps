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
    {from: 1, to: 1, width: 0, color: '#222'},
    {from: 1, to: 1, width: 0, color: '#222'},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

// create a network
var container = document.getElementById('visbody');
var i = 6;
var j = 5;

function addNode() {
        var newId = i;
        nodes.add({id:newId, label:""});
        edges.add({from: newId, to: j});
        i++;
        j++;
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
    nodes:{
    borderWidth: 1,
    borderWidthSelected: 2,
    brokenImage:undefined,
    color: {
      border: '#2B7CE9',
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
      color: '#343434',
      size: 14, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 0, // px
      strokeColor: '#ffffff',
      align: 'horizontal'
    },
    group: undefined,
    hidden: false,
    icon: {
      face: 'FontAwesome',
      code: undefined,
      size: 50,  //50,
      color:'#2B7CE9'
    },
    image: undefined,
    label: undefined,
    labelHighlightBold: true,
    level: undefined,
    mass: 1,
    physics: true,
    shadow:{
      enabled: false,
      color: 'rgba(0,0,0,0.5)',
      size:10,
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
    size: 25,
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
    }
    // configure: {...},    // defined in the configure module.
    // edges: {...},        // defined in the edges module.
    // groups: {...},       // defined in the groups module.
    // layout: {...},       // defined in the layout module.
    // interaction: {...},  // defined in the interaction module.
    // manipulation: {...}, // defined in the manipulation module.
    // physics: {...},      // defined in the physics module.
}
// initialize your network!
var network = new vis.Network(container, data, options);
var intervalID = window.setInterval(myCallback, 4500);

function myCallback() {
  addNode();
}