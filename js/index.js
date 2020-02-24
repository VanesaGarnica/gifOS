document.addEventListener("DOMContentLoaded", async() => {
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

    // el boton se activa cuando hay imput y se despliega las sugerencias
    search_input.addEventListener("keyup", function(event) {
        let value = search_input.value.trim();

        if (!value) {
            search_button.style.color = "#b4b4b4";
        } else {
            search_button.style.color = "#000000";
        }

        if (event.keyCode === 13) {
            //al apretar enter, simula clic en el boton
            event.preventDefault();
            search_button.click();
        } else if (event.keyCode === 8) {
            //al apretar backspc, no busca, solo oculta la sugerencia
            hardcode_suggest.style.display = "none";
        } else {
            hardcode_suggest.style.display = "flex";
        }
    });

    const gifs = await getData(`${endpoints.search}`);
    renderGifs(gifs);

    const anotherGifs = await getData(`${endpoints.trending}`);
    const trendingGifs = anotherGifs.splice(0, 15);
    renderGifs(trendingGifs);

    //busqueda del imput
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

    //mostrar gif random de 4 tematicas al cargar la pagina
    const gifRandom = (tag, imgId) => {
        getId(`${endpoints.random}` + tag, imgId);
    };

    gifRandom("Harry Potter", "img1");
    gifRandom("Gilmore Girls", "img2");
    gifRandom("Game of thrones", "img3");
    gifRandom("Disney", "img4");

    //el ver mas trae de la api un resultado random de la misma tematica
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

    //las palabras hardcodeadas sugeridas en el desplegable buscan resultados correspondientes en la api
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

    // ACTIVAR THEMES desde variable almacenada en session storage

    /*const body = document.querySelector("#body");
                                                const logo = document.getElementById("#header--navbar--logo");
                                                const bodyclass = sessionStorage.getItem("body");

                                                let activateThemes = bodyclass => {
                                                    if (bodyclass == "light") {
                                                        body.classList.remove("dark");
                                                        body.classList.add("light");
                                                        logo.src = "images/gifOF_logo.png";
                                                    } else if (bodyclass == "dark") {
                                                        body.classList.remove("light");
                                                        body.classList.add("dark");
                                                        logo.src = "images/gifOF_logo_dark.png";
                                                    } else {
                                                        body.classList.add("light");
                                                    }
                                                };

                                                activateThemes(bodyclass);*/
    const body = document.querySelector("body");
    const bodyclass = localStorage.getItem("color-theme");

    let activateThemes = bodyclass => {
        if (bodyclass == "dark-mode") {
            body.classList.add("dark");
            body.classList.remove("light");
        } else if (bodyclass == "light-mode") {
            body.classList.add("light");
            body.classList.remove("dark");
        } else {
            body.classList.add("light");
        }
    };

    activateThemes(bodyclass);

    document.querySelector(".night").addEventListener("click", () => {
        const body = document.querySelector("body");
        body.classList.add("dark");
        body.classList.remove("light");
        localStorage.setItem("color-theme", "dark-mode");
    });

    document.querySelector(".day").addEventListener("click", () => {
        const body = document.querySelector("body");
        body.classList.add("light");
        body.classList.remove("dark");
        localStorage.setItem("color-theme", "light-mode");
    });
});