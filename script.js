$(document).ready(function() {
  $('#header').load('header.html');
  $('#footer').load('footer.html');
});

$(function(){
  $("#header").load("header.html");
  $("#footer").load("footer.html");

  // Add event listener to Donate buttons
  $('body').on('click', '.donate', function() {
      $.get('/track_button_click/donate_button');
  });

  // Add event listener to Map button
  $('body').on('click', '.menu-item[href="map.html"]', function() {
      $.get('/track_button_click/map_button');
  });
});

function logPageView(visitorId, page, timeSpent, startTime) {
  $.ajax({
      url: '/log_page_view',
      method: 'POST',
      data: {
          visitor_id: visitorId,
          page: page,
          time_spent: timeSpent,
          start_time: startTime.toISOString()
      }
  });
}

function generateVisitorId() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  ).substring(0, 10);
}

let startTime = new Date();
let sessionVisitorId = sessionStorage.getItem('visitor_id') || generateVisitorId();
sessionStorage.setItem('visitor_id', sessionVisitorId);

window.addEventListener('beforeunload', () => {
  let timeSpent = (new Date() - startTime) / 1000;

  if (timeSpent > 3) {
      logPageView(sessionVisitorId, location.pathname, timeSpent, startTime);
  }
});
