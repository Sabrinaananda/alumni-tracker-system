const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

// CONNECT DATABASE
const db = new sqlite3.Database("./alumni.db",(err)=>{

if(err){
console.log("Database error:",err)
}else{
console.log("Connected to SQLite database")
}

})


// GET alumni
app.get("/alumni",(req,res)=>{

db.all("SELECT * FROM alumni",(err,rows)=>{

res.json(rows)

})

})


// ADD alumni
app.post("/alumni",(req,res)=>{

const {nama,jurusan,universitas,kota} = req.body

db.run(
"INSERT INTO alumni (nama,jurusan,universitas,kota,status) VALUES (?,?,?,?,?)",
[nama,jurusan,universitas,kota,"Belum Dilacak"],
()=>{

res.json({message:"Alumni berhasil ditambahkan"})

}
)

})


// PUT alumni
app.put("/alumni/:id",(req,res)=>{

console.log("Update ID:",req.params.id)
console.log(req.body)

const {nama,jurusan,universitas,kota} = req.body

db.run(
`UPDATE alumni
SET nama=?, jurusan=?, universitas=?, kota=?
WHERE id=?`,
[nama,jurusan,universitas,kota,req.params.id],

function(err){

if(err) return res.send(err)

console.log("Rows updated:",this.changes)

res.send({message:"Alumni updated"})

})

})


// DELETE alumni
app.delete("/alumni/:id",(req,res)=>{

db.run(
"DELETE FROM alumni WHERE id=?",
[req.params.id],
()=>{

res.json({message:"Deleted"})

}
)

})


// TRACK alumni
app.post("/track/:id",(req,res)=>{

const alumniId = req.params.id

const sources = [
{source:"LinkedIn",job:"Software Engineer",company:"Tokopedia"},
{source:"GitHub",job:"Backend Developer",company:"Freelance"},
{source:"Instagram",job:"Content Creator",company:"Personal"}
]

sources.forEach(s=>{

const score = Math.floor(Math.random()*100)

db.run(
`INSERT INTO tracking
(alumni_id,sumber,jabatan,instansi,lokasi,confidence,link)
VALUES (?,?,?,?,?,?,?)`,
[
alumniId,
s.source,
s.job,
s.company,
"Indonesia",
score,
"https://example.com"
]
)

})

db.run(
"UPDATE alumni SET status='Sudah Dilacak' WHERE id=?",
[alumniId]
)

res.json({message:"Tracking selesai"})

})


// GET tracking result
app.get("/result/:id",(req,res)=>{

db.all(
"SELECT * FROM tracking WHERE alumni_id=?",
[req.params.id],
(err,rows)=>{

res.json(rows)

})

})


app.listen(3000,()=>{

console.log("Server running on port 3000")

})