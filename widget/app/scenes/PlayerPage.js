function ScenePlayerPage() {}

ScenePlayerPage.prototype.initialize = function () {
    //widgetAPI.sendReadyEvent();
    /*************** Player.js *******************/
    var Player =
    {
        AVPlayer : null,
        state : -1,
        skipState : -1,
        stopCallback : null,    /* Callback function to be set by client */
        originalSource : null,
        menuPosition: 1,
        isChevron: 0,
        isBuffering: 0,
        isSuccess: 0,
        tryCount: 0,
        resumetime: 0,
        subtitleFirsRun: 1,
        subtitleState: 0,
        subtitleIndex: 0,
        subtitleOffset: 0,
        subtitleSeek: 0,
        totalTime: 0,
        
        STOPPED : 0,
        PLAYING : 1,
        PAUSED : 2,  
        FORWARD : 3,
        BACKWARD : 4
    };

    var bufferingCB = {
        onbufferingstart : function () {
    //      alert("buffering started");
            if (Player.totalTime == 0) {
                Player.setTotalTime();
            }
            Player.onBufferingStart();
        },
        onbufferingprogress: function (percent) {
    //        alert("on buffering : " + percent);
            Player.onBufferingProgress(percent);
        },
        onbufferingcomplete: function () {
    //        alert("buffering completely");
            Player.onBufferingComplete();
            if (downloadprogress == true) {
                Player.bufferSuccess();
            }
        }
    };

    var playCB = {
        oncurrentplaytime: function (time) {
            //alert("playing time : " + time);
            Player.setCurTime(time);
        },
        onresolutionchanged: function (width, height) {
            //alert("resolution changed : " + width + ", " + height);
        },
        onstreamcompleted: function () {
            if(Player.getState() != Player.STOPPED) {
                if (issubtitle) {
                    Player.stopSubtitle();
                }
                Player.stopVideo();
            }
            sf.scene.hide('PlayerPage');
            
        },
        onerror: function (error) {
            //alert("ONERROR Status: " + Player.AVPlayer.status + " - State: " + Player.getState() + " - Err.Name: " + error.name);
            //SaveErrorToLocal(JSON.stringify(error));
            if (error.name != "NotFoundError") {
                var errorText = avplayUnknownErrorText[lang];

                switch (error.name) {
                    case "IOError":
                        errorText = avplayIOErrorText[lang];
                        break;
                    case "OutOfMemoryError":
                        errorText = avplayOutOfMemoryErrorText[lang];
                        break;
                    case "NetworkError":
                        errorText = avplayNetworkErrorText[lang];
                        break;
                    case "NetworkSlowError":
                        errorText = avplayNetworkSlowErrorText[lang];
                        break;
                    case "AbortError":
                        errorText = avplayAbortErrorText[lang];
                        break;
                    case "TimeoutError":
                        errorText = avplayTimeoutErrorText[lang];
                        break;
                    case "FailToPlayError":
                    case "RenderError":
                        errorText = cantPlayVideoText[lang];
                        break;
                    case "AvplayUnsupportedContainerError":
                        errorText = avplayUnsupportedContainerErrorText[lang];
                        break;
                    case "AvplayUnsupportedVideoFormatError":
                        errorText = avplayUnsupportedVideoFormatErrorText[lang];
                        break;
                    case "AvplayUnsupportedAudioFormatError":
                        errorText = avplayUnsupportedAudioFormatErrorText[lang];
                        break;
                    case "AvplayUnsupportedVideoResolutionError":
                        errorText = avplayUnsupportedVideoResolutionErrorText[lang];
                        break;
                    case "AvplayUnsupportedVideoFramerateError":
                        errorText = avplayUnsupportedVideoFramerateErrorText[lang];
                        break;
                    case "AvplayCurruptedStreamError":
                        errorText = avplayCurruptedStreamErrorText[lang];
                        break;
                    case "NotSupportedError":
                        errorText = notSupportedVideoText[lang];
                }

                if(Player.getState() != Player.STOPPED) {
                    if (issubtitle) {
                        Player.stopSubtitle();
                    }
                    infoHash = "";
                    Player.stopVideo();
                    //$.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});
                }

                // Hide all possible menus and dialogs
                var focusedName = sf.scene.getFocused();
                if (focusedName == 'LoadSubtitle') {
                    sf.scene.hide('LoadSubtitle', {caller: "PlayerPage"});
                    sf.scene.hide('SubtitleMenu');
                    sf.scene.focus('PlayerPage');
                } else if (focusedName == 'SubtitleMenu') {
                    sf.scene.hide('SubtitleMenu');
                    sf.scene.focus('PlayerPage');
                } else if (focusedName == 'AudioMenu') {
                    sf.scene.hide('AudioMenu');
                    sf.scene.focus('PlayerPage');
                } else if (focusedName == 'SubtitleSync') {
                    sf.scene.hide('SubtitleSync');
                    sf.scene.hide('SubtitleMenu');
                    sf.scene.focus('PlayerPage');
                } else if (focusedName == 'SubtitleStyle') {
                    sf.scene.hide('SubtitleStyle');
                    sf.scene.hide('SubtitleMenu');
                    sf.scene.focus('PlayerPage');
                } else if (focusedName == 'SubtitleSearch') {
                    sf.scene.hide('SubtitleSearch');
                    sf.scene.hide('SubtitleMenu');
                    sf.scene.focus('PlayerPage');
                }
                document.getElementById("loaDing").style.visibility = "hidden";
                document.getElementById("loaDing").className = "loaderoff";
                document.getElementById("ProgressBar").style.visibility = 'hidden';
                widgetAPI.putInnerHTML(document.getElementById("noConnection"), errorText);
                document.getElementById("noConnection").style.visibility = "visible";
                setTimeout(function () {
                    document.getElementById("noConnection").style.visibility = "hidden";
                    sf.scene.hide('PlayerPage');
                }, 4000);
            } else {
                if (Player.tryCount < 3) {
                    Player.tryCount = Player.tryCount + 1;
                    Player.playVideo();
                } else {
                    Player.tryCount = 0;
                    if(Player.getState() != Player.STOPPED) {
                        if (issubtitle) {
                            Player.stopSubtitle();
                        }
                        infoHash = "";
                        Player.stopVideo();
                        //$.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});
                    }

                    document.getElementById("loaDing").style.visibility = "hidden";
                    document.getElementById("loaDing").className = "loaderoff";
                    document.getElementById("ProgressBar").style.visibility = 'hidden';
                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayVideoText[lang]);
                    document.getElementById("noConnection").style.visibility = "visible";
                    setTimeout(function () {
                        document.getElementById("noConnection").style.visibility = "hidden";
                        sf.scene.hide('PlayerPage');
                    }, 4000);
                }
            }
        }
    };

    Player.init = function()
    {
        this.clear();
        var playersuccess = true;    
        this.state = this.STOPPED;
        if (Object.keys(webapis.avplay._getAllInstance()).length === 0) {
            try {
                var playerInstance = window.webapis.avplay;
                playerInstance.getAVPlay(Player.onAVPlayObtained, Player.onGetAVPlayError);
                        
            } catch(e) {
                playersuccess = false;
                alert('######getAVplay Exception :[' +e.code + '] ' + e.message);
            }
        } else {
            Player.onAVPlayObtained(Player.AVPlayer);
        }      
        return playersuccess;
    };

    Player.clear = function()
    {
        //this.AVPlayer = null;
        /*if (this.AVPlayer) {
            try {
                this.AVPlayer.open(null);         
            } catch(e){
                alert(e.message);
            }
        }*/
        this.state = -1;
        this.skipState = -1;
        //this.stopCallback = null;
        this.originalSource = null;
        this.menuPosition = 1;
        this.isChevron = 0;
        this.isBuffering = 0;
        this.isSuccess = 0;
        this.tryCount = 0;
        this.subtitleFirsRun = 1;
        this.subtitleState = 0;
        this.subtitleIndex = 0;
        this.subtitleOffset = 0;
        this.subtitleSeek = 0;
        this.totalTime = 0;
        this.savedresumetime = resume['time'];
    }

    Player.onAVPlayObtained = function(avplay) {
        alert('Getting avplay object successfully');
        Player.AVPlayer = avplay;
        Player.AVPlayer.init({
            containerID : 'playerbox960x540',
            bufferingCallback : bufferingCB, 
            playCallback : playCB,
            displayRect: {
              top: 0,
              left: 0,
              width: 960,
              height: 540
            },
            autoRatio: false
        });
        //alert(Player.AVPlayer);
    };

    Player.onGetAVPlayError = function() {
        alert('######onGetAVPlayError: ' + error.message);
        if(Player.getState() != Player.STOPPED) {
            if (issubtitle) {
                Player.stopSubtitle();
            }
            Player.stopVideo();
        }

        document.getElementById("loaDing").style.visibility = "hidden";
        document.getElementById("loaDing").className = "loaderoff";
        document.getElementById("ProgressBar").style.visibility = 'hidden';
        widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayVideoText[lang]);
        document.getElementById("noConnection").style.visibility = "visible";
        setTimeout(function () {
            document.getElementById("noConnection").style.visibility = "hidden";
            sf.scene.hide('PlayerPage');
        }, 4000);
    };

    Player.onError = function(){
        alert('######onError: ');
        if(Player.getState() != Player.STOPPED) {
            if (issubtitle) {
                Player.stopSubtitle();
            }
            Player.stopVideo();
        }

        document.getElementById("loaDing").style.visibility = "hidden";
        document.getElementById("loaDing").className = "loaderoff";
        document.getElementById("ProgressBar").style.visibility = 'hidden';
        widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayVideoText[lang]);
        document.getElementById("noConnection").style.visibility = "visible";
        setTimeout(function () {
            document.getElementById("noConnection").style.visibility = "hidden";
            sf.scene.hide('PlayerPage');
        }, 4000);
    };

    Player.onSuccess = function() {
        //alert('######onSuccess: ');
    };

    Player.bufferSuccess = function(){
        //alert('######bufferSuccess: ');

        document.getElementById("ProgressBar").style.visibility = 'hidden';
        document.getElementById("loaDing").style.visibility = "hidden";
        document.getElementById("loaDing").className = "loaderoff";
        var currentresolution = Player.getResolution();
        if (currentresolution.length <= 7) {
            document.getElementById("videoresolution").style.left = '-438px';
        } else if (currentresolution.length == 8) {
            document.getElementById("videoresolution").style.left = '-436px';
        } else if (currentresolution.length > 8) {
            document.getElementById("videoresolution").style.left = '-434px';
        }
        widgetAPI.putInnerHTML(document.getElementById("videoresolution"), currentresolution);
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), playText[lang]);
        
        downloadprogress = false;

        Player.isSuccess = 1;
        //Player.setFullscreen();
        Player.savedresumetime = 0;

        // Calculate and set auto ratio for 16:9
        var frame_left = 0,
            frame_top = 0,
            frame_width = 960,
            frame_height = 540,
            video_width = Player.AVPlayer.videoWidth,
            video_height = Player.AVPlayer.videoHeight,
            nLeft, nTop, nWidth, nHeight, retValue, fnRound = Math.round,
            computedArea = null;

        if (video_width / video_height > frame_width / frame_height) {
            nHeight = fnRound((frame_width * video_height) / video_width);
            nWidth = frame_width;
            nLeft = frame_left + fnRound((frame_width - nWidth) / 2);
            nTop = frame_top + fnRound((frame_height - nHeight) / 2);
            computedArea = new SRect(nLeft, nTop, nWidth, nHeight);
            
            Player.AVPlayer.setDisplayArea(computedArea);
        }

        document.getElementById("playerbox960x540").style.visibility = 'visible';

        // Load subtitle if enabled
        if (issubtitle == true) {
            document.getElementById("subcontainer").style.visibility = 'visible';
            Player.startSubtitle();
        }
    };

    Player.setWindow = function()
    {
        Player.AVPlayer.setDisplayRect({
            top: 58,
            left: 458,
            width: 472,
            height: 270
        });
    };

    Player.setFullscreen = function()
    {
        Player.AVPlayer.setDisplayRect({
            top: 0,
            left: 0,
            width: (window.screen.width || 960),
            height: (window.screen.height || 540)
        });
    };

    Player.setVideoURL = function(url)
    {
        this.url = url;
        alert("URL = " + this.url);
    }

    Player.playVideo = function()
    {
        if (this.url == null)
        {
            alert("No videos to play");
        }
        else
        {
            this.state = this.PLAYING;
            document.getElementById("playpause").src = 'images\\pause.png';
            document.getElementById("playpause").style.backgroundColor = '#505050';
            document.getElementById("stop").style.backgroundColor = 'initial';
            document.getElementById("audiobutton").style.backgroundColor = 'initial';
            document.getElementById("subbutton").style.backgroundColor = 'initial';
            Display.status(playerStateText[lang][0], 'images\\play.png');
            //this.setFullscreen();
            //this.plugin.Execute("Play",this.url );
            
            try {
                /*Player.AVPlayer.setTotalBufferSize(1024*1024*7);
                Player.AVPlayer.setPendingBufferSize(1024*1024*4);
                Player.AVPlayer.setInitialBufferSize(1024*1024*3);*/
                Player.AVPlayer.open(this.url/*, {totalBufferSize: 1024*1024*7, pendingBufferSize: 1024*1024*4, initialBufferSize: 1024*1024*3}*/);
                Player.AVPlayer.play(Player.onSuccess, Player.onError);         
            } catch(e){
                alert(e.message);
            } 
        }
    }

    Player.pauseVideo = function()
    {
        this.state = this.PAUSED;
        this.isChevron = 0;
        document.getElementById("timetip").style.visibility = 'hidden';
        document.getElementById("chevron").style.backgroundColor = '#ffffff';
        document.getElementById("chevron").style.borderColor = '#ffffff';
        var timePercent = document.getElementById("mediaprogressbarpercent").style.width.slice(0, -1);
        if (timePercent <= 100) {
            document.getElementById("chevron").style.left = timePercent + "%";
        } else {
            document.getElementById("chevron").style.left = "100%";
        }

        document.getElementById("playpause").src = 'images\\play.png';
        document.getElementById("playpause").style.backgroundColor = '#505050';
        document.getElementById("stop").style.backgroundColor = 'initial';
        document.getElementById("audiobutton").style.backgroundColor = 'initial';
        document.getElementById("subbutton").style.backgroundColor = 'initial';
        Display.status(playerStateText[lang][1], 'images\\pause.png');
        this.menuPosition = 1;
        Player.AVPlayer.pause();
    }

    Player.stopVideo = function()
    {
        if (this.state != this.STOPPED)
        {
            this.state = this.STOPPED;
            document.getElementById("timetip").style.visibility = 'hidden';
            document.getElementById("chevron").style.backgroundColor = '#ffffff';
            document.getElementById("chevron").style.borderColor = '#ffffff';

            document.getElementById("playpause").src = 'images\\play.png';
            document.getElementById("playpause").style.backgroundColor = 'initial';
            document.getElementById("stop").style.backgroundColor = '#505050';
            document.getElementById("audiobutton").style.backgroundColor = 'initial';
            document.getElementById("subbutton").style.backgroundColor = 'initial';
            Display.status(playerStateText[lang][2], 'images\\stop.png');
            
            downloadprogress = false;
            
            // Save resume data
            if (this.savedresumetime == 0) {
                if (this.resumetime < this.totalTime) {
                    resume['time'] = this.resumetime;
                } else {
                    resume['time'] = 0;
                }
            } else {
                resume['time'] = this.savedresumetime;
            }
            SaveResumeToLocal(resume);
            this.resumetime = 0;

            Player.AVPlayer.stop();
            Display.setTime(0);
            
            if (this.stopCallback)
            {
                this.stopCallback();
            }
        }
        else
        {
            alert("Ignoring stop request, not in correct state");
        }
    }

    Player.resumeVideo = function()
    {
        this.state = this.PLAYING;
        this.menuPosition = 1;
        document.getElementById("playpause").src = 'images\\pause.png';
        document.getElementById("playpause").style.backgroundColor = '#505050';
        document.getElementById("stop").style.backgroundColor = 'initial';
        document.getElementById("audiobutton").style.backgroundColor = 'initial';
        document.getElementById("subbutton").style.backgroundColor = 'initial';
        Display.status(playerStateText[lang][0], 'images\\play.png');
        Player.AVPlayer.resume();
    }

    Player.skipForwardVideo = function(second)
    {
        this.skipState = this.FORWARD;
        //ScenePlayerPage.prototype.SetZIndex("visible", 5600);

        if (Player.AVPlayer.pause() == true) {
            if (Player.AVPlayer.jumpForward(second) == true) {
                this.onBufferingStart();
            }
        } else {
            if (Player.AVPlayer.jumpForward(second) == true) {
                this.onBufferingStart();
            }
        }
    }

    Player.skipBackwardVideo = function(second)
    {
        this.skipState = this.BACKWARD;
        //ScenePlayerPage.prototype.SetZIndex("visible", 5600);

        if (Player.AVPlayer.pause() == true) {
            if (Player.AVPlayer.jumpBackward(second) == true) {
                this.onBufferingStart();
            }
        } else {
            if (Player.AVPlayer.jumpBackward(second) == true) {
                this.onBufferingStart();
            }
        }
    }

    // Subtitle handling
    Player.stopSubtitle = function()
    {
        this.subtitleFirsRun = 1;
        this.subtitleState = 0;
        this.subtitleIndex = 0;
        this.subtitleOffset = 0;
        subtitledata = [];
    }

    Player.startSubtitle = function()
    {
        this.subtitleFirsRun = 1;
        this.subtitleState = 1;
        this.subtitleIndex = 0;
        this.subtitleOffset = 0;
    }

    Player.setSubtitleIndex = function(newTime)
    {
        this.subtitleSeek = 1;

        widgetAPI.putInnerHTML(document.getElementById("subtext"), "");
        
        this.subtitleIndex = -1;

        var start = 0;
        var end = subtitledata.length - 1; 
        
        while (start <= end){ 
            var mid = Math.floor((start + end) / 2); 

            if (mid > 0) {
                if (subtitledata[mid].startTime <= newTime && subtitledata[mid].endTime >= newTime) {
                    this.subtitleIndex = mid;
                    break;
                } else if (subtitledata[mid-1].endTime < newTime && subtitledata[mid].startTime > newTime) {
                    this.subtitleIndex = mid;
                    break;
                } else if (subtitledata[mid].startTime < newTime) {
                    start = mid + 1; 
                } else {
                    end = mid - 1;
                }
            } else {
                this.subtitleIndex = 0;
                break;
            }
        } 
       
        if (this.subtitleIndex == -1) {
            this.subtitleIndex = subtitledata.length - 1;
        }

        this.subtitleSeek = 0;
        //alert("ERROR NEWTIME: " + newTime + " INDEX: " + this.subtitleIndex);
    }

    Player.setSubtitleText = function(time)
    {
        time = Math.floor(time) + this.subtitleOffset;
        if (subtitledata != null && this.subtitleSeek == 0) {
            if (time >= subtitledata[this.subtitleIndex].endTime) {
                widgetAPI.putInnerHTML(document.getElementById("subtext"), "");
                if (subtitledata.length - 1 > this.subtitleIndex){
                    this.subtitleIndex++;
                }
            }
            if (time >= subtitledata[this.subtitleIndex].startTime && time < subtitledata[this.subtitleIndex].endTime && document.getElementById("subtext").innerHTML != subtitledata.text) {
                widgetAPI.putInnerHTML(document.getElementById("subtext"), subtitledata[this.subtitleIndex].text);
            }
        }
    }

    Player.setSubtitleSync = function(offset)
    {
        this.subtitleOffset = offset * 100;
    }

    Player.getState = function()
    {
        return this.state;
    }

    Player.getResolution = function()
    {
        var resolution = Player.AVPlayer.getVideoResolution();
        if (resolution != -1) {
            return resolution.replace("|", "x");
        } else {
            return "";
            //return mediaPageText[lang][5];
        }
    }

    Player.getCurrentBitrate = function()
    {
        var bitrate = Player.AVPlayer.getCurrentBitrate();
        if (bitrate != -1) {
            return Math.round(bitrate / 1024) + ' kbps';
        } else {
            return mediaPageText[lang][5];
        }
    }

    Player.getAudioInfo = function()
    {
        return Player.AVPlayer.totalNumOfAudio + ' ' + mediaPageText[lang][4];
    }

    // Global functions called directly by the player 

    Player.onBufferingStart = function()
    {
        this.isBuffering = 1;
        ScenePlayerPage.prototype.SetZIndex("visible", 5600);
        Display.status("..." + playerStateText[lang][3] + "...", 'images\\buffering.png');        
        switch(this.skipState)
        {
            case this.FORWARD:
                document.getElementById("playpause").src = 'images\\pause.png';
                break;
            
            case this.BACKWARD:
                document.getElementById("playpause").src = 'images\\pause.png';
                break;
        }
        var focusedName = sf.scene.getFocused();
        if (focusedName == 'LoadSubtitle') {
            sf.scene.hide('LoadSubtitle', {caller: "PlayerPage"});
            sf.scene.hide('SubtitleMenu');
            sf.scene.focus('PlayerPage');
        } else if (focusedName == 'SubtitleMenu') {
            sf.scene.hide('SubtitleMenu');
            sf.scene.focus('PlayerPage');
        } else if (focusedName == 'AudioMenu') {
            sf.scene.hide('AudioMenu');
            sf.scene.focus('PlayerPage');
        } else if (focusedName == 'SubtitleSync') {
            sf.scene.hide('SubtitleSync');
            sf.scene.hide('SubtitleMenu');
            sf.scene.focus('PlayerPage');
        } else if (focusedName == 'SubtitleStyle') {
            sf.scene.hide('SubtitleStyle');
            sf.scene.hide('SubtitleMenu');
            sf.scene.focus('PlayerPage');
        } else if (focusedName == 'SubtitleSearch') {
            sf.scene.hide('SubtitleSearch');
            sf.scene.hide('SubtitleMenu');
            sf.scene.focus('PlayerPage');
        }
    }

    Player.onBufferingProgress = function(percent)
    {
        ScenePlayerPage.prototype.SetZIndex("visible", 5600);
        Display.status(playerStateText[lang][3] + ": " + percent + "%", 'images\\buffering.png');
    }

    Player.onBufferingComplete = function()
    {
        Display.status(playerStateText[lang][0], 'images\\play.png');
        ScenePlayerPage.prototype.SetZIndex("hidden", 500);
        switch(this.skipState)
        {
            case this.FORWARD:
                if(Player.state == Player.PLAYING) {
                    Display.status(playerStateText[lang][0], 'images\\play.png');
                } else {
                    Display.status(playerStateText[lang][1], 'images\\pause.png');
                }
                break;
            
            case this.BACKWARD:
                if(Player.state == Player.PLAYING) {
                    Display.status(playerStateText[lang][0], 'images\\play.png');
                } else {
                    Display.status(playerStateText[lang][1], 'images\\pause.png');
                }
                break;
        }
        Player.AVPlayer.resume();
        this.isBuffering = 0;
        this.subtitleFirsRun = 1;
        this.tryCount = 0;
    }

    Player.setCurTime = function(time)
    {
        this.resumetime = time.millisecond;
                
        if (resume['time'] != 0 && time.millisecond > 1000) {
            Player.skipForwardVideo(Math.floor(resume['time'] / 1000));
            resume['time'] = 0;
        } else {
            if (issubtitle && this.subtitleState == 1) {
                if (this.subtitleFirsRun == 1) {
                    this.subtitleFirsRun = 0;
                    Player.setSubtitleIndex(time.millisecond);
                } else {
                    Player.setSubtitleText(time.millisecond);
                }
            }
        }

        Display.setTime(time);
        // Need because onbuffering only called later or not called at all
        /*if (this.isBuffering == 1) {
            this.isBuffering = 0;
            ScenePlayerPage.prototype.SetZIndex("hidden", 500);
        }*/
    }

    Player.setTotalTime = function()
    {
        this.totalTime = Player.AVPlayer.getDuration();
        Display.setTotalTime(this.totalTime);
    }

    onServerError = function()
    {
        Display.status(playerStateText[lang][4], 'images\\warning.png');
    }

    OnNetworkDisconnected = function()
    {
        Display.status(playerStateText[lang][5], 'images\\warning.png');
    }

    /*************** Display.js *******************/
    var Display =
    {
        isVisible: 0,
        statusDiv : null,
        timerID : null,
        volumeTimerId: null,
        totalTime : 0        
    }

    Display.init = function()
    {
        this.clear();
        var displaysuccess = true;
        
        this.statusDiv = document.getElementById("mediastate");

        if (!this.statusDiv)
        {
            displaysuccess = false;
        }
        
        return displaysuccess;
    }

    Display.clear = function()
    {
        this.isVisible = 0;
        this.statusDiv = null;
        this.timerID = null;
        this.volumeTimerId = null;
        this.totalTime = 0;

        document.getElementById("volumeimage").src = 'images\\volume.png';
        document.getElementById("mediavolume").style.visibility = 'hidden';
        document.getElementById("chevron").style.left = "0%";
    }

    Display.setTotalTime = function(total)
    {
        this.totalTime = total;
    }

    Display.timeToHTML = function(time)
    {
        var timeHTML = "";
        var timeHour = 0;
        var timeMinute = 0;
        var timeSecond = 0;

        timeHour = Math.floor(time/3600000);
        timeMinute = Math.floor((time%3600000)/60000);
        timeSecond = Math.floor((time%60000)/1000);
        
        if(timeHour == 0)
            timeHTML += "00:";
        else if(timeHour <10)
            timeHTML += "0" + timeHour + ":";
        else
            timeHTML += timeHour + ":";
        
        if(timeMinute == 0)
            timeHTML += "00:";
        else if(timeMinute <10)
            timeHTML += "0" + timeMinute + ":";
        else
            timeHTML += timeMinute + ":";
            
        if(timeSecond == 0)
            timeHTML += "00";
        else if(timeSecond <10)
            timeHTML += "0" + timeSecond;
        else
            timeHTML += timeSecond;

        return timeHTML;            
    }

    Display.setTime = function(time)
    {
        time = time.millisecond;
        this.currentTime = time;
        var timePercent = (100 * time) / this.totalTime;
        var timeElements = document.getElementById("mediatimes");
        var timeHTML = "";
        var timeHour = 0; var timeMinute = 0; var timeSecond = 0;
        var totalTimeHour = 0; var totalTimeMinute = 0; var totalTimesecond = 0;
        
        document.getElementById("mediaprogressbarpercent").style.width = timePercent + "%";
        if (Player.isChevron == 0) {
            if (timePercent <= 100) {
                document.getElementById("chevron").style.left = timePercent + "%";
            } else {
                document.getElementById("chevron").style.left = "100%";
            }
        }
        
        //if(Player.state == Player.PLAYING)
        if(Player.state)
        {
            totalTimeHour = Math.floor(this.totalTime/3600000);
            timeHour = Math.floor(time/3600000);
            
            totalTimeMinute = Math.floor((this.totalTime%3600000)/60000);
            timeMinute = Math.floor((time%3600000)/60000);
            
            totalTimeSecond = Math.floor((this.totalTime%60000)/1000);
            timeSecond = Math.floor((time%60000)/1000);
            
            timeHTML = "";

            if(timeHour == 0)
                timeHTML += "00:";
            else if(timeHour <10)
                timeHTML += "0" + timeHour + ":";
            else
                timeHTML += timeHour + ":";
            
            if(timeMinute == 0)
                timeHTML += "00:";
            else if(timeMinute <10)
                timeHTML += "0" + timeMinute + ":";
            else
                timeHTML += timeMinute + ":";
                
            if(timeSecond == 0)
                timeHTML += "00/";
            else if(timeSecond <10)
                timeHTML += "0" + timeSecond + "/";
            else
                timeHTML += timeSecond + "/";
                
            //timeHTML = time + "/";
            if(totalTimeHour == 0)
                timeHTML += "00:";
            else if(totalTimeHour <10)
                timeHTML += "0" + totalTimeHour + ":";
            else
                timeHTML += totalTimeHour + ":";
            
            if(totalTimeMinute == 0)
                timeHTML += "00:";
            else if(totalTimeMinute <10)
                timeHTML += "0" + totalTimeMinute + ":";
            else
                timeHTML += totalTimeMinute + ":";
                
            if(totalTimeSecond == 0)
                timeHTML += "00";
            else if(totalTimeSecond <10)
                timeHTML += "0" + totalTimeSecond;
            else
                timeHTML += totalTimeSecond;
        }
        else
            timeHTML = "00:00:00 / 00:00:00";     
        
        widgetAPI.putInnerHTML(timeElements, timeHTML);        
    }

    Display.status = function(status, image)
    {
        alert(status);
        widgetAPI.putInnerHTML(this.statusDiv, status);
        document.getElementById('mediastateimage').src = image;
    }


    Display.show = function()
    {
        this.isVisible = 1;
        document.getElementById("subcontainer").style.height = '391px';
        document.getElementById("mediaheader").style.display = 'block';
        document.getElementById("mediabar").style.display = 'block';
        /*if (Display.timerID) {
            clearTimeout(Display.timerID);
            Display.timerID = null;
        }*/

    }

    Display.showTimer = function()
    {
        document.getElementById("subcontainer").style.height = '391px';
        document.getElementById("mediaheader").style.display = 'block';
        document.getElementById("mediabar").style.display = 'block';
        if (Display.timerID) {
            clearTimeout(Display.timerID);
            Display.timerID = null;
        }
        Display.timerID = setTimeout(function () {
            document.getElementById("mediaheader").style.display = 'none';
            document.getElementById("mediabar").style.display = 'none';
            document.getElementById("subcontainer").style.height = '428px';
        }, 5000);

    }

    Display.setVolume = function(level)
    {   
        document.getElementById("volumeimage").src = 'images\\volume.png';
        widgetAPI.putInnerHTML(document.getElementById("volumelevel"), level.pad(3));
        document.getElementById("mediavolume").style.visibility = 'visible';

        if (Display.volumeTimerID) {
            clearTimeout(Display.volumeTimerID);
            Display.volumeTimerID = null;
        }
        Display.volumeTimerID = setTimeout(function () {
            document.getElementById("mediavolume").style.visibility = 'hidden';
        }, 2000);
    }

    Display.setMute = function(level, muted)
    {   
        if (Display.volumeTimerID) {
            clearTimeout(Display.volumeTimerID);
            Display.volumeTimerID = null;
        }

        if (muted == 0) {
            document.getElementById("volumeimage").src = 'images\\volumemute.png';
            widgetAPI.putInnerHTML(document.getElementById("volumelevel"), level.pad(3));
            document.getElementById("mediavolume").style.visibility = 'visible';
        } else {
            //document.getElementById("mediavolume").style.visibility = 'hidden';
            document.getElementById("volumeimage").src = 'images\\volume.png';
            Display.volumeTimerID = setTimeout(function () {
                document.getElementById("mediavolume").style.visibility = 'hidden';
            }, 2000);
        }
    }

    Display.hide = function()
    {
        this.isVisible = 0;
        document.getElementById("mediaheader").style.display = 'none';
        document.getElementById("mediabar").style.display = 'none';
        document.getElementById("subcontainer").style.height = saveSettings['subtitleposition'];
    }

    /*************** Audio.js *******************/
    var Audio =
    {
        plugin : null,
        muted: 0
    }

    Audio.init = function()
    {
        this.clear();
        var success = true;
        
        this.plugin = document.getElementById("pluginAudio1");
        this.plugin.Open("Audio",1.0,"Audio");
        if (!this.plugin)
        {
            success = false;
        }

        return success;
    }

    Audio.clear = function()
    {        
        if (this.plugin != null) {
            this.plugin.Execute("SetUserMute",false);
        }
        this.plugin = null;
        this.muted = 0;
    }

    Audio.setRelativeVolume = function(delta)
    {
        this.plugin.Execute("SetVolumeWithKey",delta);
        this.muted = 0;
        Display.setVolume( this.getVolume() );

    }

    Audio.getVolume = function()
    {
        alert("Volume : " +  this.plugin.Execute("GetVolume"));
        return this.plugin.Execute("GetVolume");
    }

    Audio.setMute = function()
    {
        if (this.muted == 0) {
            Display.setMute(this.getVolume(), 0);
            this.plugin.Execute("SetUserMute",true);
            this.muted = 1;
        } else {
            Display.setMute(this.getVolume(), 1);
            this.plugin.Execute("SetUserMute",false);
            this.muted = 0;
        }
    }

    this.Player = Player;
    this.Display = Display;
    this.Audio = Audio;

    // Set subtitle styles
    this.subtext = document.getElementById('subtext');
    this.subcontainer = document.getElementById('subcontainer');
    
    this.subtext.style.fontSize = saveSettings['subtitlesize'];
    this.subcontainer.style.height = saveSettings['subtitleposition'];
    this.subtext.style.color = saveSettings['subtitlecolor'];
    this.subtext.style.backgroundColor = ColorToRGBA(saveSettings['subtitlebgcolor'], saveSettings['subtitleopacity']);
}

ScenePlayerPage.prototype.handleShow = function (data) {
    downloadprogress = true;
    
    document.getElementById("ProgressBar").style.visibility = 'hidden';
    this.CheckDownload();
    
    this.caller = data.caller;
    this.filetitle = data.filetitle.toUpperCase();
	if (this.Player.init() && this.Audio.init() && this.Display.init()) {
        if (data.title != "") {
            widgetAPI.putInnerHTML(document.getElementById("mediatitle"), data.title.substring(0, 80).toUpperCase());
        } else {
            widgetAPI.putInnerHTML(document.getElementById("mediatitle"), data.filetitle.substring(0, 80).toUpperCase());
        }
        
        this.Display.setTime(0);
        this.Player.stopCallback = function() {
            infoHash = '';

            this.Player.clear(); this.Display.clear(); this.Display.hide(); this.Audio.clear();

            if (data.caller != "MultiVideo") {
                $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});
            }
        }.bind(this);
        this.Player.setVideoURL(data.url);
        this.Player.playVideo();
    } else {
        alert("Failed to initialise");
    }
    // Clear Subtitle offset
    sf.scene.get('SubtitleSync').ClearOffset();

    if (document.getElementById("TimeInfoInHeader").innerHTML != "") {
        widgetAPI.putInnerHTML(document.getElementById("currenttime"), document.getElementById("TimeInfoInHeader").innerHTML);
        document.getElementById("currenttime").style.visibility = "visible";
    }
};

ScenePlayerPage.prototype.handleHide = function () {
    ScenePlayerPage.prototype.SetZIndex("hidden", 500);
    document.getElementById("ProgressBar").style.visibility = 'hidden';
    widgetAPI.putInnerHTML(document.getElementById("subtext"), "");
    document.getElementById("subcontainer").style.visibility = 'hidden';
    
    downloadprogress = false;
    
    document.getElementById("mediaheader").style.display = 'none';
    document.getElementById("mediabar").style.display = 'none';
    document.getElementById("playerbox960x540").style.visibility = 'hidden';
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

    // Set subtitle menu to starting state
    subtitleMenuText['name'][0] = 'hide';
    subtitleMenuText[lang][0] = subtitleShowText[lang];

    if (this.caller == "HostsMenu") {
        document.getElementById('poster').className = "posterBasic";
        document.getElementById('OverlayHostsMenu').style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";

        sf.scene.focus('HostsMenu');
    } else if (this.caller == "ReceiverPage") {
        widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverText[lang] + "HTTP://" + serverIP + ":9000");
        document.getElementById("noConnection").style.visibility = "visible";
        sf.scene.focus('ReceiverPage');
    } else if (this.caller == "MultiVideo") {
        document.getElementById('OverlayMultiVideo').style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        sf.scene.focus('MultiVideo');
    }
};

ScenePlayerPage.prototype.handleFocus = function (data) {};

ScenePlayerPage.prototype.handleBlur = function () {};

ScenePlayerPage.prototype.handleKeyDown = function (keyCode) {
    if (this.Player.isSuccess == 1 && this.Player.isBuffering == 0) {
        switch (keyCode) {
            case sf.key.INFO:
                this.handleInfoKey();
                break;
            case sf.key.LEFT:
                this.handleLeftKey();
                break;
            case sf.key.RIGHT:
                this.handleRightKey();
                break;
            case sf.key.UP:
                this.handleUpKey();
                break;
            case sf.key.DOWN:
                this.handleDownKey();
                break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                this.handleStopKey();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
            case sf.key.PAUSE:
                this.handlePauseKey();
                break;
            case sf.key.PLAY:
                this.handlePlayKey();
                break;
            case sf.key.STOP:
                sf.key.preventDefault();
                this.handleStopKey();
                break;
            case sf.key.RETURN:
                sf.key.preventDefault();
                this.handleReturnKey();
                break;
            case sf.key.ENTER:
                this.handleEnterKey();
                break;
            case sf.key.MUTE:
                this.handleMuteKey();
                break;
            case sf.key.VOL_UP:
                this.handleVolUpKey();
                break;
            case sf.key.VOL_DOWN:
                this.handleVolDownKey();
                break;
        }
    } else if (this.Player.isSuccess == 1 && this.Player.isBuffering == 1) {
        switch (keyCode) {
            case sf.key.INFO:
            case sf.key.ENTER:
                if (this.Display.isVisible == 0) {
                    this.Display.show();
                }
                break;
            case sf.key.RETURN:
                sf.key.preventDefault();
                this.handleReturnKey();
                break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                this.handleStopKey();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
        }
    } else {
        switch (keyCode) {
            case sf.key.RETURN:
                sf.key.preventDefault();
                this.handleReturnKey();
                break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                this.handleStopKey();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
        }
    }
}

ScenePlayerPage.prototype.handlePlayKey = function()
{
    switch ( this.Player.getState() )
    {
        case this.Player.STOPPED:
            this.Player.playVideo();
            //this.Display.showTimer();
            break;
            
        case this.Player.PAUSED:
            this.Player.resumeVideo();
            //this.Display.showTimer();
            break;
            
        default:
            alert("Ignoring play key, not in correct state");
            break;
    }
}

ScenePlayerPage.prototype.handlePauseKey = function()
{
    switch ( this.Player.getState() )
    {
        case this.Player.PLAYING:
            this.Player.pauseVideo();
            this.Display.show();
            break;
        
        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

ScenePlayerPage.prototype.handleReturnKey = function()
{
    switch (this.Player.getState())
    {
        case this.Player.PLAYING:
            if (this.Display.isVisible == 1) {                
                this.handleDownKey();
                this.Display.hide();                
            } else {
                this.handleStopKey();
            }
            break;

        case this.Player.PAUSED:
            this.handleStopKey();            
            break;
        
        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

ScenePlayerPage.prototype.handleEnterKey = function()
{
    switch ( this.Player.getState() )
    {
        case this.Player.PLAYING:
        case this.Player.PAUSED:
            if (this.Display.isVisible == 0) {
                this.Display.show();
            } else {
                if (this.Player.isChevron == 0) {
                    if (this.Player.menuPosition == 1) {
                        if (this.Player.getState() == this.Player.PLAYING) {
                            this.Player.pauseVideo();
                        } else {
                            this.Player.resumeVideo();
                        }
                    } else if (this.Player.menuPosition == 2) {
                        this.handleStopKey();
                    } else if (this.Player.menuPosition == 3) {
                        sf.scene.show('AudioMenu', this.Player.AVPlayer.totalNumOfAudio);
                        sf.scene.focus('AudioMenu');
                        //this.Player.resumeVideo();
                    } else if (this.Player.menuPosition == 4) {
                        if (saveSettings['issubtitleenabled'] == "true" && issubtitle == false) {
                            sf.scene.show('SubtitleSearch', {caller: "PlayerPage"});
                            sf.scene.focus('SubtitleSearch');
                        } else {
                            sf.scene.show('SubtitleMenu');
                            sf.scene.focus('SubtitleMenu');
                        }
                    }
                } else {
                    var tipTime = document.getElementById("timetip").innerHTML.toMilliSeconds();
                    //alert("ERROR: " + tipTime + " - " + currentTime + " = " + (tipTime - currentTime));
                    if (tipTime > this.Display.currentTime) {
                        if(this.Player.getState() == this.Player.PLAYING) {
                            this.Player.skipForwardVideo(Math.floor((tipTime - this.Display.currentTime) / 1000));
                        }
                    } else {
                        if(this.Player.getState() == this.Player.PLAYING) {
                            this.Player.skipBackwardVideo(Math.floor((this.Display.currentTime - tipTime) / 1000));
                        }
                    }
                }
            }
            break;

        default:
            alert("Ignoring Enter key, not in correct state");
            break;
    }
}

ScenePlayerPage.prototype.handleInfoKey = function()
{
    switch ( this.Player.getState() )
    {
        case this.Player.PLAYING:
            if (this.Display.isVisible == 0) {
                this.Display.show();
            } else {
                this.handleDownKey();
                this.Display.hide();
            }
            break;
        
        default:
            alert("Ignoring Info key, not in correct state");
            break;
    }
}

ScenePlayerPage.prototype.handleLeftKey = function()
{ 
    if (this.Display.isVisible == 1) {
        if (this.Player.isChevron == 0) {
            if (this.Player.menuPosition == 4) {
                document.getElementById("subbutton").style.backgroundColor = 'initial';
                document.getElementById("audiobutton").style.backgroundColor = '#505050';
                this.Player.menuPosition = 3;
            } else if (this.Player.menuPosition == 3) {
                document.getElementById("audiobutton").style.backgroundColor = 'initial';
                document.getElementById("stop").style.backgroundColor = '#505050';
                this.Player.menuPosition = 2;
            } else if (this.Player.menuPosition == 2) {
                document.getElementById("stop").style.backgroundColor = 'initial';
                document.getElementById("playpause").style.backgroundColor = '#505050';
                this.Player.menuPosition = 1;
            } else if (this.Player.menuPosition == 1) {
                document.getElementById("playpause").style.backgroundColor = 'initial';
                document.getElementById("subbutton").style.backgroundColor = '#505050';
                this.Player.menuPosition = 4;
            }
        } else {
            var chevronpos = parseFloat(document.getElementById("chevron").style.left);
            if (chevronpos >= 1) {
                document.getElementById("chevron").style.left = chevronpos - 1 + "%";
            } else {
                document.getElementById("chevron").style.left = "0%";
            }
            chevronpos = parseFloat(document.getElementById("chevron").style.left);

            var timetip = document.getElementById("timetip");
            widgetAPI.putInnerHTML(timetip, this.Display.timeToHTML((this.Display.totalTime / 100) * chevronpos));

            var tippos = chevronpos;
            if (tippos <= 0.2) {
                timetip.style.left = "0.2%";
            } else if (tippos >= 95.8) {
                timetip.style.left = "95.8%";
            } else {
                timetip.style.left = tippos + "%";
            }
        }
    }
}

ScenePlayerPage.prototype.handleRightKey = function()
{
    if (this.Display.isVisible == 1) {
        if (this.Player.isChevron == 0) {
            if (this.Player.menuPosition == 1) {
                document.getElementById("playpause").style.backgroundColor = 'initial';
                document.getElementById("stop").style.backgroundColor = '#505050';
                this.Player.menuPosition = 2;
            } else if (this.Player.menuPosition == 2) {
                document.getElementById("stop").style.backgroundColor = 'initial';
                document.getElementById("audiobutton").style.backgroundColor = '#505050';
                this.Player.menuPosition = 3;
            } else if (this.Player.menuPosition == 3) {
                document.getElementById("audiobutton").style.backgroundColor = 'initial';
                document.getElementById("subbutton").style.backgroundColor = '#505050';
                this.Player.menuPosition = 4;
            } else if (this.Player.menuPosition == 4) {
                document.getElementById("subbutton").style.backgroundColor = 'initial';
                document.getElementById("playpause").style.backgroundColor = '#505050';
                this.Player.menuPosition = 1;
            }
        } else {
            var chevronpos = parseFloat(document.getElementById("chevron").style.left);
            if (chevronpos <= 99) {
                document.getElementById("chevron").style.left = chevronpos + 1 + "%";
            } else {
                document.getElementById("chevron").style.left = "100%";
            }
            chevronpos = parseFloat(document.getElementById("chevron").style.left);            

            var timetip = document.getElementById("timetip");
            widgetAPI.putInnerHTML(timetip, this.Display.timeToHTML((this.Display.totalTime / 100) * chevronpos));

            var tippos = chevronpos;
            if (tippos <= 0.2) {
                timetip.style.left = "0.2%";
            } else if (tippos >= 95.8) {
                timetip.style.left = "95.8%";
            } else {
                timetip.style.left = tippos + "%";
            }
        }
    }
}

ScenePlayerPage.prototype.handleUpKey = function()
{
    if (this.Display.isVisible == 1) {
        if (this.Player.isChevron == 0 && this.Player.getState() != this.Player.PAUSED) {
            this.Player.isChevron = 1;
            if (this.Player.menuPosition == 1) {
                document.getElementById("playpause").style.backgroundColor = 'initial';
            } else if (this.Player.menuPosition == 2) {
                document.getElementById("stop").style.backgroundColor = 'initial';
            } else if (this.Player.menuPosition == 3) {
                document.getElementById("audiobutton").style.backgroundColor = 'initial';
            } else if (this.Player.menuPosition == 4) {
                document.getElementById("subbutton").style.backgroundColor = 'initial';
            }
            document.getElementById("chevron").style.backgroundColor = '#505050';
            document.getElementById("chevron").style.borderColor = '#505050';

            var timetip = document.getElementById("timetip");
            widgetAPI.putInnerHTML(timetip, document.getElementById("mediatimes").innerHTML.split('/')[0]);

            var tippos = parseFloat(document.getElementById("chevron").style.left);
            if (tippos <= 0.2) {
                timetip.style.left = "0.2%";
            } else if (tippos >= 95.8) {
                timetip.style.left = "95.8%";
            } else {
                timetip.style.left = tippos + "%";
            }
            timetip.style.visibility = 'visible';
        }
    }
}

ScenePlayerPage.prototype.handleDownKey = function()
{
    if (this.Display.isVisible == 1) {
        if (this.Player.isChevron == 1) {
            this.Player.isChevron = 0;
            document.getElementById("timetip").style.visibility = 'hidden';
            document.getElementById("chevron").style.backgroundColor = '#ffffff';
            document.getElementById("chevron").style.borderColor = '#ffffff';
            var timePercent = document.getElementById("mediaprogressbarpercent").style.width.slice(0, -1);
            if (timePercent <= 100) {
                document.getElementById("chevron").style.left = timePercent + "%";
            } else {
                document.getElementById("chevron").style.left = "100%";
            }

            if (this.Player.menuPosition == 1) {
                document.getElementById("playpause").style.backgroundColor = '#505050';
            } else if (this.Player.menuPosition == 2) {
                document.getElementById("stop").style.backgroundColor = '#505050';
            } else if (this.Player.menuPosition == 3) {
                document.getElementById("audiobutton").style.backgroundColor = '#505050';
            } else if (this.Player.menuPosition == 4) {
                document.getElementById("subbutton").style.backgroundColor = '#505050';
            }
        }
    }
}

ScenePlayerPage.prototype.handleStopKey = function()
{
    if (this.Player.getState() != this.Player.STOPPED) {
        if (issubtitle) {
            this.Player.stopSubtitle();
        }
        this.Player.stopVideo();
    }
    sf.scene.hide('PlayerPage');
}

ScenePlayerPage.prototype.handleMuteKey = function() {
    this.Audio.setMute();
}

ScenePlayerPage.prototype.handleVolUpKey = function() {
    this.Audio.setRelativeVolume(0);
}

ScenePlayerPage.prototype.handleVolDownKey = function() {
    this.Audio.setRelativeVolume(1);
}

ScenePlayerPage.prototype.DownloadAnotherSubtitle = function(zipdownload, menuelement, menuHTML, fn) {
    widgetAPI.putInnerHTML(menuelement, subtitleLoadText[lang][0]); // wait text

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                reqSuccess = true;
                //alert("SUBTITLE DOWNLOAD: " + xhr.responseText);
                //this.setSubtitleOffset(0);
                sf.scene.get('SubtitleSync').ClearOffset();

                this.Player.stopSubtitle();
                document.getElementById("subcontainer").style.visibility = 'hidden';

                issubtitle = true;
                subtitledata = [];
                subtitledata = ParseSrtSubtitle(xhr.responseText);
                
                document.getElementById("subcontainer").style.visibility = 'visible';
                this.Player.startSubtitle();

                fn(true, menuelement, menuHTML);
            } else {
                reqSuccess = true;
                fn(false, menuelement, menuHTML);
            }

            if (xhr.destroy) { xhr.destroy(); }           
        }
    }.bind(this));

    xhr.open("GET", zipdownload);
    xhr.send();

    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            reqSuccess = true;
            fn(false, menuelement, menuHTML);
        }
    }, 15000);
}

ScenePlayerPage.prototype.SetZIndex = function(state, number) {
    if (state == "visible") {
        document.getElementById("loaDing").className = "loaderon";
    }
    document.getElementById("loaDing").style.visibility = state;
    if (state == "hidden") {
        document.getElementById("loaDing").className = "loaderoff";
    }
    document.getElementById("loaDing").style.zIndex = number;
}

ScenePlayerPage.prototype.menuStopSubtitle = function()
{
    if(this.Player.getState() != this.Player.STOPPED) {
        if (issubtitle) {
            this.Player.stopSubtitle();
            document.getElementById("subcontainer").style.visibility = 'hidden';
        }
    }
}

ScenePlayerPage.prototype.setSubtitleOffset = function(offset)
{
    this.Player.setSubtitleSync(offset);    
}

ScenePlayerPage.prototype.setAudioStreamID = function(number)
{
    this.Player.AVPlayer.setAudioStreamID(number);
}

ScenePlayerPage.prototype.CheckDownload = function() {
    if (window.getComputedStyle(document.getElementById("ProgressBar"), null).visibility == "hidden") {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        if (saveSettings['issubtitleenabled'] == "false") {
        	widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), downloadSpeedText[lang] + "0 B/s" + downloadBufferText[lang] + "0 B ( 0% )" + downloadPeersText[lang] + "0/0");
        }
        document.getElementById('poster').className = "posterDownload";
        document.getElementById("ProgressPercent").style.width = 0;
        document.getElementById("ProgressBar").style.visibility = 'visible';
    }

    $.ajax({
        url: infoHash,
        type: "GET",
        dataType: "json",
        timeout: 25000,
        startTime: new Date().getTime(),
        success: function(moredata) {
            if (downloadprogress == true && moredata) {
                //this.waiting = false;
                //var progressBarWidth = roundpercent * 960 / 100;
                if (new Date().getTime() - this.startTime >= 1000) {
                    $("#ProgressPercent").animate({ width: (moredata.downpercent * 960 / 100) }, 500);
                    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), downloadSpeedText[lang] + moredata.downspeed.replace("E","").replace("P", "") + downloadBufferText[lang] + moredata.downdata + " ( " + moredata.downpercent + "% )" + downloadPeersText[lang] + moredata.peers);
                }
            }
        },
        complete: function() {
            if (downloadprogress == true) {
                this.CheckDownload();
            }
        }.bind(this)
    });    
}

ScenePlayerPage.prototype.GetResumeTime = function() {
    return this.Player.resumetime;
}

ScenePlayerPage.prototype.SetCurrentTime = function(value) {
    widgetAPI.putInnerHTML(document.getElementById("currenttime"), value);
}
// Comment out the this function for real time Player Menu Auto Hide testing
/*ScenePlayerPage.prototype.playerMenuAutoHideTest = function()
{
    switch ( this.Player.getState() )
    {
        case this.Player.PLAYING:
            //this.Player.setSubtitleSync(100);
            this.Player.skipForwardVideo(300); // +5 minute jump
            break;
        
        default:
            alert("Ignoring Channel Up key, not in correct state");
            break;
    }
}*/