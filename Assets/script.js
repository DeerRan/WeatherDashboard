var button = document.getElementById("searchbtn")

let weather = {
    apiKey: "4223f965e6b3d42313fa946515f969aa",

    fetchWeather: function(input) {
        fetch(
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                input +
                "&units=imperial&appid=" +
                this.apiKey
            )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },

    fetchForecast: function(input) {
        fetch(
                "https://api.openweathermap.org/data/2.5/forecast?q=" +
                input +
                "&units=imperial&appid=" +
                this.apiKey
            )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayForecast(data));
    },

    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { lat, lon } = data.coord;
        const date = moment().format('L');
        document.getElementById("header3").innerHTML = name + " " + date;
        document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById("temperature").innerHTML = "Temperature: " + temp + "℉";
        document.getElementById("humidity").innerHTML = "Humidity: " + humidity + "%";
        document.getElementById("wind").innerHTML = "Wind Speed: " + speed + "mph";
        fetchUVI(lat, lon)

        function fetchUVI(lat, lon) {
            fetch(
                    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                    lat +
                    "&lon=" +
                    lon + "&exclude={part}&appid=4223f965e6b3d42313fa946515f969aa"
                )
                .then((response) => {
                    if (!response.ok) {
                        alert("Couldn't grab UVI");
                        throw new Error("Couldn't grab UVI");
                    }
                    return response.json();
                })
                .then((data) => displayUVI(data));

            function displayUVI(data) {
                const { uvi } = data.current;
                document.getElementById('UVI').innerHTML = uvi;
                if (3 > uvi) {
                    document.getElementById('UVI').style.backgroundColor = "rgb(111, 211, 29)"
                } else if (6 > uvi >= 3) {
                    document.getElementById('UVI').style.backgroundColor = "rgb(255, 187, 0)"
                } else {}



            }
        }
    },

    search: function(input) {
        this.fetchWeather(input)
        this.fetchForecast(input)

    },

    displayForecast: function(data) {
        for (var i = 0; i < 5; i++) {
            var { temp, humidity } = data.list[i].main
            var { icon } = data.list[i].weather[0]
            document.getElementById("forecastDate" + i).innerHTML = moment().add((i + 1), 'days').format("L")
            document.getElementById("forecastTemp" + i).innerHTML = "Temp: " + temp + "℉"
            document.getElementById("forecastHumidity" + i).innerHTML = "Humidity: " + humidity + "%"
            document.getElementById("forecastIcon" + i).src = "https://openweathermap.org/img/wn/" + icon + ".png"
        }
        //document.getElementById("PARENT").classList.remove("loading");
    }
};


// Template tag parser courtesy of Nate
// This takes template tags and parses them into HTML elements that are appendable to the current scope
const html = (strings, ...values) => new DOMParser().parseFromString(strings.map((string, i) => strings[i] + values[i]).join(''), "text/html").body.firstChild;

function createHistoryStorage() {
    if (typeof localStorage.getItem('history') === 'object') {
        localStorage.setItem("history", JSON.stringify([]));
    } else { getHistory() }
}

createHistoryStorage()

function addtoHistory(input) {

    var row = html `
        <div class='cities'>${input}</div>
    `;

    document.getElementById("history").appendChild(row);

    var stored = JSON.parse(localStorage.getItem('history'));
    stored.push(input);
    localStorage.setItem("history", JSON.stringify(stored));

}

function getHistory() {

    var stored = JSON.parse(localStorage.getItem(`history`));

    for (var i = 0; i < stored.length; i++) {
        var row = html `
            <div class='cities'>${stored[i]}</div>
            `;
        document.getElementById("history").appendChild(row);
    };
}

button.addEventListener("click", function() {
    weather.search(document.getElementById('input').value);
    addtoHistory(document.getElementById('input').value)
    document.getElementById("input").value = ""
});

document.getElementById("input").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        weather.search(document.getElementById('input').value)
        addtoHistory(document.getElementById('input').value)
        document.getElementById("input").value = ""
    }
});

function bootlegSearch(event) {
    weather.search(event.target.innerHTML)
    document.getElementById("input").value = ""
}


weather.fetchWeather("Minneapolis");
weather.fetchForecast("Minneapolis");