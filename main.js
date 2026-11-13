var api = "https://restaurant.stepprojects.ge/api";
var products = [];
var basket = [];
var categoryId = "all";

var categoriesBox = document.querySelector("#categories");
var productsBox = document.querySelector("#product-grid");
var message = document.querySelector("#status-message");
var basketCount = document.querySelector("#basket-count");

function showProducts() {
    var list = products;

    if (categoryId !== "all") {
        list = products.filter(function (product) {
            return product.categoryId === Number(categoryId);
        });
    }

    productsBox.innerHTML = "";

    list.forEach(function (product) {
        var item = basket.find(function (row) {
            return row.productId === product.id ||
                (row.product && row.product.id === product.id);
        });

        productsBox.innerHTML += `
            <article class="product-card">
                <div class="product-image-wrap">
                    <img class="product-image" src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <p class="product-tag">${product.vegeterian ? "ვეგეტარიანული" : "შეფის არჩევანი"}</p>
                    <h2 class="product-name">${product.name}</h2>
                    <div class="product-footer">
                        <span class="product-price">${product.price} <small>₾</small></span>
                        <button class="add-button" data-id="${product.id}">
                            ${item ? "კალათაში · " + item.quantity : "დამატება"}
                        </button>
                    </div>
                </div>
            </article>`;
    });
}

function loadMenu() {
    fetch(api + "/Products/GetAll")
        .then(function (response) { return response.json(); })
        .then(function (data) {
            products = data;
            showProducts();
            return fetch(api + "/Baskets/GetAll");
        })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            basket = data;
            basketCount.textContent = basket.reduce(function (sum, item) {
                return sum + item.quantity;
            }, 0);
            showProducts();
            return fetch(api + "/Categories/GetAll");
        })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            data.forEach(function (category) {
                categoriesBox.innerHTML +=
                    `<button class="category-button" data-category="${category.id}">${category.name}</button>`;
            });
            message.textContent = "ყველა პროდუქტი";
        })
        .catch(function () {
            message.textContent = "მონაცემების ჩატვირთვა ვერ მოხერხდა.";
        });
}

categoriesBox.addEventListener("click", function (event) {
    var button = event.target.closest("[data-category]");
    if (!button) return;

    var activeButton = categoriesBox.querySelector(".is-active");
    if (activeButton) activeButton.classList.remove("is-active");
    button.classList.add("is-active");

    categoryId = button.dataset.category;
    showProducts();
    message.textContent = categoryId === "all" ? "ყველა პროდუქტი" : button.textContent;
});

productsBox.addEventListener("click", function (event) {
    var button = event.target.closest(".add-button");
    if (!button) return;

    var id = Number(button.dataset.id);
    var product = products.find(function (item) { return item.id === id; });
    var basketItem = basket.find(function (item) {
        return item.productId === id || (item.product && item.product.id === id);
    });
    var data = {
        productId: id,
        price: product.price,
        quantity: basketItem ? basketItem.quantity + 1 : 1
    };

    fetch(api + (basketItem ? "/Baskets/UpdateBasket" : "/Baskets/AddToBasket"), {
        method: basketItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (!response.ok) throw new Error("კალათაში დამატება ვერ მოხერხდა.");
            if (basketItem) {
                basketItem.quantity = data.quantity;
            } else {
                basket.push({ ...data, product: product });
            }
            basketCount.textContent = Number(basketCount.textContent) + 1;
            message.textContent = "პროდუქტი კალათაში დაემატა.";
            showProducts();
        })
        .catch(function (error) {
            message.textContent = error.message;
        });
});

loadMenu();
