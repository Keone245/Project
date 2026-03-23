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

function showResults(){
    const answerContainers = quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;
  
    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answerContainer = answerContainers[questionNumber];
  
      // clear previous markers
      answerContainer.classList.remove('correct','incorrect');
      answerContainer.querySelectorAll('.user-wrong, .correct-label').forEach(el => el.classList.remove('user-wrong','correct-label'));
      const prevNote = answerContainer.querySelector('.correct-answer');
      if(prevNote) prevNote.remove();
  
      const selector = `input[name=question${questionNumber}]:checked`;
      const userInput = answerContainer.querySelector(selector);
      const userAnswer = userInput ? userInput.value : undefined;
  
      if(userAnswer === currentQuestion.correctAnswer){
        numCorrect++;
        answerContainer.classList.add('correct');
        // mark the correct label too for clarity
        const correctInput = answerContainer.querySelector(`input[name=question${questionNumber}][value="${currentQuestion.correctAnswer}"]`);
        if(correctInput){
          const correctLabel = correctInput.closest('label') || document.querySelector(`label[for="${correctInput.id}"]`);
          if(correctLabel) correctLabel.classList.add('correct-label');
        }
      } else {
        answerContainer.classList.add('incorrect');
  
        // mark user's wrong selection
        if(userInput){
          const userLabel = userInput.closest('label') || document.querySelector(`label[for="${userInput.id}"]`);
          if(userLabel) userLabel.classList.add('user-wrong');
        }
  
        // find correct option text and mark it
        const correctInput = answerContainer.querySelector(`input[name=question${questionNumber}][value="${currentQuestion.correctAnswer}"]`);
        let correctText = currentQuestion.correctAnswer;
        if(correctInput){
          const correctLabel = correctInput.closest('label') || document.querySelector(`label[for="${correctInput.id}"]`);
          if(correctLabel){
            correctLabel.classList.add('correct-label');
            correctText = correctLabel.textContent.trim();
          } else if(currentQuestion.answers){
            correctText = currentQuestion.answers[currentQuestion.correctAnswer];
          }
        } else if(currentQuestion.answers){
          correctText = currentQuestion.answers[currentQuestion.correctAnswer];
        }
  
        const note = document.createElement('div');
        note.className = 'correct-answer';
        note.textContent = `Correct answer: ${correctText}`;
        answerContainer.appendChild(note);
      }
  
      // disable inputs to lock the quiz after submission
      answerContainer.querySelectorAll('input').forEach(i => i.disabled = true);
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
        correctAnswer: "a"
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
            a: "Los Blancos",
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

