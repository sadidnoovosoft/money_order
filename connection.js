import pg from "pg";

// Singleton class that will only return one instance of pool
class Database {
    constructor() {
        this.pool = new pg.Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        })
    }

    static getPool() {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance.getPool();
    }

    getPool() {
        return this.pool;
    }
}

export default Database.getPool();