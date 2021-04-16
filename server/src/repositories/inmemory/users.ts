import User from "../../models/user";

export default class UsersRepository {
  private storage: {[id: number]: User};
  
  constructor() {
    this.storage = {};
  }

  async findById(id: number): Promise<User | null> {
    return this.storage[id];
  }

  async findByUsername(username: string): Promise<User | null> {
    return Object.values(this.storage).find(user => user.username == username);
  }

  async findAll(): Promise<User[]> {
    return Object.values(this.storage);
  }

  async insert(user: User): Promise<void> {
    this.storage[user.id] = user;
  }
}