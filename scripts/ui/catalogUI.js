(function () {
    "use strict";

    let selectedMeshId = null;
    let selectedVariantSlug = null;

    function formatPrice(amount) {
        const value = typeof amount === "number" ? amount : 0;
        const whole = Math.floor(value);
        const cents = Math.round((value - whole) * 100);
        const centsText = cents < 10 ? "0" + cents : String(cents);
        return {
            whole: whole,
            cents: centsText
        };
    }

    function createProductCard(product) {
        const price = formatPrice(product.price);
        const article = document.createElement("article");
        article.className = "product-card";
        article.tabIndex = 0;
        article.setAttribute("role", "button");
        article.dataset.meshId = product.meshId;
        article.dataset.productId = product.id;

        article.innerHTML =
            '<div class="product-card__thumb">' +
            '<span class="product-card__badge" aria-hidden="true"></span>' +
            '<button class="product-card__info" type="button" aria-label="View ' +
            product.name +
            ' product detail">!</button>' +
            "</div>" +
            '<p class="product-card__title"></p>' +
            '<p class="product-card__price">$' +
            price.whole +
            '<span class="product-card__price-decimal">.' +
            price.cents +
            "</span></p>";

        article.querySelector(".product-card__title").textContent = product.name;
        return article;
    }

    function createEmptyMessage(text) {
        const p = document.createElement("p");
        p.className = "catalog-empty";
        p.textContent = text;
        return p;
    }

    function renderProductList(partSlot) {
        const products = window.getProductsForPart(partSlot);
        const desktopList = document.getElementById("product-list");
        const mobileList = document.getElementById("product-group");

        if (desktopList) {
            desktopList.innerHTML = "";
        }
        if (mobileList) {
            mobileList.innerHTML = "";
        }

        if (!products.length) {
            const message = createEmptyMessage("No products available for this part yet.");
            if (desktopList) {
                desktopList.appendChild(message.cloneNode(true));
            }
            if (mobileList) {
                mobileList.appendChild(message);
            }
            return;
        }

        products.forEach(function (product) {
            if (desktopList) {
                desktopList.appendChild(createProductCard(product));
            }
            if (mobileList) {
                mobileList.appendChild(createProductCard(product));
            }
        });
    }

    function createSwatchCard(variant, meshId, isSelected) {
        const article = document.createElement("article");
        article.className = "swatch-card" + (isSelected ? " is-selected" : "");
        article.tabIndex = 0;
        article.setAttribute("role", "button");
        article.setAttribute("aria-pressed", isSelected ? "true" : "false");
        article.dataset.variant = variant.slug;
        article.dataset.meshId = meshId;

        article.innerHTML =
            '<div class="swatch-color" style="background-color:' +
            variant.hex +
            '">' +
            '<span class="swatch-check" aria-hidden="true"></span>' +
            "</div>" +
            '<p class="swatch-name"></p>';

        article.querySelector(".swatch-name").textContent = variant.label;
        return article;
    }

    function renderVariantList(meshId) {
        selectedMeshId = meshId;
        const variants = window.getVariantsForMesh(meshId);
        const desktopList = document.getElementById("variant-list");
        const mobileList = document.getElementById("variant-group");

        if (!selectedVariantSlug && variants.length) {
            selectedVariantSlug = variants[0].slug;
        }

        if (desktopList) {
            desktopList.innerHTML = "";
        }
        if (mobileList) {
            mobileList.innerHTML = "";
        }

        if (!variants.length) {
            return;
        }

        variants.forEach(function (variant) {
            const isSelected = variant.slug === selectedVariantSlug;
            if (desktopList) {
                desktopList.appendChild(createSwatchCard(variant, meshId, isSelected));
            }
            if (mobileList) {
                mobileList.appendChild(createSwatchCard(variant, meshId, isSelected));
            }
        });
    }

    function markSelectedProduct(card) {
        document.querySelectorAll(".product-card.is-selected").forEach(function (el) {
            el.classList.remove("is-selected");
        });
        if (card) {
            card.classList.add("is-selected");
        }
    }

    function markSelectedSwatch(card) {
        document.querySelectorAll(".swatch-card.is-selected").forEach(function (el) {
            el.classList.remove("is-selected");
            el.setAttribute("aria-pressed", "false");
        });
        if (card) {
            card.classList.add("is-selected");
            card.setAttribute("aria-pressed", "true");
        }
    }

    function resolveDefaultVariant(mesh) {
        if (!mesh || !mesh.variants || !mesh.variants.length) {
            return null;
        }
        if (mesh.variants.indexOf("black") !== -1) {
            return "black";
        }
        return mesh.variants[0];
    }

    function resolveVariantForProductClick(meshId, mesh) {
        if (
            selectedMeshId === meshId &&
            selectedVariantSlug &&
            mesh.variants.indexOf(selectedVariantSlug) !== -1
        ) {
            return selectedVariantSlug;
        }
        return resolveDefaultVariant(mesh);
    }

    function handleProductClick(card) {
        const meshId = card.getAttribute("data-mesh-id");
        const mesh = window.MESH_REGISTRY && window.MESH_REGISTRY[meshId];
        if (!mesh || !window.configurator3D) {
            return;
        }

        markSelectedProduct(card);

        if (mesh.partSlot && window.cameraController) {
            window.cameraController.applyForPart(mesh.partSlot);
        }

        if (mesh.single) {
            selectedMeshId = meshId;
            selectedVariantSlug = null;
            window.configurator3D.selectProduct({ meshId: meshId });
            return;
        }

        const previousMeshId = selectedMeshId;
        const previousVariant = selectedVariantSlug;
        const variantToApply = resolveVariantForProductClick(meshId, mesh);
        const isReEdit =
            previousMeshId === meshId &&
            previousVariant === variantToApply &&
            previousVariant !== null;

        selectedMeshId = meshId;
        selectedVariantSlug = variantToApply;

        const product = window.findProductByMeshId(meshId);
        const openVariantScreen = function () {
            if (
                window.configuratorMenu &&
                typeof window.configuratorMenu.openVariant === "function"
            ) {
                window.configuratorMenu.openVariant(
                    meshId,
                    product ? product.name : meshId
                );
            }
        };

        if (isReEdit) {
            openVariantScreen();
            return;
        }

        window.configurator3D
            .selectProduct({ meshId: meshId, variant: variantToApply })
            .then(openVariantScreen);
    }

    function handleVariantClick(card) {
        const meshId = card.getAttribute("data-mesh-id");
        const variant = card.getAttribute("data-variant");
        if (!meshId || !variant || !window.configurator3D) {
            return;
        }

        selectedMeshId = meshId;
        selectedVariantSlug = variant;
        markSelectedSwatch(card);

        window.configurator3D.selectProduct({
            meshId: meshId,
            variant: variant
        });
    }

    function bindHandlers() {
        document.addEventListener("click", function (event) {
            if (event.target.closest(".product-card__info")) {
                event.stopPropagation();
                return;
            }

            const swatchCard = event.target.closest(".swatch-card[data-variant][data-mesh-id]");
            if (swatchCard) {
                handleVariantClick(swatchCard);
                return;
            }

            const productCard = event.target.closest(".product-card[data-mesh-id]");
            if (productCard) {
                handleProductClick(productCard);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            if (event.target.closest(".product-card__info")) {
                return;
            }

            const swatchCard = event.target.closest(".swatch-card[data-variant][data-mesh-id]");
            if (swatchCard) {
                event.preventDefault();
                handleVariantClick(swatchCard);
                return;
            }

            const productCard = event.target.closest(".product-card[data-mesh-id]");
            if (productCard) {
                event.preventDefault();
                handleProductClick(productCard);
            }
        });
    }

    window.catalogUI = {
        renderProductList: renderProductList,
        renderVariantList: renderVariantList,
        resetVariantSelection: function () {
            selectedVariantSlug = null;
        },
        init: function () {
            bindHandlers();
        }
    };
})();
