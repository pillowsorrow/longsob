document.addEventListener('DOMContentLoaded', function() {


});

const initialEvent = [
  {
     title: 'ห้องประชุมออนไลน์ 2 ',
     start: '2023-02-10',
     end: '2023-02-10',
     color: '#ff9f89'
   },    
  {
     title: 'ห้องประชุมออนไลน์ 1 ',
     start: '2023-03-20',
     end: '2023-03-22',
     color: '#ff9f89'
   },      
];


async function feedPage() {
loadCalendar();
}

function loadCalendar(){
var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, {
  plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
  },
defaultDate: initialdefaultDate,
locale: initialLocaleCode,
buttonIcons: false, // show the prev/next text
navLinks: true, // can click day/week names to navigate views
businessHours: true, // display business hours
eventLimit: true, // allow more link when too many events
editable: true,
events: {
  url: local_api + "news/calendar",
  method: 'POST',
  extraParams: {
    project: api_project,
    lang: initialLocaleCode
  },
  color: '#333' ,   // a non-ajax option
  textColor: '#fff'// a non-ajax option
}
});
calendar.render();
}