// Voice recognition
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
}

var voiceContent = '';

/*-----------------------------
      Voice Recognition
------------------------------*/

recognition.continuous = true;
recognition.onresult = function(event) {
  // event is a SpeechRecognitionEvent object.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {

    voiceContent = '';
    voiceContent += transcript;
    console.log(voiceContent);
    if (voiceContent == ' Mở đèn' || voiceContent == ' mở đèn'){
      voiceContent = '';
      console.log(voiceContent);
      var db = firebase.database();
      var lampRef = db.ref('lamp');
      lampRef.on('value', function(snapshot){
        var value = snapshot.val();
        var el = document.getElementById('currentLamp')
        el.classList.add('amber-text');
        currentLampValue = !!value;
        lampRef.set(!currentLampValue);
      });
    }

    if (voiceContent == ' Tắt đèn' || voiceContent == ' tắt đèn'){
      voiceContent = '';
      console.log(voiceContent);
      var db = firebase.database();
      var lampRef = db.ref('lamp');
      lampRef.on('value', function(snapshot){
        var value = snapshot.val();
        var el = document.getElementById('currentLamp')
        el.classList.remove('amber-text');
        currentLampValue = !!value;
        lampRef.set(!currentLampValue);
      });
    }


  }
};

recognition.start();
