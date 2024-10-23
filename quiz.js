const username = localStorage.getItem('username')
if(username){
    document.getElementById('welcome-message').innerText =`welcome - 👤${username}`
}

let url ="https://the-trivia-api.com/v2/questions"

let data=[];
let currentQuestionIndex=0;

async function getQuestions() {
    try{
        let response = await fetch(url);
        data = await response.json();
        
        displayQuestion(currentQuestionIndex);
        

    }catch(err){
        console.log("error is ",err);

    }
    
}
let selectedAnswers = [];
function displayQuestion(index){
    let questionObject = data[index];
    let quizContainer = document.getElementById('quiz-container')
     quizContainer.innerHTML = '';

    let question =  document.createElement('div')
    question.classList.add('question')

    question.innerHTML =`<h3> Question ${index+1}: ${questionObject.question.text}</h3>`

    //question khatam options suru 
    let optionObject = document.createElement('div')
    optionObject.classList.add('options')

    let options = [...questionObject.incorrectAnswers]
    options.push(questionObject.correctAnswer);
    options=shuffle(options);

    options.forEach(option=>{
        let optionButton = document.createElement('button')
        optionButton.innerText= option;
        optionButton.classList.add('button')
      

        optionButton.addEventListener('click',()=>{
            selectedAnswers[index] = option; 
            const allButtons =optionObject.querySelectorAll('button')
            allButtons.forEach(btn=>btn.disabled=true);

            if(option===questionObject.correctAnswer){
                optionButton.style.backgroundColor='#90EE90'
            }else{
                optionButton.style.backgroundColor='#FFCCCB'
                allButtons.forEach(btn=>{
                    if(btn.innerText===questionObject.correctAnswer){
                        btn.style.backgroundColor='#90EE90'
                    }
                })
            }
            createNavigationPanel();

        })
        if (selectedAnswers[index] === 'marked') {
            optionButton.disabled = false;
             
        } else if (selectedAnswers[index] !== undefined) {
          
            if (selectedAnswers[index] === option) {
                optionButton.style.backgroundColor = '#90EE90'; 
                optionButton.disabled = true; 
            } else {
                optionButton.style.backgroundColor = '#FFCCCB'; 
                optionButton.disabled = true; 
            }
        }
            optionObject.appendChild(optionButton)

        })


        question.appendChild(optionObject)
        quizContainer.appendChild(question)
        createNavigationPanel();


}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function nextButton(){
    if(currentQuestionIndex<data.length-1){
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex)
        }
}

function prevButton(){
    if(currentQuestionIndex>0){
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
}


function createNavigationPanel(){
    const navigationPanel = document.getElementById('navigation-panel')
    navigationPanel.innerHTML =''

    data.forEach((_,index)=>{
        let navigationButton = document.createElement('button')
        navigationButton.innerText =`${index+1}`
        navigationButton.classList.add('nav-button')
    
        updateNavigationButton(navigationButton,index);

    
        navigationButton.addEventListener('click',()=>{
            currentQuestionIndex=index
            displayQuestion(currentQuestionIndex);
            updateNavigationButton(navigationButton,index);

        })
        navigationPanel.appendChild(navigationButton)
    })
}

function updateNavigationButton(navigationButton, index) {
    
    if (selectedAnswers[index] === 'marked') {
        navigationButton.style.backgroundColor = '#FFFF00'; 
    } else if (selectedAnswers[index] === data[index].correctAnswer) {
        navigationButton.style.backgroundColor = '#90EE90'; 
    } else if (selectedAnswers[index] !== undefined) {
        navigationButton.style.backgroundColor = '#FFCCCB'; 
    } else {
        navigationButton.style.backgroundColor = '';
    }
}




function markforReview() {
    if (selectedAnswers[currentQuestionIndex] !== undefined && selectedAnswers[currentQuestionIndex] !== 'marked') {
        alert("You cannot mark this question for review as it has already  answered.");
        return;
    }
    
    if (selectedAnswers[currentQuestionIndex] === 'marked') {
       return;
    } else {
        
        selectedAnswers[currentQuestionIndex] = 'marked';
    }

   
    createNavigationPanel();
    
    
    let allButtons = document.querySelectorAll('.nav-button');
    let currentButton = allButtons[currentQuestionIndex];
    updateNavigationButton(currentButton, currentQuestionIndex);
}


document.getElementById('next-button').addEventListener('click', nextButton);
document.getElementById('prev-button').addEventListener('click', prevButton);
document.getElementById('marked-button').addEventListener('click',markforReview);

//timer

let timerDuration =5*60 ;
let timerDisplay = document.getElementById('timer-display')
let timerReturn ;

function startTimer(){
    timerReturn =setInterval(function(){
        let minutes =Math.floor(timerDuration/60)
        let seconds = timerDuration%60;

        timerDisplay.innerText =`${minutes}:${seconds}`
        timerDuration--;
        if(timerDuration<=0){
            clearInterval(timerReturn);
            endQuiz();
        }
       
    },1000)
}

 
let score = 0 ;
function endQuiz(){
    clearInterval(timerReturn);
    const allButtons = document.querySelectorAll('.option button ');
    allButtons.forEach(btn=>btn.disabled=true);
    document.getElementById('next-button').disabled = true;
    document.getElementById('prev-button').disabled = true;
    document.getElementById('submit-button').disabled = true;

   selectedAnswers.forEach((answer,index)=>{
        if(answer===data[index].correctAnswer){
            score = score+4
        }else if(answer!==undefined){
            score =score-1;

        }
   })
   alert(`your final score is :${score}`)
   createNavigationPanel();


}
document.getElementById('submit-button').addEventListener('click', endQuiz);

function resetTimer(){
    clearInterval(timerReturn)
    timerReturn =null ;
    timerDuration=5*60;
    
   document.getElementById('timer-display').innerText ='5:00'


}
function restart(){
    currentQuestionIndex=0;
    selectedAnswers=[];
    score =0;
    document.getElementById('quiz-container').innerHTML='';
    document.getElementById('prev-button').disabled = false;
    document.getElementById('next-button').disabled = false;
    document.getElementById('submit-button').disabled = false;

    resetTimer();
    startTimer();
    getQuestions();

}
document.getElementById('restart-button').addEventListener('click', restart);
startTimer();
getQuestions();

