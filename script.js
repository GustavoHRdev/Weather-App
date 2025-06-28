const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("click", () => {
  const card = document.querySelector('.card');

card.classList.toggle("dark-mode");
const isDark = card.classList.contains("dark-mode");
  toggle.textContent = isDark ? "☀️" : "🌙";
});

const apiKey = "6d4351d7b231d113da6543311511ba1d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.getElementById("weatherIcon");
const weatherContainer = document.querySelector(".weather");
const errorMessage = document.querySelector(".error");

function getLocalTime(timezone) {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  return new Date(utc + 1000 * timezone);
}

function clearWeatherEffects() {
  document.querySelectorAll('.snowflake, .rain-drop').forEach(el => el.remove());
}

function createSnowflakes(num = 30) {
  for (let i = 0; i < num; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = 5 + Math.random() * 5 + 's';
    snowflake.style.fontSize = (10 + Math.random() * 20) + 'px';
    snowflake.style.opacity = Math.random();
    snowflake.style.animationDelay = (Math.random() * 10) + 's';
    snowflake.textContent = '❄';
    document.body.appendChild(snowflake);
  }
}

function createRainDrops(num = 50) {
  for (let i = 0; i < num; i++) {
    const drop = document.createElement('div');
    drop.classList.add('rain-drop');
    drop.style.left = Math.random() * window.innerWidth + 'px';
    drop.style.animationDuration = 0.5 + Math.random() * 0.5 + 's';
    drop.style.animationDelay = (Math.random() * 1) + 's';
    drop.style.height = 10 + Math.random() * 10 + 'px';
    document.body.appendChild(drop);
  }
}

// Novo mapa de ícones para Weather Icons (dia/noite)
const iconMap = {
  Clear: { day: "wi-day-sunny", night: "wi-night-clear" },
  Clouds: { day: "wi-day-cloudy", night: "wi-night-alt-cloudy" },
  Rain: { day: "wi-day-rain", night: "wi-night-alt-rain" },
  Drizzle: { day: "wi-day-sprinkle", night: "wi-night-alt-sprinkle" },
  Mist: { day: "wi-day-fog", night: "wi-night-fog" },
  Snow: { day: "wi-day-snow", night: "wi-night-alt-snow" },
};

async function checkWeather(city) {
  weatherContainer.classList.add("hidden");

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
      errorMessage.style.display = "block";
      weatherContainer.classList.remove("visible");
      weatherContainer.classList.add("hidden");
      document.body.className = '';
      clearWeatherEffects();
      return;
    }

    const data = await response.json();

    setTimeout(() => {
  document.querySelector(".city").textContent = data.name;
  document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").textContent = data.main.humidity + "%";
  document.querySelector(".wind").textContent = data.wind.speed + " km/h";

  const weatherMain = data.weather[0].main;

  // Hora local e período do dia (manhã, tarde, noite)
  const localTime = getLocalTime(data.timezone);
  const hours = localTime.getHours();

  let timePeriod = '';
  if (hours >= 6 && hours < 12) timePeriod = 'morning';
  else if (hours >= 12 && hours < 18) timePeriod = 'afternoon';
  else if (hours >= 18 && hours < 21) timePeriod = 'evening';
  else timePeriod = 'night';

  // Atualiza o ícone principal do clima usando weather-icons e o período do dia
  // Remove classes antigas do ícone
  weatherIcon.className = 'wi weather-icon main-icon'; 
  const iconClass = iconMap[weatherMain] ? iconMap[weatherMain][timePeriod === 'night' || timePeriod === 'evening' ? 'night' : 'day'] : iconMap['Clear'].day;
  weatherIcon.classList.add(iconClass);

  // Atualiza fundo da página (body) para clima + período
  document.body.className = '';
  document.body.classList.add(weatherMain.toLowerCase() + '-' + timePeriod);

  clearWeatherEffects();
  if (weatherMain === 'Snow') {
    createSnowflakes();
  } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    createRainDrops();
  }

  errorMessage.style.display = "none";
  weatherContainer.classList.remove("hidden");
  weatherContainer.classList.add("visible");
}, 500);


  } catch (error) {
    errorMessage.textContent = "Error fetching weather data.";
    errorMessage.style.display = "block";
    weatherContainer.classList.remove("visible");
    weatherContainer.classList.add("hidden");
    document.body.className = '';
    clearWeatherEffects();
  }
}


// Eventos de busca
searchBtn.addEventListener("click", () => {
  if (searchBox.value.trim() !== "") {
    checkWeather(searchBox.value.trim());
  }
});

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchBox.value.trim() !== "") {
    checkWeather(searchBox.value.trim());
  }
});
document.addEventListener("DOMContentLoaded", () => {
  weatherContainer.classList.remove("visible");
  weatherContainer.classList.add("hidden");
  errorMessage.style.display = "none";

  // Limpa texto dos campos, se quiser:
  document.querySelector(".city").textContent = "";
  document.querySelector(".temp").textContent = "";
  document.querySelector(".humidity").textContent = "";
  document.querySelector(".wind").textContent = "";
});
