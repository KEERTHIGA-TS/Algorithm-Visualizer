import { sleep } from "../../utils/sleep";

export const insertionSortPseudo = [
  "for i from 1 to n - 1",
  "  key = arr[i]",
  "  j = i - 1",
  "  while j >= 0 and arr[j] > key",
  "    arr[j + 1] = arr[j]",
  "  arr[j + 1] = key"
];

export async function insertionSort({
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

  for (let i = 1; i < n; i++) {
    if (shouldStopRef.current) return;

    setExplanation(`Inserting ${arr[i]} into sorted [0..${i-1}]`);
    setCurrentLine(0);
    await sleep(speedRef, pauseRef, shouldStopRef);

    let key = arr[i];
    let j = i - 1;

    // **FIXED**: Build sorted prefix tracker
    const sortedSoFar = {};
    for (let k = 0; k < i; k++) sortedSoFar[k] = "sorted";

    while (j >= 0 && arr[j] > key) {
      setCurrentLine(3);

      incrementStep(); // ✅ comparison + shift

      // **FIXED**: Clean compare/shift colors
      setColors({ 
        ...sortedSoFar, 
        [j]: "compare", 
        [j + 1]: "swap" 
      });
      setExplanation(`Shift ${arr[j]} > ${key}`);
      arr[j + 1] = arr[j];
      setArray([...arr]);

      incrementStep(); // ✅ insert operation

      await sleep(speedRef, pauseRef, shouldStopRef);
      j--;
    }

    // **FIXED**: Insert with clean color
    setColors({ 
      ...sortedSoFar, 
      [j + 1]: "swap" 
    });
    arr[j + 1] = key;
    setArray([...arr]);
    setExplanation(`Place ${key} at ${j + 1}`);

    // **CRITICAL FIX**: Update sorted prefix to include current
    for (let k = 0; k <= i; k++) {
      sortedSoFar[k] = "sorted";
    }
    setColors(sortedSoFar);
    await sleep(speedRef, pauseRef, shouldStopRef);
  }

  setCurrentLine(-1);
  setExplanation("Insertion Sort completed! 🎉");
}
