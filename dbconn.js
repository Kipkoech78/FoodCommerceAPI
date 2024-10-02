const {Pool} = require('pg');
const pool = new Pool({
    user:"postgres",
    password: "Classwork2003",
    host:"localhost",
    port: 5432,
    database: "yt_login_sys"
})


module.exports = pool;