var vid; 
let video_playbackRate = localStorage.getItem("playbackRate") || 1;
let video_muted = (localStorage.getItem("muted") == 'unmuted') ? false:true || false;
try {
    vid = document.getElementById("lessonvideo");
    vid.currentTime = video_currentTime;
    vid.playbackRate = video_playbackRate;
    vid.muted = video_muted;
    vid.requestPictureInPicture;
} catch (e) {

}

$( document ).ready(function() {
    if(video_playbackRate == 1.5){
        $('.iconSpeed2x').text('1x');
    }
    if(localStorage.getItem("muted") == 'muted'){
        $(".iconMute").removeClass("fa-volume-up").addClass("fa-volume-mute");
    }
});

function seektimeupdate(vid) {
    var curmins = Math.floor(vid.currentTime / 60);
    var cursecs = Math.floor(vid.currentTime - curmins * 60);
    var durmins = Math.floor(vid.duration / 60);
    var dursecs = Math.floor(vid.duration - durmins * 60);
    var seekslider = document.getElementById("seekslider");
    if (cursecs < 10) {
        cursecs = "0" + cursecs;
    }
    if (dursecs < 10) {
        dursecs = "0" + dursecs;
    }
    if (curmins < 10) {
        curmins = "0" + curmins;
    }
    if (durmins < 10) {
        durmins = "0" + durmins;
    }
    curtimetext.innerHTML = curmins + ":" + cursecs;
    durtimetext.innerHTML = durmins + ":" + dursecs;
    $("#seekslider").prop("title", curmins + ":" + cursecs);
    var nt = vid.currentTime * (100 / vid.duration);
    seekslider.value = nt;
}

function setRange(seek) {
    var currtime = seek * vid.duration / 100;
    vid.currentTime = currtime;
    $.ajax({
        url: local_api + "switcher/updatevidtime/" + vid.currentTime,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
            ProfileID: getCookie("cookieProfileID"),
            pageID: pageID,
            lessonID: lessonID 
        })
    }).fail(function() {
        refreshtoken()
    });
}

function setBack(seek) {
    if (vid.played.end(0) > seek) {
        var currtime = seek * vid.duration / 100;
        vid.currentTime = currtime;
        $.ajax({
            url: local_api + "switcher/updatevidtime/" + vid.currentTime,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
            },
            data: JSON.stringify({
                ProfileID: getCookie("cookieProfileID"),
                pageID: pageID,
                lessonID: lessonID 
            })
        }).fail(function() {
            refreshtoken()
        });
    }
}

function butPlay() {
    vid.play();
    $(".iconPlay").toggleClass("fas fa-play fas fa-pause");
    $(".btnplay").hide();
}

function butMute() {

    if((vid.muted) == true){
        vid.muted = false;
        localStorage.setItem("muted", 'unmuted');  

    }else{
        vid.muted = true
        localStorage.setItem("muted", 'muted');  

    }
    $.ajax({
        url: local_api + "switcher/videomuted/" + vid.muted,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        }
    });
    $(".iconMute").toggleClass("fas fa-volume-mute fas fa-volume-up");
}

function butSpeed2x() {

    if((vid.playbackRate == 1)){
        $('.iconSpeed2x').text('1x');
        vid.playbackRate = 1.5;
        localStorage.setItem("playbackRate", 1.5);  
    }else{
        $('.iconSpeed2x').text('2x');
        vid.playbackRate = 1;
        localStorage.setItem("playbackRate", 1);  
    }
    $.ajax({
        url: local_api + "switcher/videospeed/" + vid.playbackRate,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
    });
}

function butFullscreen() {
    if (vid.mozRequestFullScreen) {
        vid.mozRequestFullScreen();
    } else if (vid.webkitRequestFullScreen) {
        vid.webkitRequestFullScreen();
    }
}

function butPause() {
    vid.pause();
    $(".iconPlay").toggleClass("fas fa-play fas fa-pause");
    $(".btnplay").show();
    $.ajax({
        url: local_api + "switcher/updatevidtime/" + vid.currentTime,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
            ProfileID: getCookie("cookieProfileID"),
            pageID: pageID,
            lessonID: lessonID 
        })
    }).fail(function() {
        refreshtoken()
    });
}

function butReplay() {
    vid.currentTime = 0.1;
    $(".btnplay").hide();
    $.ajax({
        url: local_api + "switcher/updatevidtime/" + vid.currentTime,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: JSON.stringify({
            ProfileID: getCookie("cookieProfileID"),
            pageID: pageID,
            lessonID: lessonID 
        })
    }).fail(function() {
        refreshtoken()
    });
    vid.play();
}

function PlayPause($this) {
    $this.paused ? butPlay() : butPause();
}

function PlayPauseButton() {
    vid.paused ? butPlay() : butPause();
}
var ie = msieversion();

function msieversion() {
    var ie = false;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
    {
        ie = true;
    }
    return ie;
}

function Modalurl(url, id, type) {
    if (id == "" || id == undefined) id = 0;  
}