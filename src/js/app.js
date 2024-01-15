import TheMemoryGame from './module/MemoryGame.js'
// import GameTester from './module/game_test.js'
// import ChattApp from "./module/chat.js"

// const chat = new ChattApp()
const memo = new TheMemoryGame()
const memoryGameBtn = document.getElementById('memoryGame')
const chatBtn = document.getElementById('chattApp')
memoryGameBtn.addEventListener('click',() =>{
   let windowsContainer = document.getElementById('windowsContainer')
   windowsContainer.appendChild(memo.getGame())
   const items = document.querySelectorAll('.flag')
   console.log('the lenght',items.length)
} )

chatBtn.addEventListener('click', ()=> {
   let windowsContainer = document.getElementById('windowsContainer')
   windowsContainer.appendChild(chat.getPersonSelectore())
   windowsContainer.appendChild(chat.getChat())
})