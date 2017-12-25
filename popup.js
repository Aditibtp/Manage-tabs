var source;
var tabTitles = [];
var tabId = [];
var tabid;
var index;
var tabTree = document.getElementById("tabtree");

function dumpAllOpenTabs() {
    var imgUrl = chrome.extension.getURL('images/delete.png');
    var allOpenTabsInWindow = chrome.tabs.getAllInWindow(
        function(tabsArray) {
            for (var i = 0; i < tabsArray.length; i++) {
                tabTitles[i] = tabsArray[i].title;
                tabId[i] = tabsArray[i].id;
                var tabTree = document.getElementById("tabtree");
                var liEle = document.createElement("li");
                liEle.className += ("tab-list");
                liEle.id = "num_" + tabsArray[i].id;
                liEle.setAttribute("data-tabid", tabsArray[i].id);
                liEle.setAttribute("data-pos", i);
                liEle.setAttribute("draggable", true);
                var tabImg = document.createElement("img");
                tabImg.src = tabsArray[i].favIconUrl;
                tabImg.className += "favicon-img";

                var spanTitleEle = document.createElement("p");
                
                spanTitleEle.className += ("tab-title");
                spanTitleEle.innerHTML = tabsArray[i].title + "<span class = 'close-tab'>&#x274C;</span>";
                liEle.appendChild(tabImg);
                liEle.appendChild(spanTitleEle); 
                tabTree.appendChild(liEle);
                if(tabsArray[i].active){
                    var activeTab = document.querySelector("li#num_"+tabsArray[i].id);
                    activeTab.className += " open-tab";
                }
            }

            var lists = document.getElementsByClassName('tab-list');

            for (var i = 0; i < lists.length; i++) {
                lists[i].addEventListener('click', handleListClick, false);
                lists[i].addEventListener('mouseover', handleMouseEnter, false);
                lists[i].addEventListener('mouseleave', handleMouseLeave, false);
                var closeImage = lists[i].querySelector("span.close-tab");
                closeImage.addEventListener("click", handleCloseClick, false);
            }

            document.getElementsByTagName("input")[0].addEventListener("keyup", function() {
                var key = event.keyCode || event.charCode;
                if( key == 8 || key == 46 ){
                    for (var i = 0; i < lists.length; i++) {
                        lists[i].style.display = "block";
                    }
                }
                console.log(key)
                var inputNode = document.getElementsByTagName("input")[0];
                var inputQuery = inputNode.value;
                for (var i = 0; i < tabTitles.length; i++) {
                    if (tabTitles[i].toUpperCase().includes(inputQuery.toUpperCase()) === false) {
                        var liNode = tabTree.querySelector("li[id=num_" + tabId[i] + "]");
                        liNode.style.display = "none";
                    }
                }
            }, false);

        });
};

function handleCloseClick(event){
    event.preventDefault();
    var closeLiSpan = event.target;
    var tabId = parseInt(closeLiSpan.parentNode.parentNode.dataset.tabid);
    chrome.tabs.remove(tabId);
}

function handleListClick(event){   
    
    var clickedLi = event.currentTarget;
    var tabId = parseInt(clickedLi.dataset.tabid);
    chrome.tabs.update(tabId, {
        active: true,
        selected: true
    });
    clickedLi.className += (" open-tab");
};

function handleMouseEnter(event){
    var clickedLi = event.currentTarget;
    var closeImg = clickedLi.querySelector('span.close-tab');
    closeImg.style.display = "block";
};

function handleMouseLeave(event){
    var clickedLi = event.currentTarget;
    var closeImg = clickedLi.querySelector('span.close-tab');
    closeImg.style.display = "none";
}

function initiateExtn(){
    document.addEventListener('DOMContentLoaded', function() {
        dumpAllOpenTabs();
    });
};

initiateExtn();

