const apiKey = "c72f1c577086e0800d426018cff13045"; // Check karein ke \ na ho
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector("#weather-icon");

// --- 1. Common Function Data Display Karne Ke Liye ---
function updateUI(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  // Weather Icons aur Backgrounds
  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "https://openweathermap.org/img/wn/03d@2x.png";
    document.body.style.background =
      "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "https://openweathermap.org/img/wn/01d@2x.png";
    document.body.style.background =
      "linear-gradient(135deg, #f7b733, #fc4a1a)";
  } else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "https://openweathermap.org/img/wn/10d@2x.png";
    document.body.style.background =
      "linear-gradient(135deg, #314755, #26a0da)";
  } else {
    weatherIcon.src = "https://openweathermap.org/img/wn/50d@2x.png"; // Mist/Default
  }

  document.querySelector(".weather-info").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

// --- 2. Search By City Name ---
async function checkWeather(city) {
  const response = await fetch(
    apiUrl + encodeURIComponent(city) + `&appid=${apiKey}`,
  );

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather-info").style.display = "none";
  } else {
    const data = await response.json();
    updateUI(data); // UI update function call kiya
  }
}

// --- 3. Search By Coordinates (Geolocation) ---
async function fetchWeatherByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
  );
  const data = await response.json();
  updateUI(data); // UI update function call kiya
}

// --- 4. Event Listeners ---
searchBtn.addEventListener("click", () => {
  checkWeather(cityInput.value.trim());
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    // Fix: === comparison ke liye
    checkWeather(cityInput.value.trim());
  }
});

// --- 5. Auto-Location on Load ---
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      (error) => {
        console.log("Location access denied.");
        checkWeather("Karachi"); // Default shehar
      },
    );
  }
});


