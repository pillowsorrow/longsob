var horizontalProgressBars = $.HSCore.components.HSProgressBar.init(".js-hr-progress", {
  direction: "horizontal",
  indicatorSelector: ".js-hr-progress-bar"
});

let access_token;
let refresh_token;
const api_path = $("meta[name=api_path]").attr("content");
const api_project = $("meta[name=api_project]").attr("content");
const site_path = $("link[rel=canonical]").attr("href");
const location_origin = window.location.origin;
const local_api = location_origin + '/api/';
let congratulationStatus = 0;

const loginsettings = {
  url: local_api + "auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify({
    name: api_project,
  }),
};

$(window).on("load", async function () {
  await $.ajax(loginsettings).done(function (response) {
    access_token = response.access_token;
    refresh_token = response.refresh_token;
  });
});

function refreshtoken() {
  var settings = {
    url: local_api + "auth/refresh",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + refresh_token,
    },
  };

  $.ajax(settings).done(function (response) {
      access_token = response.access_token;
      refresh_token = response.refresh_token;
    })
    .fail(async function (response) {
      await $.ajax(loginsettings).done(function (response) {
        access_token = response.access_token;
        refresh_token = response.refresh_token;
      });
    })
}

function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  })
  return res
}

$('#basicsAccordion a').on("click", function () {
  let target = $(this).attr('href');
  $('#basicsAccordion > div:not(' + target + ')').removeClass('show');
  $(target).toggleClass('show');
});

$('span.hide_lesson_result').on("click", function () {
  if ($('span.hide_lesson_result').hasClass("show_lesson_result")) {
    $('span.hide_lesson_result').removeClass('show_lesson_result');
    $('span.lesson_result > span').fadeOut("slow");
  } else {
    $('span.hide_lesson_result').addClass('show_lesson_result');
    $('span.lesson_result > span').fadeIn("slow");
  }
});

$('#exerciseDetails .card-btn-arrow').on("click", function () {
  let id = $(this).data('id');
  $('#exercise' + id + ' > .card-collapse .card-btn-arrow').toggleClass('card-inactive');
  $('#exercise' + id + ' > .collapse').toggleClass('show');

});

$('#scoreDetails #pills-tab a').on("click", function () {
  let href = $(this).attr('href');

  $('#scoreDetails .tab-pane , #scoreDetails a.nav-link').removeClass('active show');
  $(href).addClass('active show');
  $(this).addClass('active');

  $(href).find('.progress-bar').each(function (key, value) {
    let width = $(this).text();
    $(this).width(width);
  });
});


function congratulation(pageID, lessonID) {

  if (congratulationStatus == 0) {
    $.ajax({
        url: site_path + "lms/congratulation",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          pageID: pageID,
          lessonID: lessonID
        })
      })
      .done(function (data) {
        //congratulationStatus = 1;
      })
  }
}
let contact_id = 0;

function contact_user(id, name) {
  $('#modal-contactus').css('background-color', 'rgba(0,0,0,0.5)').show().addClass('show');
  $('#modal-contactus h4.modal-title span').text(name);
  contact_id = id;
}

function contact_close() {
  $('#modal-contactus').hide().removeClass('show');
  $('#msg_send').val('');
  $('#msg_status').text('');
  contact_id = 0;
}

function contact_send() {
  var msg_send = $('#msg_send').val();

  if (msg_send == '') {
    $('#msg_status').css('color', 'red').text('กรุณาระบุข้อความ');
  } else {
    $.ajax({
        url: local_api + "lms/contact",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
          contact: contact_id,
          msg: msg_send,
          pageID: pageID,
          profileID: getCookie('cookieProfileID') || 0
        })
      })
      .done(function (data) {
        $('#msg_status').css('color', 'green').text('ส่งข้อความสำเร็จ');
        setTimeout(contact_close, 1000);
      })
  }
}

function gotobigbluebutton(url,room,role){
  $.post( url + '/join_bbb.php', { 
    meeting: room, 
    role: role,
    username: getCookie('cookieProfileName') 
  })
  .done(function( data ) {
    window.open(data);
  });
}