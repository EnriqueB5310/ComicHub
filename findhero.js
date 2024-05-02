const APIKEY = "23bcbeb0ba49ee64a339eae3329ad658"
const PrivKey = "16d2a0d1717b7b50c601570e495512d7d9474508"

const timestamp = new Date().getTime();



const hash = md5(timestamp + PrivKey + APIKEY);






document.getElementById('searchButton').addEventListener('click', () => {
  const heroName = document.getElementById('heroSearch').value;
  fetch(`https://gateway.marvel.com/v1/public/characters?name=${heroName}&apikey=${APIKEY}&ts=${timestamp}&hash=${hash}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const hero = data.data.results[0]; // Get the hero's information
      const heroContainer = document.createElement('div');
      heroContainer.classList.add('container', 'mt-4');

      // Display hero information
      const heroInfo = `
        <div class="row">
          <div class="col-md-4">
            <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" class="img-fluid rounded-start" alt="${hero.name}">
          </div>
          <div class="col-md-8">
            <h2>${hero.name}</h2>
            <p>${hero.description || 'No description available'}</p>
          </div>
        </div>
      `;
      heroContainer.innerHTML = heroInfo;

      // Fetch hero's series
      fetch(`https://gateway.marvel.com/v1/public/characters/${hero.id}/series?limit=10&apikey=${APIKEY}&ts=${timestamp}&hash=${hash}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const series = data.data.results;

          // Display hero's series
          const seriesList = document.createElement('ul');
          seriesList.classList.add('list-group', 'mt-4');
          series.forEach(serie => {
            const seriesItem = document.createElement('li');
            seriesItem.classList.add('list-group-item');
            seriesItem.textContent = serie.title;
            seriesList.appendChild(seriesItem);
          });
          heroContainer.appendChild(seriesList);
        })
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
        });

      document.getElementById('heroContainer').innerHTML = ''; // Clear previous results
      document.getElementById('heroContainer').appendChild(heroContainer);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
});
