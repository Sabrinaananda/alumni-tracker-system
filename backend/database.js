const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./alumni.db')

db.serialize(() => {

db.run(`CREATE TABLE IF NOT EXISTS alumni(
id INTEGER PRIMARY KEY AUTOINCREMENT,
nama TEXT,
jurusan TEXT,
universitas TEXT,
kota TEXT,
status TEXT
)`)

db.run(`CREATE TABLE IF NOT EXISTS tracking(
id INTEGER PRIMARY KEY AUTOINCREMENT,
alumni_id INTEGER,
sumber TEXT,
jabatan TEXT,
instansi TEXT,
lokasi TEXT,
confidence INTEGER,
link TEXT
)`)

})

module.exports = db
