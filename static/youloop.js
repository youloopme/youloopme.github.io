function getYoutubeId(url) {
    var id = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_\-]/i);
        id = id[0];
    } else {
        id = url;
    }
    return id;
}

function getYoutubeUrl(id) {
    return "http://www.youtube.com/watch?v=" + id;
}

function getUrlInputElement() {
    return document.querySelector("input[name=url]");
}

function loopme() {
    var url = getUrlInputElement().value;
    var id = getYoutubeId(url);
    loadVideo(id);
    window.history.pushState(id, id, "#" + id);
    return false;
}

window.onload = function () {
    var videoId = 'DHluLVJuAJ0';
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
    if (videoId) {
        loadVideo(videoId);
    }
});
