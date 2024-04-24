async function feedPage() {
  await provinces_feed();
  //await department_feed();
  //await agency_feed(department_selected,0,0);

  $("#province_id").on("change", function () {
    district_feed($(this).val());
  });

  $("#district_id").on("change", function () {
    subdistrict_feed($(this).val());

  });
  /*
  $("#agency1 , #agency2 , #agency3").on("change", function () {
    let d_id = $(this).val();
    let sub_total = $(this).find(':selected').attr('data-sub');
    let name_agency = $(this).find(':selected').text();
    let lv = $(this).attr('id');
        lv = lv.replace('agency', '');

    if(sub_total > 0){
      agency_feed(department_selected,lv,d_id);
    }else{
      $('input[name="affiliation').val(name_agency);
    }
    if(lv == 2 && sub_total == 0){
      $(".agency_display3").hide();
    }
    //agency_feed(department_selected,lv)
  });

  $("#department").on("change", function () {
    let department_group = $(this).val();
    if(department_group == 1 || department_group == 2){
      $('.senior_display').hide();
      $('.senior_display input , .senior_display select').prop('required',false);
      $('.senior_display input[name="email"]').attr('type','text').val('-');
      $('.agency_title1').text('ระดับชั้นเรียน');
    }else{      
      $('.senior_display').show();
      $('.senior_display input , .senior_display select').prop('required',true);
      $('.senior_display input[name="email"]').val('');
      if(department_group == 3 || department_group == 4 || department_group == 5){
        $('.agency_display1').show();
        $(".agency_display2 , .agency_display3").hide();
        $('#set_affiliation input').prop('required',false);
        $('.agency_title1').text('ระดับชั้นเรียน');
      }
      if(department_group == 6){
        $('#agency1').show();
        $(".agency_display2 , .agency_display3").hide();
        $('#set_affiliation input').prop('required',true);
        $('.agency_title1').text('หน่วยงาน');
      }
      if(department_group == 7){
        $(".agency_display1 , .agency_display2 , .agency_display3").hide();
        $('#set_affiliation').show();
        $('#set_affiliation input').val('').prop('required',true);
        $('.agency_title1').text('หน่วยงาน');
      }
    }
    if(department_group != 7){  
      $('#set_affiliation').hide();
      agency_feed(department_group,0,0);
    }
    department_selected = department_group;
    
  });
*/
  $('input[name="id_card_type"]').on("change", function () {
    var input_id = $('input[name="id_card_type"]:checked').attr('id');
    var input_value = $('input[name="id_card_type"]:checked').val();
    var text_display = $('label[for="'+input_id+'"]').text();

    if(input_value == 3){
      $('#inputIDCard input, #inputIDCard select').addClass('display_title');
    }else{      
      $('#inputIDCard input, #inputIDCard select').removeClass('display_title');
    }
      $('label[for="citizen_id"]').text(text_display);
      $('#citizen_id').attr('placeholder',text_display);
    
  });

  
  $('#password , #confirm_password').on('blur', function() {
    let password1 = $('#password').val().trim();
    let password2 = $('#confirm_password').val().trim();

    if (password1 != password2) {
      $('#confirm_password').get(0).setCustomValidity('Password Must be Matching.');
    } else {
        // input is valid -- reset the error message
        $('#confirm_password').get(0).setCustomValidity('');
    }

  });

    
  
}

function provinces_feed() {
  $.ajax({
      url: local_api + "web/provinces",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      data: JSON.stringify({
        lang: $("html").attr("lang"),
        project: $('meta[name="api_project"]').attr('content')
      })
    })
    .done(function (response) {
      fail = 0;
      if (response.total > 0) {
        let e = $('#province_id').find('option').eq(0);
        $('#province_id').empty();
        $('#province_id').append(e);
        for (let i = 0; i < response.total; i++) {
          $('#province_id').append($('<option></option>', {
            value: response.data[i].provinces_id,
            text: response.data[i].provinces_name
          }));
        }

        e = $('#district_id').find('option').eq(0);
        $('#district_id').empty();
        $('#district_id').append(e);
        e = $('#subdistrict_id').find('option').eq(0);
        $('#subdistrict_id').empty();
        $('#subdistrict_id').append(e);

      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await provinces_name();
        fail++;
      }
    });
  }
  
function district_feed(province_id) {
  $.ajax({
    url: local_api + "web/districts",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $("html").attr("lang"),
      "province": province_id,
      project: $('meta[name="api_project"]').attr('content')
    })
  })
  .done(function (response) {
    fail = 0;

    let e = $('#district_id').find('option').eq(0);
    $('#district_id').empty();
    $('#district_id').append(e);
    for (let i = 0; i < response.total; i++) {

      $('#district_id').append($('<option></option>', {
        value: response.data[i].districts_id,
        text: response.data[i].districts_name
      }));
    }
    e = $('#subdistrict_id').find('option').eq(0);
    $('#subdistrict_id').empty();
    $('#subdistrict_id').append(e);
  })
  .fail(async function () {
    if (fail < 3) {
      await refreshtoken();
      await district_feed(province_id);
      fail++;
    }

  });  
}  
function subdistrict_feed(district_id) {
  $.ajax({
    url: local_api + "web/subdistricts",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data: JSON.stringify({
      lang: $("html").attr("lang"),
      "district": district_id ,
      project: $('meta[name="api_project"]').attr('content')
    })
  })
  .done(function (response) {
    fail = 0;

    let e = $('#subdistrict_id').find('option').eq(0);
    $('#subdistrict_id').empty();
    $('#subdistrict_id').append(e);
    for (let i = 0; i < response.total; i++) {
      $('#subdistrict_id').append($('<option></option>', {
        value: response.data[i].subdistricts_id,
        text: response.data[i].subdistricts_name
      }));
    }
  })
  .fail(async function () {
    if (fail < 3) {
      await refreshtoken();
      await subdistrict_feed(district_id);
      fail++;
    }
  });

}
/*
function department_feed() {
  $.ajax({
      url: api_path + "web/department_select",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      data: JSON.stringify({
        lang: $("html").attr("lang")
      })
    })
    .done(function (response) {
      fail = 0;
      if (response.total > 0) {
        let e = $('#department').find('option').eq(0);
        $('#department').empty();
        $('#department').append(e);
        for (let i = 0; i < response.total; i++) {
          $('#department').append($('<option></option>', {
            value: response.data[i].department_id,
            text: response.data[i].department_name
          }));
        }
        
        $("#department option[value=" + department_selected + "]").attr('selected', 'selected'); 
      }
    })
    .fail(async function () {
      if (fail < 3) {
        await refreshtoken();
        await department_feed();
        fail++;
      }
    });
  }

  function agency_feed(id,lv,id_ref) {
    $.ajax({
        url: api_path + "web/agency",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
          lang: $("html").attr("lang"),
          lv:lv,
          id:id,
          id_ref: +id_ref
        })
      })
      .done(function (response) {
        fail = 0;
        if(lv == 0){
          agency_target = '#agency1';
        }else if(lv == 1){
          agency_target = '#agency2';
          $('.agency_display2').show()
        }else if(lv == 2){
          agency_target = '#agency3';
          $('.agency_display3').show()
        }
        if (response.total > 0) {
          let e = $(agency_target).find('option').eq(0);
          $(agency_target).empty();
          $(agency_target).append(e);
          for (let i = 0; i < response.total; i++) {
            $(agency_target).append($('<option></option>', {
              value: response.data[i].agency_id,
              text: response.data[i].agency_name,
              'data-sub': response.data[i].sub_division
            }));
          }  
        }
      })
      .fail(async function () {
        if (fail < 3) {
          await refreshtoken();
          await agency_feed();
          fail++;
        }
      });
    }

  */