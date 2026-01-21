// src/algorithms/structures/linkedList.js - COMPLETE VERSION WITH STEP INCREMENT
import { sleep } from "../../utils/sleep.js";

/* =========================================================
   HELPER — ALWAYS KEEP POINTERS VALID
========================================================= */
function rebuildNextPointers(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].next = i + 1 < arr.length ? i + 1 : null;
  }
}

/* =====================================================
   PSEUDOCODE - ALL OPERATIONS
===================================================== */
export const insertHeadPseudo = [
  "1. Create a new node",
  "2. newNode.next = head",
  "3. head = newNode"
];

export const traversePseudo = [
  "1. curr = head",
  "2. while curr != null",
  "3.   visit curr",
  "4.   curr = curr.next"
];

export const insertAfterPseudo = [
  "1. Locate node at given index",
  "2. Create a new node",
  "3. newNode.next = curr.next",
  "4. curr.next = newNode"
];

export const deleteNodePseudo = [
  "1. Locate node before target index",
  "2. temp = curr.next",
  "3. curr.next = temp.next",
  "4. delete temp"
];

export const searchPseudo = [
  "1. curr = head",
  "2. while curr != null",
  "3.   if curr.value == key return FOUND",
  "4.   curr = curr.next",
  "5. return NOT FOUND"
];

export const insertTailPseudo = [
  "1. Create a new node",
  "2. Traverse to last node",
  "3. last.next = newNode",
  "4. newNode.next = null"
];

export const deleteHeadPseudo = [
  "1. Check if list is empty",
  "2. temp = head",
  "3. head = head.next",
  "4. delete temp"
];

export const deleteTailPseudo = [
  "1. Traverse to second last node",
  "2. temp = last node",
  "3. secondLast.next = null",
  "4. delete temp"
];



/* =====================================================
   ALL OPERATIONS - ✅ WORKS WITH YOUR SLEEP.JS
===================================================== */

/* ---------- INSERT AT HEAD ---------- */
export async function insertHeadOp({
  arr, value = 99, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  setCurrentLine(0);
  setExplanation(`🟢 Create new node (${value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setExplanation("Point new node to current head");
  incrementStep();

  const newArr = [{ value, next: arr.length ? 0 : null }, ...arr];
  rebuildNextPointers(newArr);
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(2);
  setExplanation("✅ Update head to new node");
  setStructure(newArr);
  setColors({ 0: "active" });
  incrementStep();
  setCurrentLine(null);
}

/* ---------- TRAVERSE ---------- */
export async function traverseOp({
  arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  setColors({});
  setCurrentLine(0);
  setExplanation("🔍 Initialize current = head");
  incrementStep();
  let curr = 0;
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  while (curr !== null && curr < arr.length && !shouldStopRef.current) {
    setCurrentLine(2);
    setExplanation(`Visiting node ${arr[curr].value}`);
    setColors({ [curr]: "current" });
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    setColors({ [curr]: "visited" });
    setCurrentLine(3);
    curr = arr[curr]?.next ?? null;
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
  }

  setExplanation("✅ Traversal complete!");
  setCurrentLine(null);
}


/* ---------- INSERT AFTER ---------- */
export async function insertAfterOp({
  arr, index, value, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (index >= arr.length) {
    setExplanation("❌ Index out of bounds");
    return;
  }

  setCurrentLine(0);
  setExplanation(`🟢 Locate index ${index}`);
  setColors({ [index]: "current" });
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setExplanation(`Create node (${value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // ✅ Create NEW array instead of mutating
  const newNode = { value, next: arr[index].next };
  const newArr = [
    ...arr.slice(0, index + 1),
    newNode,
    ...arr.slice(index + 1)
  ];
  rebuildNextPointers(newArr);

  setCurrentLine(2);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(3);
  setExplanation("✅ Link nodes");
  setStructure(newArr);
  setColors({ [index]: "active", [index + 1]: "active" });
  incrementStep();
  setCurrentLine(null);
}
/* ---------- DELETE NODE ---------- */
export async function deleteNodeOp({
  arr, index, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (index >= arr.length || index < 0) {
    setExplanation("❌ Invalid index");
    return;
  }

  setCurrentLine(0);
  setExplanation(`🔴 Target index ${index}`);
  setColors({ [index]: "current" });
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setExplanation("Store node reference");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  const newArr = arr.filter((_, i) => i !== index);
  rebuildNextPointers(newArr);

  setCurrentLine(2);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(3);
  setExplanation(`✅ Node ${arr[index]?.value} deleted`);
  setStructure(newArr);
  setColors({});
  incrementStep();
  setCurrentLine(null);
}

/* ---------- SEARCH ---------- */
export async function searchOp({
  arr, key = 42, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  setCurrentLine(0);
  setExplanation(`🔍 Search for ${key}`);
  incrementStep();
  let curr = 0;
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  while (curr !== null && curr < arr.length && !shouldStopRef.current) {
    setCurrentLine(2);
    setColors({ [curr]: "current" });
    setExplanation(`Check ${arr[curr].value} ${arr[curr].value === key ? "✅ FOUND!" : "≠ key"}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    if (arr[curr].value === key) {
      setColors({ [curr]: "active" });
      setExplanation(`🎉 FOUND ${key} at index ${curr}!`);
      incrementStep();
      setCurrentLine(null);
      return curr;
    }

    setColors({ [curr]: "visited" });
    setCurrentLine(3);
    curr = arr[curr]?.next ?? null;
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
  }

  setExplanation(`❌ ${key} not found`);
  setCurrentLine(4);
  setColors({});
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  setCurrentLine(null);
}

/* ---------- INSERT AT TAIL ---------- */
export async function insertTailOp({
  arr, value = 88, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  setCurrentLine(0);
  setExplanation(`🟢 Create tail node (${value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  const newArr = [...arr, { value, next: null }];
  rebuildNextPointers(newArr);

  setCurrentLine(1);
  setExplanation("Traverse to last node");
  incrementStep();

  let curr = 0;
  while (curr !== null && curr < arr.length && !shouldStopRef.current) {
    setColors({ [curr]: "current" });
    curr = arr[curr]?.next ?? null;
    incrementStep();
    await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
  }

  setCurrentLine(2);
  setExplanation("Link to tail");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(3);
  setStructure(newArr);
  setColors({ [newArr.length - 1]: "active" });
  setExplanation("✅ Added to tail");
  incrementStep();
  setCurrentLine(null);
}

/* ---------- DELETE HEAD ---------- */
export async function deleteHeadOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setExplanation("❌ List empty");
    return;
  }

  setCurrentLine(0);
  setExplanation("🔴 Delete head check");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setColors({ 0: "current" });
  setExplanation("Store head reference");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(2);
  const newArr = arr.slice(1);
  rebuildNextPointers(newArr);

  setCurrentLine(3);
  setStructure(newArr);
  setExplanation(`✅ Head ${arr[0]?.value} deleted`);
  setColors({});
  incrementStep();
  setCurrentLine(null);
}

/* ---------- DELETE TAIL ---------- */
export async function deleteTailOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setExplanation("❌ List is empty");
    incrementStep();
    return;
  }

  if (arr.length === 1) {
    setExplanation("Deleting only node");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    setStructure([]);
    setExplanation("✅ List is now empty");
    incrementStep();
    return;
  }

  setColors({});

  setCurrentLine(0);
  setExplanation("Find second last node");
  incrementStep();

  let curr = 0;
  let secondLast = 0;

  // Traverse to find second last
  while (curr < arr.length - 1) {
    setColors({ [curr]: "current" });
    if (curr < arr.length - 2) {
      secondLast = curr;
    }
    incrementStep();
    await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
    curr++;
  }

  const lastIndex = arr.length - 1;

  setCurrentLine(1);
  setColors({ [secondLast]: "active", [lastIndex]: "current" });
  setExplanation(`Target tail node (value: ${arr[lastIndex].value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // ✅ Create new array without last element
  const newArr = arr.slice(0, -1).map(node => ({ ...node })); // Deep copy nodes
  rebuildNextPointers(newArr);

  setCurrentLine(2);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(3);
  setStructure(newArr);
  setExplanation(`✅ Tail ${arr[lastIndex]?.value} deleted`);
  setColors({ [newArr.length - 1]: "active" });
  incrementStep();
  setCurrentLine(null);
}