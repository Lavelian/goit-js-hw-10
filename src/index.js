import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputel: document.querySelector('#search-box'),
  ulEl: document.querySelectorAll('.country-list'),
  divEl: document.querySelectorAll('.country-info'),
};

function onInput(e) {
  fetchCountries(e.target.value.trim())
    .then(r => r.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
}

refs.inputel.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));