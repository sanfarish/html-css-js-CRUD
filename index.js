(() => {
  const API_URL = "http://localhost:3000"
  const employees = []
  const filteredEmployees = []

  const table = document.querySelector("#data")
  const entryInput = document.querySelector("#entries")
  const searchInput = document.querySelector("#search")
  const pagesInput = document.querySelector("#pages")
  const prevPage = document.querySelector("#previous")
  const nextPage = document.querySelector("#next")
  const openModal = document.querySelector("#open-modal")
  const closeModal = document.querySelector("#close-modal")
  const modal = document.querySelector("#modal")

  let startIndex = 0
  let endIndex = entryInput.value - 1
  let currentPage = 1
  let filterOn = false

  /**
   * Fetch data form server.
   * @param {string} url 
   * @returns 
   */
  async function fetchData(url) {
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  /**
   * Fill "employees" array with data.
   * @param {Array} data 
   */
  function manipulateData(data) {
    employees.push(...data)
  }

  /**
   * Render employee data into table.
   * @param {Array} data 
   */
  function renderData(data) {
    table.innerHTML = ""
    data.forEach((employee, index) => {
      if (index >= startIndex && index <= endIndex ) {
        const row = `
        <tr>
          <td class="p-2 border"><div class="flex items-center justify-center"><img src="${API_URL + employee.picture}" alt="${employee.name}" height="64" width="64"></div></td>
          <td class="p-2 border">${employee.id}</td>
          <td class="p-2 border">${employee.name}</td>
          <td class="p-2 border">${employee.email}</td>
          <td class="p-2 border text-center">${employee.start_date}</td>
          <td class="py-2 px-4 border"><div class="flex items-center justify-between"><span>$</span>${employee.salary}</div></td>
          <td class="p-2 border">${employee.role}</td>
          <td class="p-2 border">${employee.active ? '<div class="h-16 bg-green-500"></div>' : '<div class="h-16 bg-red-500"></div>'}</td>
          <td class="p-2 border text-center">
            <input class="py-1 px-2 m-1 rounded cursor-pointer bg-orange-700 hover:bg-orange-600 active:bg-orange-800" onmouseup="updateData('${employee.id}')" type="button" value="UPD">
            <input class="py-1 px-2 m-1 rounded cursor-pointer bg-red-700 hover:bg-red-600 active:bg-red-800" onmouseup="deleteData('${employee.id}')" type="button" value="DEL">
          </td>
        </tr>
        `
        table.innerHTML += row
      }
    })
  }

  /**
   * Perform side effect when index.html rendering for the first time
   */
  window.onload = async () => {
    const data = await fetchData(API_URL + "/employees")
    manipulateData(data)
    renderData(employees)
    renderPages(employees.length)
  }

  /**
   * Entry selection change actions
   */
  entryInput.addEventListener("change", e => {
    const entry = e.target.value
    startIndex = 0
    endIndex = entry - 1
    if (filterOn) {
      renderData(filteredEmployees)
      renderPages(filteredEmployees.length)
    } else {
      renderData(employees)
      renderPages(employees.length)
    }
  })

  /**
   * Search input actions
   */
  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase()
    filteredEmployees.length = 0
    startIndex = 0
    if (term !== null || term !== "") {
      filterOn = true
      filteredEmployees.push(...employees.filter(employee => employee.id.toLowerCase().includes(term) || employee.name.toLowerCase().includes(term) || employee.email.toLowerCase().includes(term) || employee.role.toLowerCase().includes(term)))
      renderData(filteredEmployees)
      renderPages(filteredEmployees.length)
    } else {
      filterOn = false
      renderData(employees)
    }
  })

  /**
   * Delete data based on ID
   * @param {string} id 
   */
  window.deleteData = async (id) => {
    try {
      alert(id)
      // const res = await fetch(API_URL + `/employees/${id}`, { method: "DELETE" })
      // console.log(res)
      // const data = await res.json()
      // console.log(data)
      // renderData(employees)
    } catch (error) {
      console.log(error)
      alert("error")
    }
  }

  /**
   * Render pagination number
   * @param {number} dataLength 
   */
  function renderPages(dataLength) {
    const totalPages = Math.ceil(dataLength / entryInput.value)
    pagesInput.innerHTML = ""
    for (let index = 1; index <= totalPages; index++) {
      const row = `<input class="border rounded px-2 py-1 cursor-pointer" type="button" value="${index}" id="page-${index}" onclick="page(${index})">`
      pagesInput.innerHTML += row
    }
    currentPage = 1
    document.querySelector("#page-" + currentPage).classList.remove("text-white")
    document.querySelector("#page-" + currentPage).classList.add("bg-button3", "text-black")
    prevPage.classList.remove("text-white", "cursor-pointer")
    prevPage.classList.add("text-gray-400", "cursor-not-allowed")
    if (dataLength / entryInput.value <= 1) {
      nextPage.classList.remove("text-white", "cursor-pointer")
      nextPage.classList.add("text-gray-400", "cursor-not-allowed")
    } else {
      nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
      nextPage.classList.add("text-white", "cursor-pointer")
    }
  }

  /**
   * Set page-related variables and page-related elements
   * @param {number} index 
   */
  window.page = (index) => {
    if (index !== currentPage) {
      startIndex = (index * entryInput.value) - entryInput.value
      endIndex = (index * entryInput.value) - 1
      document.querySelector("#page-" + currentPage).classList.add("text-white")
      document.querySelector("#page-" + currentPage).classList.remove("bg-button3", "text-black")
      currentPage = index
      if (filterOn) {
        renderData(filteredEmployees)
        if (index >= Math.ceil(filteredEmployees.length / entryInput.value)) {
          nextPage.classList.remove("text-white", "cursor-pointer")
          nextPage.classList.add("text-gray-400", "cursor-not-allowed")
        } else {
          nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
          nextPage.classList.add("text-white", "cursor-pointer")
        }
      } else {
        renderData(employees)
        if (index >= Math.ceil(employees.length / entryInput.value)) {
          nextPage.classList.remove("text-white", "cursor-pointer")
          nextPage.classList.add("text-gray-400", "cursor-not-allowed")
        } else {
          nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
          nextPage.classList.add("text-white", "cursor-pointer")
        }
      }
      document.querySelector("#page-" + currentPage).classList.remove("text-white")
      document.querySelector("#page-" + currentPage).classList.add("bg-button3", "text-black")
      if (index <= 1) {
        prevPage.classList.remove("text-white", "cursor-pointer")
        prevPage.classList.add("text-gray-400", "cursor-not-allowed")
      } else {
        if (prevPage.classList.contains("cursor-not-allowed")) {
          prevPage.classList.remove("text-gray-400", "cursor-not-allowed")
          prevPage.classList.add("text-white", "cursor-pointer")
        }
      }
    }
  }

  /**
   * Previous page button actions
   */
  prevPage.addEventListener("mouseup", () => {
    if (currentPage > 1) {
      document.querySelector("#page-" + currentPage).classList.add("text-white")
      document.querySelector("#page-" + currentPage).classList.remove("bg-button3", "text-black")
      page(currentPage - 1)
    }
  })

  /**
   * Next page button actions
   */
  nextPage.addEventListener("mouseup", () => {
    const dataLength = filterOn ? filteredEmployees.length : employees.length
    if (currentPage < Math.ceil(dataLength / entryInput.value)) {
      document.querySelector("#page-" + currentPage).classList.add("text-white")
      document.querySelector("#page-" + currentPage).classList.remove("bg-button3", "text-black")
      page(currentPage + 1)
    }
  })

  /**
   * Open modal button actions
   */
  openModal.addEventListener("mouseup", () => {
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  })

  /**
   * Close modal button actions
   */
  closeModal.addEventListener("mouseup", () => {
    modal.classList.remove("flex")
    modal.classList.add("hidden")
  })
})()

// const container = document.querySelector("#container")
// const table = document.querySelector("#data")
// const entries = document.querySelector("#entries")
// const pages = document.querySelector("#pages")
// const picture = document.querySelector("#picture")
// const pictureFrame = document.querySelector("#pictureFrame")
// const modal = document.querySelector("#modal")

// let length = data.length
// let indexStart = 0
// let indexEnd = 2
// let size = parseInt(entries.value)
// let pageNow = 1

// picture.addEventListener("change", e => {
//   if (picture.files[0].size < 1000000) {
//     const fileReader = new FileReader()
//     fileReader.onload = f => {
//       const imgURL = f.target.result
//       pictureFrame.src = imgURL
//     }
//     fileReader.readAsDataURL(picture.files[0])
//   } else {
//     pictureFrame.src = "./public/avatar.png"
//     picture.value = null
//     alert("Too big")
//   }
// })

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