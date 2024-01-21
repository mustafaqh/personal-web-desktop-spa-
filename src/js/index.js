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

memoBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const memo = new Game2()
  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(memo.getGame())
  taskBar.creatingOpenIcon(theWindow, 'memoryGame openGame', '../src/img/memoryGameIcon.png', 'memoryGameIcon')

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

toDoBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const toDo = new ToDoList()
  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(toDo.getApp())
  taskBar.creatingOpenIcon(theWindow, 'toDoApp openToDo', '../src/img//toDo/todolist.png', 'ToDoAppIcon')

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

chatBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const ch = new ChattApp()

  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(ch.getChatLogIn())
  theWindow.appendWindowChild(ch.getChat())
  taskBar.creatingOpenIcon(theWindow, 'chattApp openChat', '../src/img/chatApp.png', 'chattAppIcon')

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

weatherBtn.addEventListener('click', () => {
  const theWindow = new Windows()
  const we = new WeatherApp()
  theWindow.appendWindow(theBody)
  theWindow.appendWindowChild(we.getWeatherAppp())

  taskBar.creatingOpenIcon(theWindow, 'weatherApp openweather', '../src/img/weatherApp.png', 'weatherAppIcon')

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
