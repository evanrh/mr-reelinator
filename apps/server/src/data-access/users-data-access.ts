import { getConnection, type DatabaseConnection } from "../lib/db/index.js";

export class UsersDAO {
  private connection: DatabaseConnection

  public constructor() {
    this.connection = getConnection();
  }

  public async findUser(params: { username?: string, email?: string}) {
    const result = await this.connection.query<{ id: number, password: string }>({
      sql: `SELECT id, password FROM "Users" WHERE username = $1 OR email = $2`,
      binds: [params.username, params.email],
    });
    return result.rows[0];
  }
  public async createUser() {
    const query = `INSERT INTO`
    this.connection.query
  }
}
