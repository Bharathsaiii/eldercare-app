import { EventEmitter } from 'events';

const emitter = new EventEmitter();

export function startMockSensor() {
  let running = true;

  (async function loop() {
    while (running) {
      const hr = Math.floor(55 + Math.random() * 90); // 55–145 BPM
      emitter.emit('hr', { hr, timestamp: Date.now() });

      await new Promise(res => setTimeout(res, 4000 + Math.random() * 2000));
    }
  })();

  return () => { running = false };
}

export function onHeartRate(callback) {
  emitter.on('hr', callback);
  return () => emitter.off('hr', callback);
}
