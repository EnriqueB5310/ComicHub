
import md5 from 'md5';



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

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel', 'slide');
  carouselInner.setAttribute('id', 'carouselExampleCaptions');
  carouselInner.setAttribute('data-ride', 'carousel');

  const carouselInnerContent = document.createElement('div');
  carouselInnerContent.classList.add('carousel-inner');

  selectedComics.forEach((index, idx) => {
    const comic = comics[index];
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    if (idx === 0) {
      item.classList.add('active');
    }
    item.style.backgroundImage = `url(${comic.thumbnail.path}.${comic.thumbnail.extension})`;

    const caption = document.createElement('div');
    caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
    caption.innerHTML = `<h5>${comic.title}</h5>`;
    
    item.appendChild(caption);
    carouselInnerContent.appendChild(item);
  });

  carouselInner.appendChild(carouselInnerContent);

  document.getElementById('carouselContainer').appendChild(carouselInner);

  console.log(data.data.results)
  // Initialize the carousel
  $('.carousel').carousel();
})
.catch(error => {
  console.error('There was a problem with your fetch operation:', error);
});