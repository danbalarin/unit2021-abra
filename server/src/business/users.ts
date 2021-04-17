import UsersRepository from '../repositories/inmemory/users';
import UsersApi, { UserResponse } from '../api/users';
import User, {UserRole} from '../models/user';
import UsersBusinessInterface from './usersInterface';

export default class UsersBusiness implements UsersBusinessInterface {

  private api: UsersApi;
  private repoUsers: UsersRepository;

  private isFetched: boolean;

  constructor(options: {
    api: UsersApi,
    repoUsers: UsersRepository,
  }) {
    Object.assign(this, options);
    this.isFetched = false;
  }

  async fetch(): Promise<User[]> {
    if (this.isFetched) return;

    const usersRaw = await this.api.list();
    const users: User[] = usersRaw.map(userRaw => {
      return new User({
        id: userRaw.id,
        username: userRaw.kod,
        email: userRaw.email,
        name: `${userRaw.jmeno} ${userRaw.prijmeni}`.trim(),
        role: userRaw.role as UserRole
      });
    })

    users.forEach(user => this.repoUsers.insert(user));
    
    this.isFetched = true;
  }

  async list(): Promise<User[]> {
    return await this.repoUsers.findAll();
  }

  async getUserByAuthToken(token: string): Promise<User> {
    const id = await this.api.myId(token);
    const user = await this.repoUsers.findById(id);
    return user;
  }

  async getReceptionists(): Promise<User[]> {
    const users = await this.list();
    return users.filter(user => user.role === UserRole.RECEPTIONIST);
  }
}