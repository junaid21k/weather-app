const cityInput = document.querySelector('.city-input')
const  searchBtn= document.querySelector('.search-btn')
const apiKey = 'cbdc74ab5620a32333aedfc346e0b634'

const notFoundSection = document.querySelector('.not-found')
const weatherInfoSection = document.querySelector('.weather-info')
const searchCitySection = document.querySelector('.search-city')


const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionalTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummuryImg = document.querySelector('.weather-summury-image')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItmesContainer = document.querySelector('.forcast-itmes-container')

console.log(forecastItmesContainer)



searchBtn.addEventListener('click',()=>{
    if(cityInput.value !== ''){
        weatherUpdate(cityInput.value)
        cityInput.value = '';
        cityInput.blur()

    }
})

cityInput.addEventListener('keydown',(event)=>{
    if(event.key == 'Enter' && cityInput.value !== ''){
        weatherUpdate(cityInput.value)
        cityInput.value = '';
        cityInput.blur()
    }
})
async function getFetchData(endPoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const respons = await fetch(apiUrl)

    return respons.json()

}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg';
    if(id<=321) return 'drizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getcurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday:'short',
        day:'2-digit',
        month:'short',
    }

    return currentDate.toLocaleDateString('en-US', options)
}
async function weatherUpdate(city){
    const weatherData = await getFetchData('weather',city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    
    
    
    const {
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed},
    } = weatherData
    
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionalTxt.textContent = main
    humidityValueTxt.textContent = humidity + ' %'
    windValueTxt.textContent = speed + ' M/s'
    weatherSummuryImg.src = `assets/weather/${getWeatherIcon(id)}`
    
    currentDateTxt.textContent = getcurrentDate()
    
    updateForeCastsInfo(city)
    showDisplaySection(weatherInfoSection)


}

async function updateForeCastsInfo(city){
    const forecastData = await getFetchData('forecast',city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItmesContainer.innerHTML = ''

    forecastData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItem(forecastWeather)
        }
    })

    console.log(todayDate)
    
}

function updateForecastItem(weatherData){
    console.log(weatherData)

    const {
        dt_txt:date,
        weather:[{ id }],
        main:{ temp }
    } = weatherData


    const dateTaken = new Date(date)
    const dateOption = {
        day:'2-digit',
        month:'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)

    const ForecastItem = `
        <div class="forcast-item">
            <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forcast-img">
            <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItmesContainer.insertAdjacentHTML('beforeend', ForecastItem)



}

function showDisplaySection(section){
    [notFoundSection,searchCitySection,weatherInfoSection].forEach(section =>{
        section.style.display = 'none'
    })
    section.style.display = 'flex'
}

