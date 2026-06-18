import GetBacon from './utils';
import initTimer from './timer';

const baconEl = document.querySelector('.bacon');

GetBacon()
  .then((res) => {
    const markup = res.reduce((acc, val) => (`<p>${val}</p>`), '');
    baconEl.innerHTML = markup;
  })
  .catch((err) => {
    baconEl.innerHTML = err;
  });

document.querySelectorAll('.timer').forEach(timer => initTimer(timer));
