import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputel: document.querySelector('#search-box'),
  ulEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

function onInput(e) {
  e.preventDefault();
  fetchCountries(e.target.value.trim())
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      // Data handling
      checkLengthInData(data);
    })
    .catch(error => {
      // Error handling
      Notify.failure('Oops, there is no country with that name');
      refs.ulEl.innerHTML = '';
      refs.divEl.innerHTML = '';
    });
}

const checkLengthInData = data => {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (data.length >= 2 && data.length <= 10) {
    insertContentInUl(data);
  } else if (data.length === 1) {
    insertContentInDiv(...data);
  } else {
    refs.ulEl.innerHTML = '';
    refs.divEl.innerHTML = '';
  }
};

//ul

const createListItem = item =>
  `<li class="country-item"><img src=${item.flags.svg} width="20" height="20"><p>${item.name}</p></li>`;

const generateListContent = array =>
  array ? array.reduce((acc, item) => acc + createListItem(item), '') : '';

const insertContentInUl = array => {
  refs.divEl.innerHTML = '';
  refs.ulEl.insertAdjacentHTML('beforeend', generateListContent(array));
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//div

const createDivContent = ({ name, capital, population, languages, flags }) => {
  const currentLanguages = languages.map(item => item.name).join(',');
  return `<span><img src=${flags.svg} width="20" height="20"> </span><p>${name}</p><p>Capital: ${capital}</p><p> Population: ${population}</p><p>Languages: ${currentLanguages}</p>`;
};

const insertContentInDiv = item => {
  refs.ulEl.innerHTML = '';
  refs.divEl.insertAdjacentHTML('beforeend', createDivContent(item));
};

refs.inputel.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
