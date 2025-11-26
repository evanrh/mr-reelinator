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
    return this.connection.query<{ code: string; expiration_teimstamp: Date }>({
      sql: `SELECT * FROM "Invites" WHERE code = $1`,
      binds: [params.code],
    });
  }
}
