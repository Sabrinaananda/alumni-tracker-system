const API = "http://localhost:3000"


function loadAlumni(){

fetch(API+"/alumni")
.then(res=>res.json())
.then(data=>{

let html=""

data.forEach(a=>{

html+=`

<tr class="hover:bg-gray-50 transition">

<td class="p-4">${a.nama}</td>

<td class="p-4">${a.jurusan}</td>

<td class="p-4">

${a.status === "Sudah Dilacak"
? '<span class="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">Sudah Dilacak</span>'
: '<span class="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">Belum Dilacak</span>'
}

</td>

<td class="p-4 space-x-2">

<button onclick="track(${a.id})"
class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
Track
</button>

<button onclick="view(${a.id})"
class="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800">
Result
</button>

<button onclick="editAlumni(${a.id})"
class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
Edit
</button>

<button onclick="deleteAlumni(${a.id})"
class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
Delete
</button>

</td>

</tr>

`

})

document.getElementById("list").innerHTML = html

})

}



function addAlumni(){

fetch(API+"/alumni",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

nama:document.getElementById("nama").value,
jurusan:document.getElementById("jurusan").value,
universitas:document.getElementById("universitas").value,
kota:document.getElementById("kota").value

})

})
.then(()=>{

loadAlumni()

document.getElementById("nama").value=""
document.getElementById("jurusan").value=""
document.getElementById("universitas").value=""
document.getElementById("kota").value=""

})

}



function editAlumni(id){

const nama = prompt("Masukkan nama baru:")
const jurusan = prompt("Masukkan jurusan baru:")
const universitas = prompt("Masukkan universitas baru:")
const kota = prompt("Masukkan kota baru:")

if(!nama || !jurusan || !universitas || !kota){
alert("Semua field harus diisi")
return
}

fetch(API+"/alumni/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nama,
jurusan,
universitas,
kota
})

})
.then(()=>{
alert("Data berhasil diupdate")
loadAlumni()
})

}



function deleteAlumni(id){

if(!confirm("Yakin ingin menghapus alumni ini?")) return

fetch(API+"/alumni/"+id,{
method:"DELETE"
})
.then(()=>loadAlumni())

}



function track(id){

const btn = event.target

btn.innerText="Tracking..."
btn.disabled=true

fetch(API+"/track/"+id,{method:"POST"})
.then(()=>{

btn.innerText="Done"

setTimeout(()=>{
loadAlumni()
},1000)

})

}



function view(id){

window.location="result.html?id="+id

}



function searchAlumni(){

const keyword = document.getElementById("search").value.toLowerCase()

const rows = document.querySelectorAll("#list tr")

rows.forEach(row=>{

const text = row.innerText.toLowerCase()

row.style.display = text.includes(keyword) ? "" : "none"

})

}



if(document.getElementById("list")){
loadAlumni()
}



if(document.getElementById("result")){

const url = new URLSearchParams(window.location.search)

const id = url.get("id")

fetch(API+"/result/"+id)
.then(res=>res.json())
.then(data=>{

let html=""

data.forEach(r=>{

html+=`

<tr class="hover:bg-gray-50">

<td class="p-4">${r.sumber}</td>
<td class="p-4">${r.jabatan}</td>
<td class="p-4">${r.instansi}</td>
<td class="p-4">${r.confidence}</td>

</tr>

`

})

document.getElementById("result").innerHTML = html

})

}



// AUTO REFRESH DATA
setInterval(()=>{

if(document.getElementById("list")){
loadAlumni()
}

},5000)