const question = document.querySelector('.question');
const allAnsArr = document.querySelectorAll('.answer');
const questionContainer = document.querySelector('.question-container');
const btnContainer = document.querySelector('.btn-container');

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle
  while (currentIndex != 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function clearAll() {
  const list = ['red', 'green', 'clicked'];
  question.innerHTML = '';
  allAnsArr.forEach((el) => {
    el.classList.remove(...list);
    el.innerHTML = '';
  });
}

function decodeHTML(html) {
  let txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function addLoading() {
  question.classList.add('loading');
}

function removeLoading() {
  question.classList.remove('loading');
}

btnContainer.addEventListener('click', function (e) {
  addLoading();
  let categoryNum = e.target.dataset.category;
  fetch(`https://opentdb.com/api.php?amount=1&category=${categoryNum}`)
    .then((res) => res.json())
    .then((data) => {
      let iAnswers = data.results[0].incorrect_answers;
      let rAnswer = Array.from(data.results[0].correct_answer).join('');
      //decode from HTML otherwise responses with special characters may result in all incorrect upon user clicking despite there being a right answer.
      const decodedAnswer = decodeHTML(rAnswer);
      let all = iAnswers.concat(decodedAnswer);
      let shuffled = shuffle(all);

      //get question from API call.
      removeLoading();
      question.innerHTML = data.results[0].question;

      //Populate answer slots with our shuffled array.
      allAnsArr.forEach((e, i) => {
        e.innerHTML = shuffled[i];
        e.style.border = '1px solid black';
        e.style.boxShadow = '2px 2px 3px black';
        if (e.innerHTML === 'undefined') {
          e.innerHTML = ' ';
          e.style.border = 'none';
          e.style.boxShadow = 'none';
        }
      });

      questionContainer.addEventListener('click', function (e) {
        //find right answer within array
        const right = shuffled.find((el) => el === decodedAnswer);

        //Leave first remove red otherwise upon reset they will all go red.
        allAnsArr.forEach((el) => {
          if (el.innerHTML === ' ') {
            el.style.border = 'none';
            el.style.boxShadow = 'none';
          } else if (el.innerHTML === right) {
            el.classList.remove('red');
            el.classList.add('green');
          } else {
            el.classList.add('red');
          }
        });
        e.target.classList.add('clicked');
      });
    });
  clearAll();
});

//if you want to change/add categories, check the API documentation -> https://opentdb.com/api_config.php
//Get category number from the documentation and replace in the HTML file <button data-category='${your chosen cat here}'>...</button>
//If you want to add a category just do the same as prev step but create a new button.

//There's also an intentional bug. If you click the question when an asnwer is displayed it will show you the right answer! Easy fix.
