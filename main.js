const API_KEY = '51034626-132d0e1016f85c4382ba4bc34';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more-btn');

let query = '';
let page = 1;

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.currentTarget.elements.query.value.trim();
  if (!query) return;

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(query, page);
    if (data.hits.length === 0) {
      alert('Зображення не знайдені');
      return;
    }
    renderImages(data.hits);
    if (data.totalHits > page * 12) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    alert('Помилка завантаження зображень');
    console.error(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  try {
    const data = await fetchImages(query, page);
    renderImages(data.hits);
    if (data.totalHits <= page * 12) {
      loadMoreBtn.style.display = 'none';
    }
    const lastCard = gallery.lastElementChild;
    if (lastCard) {
      lastCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  } catch (error) {
    alert('Помилка завантаження зображень');
    console.error(error);
  }
});

async function fetchImages(searchQuery, pageNumber = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&page=${pageNumber}&per_page=12`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('fetchImages error:', error);
    throw error;
  }
}

function renderImages(images) {
  const markup = images.map(img => `
    <li>
      <div class="photo-card">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        <div class="stats">
          <p class="stats-item"><i class="material-icons">thumb_up</i>${img.likes}</p>
          <p class="stats-item"><i class="material-icons">visibility</i>${img.views}</p>
          <p class="stats-item"><i class="material-icons">comment</i>${img.comments}</p>
          <p class="stats-item"><i class="material-icons">cloud_download</i>${img.downloads}</p>
        </div>
      </div>
    </li>
  `).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
