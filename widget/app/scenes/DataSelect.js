function SceneDataSelect() {}

SceneDataSelect.prototype.initialize = function () {
    this.pos = 0;
    this.dataType = '';
    this.dataText = {};
}

SceneDataSelect.prototype.handleShow = function (arguments) {
    this.pos = 0;
    this.dataType = arguments.dataType;
    this.dataText = arguments.dataText;
    this.prevtop = document.getElementById('OverlayMenuInfo').style.top;
    this.prevdata = document.getElementById('menuinfo').innerHTML;

    document.getElementById('OverlaySettingsPage').style.visibility = "hidden";

    var datalist = document.getElementById('datalist');
    datalist.style.top = 'initial';
    widgetAPI.putInnerHTML(datalist, "");

    if (typeof this.dataText['shortcode'] === "undefined") {
        this.dataText['shortcode'] = this.dataText['name'];
    }

    for(var i=0; i<this.dataText['shortcode'].length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        if (this.dataType == "moviesource" || this.dataType == "tvsource") {
            var itemname = this.dataType + "_" + this.dataText['name'][i];
            if (saveSettings[itemname] == "true") {
                widgetAPI.putInnerHTML(aitem, this.dataText[lang][i] + " - " + enabledText[lang]);
            } else {
                widgetAPI.putInnerHTML(aitem, this.dataText[lang][i] + " - " + disabledText[lang]);
            }
        } else {
            widgetAPI.putInnerHTML(aitem, this.dataText[lang][i]);
        }
        listitem.appendChild(aitem);
        datalist.appendChild(listitem);
    }

    if (this.dataText['shortcode'].length > 0) {
        if (this.dataText['shortcode'].length < 8) {
            document.getElementById('OverlayDataSelect').style.height = ((this.dataText['shortcode'].length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((this.dataText['shortcode'].length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlayDataSelect').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((8 - 1) * 46) + 80;
        }

        
        document.getElementById('OverlayDataSelect').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + this.dataText['shortcode'].length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible"; 
    }
};

SceneDataSelect.prototype.handleHide = function () {
	document.getElementById('OverlayDataSelect').style.visibility = "hidden";
    document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);

    // Need because multiple selectable sources
    var mainsettingslist = document.getElementById('mainsettingslist').getElementsByTagName("li");
    if (this.dataType == "moviesource") {
        var outputText = movieSourceListText[lang][0];
        var count = 0;
        for(var i=0; i<this.dataText['name'].length; i++) {    
            var itemname = this.dataType + "_" + this.dataText['name'][i];
            if (saveSettings[itemname] == "true") {
                outputText = movieSourceListText[lang][i];
                count++;
                if (count > 1) {
                    outputText = multipleSourcesText[lang];
                    break;
                }
            }
        }
        if (count == 0) {
            saveSettings['moviesource_yts'] = "true";
        }
        mainsettingslist[2].children[0].innerText = settingsMainMenuText[lang][2] + ' - ' + outputText;
    } else if (this.dataType == "tvsource") {
        var outputText = tvSourceListText[lang][0];
        var count = 0;
        for(var i=0; i<this.dataText['name'].length; i++) {    
            var itemname = this.dataType + "_" + this.dataText['name'][i];
            if (saveSettings[itemname] == "true") {
                outputText = tvSourceListText[lang][i];
                count++;
                if (count > 1) {
                    outputText = multipleSourcesText[lang];
                    break;
                }
            }
        }
        if (count == 0) {
            saveSettings['tvsource_eztv'] = "true";
        }
        mainsettingslist[3].children[0].innerText = settingsMainMenuText[lang][3] + ' - ' + outputText;
    }

    document.getElementById('OverlaySettingsPage').style.visibility = "visible";    
};

SceneDataSelect.prototype.handleFocus = function () {};

SceneDataSelect.prototype.handleBlur = function () {};

SceneDataSelect.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
                sf.key.preventDefault();
                sf.scene.hide('DataSelect');
                sf.scene.focus('SettingsPage');
                break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
            case sf.key.ENTER:
                var datalist = document.getElementById('datalist').getElementsByTagName("li");
                for(var i=0; i<datalist.length; i++) {
                    if (datalist[i].children[0].className == 'active') {
                        if (this.dataType != "moviesource" && this.dataType != "tvsource") {
                            saveSettings[this.dataType] = this.dataText['shortcode'][i];
                        }

                        var mainsettingslist = document.getElementById('mainsettingslist').getElementsByTagName("li");
                        switch (this.dataType) {
                            case "interface":
                                if (this.dataText['shortcode'][i] == "auto") {
                                    saveSettings[this.dataType] = sf.core.getEnvValue('lang');
                                    if ((saveSettings[this.dataType] == 'en') || (saveSettings[this.dataType] == 'bg') ||
                                        (saveSettings[this.dataType] == 'hr') || (saveSettings[this.dataType] == 'hu') ||
                                        (saveSettings[this.dataType] == 'es') || (saveSettings[this.dataType] == 'sk') ||
                                        (saveSettings[this.dataType] == 'it')) {
                                        //saveSettings[this.dataType] = saveSettings[this.dataType];
                                    } else {
                                        saveSettings[this.dataType] = 'en';
                                    }
                                    var pos = this.dataText['shortcode'].indexOf(saveSettings[this.dataType]);
                                } else {
                                    var pos = i;
                                }
                                mainsettingslist[0].children[0].innerText = settingsMainMenuText[lang][0] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "database":
                                if (this.dataText['shortcode'][i] == "auto") {
                                    saveSettings[this.dataType] = sf.core.getEnvValue('lang');
                                    var pos = this.dataText['shortcode'].indexOf(saveSettings[this.dataType]);
                                } else {
                                    var pos = i;
                                }
                                mainsettingslist[1].children[0].innerText = settingsMainMenuText[lang][1] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "moviesource":
                                var pos = i;
                                var itemname = this.dataType + "_" + this.dataText['name'][pos];
                                if (saveSettings[itemname] == "false") {
                                    saveSettings[itemname] = "true";
                                    datalist[pos].children[0].innerText = this.dataText[lang][pos] + " - " + enabledText[lang];
                                } else {
                                    saveSettings[itemname] = "false";
                                    datalist[pos].children[0].innerText = this.dataText[lang][pos] + " - " + disabledText[lang];
                                }

                                //mainsettingslist[2].children[0].innerText = settingsMainMenuText[lang][2] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "tvsource":
                                var pos = i;
                                var itemname = this.dataType + "_" + this.dataText['name'][pos];
                                if (saveSettings[itemname] == "false") {
                                    saveSettings[itemname] = "true";
                                    datalist[pos].children[0].innerText = this.dataText[lang][pos] + " - " + enabledText[lang];
                                } else {
                                    saveSettings[itemname] = "false";
                                    datalist[pos].children[0].innerText = this.dataText[lang][pos] + " - " + disabledText[lang];
                                }

                                //mainsettingslist[3].children[0].innerText = settingsMainMenuText[lang][3] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "subtitlelang":
                                if (this.dataText['shortcode'][i] == "auto") {
                                    saveSettings[this.dataType] = sf.core.getEnvValue('lang');
                                    var pos = this.dataText['shortcode'].indexOf(saveSettings[this.dataType]);
                                } else {
                                    var pos = i;
                                }
                                mainsettingslist[5].children[0].innerText = settingsMainMenuText[lang][5] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "subtitlemode":
                                var pos = i;
                                mainsettingslist[6].children[0].innerText = settingsMainMenuText[lang][6] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "downspeed":
                                var pos = i;
                                mainsettingslist[7].children[0].innerText = settingsMainMenuText[lang][7] + ' - ' + this.dataText[lang][pos];
                                break;
                            case "upspeed":
                                var pos = i;
                                mainsettingslist[8].children[0].innerText = settingsMainMenuText[lang][8] + ' - ' + this.dataText[lang][pos];
                                break;
                        }

                        //console.log(this.dataType + " - " + this.dataText['shortcode'][i]);
                        if (this.dataType != "moviesource" && this.dataType != "tvsource") {
                            sf.scene.hide('DataSelect');
                            sf.scene.focus('SettingsPage');
                        }
                        break;
                    }
                }
                break;
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
    switch (keyCode) {
        case sf.key.DOWN:
                var datalist = document.getElementById('datalist').getElementsByTagName("li");
                for(var i=0; i<datalist.length; i++) {
                    if (datalist[i].children[0].className == 'active') {
                        datalist[i].children[0].className = "";
                        if (this.pos < 7 && this.pos < (datalist.length - 1)) {
                            this.pos++;
                            i++;
                        } else {
                            if (i < datalist.length - 1) {
                                var nameul = document.getElementById('datalist');
                                nameul.style.top = nameul.offsetTop - 46;
                                i++;
                            }
                        }
                        datalist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + datalist.length);
                    }
                }
                break;
        case sf.key.UP:
            var datalist = document.getElementById('datalist').getElementsByTagName("li");
            for(var i=0; i<datalist.length; i++) {
                if (datalist[i].children[0].className == 'active') {
                    datalist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var nameul = document.getElementById('datalist');
                            nameul.style.top = nameul.offsetTop + 46;
                            i--;
                        }
                    }
                    datalist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + datalist.length);
                }
            }
            break;            
    }
};

SceneDataSelect.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
}