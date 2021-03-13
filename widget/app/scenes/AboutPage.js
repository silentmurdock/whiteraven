function SceneAboutPage() {}

SceneAboutPage.prototype.initialize = function () {
}

SceneAboutPage.prototype.handleShow = function () {
	document.getElementById('OverlayVideoMenu').style.visibility = "hidden";

    widgetAPI.putInnerHTML(document.getElementById('aboutinfo'), aboutInfoText[lang] + aboutFooterText[lang]);
    var heightcount = document.getElementById('abouttitle').offsetHeight;
    heightcount += document.getElementById('aboutlogo').offsetHeight;
    heightcount += document.getElementById('aboutinfo').offsetHeight;
    document.getElementById('OverlayAboutPage').style.height = heightcount - 10;

    document.getElementById('OverlayAboutPage').style.visibility = "visible";
    
};

SceneAboutPage.prototype.handleHide = function () {
	document.getElementById('OverlayAboutPage').style.visibility = "hidden";
	
    //document.getElementById('OverlayAboutPage').style.height = 0;
    document.getElementById('OverlayVideoMenu').style.visibility = "visible";
    document.getElementById('OverlayMenuInfo').style.visibility = "visible";
};

SceneAboutPage.prototype.handleFocus = function () {};

SceneAboutPage.prototype.handleBlur = function () {};

SceneAboutPage.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('AboutPage');
            	sf.scene.focus('MainMenu');
            	break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
};

SceneAboutPage.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};