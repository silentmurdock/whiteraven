function SceneSearchPage() {}

SceneSearchPage.prototype.initialize = function () {
    this.enteredtext = "";
    this.keylist = {};
    this.keylist[0] = "0123456789*";
    this.keylist[1] = "QWERTZUIOP@";
    this.keylist[2] = "ASDFGHJKL_&";
    this.keylist[3] = "YXCVBNM,.-?";

    var searchKeyboard = document.getElementById('OverlaySearchMenu');
    widgetAPI.putInnerHTML(searchKeyboard, "");

    var divSearchText = document.createElement('div');
    divSearchText.id = "searchtext";
    var spanDiv = document.createElement('span');
    spanDiv.className = "blink";
    spanDiv.innerText = "|";

    divSearchText.appendChild(spanDiv);
    searchKeyboard.appendChild(divSearchText);

    for(var c=0; c<4; c++) {
        var divRow = document.createElement('div');
        divRow.id = "keyboard" + c;

        for(var r=0; r<11; r++) {
            //console.log("'" + this.keylist[c][r] + "'");
            var divKey = document.createElement('div');
            divKey.className = "keybutton";
            if (c == 0 && r == 10) {
                divKey.className = "keybutton backspace";
                widgetAPI.putInnerHTML(divKey, "&larr;");
            } else {
                widgetAPI.putInnerHTML(divKey, this.keylist[c][r]);
            }
            divRow.appendChild(divKey);
        }

        searchKeyboard.appendChild(divRow);
    }

    var divRow = document.createElement('div');
    divRow.id = "keyboard4";

    var deleteallDiv = document.createElement('div');
    deleteallDiv.className = "keybutton deleteall";
    deleteallDiv.innerText = "Delete";
    divRow.appendChild(deleteallDiv);

    var spaceDiv = document.createElement('div');
    spaceDiv.className = "keybutton space";
    spaceDiv.innerText = "Space";
    divRow.appendChild(spaceDiv);

    var submitDiv = document.createElement('div');
    submitDiv.className = "keybutton submit";
    submitDiv.innerText = "Search";
    divRow.appendChild(submitDiv);

    searchKeyboard.appendChild(divRow);

}

SceneSearchPage.prototype.handleShow = function () {
    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    this.enteredtext = "";

    //Buttons
    widgetAPI.putInnerHTML(document.getElementsByClassName('keybutton submit')[0], searchButtonText[lang]);
    widgetAPI.putInnerHTML(document.getElementsByClassName('keybutton deleteall')[0], deleteButtonText[lang]);
    widgetAPI.putInnerHTML(document.getElementsByClassName('keybutton space')[0], spaceButtonText[lang]);
    document.getElementsByClassName('keybutton')[27].className = "keybutton activekey";
    document.getElementById('OverlaySearchMenu').style.visibility = "visible";    
};

SceneSearchPage.prototype.handleHide = function () {
    document.getElementById('OverlaySearchMenu').style.visibility = "hidden";

    var keybutton = document.getElementsByClassName('keybutton');
    for(var i=0; i<keybutton.length-1; i++) {
        keybutton[i].className = "keybutton";
    }
    keybutton[10].className = "keybutton backspace";
    keybutton[44].className = "keybutton deleteall";
    keybutton[45].className = "keybutton space";
    keybutton[46].className = "keybutton submit";
    
    widgetAPI.putInnerHTML(document.getElementById('searchtext'), '<span class="blink">|</span>');
    if (querytype != "search") {
        document.getElementById('OverlayVideoMenu').style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    } else {
        if (this.enteredtext == "") {
            document.getElementById('OverlayVideoMenu').style.visibility = "visible";
            document.getElementById('OverlayMenuInfo').style.visibility = "visible";
        }
    }
    
};

SceneSearchPage.prototype.handleFocus = function () {};

SceneSearchPage.prototype.handleBlur = function () {};

SceneSearchPage.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('SearchPage');
            	sf.scene.focus('MainMenu');
            	break;
            case sf.key.ENTER:
                var findthis = document.getElementById('searchtext').innerHTML;
                findthis = findthis.split("<")[0];
                var keybutton = document.getElementsByClassName('keybutton');
                for(var i=0; i<keybutton.length; i++) {
                    if (keybutton[i].className.indexOf("keybutton activekey") != -1) {
                        if (keybutton[i].className == 'keybutton activekey backspace') {
                            findthis = findthis.substring(0, findthis.length - 1);
                            widgetAPI.putInnerHTML(document.getElementById('searchtext'), findthis + '<span class="blink">|</span>');
                        } else if (keybutton[i].className == 'keybutton activekey submit') {
                            this.enteredtext = document.getElementById('searchtext').innerHTML.split("<")[0].trim().toLowerCase();

                            if (this.enteredtext != "") {
                                document.getElementById('OverlaySearchMenu').style.visibility = "hidden";

                                var keybutton = document.getElementsByClassName('keybutton');
                                keybutton[46].className = "keybutton submit";

                                widgetAPI.putInnerHTML(document.getElementById('searchtext'), '<span class="blink">|</span>');
                                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsTextNoGenres[lang]);
                                this.SetZIndex("hidden", 5);

                                sf.scene.hide('SearchPage');
                                sf.scene.hide('MainMenu');
                                sf.scene.focus('Main');
                                ShowSearchMenu(this.enteredtext);
                            }
                        } else if (keybutton[i].className == 'keybutton activekey space') {
                            widgetAPI.putInnerHTML(document.getElementById('searchtext'), findthis.trim() + ' ' + '<span class="blink">|</span>');
                        } else if (keybutton[i].className == 'keybutton activekey deleteall') {
                            widgetAPI.putInnerHTML(document.getElementById('searchtext'), '<span class="blink">|</span>');
                        } else {
                            widgetAPI.putInnerHTML(document.getElementById('searchtext'), findthis + keybutton[i].innerHTML + '<span class="blink">|</span>');
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
        case sf.key.RIGHT:
                var keybutton = document.getElementsByClassName('keybutton');
                for(var i=0; i<keybutton.length; i++) {
                    if (keybutton[i].className.indexOf("keybutton activekey") != -1) {
                        keybutton[i].className = "keybutton";
                        if (i == 9) {
                            keybutton[10].className = "keybutton activekey backspace";
                        } else if (i == 10) {
                            keybutton[0].className = "keybutton activekey";
                        } else if (i == 21) {
                            keybutton[11].className = "keybutton activekey";
                        } else if (i == 32) {
                            keybutton[22].className = "keybutton activekey";
                        } else if (i == 43) {
                            keybutton[33].className = "keybutton activekey";
                        } else if (i == 44) { // last row buttons from here
                            keybutton[i].className = "keybutton deleteall";
                            keybutton[45].className = "keybutton activekey space";
                        } else if (i == 45) { // last row buttons from here
                            keybutton[i].className = "keybutton space";
                            keybutton[46].className = "keybutton activekey submit";
                        } else if (i == 46) { // last row buttons from here
                            keybutton[i].className = "keybutton submit";
                            keybutton[44].className = "keybutton activekey deleteall";
                        } else {
                            keybutton[i + 1].className = "keybutton activekey";
                        }
                        break;
                    }
                }
                break;
        case sf.key.LEFT:
            var keybutton = document.getElementsByClassName('keybutton');
            for(var i=0; i<keybutton.length; i++) {
                if (keybutton[i].className.indexOf("keybutton activekey") != -1) {
                    keybutton[i].className = "keybutton";
                    if (i == 0) {
                        keybutton[10].className = "keybutton activekey backspace";
                    } else if (i == 11) {
                        keybutton[21].className = "keybutton activekey";
                    } else if (i == 22) {
                        keybutton[32].className = "keybutton activekey";
                    } else if (i == 33) {
                        keybutton[43].className = "keybutton activekey";
                    } else if (i == 44) { // last row buttons from here
                        keybutton[i].className = "keybutton deleteall";
                        keybutton[46].className = "keybutton activekey submit";
                    } else if (i == 46) { // last row buttons from here
                        keybutton[i].className = "keybutton submit";
                        keybutton[45].className = "keybutton activekey space";
                    } else if (i == 45) { // last row buttons from here
                        keybutton[i].className = "keybutton space";
                        keybutton[44].className = "keybutton activekey deleteall";
                    } else {
                        keybutton[i - 1].className = "keybutton activekey";
                    }
                    break;
                }
            }
            break;
        case sf.key.DOWN:
            var keybutton = document.getElementsByClassName('keybutton');
            for(var i=0; i<keybutton.length; i++) {
                if (keybutton[i].className.indexOf("keybutton activekey") != -1) {
                    if (keybutton[i + 11] && (i + 11 < 44)) {
                        keybutton[i].className = "keybutton";
                        i = i + 11;
                        keybutton[i].className = "keybutton activekey";
                    } else if (i >= 41 && i <= 43) {
                        keybutton[i].className = "keybutton";
                        i = 46;
                        keybutton[i].className = "keybutton activekey submit";
                    } else if (i >= 36 && i <= 40) {
                        keybutton[i].className = "keybutton";
                        i = 45;
                        keybutton[i].className = "keybutton activekey space";
                    } else if (i >= 33 && i <= 35) {
                        keybutton[i].className = "keybutton";
                        i = 44;
                        keybutton[i].className = "keybutton activekey deleteall";
                    }
                    break;
                }
            }
            break;
        case sf.key.UP:
            var keybutton = document.getElementsByClassName('keybutton');
            for(var i=0; i<keybutton.length; i++) {
                if (keybutton[i].className.indexOf("keybutton activekey") != -1) {
                    if (keybutton[i - 11] && i < 44) {
                        keybutton[i].className = "keybutton";
                        i = i - 11;
                        if (i == 10) {
                            keybutton[i].className = "keybutton activekey backspace";
                        } else {
                            keybutton[i].className = "keybutton activekey";
                        }
                    } else if (i == 44) { // last row buttons from here
                        keybutton[i].className = "keybutton deleteall";
                        keybutton[34].className = "keybutton activekey";
                    } else if (i == 45) { // last row buttons from here
                        keybutton[i].className = "keybutton space";
                        keybutton[38].className = "keybutton activekey";
                    } else if (i == 46) { // last row buttons from here
                        keybutton[i].className = "keybutton submit";
                        keybutton[41].className = "keybutton activekey";
                    }
                    break;
                }
            }
            break;        
    }
};

SceneSearchPage.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};