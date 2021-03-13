function SceneSubtitleStyle() {}

SceneSubtitleStyle.prototype.initialize = function () {
    this.colors = ["#FFFFFF", "#C0C0C0", "#808080", "#000000", "#FF0000", "800000", "#FFFF00", "#808000", "#00FF00", "#008000",
                   "#00FFFF", "#008080", "#0000FF", "#000080", "#FF00FF", "#800080", "#DC143C", "#FF4500", "#FFD700", "#00FF7F",
                   "#00CED1", "#A52A2A", "#BC8F8F", "#9370DB", "#FFA500", "#BDB76B", "#FFA94D"];

    this.positions = ["464", "461", "458", "455", "453", "450", "447", "444", "441", "439",
                      "436", "433", "430", "427", "425", "422", "419", "416", "413", "411",
                      "408", "405", "402", "399", "397", "394", "391"];

    this.opacity = ["0", "0.04", "0.06", "0.08", "0.12", "0.16", "0.2", "0.24", "0.28", "0.32",
                    "0.36", "0.4", "0.44", "0.48", "0.52", "0.56", "0.6", "0.64", "0.68", "0.72",
                    "0.76", "0.8", "0.84", "0.88", "0.92", "0.96", "1"];

    this.baseHTML = ['<div id="titletext"></div>',
                    '<div id="titlecontent"></div>',
                    '<div id="postext"></div>',
                    '<div id="poscontent"></div>',
                    '<div id="colortext"></div>',
                    '<div id="colorcontent"></div>',
                    '<div id="bgtext"></div>',
                    '<div id="bgcontent"></div>',
                    '<div id="bgotext"></div>',
                    '<div id="bgocontent"></div>'].join("\n");

    widgetAPI.putInnerHTML(document.getElementById('subtitlestyle'), this.baseHTML);

    this.subtext = document.getElementById('subtext');
    this.subcontainer = document.getElementById('subcontainer');
    
    this.titletext = document.getElementById('titletext');
    this.titlecontent = document.getElementById('titlecontent');
    this.titletext.innerText = subtitleStyleText[lang][0];
    var colorboxes = document.createElement('div');
    colorboxes.className = 'colorboxes';
    colorboxes.innerText = parseInt(saveSettings['subtitlesize']) - 19;
    this.titletext.appendChild(colorboxes);

    this.postext = document.getElementById('postext');
    this.poscontent = document.getElementById('poscontent');
    this.postext.innerText = subtitleStyleText[lang][1];
    colorboxes = document.createElement('div');
    colorboxes.className = 'colorboxes';
    colorboxes.innerText = this.positions.indexOf(saveSettings['subtitleposition']);
    this.postext.appendChild(colorboxes);

    this.colortext = document.getElementById('colortext');
    this.colorcontent = document.getElementById('colorcontent');
    this.colortext.innerText = subtitleStyleText[lang][2];
    colorboxes = document.createElement('div');
    colorboxes.className = 'colorboxes';
    colorboxes.innerText = this.colors.indexOf(saveSettings['subtitlecolor']);
    colorboxes.style.color = saveSettings['subtitlecolor'];
    colorboxes.style.backgroundColor = saveSettings['subtitlecolor'];
    this.colortext.appendChild(colorboxes);

    this.bgtext = document.getElementById('bgtext');
    this.bgcontent = document.getElementById('bgcontent');
    this.bgtext.innerText = subtitleStyleText[lang][3];
    colorboxes = document.createElement('div');
    colorboxes.className = 'colorboxes';
    colorboxes.innerText = this.colors.indexOf(saveSettings['subtitlebgcolor']);
    colorboxes.style.color = saveSettings['subtitlebgcolor'];
    colorboxes.style.backgroundColor = saveSettings['subtitlebgcolor'];
    this.bgtext.appendChild(colorboxes);

    this.bgotext = document.getElementById('bgotext');
    this.bgocontent = document.getElementById('bgocontent');
    this.bgotext.innerText = subtitleStyleText[lang][4];
    colorboxes = document.createElement('div');
    colorboxes.className = 'colorboxes';
    colorboxes.innerText = this.opacity.indexOf(saveSettings['subtitleopacity']);
    colorboxes.style.color = saveSettings['subtitlecolor'];
    colorboxes.style.backgroundColor = ColorToRGBA(saveSettings['subtitlebgcolor'], saveSettings['subtitleopacity']);
    this.bgotext.appendChild(colorboxes);

    for(var i=0; i<this.colors.length; i++) {
        colorboxes = document.createElement('div');
        if (parseInt(saveSettings['subtitlesize']) - 19 == i) {
            colorboxes.className = 'colorboxes atbox';
        } else {
            colorboxes.className = 'colorboxes';
        }
        colorboxes.innerText = i;
        this.titlecontent.appendChild(colorboxes);

        colorboxes = document.createElement('div');
        colorboxes.className = 'colorboxes';
        colorboxes.innerText = i;
        this.poscontent.appendChild(colorboxes);

        colorboxes = document.createElement('div');
        colorboxes.className = 'colorboxes';
        colorboxes.innerText = i;
        colorboxes.style.color = this.colors[i];
        colorboxes.style.backgroundColor = this.colors[i];
        this.colorcontent.appendChild(colorboxes);

        colorboxes = document.createElement('div');
        colorboxes.className = 'colorboxes';
        colorboxes.innerText = i;
        colorboxes.style.color = this.colors[i];
        colorboxes.style.backgroundColor = this.colors[i];
        this.bgcontent.appendChild(colorboxes);

        colorboxes = document.createElement('div');
        colorboxes.className = 'colorboxes';
        colorboxes.innerText = i;
        colorboxes.style.color = saveSettings['subtitlecolor'];
        colorboxes.style.backgroundColor = ColorToRGBA(saveSettings['subtitlebgcolor'], this.opacity[i]);
        this.bgocontent.appendChild(colorboxes);
    }

    this.titlelist = this.titlecontent.getElementsByClassName("colorboxes");
    this.poslist = this.poscontent.getElementsByClassName("colorboxes");
    this.colorlist = this.colorcontent.getElementsByClassName("colorboxes");
    this.bglist = this.bgcontent.getElementsByClassName("colorboxes");
    this.bgolist = this.bgocontent.getElementsByClassName("colorboxes");

    this.row = 0;

    document.getElementById('OverlaySubtitleStyle').style.height = document.getElementById('subtitlestyle').offsetHeight;
}

SceneSubtitleStyle.prototype.handleShow = function () {
    document.getElementById('OverlaySubtitleMenu').style.visibility = "hidden";
    document.getElementById('OverlayPlayerMenuInfo').style.visibility = "hidden";
    sf.scene.get('PlayerPage').Display.hide();    
    document.getElementById('OverlaySubtitleStyle').style.visibility = "visible";    
};

SceneSubtitleStyle.prototype.handleHide = function () {
    saveSettings['subtitlesize'] = parseInt(this.titletext.children[0].innerText) + 19;
    var p = parseInt(this.postext.children[0].innerText);
    saveSettings['subtitleposition'] = this.positions[p];
    p = parseInt(this.colortext.children[0].innerText);
    saveSettings['subtitlecolor'] = this.colors[p];
    p = parseInt(this.bgtext.children[0].innerText);
    saveSettings['subtitlebgcolor'] = this.colors[p];
    p = parseInt(this.bgotext.children[0].innerText);
    saveSettings['subtitleopacity'] = this.opacity[p];
    sf.core.localData('subtitlesize', saveSettings['subtitlesize']);
    sf.core.localData('subtitleposition', saveSettings['subtitleposition']);
    sf.core.localData('subtitlecolor', saveSettings['subtitlecolor']);
    sf.core.localData('subtitlebgcolor', saveSettings['subtitlebgcolor']);
    sf.core.localData('subtitleopacity', saveSettings['subtitleopacity']);
	document.getElementById('OverlaySubtitleStyle').style.visibility = "hidden";
    sf.scene.get('PlayerPage').Display.show();    
    document.getElementById('OverlaySubtitleMenu').style.visibility = "visible";
    document.getElementById('OverlayPlayerMenuInfo').style.visibility = "visible";
};

SceneSubtitleStyle.prototype.handleFocus = function () {};

SceneSubtitleStyle.prototype.handleBlur = function () {};

SceneSubtitleStyle.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
                sf.key.preventDefault();
                sf.scene.hide('SubtitleStyle');
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
            switch (this.row) {
                case 0:
                    var p = parseInt(this.titletext.children[0].innerText);
                    this.titlelist[p].className = "colorboxes";
                    if (p > 0) {
                        this.titlelist[p-1].className = "colorboxes atbox";
                        this.titletext.children[0].innerText = p - 1;
                        this.subtext.style.fontSize = p - 1 + 19;
                    } else {
                        this.titlelist[this.titlelist.length-1].className = "colorboxes atbox";
                        this.titletext.children[0].innerText = this.titlelist.length - 1;
                        this.subtext.style.fontSize = this.titlelist.length - 1 + 19;
                    }
                    break;
                case 1:
                    var p = parseInt(this.postext.children[0].innerText);
                    this.poslist[p].className = "colorboxes";
                    if (p > 0) {
                        this.poslist[p-1].className = "colorboxes atbox";
                        this.postext.children[0].innerText = p - 1;
                        this.subcontainer.style.height = this.positions[p-1];
                    } else {
                        this.poslist[this.poslist.length-1].className = "colorboxes atbox";
                        this.postext.children[0].innerText = this.poslist.length - 1;
                        this.subcontainer.style.height = this.positions[this.poslist.length - 1];
                    }
                    break;
                case 2:
                    var p = parseInt(this.colortext.children[0].innerText);
                    this.colorlist[p].className = "colorboxes";
                    if (p > 0) {
                        this.colorlist[p-1].className = "colorboxes acbox";
                        this.colortext.children[0].innerText = p - 1;
                        this.colortext.children[0].style.color = this.colors[p-1];
                        this.colortext.children[0].style.backgroundColor = this.colors[p-1];
                        this.subtext.style.color = this.colors[p-1];
                        this.bgotext.children[0].style.color = this.colors[p-1];
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.color = this.colors[p-1];
                        }
                    } else {
                        this.colorlist[this.colorlist.length-1].className = "colorboxes acbox";
                        this.colortext.children[0].innerText = this.colorlist.length-1;
                        this.colortext.children[0].style.color = this.colors[this.colorlist.length-1];
                        this.colortext.children[0].style.backgroundColor = this.colors[this.colorlist.length-1];
                        this.subtext.style.color = this.colors[this.colorlist.length-1];
                        this.bgotext.children[0].style.color = this.colors[this.colorlist.length-1]; 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.color = this.colors[this.colorlist.length-1];
                        } 
                    }
                    break;
                case 3:
                    var p = parseInt(this.bgtext.children[0].innerText);
                    this.bglist[p].className = "colorboxes";
                    if (p > 0) {
                        this.bglist[p-1].className = "colorboxes acbox";
                        this.bgtext.children[0].innerText = p - 1;
                        this.bgtext.children[0].style.color = this.colors[p-1];
                        this.bgtext.children[0].style.backgroundColor = this.colors[p-1];
                        var op = parseInt(this.bgotext.children[0].innerText);
                        this.subtext.style.backgroundColor  = ColorToRGBA(this.colors[p-1], this.opacity[op]);
                        this.bgotext.children[0].style.backgroundColor = ColorToRGBA(this.colors[p-1], this.opacity[op]); 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.backgroundColor = ColorToRGBA(this.colors[p-1], this.opacity[i]);
                        }
                    } else {
                        this.bglist[this.bglist.length-1].className = "colorboxes acbox";
                        this.bgtext.children[0].innerText = this.bglist.length-1;
                        this.bgtext.children[0].style.color = this.colors[this.bglist.length-1];
                        this.bgtext.children[0].style.backgroundColor = this.colors[this.bglist.length-1];
                        var op = parseInt(this.bgotext.children[0].innerText);
                        this.subtext.style.backgroundColor  = ColorToRGBA(this.colors[this.bglist.length-1], this.opacity[op]);
                        this.bgotext.children[0].style.backgroundColor = ColorToRGBA(this.colors[this.bglist.length-1], this.opacity[op]); 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.backgroundColor = ColorToRGBA(this.colors[this.bglist.length-1], this.opacity[i]);
                        }
                    }
                    break;
                case 4:
                    var p = parseInt(this.bgotext.children[0].innerText);
                    this.bgolist[p].className = "colorboxes";
                    if (p > 0) {
                        this.bgolist[p-1].className = "colorboxes acbox";
                        this.bgotext.children[0].innerText = p - 1;
                        this.bgotext.children[0].style.backgroundColor = this.bgolist[p-1].style.backgroundColor;
                        this.subtext.style.backgroundColor  = this.bgolist[p-1].style.backgroundColor;
                    } else {
                        this.bgolist[this.bgolist.length-1].className = "colorboxes acbox";
                        this.bgotext.children[0].innerText = this.bgolist.length-1;
                        this.bgotext.children[0].style.backgroundColor = this.bgolist[this.bglist.length-1].style.backgroundColor;
                        this.subtext.style.backgroundColor  = this.bgolist[this.bglist.length-1].style.backgroundColor;
                    }
                    break;
            }
            break;
        case sf.key.RIGHT:
            switch (this.row) {
                case 0:
                    var p = parseInt(this.titletext.children[0].innerText);
                    this.titlelist[p].className = "colorboxes";
                    if (p < (this.titlelist.length - 1)) {
                        this.titlelist[p+1].className = "colorboxes atbox";
                        this.titletext.children[0].innerText = p + 1;
                        this.subtext.style.fontSize = p + 1 + 19;                        
                    } else {
                        this.titlelist[0].className = "colorboxes atbox";
                        this.titletext.children[0].innerText = 0;
                        this.subtext.style.fontSize = 19;
                    }
                    break;
                case 1:
                    var p = parseInt(this.postext.children[0].innerText);
                    this.poslist[p].className = "colorboxes";
                    if (p < (this.poslist.length - 1)) {
                        this.poslist[p+1].className = "colorboxes atbox";
                        this.postext.children[0].innerText = p + 1;
                        this.subcontainer.style.height = this.positions[p+1];                       
                    } else {
                        this.poslist[0].className = "colorboxes atbox";
                        this.postext.children[0].innerText = 0;
                        this.subcontainer.style.height = this.positions[0];  
                    }
                    break;
                case 2:
                    var p = parseInt(this.colortext.children[0].innerText);
                    this.colorlist[p].className = "colorboxes";
                    if (p < (this.colorlist.length - 1)) {
                        this.colorlist[p+1].className = "colorboxes acbox";
                        this.colortext.children[0].innerText = p + 1;
                        this.colortext.children[0].style.color = this.colors[p+1];
                        this.colortext.children[0].style.backgroundColor = this.colors[p+1];
                        this.subtext.style.color = this.colors[p+1];
                        this.bgotext.children[0].style.color = this.colors[p+1]; 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.color = this.colors[p+1];
                        }
                    } else {
                        this.colorlist[0].className = "colorboxes acbox";
                        this.colortext.children[0].innerText = 0;
                        this.colortext.children[0].style.color = this.colors[0];
                        this.colortext.children[0].style.backgroundColor = this.colors[0];
                        this.subtext.style.color = this.colors[0];
                        this.bgotext.children[0].style.color = this.colors[0]; 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.color = this.colors[0];
                        }  
                    }
                    break;
                case 3:
                    var p = parseInt(this.bgtext.children[0].innerText);
                    this.bglist[p].className = "colorboxes";
                    if (p < (this.bglist.length - 1)) {
                        this.bglist[p+1].className = "colorboxes acbox";
                        this.bgtext.children[0].innerText = p + 1;
                        this.bgtext.children[0].style.color = this.colors[p+1];
                        this.bgtext.children[0].style.backgroundColor = this.colors[p+1];
                        var op = parseInt(this.bgotext.children[0].innerText);
                        this.subtext.style.backgroundColor  = ColorToRGBA(this.colors[p+1], this.opacity[op]);
                        this.bgotext.children[0].style.backgroundColor = ColorToRGBA(this.colors[p+1], this.opacity[op]); 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.backgroundColor = ColorToRGBA(this.colors[p+1], this.opacity[i]);
                        }
                    } else {
                        this.bglist[0].className = "colorboxes acbox";
                        this.bgtext.children[0].innerText = 0;
                        this.bgtext.children[0].style.color = this.colors[0];
                        this.bgtext.children[0].style.backgroundColor = this.colors[0];
                        var op = parseInt(this.bgotext.children[0].innerText);
                        this.subtext.style.backgroundColor  = ColorToRGBA(this.colors[0], this.opacity[op]);
                        this.bgotext.children[0].style.backgroundColor = ColorToRGBA(this.colors[0], this.opacity[op]); 
                        for(var i=0; i<this.bgolist.length; i++) {
                            this.bgolist[i].style.backgroundColor = ColorToRGBA(this.colors[0], this.opacity[i]);
                        }  
                    }
                    break;
                case 4:
                    var p = parseInt(this.bgotext.children[0].innerText);
                    this.bgolist[p].className = "colorboxes";
                    if (p < (this.bgolist.length - 1)) {
                        this.bgolist[p+1].className = "colorboxes acbox";
                        this.bgotext.children[0].innerText = p + 1;
                        this.bgotext.children[0].style.backgroundColor = this.bgolist[p+1].style.backgroundColor;
                        this.subtext.style.backgroundColor  = this.bgolist[p+1].style.backgroundColor;
                    } else {
                        this.bgolist[0].className = "colorboxes acbox";
                        this.bgotext.children[0].innerText = 0;
                        this.bgotext.children[0].style.backgroundColor = this.bgolist[0].style.backgroundColor;
                        this.subtext.style.backgroundColor  = this.bgolist[0].style.backgroundColor;
                    }
                    break;
            }
            break;
        case sf.key.DOWN:
            switch (this.row) {
                case 0:
                    var p = parseInt(this.titletext.children[0].innerText);
                    this.titlelist[p].className = "colorboxes";
                    this.row = 1;
                    p = parseInt(this.postext.children[0].innerText);
                    this.poslist[p].className = "colorboxes atbox";
                    break;
                case 1:
                    var p = parseInt(this.postext.children[0].innerText);
                    this.poslist[p].className = "colorboxes";
                    this.row = 2;
                    p = parseInt(this.colortext.children[0].innerText);
                    this.colorlist[p].className = "colorboxes acbox";
                    break;
                case 2:
                    var p = parseInt(this.colortext.children[0].innerText);
                    this.colorlist[p].className = "colorboxes";
                    this.row = 3;
                    p = parseInt(this.bgtext.children[0].innerText);
                    this.bglist[p].className = "colorboxes acbox";
                    break;
                case 3:
                    var p = parseInt(this.bgtext.children[0].innerText);
                    this.bglist[p].className = "colorboxes";
                    this.row = 4;
                    p = parseInt(this.bgotext.children[0].innerText);
                    this.bgolist[p].className = "colorboxes acbox";
                    break;
                case 4:
                    break;
            }
            break;
        case sf.key.UP:
            switch (this.row) {
                case 0:
                    break;
                case 1:
                    var p = parseInt(this.postext.children[0].innerText);
                    this.poslist[p].className = "colorboxes";
                    this.row = 0;
                    p = parseInt(this.titletext.children[0].innerText);
                    this.titlelist[p].className = "colorboxes atbox";
                    break;
                case 2:
                    var p = parseInt(this.colortext.children[0].innerText);
                    this.colorlist[p].className = "colorboxes";
                    this.row = 1;
                    p = parseInt(this.postext.children[0].innerText);
                    this.poslist[p].className = "colorboxes atbox";
                    break;                    
                case 3:
                    var p = parseInt(this.bgtext.children[0].innerText);
                    this.bglist[p].className = "colorboxes";
                    this.row = 2;
                    p = parseInt(this.colortext.children[0].innerText);
                    this.colorlist[p].className = "colorboxes acbox";                   
                    break;
                case 4:
                    var p = parseInt(this.bgotext.children[0].innerText);
                    this.bgolist[p].className = "colorboxes";
                    this.row = 3;
                    p = parseInt(this.bgtext.children[0].innerText);
                    this.bglist[p].className = "colorboxes acbox";                   
                    break;
            }
            break;             
    }
};