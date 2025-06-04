document.body.style.overflow='hidden'
async function getPermission() {
    await navigator.mediaDevices.getUserMedia({ video: true})

}
let draw = function () {
    let canvas = document.getElementById("canvasVidElement");
    let video = document.getElementById("vid");
    let txt = document.getElementById("flip");
    let mask
    if (txt.innerHTML == '0') {
        mask = document.getElementById("mask");
    } else {
        mask = document.getElementById("mask-flip");
    }
    
    let range = document.getElementById("myRange");
    let ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    let i = 0
    let j = 0
    
    while(video.videoHeight > mask.naturalHeight /range.value * i) {
        while(video.videoWidth > mask.naturalWidth /range.value * j){
            ctx.drawImage(mask,  mask.naturalWidth /range.value * j, mask.naturalHeight/range.value * i, mask.naturalWidth /range.value , mask.naturalHeight/range.value );
            j++
            if (j > 2){
                break
            }
        }
        j = 0
        i++
        if (i > 4){
            break
        }
    }

    requestAnimationFrame(draw);
};
async function getDevices() {
    await getPermission()
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log(videoDevices)
    return videoDevices
}

async function onSelectChange() {
    let video = document.getElementById("vid");
    video.srcObject.getTracks().forEach(track => track.stop())

    let list = document.getElementById("videoOption");
    let txt = document.getElementById("selected");
    txt.innerHTML = list.value

    onOpenVideo()
}

function onMaskChange(n) {
    let mask = document.getElementById("mask");
    let mask_flip = document.getElementById("mask-flip");

    if (n == 1) {
        mask.src = "alexMask.png"
        mask_flip.src = "alexMask_flip.png"
    } else if (n == 2) {
        mask.src = "45degMask.png"
        mask_flip.src = "45degMask_flip.png"
    } else if (n == 3) {
        mask.src = "61_39degMask.png"
        mask_flip.src = "61_39degMask_flip.png"
    } else {
        mask.src = "sqMask.png"
        mask_flip.src = "sqMask_flip.png"
    }


}

function onRotate() {
    let txt = document.getElementById("flip");

    if (txt.innerHTML == '0') {
        txt.innerHTML = '1'
    } else {
        txt.innerHTML = '0'
    }
}
function onOpenVideo(flash=true) {
    let txt = document.getElementById("selected");
    let video = document.getElementById("vid");

    let mediaDevices = navigator.mediaDevices;
    // Accessing the user camera and video.
    mediaDevices
        .getUserMedia({
            video: {
                deviceId: txt.innerHTML,
                width: { ideal: 4096 },
                height: { ideal: 2160 }
            }
        })
        .then((stream) => {
            // Changing the source of video to current stream.
            video.srcObject = stream;
            vid = stream
            stream.getVideoTracks()[0].applyConstraints({
                advanced: [
                    {
                        torch: flash,
                    },
                ],
            });
            video.addEventListener("loadedmetadata", () => {
                video.play();
                draw()
            });
        })
        .catch(alert);
}
function onFlash() {
    let txt = document.getElementById("flash");
    let video = document.getElementById("vid");

    if (txt.innerHTML == '0') {
        txt.innerHTML = '1'
        video.srcObject.getVideoTracks()[0].applyConstraints({
            advanced: [
                {
                    torch: true,
                },
            ],
        });
    } else {
        txt.innerHTML = '0'
        video.srcObject.getVideoTracks()[0].applyConstraints({
            advanced: [
                {
                    torch: false,
                },
            ],
        });
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    vid.muted = true;

    var videoDevices = await getDevices()

    let list = document.getElementById("videoOption");

    for (i = 0; i < videoDevices.length; ++i) {
        console.log(videoDevices)
        list.appendChild(new Option(videoDevices[i].label, videoDevices[i].deviceId));
    }
    onOpenVideo()

});
