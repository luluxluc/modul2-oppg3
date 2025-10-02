document.addEventListener("DOMContentLoaded", function() {


const getPortfolio = () => JSON.parse(localStorage.getItem("portfolio")) || [];

const saveArtPiece = artPiece => {
    const portfolio = getPortfolio();
    portfolio.push(artPiece);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
};

const deleteArtPiece = id => {
    const updated = getPortfolio().filter(({ id: artId }) => artId !== id);
    localStorage.setItem("portfolio", JSON.stringify(updated));
    displayPortfolio();
};

const toggleFavorite = id => {
    const updated = getPortfolio().map(({ id: artId, favorite, ...rest }) => {
        if (artId === id) favorite = !favorite;
        return { id: artId, favorite, ...rest };
        });
    localStorage.setItem("portfolio", JSON.stringify(updated));
    displayPortfolio();
};

const displayPortfolio = () => {
    const grid = document.getElementById("portfolioGrid");
    grid.innerHTML = "";

    let portfolio = getPortfolio();

    const filterValue = document.getElementById("filterSelect").value;
    const sortValue = document.getElementById("sortSelect").value;

    portfolio = portfolio.filter(({ favorite, type }) => {
        if (filterValue === "favorites") return favorite;
        if (filterValue === "painting") return type.toLowerCase().includes("paint");
        if (filterValue === "digital") return type.toLowerCase().includes("digital");
        if (filterValue === "illustration") return type.toLowerCase().includes("illustration");
        return true;
    });

    portfolio.sort(({ title: aTitle, id: aId }, { title: bTitle, id: bId }) => {
        if (sortValue === "title") return aTitle.localeCompare(bTitle);
        if (sortValue === "date") return bId - aId;
    });

    portfolio.forEach(({ id, title, type, image, favorite }) => {
        const card = document.createElement("div");
        card.className = "card";

        if (image) {
            const img = document.createElement("img");
            img.src = image;
            card.appendChild(img);
        }

        const h3 = document.createElement("h3");
        h3.textContent = title;
        card.appendChild(h3);

        const p = document.createElement("p");
        p.textContent = type;
        card.appendChild(p);

        const favBtn = document.createElement("button");
        favBtn.textContent = favorite ? "★ Favorite" : "☆ Favorite";
        favBtn.className = "favoriteBtn";
        favBtn.addEventListener("click", () => toggleFavorite(id));
        card.appendChild(favBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteArtPiece(id));
        card.appendChild(deleteBtn);

        grid.appendChild(card);
    });
};


document.getElementById("artForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const file = document.getElementById("image").files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = ({ target: { result } }) => {
            const artPiece = { id: Date.now(), title, type, image: result, favorite: false };
            saveArtPiece(artPiece);
            displayPortfolio();
        };
        reader.readAsDataURL(file);
    } else {
        const artPiece = { id: Date.now(), title, type, image: null, favorite: false };
        saveArtPiece(artPiece);
        displayPortfolio();
    }

    this.reset();
});

    document.getElementById("filterSelect").addEventListener("change", displayPortfolio);
    document.getElementById("sortSelect").addEventListener("change", displayPortfolio);

    displayPortfolio();
});
