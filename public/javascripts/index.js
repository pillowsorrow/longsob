let fail = 0;
async function feedPage() {
  await highlight();
  await cours_recommend();
  await pop_course();
  await link_page();
  await news_recommend();
  await survey_recommend();
  await onlineUser();

  $('#rec-course-tab , #pop-course-tab').on( "click", function() {
    $('#rec-course-tab , #pop-course-tab, #rec-course, #pop-course').toggleClass('active');
    $('#rec-course, #pop-course').toggleClass('show');
  } );

}
function highlight() {
  $.ajax({
    url: local_api + "web/highlight",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        const e = $("#herobanner > div.js-slide");
        for (let i = 0; i < response.total; i++) {
          if (i > 0) {
            e.clone().insertAfter(e);
          }
        }
        for (let i = 0; i < response.total; i++) {
          let banner = path_validate(response.data[i].banner , location_file );
          $("#herobanner > div:eq(" + i + ") ").css('background-image', "url('" + banner + "')");  
        }

        $.HSCore.components.HSSlickCarousel.init("#herobanner");
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await highlight();
        fail++;
      }
    });  
}
function link_page() {
  $.ajax({
    url: local_api + "web/link",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        const e = $("#linkbanner > div.js-slide");
        for (let i = 0; i < response.total; i++) {
          if (i > 0) {
            e.clone().insertAfter(e);
          }
        }
        for (let i = 0; i < response.total; i++) {
          
          let linkbanner = path_validate(response.data[i].cover , location_file );

          $("#linkbanner > div:eq(" + i + ") img").attr('src', linkbanner ).attr('alt',response.data[i].links_title).attr('onerror',"this.onerror=null;this.src='/images/square-default-logo.png'");
          $("#linkbanner > div:eq(" + i + ") a").attr('href',response.data[i].links);
        }

        $.HSCore.components.HSSlickCarousel.init("#linkbanner");
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await link_page();
        fail++;
      }
    });  
}
function cours_recommend() {
  $.ajax({
    url: local_api + "course/recommend",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        const e = $("#rec-course > div .card");
        for (let i = 0; i < response.total; i++) {
          if (i > 0) {
            e.clone().insertAfter(e);
          }
        }
        let linkpath = site_path + '/course/';
        for (let i = 0; i < response.total; i++) {

          let cover = path_validate(response.data[i].cover , location_file );

          $("#rec-course > div .card:eq(" + i + ") .card-body h2").text(response.data[i].course_subject);
          $("#rec-course > div .card:eq(" + i + ") img").attr("src",cover);
          $("#rec-course > div .card:eq(" + i + ") .card-body var.price").text(response.data[i].price);
          $("#rec-course > div .card:eq(" + i + ") .course-btn a.more").attr("href", linkpath + response.data[i].course_id + '/detail');
        }

        $("#rec-course").addClass('active');
      } else {
        $("#rec-course").hide();
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await cours_recommend();
        fail++;
      }
    });
}
function pop_course() {
  $.ajax({
    url: local_api + "course/pop_course",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        const e = $("#pop-course > div .card");
        for (let i = 0; i < response.total; i++) {
          if (i > 0) {
            e.clone().insertAfter(e);
          }
        }
        let linkpath = site_path + 'course/';
        for (let i = 0; i < response.total; i++) {

          let cover = path_validate(response.data[i].cover , location_file );

          $("#pop-course > div .card:eq(" + i + ") .card-body h2").text(response.data[i].course_subject);
          $("#pop-course > div .card:eq(" + i + ") img").attr("src",cover);
          $("#pop-course > div .card:eq(" + i + ") .card-body var.price").text(response.data[i].price);
          $("#pop-course > div .card:eq(" + i + ") .course-btn a.more").attr("href", linkpath + response.data[i].course_id + '/detail');
        }

      } else {
        $("#pop-course").hide();
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await pop_course();
        fail++;
      }
    });
}
function news_recommend() {
  $.ajax({
    url: local_api + "news/recommended",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        const e = $("#rec-course4 > div a.card");
        for (let i = 0; i < response.total; i++) {
          if (i > 0) {
            e.clone().insertAfter(e);
          }
        }
        let linkpath = site_path + '/news/';
        for (let i = 0; i < response.total; i++) {
          let cover = path_validate(response.data[i].cover , location_file );

          $("#rec-course4 > div a:eq(" + i + ") .card-body h2").text(response.data[i].web_subject);
          $("#rec-course4 > div a:eq(" + i + ") img").attr("src",cover);
          $("#rec-course4 > div a:eq(" + i + ") ").attr("href", linkpath + 'detail/' + response.data[i].web_id + '/' +response.data[i].web_seo);
        }

      }else{
        $("#rec-course4").remove();
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await news_recommend();
        fail++;
      }
    });
}

function survey_recommend() {
  $.ajax({
    url: local_api + "survey/recommended",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;

      if (response.total > 0) {
        const e = $("#rec-course3 > div div.media");
        for (let i = 0; i < response.total; i++) {
          if (i > 0) {
            e.clone().insertAfter(e);
          }
        }
        let linkpath = site_path + '/survey/assessment/';
        for (let i = 0; i < response.total; i++) {

          $("#rec-course3 > div div.media:eq(" + i + ") span.btn-icon__inner").text((i+1));
          $("#rec-course3 > div div.media:eq(" + i + ") .media-body a").text(response.data[i].survey_subject);
          $("#rec-course3 > div div.media:eq(" + i + ") .media-body a").attr("href", linkpath + response.data[i].survey_id );
        }
        $('.survey-row').css('display', 'flex');
        $('.survey-row').last().css('display', 'block');
        $('.survey-row-no-reult').remove();
      }else{
        $('.survey-row').remove();
        $('.survey-row-no-reult').show();
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await survey_recommend();
        fail++;
      }
    });
}


function onlineUser() {
  $.ajax({
    url: local_api + "web/logs",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $('html').attr('lang'),
      project: $('meta[name="api_project"]').attr('content')
    }),
  })
    .done(function (response) {
      fail = 0;
      $('div.counter:eq(0) > h2').text(response.logs_today);
      $('div.counter:eq(1) > h2').text(response.logs_month);
      $('div.counter:eq(2) > h2').text(response.logs_all);
      
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await onlineUser();
        fail++;
      }
    });
}