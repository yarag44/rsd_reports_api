const Pool = require("pg").Pool;


const pool = new Pool({
    user : "cuzqqltn",
    password: "Je7L_TTil0jo3eh3dlllnG5so53U9BLI",
    database: "cuzqqltn",
    host: "heffalump.db.elephantsql.com",
    port: "5432",
    min: 0,
    max: 1,
    idleTimeoutMillis: 1,
    createTimeoutMillis: 30000000,
    acquireTimeoutMillis: 30000000,
    propagateCreateError: false,
})

module.exports = pool;