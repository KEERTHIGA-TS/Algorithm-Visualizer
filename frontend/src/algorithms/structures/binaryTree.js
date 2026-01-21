// // src/algorithms/structures/binaryTree.js - SYNCHRONIZED PSEUDOCODE HIGHLIGHTING
// import { sleep } from "../../utils/sleep.js";

// /* =====================================================
//    PSEUDOCODE - ALL OPERATIONS
// ===================================================== */
// export const insertPseudo = [
//   "1. If tree is empty, create root",     
//   "2. Compare value with current node",   
//   "3. If value < node, go left",          
//   "4. If value > node, go right",         
//   "5. Repeat until empty spot found"      
// ];

// export const deletePseudo = [
//   "1. Search node to delete",
//   "2. If leaf node → remove directly",
//   "3. If one child → replace with child",
//   "4. If two children → find inorder successor",
//   "5. Replace value and delete successor"
// ];

// export const searchPseudo = [
//   "1. Start at root",                     
//   "2. If value == node, return FOUND",    
//   "3. If value < node, search left",      
//   "4. If value > node, search right",     
//   "5. If null, return NOT FOUND"          
// ];

// export const inorderPseudo = [
//   "1. Traverse left subtree",             
//   "2. Visit current node",                
//   "3. Traverse right subtree"             
// ];

// export const preorderPseudo = [
//   "1. Visit current node",                
//   "2. Traverse left subtree",             
//   "3. Traverse right subtree"             
// ];

// export const postorderPseudo = [
//   "1. Traverse left subtree",             
//   "2. Traverse right subtree",            
//   "3. Visit current node"                 
// ];

// export const findMinPseudo = [
//   "1. Start at root",                     
//   "2. Go left until no left child",       
//   "3. Return that node"                   
// ];

// export const findMaxPseudo = [
//   "1. Start at root",                     
//   "2. Go right until no right child",     
//   "3. Return that node"                   
// ];

// /* =====================================================
//    BINARY TREE OPERATIONS - SYNCED HIGHLIGHTING
// ===================================================== */

// /* ---------- INSERT ---------- */
// export async function insertOp({
//   arr, value, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   setCurrentLine(0);
//   setExplanation("Checking if tree is empty...");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   if (arr.length === 0) {
//     setExplanation("Tree is empty - creating root node");
//     const newArr = [{ value, left: null, right: null }];
//     setStructure(newArr);
//     setColors({ 0: "active" });
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     setExplanation(`✅ Root node created with value ${value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     setCurrentLine(null);
//     return;
//   }

//   setCurrentLine(1);
//   let curr = 0;
//   const newArr = [...arr];
//   setColors({ [curr]: "current" });
//   setExplanation(`Comparing ${value} with current node ${newArr[curr].value}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   while (curr < newArr.length && !shouldStopRef.current) {
//     if (value < newArr[curr].value) {
//       setCurrentLine(2);
//       setColors({ [curr]: "current" });
//       setExplanation(`${value} < ${newArr[curr].value}, going left`);
//       incrementStep();
//       await sleep(speedRef.current, pauseRef, shouldStopRef);

//       if (newArr[curr].left === null) {
//         setCurrentLine(4);
//         const newIndex = newArr.length;
//         newArr.push({ value, left: null, right: null });
//         newArr[curr].left = newIndex;
//         setStructure(newArr);
//         setColors({ [curr]: "visited", [newIndex]: "active" });
//         setExplanation(`Empty spot found! Inserting ${value} as left child`);
//         incrementStep();
//         await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//         setCurrentLine(null);
//         return;
//       }

//       setColors({ [curr]: "visited" });
//       curr = newArr[curr].left;

//       setCurrentLine(1);
//       setColors({ [curr]: "current" });
//       setExplanation(`Comparing ${value} with current node ${newArr[curr].value}`);
//       incrementStep();
//       await sleep(speedRef.current, pauseRef, shouldStopRef);

//     } else if (value > newArr[curr].value) {
//       setCurrentLine(3);
//       setColors({ [curr]: "current" });
//       setExplanation(`${value} > ${newArr[curr].value}, going right`);
//       incrementStep();
//       await sleep(speedRef.current, pauseRef, shouldStopRef);

//       if (newArr[curr].right === null) {
//         setCurrentLine(4);
//         const newIndex = newArr.length;
//         newArr.push({ value, left: null, right: null });
//         newArr[curr].right = newIndex;
//         setStructure(newArr);
//         setColors({ [curr]: "visited", [newIndex]: "active" });
//         setExplanation(`Empty spot found! Inserting ${value} as right child`);
//         incrementStep();
//         await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//         setCurrentLine(null);
//         return;
//       }

//       setColors({ [curr]: "visited" });
//       curr = newArr[curr].right;

//       setCurrentLine(1);
//       setColors({ [curr]: "current" });
//       setExplanation(`Comparing ${value} with current node ${newArr[curr].value}`);
//       incrementStep();
//       await sleep(speedRef.current, pauseRef, shouldStopRef);

//     } else {
//       setCurrentLine(null);
//       setColors({ [curr]: "active" });
//       setExplanation(`❌ Duplicate value ${value} found - not inserting`);
//       incrementStep();
//       await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//       return;
//     }
//   }
// }

// /* ---------- DELETE ---------- */
// export async function deleteOp({
//   arr, key, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   if (arr.length === 0) {
//     setExplanation("Tree is empty");
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation(`Searching for ${key} to delete`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   let curr = 0;
//   let parent = null;
//   let isLeftChild = false;

//   while (curr !== null && curr < arr.length) {
//     setColors({ [curr]: "current" });
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     if (arr[curr].value === key) break;

//     parent = curr;
//     setColors({ [curr]: "visited" });

//     if (key < arr[curr].value) {
//       isLeftChild = true;
//       curr = arr[curr].left;
//     } else {
//       isLeftChild = false;
//       curr = arr[curr].right;
//     }
//   }

//   if (curr == null || curr >= arr.length) {
//     setExplanation(`❌ ${key} not found`);
//     incrementStep();
//     setCurrentLine(null);
//     return;
//   }

//   const node = arr[curr];

//   if (node.left === null && node.right === null) {
//     setCurrentLine(1);
//     setExplanation("Node is a leaf → removing it");
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     if (parent !== null) {
//       if (isLeftChild) arr[parent].left = null;
//       else arr[parent].right = null;
//     } else {
//       arr.splice(0, 1);
//     }
//   } else if (node.left === null || node.right === null) {
//     setCurrentLine(2);
//     setExplanation("Node has one child → replacing it");
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     const child = node.left ?? node.right;

//     if (parent !== null) {
//       if (isLeftChild) arr[parent].left = child;
//       else arr[parent].right = child;
//     } else {
//       arr[0] = arr[child];
//     }
//   } else {
//     setCurrentLine(3);
//     setExplanation("Node has two children. Finding inorder successor...");
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     let succParent = curr;
//     let succ = node.right;

//     while (arr[succ].left !== null) {
//       succParent = succ;
//       succ = arr[succ].left;

//       setColors({ [succ]: "current" });
//       await sleep(speedRef.current, pauseRef, shouldStopRef);
//     }

//     setCurrentLine(4);
//     setExplanation(`Inorder successor found: ${arr[succ].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     arr[curr].value = arr[succ].value;

//     if (succParent !== curr)
//       arr[succParent].left = arr[succ].right;
//     else
//       arr[succParent].right = arr[succ].right;
//   }

//   setStructure([...arr]);
//   setColors({});
//   setCurrentLine(null);
//   setExplanation(`✅ ${key} deleted successfully`);
//   incrementStep();
// }

// /* ---------- SEARCH ---------- */
// export async function searchOp({
//   arr, key, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   if (arr.length === 0) {
//     setCurrentLine(4);
//     setExplanation("Tree is empty - value not found");
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     setCurrentLine(null);
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation(`Starting search for ${key} at root`);
//   incrementStep();
//   let curr = 0;
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   while (curr !== null && curr < arr.length && !shouldStopRef.current) {
//     setCurrentLine(1);
//     setColors({ [curr]: "current" });
//     setExplanation(`Checking if ${arr[curr].value} == ${key}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     if (arr[curr].value === key) {
//       setColors({ [curr]: "active" });
//       setExplanation(`✅ Found ${key} at this node!`);
//       incrementStep();
//       await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//       setCurrentLine(null);
//       return;
//     }

//     setColors({ [curr]: "visited" });

//     if (key < arr[curr].value) {
//       setCurrentLine(2);
//       setExplanation(`${key} < ${arr[curr].value}, searching left subtree`);
//       incrementStep();
//       await sleep(speedRef.current, pauseRef, shouldStopRef);
//       curr = arr[curr].left;
//     } else {
//       setCurrentLine(3);
//       setExplanation(`${key} > ${arr[curr].value}, searching right subtree`);
//       incrementStep();
//       await sleep(speedRef.current, pauseRef, shouldStopRef);
//       curr = arr[curr].right;
//     }
//   }

//   setCurrentLine(4);
//   setExplanation(`❌ Reached null - ${key} not found in tree`);
//   incrementStep();
//   setColors({});
//   await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//   setCurrentLine(null);
// }

// /* ---------- INORDER ---------- */
// async function inorderHelper(arr, nodeIdx, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep) {
//   if (nodeIdx === null || nodeIdx >= arr.length || shouldStopRef.current) return;

//   if (arr[nodeIdx].left !== null) {
//     setCurrentLine(0);
//     setColors({ [nodeIdx]: "current" });
//     setExplanation(`Traversing left subtree of ${arr[nodeIdx].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     await inorderHelper(arr, arr[nodeIdx].left, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
//   }

//   setCurrentLine(1);
//   setColors({ [nodeIdx]: "current" });
//   setExplanation(`Visiting current node: ${arr[nodeIdx].value}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   visited.push(arr[nodeIdx].value);
//   setColors({ [nodeIdx]: "visited" });

//   if (arr[nodeIdx].right !== null) {
//     setCurrentLine(2);
//     setColors({ [nodeIdx]: "current" });
//     setExplanation(`Traversing right subtree of ${arr[nodeIdx].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     await inorderHelper(arr, arr[nodeIdx].right, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
//   }
// }

// export async function inorderOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
//   if (arr.length === 0) {
//     setExplanation("Tree is empty - nothing to traverse");
//     incrementStep();
//     return;
//   }

//   setColors({});
//   setExplanation("Starting inorder traversal (Left → Root → Right)");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const visited = [];
//   await inorderHelper(arr, 0, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);

//   setCurrentLine(null);
//   setColors({});
//   setExplanation(`✅ Inorder traversal complete: ${visited.join(", ")}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
// }

// /* ---------- PREORDER ---------- */
// async function preorderHelper(arr, nodeIdx, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep) {
//   if (nodeIdx === null || nodeIdx >= arr.length || shouldStopRef.current) return;

//   // LINE 0: Visit node
//   setCurrentLine(0);
//   setColors({ [nodeIdx]: "current" });
//   setExplanation(`Visiting current node: ${arr[nodeIdx].value}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   visited.push(arr[nodeIdx].value);
//   setColors({ [nodeIdx]: "visited" });

//   // LINE 1: Left subtree
//   if (arr[nodeIdx].left !== null) {
//     setCurrentLine(1);
//     setExplanation(`Traversing left subtree of ${arr[nodeIdx].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     await preorderHelper(arr, arr[nodeIdx].left, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
//   }

//   // LINE 2: Right subtree
//   if (arr[nodeIdx].right !== null) {
//     setCurrentLine(2);
//     setExplanation(`Traversing right subtree of ${arr[nodeIdx].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     await preorderHelper(arr, arr[nodeIdx].right, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
//   }
// }

// export async function preorderOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
//   if (arr.length === 0) {
//     setExplanation("Tree is empty - nothing to traverse");
//     incrementStep();
//     return;
//   }

//   setColors({});
//   setExplanation("Starting preorder traversal (Root → Left → Right)");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const visited = [];
//   await preorderHelper(arr, 0, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);

//   setCurrentLine(null);
//   setColors({});
//   setExplanation(`✅ Preorder traversal complete: ${visited.join(", ")}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
// }

// /* ---------- POSTORDER ---------- */
// async function postorderHelper(arr, nodeIdx, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep) {
//   if (nodeIdx === null || nodeIdx >= arr.length || shouldStopRef.current) return;

//   // LINE 0: Left subtree
//   if (arr[nodeIdx].left !== null) {
//     setCurrentLine(0);
//     setExplanation(`Traversing left subtree of ${arr[nodeIdx].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     await postorderHelper(arr, arr[nodeIdx].left, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
//   }

//   // LINE 1: Right subtree
//   if (arr[nodeIdx].right !== null) {
//     setCurrentLine(1);
//     setExplanation(`Traversing right subtree of ${arr[nodeIdx].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     await postorderHelper(arr, arr[nodeIdx].right, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
//   }

//   // LINE 2: Visit node
//   setCurrentLine(2);
//   setColors({ [nodeIdx]: "current" });
//   setExplanation(`Visiting current node: ${arr[nodeIdx].value}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   visited.push(arr[nodeIdx].value);
//   setColors({ [nodeIdx]: "visited" });
// }

// export async function postorderOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
//   if (arr.length === 0) {
//     setExplanation("Tree is empty - nothing to traverse");
//     incrementStep();
//     return;
//   }

//   setColors({});
//   setExplanation("Starting postorder traversal (Left → Right → Root)");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const visited = [];
//   await postorderHelper(arr, 0, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);

//   setCurrentLine(null);
//   setColors({});
//   setExplanation(`✅ Postorder traversal complete: ${visited.join(", ")}`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
// }

// /* ---------- FIND MIN ---------- */
// export async function findMinOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
//   if (arr.length === 0) {
//     setExplanation("Tree is empty");
//     incrementStep();
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("Starting at root to find minimum value");
//   incrementStep();
//   let curr = 0;
//   setColors({ [curr]: "current" });
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   while (arr[curr]?.left !== null && !shouldStopRef.current) {
//     setCurrentLine(1);
//     setColors({ [curr]: "visited" });
//     setExplanation(`Going left from ${arr[curr].value} (minimum is in left subtree)`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     curr = arr[curr].left;
//     setColors({ [curr]: "current" });
//   }

//   setCurrentLine(2);
//   setColors({ [curr]: "active" });
//   setExplanation(`✅ Minimum value found: ${arr[curr].value}`);
//   incrementStep();
//   await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//   setCurrentLine(null);
// }

// /* ---------- FIND MAX ---------- */
// export async function findMaxOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
//   if (arr.length === 0) {
//     setExplanation("Tree is empty");
//     incrementStep();
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("Starting at root to find maximum value");
//   incrementStep();
//   let curr = 0;
//   setColors({ [curr]: "current" });
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   while (arr[curr]?.right !== null && !shouldStopRef.current) {
//     setCurrentLine(1);
//     setColors({ [curr]: "visited" });
//     setExplanation(`Going right from ${arr[curr].value} (maximum is in right subtree)`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     curr = arr[curr].right;
//     setColors({ [curr]: "current" });
//   }

//   setCurrentLine(2);
//   setColors({ [curr]: "active" });
//   setExplanation(`✅ Maximum value found: ${arr[curr].value}`);
//   incrementStep();
//   await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
//   setCurrentLine(null);
// }

// src/algorithms/structures/binaryTree.js - SYNCHRONIZED PSEUDOCODE HIGHLIGHTING
import { sleep } from "../../utils/sleep.js";

/* =====================================================
   PSEUDOCODE - ALL OPERATIONS
===================================================== */
export const insertPseudo = [
  "1. If tree is empty, create root",
  "2. Compare value with current node",
  "3. If value < node, go left",
  "4. If value > node, go right",
  "5. Repeat until empty spot found"
];

export const deletePseudo = [
  "1. Search node to delete",
  "2. If leaf node → remove directly",
  "3. If one child → replace with child",
  "4. If two children → find inorder successor",
  "5. Replace value and delete successor"
];

export const searchPseudo = [
  "1. Start at root",
  "2. If value == node, return FOUND",
  "3. If value < node, search left",
  "4. If value > node, search right",
  "5. If null, return NOT FOUND"
];

export const inorderPseudo = [
  "1. Traverse left subtree",
  "2. Visit current node",
  "3. Traverse right subtree"
];

export const preorderPseudo = [
  "1. Visit current node",
  "2. Traverse left subtree",
  "3. Traverse right subtree"
];

export const postorderPseudo = [
  "1. Traverse left subtree",
  "2. Traverse right subtree",
  "3. Visit current node"
];

export const findMinPseudo = [
  "1. Start at root",
  "2. Go left until no left child",
  "3. Return that node"
];

export const findMaxPseudo = [
  "1. Start at root",
  "2. Go right until no right child",
  "3. Return that node"
];

/* =====================================================
   BINARY TREE OPERATIONS - SYNCED HIGHLIGHTING
===================================================== */

/* ---------- INSERT ---------- */
export async function insertOp({
  arr, value, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  setCurrentLine(0);
  setExplanation("Checking if tree is empty...");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  if (arr.length === 0) {
    setExplanation("Tree is empty - creating root node");
    incrementStep();
    const newArr = [{ value, left: null, right: null }];
    setStructure(newArr);
    setColors({ 0: "active" });
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    setExplanation(`✅ Root node created with value ${value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    setCurrentLine(null);
    return;
  }

  setCurrentLine(1);
  let curr = 0;
  // ✅ Create a NEW array with NEW objects
  const newArr = arr.map(node => ({ ...node }));

  setColors({ [curr]: "current" });
  setExplanation(`Comparing ${value} with current node ${newArr[curr].value}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  while (curr < newArr.length && !shouldStopRef.current) {
    if (value < newArr[curr].value) {
      setCurrentLine(2);
      setColors({ [curr]: "current" });
      setExplanation(`${value} < ${newArr[curr].value}, going left`);
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);

      if (newArr[curr].left === null) {
        setCurrentLine(4);
        const newIndex = newArr.length;
        newArr.push({ value, left: null, right: null });
        newArr[curr].left = newIndex;
        setStructure(newArr);
        setColors({ [curr]: "visited", [newIndex]: "active" });
        setExplanation(`Empty spot found! Inserting ${value} as left child`);
        incrementStep();
        await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
        setCurrentLine(null);
        return;
      }

      setColors({ [curr]: "visited" });
      curr = newArr[curr].left;
      incrementStep();

      // ✅ Add safety check
      if (curr >= newArr.length || !newArr[curr]) break;

      setCurrentLine(1);
      setColors({ [curr]: "current" });
      setExplanation(`Comparing ${value} with current node ${newArr[curr].value}`);
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);

    } else if (value > newArr[curr].value) {
      setCurrentLine(3);
      setColors({ [curr]: "current" });
      setExplanation(`${value} > ${newArr[curr].value}, going right`);
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);

      if (newArr[curr].right === null) {
        setCurrentLine(4);
        const newIndex = newArr.length;
        newArr.push({ value, left: null, right: null });
        newArr[curr].right = newIndex;
        setStructure(newArr);
        setColors({ [curr]: "visited", [newIndex]: "active" });
        setExplanation(`Empty spot found! Inserting ${value} as right child`);
        incrementStep();
        await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
        setCurrentLine(null);
        return;
      }

      setColors({ [curr]: "visited" });
      curr = newArr[curr].right;
      incrementStep();

      // ✅ Add safety check
      if (curr >= newArr.length || !newArr[curr]) break;

      setCurrentLine(1);
      setColors({ [curr]: "current" });
      setExplanation(`Comparing ${value} with current node ${newArr[curr].value}`);
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);

    } else {
      setCurrentLine(null);
      setColors({ [curr]: "active" });
      setExplanation(`❌ Duplicate value ${value} found - not inserting`);
      incrementStep();
      await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
      return;
    }
  }
}

/* ---------- DELETE ---------- */
export async function deleteOp({
  arr, key, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setExplanation("Tree is empty");
    incrementStep();
    return;
  }

  // ✅ Create deep copy at the start
  const newArr = arr.map(node => ({ ...node }));

  setCurrentLine(0);
  setExplanation(`Searching for ${key} to delete`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  let curr = 0;
  let parent = null;
  let isLeftChild = false;

  while (curr !== null && curr < newArr.length) {  // ✅ Use newArr
    setColors({ [curr]: "current" });
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    if (newArr[curr].value === key) break;  // ✅ Use newArr

    parent = curr;
    setColors({ [curr]: "visited" });

    if (key < newArr[curr].value) {  // ✅ Use newArr
      isLeftChild = true;
      curr = newArr[curr].left;  // ✅ Use newArr
    } else {
      isLeftChild = false;
      curr = newArr[curr].right;  // ✅ Use newArr
    }
    incrementStep();
  }

  if (curr == null || curr >= arr.length) {
    setExplanation(`❌ ${key} not found`);
    incrementStep();
    setCurrentLine(null);
    return;
  }

  const node = arr[curr];

  if (node.left === null && node.right === null) {
    setCurrentLine(1);
    setExplanation("Node is a leaf → removing it");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    if (parent !== null) {
      if (isLeftChild) arr[parent].left = null;
      else arr[parent].right = null;
    } else {

    }
    incrementStep();
  } else if (node.left === null || node.right === null) {
    setCurrentLine(2);
    setExplanation("Node has one child → replacing it");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    const child = node.left ?? node.right;

    if (parent !== null) {
      if (isLeftChild) arr[parent].left = child;
      else arr[parent].right = child;
    } else {

    }
    incrementStep();
  } else {
    setCurrentLine(3);
    setExplanation("Node has two children. Finding inorder successor...");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    let succParent = curr;
    let succ = node.right;

    while (arr[succ].left !== null) {
      succParent = succ;
      succ = arr[succ].left;

      setColors({ [succ]: "current" });
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);
    }

    setCurrentLine(4);
    setExplanation(`Inorder successor found: ${arr[succ].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    arr[curr].value = arr[succ].value;

    if (succParent !== curr)
      arr[succParent].left = arr[succ].right;
    else
      arr[succParent].right = arr[succ].right;

    incrementStep();
  }

  setStructure([...arr]);
  setColors({});
  setCurrentLine(null);
  setExplanation(`✅ ${key} deleted successfully`);
  incrementStep();
}

/* ---------- SEARCH ---------- */
export async function searchOp({
  arr, key, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setCurrentLine(4);
    setExplanation("Tree is empty - value not found");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    setCurrentLine(null);
    return;
  }

  setCurrentLine(0);
  setExplanation(`Starting search for ${key} at root`);
  incrementStep();
  let curr = 0;
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  while (curr !== null && curr < arr.length && !shouldStopRef.current) {
    setCurrentLine(1);
    setColors({ [curr]: "current" });
    setExplanation(`Checking if ${arr[curr].value} == ${key}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    if (arr[curr].value === key) {
      setColors({ [curr]: "active" });
      setExplanation(`✅ Found ${key} at this node!`);
      incrementStep();
      await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
      setCurrentLine(null);
      return;
    }

    setColors({ [curr]: "visited" });

    if (key < arr[curr].value) {
      setCurrentLine(2);
      setExplanation(`${key} < ${arr[curr].value}, searching left subtree`);
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);
      curr = arr[curr].left;
    } else {
      setCurrentLine(3);
      setExplanation(`${key} > ${arr[curr].value}, searching right subtree`);
      incrementStep();
      await sleep(speedRef.current, pauseRef, shouldStopRef);
      curr = arr[curr].right;
    }
  }

  setCurrentLine(4);
  setExplanation(`❌ Reached null - ${key} not found in tree`);
  incrementStep();
  setColors({});
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  setCurrentLine(null);
}

/* ---------- INORDER ---------- */
async function inorderHelper(arr, nodeIdx, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep) {
  if (nodeIdx === null || nodeIdx >= arr.length || shouldStopRef.current) return;

  if (arr[nodeIdx].left !== null) {
    setCurrentLine(0);
    setColors({ [nodeIdx]: "current" });
    setExplanation(`Traversing left subtree of ${arr[nodeIdx].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    await inorderHelper(arr, arr[nodeIdx].left, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
  }

  setCurrentLine(1);
  setColors({ [nodeIdx]: "current" });
  setExplanation(`Visiting current node: ${arr[nodeIdx].value}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  visited.push(arr[nodeIdx].value);
  setColors({ [nodeIdx]: "visited" });

  if (arr[nodeIdx].right !== null) {
    setCurrentLine(2);
    setColors({ [nodeIdx]: "current" });
    setExplanation(`Traversing right subtree of ${arr[nodeIdx].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    await inorderHelper(arr, arr[nodeIdx].right, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
  }
}

export async function inorderOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
  if (arr.length === 0) {
    setExplanation("Tree is empty - nothing to traverse");
    incrementStep();
    return;
  }

  setColors({});
  setExplanation("Starting inorder traversal (Left → Root → Right)");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  const visited = [];
  await inorderHelper(arr, 0, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);

  setCurrentLine(null);
  setColors({});
  setExplanation(`✅ Inorder traversal complete: ${visited.join(", ")}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
}

/* ---------- PREORDER ---------- */
async function preorderHelper(arr, nodeIdx, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep) {
  if (nodeIdx === null || nodeIdx >= arr.length || shouldStopRef.current) return;

  // LINE 0: Visit node
  setCurrentLine(0);
  setColors({ [nodeIdx]: "current" });
  setExplanation(`Visiting current node: ${arr[nodeIdx].value}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  visited.push(arr[nodeIdx].value);
  setColors({ [nodeIdx]: "visited" });

  // LINE 1: Left subtree
  if (arr[nodeIdx].left !== null) {
    setCurrentLine(1);
    setExplanation(`Traversing left subtree of ${arr[nodeIdx].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    await preorderHelper(arr, arr[nodeIdx].left, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
  }

  // LINE 2: Right subtree
  if (arr[nodeIdx].right !== null) {
    setCurrentLine(2);
    setExplanation(`Traversing right subtree of ${arr[nodeIdx].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    await preorderHelper(arr, arr[nodeIdx].right, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
  }
}

export async function preorderOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
  if (arr.length === 0) {
    setExplanation("Tree is empty - nothing to traverse");
    incrementStep();
    return;
  }

  setColors({});
  setExplanation("Starting preorder traversal (Root → Left → Right)");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  const visited = [];
  await preorderHelper(arr, 0, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);

  setCurrentLine(null);
  setColors({});
  setExplanation(`✅ Preorder traversal complete: ${visited.join(", ")}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
}

/* ---------- POSTORDER ---------- */
async function postorderHelper(arr, nodeIdx, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep) {
  if (nodeIdx === null || nodeIdx >= arr.length || shouldStopRef.current) return;

  // LINE 0: Left subtree
  if (arr[nodeIdx].left !== null) {
    setCurrentLine(0);
    setExplanation(`Traversing left subtree of ${arr[nodeIdx].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    await postorderHelper(arr, arr[nodeIdx].left, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
  }

  // LINE 1: Right subtree
  if (arr[nodeIdx].right !== null) {
    setCurrentLine(1);
    setExplanation(`Traversing right subtree of ${arr[nodeIdx].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    await postorderHelper(arr, arr[nodeIdx].right, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);
  }

  // LINE 2: Visit node
  setCurrentLine(2);
  setColors({ [nodeIdx]: "current" });
  setExplanation(`Visiting current node: ${arr[nodeIdx].value}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  visited.push(arr[nodeIdx].value);
  setColors({ [nodeIdx]: "visited" });
}

export async function postorderOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
  if (arr.length === 0) {
    setExplanation("Tree is empty - nothing to traverse");
    incrementStep();
    return;
  }

  setColors({});
  setExplanation("Starting postorder traversal (Left → Right → Root)");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  const visited = [];
  await postorderHelper(arr, 0, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, visited, setCurrentLine, incrementStep);

  setCurrentLine(null);
  setColors({});
  setExplanation(`✅ Postorder traversal complete: ${visited.join(", ")}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
}

/* ---------- FIND MIN ---------- */
export async function findMinOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
  if (arr.length === 0) {
    setExplanation("Tree is empty");
    incrementStep();
    return;
  }

  setCurrentLine(0);
  setExplanation("Starting at root to find minimum value");
  incrementStep();
  let curr = 0;
  setColors({ [curr]: "current" });
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  while (arr[curr]?.left !== null && !shouldStopRef.current) {
    setCurrentLine(1);
    setColors({ [curr]: "visited" });
    setExplanation(`Going left from ${arr[curr].value} (minimum is in left subtree)`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    curr = arr[curr].left;
    setColors({ [curr]: "current" });
  }

  setCurrentLine(2);
  setColors({ [curr]: "active" });
  setExplanation(`✅ Minimum value found: ${arr[curr].value}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  setCurrentLine(null);
}

/* ---------- FIND MAX ---------- */
export async function findMaxOp({ arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep }) {
  if (arr.length === 0) {
    setExplanation("Tree is empty");
    incrementStep();
    return;
  }

  setCurrentLine(0);
  setExplanation("Starting at root to find maximum value");
  incrementStep();
  let curr = 0;
  setColors({ [curr]: "current" });
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  while (arr[curr]?.right !== null && !shouldStopRef.current) {
    setCurrentLine(1);
    setColors({ [curr]: "visited" });
    setExplanation(`Going right from ${arr[curr].value} (maximum is in right subtree)`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    curr = arr[curr].right;
    setColors({ [curr]: "current" });
  }

  setCurrentLine(2);
  setColors({ [curr]: "active" });
  setExplanation(`✅ Maximum value found: ${arr[curr].value}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  setCurrentLine(null);
}