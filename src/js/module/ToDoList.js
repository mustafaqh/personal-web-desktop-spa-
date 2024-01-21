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
    this.#headerImg.src = '../src/img//ToDO/todolist.png'
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

  getApp () {
    return this.#toDoApp
  }

  appActions () {
    this.#addBtn.addEventListener('click', () => {
      this.addTask()
    })

    this.#searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        this.addTask()
      }
    })
    this.checkTask()
  }

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

  saveTheData () {
    localStorage.setItem('toDoList', this.#theList.innerHTML)
  }

  showSavedData () {
    this.#theList.innerHTML = localStorage.getItem('toDoList')
  }
}
