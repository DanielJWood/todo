d3.csv("/js/tasks.csv", function(data) {

  var icomp = 0;

  // Onload create the items    
  for (var i = 0; i < data.length; i++) {
    // buildItem(tasks[i]);
    if (data[i].completed === "complete") {
      icomp += 1;
    };
    if (data[i].chained != "") {
      chainMaker(data[i],data)      
    };

  };

  var itemscomplete = document.getElementById("items-complete");
  var itemsremain = document.getElementById("items-remain");

  itemscomplete.innerHTML = icomp;
  itemsremain.innerHTML = data.length - icomp;

});

(function ($) { 
  $(document).ready(function() { 
    $.fn.scrollView = function () {
      return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 2000);
      });
    }

    // Set the onclick;
    $('.head-box').click(function(){
      $( this ).toggleClass( "complete" );      
      var friend = $(this).context.parentNode.childNodes[3].childNodes[1].childNodes[1];      
      $(friend).toggleClass( "complete" );

    });

    $(window).load(function(){
      // $('#id4').scrollView();
    });

    // Scroll into view of next to do

    var deadline = 'January 14 2017 15:00:00 GMT-0500';      
    initializeClock('clockdiv', deadline);

  });  
}(jQuery));  

function chainMaker(d,data) {
  
  var weirdid = "R" + d.chained + d.id;
  var spaniel = document.getElementById(weirdid);
  

  for (var i = 0; i < data.length; i++) {    
    if (data[i].id === d.chained) {
      console.log(d.item)
      console.log(data[i].item)
      var restricted = data[i].item;
      break;
    };
  };

  spaniel.innerHTML  = restricted;
}

// Clock Functions
function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime){
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');
  function updateClock(){
    var t = getTimeRemaining(endtime);
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = t.hours;
      minutesSpan.innerHTML = t.minutes;
      secondsSpan.innerHTML = t.seconds;

    if(t.total<=0){
      clearInterval(timeinterval);
    }
  }

  updateClock(); // run function once at first to avoid delay
  var timeinterval = setInterval(updateClock,1000);
}
