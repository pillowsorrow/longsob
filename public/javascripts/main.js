let access_token;
let refresh_token;
const api_path = $("meta[name=api_path]").attr("content");
const api_project = $("meta[name=api_project]").attr("content");
const site_path = $("link[rel=canonical]").attr("href");
const page_language = $("html").attr("lang");
const location_origin = window.location.origin;
const location_file = $("meta[name=file_project]").attr("content");
const local_api = location_origin + '/api/';

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
  $(".js-mega-menu").HSMegaMenu({
    event: "hover",
    pageContainer: $(".container"),
    breakpoint: 767.98,
    hideTimeOut: 0,
  });

  // initialization of HSMegaMenu component
  $(".js-breadcrumb-menu").HSMegaMenu({
    event: "hover",
    pageContainer: $(".container"),
    breakpoint: 991.98,
    hideTimeOut: 0,
  });

  // initialization of header
  $.HSCore.components.HSHeader.init($("#header"));
  //$.HSCore.components.HSSlickCarousel.init(".js-slick-carousel");
  // initialization of unfold component
  $.HSCore.components.HSUnfold.init($("[data-unfold-target]"), {
    afterOpen: function () {
      $(this).find('input[type="search"]').focus();
    },
  });
  // initialization of svg injector module
  $.HSCore.components.HSSVGIngector.init(".js-svg-injector");

  await $.ajax(loginsettings).done(function (response) {
      access_token = response.access_token;
      refresh_token = response.refresh_token;

      feedPage();
    })
    .fail(function () {
      //window.location.href = site_path ;
    });

  $('#acceptterms').change(function () {
    if (this.checked) {
      $(this).prop("checked",
        $('#nextbutton').removeClass('d-none').find('button').prop("disabled", false)
      );
    }
    if (!$(this).is(':checked')) {
      $('#nextbutton').addClass('d-none').find('button').prop("disabled", true);
    }
  });

  $('#linkforgotpassword').click(function () {
    $('div#forgotPassword').removeAttr('style');
    $('div#login').hide();
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
  });
}

$(document).on('submit', 'form#form-login', function (e) {
  e.preventDefault();
  const user = {
    username: $('#signinEmail').val(),
    password: $('#signinPassword').val(),
    project: api_project,
    sidebar: true
  }

  $.post(site_path + "/signin", user)
    .done(function (data) {
      window.location.reload();
    })
    .fail(function () {
      window.location.href = site_path + '/login-error';
    });




});

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

function path_validate(url, absolute_path) {
  let result;
  const RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');
  if (RgExp.test(url)) {
    //result = "This is Absolute URL.";
    result = url;
  } else {
    //result = "This is Relative URL.";
    result = absolute_path + url;
  }
  return result;
}

$(document).ready(function (e) {
  //$(document).on('click', '#hamburgerTrigger',function(e){
  // $('button.navbar-toggler').on('click', function (e) {
  //   $('aside#sidebarContent').toggleClass('showSidebar');
  // });

  $(document).on('click', 'button.u-hamburger', function (e) {
    $('#navBar').hasClass()
    //aria-expanded
    if ($("#navBar").hasClass("show")) {
      $("#navBar").toggleClass("show");
      $('.u-hamburger').attr('aria-expanded', false);
    } else {
      $("#navBar").toggleClass("show");
      $('.u-hamburger').attr('aria-expanded', true);
    }
  });
});

function likePage(id, profile, page_owner) {
  let url = local_api;
  if (page_owner == 'news') {
    url += "news/like";
  } else if (page_owner == 'blog') {
    url += "ebook/like";
  }

  $.ajax({
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      data: JSON.stringify({
        lang: $('html').attr('lang'),
        project: $('meta[name="api_project"]').attr('content'),
        id: id,
        profile: profile
      }),
    })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        window.location.reload();
      } else {
        let count_like = $('#showlike').text();
        if (response.status == 0) {
          $('#likeNews').removeClass('fas').addClass('far');
          count_like = (+count_like) - 1;
        } else if (response.status == 1) {
          $('#likeNews').removeClass('far').addClass('fas');
          count_like = (+count_like) + 1;
        }
        $('#showlike').text(count_like);
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await likePage(id)
        fail++;
      }
    });
}


$(function () {
  var dateBefore = null;
  if (page_language == 'en') {
    $("#recoverDate").datepicker({
      dateFormat: 'dd-mm-yy',
      showOn: 'button',
      //buttonImage: 'http://jqueryui.com/demos/datepicker/images/calendar.gif',
      buttonImageOnly: false
    });
  } else if (page_language == 'th') {
    $("#recoverDate").datepicker({
      dateFormat: 'dd-mm-yy',
      showOn: 'button',
      //buttonImage: 'http://jqueryui.com/demos/datepicker/images/calendar.gif',
      buttonImageOnly: false,
      dayNamesMin: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
      monthNamesShort: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      changeMonth: true,
      changeYear: true,
      beforeShow: function () {
        if ($(this).val() != "") {
          var arrayDate = $(this).val().split("-");
          arrayDate[2] = parseInt(arrayDate[2]) - 543;
          $(this).val(arrayDate[0] + "-" + arrayDate[1] + "-" + arrayDate[2]);
        }
        setTimeout(function () {
          $.each($(".ui-datepicker-year option"), function (j, k) {
            var textYear = parseInt($(".ui-datepicker-year option").eq(j).val()) + 543;
            $(".ui-datepicker-year option").eq(j).text(textYear);
          });
        }, 50);
      },
      onChangeMonthYear: function () {
        setTimeout(function () {
          $.each($(".ui-datepicker-year option"), function (j, k) {
            var textYear = parseInt($(".ui-datepicker-year option").eq(j).val()) + 543;
            $(".ui-datepicker-year option").eq(j).text(textYear);
          });
        }, 50);
      },
      onClose: function () {
        if ($(this).val() != "" && $(this).val() == dateBefore) {
          var arrayDate = dateBefore.split("-");
          arrayDate[2] = parseInt(arrayDate[2]) + 543;
          $(this).val(arrayDate[0] + "-" + arrayDate[1] + "-" + arrayDate[2]);
        }
      },
      onSelect: function (dateText, inst) {
        dateBefore = $(this).val();
        var arrayDate = dateText.split("-");
        arrayDate[2] = parseInt(arrayDate[2]) + 543;
        $(this).val(arrayDate[0] + "-" + arrayDate[1] + "-" + arrayDate[2]);
      }
    });
  }
});
function cb(token) {

    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('name', 'g-recaptcha-response')
    input.setAttribute('value', token)
    document.getElementsByTagName('form')[0].appendChild(input)
}