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
    .then(data => {
      // Data handling
      checkLengthInData(data);
    })
    .catch(error => {
      // Error handling
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
      resetElement();
    });
}

const checkLengthInData = data => {
  if (data.length === 1) {
    insertContentInDiv(...data);
  } else if (data.length >= 2 && data.length <= 10) {
    insertContentInUl(data);
  } else {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
};

/////
//ul

const createListItem = item =>
  `<li class="country-item"><img src=${item.flags.svg} width="20" height="20"><p>${item.name}</p></li>`;

const generateListContent = array =>
  array ? array.reduce((acc, item) => acc + createListItem(item), '') : '';

const insertContentInUl = array => {
  resetElement();
  refs.ulEl.insertAdjacentHTML('beforeend', generateListContent(array));
};

/////
//div

const createDivContent = ({ name, capital, population, languages, flags }) => {
  const currentLanguages = languages.map(item => item.name).join(',');
  return `<span><img src=${flags.svg} width="20" height="20"> </span><p>${name}</p><p>Capital: ${capital}</p><p> Population: ${population}</p><p>Languages: ${currentLanguages}</p>`;
};

const insertContentInDiv = item => {
  resetElement();
  refs.divEl.insertAdjacentHTML('beforeend', createDivContent(item));
};

const resetElement = () => {
  refs.ulEl.innerHTML = '';
  refs.divEl.innerHTML = '';
};

refs.inputel.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
