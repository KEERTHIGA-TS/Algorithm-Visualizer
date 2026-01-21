// // src/algorithms/structures/queue.js - COMPLETE VERSION WITH STEP INCREMENT
// import { sleep } from "../../utils/sleep.js";

// /* =====================================================
//    PSEUDOCODE - ALL OPERATIONS
// ===================================================== */
// export const enqueuePseudo = [
//   "1. Check if queue is full",
//   "2. Create new element",
//   "3. rear = rear + 1",
//   "4. queue[rear] = value"
// ];

// export const dequeuePseudo = [
//   "1. Check if queue is empty",
//   "2. temp = queue[front]",
//   "3. front = front + 1",
//   "4. return temp"
// ];

// export const peekFrontPseudo = [
//   "1. Check if queue is empty",
//   "2. return queue[front]"
// ];

// export const peekRearPseudo = [
//   "1. Check if queue is empty",
//   "2. return queue[rear]"
// ];

// export const isEmptyPseudo = [
//   "1. if front > rear",
//   "2.   return TRUE",
//   "3. else",
//   "4.   return FALSE"
// ];

// export const sizePseudo = [
//   "1. return (rear - front + 1)"
// ];

// export const traversePseudo = [
//   "1. i = front",
//   "2. while i <= rear",
//   "3.   visit queue[i]",
//   "4.   i = i + 1"
// ];

// /* =====================================================
//    QUEUE OPERATIONS WITH STEP COUNT
// ===================================================== */

// /* ---------- ENQUEUE ---------- */
// export async function enqueueOp({
//   arr, value = 99, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   setCurrentLine(0);
//   setExplanation("🔍 Check if queue is full");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setExplanation(`🟢 Create element (${value})`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const newArr = [...arr, { value, index: arr.length }];

//   setCurrentLine(2);
//   setExplanation("Increment rear pointer");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(3);
//   setExplanation("✅ Enqueue to rear");
//   setStructure(newArr);
//   setColors({ [newArr.length - 1]: "active" });
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(null);
// }

// /* ---------- DEQUEUE ---------- */
// export async function dequeueOp({
//   arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Queue empty!");
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("🔍 Check if queue is empty");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setColors({ 0: "current" });
//   setExplanation(`Store front element (${arr[0].value})`);
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(2);
//   setExplanation("Increment front pointer");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   const dequeuedValue = arr[0]?.value;
//   const newArr = arr.slice(1).map((node, i) => ({ ...node, index: i }));

//   setCurrentLine(3);
//   setStructure(newArr);
//   setExplanation(`✅ Dequeued ${dequeuedValue}`);
//   setColors({});
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(null);
// }

// /* ---------- PEEK FRONT ---------- */
// export async function peekFrontOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Queue empty!");
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("🔍 Check if queue is empty");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setColors({ 0: "active" });
//   setExplanation(`🎯 Front element is ${arr[0].value}`);
//   incrementStep();
//   await sleep(speedRef.current * 2, pauseRef, shouldStopRef);

//   setColors({});
//   setCurrentLine(null);
// }

// /* ---------- PEEK REAR ---------- */
// export async function peekRearOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Queue empty!");
//     return;
//   }

//   setCurrentLine(0);
//   setExplanation("🔍 Check if queue is empty");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   setColors({ [arr.length - 1]: "active" });
//   setExplanation(`🎯 Rear element is ${arr[arr.length - 1].value}`);
//   incrementStep();
//   await sleep(speedRef.current * 2, pauseRef, shouldStopRef);

//   setColors({});
//   setCurrentLine(null);
// }

// /* ---------- IS EMPTY ---------- */
// export async function isEmptyOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   setCurrentLine(0);
//   setExplanation("🔍 Check if queue is empty");
//   incrementStep();
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   if (arr.length === 0) {
//     setCurrentLine(1);
//     setExplanation("✅ Queue is EMPTY (TRUE)");
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//   } else {
//     setCurrentLine(3);
//     setColors({ 0: "active", [arr.length - 1]: "active" });
//     setExplanation("✅ Queue is NOT EMPTY (FALSE)");
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);
//     setColors({});
//   }

//   setCurrentLine(null);
// }

// /* ---------- SIZE ---------- */
// export async function sizeOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   setCurrentLine(0);
//   setExplanation("📏 Calculate queue size");
//   incrementStep();

//   const allColors = {};
//   arr.forEach((_, i) => allColors[i] = "active");
//   setColors(allColors);
//   await sleep(speedRef.current * 1.5, pauseRef, shouldStopRef);
//   incrementStep();

//   setExplanation(`✅ Queue size is ${arr.length}`);
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   setColors({});
//   setCurrentLine(null);
// }

// /* ---------- TRAVERSE ---------- */
// export async function traverseOp({
//   arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep,
// }) {
//   if (arr.length === 0) {
//     setExplanation("❌ Queue empty!");
//     return;
//   }

//   setColors({});
//   setCurrentLine(0);
//   setExplanation("🔍 Start traversal from front");
//   incrementStep();
//   let i = 0;
//   await sleep(speedRef.current, pauseRef, shouldStopRef);

//   setCurrentLine(1);
//   while (i < arr.length && !shouldStopRef.current) {
//     setCurrentLine(2);
//     setColors({ [i]: "current" });
//     setExplanation(`Visiting element: ${arr[i].value}`);
//     incrementStep();
//     await sleep(speedRef.current, pauseRef, shouldStopRef);

//     setColors({ [i]: "visited" });
//     setCurrentLine(3);
//     i++;
//     incrementStep();
//     await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
//   }

//   setExplanation("✅ Traversal complete!");
//   incrementStep();
//   setCurrentLine(null);
//   await sleep(speedRef.current, pauseRef, shouldStopRef);
//   setColors({});
// }

// src/algorithms/structures/queue.js - COMPLETE VERSION WITH STEP INCREMENT
import { sleep } from "../../utils/sleep.js";

/* =====================================================
   PSEUDOCODE - ALL OPERATIONS
===================================================== */
export const enqueuePseudo = [
  "1. Check if queue is full",
  "2. Create new element",
  "3. rear = rear + 1",
  "4. queue[rear] = value"
];

export const dequeuePseudo = [
  "1. Check if queue is empty",
  "2. Store front element",
  "3. front = front + 1",
  "4. Remove front element"
];

export const peekFrontPseudo = [
  "1. Check if queue is empty",
  "2. return queue[front]"
];

export const peekRearPseudo = [
  "1. Check if queue is empty",
  "2. return queue[rear]"
];

export const isEmptyPseudo = [
  "1. if front > rear",
  "2.   return TRUE",
  "3. else",
  "4.   return FALSE"
];

export const sizePseudo = [
  "1. return (rear - front + 1)"
];

export const traversePseudo = [
  "1. i = front",
  "2. while i <= rear",
  "3.   visit queue[i]",
  "4.   i = i + 1"
];

/* =====================================================
   QUEUE OPERATIONS WITH STEP COUNT
===================================================== */

/* ---------- ENQUEUE ---------- */
export async function enqueueOp({
  arr, value = 99, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  // Step 0: Check if full
  setCurrentLine(0);
  setExplanation("🔍 Check if queue is full");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 1: Create element
  setCurrentLine(1);
  setExplanation(`🟢 Create element (${value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 2: Increment rear & enqueue
  const newArr = [...arr, { value, index: arr.length }];
  setCurrentLine(2);
  setExplanation("Increment rear pointer");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 3: Add to queue
  setCurrentLine(3);
  setStructure(newArr);
  setColors({ [newArr.length - 1]: "active" });
  setExplanation("✅ Enqueue complete");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(null);
  setColors({});
}

/* ---------- DEQUEUE ---------- */
export async function dequeueOp({
  arr, setStructure, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Queue empty!");
    return;
  }

  // Step 0: Check empty
  setCurrentLine(0);
  setExplanation("🔍 Check if queue is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 1: Store front
  setCurrentLine(1);
  setColors({ 0: "current" });
  setExplanation(`Store front element (${arr[0].value})`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 2: Increment front pointer
  setCurrentLine(2);
  setExplanation("Increment front pointer");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  // Step 3: Remove element
  const dequeuedValue = arr[0].value;
  const newArr = arr.slice(1).map((node, i) => ({ ...node, index: i }));
  setCurrentLine(3);
  setStructure(newArr);
  setExplanation(`✅ Dequeued ${dequeuedValue}`);
  setColors({});
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(null);
}

/* ---------- PEEK FRONT ---------- */
export async function peekFrontOp({
  arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Queue empty!");
    return;
  }

  setCurrentLine(0);
  setExplanation("🔍 Check if queue is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setColors({ 0: "active" });
  setExplanation(`🎯 Front element is ${arr[0].value}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);

  setColors({});
  setCurrentLine(null);
}

/* ---------- PEEK REAR ---------- */
export async function peekRearOp({
  arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Queue empty!");
    return;
  }

  setCurrentLine(0);
  setExplanation("🔍 Check if queue is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  setColors({ [arr.length - 1]: "active" });
  setExplanation(`🎯 Rear element is ${arr[arr.length - 1].value}`);
  incrementStep();
  await sleep(speedRef.current * 2, pauseRef, shouldStopRef);

  setColors({});
  setCurrentLine(null);
}

/* ---------- IS EMPTY ---------- */
export async function isEmptyOp({
  arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  setCurrentLine(0);
  setExplanation("🔍 Check if queue is empty");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  if (arr.length === 0) {
    setCurrentLine(1);
    setExplanation("✅ Queue is EMPTY (TRUE)");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
  } else {
    setCurrentLine(3);
    setColors({ 0: "active", [arr.length - 1]: "active" });
    setExplanation("✅ Queue is NOT EMPTY (FALSE)");
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);
    setColors({});
  }

  setCurrentLine(null);
}

/* ---------- SIZE ---------- */
export async function sizeOp({
  arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  setCurrentLine(0);
  setExplanation("📏 Calculate queue size");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setCurrentLine(1);
  const allColors = {};
  arr.forEach((_, i) => allColors[i] = "active");
  setColors(allColors);
  setExplanation(`Queue has ${arr.length} elements`);
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  setColors({});
  setCurrentLine(null);
}

/* ---------- TRAVERSE ---------- */
export async function traverseOp({
  arr, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep
}) {
  if (arr.length === 0) {
    setExplanation("❌ Queue empty!");
    return;
  }

  setCurrentLine(0);
  setExplanation("🔍 Start traversal from front");
  incrementStep();
  await sleep(speedRef.current, pauseRef, shouldStopRef);

  let i = 0;
  while (i < arr.length && !shouldStopRef.current) {
    setCurrentLine(2);
    setColors({ [i]: "current" });
    setExplanation(`Visiting element: ${arr[i].value}`);
    incrementStep();
    await sleep(speedRef.current, pauseRef, shouldStopRef);

    setColors({ [i]: "visited" });
    i++;
    incrementStep();
    await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
  }

  setCurrentLine(3);
  setExplanation("✅ Traversal complete");
  setColors({});
  incrementStep();
  setCurrentLine(null);
}
