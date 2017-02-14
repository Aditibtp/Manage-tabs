var source;
var tabTitles = [];
var tabId = [];
var tabid;
var index;
var lastColor = "#36304A";

function dumpAllOpenTabs() {
    var imgUrl = chrome.extension.getURL('images/delete.png');
    var allOpenTabsInWindow = chrome.tabs.getAllInWindow(
        function(tabsArray) {
            //  $('#tabtree').append(dumpTreeNodes(bookmarkTreeNodes, query));
            console.log(tabsArray);
            //chrome.browserAction.setBadgeText({text: "  "+tabsArray.length});
            for (var i = 0; i < tabsArray.length; i++) {
                tabTitles[i] = tabsArray[i].title;
                tabId[i] = tabsArray[i].id;
                $('#tabtree').append("<li class = 'tab-list' id = " + tabsArray[i].id + " datatabid = " + tabsArray[i].id + "  pos = " + i + " draggable= 'true'><span class = 'cont-span'><span><img class = 'favicon-img' src ='" + tabsArray[i].favIconUrl + "'></span><span class='tab-title'>" + tabsArray[i].title + "</span></span><span class = 'close-tab'><img src = '" + imgUrl + "'></span></li>");
                if(tabsArray[i].active){
                  $("#tabtree").find("li#" + tabsArray[i].id).addClass("open-tab");
                }
            }
            $('#tabtree li').click(function(e) {
                //console.log("comes here");
                var tabId = parseInt($(this).attr("datatabid"));
                //console.log(tabId);
                chrome.tabs.update(tabId, {
                    active: true,
                    selected: true
                });
                $("this").addClass("open-tab");
            });
            $('#tabtree li').mouseenter(function(e) {
                $(this).find('span.close-tab img').show(300);
            });
            $('#tabtree li').mouseleave(function(e) {
                $(this).find('span.close-tab img').hide();
            });
            $('span.close-tab').click(function() {
                var tabId = parseInt($(this).parent().attr("datatabid"));
                console.log(tabId);
                chrome.tabs.remove(tabId);
            });
            var lists = document.getElementsByClassName('tab-list');
            console.log(lists);

            for (var i = 0; i < lists.length; i++) {
                lists[i].addEventListener('dragenter', handleDragenter, false);
                lists[i].addEventListener('dragstart', handleDragstart, false);
                lists[i].addEventListener('dragexit', handleDragExit, false);
                lists[i].addEventListener('dragleave', handleDragLeave, false);
            }
            document.getElementsByTagName("input")[0].addEventListener("keydown", function() {
                var key = event.keyCode || event.charCode;
                if( key == 8 || key == 46 ){
                  $("ul#tabtree").find("li").css("display", "block");
                }
                var inputNode = document.getElementsByTagName("input")[0];
                var inputQuery = inputNode.value;
                console.log("inside onChange "+inputQuery);
                for (var i = 0; i < tabTitles.length; i++) {
                    if (tabTitles[i].toUpperCase().includes(inputQuery.toUpperCase()) === false) {
                        var liNode = $("ul#tabtree").find("li[id=" + tabId[i] + "]").css("display", "none");
                    }
                }
            }, false);
            var themeSpans = document.getElementsByClassName("theme-span");
            for(var i = 0; i<themeSpans.length; i++){
              themeSpans[i].addEventListener("click", function(e){
                e.target.style.borderWidth = "2px";
                e.target.style.borderStyle = "solid";
                e.target.style.borderColor = "#6deecd";
                var color = e.target.getAttribute("data-color");
                lastColor = color;
                $("ul#tabtree li").css("backgroundColor", color);
              });
            }

            for(var i = 0; i<themeSpans.length; i++){
              themeSpans[i].addEventListener("mouseover", function(e){
                e.target.style.borderWidth = "2px";
                e.target.style.borderStyle = "solid";
                e.target.style.borderColor = "#6deecd";
                var color = e.target.getAttribute("data-color");
                $("ul#tabtree li").css("backgroundColor", color);
              });
            }

            for(var i = 0; i<themeSpans.length; i++){
              themeSpans[i].addEventListener("mouseout", function(e){
                e.target.style.border = "";
                $("ul#tabtree li").css("backgroundColor", lastColor);
              });
            }
        });
};

document.addEventListener('DOMContentLoaded', function() {
    dumpAllOpenTabs();
});

function isbefore(a, b) {
    if (a.parentNode == b.parentNode) {
        for (var cur = a; cur; cur = cur.previousSibling) {
            if (cur === b) {
                return true;
            }
        }
    }
    return false;
};

function handleDragenter(e) {
    source.style.opacity = 1;

    if (isbefore(source, e.target)) {
        index = parseInt(e.target.getAttribute("pos"));
        document.getElementById("tabtree").insertBefore(source, e.target);
        //chrome.tabs.move(tabid, {index: index} );
        e.target.style.backgroundColor = "grey";
    } else {
        index = parseInt(e.target.nextSibling.getAttribute("pos"));
        document.getElementById("tabtree").insertBefore(source, e.target.nextSibling);
        e.target.nextSibling.style.backgroundColor = "grey";
        chrome.tabs.move(tabid, {index: index} );
    }
};

function handleDragstart(e) {
    source = e.currentTarget;
    tabid = parseInt(source.getAttribute("id"));
    source.style.opacity = 0.5;
    source.getElementsByClassName("close-tab")[0].getElementsByTagName("img")[0].style.paddingRight = "2px";
    source.style.paddingLeft = "2px";
    source.style.paddingRight = "2px";
    e.dataTransfer.effectAllowed = 'move';
};

function handleDragExit(e){
    source.style.opacity = 1;
};

function handleDragLeave(e) {
  chrome.tabs.move(tabid, {index: Math.round(index)}, function(){
    console.log("in tabs callback func");
  });
    e.target.style.backgroundColor = "";
};
