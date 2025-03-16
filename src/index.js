(() => {
  const API_URL = "http://localhost:3000"
  const employees = []
  const pictures = []
  const filteredEmployees = []

  const table = document.querySelector("#data")
  const entryInput = document.querySelector("#entries")
  const searchInput = document.querySelector("#search")
  const pagesInput = document.querySelector("#pages")
  const prevPage = document.querySelector("#previous")
  const nextPage = document.querySelector("#next")
  const openModal = document.querySelector("#open-modal")
  const modal = document.querySelector("#modal")
  const closeModal = document.querySelector("#close-modal")
  const pictureContainer = document.querySelector("#picture-container")
  const pictureInput = document.querySelector("#picture")
  const formInput = document.querySelector("#form")

  let startIndex = 0
  let endIndex = entryInput.value - 1
  let currentPage = 1
  let filterOn = false
  let pictureData = "default"

  /**
   * Fetch data form server.
   * @param {string} url 
   * @returns 
   */
  async function fetchData(url) {
    try {
      const res = await fetch(url)
      const data = await res.json()
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Fill array with data.
   * @param {Array} data 
   * @param {Array} array 
   */
  function manipulateData(data, array) {
    array.push(...data)
  }

  /**
   * Render employee data into table.
   * @param {Array} data 
   */
  function renderData(data) {
    table.innerHTML = ""
    if (data.length !== 0) {
      data.forEach((employee, index) => {
        if (index >= startIndex && index <= endIndex ) {
          const pictureArr = pictures.filter(pic => pic.id === employee.picture)
          const pictureObj = pictureArr[0]
          const pictureSource = pictureObj.picture
          const row = `
          <tr>
            <td class="p-2 border"><div class="flex items-center justify-center"><img src="${pictureSource}" alt="${employee.name}" height="64" width="64"></div></td>
            <td class="p-2 border">${employee.id}</td>
            <td class="p-2 border">${employee.name}</td>
            <td class="p-2 border">${employee.email}</td>
            <td class="p-2 border text-center">${employee.date}</td>
            <td class="py-2 px-4 border"><div class="flex items-center justify-between"><span>$</span>${employee.salary}</div></td>
            <td class="p-2 border">${employee.role}</td>
            <td class="p-2 border text-center">${employee.active ? '<span class="font-semibold text-green-400">Active</span>' : '<span class="font-semibold text-red-400">Inactive</span>'}</td>
            <td class="p-2 border text-center">
              <input class="py-1 px-2 m-1 rounded cursor-pointer bg-orange-700 hover:bg-orange-600 active:bg-orange-800" onmouseup="updateData('${employee.id}')" type="button" value="UPD">
              <input class="py-1 px-2 m-1 rounded cursor-pointer bg-red-700 hover:bg-red-600 active:bg-red-800" onmouseup="deleteData('${employee.id}', '${employee.picture}')" type="button" value="DEL">
            </td>
          </tr>
          `
          table.innerHTML += row
        }
      })
    } else {
      const empty = `
      <tr>
        <td colspan="9" class="h-64 text-center">empty data</td>
      </tr>
      `
      table.innerHTML += empty
    }
  }

  /**
   * Perform side effect when index.html rendering for the first time
   */
  window.onload = async () => {
    try {
      const employeeData = await fetchData(API_URL + "/employees")
      const pictureData = await fetchData(API_URL + "/pictures")
      manipulateData(employeeData, employees)
      manipulateData(pictureData, pictures)
      renderData(employees)
      renderPages(employees.length)
    } catch (error) {
      console.log(error)
      renderData(employees)
      renderPages(employees.length)
    }
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
   * Delete data based on data id
   * @param {string} dataID 
   * @param {string} picID 
   */
  window.deleteData = async (dataID, picID) => {
    try {
      const employeeResponse = await fetch(API_URL + "/employees/" + dataID, { method: "DELETE" })
      const employeeJson = await employeeResponse.json()
      const deletedEmployees = employees.filter(employee => employee.id !== employeeJson.id)
      employees.length = 0
      manipulateData(deletedEmployees, employees)
      if (picID !== "default") {
        const picResponse = await fetch(API_URL + "/pictures/" + picID, { method: "DELETE" })
        const picJson = await picResponse.json()
        const deletedPictures = pictures.filter(pic => pic.id !== picJson.id)
        pictures.length = 0
        manipulateData(deletedPictures, pictures)
      }
      startIndex = 0
      endIndex = entryInput.value - 1
      renderData(employees)
      renderPages(employees.length)
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  /**
   * Render pagination number
   * @param {number} dataLength 
   */
  function renderPages(dataLength) {
    if (dataLength !== 0) {
      const totalPages = Math.ceil(dataLength / entryInput.value)
      pagesInput.innerHTML = ""
      for (let index = 1; index <= totalPages; index++) {
        const row = `<input class="border rounded px-2 py-1 cursor-pointer hover:bg-gray-800 active:bg-gray-600" type="button" value="${index}" id="page-${index}" onmouseup="page(${index})">`
        pagesInput.innerHTML += row
      }
      currentPage = 1
      document.querySelector("#page-" + currentPage).classList.remove("text-white", "hover:bg-gray-800", "active:bg-gray-600")
      document.querySelector("#page-" + currentPage).classList.add("bg-white", "text-black", "cursor-default")
      prevPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
      prevPage.classList.add("text-gray-400", "cursor-not-allowed")
      if (dataLength / entryInput.value <= 1) {
        nextPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
        nextPage.classList.add("text-gray-400", "cursor-not-allowed")
      } else {
        nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
        nextPage.classList.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
      }
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
      document.querySelector("#page-" + currentPage).classList.remove("bg-white", "text-black", "cursor-default")
      document.querySelector("#page-" + currentPage).classList.add("text-white", "hover:bg-gray-800", "active:bg-gray-600")
      currentPage = index
      document.querySelector("#page-" + currentPage).classList.remove("text-white", "hover:bg-gray-800", "active:bg-gray-600")
      document.querySelector("#page-" + currentPage).classList.add("bg-white", "text-black", "cursor-default")
      if (filterOn) {
        renderData(filteredEmployees)
        if (index >= Math.ceil(filteredEmployees.length / entryInput.value)) {
          nextPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
          nextPage.classList.add("text-gray-400", "cursor-not-allowed")
        } else {
          nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
          nextPage.classList.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
        }
      } else {
        renderData(employees)
        if (index >= Math.ceil(employees.length / entryInput.value)) {
          nextPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
          nextPage.classList.add("text-gray-400", "cursor-not-allowed")
        } else {
          nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
          nextPage.classList.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
        }
      }
      if (index <= 1) {
        prevPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
        prevPage.classList.add("text-gray-400", "cursor-not-allowed")
      } else {
        if (prevPage.classList.contains("cursor-not-allowed")) {
          prevPage.classList.remove("text-gray-400", "cursor-not-allowed")
          prevPage.classList.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
        }
      }
    }
  }

  /**
   * Previous page button actions
   */
  prevPage.addEventListener("mouseup", () => {
    if (currentPage > 1) {
      document.querySelector("#page-" + currentPage).classList.remove("bg-white", "text-black", "cursor-default")
      document.querySelector("#page-" + currentPage).classList.add("text-white")
      page(currentPage - 1)
    }
  })

  /**
   * Next page button actions
   */
  nextPage.addEventListener("mouseup", () => {
    const dataLength = filterOn ? filteredEmployees.length : employees.length
    if (currentPage < Math.ceil(dataLength / entryInput.value)) {
      document.querySelector("#page-" + currentPage).classList.remove("bg-white", "text-black", "cursor-default")
      document.querySelector("#page-" + currentPage).classList.add("text-white")
      page(currentPage + 1)
    }
  })

  /**
   * Open modal button actions
   */
  openModal.addEventListener("mouseup", () => {
    modal.classList.remove("hidden")
    modal.classList.add("flex", "no-doc-scroll")
  })

  /**
   * Close modal button actions
   */
  closeModal.addEventListener("mouseup", () => {
    modal.classList.remove("flex", "no-doc-scroll")
    modal.classList.add("hidden")
  })

  /**
   * Picture input change actions
   */
  pictureInput.addEventListener("change", e => {
    if (pictureInput.files[0] && pictureInput.files[0].size < 1000000) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(pictureInput.files[0])
      fileReader.onload = f => {
        pictureData = f.target.result
        pictureContainer.src = pictureData
      }
    } else {
      pictureData = "default"
      pictureContainer.src = "avatar.png"
      pictureInput.value = null
      alert("image too big")
    }
  })

  /**
   * Submit button actions
   */
  formInput.addEventListener("submit", async e => {
    e.preventDefault()
    try {
  
      const formData = new FormData(formInput)
  
      formData.delete("picture")
      const picID = Math.random().toString(36).slice(2, 12)
      if (pictureData !== "default") {
        formData.append("picture", picID)
      } else {
        formData.append("picture", pictureData)
      }
  
      const id = Math.random().toString(36).slice(2, 12)
      formData.append("id", id)
      formData.append("active", true)
      
      const newEmployee = Object.fromEntries(formData)

      if (pictureData !== "default") {
        const newPic = {
          id: picID,
          picture: pictureData
        }
        const picResponse = await fetch(API_URL + "/pictures", {
          method: "post",
          body: JSON.stringify(newPic)
        })
        const picJson = await picResponse.json()
        manipulateData([picJson], pictures)
      }

      const employeeResponse = await fetch(API_URL + "/employees", {
        method: "POST",
        body: JSON.stringify(newEmployee)
      })
      const employeeJson = await employeeResponse.json()
      manipulateData([employeeJson], employees)

      modal.classList.remove("flex", "no-doc-scroll")
      modal.classList.add("hidden")
      startIndex = 0
      endIndex = entryInput.value - 1
      renderData(employees)
      renderPages(employees.length)
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  })
})()
