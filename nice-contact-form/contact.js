//Variables
var imagesPath = "images/";
var textareaTopPadding = 10;
var textareaSidePadding = 10;

//Global Variables
var NF = new Array();
var isIE = false;
var resizeTest = 1;

//Initialization function
function NFInit() {
    try {
        document.execCommand('BackgroundImageCache', false, true);
    } catch (e) {
    }
    if (!document.getElementById) {
        return false;
    }
    NFDo('start');
}
function NFDo(what) {
    var niceforms = document.getElementsByTagName('form');
    var identifier = new RegExp('(^| )' + 'niceform' + '( |$)');
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1);
        if (ieversion < 7) {
            return false;
        } //exit script if IE6
        isIE = true;
    }
    for (var q = 0; q < niceforms.length; q++) {
        if (identifier.test(niceforms[q].className)) {
            if (what == "start") { //Load Niceforms
                NF[q] = new niceform(niceforms[q]);
                niceforms[q].start();
            }
            else { //Unload Niceforms
                niceforms[q].unload();
                NF[q] = "";
            }
        }
    }
}
function NFFix() {
    NFDo('stop');
    NFDo('start');
}
function niceform(nf) {
    nf._inputText = new Array();
    nf._inputRadio = new Array();
    nf._inputCheck = new Array();
    nf._inputSubmit = new Array();
    nf._inputFile = new Array();
    nf._textarea = new Array();
    nf._select = new Array();
    nf._multiselect = new Array();
    nf.add_inputText = function(obj) {
        this._inputText[this._inputText.length] = obj;
        inputText(obj);
    }
    nf.add_inputSubmit = function(obj) {
        this._inputSubmit[this._inputSubmit.length] = obj;
        inputSubmit(obj);
    }
    nf.add_textarea = function(obj) {
        this._textarea[this._textarea.length] = obj;
        textarea(obj);
    }
    nf.start = function() {
        //Separate and assign elements
        var allInputs = this.getElementsByTagName('input');
        for (var w = 0; w < allInputs.length; w++) {
            switch (allInputs[w].type) {
                case "text":
                case "password":
                    {
                        this.add_inputText(allInputs[w]);
                        break;
                    }
                case "submit":
                case "reset":
                case "button":
                    {
                        this.add_inputSubmit(allInputs[w]);
                        break;
                    }
            }
        }
        var allButtons = this.getElementsByTagName('button');
        for (var w = 0; w < allButtons.length; w++) {
            this.add_inputSubmit(allButtons[w]);
        }
        var allTextareas = this.getElementsByTagName('textarea');
        for (var w = 0; w < allTextareas.length; w++) {
            this.add_textarea(allTextareas[w]);
        }
        //Start
        for (w = 0; w < this._inputText.length; w++) {
            this._inputText[w].init();
        }
        for (w = 0; w < this._inputSubmit.length; w++) {
            this._inputSubmit[w].init();
        }
        for (w = 0; w < this._textarea.length; w++) {
            this._textarea[w].init();
        }
    }
    nf.unload = function() {
        //Stop
        for (w = 0; w < this._inputText.length; w++) {
            this._inputText[w].unload();
        }
        for (w = 0; w < this._inputSubmit.length; w++) {
            this._inputSubmit[w].unload();
        }
        for (w = 0; w < this._textarea.length; w++) {
            this._textarea[w].unload();
        }
    }
}
function inputText(el) { //extent Text inputs
    el.oldClassName = el.className;
    el.left = document.createElement('img');
    el.left.src = imagesPath + "0.png";
    el.left.className = "NFTextLeft";
    el.right = document.createElement('img');
    el.right.src = imagesPath + "0.png";
    el.right.className = "NFTextRight";
    el.dummy = document.createElement('div');
    el.dummy.className = "NFTextCenter";
    el.onfocus = function() {
        this.dummy.className = "NFTextCenter NFh";
        this.left.className = "NFTextLeft NFh";
        this.right.className = "NFTextRight NFh";
    }
    el.onblur = function() {
        this.dummy.className = "NFTextCenter";
        this.left.className = "NFTextLeft";
        this.right.className = "NFTextRight";
    }
    el.init = function() {
        this.parentNode.insertBefore(this.left, this);
        this.parentNode.insertBefore(this.right, this.nextSibling);
        this.dummy.appendChild(this);
        this.right.parentNode.insertBefore(this.dummy, this.right);
        this.className = "NFText";
    }
    el.unload = function() {
        this.parentNode.parentNode.appendChild(this);
        this.parentNode.removeChild(this.left);
        this.parentNode.removeChild(this.right);
        this.parentNode.removeChild(this.dummy);
        this.className = this.oldClassName;
    }
}

function inputSubmit(el) { //extend Buttons
    el.oldClassName = el.className;
    el.left = document.createElement('img');
    el.left.className = "NFButtonLeft";
    el.left.src = imagesPath + "0.png";
    el.right = document.createElement('img');
    el.right.src = imagesPath + "0.png";
    el.right.className = "NFButtonRight";
    el.onmouseover = function() {
        this.className = "NFButton NFh";
        this.left.className = "NFButtonLeft NFh";
        this.right.className = "NFButtonRight NFh";
    }
    el.onmouseout = function() {
        this.className = "NFButton";
        this.left.className = "NFButtonLeft";
        this.right.className = "NFButtonRight";
    }
    el.init = function() {
        this.parentNode.insertBefore(this.left, this);
        this.parentNode.insertBefore(this.right, this.nextSibling);
        this.className = "NFButton";
    }
    el.unload = function() {
        this.parentNode.removeChild(this.left);
        this.parentNode.removeChild(this.right);
        this.className = this.oldClassName;
    }
}

function textarea(el) { //extend Textareas
    el.oldClassName = el.className;
    el.height = el.offsetHeight - textareaTopPadding;
    el.width = el.offsetWidth - textareaSidePadding;
    el.topLeft = document.createElement('img');
    el.topLeft.src = imagesPath + "0.png";
    el.topLeft.className = "NFTextareaTopLeft";
    el.topRight = document.createElement('div');
    el.topRight.className = "NFTextareaTop";
    el.bottomLeft = document.createElement('img');
    el.bottomLeft.src = imagesPath + "0.png";
    el.bottomLeft.className = "NFTextareaBottomLeft";
    el.bottomRight = document.createElement('div');
    el.bottomRight.className = "NFTextareaBottom";
    el.left = document.createElement('div');
    el.left.className = "NFTextareaLeft";
    el.right = document.createElement('div');
    el.right.className = "NFTextareaRight";
    el.init = function() {
        var top = this.parentNode;
        if (this.previousSibling) {
            var where = this.previousSibling;
        }
        else {
            var where = top.childNodes[0];
        }
        top.insertBefore(el.topRight, where);
        top.insertBefore(el.right, where);
        top.insertBefore(el.bottomRight, where);
        this.topRight.appendChild(this.topLeft);
        this.right.appendChild(this.left);
        this.right.appendChild(this);
        this.bottomRight.appendChild(this.bottomLeft);
        el.style.width = el.topRight.style.width = el.bottomRight.style.width = el.width + 'px';
        el.style.height = el.left.style.height = el.right.style.height = el.height + 'px';
        this.className = "NFTextarea";
    }
    el.unload = function() {
        this.parentNode.parentNode.appendChild(this);
        this.parentNode.removeChild(this.topRight);
        this.parentNode.removeChild(this.bottomRight);
        this.parentNode.removeChild(this.right);
        this.className = this.oldClassName;
        this.style.width = this.style.height = "";
    }
    el.onfocus = function() {
        this.topLeft.className = "NFTextareaTopLeft NFh";
        this.topRight.className = "NFTextareaTop NFhr";
        this.left.className = "NFTextareaLeftH";
        this.right.className = "NFTextareaRightH";
        this.bottomLeft.className = "NFTextareaBottomLeft NFh";
        this.bottomRight.className = "NFTextareaBottom NFhr";
    }
    el.onblur = function() {
        this.topLeft.className = "NFTextareaTopLeft";
        this.topRight.className = "NFTextareaTop";
        this.left.className = "NFTextareaLeft";
        this.right.className = "NFTextareaRight";
        this.bottomLeft.className = "NFTextareaBottomLeft";
        this.bottomRight.className = "NFTextareaBottom";
    }
}
//Get Position
function findPosY(obj) {
    var posTop = 0;
    do {
        posTop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return posTop;
}
function findPosX(obj) {
    var posLeft = 0;
    do {
        posLeft += obj.offsetLeft;
    } while (obj = obj.offsetParent);
    return posLeft;
}
//Get Siblings
function getInputsByName(name) {
    var inputs = document.getElementsByTagName("input");
    var w = 0;
    var results = new Array();
    for (var q = 0; q < inputs.length; q++) {
        if (inputs[q].name == name) {
            results[w] = inputs[q];
            ++w;
        }
    }
    return results;
}

//Add events
var existingLoadEvent = window.onload || function() {
};
var existingResizeEvent = window.onresize || function() {
};
window.onload = function() {
    existingLoadEvent();
    NFInit();
}
window.onresize = function() {
    if (resizeTest != document.documentElement.clientHeight) {
        existingResizeEvent();
        NFFix();
    }
    resizeTest = document.documentElement.clientHeight;
}
