// Create a request variable and assign a new XMLHttpRequest object to it.
let request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', "https://swapi.co/api/people/", true);

request.onload = function () {
    let data = JSON.parse(this.response);
    for(let i=0; i<data.results.length; i++){
        //Create div with class 'container'
        let container = document.createElement('div');
        container.className='container';

        //Create h2 and add it inside the container
        let header = document.createElement('h2');
            header.innerHTML = data.results[i].name;
            container.appendChild(header);

        //Create <p> with birthday and add it inside the container
        let birthday = document.createElement('p');
        birthday.innerHTML = '<span>Birthday year: </span>'+data.results[i].birth_year;
        container.appendChild(birthday);

        //Create <p> with gender and add it inside the container
        let gender = document.createElement('p');
        gender.innerHTML = '<span>Gender: </span>'+data.results[i].gender;
        container.appendChild(gender);

        //Create <p> with species and language and add them inside the container
        let species = document.createElement('p');
        let language = document.createElement('p');
        function getSpecies(link) {
            return createPromise(link)
        }

        getSpecies(data.results[i].species)
            .then(function(response){
                let data = JSON.parse(response);
                species.innerHTML = '<span>Species: </span>' + data.name;
                container.appendChild(species);
                language.innerHTML = '<span>Language: </span>' + data.language;
                container.appendChild(language);
            });

        //Create <p> with homeworld and add it inside the container
        let homeworld = document.createElement('p');
        function getPlanetName(link) {
            return createPromise(link)
        }
        getPlanetName(data.results[i].homeworld)
            .then(function(response){
                let data = JSON.parse(response);
                homeworld.innerHTML = '<span>Homeworld: </span>' + data.name;
                container.appendChild(homeworld);
            });

        //Create <p> with description and add it inside the container
        let snippet = document.createElement('p');
        let image = document.createElement('img');
        function getSnippet(link) {
            return createPromise(link)
        }
        getSnippet('https://www.googleapis.com/customsearch/v1?key=YOUR_KEY='+data.results[i].name.replace(' ', '%20'))
            .then(function(response){
                let data = JSON.parse(response);
                snippet.innerHTML = '<span>Description: </span>' + data.items[0].snippet +'<a href='+data.items[0].link+' target="_blank"> more info </a>';
                image.setAttribute("src", ''+data.items[0].pagemap.cse_image[0].src);
                image.setAttribute('class', 'character-image');
                // console.log(data.items[0].pagemap.cse_image[0].src);
                container.appendChild(snippet);
                container.insertBefore(image, container.children[1]);
            });

        //Add container to root
        document.getElementById('root').appendChild(container);
    }
};

// Send request
request.send();

function createPromise(link){
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', link, true);
        xhr.onload = function() {
            if (this.status === 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });
}