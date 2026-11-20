function getProducts(page) {

    fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=16`)
    .then(response => response.json())
    .then(data => {

        document.getElementById("products").innerHTML = "";

        data.products.forEach(product => {

            document.getElementById("products").innerHTML += `
                <div class="card">
                    <img src="${product.thumbnail}">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <h4>${product.price.current} ${product.price.currency}</h4>
                </div>
            `;

        });

    });

}

function searchProducts() {

    fetch(`https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=38&keywords=${document.getElementById("searchInput").value}`)
    .then(response => response.json())
    .then(data => {

        document.getElementById("products").innerHTML = "";

        data.products.forEach(product => {

            document.getElementById("products").innerHTML += `
                <div class="card">
                    <img src="${product.thumbnail}">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <h4>${product.price.current} ${product.price.currency}</h4>
                </div>
            `;

        });

    });

}

getProducts(1);
