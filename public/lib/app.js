// Config firebase
(function(){
  var config = {
   apiKey: "AIzaSyCzzIBg1u5XhWjye3Hu58AboXYaN7l8Cpk",
   authDomain: "thiennguyen-phantan.firebaseapp.com",
   databaseURL: "https://thiennguyen-phantan.firebaseio.com",
   projectId: "thiennguyen-phantan",
   storageBucket: "thiennguyen-phantan.appspot.com",
   messagingSenderId: "631921135943"
 };

 firebase.initializeApp(config);

  var db = firebase.database();

  // Get varrible in firebase
  var tempRef = db.ref('temperature');
  var umidRef = db.ref('humidity');
  var presenceRef = db.ref('presence');
  var lampRef = db.ref('lamp');

  // Keep real time database
  tempRef.on('value', onNewData('currentTemp', 'tempLineChart' , 'Nhiệt độ', 'C°'));
  umidRef.on('value', onNewData('currentUmid', 'umidLineChart' , 'Độ ẩm', '%'));


  // Get changed with updating value
  presenceRef.on('value', function(snapshot){
    var value = snapshot.val();
    var el = document.getElementById('currentPresence');
    if(value){
      el.classList.add('green-text');
    }else{
      el.classList.remove('green-text');
    }
  });

  // Take change when getting clicked
  var currentLampValue = false;
  lampRef.on('value', function(snapshot){
    var value = snapshot.val();
    var el = document.getElementById('currentLamp')
    if(value){
      el.classList.add('amber-text');
    }else{
      el.classList.remove('amber-text');
    }
    currentLampValue = !!value;
  });
  // Get click
  var btnLamp = document.getElementById('btn-lamp');
  btnLamp.addEventListener('click', function(evt){
    lampRef.set(!currentLampValue);
  });

})();

// Put data to chart
function onNewData(currentValueEl, chartEl, label, metric){
  return function(snapshot){
    var readings = snapshot.val();
    if(readings){
        var currentValue;
        var data = [];
        for(var key in readings){
          currentValue = readings[key]
          data.push(currentValue);
        }

        document.getElementById(currentValueEl).innerText = currentValue + ' ' + metric;
        buildLineChart(chartEl, label, data);
    }
  }
}

// Build chart from data
function buildLineChart(el, label, data){
  var elNode = document.getElementById(el);
  new Chart(elNode, {
    type: 'line',
    data: {
        labels: new Array(data.length).fill(""),
        datasets: [{
            label: label,
            data: data,
            borderWidth: 1,
            fill: false,
            spanGaps: false,
            lineTension: 0.1,
            backgroundColor: "#F9A825",
            borderColor: "#F9A825"
        }]
    }
  });
}
