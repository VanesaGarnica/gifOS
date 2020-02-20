document.addEventListener("DOMContentLoaded", async() => {
    document.querySelector(".night").addEventListener("click", () => {
        const body = document.querySelector("body");
        body.classList.add("dark");
        body.classList.remove("light");
    });

    document.querySelector(".day").addEventListener("click", () => {
        const body = document.querySelector("body");
        body.classList.add("light");
        body.classList.remove("dark");
    });

    document.querySelector(".btn_create").addEventListener("click", () => {
        window.location.href = "newgifo.html";
    });
    document.querySelector(".btnflat").addEventListener("click", () => {
        window.location.href = "newgifo.html";
    });

    const search_input = document.querySelector("#search_input");
    const search_button = document.querySelector("#search_button");
    const hardcode_suggest = document.querySelector(".hardcode_suggest");
    const btn_birds = document.querySelector("#btn_birds");
    const btn_epic = document.querySelector("#btn_epic");
    const btn_videogames = document.querySelector("#btn_videogames");

    search_input.addEventListener("keyup", () => {
        console.log("key_up");
        hardcode_suggest.style.display = "flex";
    });

    const gifs = await getData(`${endpoints.search}`);
    renderGifs(gifs);

    const anotherGifs = await getData(`${endpoints.trending}`);
    const trendingGifs = anotherGifs.splice(0, 15);
    renderGifs(trendingGifs);

    search_button.addEventListener("click", async e => {
        console.log("click");
        hardcode_suggest.style.display = "none";
        let value = search_input.value.trim();

        if (!value) return;

        const gifs = await getData(`${endpoints.search}&q=${value}`);
        renderGifs(gifs);

        scroll = document.getElementById("search_container");
        scroll.scrollIntoView({ behavior: "smooth" });
    });

    document.querySelector("#sm1").addEventListener("click", () => {
        gifRandom("Harry Potter", "img1");
    });
    document.querySelector("#sm2").addEventListener("click", () => {
        gifRandom("Gilmore Girls", "img2");
    });
    document.querySelector("#sm3").addEventListener("click", () => {
        gifRandom("Game of thrones", "img3");
    });
    document.querySelector("#sm4").addEventListener("click", () => {
        gifRandom("Disney", "img4");
    });

    const gifRandom = (tag, imgId) => {
        getId(`${endpoints.random}` + tag, imgId);
    };

    gifRandom("Harry Potter", "img1");
    gifRandom("Gilmore Girls", "img2");
    gifRandom("Game of thrones", "img3");
    gifRandom("Disney", "img4");

    btn_birds.addEventListener("click", async e => {
        const gifs = await getData(`${endpoints.search}&q=${"birds"}`);
        renderGifs(gifs);

        scroll = document.getElementById("container_hardcode_suggest");
        scroll.scrollIntoView({ behavior: "smooth" });
    });

    btn_epic.addEventListener("click", async e => {
        const gifs = await getData(`${endpoints.search}&q=${"epic"}`);
        renderGifs(gifs);

        scroll = document.getElementById("container_hardcode_suggest");
        scroll.scrollIntoView({ behavior: "smooth" });
    });

    btn_videogames.addEventListener("click", async e => {
        const gifs = await getData(`${endpoints.search}&q=${"videogames"}`);
        renderGifs(gifs);

        scroll = document.getElementById("container_hardcode_suggest");
        scroll.scrollIntoView({ behavior: "smooth" });
    });
});