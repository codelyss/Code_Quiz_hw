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

function SelectQuiz(quizName){
    //changes the dropdown value (text) to the selected quiz
    ddlquiz.innerHTML = quizName;
}



// write out function
SaveScore()
ShowMainContainer()
