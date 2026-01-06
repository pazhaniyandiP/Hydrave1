
let lastWater = Date.now();
let lastMove = Date.now();
let lastEyeRest = Date.now();

let keystrokes = 0;
let mouseMove = 0;

let stressScore = 0;
let waterGoal = 2000;


const waterStatus = document.getElementById("waterStatus");
const moveStatus = document.getElementById("moveStatus");
const eyeStatus = document.getElementById("eyeStatus");
const stressStatus = document.getElementById("stressStatus");
const suggestion = document.getElementById("suggestion");
const waterGoalDisplay = document.getElementById("waterGoalDisplay");
const historyDiv = document.getElementById("history");

document.getElementById("setGoalBtn").onclick = () =>{
  const w = parseFloat(document.getElementById("weightInput").value);
  if(!w) return alert("Enter valid weight");

  waterGoal = Math.round(w * 35); // 35 ml per kg rule
  waterGoalDisplay.textContent = "Daily goal: " + waterGoal + " ml";
  saveHistory("Water goal set: "+waterGoal+" ml");
};

document.addEventListener("mousemove",e=>{
  mouseMove += Math.abs(e.movementX)+Math.abs(e.movementY);
});

document.addEventListener("keydown",()=>{
  keystrokes++;
});


document.addEventListener("click",()=>{
  lastMove = Date.now();
  lastEyeRest = Date.now();
});

document.addEventListener("dblclick",()=>{
  lastWater = Date.now();
  saveHistory("Water taken");
});

if(Notification.permission!=="granted"){
  Notification.requestPermission();
}


function notify(text){
  if(Notification.permission==="granted") new Notification(text);
  speak(text);
  vibrate();
}

function speak(text){
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function vibrate(){
  if(navigator.vibrate) navigator.vibrate([200,100,200]);
}

function saveHistory(text){
  const time = new Date().toLocaleTimeString();
  historyDiv.innerHTML += `<div>🕒 ${time} — ${text}</div>`;
}


setInterval(()=>{

  const now = Date.now();

 
  const mWater = Math.floor((now-lastWater)/60000);
  const mMove = Math.floor((now-lastMove)/60000);
  const mEye = Math.floor((now-lastEyeRest)/60000);

 
  if(mWater>=90){
    waterStatus.textContent="⚠️ High dehydration risk";
    waterStatus.className="alert";
    notify("Please drink water now");
  } else if(mWater>=45){
    waterStatus.textContent="⏳ Drink water soon";
    waterStatus.className="warn";
  } else {
    waterStatus.textContent="✔ Hydrated recently";
    waterStatus.className="good";
  }

  
  if(mMove>=60){
    moveStatus.textContent="⚠️ Too long sitting — stand now";
    moveStatus.className="alert";
    notify("Stand and stretch for 1 minute");
  } else if(mMove>=30){
    moveStatus.textContent="⏳ Prepare to stretch";
    moveStatus.className="warn";
  } else {
    moveStatus.textContent="✔ Movement looks balanced";
    moveStatus.className="good";
  }

  
  if(mEye>=25){
    eyeStatus.textContent="⚠️ Eye strain likely — rest eyes";
    eyeStatus.className="alert";
    notify("Look away for 20 seconds and blink");
  } else if(mEye>=15){
    eyeStatus.textContent="⏳ Eye break soon";
    eyeStatus.className="warn";
  } else {
    eyeStatus.textContent="✔ Eye rest taken";
    eyeStatus.className="good";
  }

  stressScore = keystrokes*0.7 + mouseMove*0.3;

  if(stressScore>900){
    stressStatus.textContent="High stress ⚠️";
    stressStatus.className="alert";
    suggestion.textContent="Take 2 minutes breathing break 🫁";
  }
  else if(stressScore>400){
    stressStatus.textContent="Moderate stress 😐";
    stressStatus.className="warn";
    suggestion.textContent="Slow down. Reduce tab switching.";
  }
  else{
    stressStatus.textContent="Calm and stable 🙂";
    stressStatus.className="good";
    suggestion.textContent="Keep going — you’re balanced today.";
  }


  keystrokes*=0.6;
  mouseMove*=0.6;

},2000);


document.getElementById("parentMode").addEventListener("change",(e)=>{
  if(e.target.checked){
    notify("Study mode enabled. Stay focused.");
    saveHistory("Parent/Study mode enabled");
  } else {
    saveHistory("Study mode disabled");
  }
});
