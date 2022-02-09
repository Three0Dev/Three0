export class Project {
  creator: string;
  name: string;
  budget: number;
  users: Map<string, User>;
  currentUsed: number = 0;
  databases: Array<Database> = [];

  constructor(creator: string, name: string, budget: number = 100) {
    this.creator = creator;
    this.name = name;
    this.budget = budget;
    this.users = new Map();
  }

  addDatabase(database: Database): void {
    this.databases.push(database);
  }

  addUser(user: User): void {
    this.users.set(user.getaccountID(), user);
  }
}

export class Database {
  url: string;
  name: string;
  type: string;

  constructor(url: string, name: string, type: string) {
    this.url = url;
    this.name = name;
    this.type = type;
  }
}

export class User {
  private accountID: string;

  constructor(accountID: string) {
    this.accountID = accountID;
  }

  getaccountID(): string {
    return this.accountID;
  }
}
