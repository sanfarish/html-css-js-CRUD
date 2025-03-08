const data = [
  { name: "Faris Hasan", picture: "./public/avatar.png", age: 25, email: "farisfalah@gmail.com"},
  { name: "John Doe", picture: "./public/avatar.png", age: 30, email: "doejohn@mail.com"},
  { name: "Jane Doe", picture: "./public/avatar.png", age: 20, email: "janedoe@mail.com"},
  { name: "Alpha", picture: "./public/avatar.png", age: 25, email: "alpha@gmail.com"},
  { name: "Beta", picture: "./public/avatar.png", age: 30, email: "beta@mail.com"},
  { name: "Gamma", picture: "./public/avatar.png", age: 20, email: "gamma@mail.com"},
  { name: "Delta", picture: "./public/avatar.png", age: 25, email: "delta@gmail.com"},
  { name: "Epsilon", picture: "./public/avatar.png", age: 30, email: "epsilon@mail.com"},
  { name: "Zeta", picture: "./public/avatar.png", age: 20, email: "zeta@mail.com"},
  { name: "Eta", picture: "./public/avatar.png", age: 20, email: "eta@mail.com"},
  { name: "Theta", picture: "./public/avatar.png", age: 20, email: "theta@mail.com"},
]

const container = document.querySelector("#container")
const table = document.querySelector("#data")
const entries = document.querySelector("#entries")
const pages = document.querySelector("#pages")
const picture = document.querySelector("#picture")
const pictureFrame = document.querySelector("#pictureFrame")

let length = data.length
let indexStart = 0
let indexEnd = 2
let size = parseInt(entries.value)
let pageNow = 1

function showData(neededData) {
  table.innerHTML = ""
  neededData.forEach((item, index) => {
    if (index >= indexStart && index <= indexEnd) {
      const row =
      `<tr class="card bg-gray-900 h-16">
        <td class="border border-gray-300 px-4">${item.name}</td>
        <td class="border border-gray-300 px-4">
          <img src="${item.picture}" alt="${item.picture}" width="40" height="40">
        </td>
        <td class="border border-gray-300 px-4">${item.age}</td>
        <td class="border border-gray-300 px-4">${item.email}</td>
        <td class="border border-gray-300 px-4 text-center">
          <button type="button" class="bg-green-600 px-2 py-1 mx-1 rounded cursor-pointer">Detail</button>
          <button type="button" class="bg-yellow-600 px-2 py-1 mx-1 rounded cursor-pointer" onclick="updateData(${index})">Edit</button>
          <button type="button" class="bg-red-600 px-2 py-1 mx-1 rounded cursor-pointer" onclick="deleteData(${index})">Delete</button>
        </td>
      </tr>`
      table.innerHTML += row
    }
  })
}

window.onload = () => {
  pagesFunction()
  showData(data)
}

function pagesFunction() {
  const totalPages = Math.ceil(length / size)
  pages.innerHTML = ""
  for (let index = 1; index <= totalPages; index++) {
    const page = `
    <button type="button" class="border rounded px-2 py-1 cursor-pointer" onclick="page(${index})">${index}</button>
    `
    pages.innerHTML += page
  }
}

function page(pageNumber) {
  indexStart = ((pageNumber * size) - size)
  indexEnd = (pageNumber * size) - 1
  pageNow = pageNumber
  showData(data)
}

function prevPage() {
  if (pageNow !== 1) {
    pageNow -= 1
    page(pageNow)
  }
}

function nextPage() {
  if (pageNow !== Math.ceil(length / size)) {
    pageNow += 1
    page(pageNow)
  }
}

function deleteData(index) {
  data.splice(index, 1)
  showData(data)
}

function closeModal() {
  document.querySelector("#modal").remove()
}

picture.addEventListener("change", e => {
  if (picture.files[0].size < 1000000) {
    const fileReader = new FileReader()
    fileReader.onload = f => {
      const imgURL = f.target.result
      pictureFrame.src = imgURL
    }
    fileReader.readAsDataURL(picture.files[0])
  } else {
    pictureFrame.src = "./public/avatar.png"
    picture.value = null
    alert("Too big")
  }
})

function addData() {
  const name = document.querySelector("#name")
  const age = document.querySelector("#age")
  const email = document.querySelector("#email")
  const newData = {
    name: name.value,
    picture: pictureFrame.src,
    age: age.value,
    email: email.value,
  }
  data.push(newData)
  showData(data)
  name.value = null
  picture.value = null
  pictureFrame.src = "./public/avatar.png"
  age.value = null
  email.value = null
}

function updateData(index) {
  const newName = prompt("Name:", data[index].name)
  const newAge = prompt("Age:", data[index].age)
  const newEmail = prompt("Email:", data[index].email)
  const newData = {
    name: newName,
    age: newAge,
    email: newEmail
  }
  data[index] = newData
  showData(data)
}

document.querySelector("#search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  if (value !== null || value !== "") {
    const filteredData = data.filter(item => item.name.toLowerCase().includes(value) || item.email.toLowerCase().includes(value))
    showData(filteredData)
  } else {
    showData(data)
  }
})

entries.addEventListener("change", () => {
  const value = parseInt(entries.value)
  indexStart = 0
  size = value
  indexEnd = size - 1
  pagesFunction()
  showData(data)
})

// function addModal() {
//   const div =
//   `<div id="modal" class="fixed top-0 left-0 h-full w-full flex items-center justify-center no-doc-scroll">
//     <div class="bg-gray-800 shadow-lg rounded p-8 flex flex-col gap-8">
//       <button class="text-gray-400 px-2 py-1 ml-auto border-1 border-gray-400 cursor-pointer" onclick="closeModal()">X</button>
//       <div class="text-white flex flex-col gap-4">
//         <label class="flex flex-col">
//           Name:
//           <input type="text" id="name" class="bg-gray-800 border-2">
//         </label>
//         <label class="flex flex-col">
//           Age:
//           <input type="number" id="age" class="bg-gray-800 border-2">
//         </label>
//         <label class="flex flex-col">
//           Email:
//           <input type="email" id="email" class="bg-gray-800 border-2">
//         </label>
//       </div>
//       <button type="button" class="bg-blue-600 rounded px-2 py-1 cursor-pointer" onclick="addData()">Add</button
//     </div>
//   </div>`
//   container.innerHTML += div
// }

// let items = [
//   { name: "faris" }
// ];

// function createItem() {
//   const nameInput = document.getElementById('name');
//   const name = nameInput.value.trim();
//   if (name) {
//     items.push({ name });
//     nameInput.value = '';
//     renderItems();
//   }
// }

// function deleteItem(index) {
//   items.splice(index, 1);
//   renderItems();
// }

// function updateItem(index) {
//   const newName = prompt("Enter new name:", items[index].name);
//   if (newName !== null && newName.trim() !== "") {
//     items[index].name = newName.trim();
//     renderItems();
//   }
// }

// function renderItems() {
//   const itemList = document.getElementById('itemList');
//   itemList.innerHTML = '';
//   items.forEach((item, index) => {
//     const li = document.createElement('li');
//     li.textContent = item.name;
//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'Delete';
//     deleteButton.onclick = () => deleteItem(index);
//     const updateButton = document.createElement('button');
//     updateButton.textContent = 'Update';
//     updateButton.onclick = () => updateItem(index);
//     li.appendChild(deleteButton);
//     li.appendChild(updateButton);
//     itemList.appendChild(li);
//   });
// }

// renderItems()