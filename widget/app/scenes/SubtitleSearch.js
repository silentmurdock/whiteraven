function SceneSubtitleSearch() {}

SceneSubtitleSearch.prototype.initialize = function () {
    this.enteredtext = "";
    this.keylist = {};
    this.keylist[0] = "0123456789*";
    this.keylist[1] = "QWERTZUIOP@";
    this.keylist[2] = "ASDFGHJKL_&";
    this.keylist[3] = "YXCVBNM,.-?";

    this.langpos = languageListText['shortcode'].indexOf(saveSettings['subtitlelang']);
    this.waiting = false;

    var searchKeyboard = document.getElementById('OverlaySubtitleSearch');
    widgetAPI.putInnerHTML(searchKeyboard, "");

    var divSearchText = document.createElement('div');
    divSearchText.id = "subsearchtext";
    var spanDiv = document.createElement('span');
    spanDiv.className = "subblink";
    spanDiv.innerText = "|";

    divSearchText.appendChild(spanDiv);
    searchKeyboard.appendChild(divSearchText);

    for(var c=0; c<4; c++) {
        var divRow = document.createElement('div');
        divRow.id = "subkeyboard" + c;

        for(var r=0; r<11; r++) {
            //console.log("'" + this.keylist[c][r] + "'");
            var divKey = document.createElement('div');
            divKey.className = "subkeybutton";
            if (c == 0 && r == 10) {
                divKey.className = "subkeybutton backspace";
                widgetAPI.putInnerHTML(divKey, "&larr;");
            } else {
                widgetAPI.putInnerHTML(divKey, this.keylist[c][r]);
            }
            divRow.appendChild(divKey);
        }

        searchKeyboard.appendChild(divRow);
    }

    var divRow = document.createElement('div');
    divRow.id = "subkeyboard4";

    var deleteallDiv = document.createElement('div');
    deleteallDiv.className = "subkeybutton deleteall";
    deleteallDiv.innerText = "Delete";
    divRow.appendChild(deleteallDiv);

    var spaceDiv = document.createElement('div');
    spaceDiv.className = "subkeybutton space";
    spaceDiv.innerText = "Space";
    divRow.appendChild(spaceDiv);

    var submitDiv = document.createElement('div');
    submitDiv.className = "subkeybutton submit";
    submitDiv.innerText = "Search";
    divRow.appendChild(submitDiv);

    searchKeyboard.appendChild(divRow);

}

SceneSubtitleSearch.prototype.handleShow = function (data) {
    this.caller = data.caller;
    if (this.caller == "SubtitleMenu") {
        document.getElementById('OverlaySubtitleMenu').style.visibility = "hidden";
        document.getElementById('OverlayPlayerMenuInfo').style.visibility = "hidden";
    }
    this.initialize();
    //this.enteredtext = "";

    //Buttons
    widgetAPI.putInnerHTML(document.getElementsByClassName('subkeybutton submit')[0], searchButtonText[lang]);
    widgetAPI.putInnerHTML(document.getElementsByClassName('subkeybutton deleteall')[0], deleteButtonText[lang]);
    widgetAPI.putInnerHTML(document.getElementsByClassName('subkeybutton space')[0], spaceButtonText[lang]);
    document.getElementsByClassName('subkeybutton')[27].className = "subkeybutton subactivekey";
    document.getElementById('OverlaySubtitleSearch').style.visibility = "visible";    
};

SceneSubtitleSearch.prototype.handleHide = function () {
    document.getElementById('OverlaySubtitleSearch').style.visibility = "hidden";
    document.getElementById('OverlayMediaPage').style.visibility = "hidden";

    var keybutton = document.getElementsByClassName('subkeybutton');
    for(var i=0; i<keybutton.length-1; i++) {
        keybutton[i].className = "subkeybutton";
    }
    keybutton[10].className = "subkeybutton backspace";
    keybutton[44].className = "subkeybutton deleteall";
    keybutton[45].className = "subkeybutton space";
    keybutton[46].className = "subkeybutton submit";
    
    widgetAPI.putInnerHTML(document.getElementById('subsearchtext'), '<span class="subblink">|</span>');

    if (this.caller == "SubtitleMenu") {
        document.getElementById('OverlaySubtitleMenu').style.visibility = "visible";
        document.getElementById('OverlayPlayerMenuInfo').style.visibility = "visible";
    }   
};

SceneSubtitleSearch.prototype.handleFocus = function () {
    document.getElementById('OverlaySubtitleSearch').style.visibility = "visible";
};

SceneSubtitleSearch.prototype.handleBlur = function () {};

SceneSubtitleSearch.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
                if (this.waiting == false) {
                	sf.scene.hide('SubtitleSearch');
                    if (saveSettings['issubtitleenabled'] == "true" && this.caller == "PlayerPage") {
                        sf.scene.focus('PlayerPage');
                    } else {
                        sf.scene.focus('SubtitleMenu');
                    }
                }
            	break;
            case sf.key.ENTER:
                if (this.waiting == false) {
                    var findthis = document.getElementById('subsearchtext').innerHTML;
                    findthis = findthis.split("<")[0];
                    var keybutton = document.getElementsByClassName('subkeybutton');
                    for(var i=0; i<keybutton.length; i++) {
                        if (keybutton[i].className.indexOf("subkeybutton subactivekey") != -1) {
                            if (keybutton[i].className == 'subkeybutton subactivekey backspace') {
                                findthis = findthis.substring(0, findthis.length - 1);
                                widgetAPI.putInnerHTML(document.getElementById('subsearchtext'), findthis + '<span class="subblink">|</span>');
                            } else if (keybutton[i].className == 'subkeybutton subactivekey submit') {
                                this.enteredtext = document.getElementById('subsearchtext').innerHTML.split("<")[0].trim().toLowerCase();
                                
                                if (this.enteredtext != "") {
                                    this.waiting = true;

                                    this.titletext = this.enteredtext.replace(/\-|\.|\+/gi, " ");
                                    var s = 0;
                                    var e = 0;
                                    var res = this.titletext.match(/(.+[^s]+)s([0-9]+)(|[\s\S]+)e([0-9]+)/i);
                                    if (res) {
                                        this.titletext = res[1].trim();
                                        s = parseInt(res[2]);
                                        e = parseInt(res[4]);
                                    }

                                    //alert("ERROR SEARCH: " + this.titletext + " s" + s + " e" + e);
                                    
                                    document.getElementById('OverlaySubtitleSearch').style.visibility = "hidden";
                                    sf.scene.get('PlayerPage').SetZIndex("visible", 5600);

                                    this.SearchSubtitlesByText(this.titletext, languageListText['longcode'][this.langpos], s, e);
                                }
                            } else if (keybutton[i].className == 'subkeybutton subactivekey space') {
                                widgetAPI.putInnerHTML(document.getElementById('subsearchtext'), findthis.trim() + ' ' + '<span class="subblink">|</span>');
                            } else if (keybutton[i].className == 'subkeybutton subactivekey deleteall') {
                                widgetAPI.putInnerHTML(document.getElementById('subsearchtext'), '<span class="subblink">|</span>');
                            } else {
                                widgetAPI.putInnerHTML(document.getElementById('subsearchtext'), findthis + keybutton[i].innerHTML + '<span class="subblink">|</span>');
                            }
                            break;
                        }
                    }
                }
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
    if (this.waiting == false) {
        switch (keyCode) {
            case sf.key.RIGHT:
                    var keybutton = document.getElementsByClassName('subkeybutton');
                    for(var i=0; i<keybutton.length; i++) {
                        if (keybutton[i].className.indexOf("subkeybutton subactivekey") != -1) {
                            keybutton[i].className = "subkeybutton";
                            if (i == 9) {
                                keybutton[10].className = "subkeybutton subactivekey backspace";
                            } else if (i == 10) {
                                keybutton[0].className = "subkeybutton subactivekey";
                            } else if (i == 21) {
                                keybutton[11].className = "subkeybutton subactivekey";
                            } else if (i == 32) {
                                keybutton[22].className = "subkeybutton subactivekey";
                            } else if (i == 43) {
                                keybutton[33].className = "subkeybutton subactivekey";
                            } else if (i == 44) { // last row buttons from here
                                keybutton[i].className = "subkeybutton deleteall";
                                keybutton[45].className = "subkeybutton subactivekey space";
                            } else if (i == 45) { // last row buttons from here
                                keybutton[i].className = "subkeybutton space";
                                keybutton[46].className = "subkeybutton subactivekey submit";
                            } else if (i == 46) { // last row buttons from here
                                keybutton[i].className = "subkeybutton submit";
                                keybutton[44].className = "subkeybutton subactivekey deleteall";
                            } else {
                                keybutton[i + 1].className = "subkeybutton subactivekey";
                            }
                            break;
                        }
                    }
                    break;
            case sf.key.LEFT:
                var keybutton = document.getElementsByClassName('subkeybutton');
                for(var i=0; i<keybutton.length; i++) {
                    if (keybutton[i].className.indexOf("subkeybutton subactivekey") != -1) {
                        keybutton[i].className = "subkeybutton";
                        if (i == 0) {
                            keybutton[10].className = "subkeybutton subactivekey backspace";
                        } else if (i == 11) {
                            keybutton[21].className = "subkeybutton subactivekey";
                        } else if (i == 22) {
                            keybutton[32].className = "subkeybutton subactivekey";
                        } else if (i == 33) {
                            keybutton[43].className = "subkeybutton subactivekey";
                        } else if (i == 44) { // last row buttons from here
                            keybutton[i].className = "subkeybutton deleteall";
                            keybutton[46].className = "subkeybutton subactivekey submit";
                        } else if (i == 46) { // last row buttons from here
                            keybutton[i].className = "subkeybutton submit";
                            keybutton[45].className = "subkeybutton subactivekey space";
                        } else if (i == 45) { // last row buttons from here
                            keybutton[i].className = "subkeybutton space";
                            keybutton[44].className = "subkeybutton subactivekey deleteall";
                        } else {
                            keybutton[i - 1].className = "subkeybutton subactivekey";
                        }
                        break;
                    }
                }
                break;
            case sf.key.DOWN:
                var keybutton = document.getElementsByClassName('subkeybutton');
                for(var i=0; i<keybutton.length; i++) {
                    if (keybutton[i].className.indexOf("subkeybutton subactivekey") != -1) {
                        if (keybutton[i + 11] && (i + 11 < 44)) {
                            keybutton[i].className = "subkeybutton";
                            i = i + 11;
                            keybutton[i].className = "subkeybutton subactivekey";
                        } else if (i >= 41 && i <= 43) {
                            keybutton[i].className = "subkeybutton";
                            i = 46;
                            keybutton[i].className = "subkeybutton subactivekey submit";
                        } else if (i >= 36 && i <= 40) {
                            keybutton[i].className = "subkeybutton";
                            i = 45;
                            keybutton[i].className = "subkeybutton subactivekey space";
                        } else if (i >= 33 && i <= 35) {
                            keybutton[i].className = "subkeybutton";
                            i = 44;
                            keybutton[i].className = "subkeybutton subactivekey deleteall";
                        }
                        break;
                    }
                }
                break;
            case sf.key.UP:
                var keybutton = document.getElementsByClassName('subkeybutton');
                for(var i=0; i<keybutton.length; i++) {
                    if (keybutton[i].className.indexOf("subkeybutton subactivekey") != -1) {
                        if (keybutton[i - 11] && i < 44) {
                            keybutton[i].className = "subkeybutton";
                            i = i - 11;
                            if (i == 10) {
                                keybutton[i].className = "subkeybutton subactivekey backspace";
                            } else {
                                keybutton[i].className = "subkeybutton subactivekey";
                            }
                        } else if (i == 44) { // last row buttons from here
                            keybutton[i].className = "subkeybutton deleteall";
                            keybutton[34].className = "subkeybutton subactivekey";
                        } else if (i == 45) { // last row buttons from here
                            keybutton[i].className = "subkeybutton space";
                            keybutton[38].className = "subkeybutton subactivekey";
                        } else if (i == 46) { // last row buttons from here
                            keybutton[i].className = "subkeybutton submit";
                            keybutton[41].className = "subkeybutton subactivekey";
                        }
                        break;
                    }
                }
                break;        
        }
    }
};

SceneSubtitleSearch.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};

SceneSubtitleSearch.prototype.SearchSubtitlesByText = function(title, language, season, episode) {
    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                reqSuccess = true;
                //alert("SUBTITLE SEARCH: " + xhr.responseText);
                var dataobject = JSON.parse(xhr.responseText).results;
                if (dataobject) {
                    subtitleslist = dataobject;

                    // Need to enable, because subtitles found
                    issubtitle = true;
                    
                    this.waiting = false;
                    
                    if (sf.scene.getFocused() == "SubtitleSearch") {
                        sf.scene.get('PlayerPage').SetZIndex("hidden", 500);
                        sf.scene.show('LoadSubtitle', {caller: "SubtitleSearch"});
                        sf.scene.focus('LoadSubtitle');
                    }
                } else {
                    if (sf.scene.getFocused() == "SubtitleSearch") {
                        this.ShowSubtitleNotFoundError();
                    }
                }
            } else {
                reqSuccess = true;

                if (sf.scene.getFocused() == "SubtitleSearch") {
                    this.ShowSubtitleNotFoundError();
                }
            }

            if (xhr.destroy) { xhr.destroy(); }            
        }
    }.bind(this));

    xhr.open("GET", "http://" + serverIP + ":9000/api/subtitlesbytext/" + title + "/lang/" + language + "/season/" + season + "/episode/" + episode);
    xhr.send();

    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            reqSuccess = true;

            if (sf.scene.getFocused() == "SubtitleSearch") {
                this.ShowSubtitleNotFoundError();
            }
        }
    }, 20000);
};

SceneSubtitleSearch.prototype.ShowSubtitleNotFoundError = function() {
    sf.scene.get('PlayerPage').SetZIndex("hidden", 500);
    widgetAPI.putInnerHTML(document.getElementById('mediapageinfo'), "<DL><DT>" + subtitleNotFoundText[lang] + "</DT><DD></DD><SPAN></SPAN></DL>");
    document.getElementById('OverlayMediaPage').style.height = document.getElementById('mediapageinfo').offsetHeight;
    document.getElementById('OverlayMediaPage').style.visibility = "visible";

    setTimeout(function() {
        this.waiting = false;
        if (sf.scene.getFocused() == "SubtitleSearch") {
            document.getElementById('OverlayMediaPage').style.visibility = "hidden";
            document.getElementById('OverlaySubtitleSearch').style.visibility = "visible";
        }
    }.bind(this), 3000);
}