// @ts-nocheck
import data from '../data/data.json';

let index = 0;
let interval = null;
let listeners = [];

function start() {
  if (interval) return; // prevent multiple intervals

  interval = setInterval(() => {
    if (index >= data.length) index = 0;

    const reading = {
      ...data[index],
      timestamp: Date.now(),
    };

    index++;

    listeners.forEach(cb => cb(reading));
  }, 2000);
}

function stop() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function on(cb) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter(l => l !== cb);
  };
}

export default { start, stop, on };