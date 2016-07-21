var API_KEY = 'AIzaSyA8KODtHIz7Ho81CXxNygl6jphDZDxmpfQ';
var autolinker = new Autolinker({email: false, phone: false, twitter: false});
var player = null;
var viewCounter = 0;

function createPlayerWithVideoId(videoId) {
    player = new YT.Player('player', {
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            autohide: 1,
            autoplay: 1,
            disablekb: 1,
            iv_load_policy: 3,
            showinfo: 0,
            rel: 0
        }
    });
    resizePlayer();
}

function onPlayerReady(event) {
    retrieveVideoInformations(player.getVideoData().video_id)
    updateViewCounter();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        event.target.playVideo();
        updateViewCounter();
    }
}

function loadVideo(videoId) {
    if (player) {
        player.destroy();
    }
    createPlayerWithVideoId(videoId);
    window.history.pushState(videoId, videoId, "#" + videoId);
}

function updateViewCounter() {
    viewCounter++;
    document.getElementById("viewCounter").textContent = viewCounter;
}

function resizePlayer() {
    if (player != null) {
        var section = document.getElementsByTagName("section")[0];
        player.setSize(section.clientWidth, section.clientWidth * 9 / 16);
    }
}

function retrieveVideoInformations(videoId) {
    var url = getYoutubeUrl(videoId);
    getUrlInputElement().value = url;

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState != 4 || xmlHttp.status != 200) return;

        var response = JSON.parse(xmlHttp.responseText);

        var tabTitle = document.getElementsByTagName("title")[0];
        var video_title = document.getElementById("video_title");
        var channel_title = document.getElementById("channel_title");
        var description = document.getElementById("description");
        var view_count = document.getElementById("view_count");

        var title = response.items[0].snippet.title;

        tabTitle.textContent = title + " - YooLoop.Me";
        video_title.textContent = title;
        channel_title.textContent = response.items[0].snippet.channelTitle;
        description.innerHTML = autolinker.link(response.items[0].snippet.description.split("\n").join("<br>"));;
        view_count.textContent = response.items[0].statistics.viewCount;

        changeSharerHref(window.location.href, title);
    };

    xmlHttp.open("GET", "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=" + videoId + "&key=" + API_KEY, true);
    xmlHttp.send(null);
}

function changeSharerHref(url, title) {
    document.getElementById("facebook_sharer").href = "http://www.facebook.com/sharer/sharer.php?u=" + url;
    document.getElementById("twitter_sharer").href = "https://twitter.com/intent/tweet?url=" + url + "&text=" + title;
}
