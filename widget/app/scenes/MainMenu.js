function SceneMainMenu() {}

SceneMainMenu.prototype.initialize = function () {
    this.pos = 0;
}

SceneMainMenu.prototype.handleShow = function () {
    this.initialize();
    this.SetZIndex("visible", 100);

    var menulist = document.getElementById('menulist');
    menulist.style.top = 'initial';
    widgetAPI.putInnerHTML(menulist, "");

    if (SERVER_OK == true && mainMenuText['name'].length == 7) {
        mainMenuText[lang].splice(4, 0, additionalMenuText[lang]);
        mainMenuText['name'].splice(4, 0, additionalMenuText['name']);
    } else if (SERVER_OK == false && mainMenuText['name'].length == 8) {
        mainMenuText[lang].splice(4, 1);
        mainMenuText['name'].splice(4, 1);
    }

    for(var i=0; i<mainMenuText['name'].length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        widgetAPI.putInnerHTML(aitem, mainMenuText[lang][i]);
        listitem.appendChild(aitem);
        menulist.appendChild(listitem);
    }

    if (mainMenuText['name'].length > 0) {
        if (mainMenuText['name'].length < 8) {
            document.getElementById('OverlayVideoMenu').style.height = ((mainMenuText['name'].length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((mainMenuText['name'].length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlayVideoMenu').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((8 - 1) * 46) + 80;
        }
        document.getElementById('OverlayVideoMenu').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + mainMenuText['name'].length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
}

SceneMainMenu.prototype.handleHide = function () {
	document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    //document.getElementById('OverlayVideoMenu').style.top = 26;
    //document.getElementById('OverlayVideoMenu').style.height = 40;
    
    document.getElementsByClassName('active')[0].className = "";
    if (querytype == 'search') {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsTextNoGenres[lang]);
    } else if (querytype == 'favourites') {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouritesettingsText[lang]);
    } else {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
    }
    this.SetZIndex("hidden", 5);
};

SceneMainMenu.prototype.handleFocus = function () {};

SceneMainMenu.prototype.handleBlur = function () {};

SceneMainMenu.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.ENTER:
    	        var menulist = document.getElementById('menulist').getElementsByTagName("li");
                for(var i=0; i<menulist.length; i++) {
                    if (menulist[i].children[0].className == 'active') {

                        var itemname = mainMenuText['name'][i];
                        break;
                    }
                }

    	        switch (itemname) {
    	        	case "movies":
                        sf.scene.hide('MainMenu');
    	        		sf.scene.focus('Main');
    		        	ShowMoviesMenu('all', 'popularity.desc');
    		        	break;
    	        	case "shows":
                        sf.scene.hide('MainMenu');
    	        		sf.scene.focus('Main');
    		        	ShowShowsMenu('all', 'popularity.desc');
    		        	break;
                    case "favourites":
                        sf.scene.hide('MainMenu');
                        sf.scene.focus('Main');
                        ShowFavouritesMenu();
                        break;
    	        	case "search":
                        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    	        		sf.scene.show('SearchPage');
    	        		sf.scene.focus('SearchPage');
    		        	break;
                    case "receive":
                        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
                        sf.scene.show('ReceiverPage', { caller: "MainMenu" });
                        sf.scene.focus('ReceiverPage');
                        //ShowSettingsPage();
                        break;
    	        	case "settings":
    	        		sf.scene.show('SettingsPage');
    	        		sf.scene.focus('SettingsPage');
    		        	//ShowSettingsPage();
    		        	break;
    	        	case "about":
                        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    	        		//sf.scene.hide('MainMenu');
    	        		sf.scene.show('AboutPage');
    	        		sf.scene.focus('AboutPage');
    		        	break;
    	        	case "exit":
    		        	StartStopWRServer("stop");
                		sf.core.exit(false);
    		        	break;    
    	        }
    	        break;
            case sf.key.TOOLS:
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('MainMenu');
            	sf.scene.focus('Main');
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
        case sf.key.UP:
            var menulist = document.getElementById('menulist').getElementsByTagName("li");
            for(var i=0; i<menulist.length; i++) {
                if (menulist[i].children[0].className == 'active') {
                    menulist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var nameul = document.getElementById('menulist');
                            nameul.style.top = nameul.offsetTop + 46;
                            i--;
                        }
                    }
                    menulist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + menulist.length);
                }
            }
            break;
        case sf.key.DOWN:
            var menulist = document.getElementById('menulist').getElementsByTagName("li");
            for(var i=0; i<menulist.length; i++) {
                if (menulist[i].children[0].className == 'active') {
                    menulist[i].children[0].className = "";
                    if (this.pos < 7 && this.pos < (menulist.length - 1)) {
                        this.pos++;
                        i++;
                    } else {
                        if (i < menulist.length - 1) {
                            var nameul = document.getElementById('menulist');
                            nameul.style.top = nameul.offsetTop - 46;
                            i++;
                        }
                    }
                    menulist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + menulist.length);
                }
            }
            break;             
    }
};

SceneMainMenu.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};

SceneMainMenu.prototype.RemoveReceiverElement = function() {
    if (mainMenuText['name'].length == 8) {
        mainMenuText[lang].splice(4, 1);
        mainMenuText['name'].splice(4, 1);
    }
};