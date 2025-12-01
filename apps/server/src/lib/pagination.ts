import { Writable, type Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { collect, skip, take } from "./stream-utils.js";
import { jsonStream } from "./jsonstream.js";
import type { StreamingApi } from "hono/utils/stream";

interface PaginatedResponseParams {
  stream: Readable;
  limit: number;
  offset: number;
}

export async function collectPaginatedResponse(
  params: PaginatedResponseParams,
) {
  const { result, sink } = collect();
  await pipeline(params.stream, skip(params.offset), take(params.limit), sink);
  return result;
}

export async function streamPaginatedResponse(
  params: PaginatedResponseParams & { outputStream: StreamingApi },
) {
  await pipeline(
    params.stream,
    skip(params.offset),
    take(params.limit),
    jsonStream(),
    new Writable({
      async write(chunk, _enc, callback) {
        await params.outputStream.write(chunk);
        callback();
      },
      async final(callback) {
        try {
          await params.outputStream.close();

          callback();
        } catch (err) {
          callback(err as Error);
        }
      },
    }),
  );
}
