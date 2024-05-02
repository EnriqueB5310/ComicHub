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
        const heroId = data.data.results[0].id; // Get the hero's ID
        fetch(`https://gateway.marvel.com/v1/public/characters/${heroId}/comics?limit=50&apikey=${APIKEY}&ts=${timestamp}&hash=${hash}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            const comics = data.data.results;

            const gridContainer = document.createElement('div');
            gridContainer.classList.add('row', 'row-cols-3', 'g-4');

            comics.forEach(comic => {
              const gridItem = document.createElement('div');
              gridItem.classList.add('col', 'text-center', 'col-md-4', 'col-sm-6', 'col-xs-12');

              const image = document.createElement('img');
              image.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
              image.alt = comic.title;
              image.classList.add('img-fluid', 'comic-image');

              const caption = document.createElement('div');
              caption.textContent = comic.title;
              caption.classList.add('caption');

              gridItem.appendChild(image);
              gridItem.appendChild(caption);
              gridContainer.appendChild(gridItem);

              // Add event listener to open modal on click
              gridItem.addEventListener('click', () => {
                openModal(comic);
              });
            });

            document.getElementById('heroContainer').innerHTML = ''; // Clear previous results
            document.getElementById('heroContainer').appendChild(gridContainer);
          })
          .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
          });
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  });


  function openModal(comic) {
    // Create modal content
    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${comic.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" class="img-fluid mb-3">
            <p>${comic.description}</p>
            <p><strong>Release Date:</strong> ${comic.dates.find(date => date.type === 'onsaleDate').date}</p>
          </div>
        </div>
      </div>
    `;
  
    // Create modal element
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.innerHTML = modalContent;
  
    // Add modal to the body and show it
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
  
    // Add event listener to close the modal when the "X" button is clicked
    modal.querySelector('.btn-close').addEventListener('click', () => {
      modalInstance.hide();
    });
  
    modalInstance.show();
  }