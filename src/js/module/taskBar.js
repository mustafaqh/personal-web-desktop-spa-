import Windows from './Windows.js'
import Game2 from './theMemoGame.js'
import ToDoList from './ToDoList.js'
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

    constructor() {
        this.#bar = document .createElement('div')
        this.#bar.className = 'bar'
        this.#bar.id = 'bar'

        this.#taskBar = document .createElement('div')
        this.#taskBar.className = 'taskBar'
        
        this.#oppendBar = document.createElement('div')
        this.#oppendBar.className = 'openBar'

        this.#memoryGame = document .createElement('button')
        this.#memoryGame.className = 'memoryGame'
        this.#memoryGame.id ='memoryGame'

        this.#memoryGameIcon = document.createElement('img')
        this.#memoryGameIcon.className = 'memoryGameIcon'
        this.#memoryGameIcon.src = '../src/img/memoryGameIcon.png'
        this.#memoryGame.appendChild(this.#memoryGameIcon)

    
        this.#chatApp = document .createElement('button')
        this.#chatApp.className = 'chattApp'
        this.#chatApp.id ='chattApp'
        
        this.#chattAppIcon = document.createElement('img')
        this.#chattAppIcon.className = 'chattAppIcon'
        this.#chattAppIcon.src  = '../src/img/chatApp.png'
        this.#chatApp.appendChild(this.#chattAppIcon)

        this.#toDoList = document .createElement('button')
        this.#toDoList.className = 'toDoApp'
        this.#toDoList.id = 'toDoApp'

        this.#ToDoAppIcon = document.createElement('img')
        this.#ToDoAppIcon.className = 'ToDoAppIcon'
        this.#ToDoAppIcon.src = '../src/img//toDo/todolist.png'
        this.#toDoList.appendChild(this.#ToDoAppIcon)


        this.#weatherApp = document .createElement('button')
        this.#weatherApp.className = 'weatherApp'
        this.#weatherApp.id = 'weatherApp'
        
        this.#weatherAppIcon = document.createElement('img')
        this.#weatherAppIcon.className = 'weatherAppIcon'
        this.#weatherAppIcon.src = '../src/img/weatherApp.png'
        this.#weatherApp.appendChild(this.#weatherAppIcon)

        this.#verticalLine = document .createElement('div')
        this.#verticalLine.className = 'vertical-line'

        this.#taskBar.appendChild(this.#memoryGame)
        this.#taskBar.appendChild(this.#chatApp)
        this.#taskBar.appendChild(this.#toDoList)
        this.#taskBar.appendChild(this.#weatherApp)
        this.#taskBar.appendChild(this.#verticalLine)
        this.#taskBar.appendChild(this.#oppendBar)
        this.#bar.appendChild(this.#taskBar)
        
        // this.startMemoGame()
    }

    appendTaskBar(element) {
        element.appendChild(this.#bar)
    }

    // startMemoGame() {
    //     this.#memoryGame.addEventListener('click', () => {
    //         const theWindow = new Windows()
    //         const game = new Game2()
    //         theWindow.appendWindow(document.body)
    //         theWindow.windowName = 'Memory game'
    //         theWindow.appendWindowChild(game.getGame())
    //         this.creatingOpenIcon(theWindow,'memoryGame openGame','../src/img/memoryGameIcon.png', 'memoryGameIcon')
            
    //         theWindow.returnCloseButton().addEventListener('click', () => {
    //             theWindow.returnWindow().remove()
    //             const icon = document.querySelector('.openGame')
    //             icon.remove()
    //         })
    //     })
    // }

    starChatApp(innerElemnt,outerElement) {
        this.#chatApp.addEventListener('click', () => {
            const theWindow = new Windows()
            theWindow.droppingWindow(outerElement)
            theWindow.appendWindow(outerElement)
            theWindow.appendChild(innerElemnt)
        })
    }

    startToDoApp(innerElemnt,outerElement) {
        this.#toDoList.addEventListener('click', () => {
            const theWindow = new Windows()
            const game = new ToDoList()
            theWindow.appendWindow(document.body)
            theWindow.windowName = 'To do list'
            theWindow.appendWindowChild(game.getGame())
            this.creatingOpenIcon(theWindow,'memoryGame openGame','../src/img/memoryGameIcon.png', 'memoryGameIcon')

            theWindow.returnCloseButton().addEventListener('click', () => {
                theWindow.returnWindow().remove()
                const icon = document.querySelector('.openGame')
                icon.remove()
            })
        })
    }

    StartWeatherApp(innerElemnt,outerElement) {
        this.#toDoList.addEventListener('click', () => {
            const theWindow = new Windows()
            theWindow.appendWindow(outerElement)
            theWindow.appendChild(innerElemnt)
        })
    }


    creatingOpenIcon(theWindow, BtnClassName, imgSrc, imgClassName) {
        let openIcon = document.createElement('button')
        openIcon.className = BtnClassName
        let openIconImg = document.createElement('img')
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