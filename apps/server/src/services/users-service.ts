import { UsersDAO } from "../data-access/users-data-access.js";

export class UsersService {
  private usersDao: UsersDAO;

  public constructor() {
    this.usersDao = new UsersDAO();
  }

  public async getUsers() {
    const results = await this.usersDao.getUsers();
    return results;
  }
}
