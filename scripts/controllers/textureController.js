// Wire mesh registry + URL builder to textureCore.
(function () {
    "use strict";

    function initTextureController() {
        if (!window.textureCore) {
            console.warn("[TextureController] textureCore not found");
            return;
        }

        if (window.sketchfabAPI && window.sketchfabAPI.api) {
            window.textureCore.initTextureCore(window.sketchfabAPI.api);
        }

        console.log("[TextureController] ready");
    }

    function applyMeshTexture(meshId, variantKey) {
        if (!window.textureUrlBuilder) {
            console.warn("[TextureController] textureUrlBuilder not found");
            return Promise.resolve(false);
        }

        const config = window.textureUrlBuilder.buildTextureConfig(meshId, variantKey);
        if (!config) {
            console.warn("[TextureController] Unknown mesh:", meshId);
            return Promise.resolve(false);
        }

        window.textureCore.configureTextureController({
            targetMaterialName: config.targetMaterialName,
            sharedMaps: config.sharedMaps,
            textureSets: config.textureSets
        });

        return window.textureCore.applyTextureSet(config.activeVariant);
    }

    window.textureController = {
        init: initTextureController,
        applyMeshTexture: applyMeshTexture
    };
})();
