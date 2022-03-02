// import { stringifyJsonOrBytes } from "near-api-js/lib/transaction";

@nearBindgen
export class Project {
  creator: string;
  name: string;
  description: string;
  users: Map<string, User>;
  databases: Map<string, Database>;

  constructor(creator: string, name: string, description: string) {
    this.creator = creator;
    this.name = name;
    this.description = description;
    this.users = new Map<string, User>();
    this.users.set("sparsh",new User("1"));
    // this.users = new Map([
    //   ["dp", new User("12")],
    //   ["kl", new User("13")],
    // ]);
    // this.users["sparsh"] = new User("12");
    // this.users["harshit "] = new User("6");

    this.databases = new Map();
  }

  addDatabase(database: Database): void {
    this.databases.set(database.address, database);
  }

  addUser(user: User): void {
    this.users.set(user.getaccountID(), user);
  }
}

@nearBindgen
export class Database {
  address: string;
  name: string;
  type: string;

  constructor(address: string, name: string, type: string) {
    this.address = address;
    this.name = name;
    this.type = type;
  }
}

@nearBindgen
export class User {
  private accountID: string;
  active: boolean;

  constructor(accountID: string) {
    this.accountID = accountID;
    this.active = false;
  }

  getaccountID(): string {
    return this.accountID;
  }

  setActive(status: boolean): void{
      this.active = status;
  }

  getActive():boolean{
    return this.active;
  }

}

@nearBindgen
export class DatabaseInfoSchema {
  address: string;
  name: string;
  type: string;
}

@nearBindgen
export class ProjectReturnSchema {
    pid: string;
    name: string;
    description: string;
    numUsers: number;
    numDatabases: number;
}

@nearBindgen
export class UserReturnSchema {
  pid: string;
  walletID: string;
  co: string;
  active: boolean;
}