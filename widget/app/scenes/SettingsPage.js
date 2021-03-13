function SceneSettingsPage() {}

SceneSettingsPage.prototype.initialize = function () {
    this.pos = 0;
    this.prevtop = document.getElementById('OverlayMenuInfo').style.top;
    this.prevdata = document.getElementById('menuinfo').innerHTML;
}

SceneSettingsPage.prototype.handleShow = function () {
    this.initialize();
    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";

    CreateOrLoadTemp();

    var mainsettingslist = document.getElementById('mainsettingslist');
    mainsettingslist.style.top = 'initial';
    widgetAPI.putInnerHTML(mainsettingslist, "");

    for(var i=0; i<settingsMainMenuText['name'].length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        switch (settingsMainMenuText['name'][i]) {
            case "interface":
                var pos = interfaceLangText['shortcode'].indexOf(lang);
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + interfaceLangText[lang][pos]);
                break;
            case "database":
                var pos = languageListText['shortcode'].indexOf(saveSettings['database']);
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + languageListText[lang][pos]);
                break;
            case "moviesource":
                var outputText = movieSourceListText[lang][0];
                var count = 0;
                for(var j=0; j<movieSourceListText['name'].length; j++) {
                    var itemname = settingsMainMenuText['name'][i] + "_" + movieSourceListText['name'][j];
                    if (saveSettings[itemname] == "true") {
                        outputText = movieSourceListText[lang][j];
                        count++;
                        if (count > 1) {
                            outputText = multipleSourcesText[lang];
                            break;
                        }
                    }
                }
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + outputText);
                break;
            case "tvsource":
                var outputText = tvSourceListText[lang][0];
                var count = 0;
                for(var j=0; j<tvSourceListText['name'].length; j++) {
                    var itemname = settingsMainMenuText['name'][i] + "_" + tvSourceListText['name'][j];
                    if (saveSettings[itemname] == "true") {
                        outputText = tvSourceListText[lang][j];
                        count++;
                        if (count > 1) {
                            outputText = multipleSourcesText[lang];
                            break;
                        }
                    }
                }
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + outputText);
                break;
            case "issubtitleenabled":
                if (saveSettings['issubtitleenabled'] == "true") {
                    widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i]);
                } else {
                    widgetAPI.putInnerHTML(aitem, subtitleDisabledText[lang]);
                }
                break;
            case "subtitlelang":
                var pos = languageListText['shortcode'].indexOf(saveSettings['subtitlelang']);
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + languageListText[lang][pos]);
                break;
            case "subtitlemode":
                var pos = subtitleModeListText['name'].indexOf(saveSettings['subtitlemode']);
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + subtitleModeListText[lang][pos]);
                break;
            case "downspeed":
                var pos = downSpeedListText['name'].indexOf(saveSettings['downspeed']);
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + downSpeedListText[lang][pos]);
                break;
            case "upspeed":
                var pos = upSpeedListText['name'].indexOf(saveSettings['upspeed']);
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i] + ' - ' + upSpeedListText[lang][pos]);
                break;
            case "islogenabled":
                if (saveSettings['islogenabled'] == "true") {
                    widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i]);
                } else {
                    widgetAPI.putInnerHTML(aitem, logDisabledText[lang]);
                }
                break;
            default:
                widgetAPI.putInnerHTML(aitem, settingsMainMenuText[lang][i]);
        }
        
        listitem.appendChild(aitem);
        mainsettingslist.appendChild(listitem);
    }

    if (settingsMainMenuText['name'].length > 0) {
        if (settingsMainMenuText['name'].length < 8) {
            document.getElementById('OverlaySettingsPage').style.height = ((settingsMainMenuText['name'].length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((settingsMainMenuText['name'].length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlaySettingsPage').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((8 - 1) * 46) + 80;
        }

        document.getElementById('OverlaySettingsPage').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + settingsMainMenuText['name'].length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
}

SceneSettingsPage.prototype.handleHide = function () {
	document.getElementById('OverlaySettingsPage').style.visibility = "hidden";
    document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);

    document.getElementById('OverlayVideoMenu').style.visibility = "visible";
};

SceneSettingsPage.prototype.handleFocus = function () {};

SceneSettingsPage.prototype.handleBlur = function () {};

SceneSettingsPage.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
                CreateOrLoadTemp();
            	sf.scene.hide('SettingsPage');
            	sf.scene.focus('MainMenu');
            	break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
            case sf.key.ENTER:
                var mainsettingslist = document.getElementById('mainsettingslist').getElementsByTagName("li");
                for(var i=0; i<mainsettingslist.length; i++) {
                    if (mainsettingslist[i].children[0].className == 'active') {
                        
                        var itemname = settingsMainMenuText['name'][i];
                        break;
                    }
                }
                switch (itemname) {
                    case "interface":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:interfaceLangText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "database":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:languageListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "moviesource":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:movieSourceListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "tvsource":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:tvSourceListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "issubtitleenabled":
                        if (saveSettings['issubtitleenabled'] == "true") {
                            saveSettings['issubtitleenabled'] = "false";
                            mainsettingslist[i].children[0].innerText = subtitleDisabledText[lang];
                        } else {
                            saveSettings['issubtitleenabled'] = "true";
                            mainsettingslist[i].children[0].innerText = settingsMainMenuText[lang][i];
                        }
                        break;
                    case "subtitlelang":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:languageListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "subtitlemode":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:subtitleModeListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "downspeed":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:downSpeedListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "upspeed":
                        sf.scene.show('DataSelect', {dataType:itemname, dataText:upSpeedListText});
                        sf.scene.focus('DataSelect');
                        break;
                    case "islogenabled":
                        if (saveSettings['islogenabled'] == "true") {
                            saveSettings['islogenabled'] = "false";
                            mainsettingslist[i].children[0].innerText = logDisabledText[lang];
                        } else {
                            saveSettings['islogenabled'] = "true";
                            mainsettingslist[i].children[0].innerText = settingsMainMenuText[lang][i];
                        }
                        break;
                    case "save":
                        sf.scene.get('MainMenu').RemoveReceiverElement();
                        SaveTemp();

                        sf.core.loadJS('lang/' + lang + '.js', function () {
                            sf.scene.hide('SettingsPage');
                            sf.scene.hide('MainMenu');
                            
                            sf.scene.focus('Main');
                            
                            RestartServer("loud");
                        });
                        break;
                    case "restore":
                        sf.scene.get('MainMenu').RemoveReceiverElement();
                        RestoreDefaultTemp();
                        
                        sf.core.loadJS('lang/' + lang + '.js', function () {
                            sf.scene.hide('SettingsPage');
                            sf.scene.hide('MainMenu');
                            
                            sf.scene.focus('Main');
                            
                            RestartServer("loud");
                        });
                        break;
                }        
                break;
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
    switch (keyCode) {
        case sf.key.DOWN:
            var mainsettingslist = document.getElementById('mainsettingslist').getElementsByTagName("li");
            for(var i=0; i<mainsettingslist.length; i++) {
                if (mainsettingslist[i].children[0].className == 'active') {
                    mainsettingslist[i].children[0].className = "";
                    if (this.pos < 7 && this.pos < (mainsettingslist.length - 1)) {
                        this.pos++;
                        i++;
                    } else {
                        if (i < mainsettingslist.length - 1) {
                            var nameul = document.getElementById('mainsettingslist');
                            nameul.style.top = nameul.offsetTop - 46;
                            i++;
                        }
                    }
                    mainsettingslist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + mainsettingslist.length);
                }
            }
            break;
        case sf.key.UP:
            var mainsettingslist = document.getElementById('mainsettingslist').getElementsByTagName("li");
            for(var i=0; i<mainsettingslist.length; i++) {
                if (mainsettingslist[i].children[0].className == 'active') {
                    mainsettingslist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var nameul = document.getElementById('mainsettingslist');
                            nameul.style.top = nameul.offsetTop + 46;
                            i--;
                        }
                    }
                    mainsettingslist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + mainsettingslist.length);
                }
            }
            break;
    }
};

SceneSettingsPage.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};