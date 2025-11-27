import { InviteCodesDAO } from "../data-access/invite-codes-data-access.js";

export class InvitesService {
  private invitesDao: InviteCodesDAO;

  public constructor() {
    this.invitesDao = new InviteCodesDAO();
  }

  public async getAllInvites() {
    const res = await this.invitesDao.getAll();
    return res.rows;
  }
  public async getInvite(code: string) {
    const res = await this.invitesDao.find({ code });
    return res.rows[0];
  }
}
