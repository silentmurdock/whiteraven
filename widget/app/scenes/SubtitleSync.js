function SceneSubtitleSync() {}

SceneSubtitleSync.prototype.initialize = function () {
    this.offset = 0; // time offset in ms
}

SceneSubtitleSync.prototype.handleShow = function () {
    document.getElementById('OverlaySubtitleMenu').style.visibility = "hidden";
    document.getElementById('OverlayPlayerMenuInfo').style.visibility = "hidden";

    widgetAPI.putInnerHTML(document.getElementById('subtitleSyncHTML'), subtitleSyncText[lang] + (this.offset / 10).toFixed(3) + ' s');
    document.getElementById('OverlaySubtitleSync').style.visibility = "visible";    
};

SceneSubtitleSync.prototype.handleHide = function () {
	document.getElementById('OverlaySubtitleSync').style.visibility = "hidden";
    document.getElementById('OverlaySubtitleMenu').style.visibility = "visible";
    document.getElementById('OverlayPlayerMenuInfo').style.visibility = "visible";
};

SceneSubtitleSync.prototype.handleFocus = function () {};

SceneSubtitleSync.prototype.handleBlur = function () {};

SceneSubtitleSync.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('SubtitleSync');
            	sf.scene.focus('SubtitleMenu');
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
    switch (keyCode) {
        case sf.key.LEFT:
            this.offset = this.offset - 1;
            sf.scene.get('PlayerPage').setSubtitleOffset(this.offset);
            widgetAPI.putInnerHTML(document.getElementById('subtitleSyncHTML'), subtitleSyncText[lang] + (this.offset / 10).toFixed(3) + ' s');
            break;
        case sf.key.RIGHT:
            this.offset = this.offset + 1;
            sf.scene.get('PlayerPage').setSubtitleOffset(this.offset);
            widgetAPI.putInnerHTML(document.getElementById('subtitleSyncHTML'), subtitleSyncText[lang] + (this.offset / 10).toFixed(3) + ' s');
            break;
        case sf.key.DOWN:
            this.offset = this.offset - 10;
            sf.scene.get('PlayerPage').setSubtitleOffset(this.offset);
            widgetAPI.putInnerHTML(document.getElementById('subtitleSyncHTML'), subtitleSyncText[lang] + (this.offset / 10).toFixed(3) + ' s');
            break;
        case sf.key.UP:
            this.offset = this.offset + 10;
            sf.scene.get('PlayerPage').setSubtitleOffset(this.offset);
            widgetAPI.putInnerHTML(document.getElementById('subtitleSyncHTML'), subtitleSyncText[lang] + (this.offset / 10).toFixed(3) + ' s');
            break;              
    }
};

SceneSubtitleSync.prototype.ClearOffset = function () {
    this.offset = 0;
}