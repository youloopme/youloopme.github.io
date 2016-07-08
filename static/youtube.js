var player = null;
function createPlayerWithVideoId(id) {
    player = new YT.Player('player', {
        videoId: id,
        events: {
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

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        event.target.playVideo();
    }
}

function loadVideo(id) {
    if (player == null) {
        createPlayerWithVideoId(id);
    } else {
        player.loadVideoById(id);
    }
    getUrlInputElement().value = getYoutubeUrl(id);
}

function resizePlayer() {
    if (player != null) {
        var section = document.getElementsByTagName("section")[0];
        player.setSize(section.clientWidth, section.clientWidth * 9 / 16);
    }
}