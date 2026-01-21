import { sleep } from "../../utils/sleep.js"; 

/* =====================================================
   PSEUDOCODE - ALL OPERATIONS (MIN-HEAP)
===================================================== */
export const insertPseudo = [
  "1. Add new value at end",
  "2. Compare with parent",
  "3. If smaller, swap up",
  "4. Repeat until heap order"
];

export const deletePseudo = [
  "1. Move last element to root",
  "2. Remove last element",
  "3. Heapify down from root"
];

export const extractMinPseudo = [
  "1. Return minimum (root)",
  "2. Move last element to root",
  "3. Heapify down from root"
];

export const extractMaxPseudo = [
  "1. Find maximum element",
  "2. Swap with last element",
  "3. Remove last element"
];

export const heapifyPseudo = [
  "1. Find smallest of node & children",
  "2. If child smaller, swap",
  "3. Repeat recursively down"
];

export const buildHeapPseudo = [
  "1. Start from last non-leaf",
  "2. Heapify each node upward",
  "3. Continue to root"
];

export const decreaseKeyPseudo = [
  "1. Update key value",
  "2. Bubble up if smaller"
];

export const increaseKeyPseudo = [
  "1. Update key value",
  "2. Heapify down if larger"
];

/* =====================================================
   CRITICAL HELPER - FIXES "Object object" ERROR
===================================================== */
const getNodeValue = (node) => {
  return typeof node === 'object' && node !== null ? (node.value ?? node) : node;
};

const getParent = (i) => Math.floor((i - 1) / 2);
const getLeft = (i) => 2 * i + 1;
const getRight = (i) => 2 * i + 2;

const swap = (arr, i, j, setStructure) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  setStructure([...arr]);
  return arr;
};

/* =====================================================
   ALL OPERATIONS - ✅ WITH PROPER INCREMENTSTEP
===================================================== */

/* ---------- INSERT ---------- */
export async function insertOp({
  arr, value, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  const newArr = [...arr, value];
  const idx = newArr.length - 1;
  
  setCurrentLine(0);
  setStructure(newArr);
  setColors({ [idx]: "active" });
  setExplanation(`Adding ${value} at end (index ${idx})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  
  let current = idx;
  while (current > 0 && !shouldStopRef.current) {
    const parentIdx = getParent(current);
    const currentVal = getNodeValue(newArr[current]);
    const parentVal = getNodeValue(newArr[parentIdx]);
    
    setCurrentLine(1);
    setColors({ [current]: "current", [parentIdx]: "current" });
    setExplanation(`Comparing ${currentVal} with parent ${parentVal}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    
    if (currentVal < parentVal) {
      setCurrentLine(2);
      swap(newArr, current, parentIdx, setStructure);
      setColors({ [parentIdx]: "visited", [current]: "active" });
      setExplanation(`Swapping up: ${currentVal} < ${parentVal}`);
      incrementStep();
      await sleep(speedRef.current * 1.5, pauseRef, shouldStopRef);
      current = parentIdx;
    } else {
      setCurrentLine(3);
      setColors({ [current]: "active" });
      setExplanation("Heap property satisfied ✅");
      incrementStep();
      await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
      break;
    }
  }
  setCurrentLine(null);
}

/* ---------- HEAPIFY DOWN ---------- */
async function heapifyDown({
  arr, idx, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  let size = arr.length;
  let position = idx;
  
  while (true) {
    setCurrentLine(0);
    setExplanation(`Heapifying from position ${position}`);
    incrementStep();
    
    let smallest = position;
    const left = getLeft(position);
    const right = getRight(position);
    const nodeVal = getNodeValue(arr[position]);
    const leftVal = left < size ? getNodeValue(arr[left]) : null;
    const rightVal = right < size ? getNodeValue(arr[right]) : null;
    
    // Find smallest child
    if (left < size && leftVal !== null && leftVal < nodeVal) {
      smallest = left;
    }
    if (right < size && rightVal !== null && rightVal < getNodeValue(arr[smallest])) {
      smallest = right;
    }
    
    // Visual feedback
    const colorMap = { [position]: "current" };
    if (left < size) colorMap[left] = "current";
    if (right < size) colorMap[right] = "current";
    setColors(colorMap);
    setExplanation(`node=${nodeVal}(${position}), L=${leftVal ?? '∅'}(${left}), R=${rightVal ?? '∅'}(${right})`);
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    
    if (smallest !== position) {
      setCurrentLine(1);
      swap(arr, position, smallest, setStructure);
      setColors({ [position]: "visited", [smallest]: "active" });
      setExplanation(`Swap ${getNodeValue(arr[position])} ↔ ${getNodeValue(arr[smallest])}`);
      incrementStep();
      await sleep(speedRef.current * 1.5, pauseRef, shouldStopRef);
      position = smallest;
    } else {
      setCurrentLine(2);
      setColors({ [position]: "active" });
      setExplanation("✅ Heap property restored!");
      incrementStep();
      await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
      break;
    }
  }
}

/* ---------- DELETE ---------- */
export async function deleteOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setExplanation("Heap is empty");
    return;
  }
  
  if (arr.length === 1) {
    setStructure([]);
    setExplanation("Last element removed");
    incrementStep();
    return;
  }
  
  const newArr = [...arr];
  const lastVal = getNodeValue(newArr[newArr.length - 1]);
  
  setCurrentLine(0);
  newArr[0] = newArr[newArr.length - 1];
  newArr.pop();
  setStructure([...newArr]);
  setColors({ 0: "current" });
  setExplanation(`Moving last ${lastVal} to root`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  
  setCurrentLine(1);
  setExplanation("Remove last element");
  incrementStep();
  await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
  
  setCurrentLine(2);
  await heapifyDown({
    arr: newArr,
    idx: 0,
    setStructure,
    setColors,
    setExplanation,
    speedRef,
    pauseRef,
    shouldStopRef,
    setCurrentLine,
    incrementStep
  });
  
  setCurrentLine(null);
}

/* ---------- EXTRACT MIN ---------- */
export async function extractMinOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setExplanation("Heap is empty");
    return;
  }
  
  setCurrentLine(0);
  const minVal = getNodeValue(arr[0]);
  setColors({ 0: "active" });
  setExplanation(`Minimum value (root): ${minVal}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  
  await deleteOp({
    arr,
    setStructure,
    setColors,
    setExplanation,
    speedRef,
    pauseRef,
    shouldStopRef,
    setCurrentLine,
    incrementStep
  });
}

/* ---------- EXTRACT MAX ---------- */
export async function extractMaxOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  if (arr.length === 0) {
    setExplanation("Heap is empty");
    return;
  }
  
  setCurrentLine(0);
  let maxIdx = 0;
  let maxVal = getNodeValue(arr[0]);
  
  for (let i = 0; i < arr.length; i++) {
    const val = getNodeValue(arr[i]);
    setColors({ [i]: "current" });
    setExplanation(`Scanning: ${val}`);
    incrementStep();
    await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
    
    if (val > maxVal) {
      maxVal = val;
      maxIdx = i;
    }
  }
  
  setCurrentLine(1);
  const newArr = [...arr];
  swap(newArr, maxIdx, newArr.length - 1, setStructure);
  setColors({ [maxIdx]: "active" });
  setExplanation(`Max ${maxVal} at index ${maxIdx}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  
  setCurrentLine(2);
  newArr.pop();
  setStructure(newArr);
  setExplanation(`✅ Extracted max: ${maxVal}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  
  setColors({});
  setCurrentLine(null);
}

/* ---------- HEAPIFY ---------- */
export async function heapifyOp({
  arr, index, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  const newArr = [...arr];
  
  setCurrentLine(0);
  setColors({ [index]: "current" });
  setExplanation(`Heapifying from index ${index}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  
  await heapifyDown({
    arr: newArr,
    idx: index,
    setStructure,
    setColors,
    setExplanation,
    speedRef,
    pauseRef,
    shouldStopRef,
    setCurrentLine,
    incrementStep
  });
  
  setStructure(newArr);
  setCurrentLine(null);
}

/* ---------- BUILD HEAP ---------- */
export async function buildHeapOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  const newArr = [...arr];
  
  setCurrentLine(0);
  const startIdx = Math.floor(newArr.length / 2) - 1;
  setExplanation(`Building heap from index ${startIdx}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);
  
  for (let i = startIdx; i >= 0 && !shouldStopRef.current; i--) {
    setCurrentLine(1);
    setColors({ [i]: "current" });
    setExplanation(`Heapifying node ${i}`);
    incrementStep();
    await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
    
    await heapifyDown({
      arr: newArr,
      idx: i,
      setStructure,
      setColors,
      setExplanation,
      speedRef,
      pauseRef,
      shouldStopRef,
      setCurrentLine,
      incrementStep
    });
  }
  
  setCurrentLine(2);
  setStructure(newArr);
  setExplanation("✅ Heap built successfully!");
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  
  setCurrentLine(null);
}

/* ---------- DECREASE KEY ---------- */
export async function decreaseKeyOp({
  arr, index, newValue, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  const newArr = [...arr];
  newArr[index] = newValue;
  
  setCurrentLine(0);
  setStructure(newArr);
  setColors({ [index]: "active" });
  setExplanation(`Set index ${index} = ${newValue}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  
  let current = index;
  while (current > 0 && !shouldStopRef.current) {
    const parentIdx = getParent(current);
    const currentVal = getNodeValue(newArr[current]);
    const parentVal = getNodeValue(newArr[parentIdx]);
    
    setCurrentLine(1);
    setColors({ [current]: "current", [parentIdx]: "current" });
    setExplanation(`Check ${currentVal} < ${parentVal}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    
    if (currentVal < parentVal) {
      swap(newArr, current, parentIdx, setStructure);
      setColors({ [parentIdx]: "visited", [current]: "active" });
      setExplanation(`Bubbling up: ${currentVal} < ${parentVal}`);
      incrementStep();
      current = parentIdx;
      await sleep(speedRef.current * 1.5, pauseRef, shouldStopRef);
    } else {
      setExplanation("✅ Key position correct");
      incrementStep();
      break;
    }
  }
  
  setCurrentLine(null);
}

/* ---------- INCREASE KEY ---------- */
export async function increaseKeyOp({
  arr, index, newValue, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
}) {
  const newArr = [...arr];
  newArr[index] = newValue;
  
  setCurrentLine(0);
  setStructure(newArr);
  setColors({ [index]: "active" });
  setExplanation(`Set index ${index} = ${newValue}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  
  setCurrentLine(1);
  await heapifyDown({
    arr: newArr,
    idx: index,
    setStructure,
    setColors,
    setExplanation,
    speedRef,
    pauseRef,
    shouldStopRef,
    setCurrentLine,
    incrementStep
  });
  
  setCurrentLine(null);
}