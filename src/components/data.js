import { colors } from './colors';
import { names, connections } from './team_data.js';

const nodes = [];
const links = [];


const MAIN_NODE_DISTANCE = 200;
const defaultNodeSize =50;
export const MANY_BODY_STRENGTH = -10;
export const textoffset = 40;
export const subtextOffset = 60;
export const imageOffset = 2.25;

const addMainNode = (node, size =defaultNodeSize ) => {
  node.size = defaultNodeSize;
  node.color = colors[node.project];

  nodes.push(node);
};

// const addChildNode = (
//   parentNode,
//   childNode,
//   size = CHILD_NODE_SIZE,
//   distance = DEFAULT_DISTANCE
// ) => {
//   childNode.size = size;
//   childNode.color = parentNode.color;
//   nodes.push(childNode);

//   links.push({
//     source: parentNode,
//     target: childNode,
//     distance,
//     color: parentNode.color,
//   });
// };

// const assembleChildNode = (parentNode, id) => {
//   const childNode = { id, image };
//   addChildNode(parentNode, childNode);
// };

const connectMainNodes = (
  source,
  target,
  relationshipText,
  thickness = 1
) => {
  links.push({
    source,
    target,
    distance: MAIN_NODE_DISTANCE,
    color: source.color,
    relationship: relationshipText,
    thickness,
  });
};

const addMainNodes = () => {
  names.forEach((name) => {
    addMainNode(name);
  });
};

const mapConnections = () => {
  names.forEach((name) => {
    connections.forEach((connection) => {
      if (connection.source === name.id) {
        const target = names.find((n) => n.id === connection.target);
        connectMainNodes(name, target, connection.relationship);
      }
    });
  });
};

addMainNodes();
mapConnections();

export {
  nodes,
  links,
  defaultNodeSize,
  addMainNode,
//   addChildNode,
//   assembleChildNode,
  connectMainNodes,
};
