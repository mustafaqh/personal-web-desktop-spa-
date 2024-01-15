export default class MemoryGame{
    constructor() {
        this.gameContainer = document.createElement('div')
        this.gameContainer.classList.add('gameContainer')
        this.header = document.createElement('h2')
        this.header.className = 'header'
        this.gameBox = document.createElement('div')
        this.gameBox.classList.add('game')
        this.resetButton = document.createElement('button')
        this.resetButton.classList.add('reset')
        this.resetButton.innerText = 'restart'
        this.header.innerText = 'memory game'
        this.setting = document.createElement('div')
        this.setting.className = 'setting'
        this.settingImg = document.createElement('img')
        this.settingImg.src = '../src/img/setting.png'
        this.settingImg.className = 'settingImg'
        this.setting.appendChild(this.settingImg)
        this.gameHeader = document.createElement('div')
        this.gameHeader.className = 'gameHeader'
        this.gameHeader.appendChild(this.setting)
        this.gameHeader.appendChild(this.header)
        this.gameContainer.appendChild(this.gameHeader)
        this.gameContainer.appendChild(this.gameBox)
        this.gameContainer.appendChild(this.resetButton)
        this.items = []
        this.createGameGrid()
        this.restartButton()
    }

    getGame(){
        return this.gameContainer
    }

    createGameGrid(){
        this.items = ['🇸🇪', '🇸🇪',  '🇫🇮', '🇫🇮', '🇳🇴','🇳🇴','🇩🇰', '🇩🇰','🇮🇸','🇮🇸','🇩🇪','🇩🇪', '🇨🇭','🇨🇭', '🇺🇸', '🇺🇸']
        var suffeledFlags = this.items.sort(() => Math.random() - 0.5)

        for (var i = 0; i < this.items.length; i++) {
            const itemBox = document.createElement('div')
            itemBox.className = 'flag'
            itemBox.innerHTML = suffeledFlags[i]
            
            this.gameBox.appendChild(itemBox)


            itemBox.addEventListener('click',()=> {
                itemBox.classList.add('boxOpen')
                setTimeout(()=>{   
                    var openBox = document.querySelectorAll('.boxOpen')
                    if (openBox.length > 1) {
                        if (openBox[0].innerHTML == openBox[1].innerHTML){
                            openBox[0].classList.add('matchBox')
                            openBox[1].classList.add('matchBox')

                            openBox[1].classList.remove('boxOpen')
                            openBox[0].classList.remove('boxOpen')
                            
                            var matchBox = document.querySelectorAll('.matchBox')
                            if(matchBox.length == this.items.length){
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
    }

    restartButton(){
        this.resetButton.addEventListener('click', ()=> {
            this.gameBox.innerHTML=''
            this.createGameGrid()
        })
    }

}