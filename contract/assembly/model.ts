@nearBindgen
export class Project {
  creator: string;
  name: string;
  description: string;
  users: Map<string, User>;
  currentUsed: number = 0;
  databases: Array<Database> = [];

  constructor(creator: string, name: string, description: string) {
    this.creator = creator;
    this.name = name;
    this.description = description;
    this.users = new Map();
  }

  addDatabase(database: Database): void {
    this.databases.push(database);
  }

  addUser(user: User): void {
    this.users.set(user.getaccountID(), user);
  }
}

@nearBindgen
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

@nearBindgen
export class User {
  private accountID: string;

  constructor(accountID: string) {
    this.accountID = accountID;
  }

  getaccountID(): string {
    return this.accountID;
  }
}
