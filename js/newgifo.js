/*document.addEventListener("DOMContentLoaded", async() => {
    const $button_start = document.querySelector(".button_start");
    const $pop_up1 = document.querySelector(".container_pop_up1");
    const $pop_up2 = document.querySelector(".container_pop_up2");
    const $pop_up3 = document.querySelector(".container_pop_up3");
    const $input_my_guifos = document.querySelector(".input_my_guifos");
    const $button_capture = document.querySelector("#button_capture");
    const $button_camera = document.querySelector(".button_camera");
    const $video_container = document.querySelector("#video_container");
    const $button_ready = document.querySelector("#button_ready");
    const $button_clock = document.querySelector(".button_clock");
    const $input_ready = document.querySelector(".input_ready");
    const $button_container_ready = document.querySelector(
        ".button_container_ready"
    );
    const $button_container2 = document.querySelector(".button_container2");
    const $button_container_repeat = document.querySelector(
        ".button_container_repeat"
    );
    const $button_repeat = document.querySelector(".button_repeat");
    const $button_upload = document.querySelector(".button_upload");
    const $container_img_info = document.querySelector(".container_img_info");
    const $button_ready2 = document.querySelector(".button_ready2");
    const img = document.createElement("img");
    let recorder = null;
    let blob = null;

    $button_start.addEventListener("click", () => {
        $pop_up2.style.display = "block";
        $pop_up1.style.display = "none";
        $input_my_guifos.style.display = "none";
    });

    $button_capture.addEventListener("click", async() => {
        $button_container2.style.display = "none";
        $button_capture.style.visibility = "none";
        $button_camera.style.display = "none";
        $button_container_ready.style.display = "block";
        $button_ready.style.display = "block";
        $button_clock.style.display = "block";
        $input_ready.style.display = "block";

        recorder = await startRecord(recorder, $video_container);
    });

    $button_ready.addEventListener("click", async() => {
        await stopRecord(recorder, $video_container);
        img.style.display = "block";
    });

    $button_repeat.addEventListener("click", async() => {
        $button_container_repeat.style.display = "none";
        $button_repeat.style.display = "none";
        $button_upload.style.display = "none";
        img.src = URL.revokeObjectURL(blob);
        $video_container.style.display = "block";
        img.style.display = "none";
        recorder = await startRecord(recorder, $video_container);
        $button_container_ready.style.display = "block";
        $button_ready.style.display = "block";
        $button_clock.style.display = "block";
        $input_ready.style.display = "block";
    });

    $button_upload.addEventListener("click", async() => {
        $pop_up3.style.display = "block";
        $button_repeat.style.display = "none";
        $button_upload.style.display = "none";
        $pop_up2.style.display = "none";
        let blob = await recorder.getBlob();
        let response = await sendGif(blob);
        $pop_up3.style.display = "none";
        $pop_up1.style.display = "block";
        $input_my_guifos.style.display = "block";
        document.querySelector(".title_message").innerHTML =
            "Guifo subido con éxito";
        document.querySelector(".img_info").style.display = "none";
        document.querySelector(".text_info").style.display = "none";
        document.querySelector(".button_cancel").style.display = "none";
        document.querySelector(".button_start").style.display = "none";
        document.querySelector(".success").style.display = "block";
        document.querySelector(".button_copy").style.display = "block";
        document.querySelector(".button_download").style.display = "block";
        document.querySelector(".button_ready2").style.display = "block";
        //const gif = await getData(`${api_url}/${response.id}?my_api=${my_key}`);
        // renderMyGif(gif);
    });

    $button_ready2.addEventListener("click", () => {
        $pop_up1.style.display = "none";
    });
    const getData = async endpoint => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };
    const getMedia = async() => {
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    height: { max: 480 }
                },
                audio: false
            });
            return stream;
        } catch (err) {
            return "Unable to capture your camera. Without permissions";
        }
    };

    const startRecord = async(recorder, container) => {
        let stream = await getMedia();
        container.srcObject = stream;
        container.play();
        recorder = new RecordRTCPromisesHandler(stream, {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                document.querySelector(".title_message").innerHTML =
                    "Capturando tu guifo";
            }
        });
        recorder.startRecording();
        return recorder;
    };

    const stopRecord = async(recorder, container) => {
        $button_container_ready.style.display = "none";
        $button_ready.style.display = "none";
        $button_clock.style.display = "none";
        $input_ready.style.display = "none";
        document.querySelector(".title_message").innerHTML = "Vista previa";
        $button_container_repeat.style.display = "block";
        $button_repeat.style.display = "block";
        $button_upload.style.display = "block";

        container.pause();
        container.srcObject = null;

        await recorder.stopRecording();
        let blob = await recorder.getBlob();
        preview(blob);
        return blob;
    };

    const upload = async(endpoint, body) => {
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                mode: "cors",
                body: body
            });
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const sendGif = async blob => {
        const form = new FormData();
        form.append("file", blob, "myGifs.gif");
        console.log(form.get("file"));
        const response = await upload(endpoints.upload, form);
        const actualGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
        const newGifs = [...actualGifs, response.id];
        const gif = await getData(`${api_url}?my_api=${my_key}&ids=${newGifs}`);
        renderMyGif(gif);
        localStorage.setItem("myGifs", JSON.stringify(newGifs));
        return response;
    };

    const renderMyGif = gifs => {
        let $container = document.querySelector(".container_my_guifos");

        if (Array.isArray(gifs)) {
            for (let gif of gifs) {
                let img = document.createElement("img");
                img.setAttribute("width", "832");
                img.setAttribute("height", "434");
                img.src = gif.images.downsized.url;
                img.alt = gif.title;
                $container.appendChild(img);
            }
        } else {
            let img = document.createElement("img");
            img.setAttribute("width", "832");
            img.setAttribute("height", "434");
            img.src = gifs.images.downsized.url;
            img.alt = gifs.title;
            $container.appendChild(img);
        }
    };

    const preview = blob => {
        $video_container.style.display = "none";
        img.src = URL.createObjectURL(blob);
        img.setAttribute("width", "832");
        img.setAttribute("height", "434");
        $container_img_info.appendChild(img);
    };
});

$button_ready2.addEventListener("click", () => {
    $pop_up2.style.display = "block";
});*/

document.addEventListener("DOMContentLoaded", async() => {
    // Constants

    const $button_start = document.querySelector(".button_start");
    const $pop_up1 = document.querySelector(".container_pop_up1");
    const $pop_up2 = document.querySelector(".container_pop_up2");
    const $pop_up3 = document.querySelector(".container_pop_up3");
    const $pop_up4 = document.querySelector(".container_pop_up4");
    const $pop_up5 = document.querySelector(".container_pop_up5");
    const $pop_up6 = document.querySelector(".container_pop_up6");
    const $my_guifos = document.querySelector(".my_guifos");
    const $button_capture = document.querySelector("#button_capture");
    const $video_container = document.querySelector("#video_container");
    const $video_container2 = document.querySelector("#video_container2");
    const $video_container3 = document.querySelector("#video_container3");
    const $button_ready = document.querySelector("#button_ready");
    const $button_repeat = document.querySelector(".button_repeat");
    const $button_upload = document.querySelector(".button_upload");
    const $container_img_info = document.querySelector(".container_img_info3");
    const $button_ready2 = document.querySelector(".button_ready2");
    const img = document.createElement("img");
    const $a = document.querySelector(".a_download");
    const minutesLabel = document.getElementById("minutes");
    const secondsLabel = document.getElementById("seconds");
    let recorder = null;
    let blob = null;

    // Functions for click

    $button_start.addEventListener("click", async() => {
        $pop_up2.style.display = "block";
        $pop_up1.style.display = "none";
        $my_guifos.style.display = "none";
        let stream = await getMedia();
        $video_container.srcObject = stream;
        $video_container.play();
    });

    $button_capture.addEventListener("click", async() => {
        $pop_up2.style.display = "none";
        $pop_up3.style.display = "block";
        $video_container.style.display = "block";
        recorder = await startRecord(recorder, $video_container2);
        Clock.start();
    });

    $button_ready.addEventListener("click", async() => {
        $pop_up3.style.display = "none";
        $pop_up4.style.display = "block";
        await stopRecord(recorder, $video_container2);
        let blob = await recorder.getBlob();
        preview(blob);
        img.style.display = "block";
        Clock.reset();
    });

    $button_repeat.addEventListener("click", async() => {
        $pop_up4.style.display = "none";
        img.src = URL.revokeObjectURL(blob);
        $video_container3.style.display = "block";
        img.style.display = "none";
        recorder = await startRecord(recorder, $video_container2);
        $pop_up3.style.display = "block";
        Clock.restart();
    });

    $button_upload.addEventListener("click", async() => {
        $pop_up5.style.display = "block";
        $pop_up4.style.display = "none";
        let blob = await recorder.getBlob();
        let response = await sendGif(blob);
        const gif = await getData(`${api_url}/${response.id}?my_api=${my_api}`);
        renderLastGif(gif);
        renderOtherGif(gif);
        $pop_up5.style.display = "none";
        $pop_up6.style.display = "block";
        $my_guifos.style.display = "block";
    });

    $button_ready2.addEventListener("click", async() => {
        $pop_up6.style.display = "none";
    });

    $a.addEventListener("click", async() => {
        let blob = await recorder.getBlob();
        const blobUrl = URL.createObjectURL(blob);
        $a.setAttribute("href", blobUrl);
    });

    document.querySelector(".button_copy").addEventListener("click", async() => {
        let input = document.createElement("input");
        let blob = await recorder.getBlob();
        const blobUrl = URL.createObjectURL(blob);
        input.setAttribute("value", blobUrl);
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    });

    // Permissions for use the camera and obtain the stream

    const getMedia = async() => {
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    height: { max: 480 }
                },
                audio: false
            });
            return stream;
        } catch (err) {
            return "Unable to capture your camera. Without permissions";
        }
    };

    // Functions for the recorder

    const startRecord = async(recorder, container) => {
        let stream = await getMedia();
        container.srcObject = stream;
        container.play();
        recorder = new RecordRTCPromisesHandler(stream, {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log(recorder);
            }
        });
        recorder.startRecording();
        return recorder;
    };

    const stopRecord = async(recorder, container) => {
        container.pause();
        await recorder.stopRecording();
        const stream = container.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        container.srcObject = null;
        return blob;
    };

    const upload = async(endpoint, body) => {
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                mode: "cors",
                body: body
            });
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const sendGif = async blob => {
        const form = new FormData();
        form.append("file", blob, "myGifs.gif");
        console.log(form.get("file"));
        const response = await upload(endpoints.upload, form);
        const actualGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
        const newGifs = [...actualGifs, response.id];
        console.log(newGifs);
        localStorage.setItem("myGifs", JSON.stringify(newGifs));
        if (Array.isArray(newGifs)) {
            await getData(`${api_url}?my_api=${my_api}&ids=${newGifs}`);
        } else {
            await getData(`${api_url}/${response.id}?my_api=${my_api}`);
        }
        return response;
    };

    const preview = blob => {
        $video_container3.style.display = "none";
        img.src = URL.createObjectURL(blob);
        img.setAttribute("width", "832");
        img.setAttribute("height", "434");
        $container_img_info.appendChild(img);
    };

    const renderMyGifs = gifs => {
        let $container = document.querySelector(".container_my_guifos");

        if (Array.isArray(gifs)) {
            for (let gif of gifs) {
                let img = document.createElement("img");
                img.setAttribute("width", "280");
                img.setAttribute("height", "296");
                img.setAttribute("style", "margin: 15px 15px 15px 50px");
                img.src = gif.images.downsized.url;
                img.alt = gif.title;
                $container.appendChild(img);
            }
        } else {
            let img = document.createElement("img");
            img.setAttribute("width", "280");
            img.setAttribute("height", "296");
            img.setAttribute("style", "margin: 15px 15px 15px 50px");
            img.src = gifs.images.downsized.url;
            img.alt = gifs.title;
            $container.appendChild(img);
        }
    };

    const renderLastGif = gif => {
        let $container = document.querySelector(".container_last_gif");
        let img = document.createElement("img");
        img.setAttribute("width", "365");
        img.setAttribute("height", "191");
        img.setAttribute("style", "opacity: 0.3");
        img.src = gif.images.downsized.url;
        img.alt = gif.title;
        $container.appendChild(img);
    };

    const renderOtherGif = gif => {
        let img = document.createElement("img");
        img.setAttribute("width", "280");
        img.setAttribute("height", "298");
        img.setAttribute("style", "margin: 15px 15px 15px 50px");
        img.src = gif.images.downsized.url;
        img.alt = gif.title;
        $my_guifos.appendChild(img);
    };

    // Showing the gallery from the beginnning

    const myGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
    localStorage.setItem("myGifs", JSON.stringify(myGifs));
    const gifs = await getData(`${api_url}?my_api=${my_api}&ids=${myGifs}`);
    renderMyGifs(gifs);

    // Functions for timer

    const Clock = {
        totalSeconds: 0,
        start: function() {
            if (!this.interval) {
                let self = this;

                function pad(val) {
                    return val > 9 ? val : "0" + val;
                }
                this.interval = setInterval(function() {
                    self.totalSeconds += 1;

                    minutesLabel.innerHTML = pad(
                        Math.floor((self.totalSeconds / 60) % 60)
                    );
                    secondsLabel.innerHTML = pad(parseInt(self.totalSeconds % 60));
                }, 1000);
            }
        },

        reset: function() {
            Clock.totalSeconds = null;
            clearInterval(this.interval);
            minutesLabel.innerHTML = "00";
            secondsLabel.innerHTML = "00";
            delete this.interval;
        },

        restart: function() {
            this.reset();
            Clock.start();
        }
    };
});