async function feedPage() {
    const page = window.location.pathname.split("/");
    const lastElement = page.slice(-1);
  
    if ((lastElement == "course") || (lastElement == "group")) {
      await asideFeedPage();
      await courseFeedPage();
    } else if (lastElement == "detail") {
      await courseDetailFeedPage();
    }
  }
  
  function asideFeedPage() {
    $.ajax({
        url: local_api + "course/aside",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
          lang: $("html").attr("lang"),
          project: $('meta[name="api_project"]').attr('content')
        }),
      })
      .done(function (response) {
        fail = 0;
  console.log(response)
        if (response.total > 0) {
          const e = $(".course-new > div.card-main");
          for (let i = 0; i < response.total; i++) {
            if (i > 0) {
              e.clone().insertAfter(e);
            }
          }
          let linkpath = site_path + "/course/";
          for (let i = 0; i < response.total; i++) {
            $(".course-new > div.card-main:eq(" + i + ") h4 > a").text(
              response.data[i].group_subject
            );
            $(".course-new > div.card:eq(" + i + ") h4 > a").attr(
              "href",
              linkpath + response.data[i].group_id + "/group"
            );
          }
        }
      })
      .fail(async function () {
        if (fail < 3) {
          await refreshtoken();
          await asideFeedPage();
          fail++;
        }
      });
  }
  
  function courseFeedPage() {
    $.ajax({
        url: local_api + "course/page",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
          lang: $("html").attr("lang"),
          project: $('meta[name="api_project"]').attr('content'),
          group: course_group,
          profileID: getCookie('cookieProfileID') || 0
        }),
      })
      .done(function (response) {
        fail = 0;
        let linkpath = site_path + "/course";
  
        if (response.result > 0) {
          $("h4.heading-subject-text").text(response.group[0].subject);
          course_group = response.group[0].id;
          const course_data_length = response.data[0].course_data.length;
          const e = $("#course-block > div.course-block-detail");
  
          if (course_data_length == 0) {
            e.remove()
          } else {
            $("#course-block > div.course-block-zero").remove();
  
            for (let i = 0; i < course_data_length; i++) {
              if (i > 0) {
                e.clone().insertAfter(e);
              }
            }
            let linkpath = site_path + "/course/";
            for (let i = 0; i < course_data_length; i++) {
  
              let course_src = path_validate(response.data[0].course_data[i].cover , location_file );
  
              $("#course-block > div:eq(" + i + ") picture > img")
                .attr({
                  src: course_src,
                  alt: response.data[0].course_data[i].subject,
                })
                .height(185);
              $("#course-block > div:eq(" + i + ") .card-body h2").text(
                response.data[0].course_data[i].subject
              );
              $("#course-block > div:eq(" + i + ") .card-body var.price").text(
                response.data[0].course_data[i].price
              );
              let course_id = response.data[0].course_data[i].course_id;
              $("#course-block > div:eq(" + i + ") > div.card a").attr(
                "href",
                linkpath + course_id + "/detail"
              );
              $("#course-block > div:eq(" + i + ") > div.card .card-footer a").attr('id', 'course' + course_id);
              
              
              if (response.data[0].course_data[i].congratulation < 2) {
                $('#course' + course_id).text(registered_txt).removeClass('btn-primary-theme').addClass('btn-success').attr("href",site_path + "/lms");
              }
  
            }
          }
        } else {
          $("#course-block > div.course-block-detail").remove()
          //window.location.href = linkpath;
        }
      })
      .fail(async function () {
        if (fail < 3) {
          await refreshtoken();
          await courseFeedPage();
          fail++;
        }
      });
  }
  
  function courseDetailFeedPage() {}
  
  $('#submitCourse').on('click', function (e) {
    e.preventDefault();
    let profileID = getCookie('cookieProfileID') || 0;
    if (profileID == 0) {
      window.location.href = site_path + '/login'
    } else {
      $.ajax({
          url: local_api + "course/register",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
          data: JSON.stringify({
            lang: $("html").attr("lang"),
            project: $('meta[name="api_project"]').attr('content'),
            profileID: +profileID,
            course: $('#submitCourse').data('id')
          }),
        })
        .done(function (response) {
          
          let linkpath = site_path + "/course/" + $('#submitCourse').data('id') + "/detail/successful"
  
          window.location.href = linkpath;
        })
        .fail(async function () {
          if (fail < 3) {
            await refreshtoken();
            await courseFeedPage();
            fail++;
          }
        });
    }
  });
  
  function addtofavorites(id){
    let profileID = +getCookie('cookieProfileID') || 0;
  
    if (profileID == 0) {
      window.location.href = site_path + '/login'
    } else {
      $.ajax({
          url: local_api + "course/favorites",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
          data: JSON.stringify({
            lang: $("html").attr("lang"),
            project: $('meta[name="api_project"]').attr('content'),
            profileID: profileID,
            course: id
          }),
        })
        .done(function (response) {
          if(response.result == 1){
            let title = $('.addtofavorites').data('original-title2');
            $('#addtofavorites__' + id).addClass('active').attr('title',title);;
          }else{
            let title = $('.addtofavorites').data('original-title');
            $('#addtofavorites__' + id).removeClass('active').attr('title',title);
          }
        })
        .fail(async function () {
          if (fail < 3) {
            await refreshtoken();
            await courseFeedPage();
            fail++;
          }
        });
    }
  }