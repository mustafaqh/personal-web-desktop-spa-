import TaskBar from './module/taskBar.js'
import Game2 from './module/theMemoGame.js'
import Windows from './module/Windows.js'
import ToDoList from './module/ToDoList.js'
import ChattApp from './module/chat.js'
import WeatherApp from './module/WeatherApp.js'
const taskBar = new TaskBar()

const theBody = document.querySelector('.container')

taskBar.appendTaskBar(document.body)
const memoBtn = document.querySelector('.memoryGame')
const toDoBtn = document.querySelector('.toDoApp')
const openWindows = []
const chatBtn = document.querySelector('.chattApp')
const weatherBtn = document.querySelector('.weatherApp')

/**
 * add event listner to the memory game button in the task bar.
 */
memoBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const memo = new Game2()
  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(memo.getGame())
  const memoIcon = (new URL('../img/memoryGameIcon.png', import.meta.url)).href
  taskBar.creatingOpenIcon(theWindow, 'memoryGame openGame', `${memoIcon}`, 'memoryGameIcon')

  theWindow.returnCloseButton().addEventListener('click', () => {
    theWindow.returnWindow().remove()
    const icon = document.querySelector('.openGame')
    icon.remove()
    openWindows.pop(theWindow)
    console.log('nr windows afyer closing: ', openWindows.length)
  })
  openWindows.push(theWindow)
  console.log('nr windows : ', openWindows.length)
  theWindow.oerderTheWindows()
  theWindow.dragDrop(theBody)
})

/**
 * add listner to the to do app button in the task bar.
 */
toDoBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const toDo = new ToDoList()
  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(toDo.getApp())
  const toDoIcon = (new URL('../img/toDo/todolist.png', import.meta.url)).href
  taskBar.creatingOpenIcon(theWindow, 'toDoApp openToDo', `${toDoIcon}`, 'ToDoAppIcon')

  theWindow.returnCloseButton().addEventListener('click', () => {
    theWindow.returnWindow().remove()
    const icon = document.querySelector('.openToDo')
    icon.remove()
    openWindows.pop(theWindow)
    console.log('nr windows afyer closing: ', openWindows.length)
  })

  openWindows.push(theWindow)
  console.log('nr windows : ', openWindows.length)

  theWindow.oerderTheWindows()
  theWindow.dragDrop(theBody)
})

/**
 * add lisnter to the chat button in the task bar.
 */
chatBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const ch = new ChattApp()

  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(ch.getChatLogIn())
  theWindow.appendWindowChild(ch.getChat())
  const chattApp = (new URL('../img/chatApp.png', import.meta.url)).href
  taskBar.creatingOpenIcon(theWindow, 'chattApp openChat', `${chattApp}`, 'chattAppIcon')

  theWindow.returnCloseButton().addEventListener('click', () => {
    theWindow.returnWindow().remove()
    const icon = document.querySelector('.openChat')
    icon.remove()
    openWindows.pop(theWindow)
    console.log('nr windows afyer closing: ', openWindows.length)
  })

  openWindows.push(theWindow)
  console.log('nr windows : ', openWindows.length)

  theWindow.oerderTheWindows()
  theWindow.dragDrop(theBody)
})

/**
 * add event listner to the weather app button in the task bar.
 */
weatherBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const we = new WeatherApp()
  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(we.getWeatherAppp())
  const watherIcon = (new URL('../img/weatherAppIcon.png', import.meta.url)).href
  taskBar.creatingOpenIcon(theWindow, 'weatherApp openweather', `${watherIcon}`, 'weatherAppIcon')

  theWindow.returnCloseButton().addEventListener('click', () => {
    theWindow.returnWindow().remove()
    const icon = document.querySelector('.openweather')
    icon.remove()
    openWindows.pop(theWindow)
    console.log('nr windows afyer closing: ', openWindows.length)
  })

  openWindows.push(theWindow)
  console.log('nr windows : ', openWindows.length)

  theWindow.oerderTheWindows()
  theWindow.dragDrop(theBody)
})
