const apiKey = "0475389cab12d690e9dd421048a1bbf2";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const errorMessage = document.getElementById("errorMessage");
const forecastContainer = document.getElementById("forecastContainer");
const loader = document.getElementById("loader");

// Função principal
async function handleSearch() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Digite o nome de uma cidade.");
    return;
  }

  showLoader(true);
  hideError();

  try {
    await getForecast(city);
  } catch (error) {
    showError("Erro ao buscar dados. Verifique o nome da cidade.");
  } finally {
    showLoader(false);
  }
}

// Previsão 5 dias
async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`
  );

  if (!response.ok) {
    throw new Error("Erro na previsão");
  }

  const data = await response.json();

  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <h4>${new Date(day.dt_txt).toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit"
      })}</h4>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      <p>${Math.round(day.main.temp)}°C</p>
    `;

    forecastContainer.appendChild(card);
  });
}

// Loader
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

// Erro
function showError(message) {
  errorMessage.textContent = message;
}

function hideError() {
  errorMessage.textContent = "";
}

// Eventos
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});