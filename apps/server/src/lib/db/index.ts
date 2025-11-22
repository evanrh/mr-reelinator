import { Pool, type QueryResult, type QueryResultRow } from "pg";
import type { QueryParams } from "./types.js";

export class DatabaseConnection {
  private pool: Pool;
  public constructor() {
    this.pool = new Pool({
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
      maxLifetimeSeconds: 60,
    });

    this.pool.on('error', (err) => {
      console.error('pool errored:', err);
    })
  }

  public async query<T extends QueryResultRow>(params: QueryParams) {
    return this.pool.query(
      params.sql, params.binds
    ) as Promise<QueryResult<T>>;
  }
}

let connection: DatabaseConnection;

export function getConnection() {
  if (!connection) {
    connection = new DatabaseConnection();
  }
  return connection;
}

// TODO: some kind of error handling and reconnection if needed
