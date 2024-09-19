export function debounce(callback, delay) {
    let timer;
    return function(...args) {  // Spread operator to capture arguments
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);  // Pass arguments to the callback
      }, delay);
    };
  }
  