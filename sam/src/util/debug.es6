function debugLog(...args) {
  console.log(...args);
}

function debugError(...args) {
  console.error(...args);
}

function debugWarn(...args) {
  console.warn(...args);
}

const makeDebug = (debug) => {
  if (debug) {
    return {
      log: debugLog,
      error: debugError,
      warn: debugWarn
    };
  }
  return {
    log:  () => {},
    warn: (...args) => { alert(args.join(', ')); },
    error: (...args) => { alert(args.join(', ')); }
  };
};

export default makeDebug;
