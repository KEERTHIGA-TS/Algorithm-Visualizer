// selectionSort.jsx - FIXED VERSION
import { sleep } from "../../utils/sleep";

export const selectionSortPseudo = [
  "for i from 0 to n - 1",
  "  minIndex = i",
  "  for j from i + 1 to n - 1",
  "    if arr[j] < arr[minIndex]",
  "      minIndex = j",
  "  swap arr[i] and arr[minIndex]"
];

export async function selectionSort({
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
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    if (shouldStopRef.current) return;

    setExplanation(`Finding minimum for position ${i}`);
    setCurrentLine(0);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

    let minIndex = i;

    // Build sorted prefix BEFORE comparisons
    const sortedSoFar = {};
    for (let k = 0; k < i; k++) {
      sortedSoFar[k] = "sorted";
    }

    // Initial min highlight
    const currentColors = { ...sortedSoFar, [i]: "compare" };
    setColors(currentColors);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

    for (let j = i + 1; j < n; j++) {
      if (shouldStopRef.current) return;

      incrementStep(); // ✅ comparison

      // Clean comparison - ONLY these 2 bars colored
      setColors({
        ...sortedSoFar,
        [minIndex]: "compare",
        [j]: "compare"
      });
      setCurrentLine(2);
      setExplanation(`Compare arr[${j}]=${arr[j]} vs arr[${minIndex}]=${arr[minIndex]}`);
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        // Update minIndex color immediately
        setColors({
          ...sortedSoFar,
          [minIndex]: "swap",
          [i]: "compare"
        });
        setExplanation(`New minimum: arr[${minIndex}]=${arr[minIndex]}`);
        await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
      }
    }

    // FINAL SWAP
    if (minIndex !== i) {
      setCurrentLine(5);
      setColors({
        ...sortedSoFar,
        [i]: "swap",
        [minIndex]: "swap"
      });
      setExplanation(`Swap arr[${i}] ↔ arr[${minIndex}]`);

      incrementStep(); // ✅ swap

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setArray([...arr]);
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
    }

    // Mark CURRENT position sorted + clear all other colors
    const finalColors = { ...sortedSoFar, [i]: "sorted" };
    setColors(finalColors);
    setExplanation(`Position ${i} fixed: ${arr[i]}`);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
  }

  // ALL bars green including last one
  const allSorted = {};
  for (let i = 0; i < n; i++) allSorted[i] = "sorted";
  setColors(allSorted);

  setArray(arr);  // ✅ Added missing setArray
  setCurrentLine(-1);
  setExplanation("Selection Sort completed! All elements sorted! 🎉");
}
