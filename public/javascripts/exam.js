var saveoriginal = 0;
var exam_starttime;
let exam_start = true;

function youranswer(qid, answer, qtype, select, num) {

    if (select == "" || select == undefined) select = 0;
    if (num == "" || num == undefined) num = 0;
    $("#answer_" + qid).removeClass("btn-danger");
    $("#answer_" + qid).removeClass("btn-warning");
    $.ajax({
            url: api_path + "switcher/saveanswer",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
            },
            data: JSON.stringify({
                ProfileID: getCookie("cookieProfileID"),
                select: select,
                qtype: qtype,
                num: num,
                question_id: qid,
                exam_type: $("#exam_type").val(),
                youranswer: answer,
                exam_id: $("#exam_id").val(),
                question: $("#question_original").val(),
                // usertime: $("#usertime").val()
            })
        })
        .done(function (data) {
            $("#score_id").val(data['score_id'])
            exam_starttime = data['starttime'];
            success = true;
            if (qtype == 4) {
                
                for(var j = 1; j <= num; j++){
                    let name_q = 'answer[' + qid + '][' + j + ']';
                    let c = $('select[name="' + name_q + '"]').val();
                    if(c == null || c == ''){
                        success = false
                    }
                }
            }
            if (qtype == 5) {
                let name_q = 'answer[' + qid + ']';
                let c = $('input[name="' + name_q + '"]').val();
                if(c != 0){
                    success = true
                }
            }
            if (success) {
                $("#answer_" + qid).addClass("btn-success");
            } else {
                $("#answer_" + qid).addClass("btn-warning");
            }

            if (typeof minutes !== 'undefined') {
                if (exam_start) {
                    exam_start = false;
                    exam_time(exam_starttime);
                }
            }

        })
        .fail(async function () {
            await $.ajax(loginsettings).done(function (response) {
                access_token = response.access_token;
                refresh_token = response.refresh_token;

                youranswer(qid, answer, qtype, select, num)
            });

        });
}


$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    var position = $('div#stickyBlockStartPoint').position();

    if (scroll > 100) {
        let new_position = (+position.left) + 15;
        let block_width = $('div.js-sticky-block').width();
        $('div.js-sticky-block').width(block_width).css('left', new_position).addClass('active');
    } else {
        $('div.js-sticky-block').removeAttr('style').removeClass('active');
    }

});
var myCircle;

function pie_display(score) {
    myCircle = Circles.create({
        id: 'circles-1',
        radius: 60,
        value: score,
        maxValue: 100,
        width: 5,
        text: function (value) {
            return value + '%';
        },
        colors: ['#7bedd8', '#00c9a7'],
        duration: 400,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        valueStrokeClass: 'circles-valueStroke',
        maxValueStrokeClass: 'circles-maxValueStroke',
        styleWrapper: true,
        styleText: true
    });
}

function exam_time(starttime) {
    // Convert the input starttime to a Date object
    const startTime = new Date(starttime);
    
    // Calculate the end time based on the provided minutes
    const endTime = new Date(startTime.getTime() + minutes * 60000);

    // Calculate the warning time (5 minutes before endTime)
    const warningTime = new Date(endTime.getTime() - 5 * 60000);

    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference between current time and endTime
    const timeDifference = endTime - currentTime;

    // If the current time is before the warning time, set a timeout for warning_timeup
    if (currentTime < warningTime) {
        const warningTimeout = setTimeout(warning_timeup, warningTime - currentTime);
    }

    // Set a timeout for timeup
    const timeupTimeout = setTimeout(timeup, timeDifference);

    console.log("Exam start time:", startTime);
    console.log("Exam end time:", endTime);
    console.log("Warning time:", warningTime);
}

function warning_timeup() {
    $('.warn_timeup').addClass('warn_timeup_display');
    setTimeout(function() {
        $('.warn_timeup').removeClass('warn_timeup_display');
    }, 4000);
}

function timeup() {
    $('#examform input ,#examform select').removeAttr('required').prop('readonly', true);
    $('.timeupCover').addClass('timeupCover_active');
}

$(function() {
    var oldList, newList, item;
    $('.sortable').sortable({
        start: function(event, ui) {
            item = ui.item;
            oldList = item.parent();
        },
        stop: function(event, ui) {   
            newList = item.parent();       
            //console.log("Moved " + item.text() + " from " + oldList.attr('id') + " to " + newList.attr('id'));

            // อัปเดตค่าของ input เป้าหมาย
            var questionId = oldList.attr('id').replace('question_sortable_', ''); // ดึง questionId จาก id ของรายการเดิม
                      
           // สร้าง array ที่มีค่าตามลำดับลำดับของรายการใน newList
           var values = newList.children().map(function() {

            let pos = $(this).data('pos');
            return pos;
        }).get();

        // อัปเดตค่าของ hidden input
        let array_awswer = JSON.stringify(values);
        $('input[name="answer[' + questionId + ']"]').val(array_awswer);
            youranswer(questionId, array_awswer, 5)
        },
        change: function(event, ui) {  
            if(ui.sender) newList = ui.placeholder.parent().parent();
        },
        connectWith: ".sortable"
    }).disableSelection();
});