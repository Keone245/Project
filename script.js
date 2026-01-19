(function(){

function buildQuiz() {
    const output = [];

    myQuestions.forEach((currentQuestion, questionNumber) => {
        const answers = [];
        for (let letter in currentQuestion.answers) {
            answers.push(
                `<label>
                    <input type="radio" name="question${questionNumber}" value="${letter}">
                    ${letter} : ${currentQuestion.answers[letter]}
                </label>`
            );
        }
        output.push(
            `<div class="slide">
                <div class="question">${currentQuestion.question}</div>
                <div class="answers">${answers.join('')}</div>
            </div>`
        );
    });

    quizContainer.innerHTML = output.join('');
}

function showResults() {
    const answerContainers = quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;
    myQuestions.forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
    const selector = `input[name="question${questionNumber}"]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;


        if (userAnswer === currentQuestion.correctAnswer) {
            numCorrect++;
            answerContainers[questionNumber].style.color = 'green';
        } else {
            answerContainers[questionNumber].style.color = 'red';
        }
    });

    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}

    function showSlide(n) {
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
        if (currentSlide === 0) {
            previousButton.style.display = 'none';
        } else {
            previousButton.style.display = 'inline-block';
        }
        if (currentSlide === slides.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
        }
    }

    function showNextSlide() {
        showSlide(currentSlide + 1);
    }

    function showPreviousSlide() {
        showSlide(currentSlide - 1);
    }
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const myQuestions = [
    {
        question: "When was Real Madrid formed?",
        answers: {
            a: "1902",
            b: "1897",
            c: "1900",
            d: "1905"
        },
        correctAnswer: "c"
    },
    {
        question: "Which person has 15 goals and assists as of right now?",
        answers: {
            a: "Mbappe",
            b: "Vini Jr",
            c: "Bellingham",
            d: "RealMadrid"
        },
        correctAnswer: "c"
    },
     {
        question: "What name is Real Madrid also known as?",
        answers: {
            a: "Los blancos",
            b: "Los mintos",
            c: "Los centos",
            d: "Los bantos"
        },
        correctAnswer: "a"
    }
];

buildQuiz();

const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

showSlide(currentSlide);

previousButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);
submitButton.addEventListener('click', showResults);
})();

let fans = JSON.parse(localStorage.getItem("fans")) || [];


document.getElementById("loginForm")?.addEventListener("submit", login);

function login(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  if (!name) return;

  localStorage.setItem("currentFan", name);
  window.location.href = "register.html";
}


function requireLogin() {
  if (!localStorage.getItem("currentFan")) {
    alert("Please log in first.");
    window.location.href = "index.html";
  }
}


function logout() {
  localStorage.removeItem("currentFan");
  alert("Logged out.");
  window.location.href = "index.html";
}


function showUser() {
  const user = localStorage.getItem("currentFan");
  if (user && document.getElementById("welcome")) {
    document.getElementById("welcome").textContent =
      "Welcome, " + user + "!";
  }
}


document.getElementById("fanForm")?.addEventListener("submit", saveFan);

function saveFan(e) {
  e.preventDefault();

  const currentFan = localStorage.getItem("currentFan");

  const exists = fans.some(fan => fan.name === currentFan);
  if (exists) {
    alert("You are already registered.");
    return;
  }

  const fan = {
    name: currentFan,
    player: document.getElementById("player").value,
    competition: document.querySelector('input[name="comp"]:checked').value,
    since: parseInt(document.getElementById("since").value)
  };

  fans.push(fan);
  localStorage.setItem("fans", JSON.stringify(fans));

  alert("Registration successful!");
}


function mostCommon(key) {
  const count = {};
  fans.forEach(f => count[f[key]] = (count[f[key]] || 0) + 1);

  let max = 0, result = "N/A";
  for (let item in count) {
    if (count[item] > max) {
      max = count[item];
      result = item;
    }
  }
  return result;
}

function checkRegistration() {
  const currentFan = localStorage.getItem("currentFan");
  const isRegistered = fans.some(fan => fan.name === currentFan);


  if (!isRegistered && location.pathname.includes("stats.html")) {
    alert("Please register first.");
    window.location.href = "register.html";
  }


  if (!isRegistered && location.pathname.includes("leaderboard.html")) {
    alert("Please register first.");
    window.location.href = "register.html";
  }

  
  if (!isRegistered) {
    disableLink("nav-stats");
    disableLink("nav-leaderboard");
  }
}

function disableLink(id) {
  const link = document.getElementById(id);
  if (link) {
    link.style.pointerEvents = "none";
    link.style.opacity = "0.4";
  }
}