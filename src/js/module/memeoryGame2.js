export default class Game2{
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
    constructor(){
        this.#gameContainer = document.createElement('div')
        this.#gameContainer.className = 'gameContainer'

        this.#gaimeHeader =  document.createElement('div')
        this.#gaimeHeader.className = "header"

        this.#gameContainer .appendChild(this.#gaimeHeader)
        
        this.#headertext = document.createElement('h2')
        this.#headertext.className = 'thHeadertext'
        this.#headertext.innerText = 'Memory Game'

        this.#setttingBtn = document.createElement('button')
        this.#setttingBtn.className = 'settingBtn'

        this.#gaimeHeader.appendChild(this.#headertext) 
        this.#gaimeHeader.appendChild(this.#setttingBtn) 
 
        this.#settingImg = document.createElement('img')
        this.#settingImg.src = '../src/img/s.png'
        this.#settingImg.className = 'settingImg'
        this.#setttingBtn.appendChild(this.#settingImg)
        
        this.#cardsContainer = document.createElement('div')
        this.#cardsContainer.className = ('cardsContainer')

        this.#gameContainer.appendChild(this.#cardsContainer)

        this.#gameStatus = document.createElement('div')
        this.#gameStatus.className = 'gameStatus'
       

        this.#gameLevelText = document.createElement('p')
        this.#gameLevelText.className ="levelText"
        this.#gameLevelText.innerText = 'Level : normal'

        this.#gameStatus.appendChild(this.#gameLevelText)

        this.#try = document.createElement('p')
        this.#try.className = 'try'
        this.#try.innerText = 'Attempt Counter : 10'
        this.#gameStatus.appendChild(this.#try)

        this.#gameInfo = document.createElement('div')
        this.#gameInfo.className = 'gameInfo'

        this.#restartBtn = document.createElement('button')
        this.#restartBtn.className = 'reset'

        this.#restartImg = document.createElement('img')
        this.#restartImg.className = 'restartImg'
        this.#restartImg.src = '../src/img/restart.png'

        this.#restartBtn.appendChild(this.#restartImg)

        this.#gameInfo.appendChild(this.#gameStatus)
        this.#gameInfo.appendChild(this.#restartBtn)
        this.#gameContainer.appendChild(this.#gameInfo)
       
        this.#items = ['chips.png', 'dice.png', 'gamble.png', 'gamble2.png','hat.png']
        this.item2 =  ['chips.png', 'dice.png', 'gamble.png', 'gamble2.png','hat.png','money.png', 'guitar.png']
        this.#itemsId = [0,1,2,3,4]
        this.#src = '../src/img/'
        this.createGameGrid(2)
        this. restartButton()
    }


    getGame(){
        return this.#gameContainer
    }


    createGameGrid(y){
        var shuffledId = this.#itemsId.sort(() => Math.random() - 0.5)
        var x = 0
        while(x<y){

        for (var i = 0; i < this.#items.length; i++) {
            const itemBox = document.createElement('div')
            itemBox.className = 'card'
            const theImg = document.createElement('img')
            theImg.className = 'gameimgs'
            theImg.src = `${this.#src}${this.#items[shuffledId[i]]}`
            console.log(shuffledId[i])
            theImg.id = `image${this.#itemsId[i]}`
            itemBox.appendChild(theImg)
            itemBox.id = shuffledId[i]
            this.#cardsContainer.appendChild(itemBox)


            itemBox.addEventListener('click',()=> {
                itemBox.classList.add('boxOpen')
                
                setTimeout(()=>{   
                    var openBox = document.querySelectorAll('.boxOpen')
                    if (openBox.length > 1) {
                        if (openBox[0].id == openBox[1].id){
                            console.log(openBox[0].id)
                            console.log(openBox[1].id)
                            openBox[0].classList.add('matchBox')
                            openBox[1].classList.add('matchBox')

                            openBox[1].classList.remove('boxOpen')
                            openBox[0].classList.remove('boxOpen')
                            
                            var matchBox = document.querySelectorAll('.matchBox')
                            if(matchBox.length == (this.#items.length)*y){
                                alert('you win')
                                console.log('you win')
                            }
                        
                        } else {
                            openBox[0].classList.remove('boxOpen')
                            openBox[1].classList.remove('boxOpen')
                        }
                    }
                },500)
            })
        } 
        x = x+ 1
    }

        }
    restartButton(){
        this.#restartBtn.addEventListener('click', ()=> {
            this.#cardsContainer.innerHTML=''
            this.createGameGrid(2)
        })
    }

}