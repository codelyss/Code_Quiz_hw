var ddlquiz = document.getElementById('ddlQuiz');
var lblquestion = document.getElementById('lblQuestion');
var lblResult = document.getElementById('lblResult');
var timerdisplay = document.getElementById('timerdisplay');

var txtScore = document.getElementById('txtScore');
var txtUserName = document.getElementById('txtUserName');
var txtHighScores = document.getElementById('txtHighScores');

var btn1 = document.getElementById('btnAnswer1');
var btn2 = document.getElementById('btnAnswer2');
var btn3 = document.getElementById('btnAnswer3');
var btn4 = document.getElementById('btnAnswer4');

var quizContainer = document.getElementById('quizContainer');
var mainContainer = document.getElementById('mainContainer');
var endContainer = document.getElementById('endContainer');
var scoresContainer = document.getElementById('scoresContainer');

var correctAnswer = ""; //stores correct answer for current question
var score = 0; //stores current score
var currentQuestionIndex = 0; //keeps track of which question is currently being answered
var questions; //stores currently selected set of questions
var timeRemaining = 0; //stores remaining time to answer all questions in seconds
var timeQuestionStart = 0; //stores time value at the moment when the question starts. used later to see how long it took the user to answer the question
var timer = 0; //stores interval ID which is later used to stop the timer once the game ends

function StartQuiz() {
    timeRemaining = 75; //set the initial time 
    score = 0; //reset score. in case user plays multiple quizes

    //show the quiz container and hide the main container
    DisplayContainer(quizContainer);

    var quiz = ddlquiz.innerHTML;
    
    //setting the questions variable based on dropdown value
    //these variables are steeored in their respective files
    switch (quiz) {
        case "HTML Quiz":
            questions = htmlquestions;
            break;
        case "JavaScript Quiz":
            questions = jsquestions;
            break;
        case "CSS Quiz":
            questions = cssquestions;
            break;  
        default:
            questions = htmlquestions;
    }

    TimerTick(); //needs to be called once because setInterval initially waits the interval amount before calling the function
    timer = setInterval(TimerTick, 1000); //setting the timer interval to call Timer function every second
    currentQuestionIndex = 0;
    ShowCurrentQuestion();
}

function ShowCurrentQuestion() {
    //this function grabs the title, choices, and answers for the current question from questions variable and displays them on the page
    var title = questions[currentQuestionIndex].title;
    var choices = questions[currentQuestionIndex].choices;
    correctAnswer = questions[currentQuestionIndex].answer;

    PopulateQuestion(title, choices);
    timeQuestionStart = timeRemaining; //storing timer value at this time so it can be used later to see how long it took the user to answer the question
}


function SelectQuiz(quizName){
    //changes the dropdown value (text) to the selected quiz
    ddlquiz.innerHTML = quizName;
}

function PopulateQuestion(title, choices) {
    //sets the question label, and choices to button text
    lblquestion.innerHTML = title;

    var btns = [btn1, btn2, btn3, btn4];
    for (var i = 0; i <= 3; i++) {
        btns[i].blur(); //opposite of focus
        btns[i].value = choices[i];
    }
}

function AnswerQuestion(thisAnswer) {
    if (thisAnswer == correctAnswer){
        //user answered correctly
        PlayCorrectAnswerSound();
        UpdateScore();
    }
    else {
        //incorrect answer. subtracting time remaining by 5 seconds and showing it immediately
        PlayWrongAnswerSound();
        timeRemaining -= 5
        DisplayTime();
    }
    //updating question index
    currentQuestionIndex++;

    //check if user reached the end of questions
    if (currentQuestionIndex == questions.length){
        CompleteQuiz(false);
        return;
    }

    ShowCurrentQuestion();
}

function UpdateScore() {
    //calculating how much time the user took to answer current question
    var numToIncrease = 0;
    var timeToAnswer = Math.abs(timeQuestionStart - timeRemaining);
    switch (true){
        case (timeToAnswer <= 5):
            //if user took less or equal to 5 seconds, score will be increased by 3
            numToIncrease = 3;
            break;
        case (timeToAnswer <= 10):
            //if user took less or equal to 10 seconds, score will be increased by 2
            numToIncrease = 2;
            break;
        default:
            //user took longer than 10 seconds, increasing score by 1
            numToIncrease = 1;
    }
    score += numToIncrease;
}

function TimerTick() {
    //this function runs every 1 second
    DisplayTime();
    if (timeRemaining <= 0) {
        //time ran out. completing the quiz
        CompleteQuiz(true);
        return;
    }
    //subtracting timeremaining by 1 second on each tick
    timeRemaining--;
}

function CompleteQuiz(outOfTime) {
    //stopping the timer
    clearInterval(timer);

    //if this function was called by the timer tick that determined it was out of time, 
    //user will see the appropriate message. otherwise they will see a message that they completed the quiz
    if (outOfTime) {
        lblResult.innerHTML = "You ran out of time.";
    }
    else {
        lblResult.innerHTML = "You've completed the quiz!";
    }

    //showing end container and hiding quiz container
    DisplayContainer(endContainer);

    //displaying final score
    txtScore.innerHTML = "Your Score: " + score;
}

function DisplayTime() {
    //displays current time on the page
    timerdisplay.innerHTML = "Remaining time: " + timeRemaining;
}

function SaveScore() {
    //saving player score in the following format:
    //user_name:score;
    var playerscore = txtUserName.value + ":" + score + ";";
    if (localStorage.rankings == null){
        //no rankings saved yet, setting initial value
        localStorage.setItem("rankings", playerscore);
    }
    else {
        //rankings already saved in localstorage. appending current score to existing localstorage
        var rankings = localStorage.getItem("rankings");
        localStorage.setItem("rankings", rankings + playerscore);
    }
    ShowMainContainer();
}

function ShowMainContainer() {
    DisplayContainer(mainContainer);
}

function DisplayContainer(container) {
    //loops through all containers and shows the one that is sent as the parameter, and hides all the other ones
    var containers = [mainContainer, quizContainer, scoresContainer, endContainer];
    containers.forEach(function(cont){
        if (container === cont){
            cont.style.display = "block";
        }
        else{
            cont.style.display = "none";
        }
    });
}

function PlayCorrectAnswerSound() {
    //plays correct answer sound
    var sound = document.getElementById("positivesound");
    sound.play();
}

function PlayWrongAnswerSound() {
    //plays wrong answer sound
    var sound = document.getElementById("negativesound");
    sound.play();
}

function ShowScores() {
    //showing score container and hiding main container
    DisplayContainer(scoresContainer);

    //checking to see if rankings variable exists in localstorage
    if (localStorage.rankings != null){
        var scores = localStorage.getItem("rankings");
        //retrieving the rankings variable from local storage and parsing it
        //scores are stored in the following format:
        //user_name1:score1;user_name2:score2; (...)
        var vals = scores.split(";");
        var txt = "";
        vals.forEach(function(scr) {
            //looping through each user/score combination, and checking to make sure it has a value
            if (scr) {
                //splitting the user_name and score
                var thisval = scr.split(":");
                var uname = thisval[0];
                var num = thisval[1];
                //appending each value of user_name and score to txt variable
                txt += uname + ": " + num;
                txt += "<br>";
            }
            
        });
        //displaying all scores on the page.
        txtHighScores.innerHTML = txt;
    }
    else {
        txtHighScores.innerHTML = "No scores found.";
    }
}



