/**
 * class for the memory game
 */
export default class Game2 {
  #gameContainer
  #gaimeHeader
  #headertext
  #setttingBtn
  #settingImg
  #cardsContainer
  #gameStatus
  #gameLevelText
  #try
  #gameInfo
  #restartBtn
  #restartImg
  #items
  #itemsId
  #src
  #settingDiv
  #level1
  #level2
  #level3
  #LevelDiv
  #size
  constructor () {
    this.#gameContainer = document.createElement('div')
    this.#gameContainer.className = 'gameContainer'

    this.#gaimeHeader = document.createElement('div')
    this.#gaimeHeader.className = 'header'

    this.#gameContainer.appendChild(this.#gaimeHeader)

    this.#headertext = document.createElement('h2')
    this.#headertext.className = 'thHeadertext'
    this.#headertext.innerText = 'Memory Game'

    this.#setttingBtn = document.createElement('button')
    this.#setttingBtn.className = 'settingBtn'

    this.#LevelDiv = document.createElement('div')
    this.#LevelDiv.className = 'level hidden'
    this.#level1 = document.createElement('a')
    this.#level1.className = 'aElement Small'
    this.#level1.innerText = 'Small'
    this.#level2 = document.createElement('a')
    this.#level2.className = 'aElement Medum'
    this.#level2.innerText = 'Medum'
    this.#level3 = document.createElement('a')
    this.#level3.className = 'aElement Large'
    this.#level3.innerText = 'Large'

    this.#LevelDiv.appendChild(this.#level1)
    this.#LevelDiv.appendChild(this.#level2)
    this.#LevelDiv.appendChild(this.#level3)

    this.#settingDiv = document.createElement('div')
    this.#settingDiv.className = 'settings'
    this.#settingDiv.appendChild(this.#setttingBtn)
    this.#gaimeHeader.appendChild(this.#headertext)
    this.#gaimeHeader.appendChild(this.#settingDiv)

    this.#settingImg = document.createElement('img')
    const stteingIcon = (new URL('../../img/MemoryGame/s.png', import.meta.url)).href
    this.#settingImg.src = `${stteingIcon}`
    this.#settingImg.className = 'settingImg'
    this.#setttingBtn.appendChild(this.#settingImg)

    this.#cardsContainer = document.createElement('div')
    this.#cardsContainer.className = ('cardsContainer')

    this.#gameContainer.appendChild(this.#cardsContainer)

    this.#gameStatus = document.createElement('div')
    this.#gameStatus.className = 'gameStatus'

    this.#gameLevelText = document.createElement('p')
    this.#gameLevelText.className = 'levelText'
    this.#gameLevelText.innerText = 'Level : small'

    this.#gameStatus.appendChild(this.#gameLevelText)

    this.#try = document.createElement('p')
    this.#try.className = 'try'
    this.#try.innerText = 'Attempt Counter : 0 '
    this.#gameStatus.appendChild(this.#try)

    this.#gameInfo = document.createElement('div')
    this.#gameInfo.className = 'gameInfo'

    this.#restartBtn = document.createElement('button')
    this.#restartBtn.className = 'reset'

    this.#restartImg = document.createElement('img')
    this.#restartImg.className = 'restartImg'
    const restartIcon = (new URL('../../img/MemoryGame/restart.png', import.meta.url)).href
    this.#restartImg.src = `${restartIcon}`

    this.#restartBtn.appendChild(this.#restartImg)

    this.#gameInfo.appendChild(this.#gameStatus)
    this.#gameInfo.appendChild(this.#restartBtn)
    this.#settingDiv.appendChild(this.#LevelDiv)
    this.#gameContainer.appendChild(this.#gameInfo)

    this.#items = ['chips.png', 'dice.png', 'gamble.png', 'gamble2.png', 'hat.png']
    this.#itemsId = [0, 1, 2, 3, 4]
    
    this.#size = 2
    this.createGameGrid(this.#size)
    this.restartButton()
    this.theMemoryGame()
    this.playWithKeyBoard()
  }

  /**
   * function return the container of the memory game app.
   * @returns {object} The DOM element representing the game container.
   */
  getGame () {
    return this.#gameContainer
  }

  /**
   * function that creat the grid and add event listner dör each card.
   * @param {number} y -size of the grid
   */
  createGameGrid (y) {
    let t = 0
    let x = 0
    while (x < y) {
      const shuffledId = this.#itemsId.sort(() => Math.random() - 0.5)

      console.log(shuffledId)
      for (let i = 0; i < shuffledId.length; i++) {
        const thePath  = (new URL(`../../img/MemoryGame/${this.#items[shuffledId[i]]}`, import.meta.url)).href
        const itemBox = document.createElement('div')
        itemBox.className = 'card'
        const theImg = document.createElement('img')
        theImg.className = 'gameimgs'
        theImg.src = `${thePath}`
        console.log(shuffledId[i])
        theImg.id = `image${this.#itemsId[i]}`
        itemBox.appendChild(theImg)
        itemBox.id = shuffledId[i]

        this.#cardsContainer.appendChild(itemBox)

        itemBox.addEventListener('click', () => {
          itemBox.classList.add('boxOpen')

          setTimeout(() => {
            const openBox = document.querySelectorAll('.boxOpen')
            if (openBox.length > 1) {
              if (openBox[0].id === openBox[1].id) {
                console.log(openBox[0].id)
                console.log(openBox[1].id)
                openBox[0].classList.add('matchBox')
                openBox[1].classList.add('matchBox')

                openBox[1].classList.remove('boxOpen')
                openBox[0].classList.remove('boxOpen')

                const matchBox = document.querySelectorAll('.matchBox')
                if (matchBox.length === (this.#items.length) * y) {
                  alert('you win')
                  console.log('you win')
                }
                t = t + 1
              } else {
                openBox[0].classList.remove('boxOpen')
                openBox[1].classList.remove('boxOpen')
                t = t + 1
              }
              this.#try.innerText = `Attempt Counter : ${t}`
            }
          }, 500)
        })
      }

      x = x + 1
    }
  }

  /**
   * function to give the ability of playing using keyboard.
   */
  playWithKeyBoard () {
    document.addEventListener('keydown', (e) => {
      e.preventDefault()
      const cards = document.querySelectorAll('.card')
      const numRows = 5

      for (let i = 0; i < cards.length; i++) {
        cards[i].setAttribute('tabindex', `${i}`)
      }

      const currentFocusedIndex = document.activeElement.tabIndex
      let nextIndex = -1

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = (currentFocusedIndex + 1) % cards.length
          break
        case 'ArrowLeft':
          nextIndex = (currentFocusedIndex - 1 + cards.length) % cards.length
          break
        case 'ArrowDown':
          nextIndex = currentFocusedIndex + numRows
          if (nextIndex >= cards.length) {
            nextIndex -= cards.length
          }
          break
        case 'ArrowUp':
          nextIndex = currentFocusedIndex - numRows
          if (nextIndex < 0) {
            nextIndex += cards.length
          }
          break
      }

      if (nextIndex !== -1) {
        cards[nextIndex].focus()
      }

      if (e.key === 'Enter') {
        const focusedCard = document.activeElement
        if (focusedCard && focusedCard.classList.contains('card')) {
          focusedCard.click()
        }
      }
    })
  }

  /**
   * functon to add a event listner to the setting button and the eements of the setting list(level list)
   */
  theMemoryGame () {
    this.#setttingBtn.addEventListener('click', () => {
      this.#LevelDiv.classList.toggle('hidden')

      this.#level1.addEventListener('click', () => {
        this.#cardsContainer.innerHTML = ''
        this.#gameLevelText.innerText = 'Level : small'
        this.#try.innerText = 'Attempt Counter : 0'
        this.#size = 2
        this.createGameGrid(this.#size)
        this.#LevelDiv.classList.add('hidden')
      })

      this.#level2.addEventListener('click', () => {
        this.#cardsContainer.innerHTML = ''
        this.#gameLevelText.innerText = 'Level : Medium'
        this.#try.innerText = 'Attempt Counter : 0'
        this.#size = 3
        this.createGameGrid(this.#size)
        this.#LevelDiv.classList.add('hidden')
      })

      this.#level3.addEventListener('click', () => {
        this.#cardsContainer.innerHTML = ''
        this.#gameLevelText.innerText = 'Level : Larg'
        this.#try.innerText = 'Attempt Counter : 0'
        this.#size = 4
        this.createGameGrid(this.#size)
        this.#LevelDiv.classList.add('hidden')
      })
    })
  }

  /**
   * function to restart the game cover all cards and clear the number of attempts.
   */
  restartButton () {
    this.#restartBtn.addEventListener('click', () => {
      this.#cardsContainer.innerHTML = ''
      this.createGameGrid(this.#size)
      this.#try.innerText = 'Attempt Counter : 0'
    })
  }
}
