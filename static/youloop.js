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

var defaultVideoId = 'DHluLVJuAJ0';
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
