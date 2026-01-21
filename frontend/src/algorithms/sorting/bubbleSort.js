import { sleep } from "../../utils/sleep";

export const bubbleSortPseudo = [
  "for i from 0 to n - 1",
  "  for j from 0 to n - i - 1",
  "    compare arr[j] and arr[j + 1]",
  "    if arr[j] > arr[j + 1]",
  "      swap arr[j] and arr[j + 1]"
];

export async function bubbleSort({
  array,
  setArray,
  setColors,
  setExplanation,
  speedRef,
  shouldStopRef,
  pauseRef,
  setCurrentLine,
  incrementStep,
}) {
  let arr = [...array];
  const n = arr.length;
  const sortedIndices = new Set();

  for (let i = 0; i < n; i++) {
    if (shouldStopRef.current) return;

    setExplanation(`Pass ${i + 1}/${n}: Bubbling largest to position ${n - i - 1}`);
    setCurrentLine(0);
    await sleep(speedRef, pauseRef, shouldStopRef);

    for (let j = 0; j < n - i - 1; j++) {
      if (shouldStopRef.current) return;

      // COMPARE PHASE
      setCurrentLine(2);
      setColors({ 
        ...Object.fromEntries(sortedIndices.entries().map(([k]) => [k, "sorted"])),
        [j]: "compare", 
        [j + 1]: "compare" 
      });
      setExplanation(`Comparing ${arr[j]} vs ${arr[j + 1]} at ${j}, ${j + 1}`);
      
      incrementStep(); // ✅ INSERT HERE (comparison)

      await sleep(speedRef, pauseRef, shouldStopRef);
      if (arr[j] > arr[j + 1]) {
        // SWAP PHASE
        setCurrentLine(4);
        setColors({ 
          ...Object.fromEntries(sortedIndices.entries().map(([k]) => [k, "sorted"])),
          [j]: "swap", 
          [j + 1]: "swap" 
        });
        setExplanation(`Swapping ${arr[j]} ↔ ${arr[j + 1]}`);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]);
        incrementStep(); // ✅ INSERT HERE (swap)
        await sleep(speedRef.current * 1.3, pauseRef, shouldStopRef);
      }
    }

    // Mark as sorted
    sortedIndices.add(n - i - 1);
    setColors({ 
      ...Object.fromEntries(sortedIndices.entries().map(([k]) => [k, "sorted"])) 
    });
  }

  setCurrentLine(-1);
  setExplanation("Bubble Sort completed! 🎉");
}
