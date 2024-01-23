export default class ToDoList {
  #Appconatainer
  #toDoApp
  #appHeader
  #headerImg
  #searchDiv
  #searchInput
  #addBtn
  #theList

  constructor () {
    this.#Appconatainer = document.createElement('div')
    this.#Appconatainer.className = 'theAppcontainer'

    this.#toDoApp = document.createElement('div')
    this.#toDoApp.className = 'todoApp'
    this.#Appconatainer.appendChild(this.#toDoApp)

    this.#appHeader = document.createElement('h2')
    this.#appHeader.innerText = 'To-Do List'
    this.#headerImg = document.createElement('img')
    const BACK_IMG_URL = (new URL('../../img/ToDO/todolist.png', import.meta.url)).href
    this.#headerImg.src = `${BACK_IMG_URL}`
    this.#appHeader.appendChild(this.#headerImg)
    this.#toDoApp.appendChild(this.#appHeader)

    this.#searchDiv = document.createElement('div')
    this.#searchDiv.className = 'searchDiv row'

    this.#searchInput = document.createElement('input')
    this.#searchInput.type = 'text'
    this.#searchInput.id = 'inputBox'
    this.#searchInput.placeholder = 'What is your plans'

    this.#searchDiv.appendChild(this.#searchInput)
    this.#toDoApp.appendChild(this.#searchDiv)

    this.#addBtn = document.createElement('button')
    this.#addBtn.textContent = 'Add'
    this.#addBtn.id = 'addBtn'

    this.#searchDiv.appendChild(this.#addBtn)

    this.#theList = document.createElement('ur')
    this.#theList.id = 'list'

    this.#toDoApp.appendChild(this.#theList)
    this.appActions()
    this.showSavedData()
  }

  /**
   *
   * @returns {Element} Dom element that reprsent the app container.
   */
  getApp () {
    return this.#toDoApp
  }

  /**
   * add event listner to the add button and search input.
   */
  appActions () {
    this.#addBtn.addEventListener('click', () => {
      this.addTask()
    })

    this.#searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        this.addTask()
      }
    })
    this.checkTask()
  }

  /**
   * function to add new task.
   */
  addTask () {
    if (this.#searchInput.value === '') {
      alert('WRITE SOMETHING TO ADD')
    } else {
      const li = document.createElement('li')
      li.innerHTML = this.#searchInput.value
      li.id = 'listItem'
      this.#theList.appendChild(li)
      const span = document.createElement('span')
      span.classList.add('span')
      span.innerHTML = '\u00d7'
      li.appendChild(span)
      this.#searchInput.value = ''
      this.saveTheData()
    }
  }

  /**
   * function to mark the task as cheked.
   */
  checkTask () {
    this.#theList.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked')
        this.saveTheData()
      } else if (ev.target.tagName === 'SPAN') {
        ev.target.parentElement.remove()
        this.saveTheData()
      }
    })
  }

  /**
   * function to save the data on the local storage.
   */
  saveTheData () {
    localStorage.setItem('toDoList', this.#theList.innerHTML)
  }

  /**
   * function to bring the data from the loca storage.
   */
  showSavedData () {
    this.#theList.innerHTML = localStorage.getItem('toDoList')
  }
}
