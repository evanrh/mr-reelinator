import { Transform } from "node:stream";

/**
 * Takes a stream of data and outputs it as a streaming JSON array.
 * Think of it as slowly creating a JSON encoded array.
 */
export function jsonStream() {
  let isFirstPass = true;
  return new Transform({
    objectMode: true,
    transform(chunk, _, callback) {
      if (isFirstPass) {
        this.push("[\n");
        isFirstPass = false;
      } else {
        this.push(",\n");
      }
      this.push(JSON.stringify(chunk));
      callback();
    },
    final(callback) {
      this.push("\n]\n");
      callback();
    },
  });
}
