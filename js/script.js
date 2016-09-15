// OH LORDIE!

(function ($) { 
  $(document).ready(function() { 
    $.fn.scrollView = function () {
      return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 2000);
      });
    }

    // Onload create the items    
    for (var i = 0; i < tasks.length; i++) {
      // buildItem(tasks[i]);
    };

    // Set the onclick;
    $('.head-box').click(function(){
      $( this ).toggleClass( "complete" );
    });

    $(window).load(function(){
      // $('#id4').scrollView();
    });

    // Scroll into view of next to do
    

    var deadline = 'January 14 2017 15:00:00 GMT-0500';      
    initializeClock('clockdiv', deadline);

  });  
}(jQuery));  

function buildItem(d) {
  var t1 = '<div class="row" id="';
  var id = 'id' + d.id;
  if (d.completed === "yes") {
    var img = '<img src="img/danwhit.png">';
    var complete = "complete";
  } else {
    var img = '<img src="img/danwhit.png">';
    var complete = "";
  }
  var t2 = '"><div class="head-box ' + complete +'">';
  var t3 ='</div><div class="item-box"><div class="item-box-text"><h1 class="' + complete +'">';
  var item = d.item;
  var t4 ='</h1><h3>Due: ';
  var due = d.due;
  var t5 ='</h3><h3>Point: ';
  var point = d.responsible;
  var t6 ='</h3></div></div></div>';

  var itemDom = t1 + id + t2 + img + t3 + item + t4 + due + t5 + point + t6;

  var itemTable = document.getElementById("all-the-items");
  itemTable.innerHTML = itemTable.innerHTML + itemDom;
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
