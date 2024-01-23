export default class WeatherApp {
  #theApp
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

  constructor () {
    this.#theApp = document.createElement('div')
    this.#theApp.className = 'theApp'
    this.#buttonImage = document.createElement('img')
    this.#buttonImage.className = 'seachingImg'
    const searchingIcon = (new URL('../../img/weatherApp/searchingIcon.png', import.meta.url)).href
    this.#buttonImage.src = `${searchingIcon}`

    this.#button = document.createElement('button')
    this.#button.className = 'searchingButton'
    this.#button.appendChild(this.#buttonImage)

    this.#input = document.createElement('input')
    this.#input.placeholder = 'Enter City Name'
    this.#input.className = 'searchInput'
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
    const Rain = (new URL('../../img/weatherApp/rain.png', import.meta.url)).href
    this.#weatherIcon.src = `${Rain}`
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
    const theHumidity = (new URL('../../img/weatherApp/humidity.png', import.meta.url)).href
    this.#humidityImg.src = `${theHumidity}`
    this.#humidityImg.className = 'humidityImg'
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
    const theWind = (new URL('../../img/weatherApp/wind.png', import.meta.url)).href
    this.#windImg.src = `${theWind}`
    this.#windImg.className = 'windImg'
    this.#windCol.appendChild(this.#windImg)
    this.#windCol.className = 'col'
    this.#wind = document.createElement('p')
    this.#wind.className = 'wind'
    this.#windText = document.createElement('p')
    this.#windText.innerText = 'Wind Speed'

    this.#windInfo = document.createElement('div')
    this.#windInfo.appendChild(this.#wind)
    this.#windInfo.appendChild(this.#windText)

    this.#windCol.appendChild(this.#windImg)
    this.#windCol.appendChild(this.#windInfo)

    this.#detail.appendChild(this.#humidityCol)
    this.#detail.appendChild(this.#windCol)

    this.#theApp.appendChild(this.#search)
    this.#theApp.appendChild(this.#errorMsg)
    this.#theApp.appendChild(this.#weather)
    this.searchAction()
  }

  /**
   *
   * @returns {Element} Dom element that represent the app container.
   */
  getWeatherAppp () {
    return this.#theApp
  }

  /**
   *
   * @param {string} city name of the city.
   */
  async checkWeather (city) {
    const apiKey = '767c1140678ccf7a12a0d3cd0e115e6f'
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='
    const theClear = (new URL('../../img/weatherApp/clear.png', import.meta.url)).href
    const theCloud = (new URL('../../img/weatherApp/clouds.png', import.meta.url)).href
    const theRain = (new URL('../../img/weatherApp/rain.png', import.meta.url)).href
    const theDrizzle = (new URL('../../img/weatherApp/drizzle.png', import.meta.url)).href
    const theMinst = (new URL('../../img/weatherApp/minst.png', import.meta.url)).href
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
    
    const data = await response.json()
    console.log('ssssssssssss', response.status)

    if (response.status === 404) {
      this.#errorMsg.classList.remove('hidden')
      this.#weather.classList.add('hidden')
    } else {
      this.#weather.classList.remove('hidden')
      this.#errorMsg.classList.add('hidden')
      this.#city.innerHTML = data.name
      this.#temp.innerHTML = Math.round(data.main.temp) + '°C'
      this.#humidity.innerHTML = data.main.humidity + '%'
      this.#wind.innerHTML = data.wind.speed + 'km/h'
      this.#weatherStauts.innerHTML = data.weather[0].main

      if (data.weather[0].main === 'Clear') {
        this.#weatherIcon.src = `${theClear}`
      } else if (data.weather[0].main === 'Clouds') {
        this.#weatherIcon.src = `${theCloud}`
      } else if (data.weather[0].main === 'Rain') {
        this.#weatherIcon.src = `${theRain}`
      } else if (data.weather[0].main === 'Drizzle') {
        this.#weatherIcon.src = `${theDrizzle}`
      } else if (data.weather[0].main === 'Minst') {
        this.#weatherIcon.src = `${theMinst}`
      }
    }
  }

  /**
   * add action ot search button and input
   */
  searchAction () {
    this.#button.addEventListener('click', (e) => {
      e.preventDefault()
      this.checkWeather(this.#input.value)
      this.#input.value = ''
    })
    this.#input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.checkWeather(this.#input.value)
        this.#input.value = ''
      }
    })
  }
}
