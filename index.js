const keyboard = document.querySelector("[data-keyboard]")
import myJson from './wordList.json' assert {type: 'json'}

import lawTerms from './lawTermsENG.json' assert {type: 'json'}
var LINE_LENGTH = 9

var charLineLength = 50
let numberOfParLines 
let keyNum
let sentenceArray 
let sentenceArrayNext
let sentenceArrayNextNext
let duration
let letterDoneCount
let letterDoneCountTotal
let wordCountDoneTotal
let letterMissedCountTotal
let letterDoneCountData
let letterMissedCountData
let letterMissedCount
let wordCountDone
let drawerOpen 
const includeLawTermsCheckBox = document.getElementById('includeLawTermsCheckbox');

let includeLawTerms
let includeFingerAssistance
const includeFingerAssistanceCheckBox = document.getElementById('includeFingerAssistanceCheckBox');
let typeData = []

let n = 0
let gameOn 
let countDowndId

var parent = document.getElementById("sentencesList")
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function setCookie(cname,cvalue,exp){
    const d = new Date();
    d.setTime(d.getTime() + (exp*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


function startLoop(){
    try{
        includeFingerAssistance = (getCookie("includeFingerAssistance") === 'true');
        includeFingerAssistanceCheckBox.checked = includeFingerAssistance      
    } catch{}
    try{
        includeLawTerms = (getCookie("includeLawTerms") === 'true');
        includeLawTermsCheckBox.checked = includeLawTerms      
    } catch{}

    
    
    document.body.addEventListener("click",handleOutsideClickDrawer)
    gameOn = false
    document.getElementById("startBtn").addEventListener("click",function(){inititate(true)})
    document.getElementById("stopBtn").addEventListener("click",stopInteraction)
    document.getElementById("openDrawer").addEventListener("click",toggleDrawer)
    document.getElementById("closeDrawer").addEventListener("click",toggleDrawer)
    document.getElementById("langEnglish").addEventListener("click",function(){toggleLanguage('langEnglish')})
    document.getElementById("langSwedish").addEventListener("click",function(){toggleLanguage('langSwedish')})
   
    document.getElementById("settingsBar").style.width = `${document.getElementById("keyboard").offsetWidth}px`
    drawerOpen = false
    toggleDrawer()
    let f = document.getElementsByClassName("timings")[0].children
    
    for (let i = 0;i<f.length;i++){
        f[i].addEventListener("click",function(){changeDuration(f[i])})
    }
    
    
    
    duration = f[0].innerHTML
    document.getElementById("duration").innerHTML = ""
    includeFingerAssistanceCheckBox.addEventListener('change', function() {
        if (this.checked) {
            includeFingerAssistance = true
            setCookie("includeFingerAssistance","true",3)
            
        } else {
            includeFingerAssistance = false
            setCookie("includeFingerAssistance","false",3)
        }
      });

    includeLawTermsCheckBox.addEventListener('change', function() {
        if (this.checked) {
            includeLawTerms = true
            setCookie("includeLawTerms","true",3)

        } else {
            includeLawTerms = false
            setCookie("includeLawTerms","false",3)
        }
      });
    
    numberOfParLines = 0
    generateLine()
    document.addEventListener("keydown",handleKeyPress)
}
startLoop()

function changeDuration(time){
    stopInteraction()
    duration = time.innerHTML
    document.getElementById("duration").innerHTML =   duration
    let f = document.getElementsByClassName("timings")[0].children
    for ( let i = 0;i<f.length;i++){
        f[i].classList.remove("active")
    }
    time.classList.add("active")

}



function generateParagraph(){
    let par = new Array
    let p = 0
    let array = []
    if(includeLawTerms){
        for (let u = 0;u<LINE_LENGTH / 3;u++){
            array.push(Math.floor(Math.random() * ((LINE_LENGTH / 3) - 0 + 1) + 0))
        } 
    }
    
    for (let i = 0;i<100;i++){
        let word
        if(array.includes(i)){
            word = lawTerms[Math.floor(Math.random() * lawTerms.length)]
        }else{
            word = myJson[Math.floor(Math.random() * myJson.length)]
        }
        
        if (p <= charLineLength){
            p += word.length
            par.push(word.toLocaleLowerCase() + " ")   
        }
        
    }
    return par.join("")
}

function inititate(newInnit=false){
    stopInteraction()
    gameOn = true
    document.getElementById("stats").classList.remove('showStats') 

    letterDoneCountData = []
    letterMissedCountData = []
    letterDoneCountTotal = 0
    wordCountDoneTotal = 0
    letterMissedCountTotal = 0
    letterDoneCount = 0
    wordCountDone =0
    letterMissedCount  = 0
    let startTime = new Date().getTime()
    document.getElementById("startBtn").classList.remove("bi-play-circle")
    document.getElementById("startBtn").classList.add("bi-play-circle-fill")
    document.getElementById("stopBtn").classList.remove("bi-stop-circle-fill")
    document.getElementById("stopBtn").classList.add("bi-stop-circle")

   
   
    document.addEventListener("keydown",handleKeyPress)
    if ( newInnit== true){
        for (let i = 0;i<parent.childElementCount;i++){
            parent.children[i].style.opacity = "0"
        }
        parent.innerHTML = ""        
        
        numberOfParLines = 0
        generateLine()
      
    }
    
    countDowndId = setInterval(function() {
        let now = new Date().getTime()
        let obj = {}
        obj.x = now
        obj.y = letterDoneCount
        let secondsPassed = Math.floor(now - startTime)
        
        letterDoneCountData.push(obj)
        letterDoneCount = 0

        let missed = {}
        missed.x = now
        if (letterMissedCount ==0){
            missed.y = null
        }else{
            missed.y = letterMissedCount
        }
        
        letterMissedCountData.push(missed)
        letterMissedCount = 0
  
 
        document.getElementById("duration").innerHTML =  (parseInt(duration) - Math.floor(((now-startTime) % (1000 * 60)) / 1000)).toString()
        
        if  (duration * 1000<= secondsPassed){
            document.getElementById("duration").innerHTML = ""    
            stopInteraction()
            getResults()
            return
        }
    },1000)

    if(includeFingerAssistance == true){
        spin(document.getElementById("sentencesList").children[0].children[0].innerHTML)
    }   
}

function getResults(){
    let lettersPerSecond = letterDoneCountTotal/duration
    let wordPerMinute = (wordCountDoneTotal/duration ) * 60
    let accuracy = letterMissedCountTotal / letterDoneCountTotal
    document.getElementById("LPS").innerHTML =Math.round((lettersPerSecond + Number.EPSILON) * 100) / 100


    document.getElementById("WPM").innerHTML =Math.floor(wordPerMinute)
    document.getElementById("ML").innerHTML =Math.floor(letterMissedCountTotal)
    document.getElementById("acc").innerHTML = `${100 - (Math.floor(accuracy * 100))}%`
    document.getElementById("fingerHelp").innerHTML = ""

    document.getElementById("stats").classList.add('showStats') 
   
    
    createChart();
    
}
function stopInteraction(){
    gameOn = false
    clearInterval(countDowndId);
    document.getElementById("startBtn").classList.remove("bi-play-circle-fill")
    document.getElementById("startBtn").classList.add("bi-play-circle")
    document.getElementById("stopBtn").classList.remove("bi-stop-circle")
    document.getElementById("stopBtn").classList.add("bi-stop-circle-fill")
    document.removeEventListener("keydown",handleKeyPress)



}

function generateLine(){
    sentenceArray = generateParagraph().split("")
    keyNum = 0 

    let previousLine = document.getElementById(`sentenceToDo-${numberOfParLines -1}`)
    if (numberOfParLines != 0){
        for (let i = 0;i<previousLine.childElementCount;i++){
            previousLine.children[i].removeAttribute("id")
        }
    }
    if (numberOfParLines ==0){
        sentenceArrayNext = generateParagraph().split("")
        sentenceArrayNextNext = generateParagraph().split("")

        createLine(`sentenceToDo-${numberOfParLines}`,sentenceArray,false)
        
        createLine(`sentenceToDo-${numberOfParLines +1 }`,sentenceArrayNext,false)
        createLine(`sentenceToDo-${numberOfParLines +2}`,sentenceArrayNextNext,false)

                
    } else{
        sentenceArray = sentenceArrayNext
        sentenceArrayNext = sentenceArrayNextNext
        sentenceArrayNextNext = generateParagraph().split("")

        createLine(`sentenceToDo-${numberOfParLines+2}`,sentenceArrayNextNext)
    }

    numberOfParLines +=1
   
}


function createLine(id,array,move=true){
    let cDiv = parent.children;
    

    const currentDiv = document.createElement("div")
    currentDiv.id = id
    currentDiv.classList.add("sentenceToDo")
    for ( let i = 0;i<array.length;i++){
        
        const newDiv = document.createElement("span");
        if ( i == 0 && id == numberOfParLines){
            newDiv.classList.add("nextLetter")
        }
        const newContent = document.createTextNode(array[i]);
        newDiv.id = "letter-" + i
        newDiv.appendChild(newContent);
        currentDiv.appendChild(newDiv)
    }
    parent.appendChild(currentDiv)
    n+= 1
    if (n == 0 || n == 1 || n == 2) n = 0
    
    
    currentDiv.style.transform = `translate(0,${-25*n}px)`;
    delay(200).then(() => currentDiv.classList.add("show"));
    parent.style.transform= "translate(0,25px)"
    let first = false
    if(move == true){
        for (var i = 0; i < cDiv.length; i++) {
        if (cDiv[i].tagName == "DIV" && cDiv[i].classList.contains("show")) { 
            
            cDiv[i].style.transform = `translate(0,${-25*n}px)`;
            
            }
        if ( first === false && cDiv[i].classList.contains("show")){
            cDiv[i].classList.remove("show")
            
            first = true
        }
        
      }    
    }
   
}

function handleKeyPress(e){
    if ( gameOn == false){
        gameOn = true
        inititate()
        
    }
    const key = keyboard.querySelectorAll(`[data-key="${e.key}"i]`)
    let firstLetter =sentenceArray[keyNum]
    if (e.key!== firstLetter){
        letterMissedCount +=1
        letterMissedCountTotal +=1
        document.getElementById(`letter-${keyNum}`).style.color = "red"
        for (let i = 0;i<key.length; i++){
            key[i].classList.add('wrongType') 
            key[i].addEventListener(
                "animationend",
                () => {
                    key[i].classList.remove('wrongType') 
                },{ once: true })
        }
        return
    }
    
    for (let i = 0;i<key.length; i++){
        key[i].classList.add('active') 
        key[i].addEventListener(
            "animationend",
            () => {
                key[i].classList.remove('active') 
            },{ once: true })
    }
   
    
    if ( e.key  ==   "Shift"){
        return
    }
    if ( e.key  == "Enter" ){

        return
    }
    if ( e.key  == "CapsLock" ){

        return
    }
    if ( e.key  == "Tab"){

        return
    }
    if (e.key == "Backspace"){
  
        return
    }

    document.getElementById(`letter-${keyNum}`).classList.add("letterDone")
    document.getElementById(`letter-${keyNum}`).classList.remove("nextLetter")
    if(e.key === " "){
        wordCountDone +=1
        wordCountDoneTotal +=1
    }
    typeData.push(Date(Date.now()).toString())
    
    letterDoneCount += 1
    letterDoneCountTotal += 1
    
    if ( sentenceArray.length !== keyNum +1 ){
        if(includeFingerAssistance == true){
            spin(document.getElementById(`letter-${keyNum +1}`).innerHTML)
        }

        document.getElementById(`letter-${keyNum +1}`).classList.add("nextLetter")
        
        keyNum +=1
    }else{
        generateLine()
         
    }
    
  
}


function calcMA(data){
    var mADataList = new Array
    for (let i = 0;i<data.length ;i++){
        let mAData = {}
        mAData.x = data[i].x
        try {
            mAData.y = (data[i].y + data[i+1].y +data[i+2].y) / 3
        } catch (error){
            mAData.y = (data[i].y + data[i].y +data[i].y) / 3
        }

        mADataList.push(mAData)
    }
    return mADataList
}
function createChart() {
  let ConChart = document.getElementById("chartContainer")
  ConChart.innerHTML = ""
  let newChart = document.createElement("canvas")
  newChart.id = "myChart"
  ConChart.append(newChart)
  console.log(letterDoneCountData)
  var ctx = document.getElementById("myChart").getContext("2d");
  var cfg = {
    type: 'line',
    data: {
      datasets: [
        {
            label: "Completed Letters",
            backgroundColor: 'white',
            borderColor: 'white',
            fill: false,
            data: letterDoneCountData,
            pointRadius:2,
        },
        {
            label: "Completed Letters MA",
            backgroundColor: 'grey',
            borderColor: 'grey',
            fill: false,
            data: calcMA(letterDoneCountData),

            pointRadius:2
        },{
            label: "Incorrect Letters",
            backgroundColor: 'red',
            borderColor: 'red',
            fill: false,
            
            data: letterMissedCountData,
            type: 'bubble', 
            pointRadius:20,
        }],
    },
    options: {
        
      legend: {
        display: false
      },
      layout: {
        padding: 40
        
    },
      responsive:true,
      maintainAspectRatio: false,
      tooltips:{
        mode : 'index',
        enabled:true,
        callbacks: {
            title: function(tooltipItems, data) {
                let time = new Date(data.datasets[1].data[tooltipItems[0].index].x)
                
                return time.toISOString().slice(11, 19);
            },
            label: function(tooltipItems, data) { 
                return data.datasets[tooltipItems.datasetIndex].label + ": " + Math.round(tooltipItems.yLabel)
         }
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'linear',
          
        }],
        yAxes: [{
          //type: 'linear',
        }]
      }
    },

  };
  var chart = new Chart(ctx, cfg); 
}






function handleOutsideClickDrawer(e){
    if(e.target.id =="openDrawer") return
    
    if (!document.getElementById("drawer").contains(e.target) && drawerOpen == false){
        toggleDrawer("close")
    }
}

function toggleDrawer(settings=""){
    if (settings == "close"){

        drawerOpen = false
    }
    
    const drawer = document.getElementById("drawer")
    let drawerWidth= drawer.getBoundingClientRect().width
    if (drawerOpen){
        drawer.style.transform = "translate(0)"
        drawerOpen = false
    } else{
        drawer.style.transform = `translate(${drawerWidth}px)`
        drawerOpen = true
    }
}

function toggleLanguage(lang = "langSwedish"){
    
    document.getElementById('langSwedish').classList.remove('activeLang')
    document.getElementById('langEnglish').classList.remove('activeLang')
    document.getElementById(lang).classList.add('activeLang')
}

const fingersNum = [
    'Left little finger',//0
    'Left ring finger',//1
    'Left middle finger',//2
    'Left index finger',//3
    'Left thumb',//4
    'Right Thumb',//5
    'Right index finger', //6
    'Right middle finger', // 7
    'Right ring finger',// 8 
    'Right little finger'//9
]

const fingerLetter = {
    'q':0,
    'w':1,
    'e':2,
    'r':3,
    't':3,
    'y':6,
    'u':6,
    'i':7,
    'o':8,
    'p':9,
    'å':9,
    'a':0,
    's':1,
    'd':2,
    'f':3,
    'g':3,
    'h':6,
    'j':6,
    'k':7,
    'l':8,
    'ö':9,
    'ä':9,
    'z':0,
    'x':1,
    'c':2,
    'v':3,
    'b':3,
    'n':6,
    'm':6,
    ' ':4,
    '-':9    
}

function spin(letter){
    if (letter == " " ){
        letter = "SPACE"
    }
    if ( letter == "-"){
        letter = "LINE"
    }
    document.getElementById("fingerHelp").innerHTML = letter.toUpperCase() + " - " + fingersNum[fingerLetter[letter]]
   
}

