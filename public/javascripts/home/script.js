var $el = $('#zabuto-calendar');
var clickAble = true;
const thai_month = {
    1: "มกราคม",
    2: "กุมภาพันธ์",
    3: "มีนาคม",
    4: "เมษายน",
    5: "พฤษภาคม",
    6: "มิถุนายน",
    7: "กรกฎาคม",
    8: "สิงหาคม",
    9: "กันยายน",
    10: "ตุลาคม",
    11: "พฤศจิกายน",
    12: "ธันวาคม"
}

$(document).ready(function () {
    $el.zabuto_calendar({
        week_starts: 'sunday',
        show_days: true,
        classname: 'table table-bordered lightgrey-weekends',
        today_markup: '<span class="badge bg-primary">[day]</span>',
        navigation_markup: {
            prev: '<i class="fas fa-chevron-circle-left"></i>',
            next: '<i class="fas fa-chevron-circle-right"></i>'
        },
        translation: {
            "months": thai_month,
            "days": day
        },
        ajax: '/event_data'
    })

    if (!support_format_webp()) {
        $('body').addClass('webPNotSupport');
    }
});

function support_format_webp() {
    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    } else {
        // very old browser like IE 8, canvas not supported
        return false;
    }
}

//-- listeners --    
$el.on('zabuto:calendar:init', function (event) {

    
}).on('zabuto:calendar:goto', function (e) {
    if(clickAble){
        clickAble = false;
        const this_year = e.year, this_month = e.month;
        get_event_data(this_year,this_month);

    }
});

function get_event_data(this_year,this_month){

    $.get( "/event_data_list", { year : this_year, month : this_month } )
    .done(function( data ) {

            $('h6.card-subtitle').text(thai_month[this_month] + ' ' + this_year);
            let display_row = '';
            if(data.length > 0){
                $.each( data, function( key, value ) {
                    display_row += '<div class="event-items">';
                    display_row += '<div>'+ value.day +'</div>';
                    display_row += '<div>'+ value.title +'</div>';
                    display_row += '<span class="clearfix"></span>';
                    display_row += '</div>';
                });
            }else{
                display_row += '<div class="event-items-no">ไม่มีกิจกรรมในเดือนนี้</div>';
            }
            $('div.card-text > div').html(display_row);

        clickAble = true;
    });    
    
}