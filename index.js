// scripts.js

const createQuizSection = document.getElementById('create-quiz-section');
const takeQuizSection = document.getElementById('take-quiz-section');
const createQuizBtn = document.getElementById('create-quiz-btn');
const takeQuizBtn = document.getElementById('take-quiz-btn');
const addQuestionBtn = document.getElementById('add-question-btn');
const createQuizForm = document.getElementById('create-quiz-form');
const takeQuizForm = document.getElementById('take-quiz-form');
const questionsContainer = document.getElementById('questions-container');
const selectQuiz = document.getElementById('select-quiz');
const quizContent = document.getElementById('quiz-content');

let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

// Render quizzes in the dropdown
function renderQuizzes() {
    selectQuiz.innerHTML = '';
    quizzes.forEach((quiz, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = quiz.title;
        selectQuiz.appendChild(option);
    });
}

// Render questions for a selected quiz
function renderQuestions(questions) {
    quizContent.innerHTML = '';
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${question.question}</p>
            ${question.answers.map((answer, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${i}">
                    ${answer}
                </label>
            `).join('')}
        `;
        quizContent.appendChild(questionDiv);
    });
}

// Handle quiz creation and saving
function handleCreateQuiz(event) {
    event.preventDefault();
    const title = document.getElementById('quiz-title').value;
    const questions = [];
    document.querySelectorAll('.question').forEach(questionDiv => {
        const questionText = questionDiv.querySelector('input[type="text"]').value;
        const answers = [];
        let correctAnswer = null;
        questionDiv.querySelectorAll('label').forEach((label, i) => {
            const input = label.querySelector('input');
            answers.push(label.textContent.trim().replace(/^\d+/, '')); // Remove the number from the text
            if (input.checked) {
                correctAnswer = i;
            }
        });
        questions.push({ question: questionText, answers, correctAnswer });
    });
    quizzes.push({ title, questions });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    alert('Quiz saved!');
    createQuizForm.reset();
    questionsContainer.innerHTML = '';
    renderQuizzes();
}

// Handle quiz taking and scoring
function handleTakeQuiz(event) {
    event.preventDefault();
    const quizIndex = selectQuiz.value;
    const quiz = quizzes[quizIndex];
    renderQuestions(quiz.questions);
    quizContent.innerHTML += '<button id="submit-quiz-btn">Submit Quiz</button>';
    document.getElementById('submit-quiz-btn').addEventListener('click', () => {
        let score = 0;
        quiz.questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedAnswer && parseInt(selectedAnswer.value) === question.correctAnswer) {
                score++;
            }
        });
        alert(`Your score is ${score} out of ${quiz.questions.length}`);
    });
}

// Show create quiz section
createQuizBtn.addEventListener('click', () => {
    createQuizSection.style.display = 'block';
    takeQuizSection.style.display = 'none';
});

// Show take quiz section
takeQuizBtn.addEventListener('click', () => {
    createQuizSection.style.display = 'none';
    takeQuizSection.style.display = 'block';
    renderQuizzes();
});

// Add a new question to the form
addQuestionBtn.addEventListener('click', () => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
        <input type="text" placeholder="Question" required>
        <label>
            <input type="radio" name="answer" value="0">
            Answer 1
        </label>
        <label>
            <input type="radio" name="answer" value="1">
            Answer 2
        </label>
        <label>
            <input type="radio" name="answer" value="2">
            Answer 3
        </label>
        <label>
            <input type="radio" name="answer" value="3">
            Answer 4
        </label>
    `;
    questionsContainer.appendChild(questionDiv);
});

// Event listeners for form submissions
createQuizForm.addEventListener('submit', handleCreateQuiz);
takeQuizForm.addEventListener('submit', handleTakeQuiz);

// Initial render of quizzes
renderQuizzes();
