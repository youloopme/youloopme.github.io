var defaultVideoId = 'DHluLVJuAJ0';
var API_KEY = 'AIzaSyA8KODtHIz7Ho81CXxNygl6jphDZDxmpfQ';
var autolinker = new Autolinker({email: false, phone: false, twitter: false});
var player = null;
var viewCounter = 1;

function getYoutubeVideoId(url) {
    var videoId = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        videoId = url[2].split(/[^0-9a-z_\-]/i);
        videoId = videoId[0];
    } else {
        videoId = url;
    }
    return videoId;
}

function getYoutubeUrl(videoId) {
    return "http://www.youtube.com/watch?v=" + videoId;
}

function getYoutubeThumbnail() {
    var videoId = player.getVideoData().video_id;

    if (videoId.length == 11) {
        return "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg";
    }

    return "https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png";
}

function getUrlInputElement() {
    return document.querySelector("input[name=url]");
}

function loopme() {
    var url = getUrlInputElement().value;
    var videoId = getYoutubeVideoId(url);
    loadVideo(videoId);
    window.history.pushState(videoId, videoId, "#" + videoId);
    return false;
}

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
    viewCounter = 1;
    updateViewCounter(viewCounter);
}

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            if (cleanTime() == 0) {
                ga('send', 'event', 'video', 'started', document.getElementById("video_title").textContent + " - " + player.getVideoData()['video_id']);
            }
            break;
        case YT.PlayerState.ENDED: {
            updateViewCounter(++viewCounter);
            event.target.playVideo();
            break;
        }
    };
}

function loadVideo(videoId) {
    if (player) {
        player.destroy();
    }
    createPlayerWithVideoId(videoId);
}

function updateViewCounter(viewCounter) {
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

        var tagTitle = document.getElementsByTagName("title")[0];

        var video_title = document.getElementById("video_title");
        var channel_title = document.getElementById("channel_title");
        var description = document.getElementById("description");
        var view_count = document.getElementById("view_count");
        var title = response.items[0].snippet.title;

        tagTitle.textContent = title + " - YooLoop.Me";

        video_title.textContent = title;
        channel_title.textContent = response.items[0].snippet.channelTitle;
        description.innerHTML = autolinker.link(response.items[0].snippet.description.split("\n").join("<br>"));;
        view_count.textContent = response.items[0].statistics.viewCount;
    };

    xmlHttp.open("GET", "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=" + videoId + "&key=" + API_KEY, true);
    xmlHttp.send(null);
}

window.onload = function () {
    var videoId = defaultVideoId;
    var hash = window.location.hash
    if (hash) {
        videoId = hash.split('#')[1]
    } else {
        window.history.replaceState(videoId, videoId, "#" + videoId);
    }
    loadVideo(videoId);
};

window.onresize = function () {
    resizePlayer();
};

window.addEventListener('popstate', function (event) {
    var videoId = event.state;
    if (!videoId) {
        videoId = defaultVideoId;
    }
    loadVideo(videoId);
});

document.getElementById('facebook_sharer').onclick = function() {
    var url = window.location.href;
    var title = document.getElementById("video_title").textContent;
    FB.ui({
        appId: '1106836436053260',
        method: 'feed',
        link: url,
        name: title,
        picture: getYoutubeThumbnail(),
    }, function(response){});
    return false;
}

document.getElementById('twitter_sharer').onclick = function() {
    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.getElementById("video_title").textContent);
    document.getElementById("twitter_sharer").href = "https://twitter.com/intent/tweet?url=" + url + "&text=" + title;
}
