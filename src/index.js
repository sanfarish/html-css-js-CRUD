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
  const nameInput = document.querySelector("#name")
  const emailInput = document.querySelector("#email")
  const dateInput = document.querySelector("#date")
  const salaryInput = document.querySelector("#salary")
  const roleInput = document.querySelector("#role")

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

          const tr = document.createElement("tr")

          const tdPic = document.createElement("td")
          tdPic.classList = "p-2 border"
          const divPic = document.createElement("div")
          divPic.classList = "flex items-center justify-center"
          const imgPic = document.createElement("img")
          imgPic.src = pictureSource
          imgPic.alt = employee.name
          imgPic.height = 64
          imgPic.width = 64
          divPic.appendChild(imgPic)
          tdPic.appendChild(divPic)
          tr.appendChild(tdPic)

          const tdID = document.createElement("td")
          tdID.classList = "p-2 border"
          tdID.textContent = employee.id
          tr.appendChild(tdID)

          const tdName = document.createElement("td")
          tdName.classList = "p-2 border"
          tdName.textContent = employee.name
          tr.appendChild(tdName)

          const tdEmail = document.createElement("td")
          tdEmail.classList = "p-2 border"
          tdEmail.textContent = employee.email
          tr.appendChild(tdEmail)

          const tdDate = document.createElement("td")
          tdDate.classList = "p-2 border text-center"
          tdDate.textContent = employee.date
          tr.appendChild(tdDate)

          const tdSalary = document.createElement("td")
          tdSalary.classList = "py-2 px-4 border"
          const divSalary = document.createElement("div")
          divSalary.classList = "flex items-center justify-between"
          const spanCurrency = document.createElement("span")
          spanCurrency.textContent = "$"
          const salaryValue = document.createTextNode(employee.salary)
          divSalary.appendChild(spanCurrency)
          divSalary.appendChild(salaryValue)
          tdSalary.appendChild(divSalary)
          tr.appendChild(tdSalary)

          const tdRole = document.createElement("td")
          tdRole.classList = "p-2 border"
          tdRole.textContent = employee.role
          tr.appendChild(tdRole)

          const tdActive = document.createElement("td")
          tdActive.classList = "p-2 border text-center"
          const spanActive = document.createElement("span")
          spanActive.classList = employee.active ? "font-semibold text-green-400" : "font-semibold text-red-400"
          spanActive.textContent = employee.active ? "Active" : "Inactive"
          tdActive.appendChild(spanActive)
          tr.appendChild(tdActive)

          const tdActions = document.createElement("td")
          tdActions.classList = "p-2 border text-center"
          
          const inputUpdate = document.createElement("input")
          inputUpdate.classList = "py-1 px-2 m-1 rounded cursor-pointer bg-orange-700 hover:bg-orange-600 active:bg-orange-800"
          inputUpdate.type = "button"
          inputUpdate.value = "UPD"
          inputUpdate.addEventListener("mouseup", () => updateModal(employee.id))
          tdActions.appendChild(inputUpdate)

          const inputDelete = document.createElement("input")
          inputDelete.classList = "py-1 px-2 m-1 rounded cursor-pointer bg-red-700 hover:bg-red-600 active:bg-red-800"
          inputDelete.type = "button"
          inputDelete.value = "DEL"
          inputDelete.addEventListener("mouseup", () => deleteData(employee.id, employee.picture))
          tdActions.appendChild(inputDelete)

          tr.appendChild(tdActions)
          table.appendChild(tr)
        }
      })
    } else {
      const tr = document.createElement("tr")
      const td = document.createElement("td")
      td.colSpan = 9
      td.classList = "h-32 text-center"
      td.textContent = "empty data"
      tr.appendChild(td)
      table.appendChild(tr)
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
   * Open modal with data to be updated
   * @param {string} dataID 
   */
  window.updateModal = async (dataID) => {
    const employee = employees.filter(employee => employee.id === dataID)[0]
    const { name, email, date, salary, role, active, picture } = employee

    const employeePic = pictures.filter(pic => pic.id === picture)[0]
    pictureContainer.src = employeePic.picture

    nameInput.value = name
    emailInput.value = email
    dateInput.value = date
    salaryInput.value = salary
    roleInput.value = role

    modal.classList.remove("hidden")
    modal.classList.add("flex", "no-doc-scroll")
  }

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
   * Update active "Previous" page button appearance
   */
  function activatePrevPage() {
    prevPage.classList.remove("text-gray-400", "cursor-not-allowed")
    prevPage.classList.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
  }

  /**
   * Update inactive "Previous" page button appearance
   */
  function deactivatePrevPage() {
    prevPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
    prevPage.classList.add("text-gray-400", "cursor-not-allowed")
  }

  /**
   * Update active "Next" page button appearance
   */
  function activateNextPage() {
    nextPage.classList.remove("text-gray-400", "cursor-not-allowed")
    nextPage.classList.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
  }

  /**
   * Update inactive "Next" page button appearance
   */
  function deactivateNextPage() {
    nextPage.classList.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
    nextPage.classList.add("text-gray-400", "cursor-not-allowed")
  }

  /**
   * Update active current page appearance
   */
  function activatePage() {
    document.querySelector("#page-" + currentPage).classList.remove("text-white", "hover:bg-gray-800", "active:bg-gray-600")
    document.querySelector("#page-" + currentPage).classList.add("bg-white", "text-black", "cursor-default")
  }

  /**
   * Update inactive page appearance
   */
  function deactivatePage() {
    document.querySelector("#page-" + currentPage).classList.remove("bg-white", "text-black", "cursor-default")
    document.querySelector("#page-" + currentPage).classList.add("text-white", "hover:bg-gray-800", "active:bg-gray-600")
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
        const input = document.createElement("input")
        input.type = "button"
        input.value = index
        input.id = "page-" + index
        input.addEventListener("mouseup", () => page(index))
        input.classList = "border rounded px-2 py-1 cursor-pointer hover:bg-gray-800 active:bg-gray-600"
        pagesInput.appendChild(input)
      }
      currentPage = 1
      activatePage()
      deactivatePrevPage()
      if (dataLength / entryInput.value <= 1) {
        deactivateNextPage()
      } else {
        activateNextPage()
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
      deactivatePage()
      currentPage = index
      activatePage()
      if (filterOn) {
        renderData(filteredEmployees)
        if (index >= Math.ceil(filteredEmployees.length / entryInput.value)) {
          deactivateNextPage()
        } else {
          activateNextPage()
        }
      } else {
        renderData(employees)
        if (index >= Math.ceil(employees.length / entryInput.value)) {
          deactivateNextPage()
        } else {
          activateNextPage()
        }
      }
      if (index <= 1) {
        deactivatePrevPage()
      } else {
        if (prevPage.classList.contains("cursor-not-allowed")) {
          activatePrevPage()
        }
      }
    }
  }

  /**
   * Previous page button actions
   */
  prevPage.addEventListener("mouseup", () => {
    if (currentPage > 1) {
      deactivatePage()
      page(currentPage - 1)
    }
  })

  /**
   * Next page button actions
   */
  nextPage.addEventListener("mouseup", () => {
    const dataLength = filterOn ? filteredEmployees.length : employees.length
    if (currentPage < Math.ceil(dataLength / entryInput.value)) {
      deactivatePage()
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
    if (e.target.files[0]) {
      if (e.target.files[0].size < 1000000) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(e.target.files[0])
        fileReader.onload = f => {
          pictureData = f.target.result
          pictureContainer.src = pictureData
        }
      } else {
        pictureData = "default"
        pictureContainer.src = "/avatar.png"
        pictureInput.value = null
        alert("image too big")
      }
    } else {
      pictureData = "default"
      pictureContainer.src = "/avatar.png"
      pictureInput.value = null
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
