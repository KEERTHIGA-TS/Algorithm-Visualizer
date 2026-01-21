
// mergeSort.jsx - FIXED VERSION
import { sleep } from "../../utils/sleep";

export const mergeSortPseudo = [
  "sort(start, end):",
  "  if start >= end: return",
  "  mid = (start + end) / 2",
  "  sort left half (start, mid)",
  "  sort right half (mid+1, end)",
  "  MERGE both halves together",
];

export async function mergeSort({
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

  // Show the range being processed
  const highlightRange = async (start, end, color = "compare") => {
    const rangeColors = {};
    for (let i = start; i <= end; i++) {
      rangeColors[i] = color;
    }
    setColors(rangeColors);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
  };

  async function merge(start, mid, end) {
    setExplanation(`🔄 MERGING [${start}-${mid}] + [${mid + 1}-${end}]`);
    setCurrentLine(5);

    const leftColors = {};
    const rightColors = {};
    for (let i = start; i <= mid; i++) leftColors[i] = "compare";
    for (let i = mid + 1; i <= end; i++) rightColors[i] = "swap";

    setColors({ ...leftColors, ...rightColors });
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

    // Actual merge
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (
      i < left.length &&
      j < right.length &&
      !shouldStopRef.current
    ) {
      // Compare phase
      const compareColors = {};
      compareColors[start + i] = "compare";
      compareColors[mid + 1 + j] = "compare";
      incrementStep(); // ✅ comparison
      setColors(compareColors);

      setExplanation(`⚖️ Compare: ${left[i]} (left) vs ${right[j]} (right)`);
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

      // Take smaller one
      if (left[i] <= right[j]) {
        arr[k] = left[i++];
      } else {
        arr[k] = right[j++];
      }

      // Show where it's going
      const placeColors = { [k]: "swap" };
      if (i > 0) placeColors[start + i - 1] = "compare";
      if (j > 0) placeColors[mid + 1 + j - 1] = "compare";
      setColors(placeColors);
      incrementStep(); // ✅ comparison
      setArray([...arr]);
      setExplanation(`📥 Placed ${arr[k]} at position ${k}`);
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
      k++;
    }

    // Remaining elements
    while (i < left.length && !shouldStopRef.current) {
      arr[k] = left[i++];
      incrementStep(); // ✅ placement
      setArray([...arr]);
      setColors({ [k]: "swap" });
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
      k++;
    }
    while (j < right.length && !shouldStopRef.current) {
      arr[k] = right[j++];
      incrementStep(); // ✅ placement
      setArray([...arr]);
      setColors({ [k]: "swap" });
      await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
      k++;
    }

    // Mark merged range as sorted
    const mergedColors = {};
    for (let x = start; x <= end; x++) mergedColors[x] = "sorted";
    setColors(mergedColors);
    setExplanation(`✅ Merged range [${start}-${end}] complete!`);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
  }

  async function sort(start, end) {
    if (start >= end || shouldStopRef.current) return;

    setExplanation(`🔪 Dividing range [${start}...${end}]`);
    await highlightRange(start, end, "swap");
    setCurrentLine(2);

    const mid = Math.floor((start + end) / 2);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

    // Left half
    setExplanation(`📉 Left half: [${start}...${mid}]`);
    await highlightRange(start, mid, "compare");
    setCurrentLine(3);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
    await sort(start, mid);

    // Right half
    setExplanation(`📈 Right half: [${mid + 1}...${end}]`);
    await highlightRange(mid + 1, end, "swap");
    setCurrentLine(4);
    await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED
    await sort(mid + 1, end);

    await merge(start, mid, end);
  }

  // START
  setExplanation("Starting Merge Sort - Divide & Conquer!");
  await highlightRange(0, arr.length - 1, "compare");
  await sleep(speedRef, pauseRef, shouldStopRef);  // ✅ FIXED

  await sort(0, arr.length - 1);

  // FINAL
  const allSorted = {};
  for (let i = 0; i < arr.length; i++) allSorted[i] = "sorted";
  setColors(allSorted);

  setArray([...arr]);
  setCurrentLine(-1);
  setExplanation("Merge Sort MASTERED: Divide → Conquer → Merge! ✨");
}
