var scoid = '968';
var pagenow = 1;
var numpage = 1;
var w = 98;
var h = 4;
var content_w = 928;
var content_h = 498;
var topic = 'แบบทดสอบก่อนเรียน';
var nolp_lesson_mode = 'normal';
var display = true;
var numtest = 1;
var offline = true;
usescorm = (offline) ? false : true;
var wm_media = 6;
var listpage_w = 0;
var listpage_h = 0;

var use_media_server = false;
var media_server = '';
if ((typeof (media_server) != "undefined") && (media_server != '')) {
	if (media_server.substring((media_server.length - 1)) != '/') media_server += '/';
	media_server += scoid + '/';
}

if (!offline && use_media_server && media_server == '') {
	var media_pp = location.pathname.split('/');
	media_pp.pop();
	var pathname = media_pp.join('/');

	media_server = 'mms://' + location.host + pathname;
	if (media_server.substring((media_server.length - 1)) != '/') media_server += '/';
}


var thai = true;


if (window.location.search.length > 0) {
	var strQuery = window.location.search.substring(1);
	var arrQuery = strQuery.split(';');
	for (var i = 0; i < arrQuery.length; i++) {
		var arr_value = arrQuery[i].split('=');
		var arrval = arr_value[0].toLowerCase();
		if ((arr_value[1] != null) && (arr_value[1] != '')) {
			switch (arrval) {
				case "page":
					pagenow = arr_value[1];
					break;
			}
		}
	}
}



if (!offline) {
	var resultsco = startSCO();
	usescorm = display = (resultsco == "true") ? true : false;
}

if (display) {

	var score_suit = [];

	document.write("<div class='w-100 p-3 p-md-5' id=mainBG align=\"center\" ><div class='row' style='max-width: 1280px;' ><div class='col mx-auto'><div class='card'><div class='card-header text-center'><h1 class='text-danger fs-1'>แบบทดสอบ</h1></div><div class='card-body'><div class='row h-100'><div class='col h-100'><iframe name=\"nolpifrm\" id=\"nolpifrm\" src=\"about:blank\" frameborder=\"0\" onload=\"onMyFrameLoad(this)\"></iframe></div></div></div></div></div></div></div>");

	setSystemMsg(); chgPage(scoid, pagenow); startCounter();
}
