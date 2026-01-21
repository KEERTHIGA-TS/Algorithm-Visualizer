// quickSort.jsx - FIXED VERSION
import { sleep } from "../../utils/sleep";

export const quickSortPseudo = [
  "partition(low, high):",
  "  pivot = arr[high]",
  "  partition around pivot",
  "recursively sort(low, pivot-1)",
  "recursively sort(pivot+1, high)"
];

export async function quickSort({
  array,
  setArray,
  setColors,
  setExplanation,
  speedRef,           // REF OBJECT
  shouldStopRef,      // REF OBJECT  
  pauseRef,           // REF OBJECT
  setCurrentLine,
  incrementStep,
}) {
  let arr = [...array];

  async function partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;

    setExplanation(`Partition [${low}...${high}], pivot=${pivot}`);
    setCurrentLine(1);

    // Highlight pivot
    setColors({ [high]: "swap" });
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

    for (let j = low; j < high; j++) {
      if (shouldStopRef.current) return -1;

      // COMPARE
      setCurrentLine(2);
      setColors({ [j]: "compare", [high]: "swap" });
      setExplanation(`Compare arr[${j}]=${arr[j]} < pivot ${pivot}?`);
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

      incrementStep(); // ✅ comparison

      if (arr[j] < pivot) {
        i++;
        setColors({ [i]: "swap", [j]: "swap" });
        incrementStep(); // ✅ comparison
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
      }
    }

    // FINAL PIVOT SWAP
    setColors({ [i + 1]: "swap", [high]: "swap" });
    incrementStep(); // ✅ pivot swap
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setExplanation(`Pivot ${pivot} placed at ${i + 1}`);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

    return i + 1;
  }

  async function sort(low, high) {
    if (low < high && !shouldStopRef.current) {
      const pi = await partition(low, high);

      setCurrentLine(3);
      await sort(low, pi - 1);

      setCurrentLine(4);
      await sort(pi + 1, high);
    }
  }

  await sort(0, arr.length - 1);

  setColors(Object.fromEntries(arr.map((_, i) => [i, "sorted"])));
  setArray([...arr]);  // ✅ Added missing setArray
  setCurrentLine(-1);
  setExplanation("Quick Sort completed! 🎉");
}
