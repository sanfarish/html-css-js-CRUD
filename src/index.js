(() => {
  const API_URL = "http://localhost:3000"
  const employees = []

  const vars = {
    totalCount: 0,
    firstLink: "",
    lastLink: "",
    prevLink: "",
    nextLink: "",
    currentPage: 1,
    keyword: ""
  }
  let pictureData = "default"

  const table = document.querySelector("#data")
  const entryInput = document.querySelector("#entries")
  const sortInput = document.querySelector("#sort")
  const orderInput = document.querySelector("#order")
  const keywordsForm = document.querySelector("#keywords-form")
  const keywordsInput = document.querySelector("#keywords-input")
  const pageButton = document.querySelector("#pages")
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

  /**
   * request GET employee with query string
   * @param {string} page 
   * @returns 
   */
  async function getEmployee(page) {
    try {
      const orderValue = sortInput.value === "active" ? (orderInput.value === "asc" ? "desc" : "asc") : orderInput.value
      let fullURL = `/employees?_page=${page}&_limit=${entryInput.value}&_sort=${sortInput.value}&_order=${orderValue}`
      if (vars.keyword !== "") fullURL += `&q=${vars.keyword}`
      const res = await fetch(API_URL + fullURL)
      
      if (res.headers.get("x-total-count")) {
        vars.totalCount = parseInt(res.headers.get("x-total-count"))
      }
      
      if (res.headers.get("link")) {
        const link = res.headers.get("link")
        const arrLink = link.split(", ")
        
        const firstLink = arrLink.find(item => item.includes('rel="first"'))
        if (firstLink) {
          vars.firstLink = firstLink.split(">")[0].slice(1)
        } else {
          vars.firstLink = ""
        }
        
        const lastLink = arrLink.find(item => item.includes('rel="last"'))
        if (lastLink) {
          vars.lastLink = lastLink.split(">")[0].slice(1)
        } else {
          vars.lastLink = ""
        }
        
        const prevLink = arrLink.find(item => item.includes('rel="prev"'))
        if (prevLink) {
          vars.prevLink = prevLink.split(">")[0].slice(1)
        } else {
          vars.prevLink = ""
        }
        
        const nextLink = arrLink.find(item => item.includes('rel="next"'))
        if (nextLink) {
          vars.nextLink = nextLink.split(">")[0].slice(1)
        } else {
          vars.nextLink = ""
        }
      }

      const data = await res.json()
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Render employee table
   */
  function renderEmployee() {
    table.innerHTML = ""
    if (employees.length !== 0) {
      employees.forEach(employee => {

        const tr = document.createElement("tr")
        tr.classList = "h-24"

        const tdPic = document.createElement("td")
        tdPic.classList = "border"
        const divPic = document.createElement("div")
        divPic.classList = "flex items-center justify-center"
        const imgPic = document.createElement("img")
        imgPic.src = API_URL + `/${employee.picture}`
        imgPic.alt = employee.name
        imgPic.height = 64
        imgPic.width = 64
        divPic.appendChild(imgPic)
        tdPic.appendChild(divPic)
        tr.appendChild(tdPic)

        const tdID = document.createElement("td")
        tdID.classList = "p-3 border"
        tdID.textContent = employee.id
        tr.appendChild(tdID)

        const tdName = document.createElement("td")
        tdName.classList = "p-3 border"
        tdName.textContent = employee.name
        tr.appendChild(tdName)

        const tdEmail = document.createElement("td")
        tdEmail.classList = "p-3 border"
        tdEmail.textContent = employee.email
        tr.appendChild(tdEmail)

        const tdDate = document.createElement("td")
        tdDate.classList = "p-3 border text-center"
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
        tdRole.classList = "p-3 border"
        tdRole.textContent = employee.role
        tr.appendChild(tdRole)

        const tdActive = document.createElement("td")
        tdActive.classList = "p-3 border text-center"
        const spanActive = document.createElement("span")
        spanActive.classList = employee.active ? "font-semibold text-green-400" : "font-semibold text-red-400"
        spanActive.textContent = employee.active ? "Active" : "Inactive"
        tdActive.appendChild(spanActive)
        tr.appendChild(tdActive)

        const tdActions = document.createElement("td")
        tdActions.classList = "p-3 border text-center"
        
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
      })
      const diff = Math.abs(vars.totalCount - (entryInput.value * Math.ceil(vars.totalCount / entryInput.value)))
      if (diff !== 0 && vars.currentPage >= Math.ceil(vars.totalCount / entryInput.value)) {
        for (let index = 0; index < diff; index++) {
          const tr = document.createElement("tr")
          const td = document.createElement("td")
          td.classList = "h-24"
          td.colSpan = 9
          tr.appendChild(td)
          table.appendChild(tr)
        }
      }
    } else {
      const tr = document.createElement("tr")
      const td = document.createElement("td")
      td.colSpan = 9
      switch (parseInt(entryInput.value)) {
        case 3:
          td.classList = `h-[calc(0.25rem*24*3)] text-center`
          break
        case 5:
          td.classList = `h-[calc(0.25rem*24*5)] text-center`
          break
        default:
          td.classList = `h-[calc(0.25rem*24*2)] text-center`
          break
      }
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
      employees.length = 0
      const resEmployee = await getEmployee(vars.currentPage)
      employees.push(...resEmployee)
      
      renderEmployee()
      renderPages(vars.currentPage)
    } catch (error) {
      console.log(error)
      renderEmployee()
    }
  }

  /**
   * Entry selection change actions
   */
  entryInput.addEventListener("change", async () => {
    vars.currentPage = 1
    employees.length = 0
    const resEmployee = await getEmployee(vars.currentPage)
    employees.push(...resEmployee)
    renderEmployee()
    renderPages(vars.currentPage)
  })

  /**
   * Sort selection change actions
   */
  sortInput.addEventListener("change", async () => {
    vars.currentPage = 1
    employees.length = 0
    const resEmployee = await getEmployee(vars.currentPage)
    employees.push(...resEmployee)
    renderEmployee()
    renderPages(vars.currentPage)
  })

  /**
   * Sort selection change actions
   */
  orderInput.addEventListener("change", async () => {
    vars.currentPage = 1
    employees.length = 0
    const resEmployee = await getEmployee(vars.currentPage)
    employees.push(...resEmployee)
    renderEmployee()
    renderPages(vars.currentPage)
  })

  /**
   * Keyword filter form submit actions
   */
  keywordsForm.addEventListener("submit", async e => {
    e.preventDefault()
    vars.keyword = keywordsInput.value.toString().trim()
    vars.currentPage = 1
    employees.length = 0
    const resEmployee = await getEmployee(vars.currentPage)
    employees.push(...resEmployee)
    renderEmployee()
    renderPages(vars.currentPage)
  })


  keywordsForm.addEventListener("reset", async e => {
    keywordsInput.value = ""
    if (vars.keyword !== "") {
      vars.keyword = ""
      vars.currentPage = 1
      employees.length = 0
      const resEmployee = await getEmployee(vars.currentPage)
      employees.push(...resEmployee)
      renderEmployee()
      renderPages(vars.currentPage)
    }
  })

  /**
   * Open modal with data to be updated
   * @param {string} dataID 
   */
  window.updateModal = async (dataID) => {
    const employee = employees.filter(employee => employee.id === dataID)[0]
    const { name, email, date, salary, role, active, picture } = employee

    // const employeePic = pictures.filter(pic => pic.id === picture)[0]
    // pictureContainer.src = employeePic.picture

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
      const employeeResponse = await fetch(API_URL + `/employees/${dataID}`, { method: "DELETE" })
      const employeeJson = await employeeResponse.json()
      const deletedEmployees = employees.filter(employee => employee.id !== employeeJson.id)
      employees.length = 0
      // manipulateData(deletedEmployees, employees)
      employees.push(...deletedEmployees)
      // if (picID !== "default") {
      //   const picResponse = await fetch(PICTURES_URL + `/${picID}`, { method: "DELETE" })
      //   const picJson = await picResponse.json()
      //   const deletedPictures = pictures.filter(pic => pic.id !== picJson.id)
      //   pictures.length = 0
      //   manipulateData(deletedPictures, pictures)
      //   pictures.push(...deletedPictures)
      // }
      // startIndex = 0
      // endIndex = entryInput.value - 1
      renderEmployee()
      renderPages(employees.length)
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  /**
   * Update "Previous" page button appearance
   * @param {boolean} condition 
   */
  function activatePrevPage(condition) {
    const prevClass = prevPage.classList
    if (condition === true) {
      prevClass.remove("hover:bg-gray-700", "hover:text-white", "cursor-not-allowed")
      prevClass.add("hover:bg-gray-700", "hover:text-white")
    } else {
      prevClass.remove("hover:bg-gray-700", "hover:text-white")
      prevClass.add("cursor-not-allowed")
    }
    // if (condition === true) {
    //   prevClass.remove("text-gray-400", "cursor-not-allowed")
    //   prevClass.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
    // } else {
    //   prevClass.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
    //   prevClass.add("text-gray-400", "cursor-not-allowed")
    // }
  }

  /**
   * Update "Next" page button appearance
   * @param {boolean} condition 
   */
  function activateNextPage(condition) {
    const nextClass = nextPage.classList
    if (condition === true) {
      nextClass.remove("hover:bg-gray-700", "hover:text-white", "cursor-not-allowed")
      nextClass.add("hover:bg-gray-700", "hover:text-white")
    } else {
      nextClass.remove("hover:bg-gray-700", "hover:text-white")
      nextClass.add("cursor-not-allowed")
    }
    // if (condition === true) {
    //   nextClass.remove("text-gray-400", "cursor-not-allowed")
    //   nextClass.add("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
    // } else {
    //   nextClass.remove("text-white", "cursor-pointer", "hover:bg-gray-800", "active:bg-gray-600")
    //   nextClass.add("text-gray-400", "cursor-not-allowed")
    // }
  }

  /**
   * Update pages button appearance
   * @param {number} page 
   * @param {boolean} condition 
   */
  function activatePage(page, condition) {
    const pageClass = document.querySelector(`#page${page}`).classList
    if (condition === true) {
      pageClass.remove("leading-tight", "bg-gray-800", "border-gray-700", "text-gray-400", "hover:bg-gray-700", "hover:text-white")
      pageClass.add("hover:bg-blue-100", "hover:text-blue-700", "border-gray-700", "bg-gray-700", "text-white")
    } else {
      pageClass.remove("hover:bg-blue-100", "hover:text-blue-700", "border-gray-700", "bg-gray-700", "text-white")
      pageClass.add("leading-tight", "bg-gray-800", "border-gray-700", "text-gray-400", "hover:bg-gray-700", "hover:text-white")
    }
    // if (condition === true) {
    //   pageClass.remove("text-white", "hover:bg-gray-800", "active:bg-gray-600", "cursor-pointer")
    //   pageClass.add("bg-white", "text-black", "cursor-default")
    // } else {
    //   pageClass.remove("bg-white", "text-black", "cursor-default")
    //   pageClass.add("text-white", "hover:bg-gray-800", "active:bg-gray-600", "cursor-pointer")
    // }
  }

  /**
   * Render pagination buttons
   * @param {number} page 
   */
  function renderPages(page) {
    const totalPages = vars.totalCount ? Math.ceil(vars.totalCount / entryInput.value) : 1
    const pagination = document.querySelector("#pagination")
    document.querySelectorAll('[id^="pageContainer"]').forEach(page => {
      page.remove()
    })
    // pageButton.innerHTML = ""
    for (let index = 1; index <= totalPages; index++) {

      const newPage = document.createElement("li")
      newPage.id = "pageContainer" + index
      const alink = document.createElement("a")
      alink.textContent = index
      alink.href = "#"
      alink.id = "page" + index
      alink.classList = "flex items-center justify-center px-4 h-10 leading-tight border bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
      alink.addEventListener("mouseup", () => toPage(index))
      newPage.appendChild(alink)
      // pagination.insertBefore(newPage, pagination.childNodes[2 + index - 1])
      pagination.insertBefore(newPage, pagination.lastElementChild)
      // pagination.appendChild(newPage)

      // const input = document.createElement("input")
      // input.type = "button"
      // input.value = index
      // input.id = "page" + index
      // input.addEventListener("mouseup", () => toPage(index))
      // input.classList = "border rounded px-2 py-1 cursor-pointer hover:bg-gray-800 active:bg-gray-600"
      // pageButton.appendChild(input)
    }
    
    activatePage(page, true)
    activatePrevPage(false)

    if (vars.totalCount / entryInput.value <= 1) {
      activateNextPage(false)
    } else {
      activateNextPage(true)
    }
  }

  /**
   * Set page-related variables and page-related elements
   * @param {number} index 
   */
  window.toPage = async (index) => {
    if (index !== vars.currentPage) {
      activatePage(vars.currentPage, false)
      activatePage(index, true)

      if (index >= Math.ceil(vars.totalCount / entryInput.value)) {
        activateNextPage(false)
      } else {
        activateNextPage(true)
      }
      
      const resEmployee = await getEmployee(index)
      employees.length = 0
      employees.push(...resEmployee)
      
      vars.currentPage = index
      renderEmployee()
      if (index <= 1) {
        activatePrevPage(false)
      } else {
        if (prevPage.classList.contains("cursor-not-allowed")) {
          activatePrevPage(true)
        }
      }
    }
  }

  /**
   * Previous page button action
   */
  prevPage.addEventListener("mouseup", () => {
    if (vars.currentPage > 1) {
      activatePage(vars.currentPage, false)
      toPage(vars.currentPage - 1)
    }
  })

  // document.querySelector("#prevPage").addEventListener("mouseup", () => {
  //   if (vars.currentPage > 1) {
  //     activatePage(vars.currentPage, false)
  //     toPage(vars.currentPage - 1)
  //   }
  // })

  /**
   * Next page button action
   */
  nextPage.addEventListener("mouseup", () => {
    if (vars.currentPage < Math.ceil(vars.totalCount / entryInput.value)) {
      activatePage(vars.currentPage, false)
      toPage(vars.currentPage + 1)
    }
  })

  // document.querySelector("#nextPage").addEventListener("mouseup", () => {
  //   if (vars.currentPage < Math.ceil(vars.totalCount / entryInput.value)) {
  //     activatePage(vars.currentPage, false)
  //     toPage(vars.currentPage + 1)
  //   }
  // })

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

      // if (pictureData !== "default") {
      //   const newPic = {
      //     id: picID,
      //     picture: pictureData
      //   }
      //   const picResponse = await fetch(PICTURES_URL, {
      //     method: "post",
      //     body: JSON.stringify(newPic)
      //   })
      //   const picJson = await picResponse.json()
      //   manipulateData([picJson], pictures)
      //   pictures.push(picJson)
      // }

      const employeeResponse = await fetch(API_URL + "/employees", {
        method: "POST",
        body: JSON.stringify(newEmployee)
      })
      const employeeJson = await employeeResponse.json()
      // manipulateData([employeeJson], employees)
      employees.push(employeeJson)

      modal.classList.remove("flex", "no-doc-scroll")
      modal.classList.add("hidden")
      // startIndex = 0
      endIndex = entryInput.value - 1
      renderEmployee()
      renderPages(employees.length)
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  })
})()
