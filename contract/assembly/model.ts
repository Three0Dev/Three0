export class Project {
    creator: string;
    name: string;
    budget: number;
    currentUsed: number = 0;
    databases: Database[] = [];
    users: Map<string, User>;

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
    private orbitID: string;
    private accountID: string;

    constructor(accountID: string, orbitID: string = '') {
        this.accountID = accountID;
        this.orbitID = orbitID;
    }

    getaccountID(): string {
        return this.accountID;
    }

    getOrbitID(sender: string): string {
        return this.accountID == sender ? this.orbitID : '';
    }

    setOrbitID(orbitID: string, sender: string): void {
        if (this.accountID !== sender) return;
        this.orbitID = orbitID;
    }

}