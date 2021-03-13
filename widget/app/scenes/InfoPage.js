function SceneInfoPage() {}

SceneInfoPage.prototype.initialize = function () {
    this.seasonboxsize = 18; // 18px = 1 or 2 char, 26px = 3 char, 36px = 4 char
    this.episodeboxsize = 18;
    this.seasonscroll = 26; // 26px = 1 or 2 char, 34px = 3 char, 44px = 4 char
    this.episodescroll = 26;
    this.maxse = 19; // Maximum season element to show
    this.maxee = 19; // Maximum episode element to show
    this.waiting = false;
    this.nohostreturn = false;
    this.inforeturn = false;
    this.seasonsave = [];
    this.episodesave = [];
    this.dbpos = languageListText['shortcode'].indexOf(saveSettings['database']);
}

SceneInfoPage.prototype.handleShow = function (mediatype) {
    this.initialize();
	this.SetWaitAndZIndex("visible", 100);
    //document.getElementById('selected').style.display = "none";
    var playerscreen = document.getElementById("PlayerScreen");
    playerscreen.style.visibility = "hidden";
    playerscreen.style.backgroundColor = 0;
    //playerscreen.style.backgroundImage = "url('" + w780src + wrapData[position].backdrop_path + "')";
    //document.getElementById('poster').src = w185src + wrapData[position].poster_path;
    document.getElementById('title').innerText = wrapData[position].title.toUpperCase();

    if (wrapData[position].release_date != undefined) {
        this.GetMovieInfo(wrapData[position].id);
    } else {
        this.GetSerieInfo(wrapData[position].id);
    }
    
    if (SERVER_OK == true) {
        document.getElementById("playbutton").style.width = 170;
        widgetAPI.putInnerHTML(document.getElementById("playbutton"), playButtonText[lang]);
    } else {
        document.getElementById("playbutton").style.width = 210;
        widgetAPI.putInnerHTML(document.getElementById("playbutton"), noServerButtonText[lang]);
    }
};

SceneInfoPage.prototype.handleHide = function () {
	var playerscreen = document.getElementById("PlayerScreen");
    playerscreen.style.visibility = "hidden";
    widgetAPI.putInnerHTML(document.getElementById('otherinfo'), "");
    widgetAPI.putInnerHTML(document.getElementById('synopsis'), "");
    widgetAPI.putInnerHTML(document.getElementById('episodemenu'), "");
    document.getElementById("episodemenu").style.display = "none";

    /*playerscreen.style.backgroundImage = "url('')";*/
    document.getElementById('poster').src = "";
    /*document.getElementById('poster').className = "posterBasic";*/

    document.getElementById('playbutton').className = "activepb";

    if (querytype == "search") {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsTextNoGenres[lang]);        
    } else if (querytype == "favourites") {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouritesettingsText[lang]);
    } else {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
    }

    ssindex = 2;
};

SceneInfoPage.prototype.handleFocus = function () {};

SceneInfoPage.prototype.handleBlur = function () {};

SceneInfoPage.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
                if (this.waiting == false) {
                    sf.key.preventDefault();
                    this.SetWaitAndZIndex("hidden", 5);
                	sf.scene.hide('InfoPage');
                	sf.scene.focus('Main');
                } else if (this.inforeturn == true) {
                    sf.key.preventDefault();
                    this.SetWaitAndZIndex("hidden", 5);
                    sf.scene.hide('InfoPage');
                    sf.scene.focus('Main');
                    this.inforeturn = false;
                } else if (this.nohostreturn == true) {
                    sf.key.preventDefault();
                    this.SetWaitAndZIndex("hidden", 5);
                    document.getElementById('playbutton').className = "activepb";
                    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
                    this.nohostreturn = false;
                } else {
                    sf.key.preventDefault();
                }
            	break;
            case sf.key.ENTER:
                if (this.waiting == false) {
                    if (ssindex == 1) {
                        var eb = document.getElementsByClassName('episodeboxes');
                        for(var i=0; i<eb.length; i++) {
                            if (eb[i].className == "episodeboxes activebox") {
                                eb[i].className = "episodeboxes selectedbox";
                            }
                        }
                        document.getElementById('playbutton').className = "activepb";
                        ssindex = 2;
                    } else if (ssindex == 0) {
                        var eb = document.getElementsByClassName('episodeboxes');
                        for(var i=0; i<eb.length; i++) {
                            if (eb[i].className == "episodeboxes selectedbox") {
                                eb[i].className = "episodeboxes activebox";
                            }
                        }

                        var sb = document.getElementsByClassName('seasonboxes');
                        for(var i=0; i<sb.length; i++) {
                            if (sb[i].className == "seasonboxes activebox") {
                                sb[i].className = "seasonboxes selectedbox";
                            }
                        }
                        ssindex = 1;
                    } else if ((ssindex == 2) && (SERVER_OK == true)) {
                        var sb = document.getElementsByClassName('seasonboxes');
                        if (sb[0]) {
                            var ss = 0;
                            var se = 0;
                            for(var i=0; i<sb.length; i++) {
                                if (sb[i].className == "seasonboxes selectedbox") {
                                    ss = sb[i].innerHTML;
                                }
                            }
                            if (ss<10) { ss = "0" + ss; }
                            
                            var eb = document.getElementsByClassName('episodeboxes');
                            for(var i=0; i<eb.length; i++) {
                                if (eb[i].className == "episodeboxes selectedbox") {
                                    se = eb[i].innerHTML;
                                }
                            }
                            if (se<10) { se = "0" + se; }

                            //alert("Enter pressed");
                            this.SetWaitAndZIndex("visible", 100);
                            document.getElementById('playbutton').className = "selectedpb";
                            torrenturls = [];
                            this.year = 0;
                            this.year = parseInt(wrapData[position].first_air_date.substring(0, 4));
                            if (this.year == 0) {
                                this.year = 1900;
                            }
                            this.GetResolverData(wrapData[position].imdb_id, "show", wrapData[position].original_name.toUpperCase(), this.year, parseInt(ss), parseInt(se), function(list, emessage) {
                                if (list.length > 0) {
                                    for(var i=0; i<list.length; i++) {
                                        torrenturls.push(list[i]);
                                    }
                                    this.SetWaitAndZIndex("hidden", 5, true);
                                    sf.scene.show('HostsMenu');
                                    sf.scene.focus('HostsMenu');
                                } else {
                                    document.getElementById("loaDing").style.visibility = "hidden";
                                    document.getElementById("loaDing").className = "loaderoff";
                                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), emessage);
                                    document.getElementById("noConnection").style.visibility = "visible";
                                    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
                                    this.waiting = true;
                                    this.nohostreturn = true;
                                }
                            }.bind(this));
                            //document.getElementById('OverlayHostsMenu').style.visibility = "visible";
                        } else {
                            //alert("Enter pressed");
                            this.SetWaitAndZIndex("visible", 100);
                            document.getElementById('playbutton').className = "selectedpb";
                            torrenturls = [];
                            this.year = 0;
                            this.year = parseInt(wrapData[position].release_date.substring(0, 4));
                            if (this.year == 0) {
                                this.year = 1900;
                            }
                            this.GetResolverData(wrapData[position].imdb_id, "movie", wrapData[position].original_title.toUpperCase(), this.year, "", "", function(list, emessage) {
                                if (list.length > 0) {
                                    for(var i=0; i<list.length; i++) {
                                        torrenturls.push(list[i]);
                                    }
                                    this.SetWaitAndZIndex("hidden", 5, true);
                                    sf.scene.show('HostsMenu');
                                    sf.scene.focus('HostsMenu');
                                } else {
                                    document.getElementById("loaDing").style.visibility = "hidden";
                                    document.getElementById("loaDing").className = "loaderoff";
                                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), emessage);
                                    document.getElementById("noConnection").style.visibility = "visible";
                                    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
                                    this.waiting = true;
                                    this.nohostreturn = true;
                                }
                            }.bind(this));
                            //document.getElementById('OverlayHostsMenu').style.visibility = "visible";
                        }
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
                if (this.waiting == false) {
                    if (ssindex == 1) {
                        var eb = document.getElementsByClassName('episodeboxes');
                        var ebox = document.getElementById('episodecontent');

                        for(var i=0; i<eb.length; i++) {
                            if (eb[i].className == "episodeboxes activebox") {
                                eb[i].className = "episodeboxes";
                                //console.log((i * 26) + ebox.offsetLeft - (19 * 26));
                                if ((i + 1) >= this.maxee && (((i + 1) * this.episodescroll) + ebox.offsetLeft == this.maxee * this.episodescroll)) {
                                    if ((i + 1) < (eb.length - 1)) {
                                        ebox.style.left = ebox.offsetLeft - this.episodescroll;
                                        widgetAPI.putInnerHTML(eb[i + 1], this.episodesave[i + 2]);
                                        widgetAPI.putInnerHTML(eb[i + 2 - this.maxee], "&#xF81C;");
                                        widgetAPI.putInnerHTML(eb[i + 1 - this.maxee], this.episodesave[i + 2 - this.maxee]);
                                        
                                        if (i + 2 != eb.length - 1) {
                                            widgetAPI.putInnerHTML(eb[i + 2], "&#xF81E;");
                                        } else {
                                            widgetAPI.putInnerHTML(eb[eb.length - 1 - this.maxee], "&#xF81C;");
                                        }
                                    }
                                }
                                if (i < eb.length - 1) {
                                    eb[i+1].className = "episodeboxes activebox";
                                } else {
                                    if (i > this.maxee && ((i * this.episodescroll) + ebox.offsetLeft == this.maxee * this.episodescroll)) {
                                        widgetAPI.putInnerHTML(eb[eb.length - 1 - this.maxee], this.episodesave[eb.length - this.maxee]);
                                        widgetAPI.putInnerHTML(eb[this.maxee], "&#xF81E;");
                                    }
                                    document.getElementById('episodecontent').style.left = 0;
                                    eb[0].className = "episodeboxes activebox";
                                }
                                break;
                            }
                        }
                    } else if (ssindex == 0) {
                        var sb = document.getElementsByClassName('seasonboxes');
                        var sbox = document.getElementById('seasoncontent');

                        if (sb.length > 1) {
                            for(var i=0; i<sb.length; i++) {
                                if (sb[i].className == "seasonboxes activebox") {
                                    sb[i].className = "seasonboxes";

                                    if ((i + 1) >= this.maxse && (((i + 1) * this.seasonscroll) + sbox.offsetLeft == this.maxse * this.seasonscroll)) {
                                        if ((i + 1) < (sb.length - 1)) {
                                            sbox.style.left = sbox.offsetLeft - this.seasonscroll;
                                            widgetAPI.putInnerHTML(sb[i + 1], this.seasonsave[i + 2]);
                                            widgetAPI.putInnerHTML(sb[i + 2 - this.maxse], "&#xF81C;");
                                            widgetAPI.putInnerHTML(sb[i + 1 - this.maxse], this.seasonsave[i + 2 - this.maxse]);
                                            
                                            if (i + 2 != sb.length - 1) {
                                                widgetAPI.putInnerHTML(sb[i + 2], "&#xF81E;");
                                            } else {
                                                widgetAPI.putInnerHTML(sb[sb.length - 1 - this.maxse], "&#xF81C;");
                                            }
                                        }
                                    }
                                    if (i < sb.length - 1) {
                                        sb[i+1].className = "seasonboxes activebox";
                                        var seasoncount = sb[i+1].innerHTML;
                                    } else {
                                        if (i > this.maxse && ((i * this.seasonscroll) + sbox.offsetLeft == this.maxse * this.seasonscroll)) {
                                            widgetAPI.putInnerHTML(sb[sb.length - 1 - this.maxse], this.seasonsave[sb.length - this.maxse]);
                                            widgetAPI.putInnerHTML(sb[this.maxse], "&#xF81E;");
                                        }
                                        document.getElementById('seasoncontent').style.left = 0;
                                        sb[0].className = "seasonboxes activebox";
                                        var seasoncount = sb[0].innerHTML;
                                    }
                                    
                                    // Insert season episode boxes
                                    var episodecontent = document.getElementById('episodecontent');
                                    widgetAPI.putInnerHTML(episodecontent, "");
                                    episodecontent.style.left = 0;
                                    
                                    var saveindex = 1;
                                    this.episodesave = [];
                                    for(var j=0; j<episodeobject.length; j++) {
                                        if (episodeobject[j].season == seasoncount) {
                                            if (episodeobject[j].airdate < ptoday && episodeobject[j].airdate != "") {
                                                var episodeboxes = document.createElement('div');
                                                episodeboxes.className = 'episodeboxes';
                                                episodeboxes.id = 'e' + j;
                                                episodeboxes.style.width = this.episodeboxsize;
                                                widgetAPI.putInnerHTML(episodeboxes, episodeobject[j].number);
                                                episodecontent.appendChild(episodeboxes);
                                                this.episodesave[saveindex] = episodeobject[j].number;
                                                saveindex++;
                                            }
                                        }
                                    }

                                    var eb = document.getElementsByClassName('episodeboxes');
                                    var ebindex = eb.length-1;
                                    
                                    if (ebindex > this.maxee) {
                                        var ebox = document.getElementById('episodecontent');
                                        ebox.style.left = ebox.offsetLeft - ((ebindex - this.maxee) * this.episodescroll);

                                        widgetAPI.putInnerHTML(eb[ebindex - this.maxee], "&#xF81C;");
                                    }
                                    eb[ebindex].className = "episodeboxes selectedbox";
                                    //eb[0].className = "episodeboxes selectedbox"; // If want to start with 1st element
                                    break;
                                }
                            }

                            if (document.getElementById('playbutton').offsetTop > 396) {
                                widgetAPI.putInnerHTML(document.getElementById('synopsis'), "");
                            }
                        }
                    }
                }
                break;
        case sf.key.LEFT:
            if (this.waiting == false) {
                if (ssindex == 1) {
                    var eb = document.getElementsByClassName('episodeboxes');
                    var ebox = document.getElementById('episodecontent');
                    //console.log(ebox.offsetLeft);

                    for(var i=0; i<eb.length; i++) {
                        if (eb[i].className == "episodeboxes activebox") {
                            eb[i].className = "episodeboxes";
                            //console.log(ebox.offsetLeft, ':', i * -26);
                            if (i > 0) {
                                if (ebox.offsetLeft == (i - 1) * (-this.episodescroll)) {
                                    widgetAPI.putInnerHTML(eb[i], this.episodesave[i + 1]);
                                    widgetAPI.putInnerHTML(eb[i - 1], this.episodesave[i]);
                                    if (i - 2 > 0) {
                                        ebox.style.left = ebox.offsetLeft + this.episodescroll;
                                        widgetAPI.putInnerHTML(eb[i - 2], "&#xF81C;");
                                        widgetAPI.putInnerHTML(eb[i + this.maxee - 2], "&#xF81E;");
                                        widgetAPI.putInnerHTML(eb[i + this.maxee - 1], this.episodesave[i + this.maxee]);
                                    } else if (i - 2 == 0) {
                                        ebox.style.left = ebox.offsetLeft + this.episodescroll;
                                        widgetAPI.putInnerHTML(eb[i - 2], this.episodesave[i - 1]);
                                        widgetAPI.putInnerHTML(eb[i + this.maxee - 2], "&#xF81E;");
                                        widgetAPI.putInnerHTML(eb[i + this.maxee - 1], this.episodesave[i + this.maxee]);
                                    }
                                }
                                eb[i-1].className = "episodeboxes activebox";
                            } else {
                                if (eb.length > (this.maxee + 1)) {
                                    ebox.style.left = ebox.offsetLeft - ((eb.length - (this.maxee + 1)) * this.episodescroll);
                                    widgetAPI.putInnerHTML(eb[this.maxee], this.episodesave[this.maxee + 1]);
                                    widgetAPI.putInnerHTML(eb[eb.length - 1 - this.maxee], "&#xF81C;");
                                }
                                eb[eb.length-1].className = "episodeboxes activebox";
                            }
                            break;
                        }
                    }
                } else if (ssindex == 0) {
                    var sb = document.getElementsByClassName('seasonboxes');
                    var sbox = document.getElementById('seasoncontent');

                    if (sb.length > 1) {
                        for(var i=0; i<sb.length; i++) {
                            if (sb[i].className == "seasonboxes activebox") {
                                sb[i].className = "seasonboxes";

                                if (i > 0) {
                                    if (sbox.offsetLeft == (i - 1) * (-this.seasonscroll)) {
                                        widgetAPI.putInnerHTML(sb[i], this.seasonsave[i + 1]);
                                        widgetAPI.putInnerHTML(sb[i - 1], this.seasonsave[i]);
                                        if (i - 2 > 0) {
                                            sbox.style.left = sbox.offsetLeft + this.seasonscroll;
                                            widgetAPI.putInnerHTML(sb[i - 2], "&#xF81C;");
                                            widgetAPI.putInnerHTML(sb[i + this.maxse - 2], "&#xF81E;");
                                            widgetAPI.putInnerHTML(sb[i + this.maxse - 1], this.seasonsave[i + this.maxse]);
                                        } else if (i - 2 == 0) {
                                            sbox.style.left = sbox.offsetLeft + this.seasonscroll;
                                            widgetAPI.putInnerHTML(sb[i - 2], this.seasonsave[i - 1]);
                                            widgetAPI.putInnerHTML(sb[i + this.maxse - 2], "&#xF81E;");
                                            widgetAPI.putInnerHTML(sb[i + this.maxse - 1], this.seasonsave[i + this.maxse]);
                                        }                                    
                                    }
                                    sb[i-1].className = "seasonboxes activebox";
                                    var seasoncount = sb[i-1].innerHTML;
                                } else {
                                    if (sb.length > (this.maxse + 1)) {
                                        sbox.style.left = sbox.offsetLeft - ((sb.length - (this.maxse + 1)) * this.seasonscroll);
                                        widgetAPI.putInnerHTML(sb[this.maxse], this.seasonsave[this.maxse + 1]);
                                        widgetAPI.putInnerHTML(sb[sb.length - 1 - this.maxse], "&#xF81C;");
                                    }
                                    sb[sb.length-1].className = "seasonboxes activebox";
                                    var seasoncount = sb[sb.length - 1].innerHTML;
                                }

                                // Insert season episode boxes
                                var episodecontent = document.getElementById('episodecontent');
                                widgetAPI.putInnerHTML(episodecontent, "");
                                episodecontent.style.left = 0;

                                var saveindex = 1;
                                this.episodesave = [];
                                for(var j=0; j<episodeobject.length; j++) {
                                    if (episodeobject[j].season == seasoncount) {
                                        if (episodeobject[j].airdate < ptoday && episodeobject[j].airdate != "") {
                                            var episodeboxes = document.createElement('div');
                                            episodeboxes.className = 'episodeboxes';
                                            episodeboxes.id = 'e' + j;
                                            episodeboxes.style.width = this.episodeboxsize;
                                            widgetAPI.putInnerHTML(episodeboxes, episodeobject[j].number);
                                            episodecontent.appendChild(episodeboxes);
                                            this.episodesave[saveindex] = episodeobject[j].number;
                                            saveindex++;
                                        }
                                    }
                                }

                                var eb = document.getElementsByClassName('episodeboxes');
                                var ebindex = eb.length-1;
                                
                                if (ebindex > this.maxee) {
                                    var ebox = document.getElementById('episodecontent');
                                    ebox.style.left = ebox.offsetLeft - ((ebindex - this.maxee) * this.episodescroll);

                                    widgetAPI.putInnerHTML(eb[ebindex - this.maxee], "&#xF81C;");
                                }
                                eb[ebindex].className = "episodeboxes selectedbox";
                                break;
                            }
                        }

                        if (document.getElementById('playbutton').offsetTop > 396) {
                            widgetAPI.putInnerHTML(document.getElementById('synopsis'), "");
                        }
                    }
                }
            }
            break;
        case sf.key.UP:
            if (this.waiting == false) {
                if (ssindex == 2) {
                    var eb = document.getElementsByClassName('episodeboxes');
                    if (eb[0]) {
                        for(var i=0; i<eb.length; i++) {
                            if (eb[i].className == "episodeboxes selectedbox") {
                                eb[i].className = "episodeboxes activebox";
                            }
                        }
                        document.getElementById('playbutton').className = "inactivepb";
                        ssindex = 1;
                    }
                } else if (ssindex == 1) {
                    var eb = document.getElementsByClassName('episodeboxes');
                    for(var i=0; i<eb.length; i++) {
                        if (eb[i].className == "episodeboxes activebox") {
                            eb[i].className = "episodeboxes selectedbox";
                        }
                    }

                    var sb = document.getElementsByClassName('seasonboxes');
                    for(var i=0; i<sb.length; i++) {
                        if (sb[i].className == "seasonboxes selectedbox") {
                            sb[i].className = "seasonboxes activebox";
                        }
                    }
                    ssindex = 0;
                }
            }
            break;
        case sf.key.DOWN:
            if (this.waiting == false) {
                if (ssindex == 1) {
                    var eb = document.getElementsByClassName('episodeboxes');
                    for(var i=0; i<eb.length; i++) {
                        if (eb[i].className == "episodeboxes activebox") {
                            eb[i].className = "episodeboxes selectedbox";
                        }
                    }
                    document.getElementById('playbutton').className = "activepb";
                    ssindex = 2;
                } else if (ssindex == 0) {
                    var eb = document.getElementsByClassName('episodeboxes');
                    for(var i=0; i<eb.length; i++) {
                        if (eb[i].className == "episodeboxes selectedbox") {
                            eb[i].className = "episodeboxes activebox";
                        }
                    }

                    var sb = document.getElementsByClassName('seasonboxes');
                    for(var i=0; i<sb.length; i++) {
                        if (sb[i].className == "seasonboxes activebox") {
                            sb[i].className = "seasonboxes selectedbox";
                        }
                    }
                    ssindex = 1;
                }
            }
            break;
    }
};

SceneInfoPage.prototype.SetWaitAndZIndex = function(state, number, notchange) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    if (state == "visible") {
        document.getElementById("loaDing").className = "loaderon";
        document.getElementById('poster').className = "posterBasic";
    }
    document.getElementById("loaDing").style.visibility = state;
    if (state == "hidden") {
        document.getElementById("loaDing").className = "loaderoff";
        if (typeof notchange == "undefined" || notchange == false) {
            document.getElementById('poster').className = "posterInfo";
        }
    }
    document.getElementById("noConnection").style.visibility = "hidden";
    document.getElementById("waitscreen").style.visibility = state;
    if (state == "visible") {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);
        this.waiting = true;
    } else {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), "");
        this.waiting = false;
    }
};

SceneInfoPage.prototype.GetMovieInfo = function(tmdbid) {
    var reqMainSuccess = false;
    this.inforeturn = false;
    this.SetWaitAndZIndex("visible", 100);

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var dataobject = JSON.parse(xhr.responseText).results[0];

        var poster = document.getElementById('poster');
        poster.src = w185src + dataobject.poster_path;
        poster.onerror = function () { this.src = "images\\empty.png"; }
        document.getElementById("PlayerScreen").style.backgroundImage = "url('" + w780src + dataobject.backdrop_path + "')";
        
        // Handle genres
        if (dataobject.genres.length != 0) {
            var genres = "";
            for (var g = 0; g < dataobject.genres.length && g < 2; g++) {
                var gindex = genresMovieMenuText['genre'].indexOf(dataobject.genres[g].id.toString());
                if (gindex != -1) {
                    genres = genres + genresMovieMenuText[lang][gindex].toCapitalize();
                } else {
                    genres = genres + dataobject.genres[g].name.toCapitalize();
                }          
                if (g != dataobject.genres.length - 1 && g < 1) {
                    genres = genres + ", "
                }
            }
        } else {
            var genres = "";
        }
        
        // Handle runtime
        if (dataobject.runtime != undefined) {
            var runtime = dataobject.runtime;
        } else {
            var runtime = "0";
        }

        // Handle runtime
        if (dataobject.overview != undefined) {
            var synopsis = dataobject.overview.replace(/<(?:.|\n)*?>/gm, '').substring(0, 797);
            if (synopsis.length == 797) {
                synopsis = synopsis.trim() + "...";
            }
        } else {
            var synopsis = "";
        }

        widgetAPI.putInnerHTML(document.getElementById('otherinfo'), genresText[lang] + genres + 
        yearText[lang] + wrapData[position].release_date.substring(0, 4) + runtimeText[lang] + (runtime[0] ? runtime[0] : runtime) + 
        ratingText[lang] + wrapData[position].vote_average + "");
        
        widgetAPI.putInnerHTML(document.getElementById('synopsis'), synopsis);

        wrapData[position].imdb_id = dataobject.imdb_id;

        if (document.getElementById('playbutton').offsetTop > 396) {
            widgetAPI.putInnerHTML(document.getElementById('synopsis'), "");
        }

        // Set timeout just for allow time to load background image
        setTimeout(function(){
            reqMainSuccess = true;
            this.SetWaitAndZIndex("hidden", 5);
            document.getElementById('PlayerScreen').style.visibility = 'visible';

            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        }.bind(this), 200);

        if (xhr.destroy) { xhr.destroy(); }
      }
    }.bind(this));

    // Outside request
    xhr.open("GET", "http://" + serverIP + ":9000/api/tmdbinfo/type/movie/tmdbid/" + tmdbid + "/lang/" + languageListText['tmdbcode'][this.dbpos]);
    xhr.send();

    setTimeout(function() {
        if (!reqMainSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }

            document.getElementById("loaDing").style.visibility = "hidden";
            document.getElementById("loaDing").className = "loaderoff";
            widgetAPI.putInnerHTML(document.getElementById("noConnection"), nodataText[lang]);
            document.getElementById("noConnection").style.visibility = "visible";
            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

            reqMainSuccess = true;
            this.inforeturn = true;
            //alert("ERROR: Timeout!")
        }
    }.bind(this), 25000);
}

SceneInfoPage.prototype.GetSerieInfo = function(tmdbid) {
    var reqMainSuccess = false;
    this.inforeturn = false;
    this.SetWaitAndZIndex("visible", 100);

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            reqMainSuccess = true;

            var dataobject = JSON.parse(xhr.responseText).results[0];

            var poster = document.getElementById('poster');
            poster.src = w185src + dataobject.poster_path;
            poster.onerror = function () { this.src = "images\\empty.png"; }
            document.getElementById("PlayerScreen").style.backgroundImage = "url('" + w780src + dataobject.backdrop_path + "')";

            // Handle genres
            if (dataobject.genres.length != 0) {
                var genres = "";
                for (var g = 0; g < dataobject.genres.length && g < 2; g++) {
                    var gindex = genresTVMenuText['genre'].indexOf(dataobject.genres[g].id.toString());
                    if (gindex != -1) {
                        genres = genres + genresTVMenuText[lang][gindex].toCapitalize();
                    } else {
                        genres = genres + dataobject.genres[g].name.toCapitalize();
                    }
                    if (g != dataobject.genres.length - 1 && g < 1) {
                        genres = genres + ", "
                    }
                }
            } else {
                var genres = "";
            }
            
            // Handle runtime
            if (dataobject.episode_run_time != undefined) {
                var runtime = dataobject.episode_run_time;
            } else {
                var runtime = "0";
            }

            // Handle runtime
            if (dataobject.overview != undefined) {
                var synopsis = dataobject.overview.replace(/<(?:.|\n)*?>/gm, '').substring(0, 497);
                if (synopsis.length == 497) {
                    synopsis = synopsis.trim() + "...";
                }
            } else {
                var synopsis = "";
            }

            widgetAPI.putInnerHTML(document.getElementById('otherinfo'), genresText[lang] + genres + 
            yearText[lang] + (wrapData[position].first_air_date ? wrapData[position].first_air_date.substring(0, 4) : "") +
            runtimeText[lang] + (runtime[0] ? runtime[0] : runtime) +
            ratingText[lang] + (wrapData[position].vote_average ? wrapData[position].vote_average : "") + "");
            
            widgetAPI.putInnerHTML(document.getElementById('synopsis'), synopsis);

            wrapData[position].imdb_id = dataobject.external_ids.imdb_id;
            wrapData[position].tvdb_id = dataobject.external_ids.tvdb_id;
            
            var maxIndex = dataobject.seasons.length;
            
            widgetAPI.putInnerHTML(document.getElementById("episodemenu"), seasonText[lang] + "</br>");

            // Create season elements
            this.GetTVMazeInfo(wrapData[position].tvdb_id, wrapData[position].imdb_id);

            if (xhr.destroy) { xhr.destroy(); }
        }
    }.bind(this));

    // Outside request
    xhr.open("GET", "http://" + serverIP + ":9000/api/tmdbinfo/type/tv/tmdbid/" + tmdbid + "/lang/" + languageListText['tmdbcode'][this.dbpos]);
    xhr.send();

    setTimeout(function() {
        if (!reqMainSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            
            document.getElementById("loaDing").style.visibility = "hidden";
            document.getElementById("loaDing").className = "loaderoff";
            widgetAPI.putInnerHTML(document.getElementById("noConnection"), nodataText[lang]);
            document.getElementById("noConnection").style.visibility = "visible";
            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

            reqMainSuccess = true;
            this.inforeturn = true;
            //alert("ERROR: Timeout!")
        }
    }.bind(this), 25000);
}

SceneInfoPage.prototype.GetTVMazeInfo = function(tvdb, imdb) {
    this.inforeturn = false;
    this.SetWaitAndZIndex("visible", 100);

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var dataobject = JSON.parse(xhr.responseText).results;

        var maxIndex = dataobject.length;
        
        widgetAPI.putInnerHTML(document.getElementById("episodemenu"), seasonText[lang] + "</br>");
        var seasoncount = -1;

        var seasonlist = document.createElement('div');
        seasonlist.id = 'seasonlist';

        var seasoncontent = document.createElement('div');
        seasoncontent.id = 'seasoncontent';

        var maxLength = 1;
        for (var i=0; i<maxIndex; i++) {
            if (maxLength < dataobject[i].season.toString().length) {
                maxLength = dataobject[i].season.toString().length;
            }
        }

        switch (maxLength) {
            case 1:
            case 2:
                this.seasonboxsize = 18;
                this.seasonscroll = 26;
                this.maxse = 19;
                break;
            case 3:
                this.seasonboxsize = 26;
                this.seasonscroll = 34;
                this.maxse = 16;
                break;
            case 4:
                this.seasonboxsize = 36;
                this.seasonscroll = 44;
                this.maxse = 10;
                break;
        }

        seasonlist.style.width = (this.maxse + 1) * this.seasonscroll;

        var saveindex = 1;
        this.seasonsave = [];
        for(var i=0; i<maxIndex; i++) {
            if (seasoncount != dataobject[i].season) {
                seasoncount = dataobject[i].season;

                if (dataobject[i].airdate < ptoday && dataobject[i].airdate != "") {
                    var seasonboxes = document.createElement('div');
                    seasonboxes.className = 'seasonboxes';
                    seasonboxes.id = 's' + seasoncount;
                    seasonboxes.style.width = this.seasonboxsize;
                    widgetAPI.putInnerHTML(seasonboxes, dataobject[i].season);
                    seasoncontent.appendChild(seasonboxes);
                    this.seasonsave[saveindex] = dataobject[i].season;
                    saveindex++;
                } else {
                    seasoncount = seasoncount - 1;
                    break;
                }
            }
        }

        seasonlist.appendChild(seasoncontent);
        document.getElementById("episodemenu").appendChild(seasonlist);

        var sb = document.getElementsByClassName('seasonboxes');
        var sbindex = sb.length-1;

        if (sbindex > this.maxse) {
            var sbox = document.getElementById('seasoncontent');
            sbox.style.left = sbox.offsetLeft - ((sbindex - this.maxse) * this.seasonscroll);

            widgetAPI.putInnerHTML(sb[sbindex - this.maxse], "&#xF81C;");
        }
        sb[sbindex].className = "seasonboxes selectedbox";

        widgetAPI.putInnerHTML(document.getElementById("episodemenu"), document.getElementById("episodemenu").innerHTML + "</br>" + episodeText[lang] + "</br>");

        var episodelist = document.createElement('div');
        episodelist.id = 'episodelist';

        var episodecontent = document.createElement('div');
        episodecontent.id = 'episodecontent';

        maxLength = 1;
        for(var i=0; i<maxIndex; i++) {
            if (maxLength < dataobject[i].number.toString().length) {
                maxLength = dataobject[i].number.toString().length;
            }
        }
        
        switch (maxLength) {
            case 1:
            case 2:
                this.episodeboxsize = 18;
                this.episodescroll = 26;
                this.maxee = 19;
                break;
            case 3:
                this.episodeboxsize = 26;
                this.episodescroll = 34;
                this.maxee = 14;
                break;
            case 4:
                this.episodeboxsize = 36;
                this.episodescroll = 44;
                this.maxee = 10;
                break;
        }

        episodelist.style.width = (this.maxee + 1) * this.episodescroll;

        var saveindex = 1;
        this.episodesave = [];
        for(var i=0; i<maxIndex; i++) {
            if (dataobject[i].season == seasoncount) {
                if (dataobject[i].airdate < ptoday && dataobject[i].airdate != "") {
                    var episodeboxes = document.createElement('div');
                    episodeboxes.className = 'episodeboxes';
                    episodeboxes.id = 'e' + i;
                    episodeboxes.style.width = this.episodeboxsize;
                    widgetAPI.putInnerHTML(episodeboxes, dataobject[i].number);
                    episodecontent.appendChild(episodeboxes);
                    this.episodesave[saveindex] = dataobject[i].number;
                    saveindex++;
                }
            }
        }

        episodelist.appendChild(episodecontent);
        document.getElementById("episodemenu").appendChild(episodelist);

        var eb = document.getElementsByClassName('episodeboxes');
        var ebindex = eb.length-1;
        
        if (ebindex > this.maxee) {
            var ebox = document.getElementById('episodecontent');
            ebox.style.left = ebox.offsetLeft - ((ebindex - this.maxee) * this.episodescroll);

            widgetAPI.putInnerHTML(eb[ebindex - this.maxee], "&#xF81C;");
        }
        eb[ebindex].className = "episodeboxes selectedbox";

        reqSuccess = true;
        this.SetWaitAndZIndex("hidden", 5);
        document.getElementById('PlayerScreen').style.visibility = 'visible';

        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        document.getElementById("episodemenu").style.display = "initial";

        if (document.getElementById('playbutton').offsetTop > 396) {
            var synopsis = document.getElementById('synopsis').innerHTML;
            widgetAPI.putInnerHTML(document.getElementById('synopsis'), synopsis.replace(/<(?:.|\n)*?>/gm, '').substring(0, 447) + "...");
        }

        episodeobject = dataobject; // Need for episode select

        if (xhr.destroy) { xhr.destroy(); }
      }
    }.bind(this));

    xhr.open("GET", "http://" + serverIP + ":9000/api/tvmazeepisodes/tvdb/" + tvdb + "/imdb/" + imdb)
    xhr.send();

    // No internet connection or connection timeout handling
    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }

            document.getElementById("loaDing").style.visibility = "hidden";
            document.getElementById("loaDing").className = "loaderoff";
            widgetAPI.putInnerHTML(document.getElementById("noConnection"), nodataText[lang]);
            document.getElementById("noConnection").style.visibility = "visible";
            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

            reqSuccess = true;
            this.inforeturn = true;
            //alert("ERROR: Timeout!")
        }
    }.bind(this), 25000);
}

SceneInfoPage.prototype.GetResolverData = function(imdb, type, title, year, season, episode, fn) {
    var worklist = [];
    var message = noTorrentText[lang];

    var reqTorrentSuccess = false;
    //SetWaitAndZIndex("visible", 100);
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), torrentText[lang]);

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            reqTorrentSuccess = true;
            
            var dataobject = JSON.parse(xhr.responseText).results;
            
            if (type == "movie") {
                var langindex = -1;
                var subdata = {};
                
                for(var i=0; i<dataobject.length; i++) {                     
                    subdata = {};
                    subdata['imdbid'] = imdb;
                    subdata['title'] = dataobject[i]['title'];
                    subdata['resolution'] = dataobject[i]['quality'];
                    subdata['magneturl'] = "magnet:?xt=urn:btih:" + dataobject[i]['hash'];
                    subdata['provider'] = dataobject[i]['provider'];
                    subdata['size'] = dataobject[i]['size'];
                    subdata['seeds'] = dataobject[i]['seeds'];
                    subdata['peers'] = dataobject[i]['peers'];

                    langindex = languageListText['shortcode'].indexOf(dataobject[i]['lang']);
                    if (langindex == -1) {
                        langindex = languageListText['shortcode'].indexOf('en'); // English
                    }
                    subdata['language'] = languageListText[lang][langindex];
                    subdata['shortlang'] = languageListText['shortcode'][langindex];

                    subdata['season'] = 0;
                    subdata['episode'] = 0;
                    worklist.push(subdata);                        
                }
                
            } else if (type == "show") {
                var langindex = -1;
                var subdata = {};
                
                for(var i=0; i<dataobject.length; i++) {                       
                    subdata = {};
                    subdata['imdbid'] = imdb;
                    subdata['title'] = dataobject[i]['title'];
                    subdata['resolution'] = dataobject[i]['quality'];
                    subdata['magneturl'] = "magnet:?xt=urn:btih:" + dataobject[i]['hash'];
                    subdata['provider'] = dataobject[i]['provider'];
                    subdata['size'] = dataobject[i]['size'];
                    subdata['seeds'] = dataobject[i]['seeds'];
                    subdata['peers'] = dataobject[i]['peers'];

                    langindex = languageListText['shortcode'].indexOf(dataobject[i]['lang']);
                    if (langindex == -1) {
                        langindex = languageListText['shortcode'].indexOf('en'); // English
                    }
                    subdata['language'] = languageListText[lang][langindex];
                    subdata['shortlang'] = languageListText['shortcode'][langindex];

                    subdata['season'] = parseInt(season);
                    subdata['episode'] = parseInt(episode);
                    worklist.push(subdata);                        
                }
            }
            
            fn(worklist, message);
        } else {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }            
            reqTorrentSuccess = true;
            fn(worklist, noTorrentText[lang]);
        }
      }
    });

    var query = encodeURIComponent("title=" + title + "&releaseyear=" + year);

    if (type == 'movie') {
        var providers = "";
        for (var i=0; i<movieSourceListText['name'].length; i++) {
            var itemname = "moviesource_" + movieSourceListText['name'][i];
            if (saveSettings[itemname] == "true") {
                providers = providers + movieSourceListText['name'][i] + ",";
            }
        }
        providers = providers.slice(0, -1);
        
        xhr.open("GET", "http://" + serverIP + ":9000/api/getmoviemagnet/imdb/" + imdb + "/query/" + query + "/providers/" + providers);
    } else {
        var providers = "";
        for (var i=0; i<tvSourceListText['name'].length; i++) {
            var itemname = "tvsource_" + tvSourceListText['name'][i];
            if (saveSettings[itemname] == "true") {
                providers = providers + tvSourceListText['name'][i] + ",";
            }
        }
        providers = providers.slice(0, -1);

        xhr.open("GET", "http://" + serverIP + ":9000/api/getshowmagnet/imdb/" + imdb + "/query/" + query + "/season/" + season + "/episode/" + episode + "/providers/" + providers);
    }

    xhr.send();

    setTimeout(function() {
        if (!reqTorrentSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }            
            reqTorrentSuccess = true;
            //alert("ERROR: Timeout!")
            fn([], noTorrentText[lang]);
        }
    }, 25000);
};