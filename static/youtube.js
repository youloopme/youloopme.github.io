var player = null;
function createPlayerWithVideoId(videoId) {
    player = new YT.Player('player', {
        videoId: videoId,
        events: {
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            enablejsapi: 1,
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
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            if (cleanTime() == 0) {
                ga('send', 'event', 'video', 'started', player.getVideoData()['video_id']);
                console.log(player.getVideoData()['video_id']);
            }
            break;
        case YT.PlayerState.ENDED:
            event.target.playVideo();
            break;
    };
}

function loadVideo(videoId) {
    if (player == null) {
        createPlayerWithVideoId(videoId);
    } else {
        player.loadVideoById(videoId);
    }
    getUrlInputElement().value = getYoutubeUrl(videoId);
}

function resizePlayer() {
    if (player != null) {
        var section = document.getElementsByTagName("section")[0];
        player.setSize(section.clientWidth, section.clientWidth * 9 / 16);
    }
}

function cleanTime() {
    return Math.round(player.getCurrentTime())
}