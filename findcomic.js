
const APIKEY = "23bcbeb0ba49ee64a339eae3329ad658"
const PrivKey = "16d2a0d1717b7b50c601570e495512d7d9474508"

const timestamp = new Date().getTime();



const hash = md5(timestamp + PrivKey + APIKEY);




document.getElementById('searchButton').addEventListener('click', () => {
    const comicTitle = document.getElementById('comicSearch').value;
    fetch(`https://gateway.marvel.com/v1/public/comics?titleStartsWith=${comicTitle}&orderBy=-onsaleDate&apikey=${APIKEY}&ts=${timestamp}&hash=${hash}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const comics = data.data.results;

        // Display comic search results in release order
        document.getElementById('comicSearchResults').innerHTML = '';
        comics.forEach(comic => {
          const comicInfo = `
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" class="img-fluid rounded-start comic-image" alt="${comic.title}">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${comic.title}</h5>
                    <p class="card-text">${comic.description || 'No description available'}</p>
                    <p class="card-text"><small class="text-muted">Release Date: ${comic.dates.find(date => date.type === 'onsaleDate').date}</small></p>
                  </div>
                </div>
              </div>
            </div>
          `;
          document.getElementById('comicSearchResults').insertAdjacentHTML('beforeend', comicInfo);
        });
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  });