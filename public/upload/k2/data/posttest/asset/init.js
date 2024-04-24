window.finishSCO_called = false;
function finish(){
	if(!window.finishSCO_called && LMSIsInitialized()){
		window.finishSCO_called = true;
		finishSCO();/* This function live in file 'nolp_script.js' */
	}
}
window.onload = function(){
	window.onunload = finish;
	window.onbeforeunload = window.onunload;
	window.onpagehide = window.onunload;
	/* You can add more override function*/
};