document.addEventListener('DOMContentLoaded', () => {
  const questionElement = document.getElementById('question');
  const answerButtonsElement = document.querySelectorAll('.btn');
  const nextButton = document.getElementById('next-btn');
  const skipButton = document.getElementById('skip-btn');

  let currentQuestionIndex = 0;
  let questions = [];
  let score = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let skippedQuestions = 0;

  // Fetch questions from the API
  async function fetchQuestions() {
      const apiUrl = 'https://quizapi.io/api/v1/questions?apiKey=fqynSUxn60Q2j4CE3PHstpKXGdiYVg4mPJyj8KhP&difficulty=Easy&limit=20&tags=JavaScript';
      try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          questions = data;
          showQuestion(questions[currentQuestionIndex]);
      } catch (error) {
          console.error('Error fetching questions:', error);
      }
  }

  // Show a question and its answers
  function showQuestion(question) {
      questionElement.textContent = question.question;
      const answers = Object.values(question.answers).filter(answer => answer !== null);

      answerButtonsElement.forEach((button, index) => {
          if (answers[index]) {
              button.textContent = answers[index];
              button.style.display = 'block';
              button.addEventListener('click', selectAnswer);
          } else {
              button.style.display = 'none';
          }
      });
  }

  // Handle answer selection
  function selectAnswer(e) {
      const selectedButton = e.target;
      const selectedAnswer = selectedButton.textContent;
      const correctAnswerIndex = Object.values(questions[currentQuestionIndex].correct_answers)
          .findIndex(answer => answer === "true");
      const correctAnswer = Object.values(questions[currentQuestionIndex].answers)[correctAnswerIndex];

      if (selectedAnswer === correctAnswer) {
          selectedButton.classList.add('correct');
          score++;
          correctAnswers++;
      } else {
          selectedButton.classList.add('wrong');
          incorrectAnswers++;
      }

      Array.from(answerButtonsElement).forEach(button => {
          button.removeEventListener('click', selectAnswer);
          if (button.textContent === correctAnswer) {
              button.classList.add('correct');
          }
      });

      nextButton.style.display = 'block';
      skipButton.style.display = 'none';
  }

  // Handle the next button click
  nextButton.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
          resetState();
          showQuestion(questions[currentQuestionIndex]);
      } else {
          // If no more questions, handle the end of the quiz
          showResult();
      }
  });

  // Handle the skip button click
  skipButton.addEventListener('click', () => {
      skippedQuestions++;
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
          resetState();
          showQuestion(questions[currentQuestionIndex]);
      } else {
          // If no more questions, handle the end of the quiz
          showResult();
      }
  });

  // Reset the state for the next question
  function resetState() {
      nextButton.style.display = 'none';
      skipButton.style.display = 'block';
      answerButtonsElement.forEach(button => {
          button.classList.remove('correct');
          button.classList.remove('wrong');
      });
  }

  // Show the final result
  function showResult() {
      questionElement.innerHTML = `
          Quiz Completed!<br>
          Your score: ${score} out of ${questions.length}<br>
          Correct answers: ${correctAnswers}<br>
          Incorrect answers: ${incorrectAnswers}<br>
          Skipped questions: ${skippedQuestions}
      `;
      nextButton.style.display = 'none';
      skipButton.style.display = 'none';
      answerButtonsElement.forEach(button => {
          button.style.display = 'none';
      });
  }

  // Start the quiz by fetching the questions
  fetchQuestions();
});
