import { Transform } from "node:stream";

export function skip(num: number) {
  let numSkipped = 0;
  return new Transform({
    objectMode: true,
    transform(chunk, _, callback) {
      if (numSkipped < num) {
        numSkipped += 1;
        callback();
        return;
      }

      this.push(chunk);
      callback();
    },
  });
}

export function take(num: number) {
  let numTaken = 0;
  return new Transform({
    objectMode: true,
    transform(chunk, _, callback) {
      if (numTaken < num) {
        this.push(chunk);
        numTaken++;
        callback();
        return;
      }

      this.push(null);
      callback();
    },
  });
}

/**
 * Creates a sink stream to collect and return results from a source stream
 */
export function collect<T>() {
  const result: T[] = [];

  const sink = async function* () {
    const strm = arguments[0];
    for await (const chunk of strm) {
      result.push(chunk);
    }
  };
  return { result, sink };
}
