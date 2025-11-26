import z from "zod";
import { UsersDAO } from "../data-access/users-data-access.js";
import {
  authLoginRequestSchema,
  authRegistrationSchema,
} from "../routes/auth/schemas.js";
import { InviteCodesDAO } from "../data-access/invite-codes-data-access.js";
import { checkPasswordHash, hashPassword } from "../lib/utils.js";
import { createAccessToken, createRefreshToken } from "../lib/auth.js";

type RegistrationParams = z.infer<typeof authRegistrationSchema>;
type LoginParams = z.infer<typeof authLoginRequestSchema>;

export class AuthService {
  private usersDAO: UsersDAO;
  private invitesDAO: InviteCodesDAO;

  public constructor() {
    this.usersDAO = new UsersDAO();
    this.invitesDAO = new InviteCodesDAO();
  }

  public async login(params: LoginParams) {
    const user = await this.usersDAO.findUser(params);

    if (!user?.id) {
      return { err: "User not found" } as const;
    }

    const passwordsMatch = await checkPasswordHash(
      params.password,
      user.password,
    );

    if (!passwordsMatch) {
      return { err: "Invalid Password" } as const;
    }

    const userId = user.id;
    const [accessToken, refreshToken] = await Promise.all([
      createAccessToken({ userId }),
      createRefreshToken({ userId }),
    ]);

    return { err: null, accessToken, refreshToken };
  }

  public async register(params: RegistrationParams) {
    const inviteRes = await this.invitesDAO.find({ code: params.inviteCode });

    if (inviteRes.rows.length === 0) {
      return { err: "Invalid invite code" };
    } else if (false) {
      return { err: "Invite code expired" };
    }

    const existingUserRes = await this.usersDAO.findUser({
      email: params.email,
      username: params.username,
    });

    if (existingUserRes) {
      if (existingUserRes.username === params.username) {
        return { err: "Username taken" };
      } else {
        return { err: "Email in use" };
      }
    }

    const passwordHash = await hashPassword(params.password);
    const userRes = await this.usersDAO.createUser({
      username: params.username,
      email: params.email,
      password: passwordHash,
      inviteCode: params.inviteCode,
    });

    if (userRes.rowCount === 1) {
      return { err: null };
    } else {
      return { err: "Could not create user" };
    }
  }
}
