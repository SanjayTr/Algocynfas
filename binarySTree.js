function treeInsert(root, newNode){      // CRLS P294 root == T.root, r == x, curr == y, newNode == z 
  var r = root;                        
  var curr = null;                    // y = NIL
  var LastDir = null;
  var adjustList = [];
  var highLightN = [];
  while (r != null){                    // while x != NIL
    curr = r;                          // y = x
    highLightN.push(curr.id);
    if (newNode.key < r.key){          // if z.key < x.key
      if(LastDir == "right"){
         adjustList.push(r);
      }
      r = r.left;                      // x = x.left
      LastDir = "left";
    }
    else{
      if(LastDir == "left"){
         adjustList.push(r);
      }
      r = r.right;                 // else x = x.right
      LastDir = "right";
    }   
  }
  newNode.parent = curr;           // z.p = y
  if (curr == null){               // if y == NIL
    root = newNode;                   // T.root = z
  }
  else if (newNode.key < curr.key){    // else if z.key < y.key
    curr.left = newNode;               // y.left = z;
    newNode.sideToParent = "left";
  }
  else{
    curr.right = newNode;             // else y.right = z
    newNode.sideToParent = "right";
  }

  var result = {
          root: root,
          node: newNode, 
          adj: adjustList,
          hlNodeId: highLightN,
         };

  return result;
}


function treeSearch( root, target, highLightN = []){

  if(!root){
    noticeErr("Node not found!");
    return null;
  }
  
  highLightN.push(root.id);

  if(root.key == target){
    var result = {
      node: root,
      path: highLightN,
    }
    return result;
  }

  if (target < root.key){
    return treeSearch(root.left, target, highLightN);
  }
  return treeSearch(root.right, target, highLightN);

} 

function treeMin(root){
   var highLightN = []
   while (root.left != null){
    highLightN.push(root.id);
    root = root.left;
  }
  highLightN.push(root.id);

  return {
        min: root,
        HLNodeId: highLightN,
  }
}

function treeMax(root){
  var highLightN = []
   while (root.right != null){
    highLightN.push(root.id);
    root = root.right;
  }
  highLightN.push(root.id);
  return {
        max: root,
        HLNodeId: highLightN,
  }
}

function treeSuccessor(node){
   if (node.right){
     var result = treeMin(node.right);
     result.HLNodeId.unshift(node.id);
     return {
      HLNodeId: result.HLNodeId,
      suc: result.min.key,
   };
  }
  var highLightN = [];
  highLightN.push(node.id);
  suc = node.parent;

  while (suc && node == suc.right){
    node = suc;
    highLightN.push(node.id);
    suc = suc.parent; 
  }

  if(suc){
    highLightN.push(suc.id);
    return  {
      HLNodeId: highLightN,
      suc: suc.key,
    };
  }
  else{
    noticeErr("This node is already the largest in the tree!")

  }

}

function treePredecessor(node){
  if (node.left){
     var result = treeMax(node.left);
     result.HLNodeId.unshift(node.id);
     return  {
      HLNodeId: result.HLNodeId,
      pre: result.max.key,
   };
  }
  var highLightN = [];
  highLightN.push(node.id);
  pre = node.parent;

  while (pre && node == pre.left){
    node = pre;
    highLightN.push(node.id);
    pre = pre.parent; 
  }

  if(pre){
    highLightN.push(pre.id);
    return  {
      HLNodeId: highLightN,
      pre: pre.key,
    };
  }
  else{
    noticeErr("This node is already the smallest in the tree!")

  }
}

function treeDelete(root, node, treeNodes){

  var highLightN = [];
  var result = [];
  if (!node.left){
    result = transplant(root,node,node.right,treeNodes);
    treeNodes = result.treeNodes;
    root = result.root;
    if(!node.right){
    }
    else{

    }
  }
  else if(!node.right){
    result = transplant(root,node,node.left,treeNodes);
    treeNodes = result.treeNodes;
    root = result.root;
  }
  else{ 
    var minNode = treeMin(node.right);
    var replaceNode = minNode.min;
    highLightN = minNode.HLNodeId;

    returnNode = replaceNode.parent.key;
    if (replaceNode.parent != node){
      result = transplant(root,replaceNode,replaceNode.right,treeNodes);
      treeNodes = result.treeNodes;
      root = result.root;
      replaceNode.right = node.right;  
      replaceNode.right.parent = replaceNode;
      treeNodes[replaceNode.right.id] = replaceNode.right; 

    }
    result = transplant(root,node,replaceNode,treeNodes,false);
    treeNodes = result.treeNodes;
    root = result.root;
    replaceNode.left = node.left;
    treeNodes[replaceNode.id] = replaceNode;  
    replaceNode.left.parent = replaceNode;
    treeNodes[replaceNode.left.id] = replaceNode.left; 

  }

  return{
    path: highLightN,
    adjust: returnNode,
    newTreeNodes: treeNodes,
    root: root,


  };
}


function transplant(root,toDelete,replace,treeNodes,ifPosition=true){
  var node = toDelete.parent;
  if(!toDelete.parent){
    root = replace;
  }
  else if (toDelete == node.left){
    node.left = replace;
    if(replace){
      node.leftEdge =  
      resetEdge(node.leftEdge,node.leftEdge.source,replace.id.toString());
    }
    else{
      node.leftEdge = null;
    }
    treeNodes[node.id] = node;
  }
  else{
    node.right = replace;
    if (replace) {
      node.rightEdge = 
      resetEdge(node.rightEdge, node.rightEdge.source, replace.id.toString());
    }
     else{
      node.rightEdge = null;
    }
    treeNodes[node.id] = node;
  }
  if(replace){
      if(toDelete.leftEdge && toDelete.left != replace){
        replace.leftEdge =  toDelete.leftEdge;
        replace.leftEdge = 
        resetEdge(replace.leftEdge,replace.id.toString(),replace.leftEdge.target);
      }
      if(toDelete.rightEdge && toDelete.right != replace){
        replace.rightEdge = toDelete.rightEdge;
        replace.rightEdge = 
        resetEdge(replace.rightEdge,replace.id.toString(),replace.rightEdge.target);
      }


    replace.parent = node;
    if(ifPosition){
    replace = resetReplace(replace, toDelete);
    }
    else{
      replace.position = toDelete.position;
      replace.layout.x = replace.position.x;
      replace.layout.y = replace.position.y;
    }
    treeNodes[replace.id] = replace;
    
  }
  return {
          treeNodes: treeNodes,
          root: root,
        };
}


function resetReplace(replace, toDelete){
  var x = toDelete.position.x - replace.position.x;
  var y = toDelete.position.y - replace.position.y;

  if(toDelete.strenchTimes != 0 ){
    if (toDelete.sideToParent == "left"){
       x += 30;
    }
    else{
       x -= 30;
    }
     toDelete.strenchTimes -= 1;
  }
  replace.sideToParent = toDelete.sideToParent;
  replace.strenchTimes = toDelete.strenchTimes;
 
  return  afterDeletePosition(replace,x,y);

}

function resetEdge(edge, source, target){
   edge.id = source + "-" + target;
   edge.source = source;
   edge.target = target;
   return edge;
}



function inorderTreeWalk(root){
   if(root){
    var node = [root.id];
    var edge = [];
    var left = inorderTreeWalk(root.left);
    var right = inorderTreeWalk(root.right);
    node = left.node.concat(node).concat(right.node);
   if(root.leftEdge){    
      edge = edge.concat(left.edge);
      edge.push(root.leftEdge.id);
    } 
    if(root.rightEdge){
      edge.push(root.rightEdge.id);
      edge = edge.concat(right.edge);
    }
    return {
      node: node,
      edge: edge,
  }
}
  return {
    node: [],
    edge: [],
  };
}

function preorderTreeWalk(root){
  if(root){
    var node = [root.id];
    var edge = [];
    var left = preorderTreeWalk(root.left);
    var right = preorderTreeWalk(root.right);
    node = node.concat(left.node).concat(right.node);
    if(root.leftEdge){
      edge.push(root.leftEdge.id);
      edge = edge.concat(left.edge);
    } 
    if(root.rightEdge){
      edge.push(root.rightEdge.id);
      edge = edge.concat(right.edge);
    }
    return {
      node: node,
      edge: edge,
  }
}
  return {
    node: [],
    edge: [],
  };
}

function postorderTreeWalk(root){
  if(root){
    var node = [root.id];
    var edge = [];
    var left = postorderTreeWalk(root.left);
    var right = postorderTreeWalk(root.right);
    node = left.node.concat(right.node).concat(node);

    if(root.leftEdge){
      edge = edge.concat(left.edge);
      edge.push(root.leftEdge.id);
    } 
    if(root.rightEdge){
      
      edge = edge.concat(right.edge);
      edge.push(root.rightEdge.id);
    }
    return {
      node: node,
      edge: edge,
  }
}
  return {
    node: [],
    edge: [],
  };
}

/*
function findAdjustList(root, target, highLightN = []){
  var LastDir = null;
  if(root){
    while (root){
      if(target < root.key){
       if(LastDir == "right"){
         highLightN.push(root.id);
         LastDir = "left"
       }
       root = root.left;
      }

      else{
        if(LastDir == "left"){
         highLightN.push(root.id);
         LastDir = "right"
        }
       root = root.right;
      }

    }
  }
  return highLightN;
} 

*/

function afterDeletePosition(node, x, y){
  console.log("true");
    node.layout.x += x;
    node.position.x += x;
      
    node.layout.y += y;
    node.position.y += y;

    if(node.left){
      this.afterDeletePosition(node.left,x,y);
    }
    if(node.right){
      this.afterDeletePosition(node.right,x,y);
    }
    

    return node;
}










