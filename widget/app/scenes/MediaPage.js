function SceneMediaPage() {}

SceneMediaPage.prototype.initialize = function () {
}

SceneMediaPage.prototype.handleShow = function (arguments) {
    // sf.scene.show('MediaPage', {filename: 'Test.mkv', resolution: '720x360', bitrate: '30 fps', audio: '1 channel'});
    var data =  '<DL>' +
                '<DT>' + mediaPageText[lang][0] + '</DT>' + 
                '<DD>' + arguments.filename + '</DD><SPAN></SPAN>' +
                '<DT>' + mediaPageText[lang][1] + '</DT>' +
                '<DD>' + arguments.resolution + '</DD><SPAN></SPAN>' +
                '<DT>' + mediaPageText[lang][2] + '</DT>' +
                '<DD>' + arguments.bitrate + '</DD><SPAN></SPAN>' +
                '<DT>' + mediaPageText[lang][3] + '</DT>' +
                '<DD>' + arguments.audio + '</DD><SPAN></SPAN>' +
                '</DL>';

    widgetAPI.putInnerHTML(document.getElementById('mediapageinfo'), data);

    document.getElementById('OverlayMediaPage').style.height = document.getElementById('mediapageinfo').offsetHeight;
    document.getElementById('OverlayMediaPage').style.visibility = "visible";    
};

SceneMediaPage.prototype.handleHide = function () {
	document.getElementById('OverlayMediaPage').style.visibility = "hidden";
};

SceneMediaPage.prototype.handleFocus = function () {};

SceneMediaPage.prototype.handleBlur = function () {};

SceneMediaPage.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('MediaPage');
            	sf.scene.focus('PlayerPage');
            	break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
            // Comment out this case for real time Player Menu Auto Hide testing    
            /*case sf.key.CH_UP:
                sf.scene.get('PlayerPage').playerMenuAutoHideTest();
                break;*/
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
};

SceneMediaPage.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};