import Windows from './Windows.js'

export default class TaskBar {
  #bar
  #taskBar
  #memoryGame
  #memoryGameIcon
  #chatApp
  #chattAppIcon
  #toDoList
  #ToDoAppIcon
  #weatherApp
  #weatherAppIcon
  #verticalLine
  #oppendBar

  constructor () {
    this.#bar = document.createElement('div')
    this.#bar.className = 'bar'
    this.#bar.id = 'bar'

    this.#taskBar = document.createElement('div')
    this.#taskBar.className = 'taskBar'

    this.#oppendBar = document.createElement('div')
    this.#oppendBar.className = 'openBar'

    this.#memoryGame = document.createElement('button')
    this.#memoryGame.className = 'memoryGame'
    this.#memoryGame.id = 'memoryGame'

    this.#memoryGameIcon = document.createElement('img')
    this.#memoryGameIcon.className = 'memoryGameIcon'
    const memoIcon = (new URL('../../img/memoryGameIcon.png', import.meta.url)).href
    this.#memoryGameIcon.src = `${memoIcon}`
    this.#memoryGame.appendChild(this.#memoryGameIcon)

    this.#chatApp = document.createElement('button')
    this.#chatApp.className = 'chattApp'
    this.#chatApp.id = 'chattApp'

    this.#chattAppIcon = document.createElement('img')
    this.#chattAppIcon.className = 'chattAppIcon'
    const chatIcon = (new URL('../../img/chatApp.png', import.meta.url)).href
    this.#chattAppIcon.src = `${chatIcon}`
    this.#chatApp.appendChild(this.#chattAppIcon)

    this.#toDoList = document.createElement('button')
    this.#toDoList.className = 'toDoApp'
    this.#toDoList.id = 'toDoApp'

    this.#ToDoAppIcon = document.createElement('img')
    this.#ToDoAppIcon.className = 'ToDoAppIcon'
    const toDoIcon = (new URL('../../img/toDo/todolist.png', import.meta.url)).href
    this.#ToDoAppIcon.src = `${toDoIcon}`
    this.#toDoList.appendChild(this.#ToDoAppIcon)

    this.#weatherApp = document.createElement('button')
    this.#weatherApp.className = 'weatherApp'
    this.#weatherApp.id = 'weatherApp'

    this.#weatherAppIcon = document.createElement('img')
    this.#weatherAppIcon.className = 'weatherAppIcon'
    const weatherIcon = (new URL('../../img/weatherAppIcon.png', import.meta.url)).href
    this.#weatherAppIcon.src = `${weatherIcon}`
    this.#weatherApp.appendChild(this.#weatherAppIcon)

    this.#verticalLine = document.createElement('div')
    this.#verticalLine.className = 'vertical-line'

    this.#taskBar.appendChild(this.#memoryGame)
    this.#taskBar.appendChild(this.#chatApp)
    this.#taskBar.appendChild(this.#toDoList)
    this.#taskBar.appendChild(this.#weatherApp)
    this.#taskBar.appendChild(this.#verticalLine)
    this.#taskBar.appendChild(this.#oppendBar)
    this.#bar.appendChild(this.#taskBar)
  }

  /**
   * function to add parent to the bar.
   * @param {Element} element dom elemnt as aparent to the task bar.
   */
  appendTaskBar (element) {
    element.appendChild(this.#bar)
  }

  /**
   * function to create a button to the opend window and add event listner to toogle the hidden class.
   * @param {Windows} theWindow instance of the windows class wich provide window container.
   * @param {string} BtnClassName to mach the open button with the orginal button.
   * @param {string} imgSrc path to the same img of the orginal button.
   * @param {string} imgClassName to match the img of the new button with orginal button.
   */
  creatingOpenIcon (theWindow, BtnClassName, imgSrc, imgClassName) {
    const openIcon = document.createElement('button')
    openIcon.className = BtnClassName
    const openIconImg = document.createElement('img')
    openIconImg.src = imgSrc
    openIconImg.className = imgClassName
    openIcon.appendChild(openIconImg)
    this.#oppendBar.appendChild(openIcon)
    openIcon.addEventListener('click', () => {
      theWindow.returnWindow().classList.toggle('hidden')
    })
    this.#oppendBar.scrollLeft = 0
  }
}
