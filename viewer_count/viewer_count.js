function viewer_count_sent_to_ga(service_title, viewers) {
  ga('send', 'event', 'Live Stream', ''+service_title+'', ''+viewers+'')
}
(function($){
  var live_service_title;
  /* Popup Script */
  function viewer_count_show_popup() {
      $("#VC").css("display","block");
      $("#overlay-VC").css("display","block");
      $('html').addClass('VC-noscroll');
      var delay=1000;
      setTimeout(viewer_count_prepareEventHandlers(),delay);
  }

  function viewer_count_hide_popup() {
      $("#VC").css("display","none");
      $("#overlay-VC").css("display","none");
      $('html').removeClass('VC-noscroll');
  }

  function viewer_count_get_cookie(Name) {
    var search = Name + "="
    var returnvalue = "";
    if (document.cookie.length > 0) {
      offset = document.cookie.indexOf(search)
      if (offset != -1) { // if cookie exists
        offset += search.length
        // set index of beginning of value
        end = document.cookie.indexOf(";", offset);
        // set index of end of cookie value
        if (end == -1)
           end = document.cookie.length;
        returnvalue=unescape(document.cookie.substring(offset, end))
        }
     }
    return returnvalue;
  }

  function viewer_count_alertornot(){
    if (viewer_count_get_cookie('attendance')==''){
    viewer_count_show_popup()
      var date = new Date();
      date.setTime(date.getTime() + (100 * 60 * 1000));
      jQuery.cookie("attendance", "yes", { expires: date });
      console.log("Attendance Cookie Expires:");
      console.log(date);
    }
  }

  /*function viewer_count_ga(viewers) {
      var start, end;
      var timestamp = (new Date()).getTime();
      timestamp = Math.floor(timestamp/1000);
      CacheNum = Math.floor(timestamp/(60*3)); // 3 minute cache
              var temp = $.get('/not-a-feed/online-service-times' + '?' + CacheNum , {}, function (data, textStatus) {
        $(data).find('channel item').each( function(){
          service_title = $(this).find('title').text();
          console.log("Title: " + service_title);
                  viewer_count_sent_to_ga(service_title, viewers);
        });
      }, 'xml');
      viewer_count_hide_popup();
  }*/
    function viewer_count_ga(viewers) {
      viewer_count_sent_to_ga(live_service_title, viewers);
      viewer_count_hide_popup();
    }

        function viewer_count_prepareEventHandlers() {
            var vc0 = document.getElementById("vc0");
            vc0.onclick = function() {
                viewer_count_ga("SKIPPED");
            };
            var vc1 = document.getElementById("vc1");
            vc1.onclick = function() {
                viewer_count_ga("1");
            };
            var vc2 = document.getElementById("vc2");
            vc2.onclick = function() {
                viewer_count_ga("2");
            };
            var vc3 = document.getElementById("vc3");
            vc3.onclick = function() {
                viewer_count_ga("3");
            };
            var vc4 = document.getElementById("vc4");
            vc4.onclick = function() {
                viewer_count_ga("4");
            };
            var vc5 = document.getElementById("vc5");
            vc5.onclick = function() {
                viewer_count_ga("5");
            };
            var vc6 = document.getElementById("vc6");
            vc6.onclick = function() {
                viewer_count_ga("6");
            };
        }
  //window.onload = viewer_count_show_popup();


  /*Countdown Timer*/ 

    $(document).ready(function($) {
    setInterval(function(){jQuery('.live-count-divide').toggleClass("blink");}, 1000);
    setInterval(function(){jQuery('.live-count-title.live').toggleClass("blink");}, 1000);
    LiveStatusCachable();
  });
  
  var LZ = function(x) {
    return (x >= 10 || x < 0 ? "" : "0") + x;
  }
  
  /********************************************************
   * Requests the next service start and end time.*
   ********************************************************/
  LiveStatus = function() {
    var start, end;
    var timestamp = (new Date()).getTime();
    timestamp = Math.floor(timestamp/1000);
    CacheNum = Math.floor(timestamp/(60*3)); // 3 minute cache
    var temp = $.get('/not-a-feed/online-service-times' + '?' + CacheNum , {}, function (data, textStatus) {
      $(data).find('channel item').each( function(){
        start = $(this).find('description').text();
        start = parseInt(start);
        //end = $(this).find('creator').text();
        end = $(this).children()[4].textContent;
        end = parseInt(end);
        console.log("Current time: " + timestamp);
        console.log("Start time: " + start);
        console.log("End time: " + end);
        savestate = this;
        TimerTick(start, end);
        console.log("LiveStatus: " + textStatus);
        live_service_title = $(this).find('title').text();
      });
    }, 'xml');
  };

  LiveStatusCachable = function() {
    var start, end;
    var timestamp = (new Date()).getTime();
    timestamp = Math.floor(timestamp/1000);
    var temp = $.get('/not-a-feed/online-service-times' , {}, function (data, textStatus) {
      $(data).find('channel item').each( function(){
        start = $(this).find('description').text();
        start = parseInt(start);
        //end = $(this).find('creator').text();
        end = $(this).children()[4].textContent;
        end = parseInt(end);
        console.log("Current time: " + timestamp);
        console.log("Start time: " + start);
        console.log("End time: " + end);
        live_service_title = $(this).find('title').text();
        savestate = this;
        TimerTick(start, end);
        console.log("LiveStatus: " + textStatus);
      });
    }, 'xml');
  };
  var popup_triggered;
  
  function TimerTick(start, end) {
    var current = new Date().getTime();
    //normalize the date to be in seconds rather than milliseconds
    current = Math.floor(current.valueOf()/1000);
    //Not yet started
    if (current < start) {
      var remaining = (start - current);
      var days, hrs, mins, secs;
      days = Math.floor(remaining/60/60/24);
      hrs  = Math.floor(remaining/60/60%24);
      mins = Math.floor((remaining)/60%60);
      secs = Math.floor(remaining%60);
      hrs  = LZ(hrs);
      mins = LZ(mins);
      secs = LZ(secs);
      $('.live-wrapper span').show();
      //$('.live-wrapper .live-link').attr('rel', 'prefetch');
      $('.live-count-title').removeClass('live');
      $('.live-count-title').html("LIVE IN ");
      $('.live-count-day').html(days + "d");
      $('.live-count-hours').html(hrs + "hr");
      $('.live-count-min').html(mins + "min");
      $('.live-count-secs').html(secs + "sec");
      setTimeout(function(){TimerTick(start, end);}, 500);
      //console.log('tick: live in ' + (start - current) + ' secs');
      if (window.location.pathname == "/live-service") { 
        var remaining = (start - current);
          if ((remaining < (3 * 60)) && (popup_triggered != 1)) { 
            popup_triggered = 1;
            viewer_count_alertornot();
            console.log('Countdown: Viewer Count Popup Triggered within 3 minutes of start');
          }
        if (popup_triggered == 1) {
          console.log('Countdown: Popup already triggered');
        }
        }
    }
    //Live
    else if (current >= start && current < end) {
      var remaining = (end - current);
      var days, hrs, mins, secs;
        if (popup_triggered == 1) {
          console.log('Countdown: Popup reset');
          popup_triggered = 0;
        }
      days = Math.floor(remaining/60/60/24);
      hrs  = Math.floor(remaining/60/60%24);
      mins = Math.floor(remaining/60%60);
      secs = Math.floor(remaining%60);
      hrs  = LZ(hrs);
      mins = LZ(mins);
      secs = LZ(secs);
      $('.live-wrapper span').hide();
      //$('.live-wrapper .live-link').attr('rel', 'prefetch');
      $('.live-count-title').not('.live').addClass('live');
      $('.live-count-title').html("LIVE NOW");
      $('.live-count-title').show();
      $('.live-count-day').html(days + "d");
      $('.live-count-hours').html(hrs + "hr");
      $('.live-count-min').html(mins + "min");
      $('.live-count-secs').html(secs + "sec");
      if (window.location.pathname == "/live-service") { 
        viewer_count_alertornot();
      }
      setTimeout(function(){TimerTick(start, end);}, 500);
      //console.log('tick: live for another ' + (end - current) + ' secs');
    }
    //Random delay to attempt to reduce the zerging of the server when 300 people
    //all request the next service time all within one second.
    else if (current < ( end + Math.floor(Math.random() * 30))) {
      setTimeout(function(){TimerTick(start, end);}, 1000);
    }
    else {
      LiveStatus();
    }
  };
    
}(jQuery));

