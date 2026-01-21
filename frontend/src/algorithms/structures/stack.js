// // src/algorithms/structures/stack.js
// import { sleep } from "../../utils/sleep.js";

// /* =====================================================
//    PSEUDOCODE - ALL OPERATIONS
// ===================================================== */
// export const pushPseudo = [
//   "1. Check if stack is full",
//   "2. Create new element",
//   "3. top = top + 1",
//   "4. stack[top] = value"
// ];

// export const popPseudo = [
//   "1. Check if stack is empty",
//   "2. temp = stack[top]",
//   "3. top = top - 1",
//   "4. return temp"
// ];

// export const peekPseudo = [
//   "1. Check if stack is empty",
//   "2. return stack[top]"
// ];

// export const isEmptyPseudo = [
//   "1. if top == -1",
//   "2.   return TRUE",
//   "3. else",
//   "4.   return FALSE"
// ];

// export const sizePseudo = [
//   "1. return top + 1"
// ];

// export const traversePseudo = [
//   "1. i = top",
//   "2. while i >= 0",
//   "3.   visit stack[i]",
//   "4.   i = i - 1"
// ];

// /* =====================================================
//    STACK OPERATIONS
// ===================================================== */

// /* ---------- PUSH ---------- */
// export async function pushOp({
//   arr, value = 99, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine,
// }) {
//   setCurrentLine(0);
//   setExplanation("🔍 Check if stack is full");
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setExplanation(`🟢 Create element (${value})`);
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const newArr = [...arr, { value, index: arr.length }];

//   setCurrentLine(2);
//   setExplanation("Increment top pointer");
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(3);
//   setExplanation("✅ Push to stack");
//   setStructure(newArr);
//   setColors({ [newArr.length - 1]: "active" });
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   setCurrentLine(null);
// }

// /* ---------- POP ---------- */
// export async function popOp({
//   arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Stack empty!");
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("🔍 Check if stack is empty");
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setColors({ [arr.length - 1]: "current" });
//   setExplanation(`Store top element (${arr[arr.length - 1].value})`);
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(2);
//   setExplanation("Decrement top pointer");
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const poppedValue = arr[arr.length - 1]?.value;
//   const newArr = arr.slice(0, -1);
  
//   setCurrentLine(3);
//   setStructure(newArr);
//   setExplanation(`✅ Popped ${poppedValue}`);
//   setColors({});
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   setCurrentLine(null);
// }

// /* ---------- PEEK ---------- */
// export async function peekOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Stack empty!");
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("🔍 Check if stack is empty");
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setColors({ [arr.length - 1]: "active" });
//   setExplanation(`🎯 Top element is ${arr[arr.length - 1].value}`);
//   await sleep(speedRef.current * 2, pauseRef, shouldStopRef);
  
//   setColors({});
//   setCurrentLine(null);
// }

// /* ---------- IS EMPTY ---------- */
// export async function isEmptyOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine,
// }) {
//   setCurrentLine(0);
//   setExplanation("🔍 Check if stack is empty");
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   if (arr.length === 0) {
//     setCurrentLine(1);
//     setExplanation("✅ Stack is EMPTY (TRUE)");
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//   } else {
//     setCurrentLine(3);
//     setColors({ [arr.length - 1]: "active" });
//     setExplanation("✅ Stack is NOT EMPTY (FALSE)");
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     setColors({});
//   }
  
//   setCurrentLine(null);
// }

// /* ---------- SIZE ---------- */
// export async function sizeOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine,
// }) {
//   setCurrentLine(0);
//   setExplanation("📏 Calculate stack size");
  
//   // Highlight all elements
//   const allColors = {};
//   arr.forEach((_, i) => {
//     allColors[i] = "active";
//   });
//   setColors(allColors);
  
//   await sleep(speedRef.current * 1.5, pauseRef, shouldStopRef);
  
//   setExplanation(`✅ Stack size is ${arr.length}`);
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
  
//   setColors({});
//   setCurrentLine(null);
// }

// /* ---------- TRAVERSE ---------- */
// export async function traverseOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Stack empty!");
//     return;
//   }

//   setColors({});
//   setCurrentLine(0);
//   setExplanation("🔍 Start traversal from top");
//   let i = arr.length - 1;
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   while (i >= 0 && !shouldStopRef.current) {
//     setCurrentLine(2);
//     setColors({ [i]: "current" });
//     setExplanation(`Visiting element: ${arr[i].value}`);
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     setColors({ [i]: "visited" });
//     setCurrentLine(3);
//     i--;
//     await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
//   }

//   setExplanation("✅ Traversal complete!");
//   setCurrentLine(null);
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   setColors({});
// }

// src/algorithms/structures/stack.js
import { sleep } from "../../utils/sleep.js";

/* =====================================================
   PSEUDOCODE - ALL OPERATIONS
===================================================== */
export const pushPseudo = [
  "1. Check if stack is full",
  "2. Create new element",
  "3. top = top + 1",
  "4. stack[top] = value"
];

export const popPseudo = [
  "1. Check if stack is empty",
  "2. Store top element",
  "3. top = top - 1",
  "4. Remove top element"
];

export const peekPseudo = [
  "1. Check if stack is empty",
  "2. return stack[top]"
];

export const isEmptyPseudo = [
  "1. if top == -1",
  "2.   return TRUE",
  "3. else",
  "4.   return FALSE"
];

export const sizePseudo = [
  "1. return top + 1"
];

export const traversePseudo = [
  "1. i = top",
  "2. while i >= 0",
  "3.   visit stack[i]",
  "4.   i = i - 1"
];

/* =====================================================
   STACK OPERATIONS WITH STEP COUNT
===================================================== */

/* ---------- PUSH ---------- */
export async function pushOp({
  arr,
  value = 99,
  setStructure,
  setColors,
  setExplanation,
  speedRef,
  pauseRef,
  shouldStopRef,
  setCurrentLine,
  incrementStep
}) {
  // Step 0: Check if full
  setCurrentLine(0);
  setExplanation("🔍 Check if stack is full");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 1: Create element
  setCurrentLine(1);
  setExplanation(`🟢 Create element (${value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 2: Increment top
  const newArr = [...arr, { value, index: arr.length }];
  setCurrentLine(2);
  setExplanation("Increment top pointer");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 3: Push to stack
  setCurrentLine(3);
  setStructure(newArr);
  setColors({ [newArr.length - 1]: "active" });
  setExplanation("✅ Push complete");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setColors({});
  setCurrentLine(null);
}

/* ---------- POP ---------- */
export async function popOp({
  arr,
  setStructure,
  setColors,
  setExplanation,
  speedRef,
  pauseRef,
  shouldStopRef,
  setCurrentLine,
  incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Stack empty!");
    return;
  }

  // Step 0: Check empty
  setCurrentLine(0);
  setExplanation("🔍 Check if stack is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 1: Store top
  setCurrentLine(1);
  setColors({ [arr.length - 1]: "current" });
  setExplanation(`Store top element (${arr[arr.length - 1].value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 2: Decrement top
  setCurrentLine(2);
  setExplanation("Decrement top pointer");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 3: Remove element
  const poppedValue = arr[arr.length - 1].value;
  const newArr = arr.slice(0, -1);
  setCurrentLine(3);
  setStructure(newArr);
  setColors({});
  setExplanation(`✅ Popped ${poppedValue}`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(null);
}

/* ---------- PEEK ---------- */
export async function peekOp({
  arr,
  setColors,
  setExplanation,
  speedRef,
  pauseRef,
  shouldStopRef,
  setCurrentLine,
  incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Stack empty!");
    return;
  }

  setCurrentLine(0);
  setExplanation("🔍 Check if stack is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setColors({ [arr.length - 1]: "active" });
  setExplanation(`🎯 Top element is ${arr[arr.length - 1].value}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);

  setColors({});
  setCurrentLine(null);
}

/* ---------- IS EMPTY ---------- */
export async function isEmptyOp({
  arr,
  setColors,
  setExplanation,
  speedRef,
  pauseRef,
  shouldStopRef,
  setCurrentLine,
  incrementStep
}) {
  setCurrentLine(0);
  setExplanation("🔍 Check if stack is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  if (arr.length === 0) {
    setCurrentLine(1);
    setExplanation("✅ Stack is EMPTY (TRUE)");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
  } else {
    setCurrentLine(3);
    setColors({ [arr.length - 1]: "active" });
    setExplanation("✅ Stack is NOT EMPTY (FALSE)");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    setColors({});
  }

  setCurrentLine(null);
}

/* ---------- SIZE ---------- */
export async function sizeOp({
  arr,
  setColors,
  setExplanation,
  speedRef,
  pauseRef,
  shouldStopRef,
  setCurrentLine,
  incrementStep
}) {
  setCurrentLine(0);
  setExplanation("📏 Calculate stack size");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  const allColors = {};
  arr.forEach((_, i) => (allColors[i] = "active"));
  setColors(allColors);
  setExplanation(`Stack has ${arr.length} elements`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setColors({});
  setCurrentLine(null);
}

/* ---------- TRAVERSE ---------- */
export async function traverseOp({
  arr,
  setColors,
  setExplanation,
  speedRef,
  pauseRef,
  shouldStopRef,
  setCurrentLine,
  incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Stack empty!");
    return;
  }

  setCurrentLine(0);
  setExplanation("🔍 Start traversal from top");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  let i = arr.length - 1;
  while (i >= 0 && !shouldStopRef.current) {
    setCurrentLine(2);
    setColors({ [i]: "current" });
    setExplanation(`Visiting element: ${arr[i].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    setColors({ [i]: "visited" });
    i--;
    incrementStep();
    await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
  }

  setCurrentLine(3);
  setExplanation("✅ Traversal complete");
  setColors({});
  incrementStep();
  setCurrentLine(null);
}
