// // src/utils/generateDs.js

// /* ===================== MAIN GENERATOR ===================== */
// export function generateDS(type, size, customValues = null) {
//   switch (type) {
//     case "linkedlist":
//       return generateLinkedList(size, customValues);

//     case "stack":
//       return generateStack(size, customValues);

//     case "queue":
//       return generateQueue(size, customValues);

//     case "binarytree":
//       return generateBinaryTree(size, customValues);

//     case "binaryheap":
//       return generateBinaryHeap(size, customValues);

//     default:
//       return generateLinkedList(size, customValues);
//   }
// }

// /* ===================== CUSTOM INPUT PARSER ===================== */
// /*
//   "5,3,8,1" → builds DS with these values
// */
// export function parseCustomInput(input, dsType, maxSize) {
//   if (!input) throw new Error("Empty input");

//   const values = input
//     .split(",")
//     .map(v => parseInt(v.trim(), 10))
//     .filter(v => !isNaN(v));

//   if (values.length === 0) {
//     throw new Error("No valid numbers");
//   }

//   if (values.length > maxSize) {
//     throw new Error(`Max allowed size is ${maxSize}`);
//   }

//   return generateDS(dsType, values.length, values);
// }

// /* ===================== HELPERS ===================== */

// function randomValues(size) {
//   return Array.from({ length: size }, () =>
//     Math.floor(Math.random() * 90) + 10
//   );
// }

// /* ===================== LINKED LIST ===================== */
// /*
//   Format:
//   [{ value: 42, next: 1 }, { value: 15, next: 2 }, ...]
// */
// function generateLinkedList(size, customValues) {
//   const values = customValues || randomValues(size);

//   return values.map((value, i) => ({
//     value,
//     next: i + 1 < values.length ? i + 1 : null
//   }));
// }

// /* ===================== STACK ===================== */
// /*
//   Format:
//   [{ value: 42, index: 0 }, { value: 15, index: 1 }, ...]
// */
// function generateStack(size, customValues) {
//   const values = customValues || randomValues(size);

//   return values.map((value, i) => ({
//     value,
//     index: i
//   }));
// }

// /* ===================== QUEUE ===================== */
// /*
//   Same format as Stack
// */
// function generateQueue(size, customValues) {
//   const values = customValues || randomValues(size);

//   return values.map((value, i) => ({
//     value,
//     index: i
//   }));
// }

// /* ===================== BINARY TREE ===================== */
// /*
//   Array-based tree
//   left = 2*i + 1
//   right = 2*i + 2
// */
// function generateBinaryTree(size, customValues) {
//   const values = customValues || randomValues(size);

//   return values.map((value, i) => ({
//     value,
//     left: i * 2 + 1 < values.length ? i * 2 + 1 : null,
//     right: i * 2 + 2 < values.length ? i * 2 + 2 : null
//   }));
// }

// /* ===================== BINARY HEAP ===================== */
// /*
//   Uses same structure as Binary Tree
// */
// function generateBinaryHeap(size, customValues) {
//   return generateBinaryTree(size, customValues);
// }
// src/utils/generateDs.js - FIXED FOR STACK COMPATIBILITY
/* ===================== MAIN GENERATOR ===================== */
export function generateDS(type, size, customValues = null) {
  switch (type) {
    case "linkedlist":
      return generateLinkedList(size, customValues);

    case "stack":
      return generateStack(size, customValues);

    case "queue":
      return generateQueue(size, customValues);

    case "binarytree":
      return generateBinaryTree(size, customValues);

    case "binaryheap":
      return generateBinaryHeap(size, customValues);

    default:
      return generateLinkedList(size, customValues);
  }
}

/* ===================== CUSTOM INPUT PARSER ===================== */
/*
  "5,3,8,1" → builds DS with these values
*/
export function parseCustomInput(input, dsType, maxSize) {
  if (!input) throw new Error("Empty input");

  const values = input
    .split(",")
    .map(v => parseInt(v.trim(), 10))
    .filter(v => !isNaN(v));

  if (values.length === 0) {
    throw new Error("No valid numbers");
  }

  if (values.length > maxSize) {
    throw new Error(`Max allowed size is ${maxSize}`);
  }

  return generateDS(dsType, values.length, values);
}

/* ===================== HELPERS ===================== */
function randomValues(size) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 90) + 10
  );
}

/* ===================== LINKED LIST (UNCHANGED) ===================== */
/*
  Format:
  [{ value: 42, next: 1 }, { value: 15, next: 2 }, ...]
*/
function generateLinkedList(size, customValues) {
  const values = customValues || randomValues(size);

  return values.map((value, i) => ({
    value,
    next: i + 1 < values.length ? i + 1 : null
  }));
}

/* ===================== STACK (✅ FIXED) ===================== */
/*
  Format: SAME as LinkedList for visualization compatibility
  [{ value: 42, next: 1 }, { value: 15, next: 2 }, ...]
  Top = index 0, follows next pointers downward
*/
function generateStack(size, customValues) {
  const values = customValues || randomValues(size);

  return values.map((value, i) => ({
    value,
    next: i + 1 < values.length ? i + 1 : null  // ✅ SAME FORMAT AS LINKEDLIST
  }));
}

/* ===================== QUEUE ===================== */
/*
  Same format as Stack
*/
function generateQueue(size, customValues) {
  const values = customValues || randomValues(size);

  return values.map((value, i) => ({
    value,
    next: i + 1 < values.length ? i + 1 : null  // ✅ CONSISTENT FORMAT
  }));
}

/* ===================== BINARY TREE ===================== */
/*
  Array-based tree
  left = 2*i + 1
  right = 2*i + 2
*/
function generateBinaryTree(size, customValues) {
  const values = customValues || randomValues(size);
  const tree = [];

  for (const value of values) {
    insertIntoBST(tree, value);
  }

  return tree;
}

/* ===== BST INSERT HELPER ===== */
function insertIntoBST(tree, value) {
  if (tree.length === 0) {
    tree.push({ value, left: null, right: null });
    return;
  }

  let curr = 0;

  while (true) {
    if (value < tree[curr].value) {
      if (tree[curr].left === null) {
        const idx = tree.length;
        tree.push({ value, left: null, right: null });
        tree[curr].left = idx;
        return;
      }
      curr = tree[curr].left;
    }
    else if (value > tree[curr].value) {
      if (tree[curr].right === null) {
        const idx = tree.length;
        tree.push({ value, left: null, right: null });
        tree[curr].right = idx;
        return;
      }
      curr = tree[curr].right;
    }
    else {
      // Ignore duplicates
      return;
    }
  }
}

/* ===================== BINARY HEAP ===================== */
/*
  Uses same structure as Binary Tree
*/
function generateBinaryHeap(size, customValues) {
  return generateBinaryTree(size, customValues);
}
