function SceneGenresMenu() {}

SceneGenresMenu.prototype.initialize = function () {
    this.pos = 0;
}

SceneGenresMenu.prototype.handleShow = function () {
    this.initialize();
    this.SetZIndex("visible", 100);

    var thegenrelist = document.getElementById('genrelist');
    thegenrelist.style.top = 'initial';
    widgetAPI.putInnerHTML(thegenrelist, "");

    for(var i=0; i<genresMenuText['genre'].length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        widgetAPI.putInnerHTML(aitem, genresMenuText[lang][i]);
        listitem.appendChild(aitem);
        thegenrelist.appendChild(listitem);
    }

    if (genresMenuText['genre'].length > 0) {
        if (genresMenuText['genre'].length < 8) {
            document.getElementById('OverlayGenresMenu').style.height = ((genresMenuText['genre'].length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((genresMenuText['genre'].length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlayGenresMenu').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((8 - 1) * 46) + 80;
        }
        document.getElementById('OverlayGenresMenu').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + genresMenuText['genre'].length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
};

SceneGenresMenu.prototype.handleHide = function () {
	document.getElementById('OverlayGenresMenu').style.visibility = "hidden";
    document.getElementById('OverlayGenresMenu').style.height = 0;
    document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
    this.SetZIndex("hidden", 5);
};

SceneGenresMenu.prototype.handleFocus = function () {};

SceneGenresMenu.prototype.handleBlur = function () {};

SceneGenresMenu.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.GREEN:
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('GenresMenu');
            	sf.scene.focus('Main');
            	break;
            case sf.key.ENTER:
                var genrelist = document.getElementById('genrelist').getElementsByTagName("li");
                for(var i=0; i<genrelist.length; i++) {
                    if (genrelist[i].children[0].className == 'active') {
                        document.getElementById('OverlayGenresMenu').style.visibility = "hidden";
                        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
                        
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
                        this.SetZIndex("hidden", 5);

                        sf.scene.hide('GenresMenu');
                        sf.scene.focus('Main');

                        if (querytype == "movie") {
                            ShowMoviesMenu(genresMenuText['genre'][i], sortby);
                        } else if (querytype == "tv") {
                            ShowShowsMenu(genresMenuText['genre'][i], sortby);
                        }
                        break;
                    }
                }
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
    switch (keyCode) {
        case sf.key.DOWN:
                var genrelist = document.getElementById('genrelist').getElementsByTagName("li");
                for(var i=0; i<genrelist.length; i++) {
                    if (genrelist[i].children[0].className == 'active') {
                        genrelist[i].children[0].className = "";
                        if (this.pos < 7 && this.pos < (genrelist.length - 1)) {
                            this.pos++;
                            i++;
                        } else {
                            if (i < genrelist.length - 1) {
                                var genreul = document.getElementById('genrelist');
                                genreul.style.top = genreul.offsetTop - 46;
                                i++;
                            }
                        }
                        genrelist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + genrelist.length);
                    }
                }
                break;
        case sf.key.UP:
            var genrelist = document.getElementById('genrelist').getElementsByTagName("li");
            for(var i=0; i<genrelist.length; i++) {
                if (genrelist[i].children[0].className == 'active') {
                    genrelist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var genreul = document.getElementById('genrelist');
                            genreul.style.top = genreul.offsetTop + 46;
                            i--;
                        }
                    }
                    genrelist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + genrelist.length);
                }
            }
            break;            
    }
};

SceneGenresMenu.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};