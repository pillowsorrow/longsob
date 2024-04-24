﻿/*** 8016 ***/
var head = document.head;

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';

// var css = document.createElement('link');
// css.rel = 'stylesheet';
// css.href = '../../../node_modules/sweetalert2/dist/sweetalert2.min.css';

var bsscript = document.createElement('script');
bsscript.type = 'text/javascript';
bsscript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';

var bscss = document.createElement('link');
bscss.rel = 'stylesheet';
bscss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';

var css2 = document.createElement('link');
css2.rel = 'stylesheet';
css2.href = './asset/posttest.css';

// Fire the loading
head.appendChild(script);
// head.appendChild(css);
head.appendChild(css2);
head.appendChild(bscss);
head.appendChild(bsscript);


var scoid = '968';
var direction = ' ';
var direction_sound = '';
var showanswer = false;
var showanswer_no = 2;
var offline = false;
var shuffle_question = false;
var score_save = true;
var score = 0;
var testformat = 1;
var thai = true;
var system_message = '';
var random_choice = false;
var random_question = 0;
var percentmasteryscore = 70;
var random_question_array = [];
var question_wrong = [];
var question_answer = [];

var tf_label_true = 'True';
var tf_label_false = 'False';

var suspend_data = 0;
var usescorm = false;

if ((usescorm) && (showanswer) && (showanswer_no > 0)) {
	suspend_data = parent.doLMSGetValue("cmi.suspend_data");

	if (isNaN(suspend_data) || (suspend_data == null) || (suspend_data == '')) suspend_data = 0;
	suspend_data++;

	if (suspend_data) {
		/*
		if((!isNaN(suspend_data)) && (suspend_data != null) && (suspend_data != ''))
			showanswer = (showanswer_no <= parseInt(suspend_data))?true:false;
		else
			showanswer = false;
		*/
		showanswer = ((!isNaN(suspend_data)) && (suspend_data != null) && (suspend_data != '')) ? ((showanswer_no <= parseInt(suspend_data)) ? true : false) : false;
	}
	else
		showanswer = false;
}
else {
	if (showanswer_no > 1) showanswer = false;
}


var question = new Array();
var question_score = new Array();
var choice = new Array();
var question_comment = new Array();
var question_origin_index = new Array();
var question_origin_name = new Array();

question_origin_name[0] = 'บทที่ 1 ';
question_origin_name[1] = 'บทที่ 2 ';
question_origin_name[2] = 'บทที่ 3 ';
question_origin_name[3] = 'บทที่ 4  ';
question_origin_name[4] = 'บทที่ 5 ';
question_origin_name[5] = 'บทที่ 6 ';
question_origin_name[6] = 'บทที่ 7 ';
question_origin_name[7] = 'บทที่ 8 ';
question_origin_name[8] = 'บทที่ 9 ';
question_origin_name[9] = 'บทที่ 10 ';
question_origin_name[10] = 'บทที่ 11  ';

//* Question: 1********************
question[0] = 'ข้อใดคือของใช้ส่วนตน';
question_score[0] = '1';
choice[0] = new Array();

//* Question: 2********************
question[1] = 'ข้อใดคือของใช้ส่วนตน';
question_score[1] = '1';
choice[1] = new Array();

//* Question: 3********************
question[2] = 'ข้อใดคือของใช้ส่วนรวม';
question_score[2] = '1';
choice[2] = new Array();

//* Question: 4********************
question[3] = 'ข้อใดคือของใช้ส่วนตน';
question_score[3] = '1';
choice[3] = new Array();

//* Question: 5********************
question[4] = 'ข้อใดคือของใช้ส่วนรวม';
question_score[4] = '1';
choice[4] = new Array();

//* Question: 6********************
question[5] = 'ข้อใดคือของใช้ส่วนตนภายในบ้าน';
question_score[5] = '1';
choice[5] = new Array();

//* Question: 7********************
question[6] = 'ข้อใดคือของใช้ส่วนรวมภายในห้องเรียน';
question_score[6] = '1';
choice[6] = new Array();

//* Question: 8********************
question[7] = 'ข้อใดคือของใช้ส่วนรวมภายในบ้าน';
question_score[7] = '1';
choice[7] = new Array();

//* Question: 9********************
question[8] = 'ข้อใดคือของใช้ส่วนตนภายในห้องเรียน';
question_score[8] = '1';
choice[8] = new Array();

//* Question: 10********************
question[9] = 'ข้อใดคือของใช้ส่วนรวมภายในบ้าน';
question_score[9] = '1';
choice[9] = new Array();
choice[0][0] = new Array();
choice[0][0][0] = '<center><img src=\"asset/3075_20038.jpg\" border=0 name=\"img0\" height=100></center>';
choice[0][0][1] = '0';

choice[0][1] = new Array();
choice[0][1][0] = '<center><img src=\"asset/3075_20039.jpg\" border=0 name=\"img0\" height=100></center>';
choice[0][1][1] = '1';

choice[0][2] = new Array();
choice[0][2][0] = '<center><img src=\"asset/3075_20040.jpg\" border=0 name=\"img0\" height=100></center>';
choice[0][2][1] = '0';

choice[1][0] = new Array();
choice[1][0][0] = '<center><img src=\"asset/3075_20041.jpg\" border=0 name=\"img0\" height=100></center>';
choice[1][0][1] = '1';

choice[1][1] = new Array();
choice[1][1][0] = '<center><img src=\"asset/3075_20042.jpg\" border=0 name=\"img0\" height=100></center>';
choice[1][1][1] = '0';

choice[1][2] = new Array();
choice[1][2][0] = '<center><img src=\"asset/3075_20043.jpg\" border=0 name=\"img0\" height=100></center>';
choice[1][2][1] = '0';

choice[2][0] = new Array();
choice[2][0][0] = '<center><img src=\"asset/3075_20044.jpg\" border=0 name=\"img0\" height=100></center>';
choice[2][0][1] = '0';

choice[2][1] = new Array();
choice[2][1][0] = '<center><img src=\"asset/3075_20045.jpg\" border=0 name=\"img0\" height=100></center>';
choice[2][1][1] = '1';

choice[2][2] = new Array();
choice[2][2][0] = '<center><img src=\"asset/3075_20046.jpg\" border=0 name=\"img0\" height=100></center>';
choice[2][2][1] = '0';

choice[3][0] = new Array();
choice[3][0][0] = '<center><img src=\"asset/3075_20047.jpg\" border=0 name=\"img0\" height=100></center>';
choice[3][0][1] = '0';

choice[3][1] = new Array();
choice[3][1][0] = '<center><img src=\"asset/3075_20048.jpg\" border=0 name=\"img0\" height=100></center>';
choice[3][1][1] = '0';

choice[3][2] = new Array();
choice[3][2][0] = '<center><img src=\"asset/3075_20049.jpg\" border=0 name=\"img0\" height=100></center>';
choice[3][2][1] = '1';

choice[4][0] = new Array();
choice[4][0][0] = '<center><img src=\"asset/3075_20050.jpg\" border=0 name=\"img0\" height=100></center>';
choice[4][0][1] = '0';

choice[4][1] = new Array();
choice[4][1][0] = '<center><img src=\"asset/3075_20051.jpg\" border=0 name=\"img0\" height=100></center>';
choice[4][1][1] = '0';

choice[4][2] = new Array();
choice[4][2][0] = '<center><img src=\"asset/3075_20052.jpg\" border=0 name=\"img0\" height=100></center>';
choice[4][2][1] = '1';

choice[5][0] = new Array();
choice[5][0][0] = '<center><img src=\"asset/3075_20053.jpg\" border=0 name=\"img0\" height=100></center>';
choice[5][0][1] = '1';

choice[5][1] = new Array();
choice[5][1][0] = '<center><img src=\"asset/3075_20054.jpg\" border=0 name=\"img0\" height=100></center>';
choice[5][1][1] = '0';

choice[5][2] = new Array();
choice[5][2][0] = '<center><img src=\"asset/3075_20055.jpg\" border=0 name=\"img0\" height=100></center>';
choice[5][2][1] = '0';

choice[6][0] = new Array();
choice[6][0][0] = '<center><img src=\"asset/3075_20056.jpg\" border=0 name=\"img0\" height=100></center>';
choice[6][0][1] = '0';

choice[6][1] = new Array();
choice[6][1][0] = '<center><img src=\"asset/3075_20057.jpg\" border=0 name=\"img0\" height=100></center>';
choice[6][1][1] = '0';

choice[6][2] = new Array();
choice[6][2][0] = '<center><img src=\"asset/3075_20058.jpg\" border=0 name=\"img0\" height=100></center>';
choice[6][2][1] = '1';

choice[7][0] = new Array();
choice[7][0][0] = '<center><img src=\"asset/3075_20059.jpg\" border=0 name=\"img0\" height=100></center>';
choice[7][0][1] = '0';

choice[7][1] = new Array();
choice[7][1][0] = '<center><img src=\"asset/3075_20060.jpg\" border=0 name=\"img0\" height=100></center>';
choice[7][1][1] = '1';

choice[7][2] = new Array();
choice[7][2][0] = '<center><img src=\"asset/3075_20061.jpg\" border=0 name=\"img0\" height=100></center>';
choice[7][2][1] = '0';

choice[8][0] = new Array();
choice[8][0][0] = '<center><img src=\"asset/3075_20062.jpg\" border=0 name=\"img0\" height=100></center>';
choice[8][0][1] = '0';

choice[8][1] = new Array();
choice[8][1][0] = '<center><img src=\"asset/3075_20063.jpg\" border=0 name=\"img0\" height=100></center>';
choice[8][1][1] = '0';

choice[8][2] = new Array();
choice[8][2][0] = '<center><img src=\"asset/3075_20064.jpg\" border=0 name=\"img0\" height=100></center>';
choice[8][2][1] = '1';

choice[9][0] = new Array();
choice[9][0][0] = '<center><img src=\"asset/3075_20065.jpg\" border=0 name=\"img0\" height=100></center>';
choice[9][0][1] = '1';

choice[9][1] = new Array();
choice[9][1][0] = '<center><img src=\"asset/3075_20066.jpg\" border=0 name=\"img0\" height=100></center>';
choice[9][1][1] = '0';

choice[9][2] = new Array();
choice[9][2][0] = '<center><img src=\"asset/3075_20067.jpg\" border=0 name=\"img0\" height=100></center>';
choice[9][2][1] = '0';

question[0] = '<audio  id=player1  src="asset/mp3/1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player1\')"> ' + question[0];
question[1] = '<audio  id=player2  src="asset/mp3/2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player2\')"> ' + question[1];
question[2] = '<audio  id=player3  src="asset/mp3/3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player3\')"> ' + question[2];
question[3] = '<audio  id=player4  src="asset/mp3/4.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player4\')"> ' + question[3];
question[4] = '<audio  id=player5  src="asset/mp3/5.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player5\')"> ' + question[4];
question[5] = '<audio  id=player6  src="asset/mp3/6.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player6\')"> ' + question[5];
question[6] = '<audio  id=player7  src="asset/mp3/7.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player7\')"> ' + question[6];
question[7] = '<audio  id=player8  src="asset/mp3/8.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player8\')"> ' + question[7];
question[8] = '<audio  id=player9  src="asset/mp3/9.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player9\')"> ' + question[8];
question[9] = '<audio  id=player10  src="asset/mp3/10.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player10\')"> ' + question[9];



choice[0][0][0] = '<audio  id=player1-1  src="asset/mp3/1-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player1-1\')">&nbsp;' +choice[0][0][0] ;
choice[0][1][0] = '<audio  id=player1-2  src="asset/mp3/1-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player1-2\')">&nbsp;' +choice[0][1][0] ;
choice[0][2][0] = '<audio  id=player1-3  src="asset/mp3/1-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player1-3\')">&nbsp;' +choice[0][2][0] ;

choice[1][0][0] = '<audio  id=player2-1  src="asset/mp3/2-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player2-1\')">&nbsp;' +choice[1][0][0] ;
choice[1][1][0] = '<audio  id=player2-2  src="asset/mp3/2-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player2-2\')">&nbsp;' +choice[1][1][0] ;
choice[1][2][0] = '<audio  id=player2-3  src="asset/mp3/2-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player2-3\')">&nbsp;' +choice[1][2][0] ;

choice[2][0][0] = '<audio  id=player3-1  src="asset/mp3/3-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player3-1\')">&nbsp;' +choice[2][0][0] ;
choice[2][1][0] = '<audio  id=player3-2  src="asset/mp3/3-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player3-2\')">&nbsp;' +choice[2][1][0] ;
choice[2][2][0] = '<audio  id=player3-3  src="asset/mp3/3-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player3-3\')">&nbsp;' +choice[2][2][0] ;

choice[3][0][0] = '<audio  id=player4-1  src="asset/mp3/4-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player4-1\')">&nbsp;' +choice[3][0][0] ;
choice[3][1][0] = '<audio  id=player4-2  src="asset/mp3/4-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player4-2\')">&nbsp;' +choice[3][1][0] ;
choice[3][2][0] = '<audio  id=player4-3  src="asset/mp3/4-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player4-3\')">&nbsp;' +choice[3][2][0] ;

choice[4][0][0] = '<audio  id=player5-1  src="asset/mp3/5-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player5-1\')">&nbsp;' +choice[4][0][0] ;
choice[4][1][0] = '<audio  id=player5-2  src="asset/mp3/5-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player5-2\')">&nbsp;' +choice[4][1][0] ;
choice[4][2][0] = '<audio  id=player5-3  src="asset/mp3/5-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player5-3\')">&nbsp;' +choice[4][2][0] ;

choice[5][0][0] = '<audio  id=player6-1  src="asset/mp3/6-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player6-1\')">&nbsp;' +choice[5][0][0] ;
choice[5][1][0] = '<audio  id=player6-2  src="asset/mp3/6-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player6-2\')">&nbsp;' +choice[5][1][0] ;
choice[5][2][0] = '<audio  id=player6-3  src="asset/mp3/6-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player6-3\')">&nbsp;' +choice[5][2][0] ;

choice[6][0][0] = '<audio  id=player7-1  src="asset/mp3/7-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player7-1\')">&nbsp;' +choice[6][0][0] ;
choice[6][1][0] = '<audio  id=player7-2  src="asset/mp3/7-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player7-2\')">&nbsp;' +choice[6][1][0] ;
choice[6][2][0] = '<audio  id=player7-3  src="asset/mp3/7-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player7-3\')">&nbsp;' +choice[6][2][0] ;

choice[7][0][0] = '<audio  id=player8-1  src="asset/mp3/8-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player8-1\')">&nbsp;' +choice[7][0][0] ;
choice[7][1][0] = '<audio  id=player8-2  src="asset/mp3/8-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player8-2\')">&nbsp;' +choice[7][1][0] ;
choice[7][2][0] = '<audio  id=player8-3  src="asset/mp3/8-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player8-3\')">&nbsp;' +choice[7][2][0] ;

choice[8][0][0] = '<audio  id=player9-1  src="asset/mp3/9-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player9-1\')">&nbsp;' +choice[8][0][0] ;
choice[8][1][0] = '<audio  id=player9-2  src="asset/mp3/9-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player9-2\')">&nbsp;' +choice[8][1][0] ;
choice[8][2][0] = '<audio  id=player9-3  src="asset/mp3/9-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player9-3\')">&nbsp;' +choice[8][2][0] ;

choice[9][0][0] = '<audio  id=player10-1  src="asset/mp3/10-1.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player10-1\')">&nbsp;' +choice[9][0][0] ;
choice[9][1][0] = '<audio  id=player10-2  src="asset/mp3/10-2.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player10-2\')">&nbsp;' +choice[9][1][0] ;
choice[9][2][0] = '<audio  id=player10-3  src="asset/mp3/10-3.mp3"  ></audio><img height=30 style=\'cursor: pointer;\' title=\'Play\'  src=asset/sound.gif onclick="Play(\'player10-3\')">&nbsp;' +choice[9][2][0] ;





function Play(pid) {
	// alert("OK");
	for( i=1;i<10;i++ ){
		nplay = "player"+i;
		myAudio = document.getElementById(nplay);
		myAudio.pause();
		myAudio.currentTime = 0;
		myAudio = document.getElementById(nplay+"-1");
		myAudio.pause();
		myAudio.currentTime = 0;
		myAudio = document.getElementById(nplay+"-2");
		myAudio.pause();
		myAudio.currentTime = 0;
		myAudio = document.getElementById(nplay+"-3");
		myAudio.pause();
		myAudio.currentTime = 0;		
	}
	
	myAudio = document.getElementById(pid);
	if (myAudio.paused) {
		myAudio.play();
	}
	else {
		myAudio.pause();
		myAudio.currentTime = 0;
	}
}


var fb_range = [];


var outChoice = "";
var outAns = "";
var cChoice = "กขคงจฉช";
var cNo = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45");
//var cNo=new Array("๐","๑","๒","๓","๔","๕","๖","๗","๘","๙","๑๐");
var qid = 1;
var chkans2 = false;

function genQuestion(no, a, chkans, ans) {

	if (chkans) {
		chkans2 = true;
		var txtq = '<div id=q' + no + ' name=q' + no + ' class="questions">';
	} else {
		var txtq = '<div id=q' + no + ' name=q' + no + ' class="questions">';
		//		var txtq = '<div id=q'+no+' name=q'+no+' style="position:absolute; left:2.5cm; top:2.5cm; visibility:visible">';
	}


	txtq += '<table class="table-borderless w-100 d-block">';
	if (question[a]) {

		txtq += '<tr bgcolor="#e6e6e5" class="w-100"> ';
		txtq += '<td align="right" valign=middle colspan="2">';
		//		txtq += '<IMG SRC="asset/speaker.png" WIDTH="30" HEIGHT="30" BORDER="0" ALT="ฟังเสียง"  style="cursor: pointer" onclick="qPlayer(\''+no+'\')">';
		//		txtq += '<strong><font size="6" face="THSarabunPSKBold">'+cNo[no]+'.</font></strong></td>';
		//	if(no==1) txtq += '<td valign="bottom"><font size="6" face="THSarabunPSKBold">';
		txtq += '<font size="6" face="THSarabunPSKBold">';
		txtq += ' ' + cNo[no] + '. ';
		txtq += question[a];
		txtq += '</font></td>';
		txtq += '</tr>';

		bgc = "#F5F5F5";
		if (no % 2) bgc = "#E5E9E9";

		if (chkans) {
			outChoice += '<tr id="tq' + no + '" bgcolor="' + bgc + '" onclick="showhide(' + no + ');showbg(' + no + ')" ><td width="25" align="center"><div id="cho_' + no + '" style="color: #000000;font-family:THSarabunPSKBold; font-size: 22">' + cNo[no] + '.</div></td>';
		} else {
			outChoice += '<tr id="tq' + no + '" bgcolor="' + bgc + '" onclick="showhide(' + no + ');" ><td width="25" align="center"><div id="cho_' + no + '" style="color: #000000;font-family:THSarabunPSKBold; font-size: 22">' + cNo[no] + '.</div></td>';
		}

		var correct = false;
		var correctChoice = 0;
		var txtch = '<table width="100%" border="0" cellspacing="2" cellpadding="4">';

		for (c = 0; c < choice[a].length; c++) {
			var ch_radio = '<font size="6" face="THSarabunPSKBold">' + cChoice.charAt(c) + '.</font>';
			if (chkans) {
				//				outChoice +=  '<td align="center"><input type="radio" name="ch_'+no+'" value="'+c+'" class="bigButton"  ';
				outChoice += '<td align="center"><span id="tch_' + no + '_' + c + '" name="tch_' + no + '_' + c + '" > ';
				txtch += '<tr valign="middle"> ';
			} else {
				//				outChoice +=  '<td align="center"><input type="radio" name="ch_'+no+'" value="'+c+'" onClick="setAns('+no+','+c+')"   class="bigButton" ';
				outChoice += '<td align="center" onClick="setAns(' + no + ',' + c + ')"><input type="radio" name="ch_' + no + '" value="' + c + '" style="position:absolute; display :none"><span id="tch_' + no + '_' + c + '" name="tch_' + no + '_' + c + '" style="cursor: pointer;"><img src=asset/c.gif>';
				txtch += '<tr valign="middle"> ';
			}

			//			var ch_radio = '<input type="radio" name="ch_'+no+'" value="'+c+'"';

			outAns = "bgimage";
			if (chkans) {
				if (ans == c) {
					//					outChoice +=' checked';
					outChoice += '<img src=asset/m.gif>';
					//					outAns += 'document.getElementById(\'ch_'+no+'_'+c+'\').style.backgroundImage = "url(asset/ans.gif)"; ';
					outAns = "bgimage1";


					if (choice[a][c][1] == 1) {
						//						score+=parseInt(question_score[a]);  
						score += 1;			  /// ---------------- fix ข้อละคะแนน = 2
						correct = true;
						correctChoice = c;
					}
					txtch += '<td width=17 align="center" valign="middle"><!--<img src=asset/';
					txtch += (correct) ? '1' : '0';
					txtch += '.png style="float:left;margin-top:3px;">--></td>';

				}
				else {
					//					outChoice += ' disabled';
					outChoice += '<img width=21 src=asset/spacer.gif>';
					txtch += '<td width=17 align="center" valign="middle">';

					if (showanswer) {
						if (choice[a][c][1] == 1) {
							txtch += '<img src=asset/1.png  style="float:left;margin-top:3px;">';
							//ch_radio = '<img src=asset/arrow.gif>';
							choice[a][c][0] = '<font color=GREEN>' + choice[a][c][0] + '</font>';
							correctChoice = c;
						}
					}
					if (choice[a][c][1] == 1) {
						correctChoice = c;
					}
					txtch += '</td>';
				}
			} else {
				txtch += '<td width=17 align="center" valign="middle"><img src=asset/spacer.gif  width=24px style="float:left;margin-top:3px;"></td>';
			}

			outChoice += '</span></td>';

			var answer_icon = '';
			if (chkans) {
				answer_icon = '<img src=asset/';
				answer_icon += (correct) ? '1' : '0';
				answer_icon += '.png>';
			}

			//			txtch += '<td width="30" valign="top"><IMG SRC="asset/spacer.gif" WIDTH="30" HEIGHT="30" BORDER="0" ALT="ฟังเสียง"  style="cursor: pointer" onclick="chPlayer(\''+no+'_'+(parseInt(c)+1)+'\')"></td>';
			txtch += '<td width="28" align="center"  valign="middle" class="' + outAns + '" name="ch_' + no + '_' + c + '" id="ch_' + no + '_' + c + '" onClick="setAns(' + no + ',' + c + ')" style="cursor: pointer">';

			txtch += ch_radio;
			txtch += '</td>';
			txtch += '<td valign="middle" align="center">';
			txtch += choice[a][c][0];
			txtch += '</td>';
			txtch += '</tr>';
		}
		txtch += '</table>';

		//		txtq += '<tr><td align="center">'+answer_icon+'</td>';
		//		txtq += '<tr><td align="center">&nbsp;</td>';
		txtq += '<tr><td valign="top" colspan="4">';
		txtq += txtch;
		txtq += '</td></tr>';
		/*		if(chkans && no == 16){
					txtq += '<tr><td valign="top" colspan="2">';
					txtq += '<span style="color:red;"><u>หมายเหตุ</u> จะจ่ายเพียง 80% หากมีการเคลมโรคร้ายแรงระดับต้นถึงปานกลางแล้ว</span>';
					txtq += '</td></tr>';
				}
		*/
		if (chkans) {
			outChoice += '<td align="center">' + answer_icon + '</td></tr>';
			if (!correct) {
				question_wrong.push(a);
			}
			question_answer.push([parseInt(ans), correctChoice]);
		} else {
			outChoice += '</td></tr>';
		}

	}

	txtq += '</table>';
	//txtq += '<div><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=\"javascript: showhide(\'66\')\" style=\"cursor: pointer\"><IMG SRC=\"asset/prev.gif\" BORDER=\"0\" ALT=\"ย้อนกลับ\" width=25 height=25></span>&nbsp;&nbsp;&nbsp;<span onclick=\"javascript: showhide(\'99\')\" style=\"cursor: pointer\"><IMG SRC=\"asset/go.gif\" BORDER=\"0\" ALT=\"ถัดไป\" width=25 height=25></span></div>';
	txtq += '</div>';
	//alert(txtq);
	//alert(outChoice);
	return txtq;
}

function checkAnswer(frm) {
	var chr = checkRadio(frm);
	if (chr == "0") {

		var el = frm.elements;
		var sel = '';
		var sel2 = new Array();
		var s = 0;
		for (var i = 0; i < el.length; ++i) {
			if (el[i].type == "radio") {
				var radiogroup = el[el[i].name];
				sel2[s] = el[i].name;
				var itemchecked = false;
				for (var j = 0; j < radiogroup.length; ++j) {
					if (radiogroup[j].checked) {

						if (s > 0) {
							if (sel2[(s - 1)] != el[i].name) {
								if (sel == '') sel = radiogroup[j].value; else sel += ':' + radiogroup[j].value;
							}
						}
						else {
							if (sel == '') sel = radiogroup[j].value; else sel += ':' + radiogroup[j].value;
						}
						s++;
					}
				}
			}
		}


		if (sel == '') {
			// alert(system_message['mustdoquiz']);

			Swal.fire({
				icon: 'info',
				text: system_message['mustdoquiz']
			});
		}
		else {
			var sel3 = sel.split(':');
			var text_ans = '';
			var e = 1;
			var txt_show = '';
			var divtst = document.getElementById("divTest");
			divtst.innerHTML = "";

			//					document.write('<style type="text/css">.bgimage { background-image: url(asset/spacer.gif); background-repeat: no-repeat; background-position: top; font-family:"THSarabunPSKBold"; font-size: 28 } .choice {cursor: pointer}</style>');
			//document.write('<style type="text/css">.bgimage { background-image: url(asset/spacer.gif); background-repeat: no-repeat; background-position: top; font-family:THSarabunPSKBold; font-size: 26 } .choice {cursor: pointer} @font-face {    font-family: \'THSarabunPSKBold\';    src: url(\'THSarabunPSKBold_bold-webfont.eot\');    src: url(\'THSarabunPSKBold_bold-webfont.eot?#iefix\') format(\'embedded-opentype\'),         url(\'THSarabunPSKBold_bold-webfont.woff\') format(\'woff\'),         url(\'THSarabunPSKBold_bold-webfont.ttf\') format(\'truetype\'),         url(\'THSarabunPSKBold_bold-webfont.svg#THSarabunPSKBold\') format(\'svg\');    font-weight: normal;    font-style: normal;}font{	font-family: \'THSarabunPSKBold\';	font-size: 26;}.bigButton{	width: 28px; height: 28px;cursor: pointer;}</style>');

			if (showanswer == true)
				//						document.write('<font size=4 face="THSarabunPSKBold" color=#FF0000> ( '+system_message['remark']+' ) </font><br>&nbsp;');

				//-----1----???????????????????
				outChoice = "";
			//divtst.innerHTML += '<div id="divTest2" style="position:absolute;left:0.0cm; top:0.0cm; width:100% " >';
			divtst.innerHTML += '<table width="100%" border="0" cellspacing="0" cellpadding="2">';
			divtst.innerHTML += '  <tr bgcolor=#FBFBFB> ';
			divtst.innerHTML += '    <td width="675"><span style="width:675px;height:450px;overflow-x:hidden;overflow-y:auto;">';
			//					divtst.innerHTML += '<div style="position:absolute; left:0cm; top:0cm;  width:680" ><center><strong><font size=4 face="THSarabunPSKBold"><U>'+system_message['chkanswer']+'</U>&nbsp;&nbsp; </font></strong></center><p>');
			//divtst.innerHTML += '<div style="position:absolute; left:0cm; top:1cm;width:650;padding:10px 0px 0px 0px;background-color:white;" >&nbsp;&nbsp;&nbsp;<font size=5 face="THSarabunPSKBold" color=black ><span style="font-size: 28">เฉลยแบบทดสอบ <font color="red"></span></font></div>';
			//	divtst.innerHTML += '<div style="position:absolute; left:0cm; top:0cm;  width:680" ><span style="font-size: 28">&nbsp;&nbsp;&nbsp;'+direction+' </span></div>');
			//-----1----

			for (e = 0; e < random_question; e++) {
				divtst.innerHTML += genQuestion((e + 1), e, true, sel3[e]);
			}

			//-----2----???????????????????
			divtst.innerHTML += '</span>    </td >';
			divtst.innerHTML += '    <td valign=middle>';
			divtst.innerHTML += '      <table id="tq" width="100%" border="1" cellspacing="0" cellpadding="2" bgcolor=#D8D6D7 style="display:none;">';
			/*divtst.innerHTML += '		<tr><td rowspan="2" align="center">ข้อ</td ><td colspan="'+(choice[1].length+1)+'" align="center">ตัวเลือก</td >';
			divtst.innerHTML += '		<tr>';
			for(c=0;c<choice[1].length;c++)
			{
				divtst.innerHTML += '			<td align="center">'+cChoice.charAt(c)+'</td >';
			}
				divtst.innerHTML += '			<td align="center">&nbsp;</td >';
				divtst.innerHTML += '		</tr>';
				divtst.innerHTML += outChoice;*/
			divtst.innerHTML += '        </table>';
			divtst.innerHTML += '    </td >';
			divtst.innerHTML += '  </tr></table>';
			//divtst.innerHTML += '  </div>';
			//-----2----

			document.getElementById('btleft').style.display = 'none';
			document.getElementById('btright').style.display = 'block';

			displayMsg(score, sel3.length * 1);     /// ---------------- fix ข้อละคะแนน = 1

		}
		//document.write('<SCRIPT LANGUAGE="JavaScript">qid = 1;var agt=navigator.userAgent.toLowerCase();var browser_ie  = (agt.indexOf("msie") != -1);var browser_ns  = (navigator.appName.indexOf("Netscape") != -1); function showhide(id){ if(id == 66) id = qid>1?qid-1:qid;if(id == 99) id = qid<30?qid+1:qid;if(qid != id ) qid = id;for(i=0;i<'+random_question+';i++){document.getElementById(\'q\'+(i+1)).style.display = \'none\';document.getElementById(\'cho_\'+(i+1)).style.color = \'#000000\';document.getElementById(\'cho_\'+(i+1)).style.fontSize = 22;}document.getElementById(\'q\'+id).style.display = \'block\';document.getElementById(\'cho_\'+id).style.color = \'#FF00CC\';document.getElementById(\'cho_\'+id).style.fontSize = 22;parent.document.getElementById(\'numchoice\').innerHTML = id;showbg(id);} function moAns(tr,n){	tr.bgColor="#FFCCCC";} function muAns(tr,n){	if (n%2) bgc = "#CCFFCC";	else bgc = "#F5F5F5";	tr.bgColor=bgc;} function startPlayer(id) { if(qid != id ) {qid = id;src =  "./sound/"+id+".mp3";var wmObject = document.getElementById(\'wmp_p\');if(browser_ie) wmObject.fileName = src;if(browser_ns) wmObject.URL = src;}    }function qPlayer(id) { var wmObject = document.getElementById(\'wmp_p\');src =  "./sound/"+id+".mp3";if(browser_ie) wmObject.fileName = src;if(browser_ns) wmObject.URL = src;    }function chPlayer(chid) { var wmObject = document.getElementById(\'wmp_p\');src =  "./sound/"+chid+".mp3";if(browser_ie) wmObject.fileName = src;if(browser_ns) wmObject.URL = src;    }function showbg(n){for (i=1; i<=30 ; i++ ){ var tq = "tq"+i; if (i%2) bgc = "#E5E9E9"; else bgc = "#F5F5F5"; document.getElementById(tq).bgColor = bgc;} document.getElementById("tq"+n).bgColor = "#CCFFCC";}function showtBox(n) { document.getElementById(\'tBox_\'+n).style.display = \'block\'; } function hiddentBox(n) { document.getElementById(\'tBox_\'+n).style.display = \'none\'; }'+outAns+'</SCRIPT>');

		//if(browser_ie) document.write(wmp_ie());
		//if(browser_ns) document.write(wmp_ns());
		qid = 1;
		showhide('1');
	} else {
		// alert(system_message['mustdoquiz'] +" (ข้อ "+chr.substring(3)+") ");

		Swal.fire({
			icon: 'info',
			text: system_message['mustdoquiz'] + " (ข้อ " + chr.substring(3) + ") "
		});
	}
}

function checkRadio(frm) {
	var el = frm.elements;
	for (var i = 0; i < el.length; ++i) {
		if (el[i].type == "radio") {
			var radiogroup = el[el[i].name];
			var itemchecked = false;
			for (var j = 0; j < radiogroup.length; ++j) {
				if (radiogroup[j].checked) {
					itemchecked = true;
					break;
				}
			}
			if (!itemchecked) {
				return el[i].name;
			}
		}
	}
	return "0";
}


if (random_question <= 0) random_question = question.length;
for (var i = 0; i < question.length; i++) {
	random_question_array.push(i);
}
function RandomQuestion() {
	/*
	var Len = random_question;
	var j = question.length;
	var num = new Array();
	
	for (i=0; i<Len; i++){
		n = Math.floor(j  *  Math.random());
		if(num[n]) 
			i--;
		else
			num[n] = 1;
	}

	var q = new Array();
	var ch = new Array();
	var i = 0;
	for(var id in num){
		q[i] = question[id];
		ch[i] = choice[id];
		i++;
	}

	question = q;
	choice = ch;
	*/
	var currentIndex = question.length;
	var temporaryQ;
	var temporaryC;
	var temporaryR;
	var randomIndex;
	var temprandonarray = [];

	for (var i = 0; i < currentIndex; i++) {
		temprandonarray.push(i);
	}

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryQ = question[currentIndex];
		temporaryC = choice[currentIndex];
		temporaryR = temprandonarray[currentIndex];
		question[currentIndex] = question[randomIndex];
		choice[currentIndex] = choice[randomIndex];
		temprandonarray[currentIndex] = temprandonarray[randomIndex];
		question[randomIndex] = temporaryQ;
		choice[randomIndex] = temporaryC;
		temprandonarray[randomIndex] = temporaryR;
	}
	random_question_array = temprandonarray.slice();
}

function RandomSuit(suit) {
	Temp = new Array();
	TempCh = new Array();
	var Len = suit.length;
	var j = Len;

	for (var i = 0; i < Len; i++) {
		Temp[i] = suit[i];
	}

	for (i = 0; i < Len; i++) {
		Num = Math.floor(j * Math.random());
		suit[i] = Temp[Num];
		for (var k = Num; k < j; k++) {
			Temp[k] = Temp[k + 1];
		}

		j--;
	}

	return suit;
}


//if(direction == '') direction = '????????????????';
if (direction == '') direction = system_message['direction'];
//direction = system_message['direction'];

// document.write('<style type="text/css"></style>');
document.write('<a name="top"></a>');
document.write('<form name="frmexam" method="post" class="h-fit">');
// document.write('<div id="divTest" style="position:absolute;left:0.0cm; top:0.0cm; z-index:1;width:100% " >');
document.write('<div id="divTest">');

//-----1----..........................
document.write('<table class="d-block table-borderless">');
document.write('  <tr class="d-block"> ');
document.write('    <td class="d-block"><span class="d-block">');
// document.write('    <td width="700"><span style="width:700px;height:450px;overflow-x:hidden;overflow-y:auto;">');
document.write('<div class="d-block">' + direction + '</div>');
// document.write('<div style="position:absolute; left:0cm; top:1cm; width:750;padding:10px 0px 0px 0px;"><font size=5 face="THSarabunPSKBold" color=black ><span style="font-size: 28">&nbsp;&nbsp;&nbsp;' + direction + ' </span> </font></div>');
//-----1----
//alert(direction);
if (testformat == 2) {
	document.write('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
	document.write('  <tr bgcolor=#e6e6e5> ');
	document.write('    <td  width=50 align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">' + tf_label_true + '</font></td>');
	document.write('    <td  width=50 align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">' + tf_label_false + '</font></td>');
	document.write('    <td  align="center">&nbsp;</td>');
	document.write('  </tr>');
}

if (shuffle_question) RandomQuestion();

for (i = 0; i < random_question; i++) {
	if (random_choice) choice[i] = RandomSuit(choice[i]);
	document.write(genQuestion((i + 1), i, false, 0));
}

//-----2----..........................
// document.write('</span>    </td >');
document.write('</td >');
document.write('    <td>');
//	document.write('<CENTER><BR><input type="button" name="Submit" value="ส่งตรวจ" onclick="checkAnswer(document.frmexam)"></CENTER>');
document.write('<IMG SRC="asset/spacer.gif" WIDTH="1" HEIGHT="5"><table id="tq" width="100%" border="1" cellspacing="0" cellpadding="2" bgcolor=#D8D6D7 style="display:none;">');
document.write('		<tr><td rowspan="2"  align="center">ข้อ</td ><td colspan="' + choice[1].length + '" align="center">ตัวเลือก</td >');
document.write('		<tr>');
for (c = 0; c < choice[1].length; c++) {
	document.write('			<td align="center">' + cChoice.charAt(c) + '</td >');
}
document.write('		</tr>');
document.write(outChoice);
document.write('        </table>');
//document.write('<CENTER><input id="submitbutton" type="button" name="Submit" value="ตรวจคำตอบ" onclick="checkAnswer(document.frmexam)" style="font-size: 18px;position:absolute;top:8px;left:500px;width:140px;display:none;"></CENTER>');
document.write('    </td >');
document.write('  </tr></table>');
//-----2----

document.write('</div>');
document.write('</form>');
document.write('<div class="row mx-0"><div class="col-auto mx-auto"><button id="submitbutton" class="btn btn-primary btn-lg px-5 chk-ans" type="button" name="Submit" value="ตรวจคำตอบ" onclick="checkAnswer(document.frmexam)">ตรวจคำตอบ</button></div></div>');
//alert(outChoice);

document.write('<div class="w-100 card fixed-bottom"><div class="card-body"> <div class="row"> <div class="col-auto my-auto"> <img src="asset/prev.gif" class="btn-nav" title="ย้อนกลับ" width="40" height="40" id="btleft" onclick="javascript: showhide(\'66\')"> </div> <div class="col text-center my-auto"> <b id="skin">ข้อที่ <span id=numchoice>1</span>/' + random_question + '</b> </div> <div class="col-auto my-auto"> <img src="asset/next.gif" class="btn-nav" title="ถัดไป" width="40" height="40" id="btright" onclick="javascript: showhide(\'99\')"> </div> </div> </div></div>');

function checkAnswer2(frm) {
	var chr = checkRadio(frm);
	return parseInt(chr.substring(3));
}

var currentnumq = 0;
function showhide(id) { //alert(qid);
	var chkanscurrent = false;
	var lastdoneq = 0;
	if (id == 99 && qid < random_question) {
		lastdoneq = checkAnswer2(document.frmexam);
	}
	else {
		chkanscurrent = true;
	}
	currentnumq = qid;
	if (isNaN(lastdoneq)) {
		lastdoneq = random_question;
	}
	//alert(currentnumq + " " + lastdoneq);
	if (lastdoneq > currentnumq) {
		chkanscurrent = true;
	}
	else {
		if (lastdoneq != 0 && !isNaN(lastdoneq) && id != 66) {
			// alert("กรุณาทำข้อสอบข้อที่ "+lastdoneq+" ด้วยค่ะ");

			Swal.fire({
				icon: 'info',
				text: "กรุณาทำข้อสอบข้อที่ " + lastdoneq + " ด้วยค่ะ"
			});
		}
	}
	if (chkanscurrent) {
		if (id == 66) id = qid > 1 ? qid - 1 : qid;
		if (id == 99) id = qid < random_question ? qid + 1 : qid;
		if (qid != id) qid = id;
		for (i = 0; i < random_question; i++) {
			document.getElementById('q' + (i + 1)).style.display = 'none';
			if (!chkans2) {
				document.getElementById('cho_' + (i + 1)).style.color = '#000000';
				document.getElementById('cho_' + (i + 1)).style.fontSize = 22;
			}
			//parent.document.getElementById('numq_'+(i+1)).style.color = "#000000";
		}
		document.getElementById('q' + id).style.display = 'block';
		if (!chkans2) {
			document.getElementById('cho_' + id).style.color = '#FF00CC';
			document.getElementById('cho_' + id).style.fontSize = 22;
		}
		//parent.document.getElementById('numq_'+id).style.color = "#0880FA";
		document.getElementById('numchoice').innerHTML = id;

		if (id == 1) {
			document.getElementById('btleft').style.display = 'none';
		} else {
			document.getElementById('btleft').style.display = 'block';
		}
		if (id == random_question) {
			document.getElementById('btright').style.display = 'none';
		}
		else {
			document.getElementById('btright').style.display = 'block';
		}

		if (document.getElementById('submitbutton') != null) {
			if (id == random_question) {
				document.getElementById('submitbutton').style.display = 'block';
			}
			else {
				document.getElementById('submitbutton').style.display = 'none';
			}
		}
		//	startPlayer(id);
		if (!chkans2) {
			showbg(id);
		}
	}
}

function showbg(n) {

	for (i = 1; i <= random_question; i++) {
		var tq = "tq" + i;
		if (i % 2) bgc = "#E5E9E9";
		else bgc = "#F5F5F5";

		document.getElementById(tq).bgColor = bgc;
	}
	document.getElementById("tq" + n).bgColor = "#CCFFCC";
}

var agt = navigator.userAgent.toLowerCase();
var browser_ie = (agt.indexOf("msie") != -1);
var browser_ns = (navigator.appName.indexOf("Netscape") != -1);

//alert(browser_ie);
//alert(browser_ns);
//if(browser_ie) document.write(wmp_ie());
//if(browser_ns) document.write(wmp_ns());

function startPlayer(id) { //alert(qid+":"+id);
	if (qid != id) {
		qid = id;
		src = "./sound/" + id + ".mp3";

		var wmObject = document.getElementById('wmp_p');
		if (browser_ie) wmObject.fileName = src;
		if (browser_ns) wmObject.URL = src;
	}
}

function qPlayer(id) { //alert(id);
	var wmObject = document.getElementById('wmp_p');
	src = "./sound/" + id + ".mp3";
	if (browser_ie) wmObject.fileName = src;
	if (browser_ns) wmObject.URL = src;
}
function chPlayer(chid) {
	var wmObject = document.getElementById('wmp_p');
	src = "./sound/" + chid + ".mp3";
	if (browser_ie) wmObject.fileName = src;
	if (browser_ns) wmObject.URL = src;
}

function wmp_ns() {
	s = '<object id="wmp_p" type="application/x-ms-wmp" width="0" height="0" >';
	s += '<param name="autostart" value="true" />';
	s += '<param name="volume" value="80" />';
	s += '<param name="URL" value="" />';
	s += '</object>';
	return s;
}

function wmp_ie() {
	var fb_sound = "";

	var s = '';
	s += '<OBJECT ID="wmp_p" name="wmp_p" classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" ';
	s += 'codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" ';
	s += 'standby="Loading Microsoft? Windows? Media Player components..." ';
	s += 'type="application/x-oleobject" width="1" height="1">';
	s += '<PARAM NAME="FileName" value="' + fb_sound + '">';
	s += '<param name="ShowControls" value="1">';
	s += '<param name="ShowPositionControls" value="0">';
	s += '<param name="ShowAudioControls" value="1">';
	s += '<param name="ShowTracker" value="0">';
	s += '<param name="ShowDisplay" value="0">';
	s += '<param name="ShowStatusBar" value="1">';
	s += '<param name="AutoSize" value="0">';
	s += '<param name="ShowGotoBar" value="0">';
	s += '<param name="ShowCaptioning" value="0">';
	s += '<param name="AutoStart" value="1">';
	s += '<param name="AnimationAtStart" value="0">';
	s += '<param name="TransparentAtStart" value="0">';
	s += '<param name="AllowScan" value="1">';
	s += '<param name="EnableContextMenu" value="1">';
	s += '<param name="Volume" value="80">';
	s += '<param name="ClickToPlay" value="0">';
	s += '<EMBED type="application/x-mplayer2" ';
	s += 'pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" ';
	s += 'src="' + fb_sound + '"	';
	s += 'name="wmp_p"	';
	s += 'id="wmp_p"	';
	s += 'width=1	';
	s += 'height=1	';
	s += 'autostart=0 ';
	s += 'Volume=80 ';
	s += 'showcontrols=1	showpositioncontrols=0	showstatusbar=0	showcaptioning=0>';
	s += '</EMBED>';
	s += '</OBJECT>';
	//alert(s);
	return s;
}


//----- ......................
function moAns(tr, n) {
	tr.bgColor = '#FFCCCC';
}
function muAns(tr, n) {
	if (n % 2) bgc = "#CCFFCC";
	else bgc = "#F5F5F5";
	tr.bgColor = bgc;
}
function setAns(n, c) {
	var Ans = "url(asset/ans.gif)";
	var cAns = "url(asset/spacer.gif)";
	//alert(n+":"+c+":"+cAns+":"+choice[n-1].length+":"+question[n-1]);
	for (var i = 0; i < choice[n - 1].length; i++) {
		document.getElementById('ch_' + n + '_' + i).style.backgroundImage = cAns;
		document.getElementById('tch_' + n + '_' + i).innerHTML = "<img src=asset/c.gif>";
	}
	elm = eval("document.frmexam.ch_" + n);
	elm[c].checked = true;
	document.getElementById('ch_' + n + '_' + c).style.backgroundImage = Ans;
	document.getElementById('tch_' + n + '_' + c).innerHTML = "<img src=asset/m.gif>";
	//	alert(n+":"+c);
}
function AtoT(data) {
	var cNo = new Array("๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙", "๑๐");
	var outdata = "";
	data += '';

	for (i = 0; i < data.length; i++) {
		outdata += cNo[data.substr(i, 1)];
	}
	return outdata;
}

function showtBox(n) { document.getElementById('tBox_' + n).style.display = 'block'; }
function hiddentBox(n) { document.getElementById('tBox_' + n).style.display = 'none'; }

showhide('1');
//-------------------


/*
var fb_range = new Array();
fb_range[0] = new Array();
fb_range[0][0] = 0;
fb_range[0][1] = 100;
fb_range[0][2] = 'aaaaa';
fb_range[0][3] = 'asset/';
fb_range[0][4] = 'aaaaaa.wma';

document.write(codeMediaFeedback('55'));
*/




function Feedback(score) {
	var show = '';
	var scr = Math.floor(score);
	if (!isNaN(scr)) {
		if (typeof (fb_range) != 'undefined') {

			for (var i = 0; i < fb_range.length; i++) {
				if ((fb_range[i][0] == scr) || (fb_range[i][1] == 1) || ((fb_range[i][0] <= scr) && (fb_range[i][1] >= scr))) {

					if (fb_range[i][4] != '') {
						var fb_sound = fb_range[i][3] + fb_range[i][4];
						var fb_sound_holder = sound(fb_sound);
						var fb_layer = drawLayer(fb_sound_holder, 'ContentHolderFB', 0, 0, 0, 0, 2, 0);
						document.body.innerHTML += fb_layer;
					}

					if (fb_range[i][2] != '') {
						//						alert(fb_range[i][2]);
						show = fb_range[i][2];
					}

					break;
				}
			}
		}
	}

	//	return (show)?true:false;
	return show;
}


function codeMediaFeedback(v) {
	var fb_sound = fb_range[v][3] + fb_range[v][4];

	var s = '';
	s += '<OBJECT ID="MediaPlayerFB' + v + '" classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" ';
	s += 'codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" ';
	s += 'standby="Loading Microsoft? Windows? Media Player components..." ';
	s += 'type="application/x-oleobject" width="1" height="1">';
	s += '<PARAM NAME="FileName" value="' + fb_sound + '">';
	s += '<param name="ShowControls" value="1">';
	s += '<param name="ShowPositionControls" value="0">';
	s += '<param name="ShowAudioControls" value="1">';
	s += '<param name="ShowTracker" value="0">';
	s += '<param name="ShowDisplay" value="0">';
	s += '<param name="ShowStatusBar" value="1">';
	s += '<param name="AutoSize" value="0">';
	s += '<param name="ShowGotoBar" value="0">';
	s += '<param name="ShowCaptioning" value="0">';
	s += '<param name="AutoStart" value="0">';
	s += '<param name="AnimationAtStart" value="0">';
	s += '<param name="TransparentAtStart" value="0">';
	s += '<param name="AllowScan" value="1">';
	s += '<param name="EnableContextMenu" value="1">';
	s += '<param name="Volume" value="100">';
	s += '<param name="ClickToPlay" value="0">';
	s += '<EMBED type="application/x-mplayer2" ';
	s += 'pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" ';
	s += 'src="' + fb_sound + '"	';
	s += 'name="MediaPlayerFB' + v + '"	';
	s += 'width=1	';
	s += 'height=1	';
	s += 'autostart=0 ';
	s += 'Volume=100 ';
	s += 'showcontrols=1	showpositioncontrols=0	showstatusbar=0	showcaptioning=0>';
	s += '</EMBED>';
	s += '</OBJECT>';

	return s;
}



function displayMsg(score, total) {
	var test_result = "failed";
	var scr = Math.floor((score / total) * 100);

	/*
	var msg = '?????????? '+score+' ???\n???????? '+total+' ???';
	msg+='\n???? '+scr+'%';

	if(!thai) msg = 'Your mark is '+scr+' %';
	*/

	var msg = system_message['score'];
	msg = replaceAll(msg, '{score}', score);
	msg = replaceAll(msg, '{total_score}', total);
	msg = replaceAll(msg, '{pc_score}', scr);

	/*
		if(parent.usescorm){
			if(score_save){
				parent.doLMSSetValue("cmi.core.score.raw",scr);
				parent.doLMSSetValue("cmi.suspend_data",suspend_data);
				parent.doLMSCommit();
			}
		}
	
	*/
	var fb_msg = Feedback(scr);
	if (fb_msg != '') msg = fb_msg + '\n\n' + msg;

	// alert(msg);

	Swal.fire({
		icon: 'info',
		html: msg
	}).then(function() {
		if (scr < percentmasteryscore) {
			var msgalert = '';
			msgalert += 'คุณควรทบทวนเนื้อหาดังต่อไปนี้';
			for (var i = 0; i < question_wrong.length; i++) {
				var chkduporigin = false;
				for (var tmp = 0; tmp < temporigin.length; tmp++) {
					if (temporigin[tmp] == question_origin_index[random_question_array[question_wrong[i]]]) {
						chkduporigin = true;
					}
				}
				if (!chkduporigin) {
					temporigin.push(question_origin_index[random_question_array[question_wrong[i]]]);
				}
			}
			for (var a = 0; a < temporigin.length; a++) {
				for (var b = 1; b < (temporigin.length - a); b++) {
					if (temporigin[b - 1] > temporigin[b]) {
						var temp = temporigin[b - 1];
						temporigin[b - 1] = temporigin[b];
						temporigin[b] = temp;
					}
				}
			}
			for (var i = 0; i < temporigin.length; i++) {
				msgalert += '\n- ' + question_origin_name[temporigin[i]];
			}
			//alert(msgalert);
			// alert("คุณยังทำแบบทดสอบไม่ผ่านเกณฑ์ที่กำหนด\nต้องการทำอีกครั้ง คลิกที่เมนูแบบทดสอบท้ายบท");

			Swal.fire({
				icon: 'error',
				text: "คุณยังทำแบบทดสอบไม่ผ่านเกณฑ์ที่กำหนด\nต้องการทำอีกครั้ง คลิกที่เมนูแบบทดสอบท้ายบท"
			});
		} else {
			// alert("คุณทำแบบทดสอบหลังเรียนผ่านเรียบร้อยแล้ว");	

			Swal.fire({
				icon: 'info',
				text: "คุณทำแบบทดสอบหลังเรียนผ่านเรียบร้อยแล้ว"
			});
		}
	});

	var temporigin = [];

	//console.log(random_question_array);

	//console.log(question_answer);

	if ((window.location.protocol == "http:" || window.location.protocol == "https:") && typeof (parent.parent.isoffline) != "undefined" && typeof (parent.parent.tincan) != "undefined" && typeof (parent.parent.setCurrentPageScore) != "undefined" && typeof (parent.parent.getCurrentPagePassedStatus) != "undefined" && typeof (parent.parent.sendCurrentPagePassedStatement) != "undefined" && typeof (parent.parent.sendAllFullModifyStatement) != "undefined" && typeof (parent.parent.sendAllFullModifyStatementAsync) != "undefined" && typeof (parent.parent.checkResetDITP) != "undefined") {
		if (!parent.parent.isoffline) {
			for (var i = 0; i < question_answer.length; i++) {
				var tmptext = '';
				var tmpresult = 'ผิด';
				if (question_answer[i][0] == question_answer[i][1]) {
					tmpresult = 'ถูก';
				}
				tmptext += 'ข้อ ' + (random_question_array[i] + 1) + '. ตอบ ' + cChoice.charAt(question_answer[i][0]) + '. ผลลัพธ์ ' + tmpresult + '';
				//alert(tmptext);
				parent.parent.sendAllFullModifyStatementAsync("http://adlnet.gov/expapi/verbs/answered", tmptext, "answered");
			}
		}
		parent.parent.setCurrentPageScore(score, total, scr);
		if (!parent.parent.isoffline) {
			parent.parent.sendCurrentPagePassedStatement(parent.parent.getCurrentPagePassedStatus(), score, total, scr);
		}
		//alert("คุณทำแบบทดสอบก่อนเรียนเรียบร้อยแล้ว\nคุณสามารถเข้าเรียนหัวข้อถัดไปได้");
		

	}


}


function setSystemMsg() {
	system_message = new Array();
	system_message['chkanswer'] = (thai) ? 'ตรวจคำตอบ' : 'Check Answer';
	system_message['showanswer'] = (thai) ? 'เฉลยคำตอบ' : 'Show Answer';
	system_message['remark'] = (thai) ? 'หมายเหตุ: ตัวอักษรสีแดง คือคำตอบที่ถูกต้อง' : 'Remark: Red Sentence is Correct Answer.';
	system_message['mustdoquiz'] = (thai) ? 'กรุณาทำข้อสอบให้ครบทุกข้อ' : 'Please select answer.';
	system_message['suspend_data'] = (thai) ? new Array('บันทึกข้อมูลเรียบร้อยแล้ว', 'ข้อความควรมีความยาวรวมทั้งหมดไม่เกิน 4096 ตัวอักษร') : new Array('Already saved data', 'The data must not be length more than 4096 characters');
	system_message['viewscore'] = (thai) ? 'คลิกเพื่อดูคะแนน' : 'Click to view your score';
	system_message['close'] = (thai) ? 'ปิดหน้าต่าง' : 'Close Window';
	system_message['next'] = (thai) ? 'ถัดไป' : 'Next';

	// system_message['score'] = thai ? 'คุณทำข้อสอบได้ {score} คะแนน\nจากทั้งหมด {total_score} คะแนน\nคิดเป็น {pc_score}%' : 'Your mark is {pc_score}%';
	system_message['score'] = thai ? 'คุณทำข้อสอบได้ {score} คะแนน<br>จากทั้งหมด {total_score} คะแนน<br>คิดเป็น {pc_score}%' : 'Your mark is {pc_score}%';
	system_message['avg'] = thai ? 'คุณได้คะแนนเฉลี่ย {pc_score}%\nจากข้อสอบทั้งหมด {total_suit} ชุด' : 'Average Score: {pc_score}%\nFrom {total_suit} exercises';
	system_message['mustdo'] = thai ? 'คุณยังไม่ได้ทำข้อสอบ' : 'You must do:';
	system_message['direction'] = thai ? 'จงเลือกคำตอบที่ถูกต้อง' : 'Please choose the correct answer';
	system_message['finishquiz'] = thai ? 'เมื่ออ่านเฉลยจบแล้ว ให้กดปุ่ม ปิด แล้วรอการประมวลผลจากระบบ' : 'เมื่ออ่านเฉลยจบแล้ว ให้กดปุ่ม ปิด แล้วรอการประมวลผลจากระบบ';
}

setSystemMsg();

function replaceAll(text, tag, value) {
	while ((text.indexOf(tag) != -1) != false)
		text = text.replace(tag, value);
	return text;
}
