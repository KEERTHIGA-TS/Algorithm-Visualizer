// src/utils/sleep.js - SLOWED DOWN significantly
export const sleep = async (speed, pauseRef, shouldStopRef) => {
    const MIN_DELAY = 10;   // Increased from 10ms
    const MAX_DELAY = 1200; // Increased from 800ms
    
    // Linear: speed 1=very slow (1200ms), speed 100=fast (50ms)
    const delay = MAX_DELAY - (speed / 100) * (MAX_DELAY - MIN_DELAY);
    
    let elapsed = 0;
    while (elapsed < Math.max(delay, MIN_DELAY)) {
        if (shouldStopRef.current) return;
        
        while (pauseRef.current) {
            await new Promise((res) => setTimeout(res, 100)); // Slower pause check
        }
        
        await new Promise((res) => setTimeout(res, 30)); // Slower tick
        elapsed += 30;
    }
};
