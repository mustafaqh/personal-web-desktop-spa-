export default class WeatherApp {
    #card
    #search
    #input
    #button
    #buttonImage
    #errorMsg
    #errorText
    #weather
    #weatherIcon
    #temp
    #city
    #detail
    #humidityCol
    #humidityImg
    #humidity
    #humidityText
    #humidityInfo
    #windCol
    #windImg
    #wind
    #windText
    #weatherStauts
    #windInfo

    constructor() {

        this.#card = document.createElement('div')
        this.#card.className = 'card'
        this.#buttonImage = document.createElement('img')
        this.#buttonImage.src = '../src/img//weartherApp/search.png'

        this.#button = document.createElement('button')

        this.#button.appendChild(this.#buttonImage)

        this.#input = document.createElement('input')
        this.#input.placeholder = 'Enter City Name'
        this.#search = document.createElement('div')
        this.#search.className = 'search'
        this.#search.appendChild(this.#input)
        this.#search.appendChild(this.#button)

        this.#errorText = document.createElement('p')
        this.#errorText.innerText = '❌ Invaild city name ❌'
        this.#errorMsg = document.createElement('div')
        this.#errorMsg.className = 'error hidden'
        this.#errorMsg.appendChild(this.#errorText)

        this.#weather = document.createElement('div')
        this.#weather.className = 'weather hidden'
        this.#weatherIcon = document.createElement('img')
        this.#weatherIcon.src = '../src/img//weartherApp/rain.png'
        this.#weatherIcon.className = 'weatnerIcon'

        this.#temp = document.createElement('h1')
        this.#temp.className = 'temp'
        this.#temp.innerText = '22°C'

        this.#city = document.createElement('h2')
        this.#city.className = 'city'

        this.#detail = document.createElement('div')
        this.#detail.className = 'details'
        this.#weatherStauts = document.createElement('p')
        this.#weatherStauts.className = 'classStatus'
        this.#weather.appendChild(this.#weatherIcon)
        this.#weather.appendChild(this.#weatherStauts)
        this.#weather.appendChild(this.#temp)
        this.#weather.appendChild(this.#city)
        this.#weather.appendChild(this.#detail)


        this.#humidityCol = document.createElement('div')
        this.#humidityCol.className = 'col'

        this.#humidityImg = document.createElement('img')
        this.#humidityImg.src = '../src/img//weartherApp/humidity.png'

        this.#humidity = document.createElement('p')
        this.#humidity.className = 'humidity'

        this.#humidityText = document.createElement('p')
        this.#humidityText.innerText = 'Humidity'

        this.#humidityInfo = document.createElement('div')
        this.#humidityInfo.appendChild(this.#humidity)
        this.#humidityInfo.appendChild(this.#humidityText)

        this.#humidityCol.appendChild(this.#humidityImg)
        this.#humidityCol.appendChild(this.#humidityInfo)

        this.#windCol = document.createElement('div')

        this.#windImg = document.createElement('img')
        this.#windImg.src = '../src/img//weatherApp/wind.png'

        this.#windCol.appendChild(this.#windImg)
        this.#windCol.className = 'col'
        this.#wind = document.createElement('p')
        this.#windText = document.createElement('p')
        this.#windText.innerText = 'Wind Speed'

        this.#windInfo = document.createElement('div')
        this.#windInfo.appendChild(this.#wind)
        this.#windInfo.appendChild(this.#windText)

        this.#windCol.appendChild(this.#windImg)
        this.#windCol.appendChild(this.#windInfo)

        this.#detail.appendChild(this.#humidityCol)
        this.#detail.appendChild(this.#windCol)

        this.#card.appendChild(this.#search)
        this.#card.appendChild(this.#errorMsg)
        this.#card.appendChild(this.#weather)
        this.searchAction()
    }

}