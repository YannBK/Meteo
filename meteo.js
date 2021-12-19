
const url = "https://www.prevision-meteo.ch/services/json/";

const displayHTML = document.getElementById('display');
const btnOK = document.getElementById('ok');
let JSONDonnees;

function requestApi(e) {
    e.preventDefault();
    const city = document.querySelector("form input[name='city']");

    fetch(`${url}${city.value}`)
        .then(response => response.json())
        .then(data => {
            console.log('sucess:', data);
            JSONDonnees = data;
            if(data["errors"]){
                console.log(JSONDonnees["errors"])
                alert(`${JSONDonnees["errors"][0]["description"]}`);
            }
            else creerSemaine(JSONDonnees);
        })
        .catch((error) => {
            alert("Les données n'ont pas été récupérées");
            console.error('Error:', error);
        })
}

function creerSemaine(obj) {
    displayHTML.classList.remove('apparait');
    displayHTML.innerHTML = "";
    setTimeout(function () {
        //TITRE
        let divTitre = document.createElement('div');
        let titre = document.createElement('h2');
        divTitre.classList.add('titre');
        titre.textContent = `Météo pour ${obj.city_info.name}, ${obj.city_info.country}`;
        divTitre.appendChild(titre);
        
        //CONDITIONS ACTUELLES
        let divActuel = document.createElement('div');
        let sousTitre = document.createElement('h3');
        let img = document.createElement('img');
        let temp = document.createElement('div');
        let wind = document.createElement('div');
        let com = document.createElement('div');

        divActuel.classList.add('actuelle');
        sousTitre.textContent = `Conditions actuelles le ${obj.current_condition.date} à ${obj.current_condition.hour}`;
        img.setAttribute('src', `${obj.current_condition.icon_big}`);
        temp.textContent = `Température : ${obj.current_condition.tmp}°C`;
        temp.classList.add('divp');
        wind.textContent = `Vents : ${obj.current_condition.wnd_spd}km/h ; ${obj.current_condition.wnd_dir}`;
        wind.classList.add('divp');
        com.textContent = `${obj.current_condition.condition}`;
        com.classList.add('divp');

        divActuel.appendChild(sousTitre);
        divActuel.appendChild(img);
        divActuel.appendChild(temp);
        divActuel.appendChild(wind);
        divActuel.appendChild(com);

        displayHTML.appendChild(divTitre);
        displayHTML.appendChild(divActuel);

        //JOURS DE SEMAINE
        let arrSem = [];
        for (let prop in obj) {
            if (prop.startsWith("fcst")) {
                arrSem.push(obj[prop]);
            }
        }
        let divJour = document.createElement('div');
        divJour.classList.add('jour');
        for (let i = 0; i < arrSem.length; i++) {
            let divCarte = document.createElement('div');
            let sousTitre = document.createElement('h3');
            let img = document.createElement('img');
            let temp = document.createElement('p');
            let temp2 = document.createElement('p');
            let com = document.createElement('p');
            let cliquer = document.createElement('button');

            divCarte.classList.add('div');
            sousTitre.textContent = `${arrSem[i].day_long}, ${arrSem[i].date}`;
            img.setAttribute('src', `${arrSem[i].icon_big}`);
            temp.textContent = `Température minimale: ${arrSem[i].tmin}°C`;
            temp2.textContent = `Température maximale: ${arrSem[i].tmax}°C`;
            com.textContent = `${arrSem[i].condition}`;
            cliquer.textContent = "Heure par heure";
            cliquer.classList.add("cliquer");

            divCarte.appendChild(sousTitre);
            divCarte.appendChild(img);
            divCarte.appendChild(com);
            divCarte.appendChild(temp);
            divCarte.appendChild(temp2);
            divCarte.appendChild(cliquer);

            divJour.appendChild(divCarte);

            //HEURE PAR HEURE
            let divHeure = document.createElement('div');
            divHeure.classList.add('heure');
            divHeure.setAttribute('id', 'heure');

            cliquer.addEventListener('click', (e) => {
                e.preventDefault();
                if (displayHTML.lastChild.id == "heure") {
                    displayHTML.removeChild(displayHTML.lastChild);
                }
                let jour = document.createElement('h3');
                jour.classList.add('petitjour');
                jour.textContent = `${arrSem[i].day_long}`;
                divHeure.appendChild(jour);

                for (let prop in arrSem[i].hourly_data) {
                    let nom = `${prop}`;

                    let petiteDiv = document.createElement('div');
                    let heure = document.createElement('p');
                    let divimg = document.createElement('img');
                    let condition = document.createElement('p');

                    petiteDiv.classList.add('petitediv');
                    heure.textContent = nom;
                    divimg.setAttribute('src', `${arrSem[i]["hourly_data"][nom].ICON}`);
                    condition.textContent = `${arrSem[i]["hourly_data"][nom].CONDITION}`;

                    petiteDiv.appendChild(heure);
                    petiteDiv.appendChild(divimg);
                    petiteDiv.appendChild(condition);

                    divHeure.appendChild(petiteDiv);

                    displayHTML.appendChild(divHeure);
                }
            });
        }
        displayHTML.appendChild(divJour);
        displayHTML.classList.add('apparait');
    }, 100);
}

btnOK.addEventListener('click', e => {
    e.preventDefault();
    requestApi(e);
});
