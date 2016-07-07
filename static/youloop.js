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

function loopme() {
    var url = document.querySelector("input[name=url]").value;
    var id = getYoutubeId(url);
    loadVideo(id);
    return false;
}