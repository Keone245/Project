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