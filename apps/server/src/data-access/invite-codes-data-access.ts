import { getConnection, type DatabaseConnection } from "../lib/db/index.js";

interface FindInviteCodeParams {
  code: string;
}

export class InviteCodesDAO {
  private connection: DatabaseConnection;

  public constructor() {
    this.connection = getConnection();
  }

  public find(params: FindInviteCodeParams) {
    return this.connection.query<{ code: string; expiration_timestamp: Date }>({
      sql: `SELECT * FROM "Invites" WHERE code = $1`,
      binds: [params.code],
    });
  }

  public getAll() {
    return this.connection.query({
      sql: `SELECT * FROM "Invites"`,
    });
  }
}
