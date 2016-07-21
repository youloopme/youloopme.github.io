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

function getUrlInputElement() {
    return document.querySelector("input[name=url]");
}

function loopme() {
    var url = getUrlInputElement().value;
    var videoId = getYoutubeVideoId(url);
    loadVideo(videoId);
    return false;
}

var defaultVideoId = 'DHluLVJuAJ0';
window.onload = function () {
    var videoId = defaultVideoId;
    var hash = window.location.hash
    if (hash) {
        videoId = hash.split('#')[1]
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