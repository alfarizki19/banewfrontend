// Partial build orchestration — product card → show/hide mesh + apply texture.
(function () {
    "use strict";

    let handlersBound = false;

    function resolveVariant(meshId, variant) {
        const mesh = window.MESH_REGISTRY && window.MESH_REGISTRY[meshId];
        if (!mesh) {
            return null;
        }

        if (mesh.single) {
            return "default";
        }

        if (variant && mesh.variants && mesh.variants.indexOf(variant) !== -1) {
            return variant;
        }

        if (mesh.variants && mesh.variants.length) {
            return mesh.variants[0];
        }

        return null;
    }

    function selectProduct(options) {
        const meshId = options && options.meshId;
        const variant = options && options.variant ? options.variant : null;

        if (!meshId) {
            console.warn("[BuildController] selectProduct(): meshId required");
            return Promise.resolve(false);
        }

        const mesh = window.MESH_REGISTRY && window.MESH_REGISTRY[meshId];
        if (!mesh) {
            console.warn("[BuildController] Unknown mesh:", meshId);
            return Promise.resolve(false);
        }

        const variantKey = resolveVariant(meshId, variant);

        return window.modelController
            .selectMeshProduct(meshId)
            .then(function () {
                return window.textureController.applyMeshTexture(meshId, variantKey);
            });
    }

    function init() {
        if (handlersBound) {
            return;
        }

        handlersBound = true;

        if (window.catalogUI && typeof window.catalogUI.init === "function") {
            window.catalogUI.init();
        }

        console.log("[BuildController] ready — use configurator3D.selectProduct({ meshId, variant })");
    }

    window.configurator3D = {
        selectProduct: selectProduct,
        previewTextureUrls: function (meshId, variant) {
            if (!window.textureUrlBuilder) {
                return null;
            }
            return window.textureUrlBuilder.buildTextureConfig(meshId, variant);
        }
    };

    window.buildController = {
        init: init
    };
})();
