// New Quiz App

let area = document.querySelector(".area");

let countSpan = document.querySelector(".q-count span");
let bullets = document.querySelector(".bullets");
let bulletsSpans = document.querySelector(".bullets .spans");

let questionTitle = document.querySelector(".area .question");
let answersArea = document.querySelector(".answers");

let submitBtn = document.querySelector(".btn");
let countdown = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;

      createBullets(questionCount);

      addData(questionObject[currentIndex], questionCount);

      countdownFunc(5, questionCount);

      submitBtn.addEventListener("click", () => {
        let rightAnswer = questionObject[currentIndex].right_answer;
        checkAnswers(rightAnswer, questionCount);
        currentIndex++;

        clearInterval(countdownInterval)
        countdownFunc(3, questionCount);

        if (currentIndex < questionCount) {
          addData(questionObject[currentIndex], questionCount);
          handelBullet();
        } else {
          showResults(questionCount);
        }
      });
    }
  };

  myRequest.open("GET", "htmlQuestions.json", true);
  myRequest.send();
}

getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    i === 0 ? (bullet.className = "active") : (bullet.className = "");
    bulletsSpans.appendChild(bullet);
  }
}

function addData(obj, count) {
  questionTitle.innerHTML = obj.title;

  answersArea.innerHTML = ""; // Clear previous answers

  for (let i = 1; i <= 4; i++) {
    let divAnswer = document.createElement("div");
    divAnswer.className = "the-answer";

    i === 1
      ? divAnswer.classList.add("active")
      : divAnswer.classList.remove("active");

    let icon = document.createElement("i");
    icon.className = "fa-regular fa-square-check";

    let spanAnswer = document.createElement("span");
    spanAnswer.className = "answer";
    spanAnswer.innerHTML = obj[`answer_${i}`];

    divAnswer.appendChild(icon);
    divAnswer.appendChild(spanAnswer);

    answersArea.appendChild(divAnswer);
  }

  let answerSpans = document.querySelectorAll(".answers .the-answer");

  chooseAnswer(answerSpans);
}

function chooseAnswer(answerSpans) {
  answerSpans.forEach((answer) => {
    answer.addEventListener("click", () => {
      removeActive(answerSpans);
      answer.classList.add("active");
    });
  });
}

function removeActive(answerSpans) {
  answerSpans.forEach((answer) => {
    answer.classList.remove("active");
  });
}

function checkAnswers(rAnswer, len) {
  let answerSpans = document.querySelectorAll(".answers .the-answer");
  answerSpans.forEach((answer) => {
    if (answer.classList.contains("active")) {
      if (answer.querySelector(".answer").innerHTML === rAnswer) {
        rightAnswers++;
      }
    }
  });
}

function handelBullet() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let bulletsSpansArray = Array.from(bulletsSpans);
  bulletsSpansArray.forEach((bullet, index) => {
    if (currentIndex === index) {
      bullet.className = "active";
    }
  });
}

function showResults(questionCount) {
  questionTitle.remove();
  answersArea.remove();
  submitBtn.remove();
  bullets.remove();

  let resultDiv = document.createElement("div");
  resultDiv.className = "result";

  let adjResult = document.createElement("div");

  if (rightAnswers < questionCount / 2) {
    adjResult.className = "bad";
    adjResult.innerHTML = `<span>Bad,</span>${rightAnswers} From ${questionCount} Is Right`;
  } else if (rightAnswers <= questionCount - 1) {
    adjResult.className = "good";
    adjResult.innerHTML = `<span>Good,</span>${rightAnswers} From ${questionCount} Is Right`;
  } else {
    adjResult.className = "perfect";
    adjResult.innerHTML = `<span>Perfect,</span>${rightAnswers} From ${questionCount} Is Right`;
  }

  resultDiv.appendChild(adjResult);
  area.appendChild(resultDiv);

  let playAgainBtn = document.createElement("div");
  playAgainBtn.className = "again";
  playAgainBtn.innerHTML = "Play Again";

  area.appendChild(playAgainBtn);
  PlayAgain(playAgainBtn);
}

function PlayAgain(playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    location.reload();
  });
}

function countdownFunc(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      seconds = parseInt(duration % 60);
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdown.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
