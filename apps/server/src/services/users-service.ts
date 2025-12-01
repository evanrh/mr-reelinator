import { UsersDAO } from "../data-access/users-data-access.js";

export class UsersService {
  private usersDao: UsersDAO;

  public constructor() {
    this.usersDao = new UsersDAO();
  }

  public getUsers() {
    const stream = this.usersDao.getUsers();
    return stream;
  }
}
