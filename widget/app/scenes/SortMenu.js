function SceneSortMenu() {}

SceneSortMenu.prototype.initialize = function () {
    this.pos = 0;
}

SceneSortMenu.prototype.handleShow = function () {
    this.initialize();
    this.SetZIndex("visible", 100);

    var thesortlist = document.getElementById('sortlist');
    thesortlist.style.top = 'initial';
    widgetAPI.putInnerHTML(thesortlist, "");

    for(var i=0; i<sortMenuText['name'].length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        widgetAPI.putInnerHTML(aitem, sortMenuText[lang][i]);
        listitem.appendChild(aitem);
        thesortlist.appendChild(listitem);
    }

    if (sortMenuText['name'].length > 0) {
        if (sortMenuText['name'].length < 8) {
            document.getElementById('OverlaySortMenu').style.height = ((sortMenuText['name'].length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((sortMenuText['name'].length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlaySortMenu').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((8 - 1) * 46) + 80;
        }
        document.getElementById('OverlaySortMenu').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + sortMenuText['name'].length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
};

SceneSortMenu.prototype.handleHide = function () {
	document.getElementById('OverlaySortMenu').style.visibility = "hidden";
    document.getElementById('OverlaySortMenu').style.height = 0;
    document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
    this.SetZIndex("hidden", 5);
};

SceneSortMenu.prototype.handleFocus = function () {};

SceneSortMenu.prototype.handleBlur = function () {};

SceneSortMenu.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RED:
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('SortMenu');
            	sf.scene.focus('Main');
            	break;
            case sf.key.ENTER:
                var sortlist = document.getElementById('sortlist').getElementsByTagName("li");
                for(var i=0; i<sortlist.length; i++) {
                    if (sortlist[i].children[0].className == 'active') {
                        document.getElementById('OverlaySortMenu').style.visibility = "hidden";
                        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
                        
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
                        this.SetZIndex("hidden", 5);

                        sf.scene.hide('SortMenu');
                        sf.scene.focus('Main');

                        if (querytype == "movie") {
                            ShowMoviesMenu(genretype, sortMenuText['name'][i]);
                        } else if (querytype == "tv") {
                            ShowShowsMenu(genretype, sortMenuText['name'][i]);
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
                var sortlist = document.getElementById('sortlist').getElementsByTagName("li");
                for(var i=0; i<sortlist.length; i++) {
                    if (sortlist[i].children[0].className == 'active') {
                        sortlist[i].children[0].className = "";
                        if (this.pos < 7 && this.pos < (sortlist.length - 1)) {
                            this.pos++;
                            i++;
                        } else {
                            if (i < sortlist.length - 1) {
                                var genreul = document.getElementById('sortlist');
                                genreul.style.top = genreul.offsetTop - 46;
                                i++;
                            }
                        }
                        sortlist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + sortlist.length);
                    }
                }
                break;
        case sf.key.UP:
            var sortlist = document.getElementById('sortlist').getElementsByTagName("li");
            for(var i=0; i<sortlist.length; i++) {
                if (sortlist[i].children[0].className == 'active') {
                    sortlist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var genreul = document.getElementById('sortlist');
                            genreul.style.top = genreul.offsetTop + 46;
                            i--;
                        }
                    }
                    sortlist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + sortlist.length);
                }
            }
            break;            
    }
};

SceneSortMenu.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};