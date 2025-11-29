import { getConnection, type DatabaseConnection } from "../lib/db/index.js";

interface CreateUserParams {
  username: string;
  password: string;
  inviteCode: string;
  email: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export class UsersDAO {
  private connection: DatabaseConnection;

  public constructor() {
    this.connection = getConnection();
  }

  public async findUser(params: { username?: string; email?: string }) {
    const result = await this.connection.query<User>({
      sql: `SELECT id, password, email, username FROM "Users" WHERE username = $1 OR email = $2`,
      binds: [params.username, params.email],
    });
    return result.rows[0];
  }

  public createUser(params: CreateUserParams) {
    const query = `
      INSERT INTO "Users"
        (username, password, invite_code, email)
      VALUES
        ($1, $2, $3, $4)
`;
    return this.connection.query({
      sql: query,
      binds: [
        params.username,
        params.password,
        params.inviteCode,
        params.email,
      ],
    });
  }

  public async getUsers() {
    const result = await this.connection.query({
      sql: `SELECT id, email, username, invite_code FROM "Users"`,
    });
    return result;
  }
}
