

const APIKEY = "23bcbeb0ba49ee64a339eae3329ad658"
const PrivKey = "16d2a0d1717b7b50c601570e495512d7d9474508"

const timestamp = new Date().getTime();



const hash = md5(timestamp + PrivKey + APIKEY);


fetch(`https://gateway.marvel.com/v1/public/comics?dateDescriptor=thisWeek&limit=3&apikey=${APIKEY}&ts=${timestamp}&hash=${hash}`)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  const comics = data.data.results;
  const selectedComics = [];
  
  // Select 3 random comics
  while (selectedComics.length < 3) {
    const randomIndex = Math.floor(Math.random() * comics.length);
    if (!selectedComics.includes(randomIndex)) {
      selectedComics.push(randomIndex);
    }
  }

  const carouselInner = document.querySelector('#carouselContainer .carousel-inner');

  selectedComics.forEach((index, idx) => {
    const comic = comics[index];
    console.log('Comic:', comic);
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    if (idx === 0) {
      item.classList.add('active');
    }
   

const contentWrapper = document.createElement('div');
contentWrapper.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'h-100');

const content = document.createElement('div');
content.classList.add('text-center');

const img = document.createElement('img');
img.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
img.alt = comic.title;
img.classList.add('img-fluid');

const caption = document.createElement('div');
caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
caption.innerHTML = `<h5>${comic.title}</h5>`;

content.appendChild(img);
content.appendChild(caption);
contentWrapper.appendChild(content);
item.appendChild(contentWrapper);

carouselInner.appendChild(item);
  });

  console.log(selectedComics)
  console.log(carouselInner)
  // Initialize the carousel
  new bootstrap.Carousel(document.querySelector('.carousel'), {
    interval: 10000 // Set the interval for carousel slide (in milliseconds)
  });
})
.catch(error => {
  console.error('There was a problem with your fetch operation:', error);
});


//for new releases

fetch(`https://gateway.marvel.com/v1/public/comics?dateDescriptor=thisWeek&limit=9&apikey=${APIKEY}&ts=${timestamp}&hash=${hash}`)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  const comics = data.data.results;

  // Display comic search results in release order
  document.getElementById('newComics').innerHTML = '';
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
    document.getElementById('newComics').insertAdjacentHTML('beforeend', comicInfo);
  });
})
.catch(error => {
  console.error('There was a problem with your fetch operation:', error);
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