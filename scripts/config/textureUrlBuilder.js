(function () {
    "use strict";

    function buildTextureUrl(meshId, section, part, map, variant) {
        const cfg = window.CDN_CONFIG;
        if (!cfg) {
            throw new Error("CDN_CONFIG is not defined");
        }

        let suffix;
        if (map === "b") {
            suffix = variant ? "_b_" + variant : "_b";
        } else {
            suffix = "_" + map;
        }

        let url =
            cfg.base +
            "/" +
            cfg.textureRoot +
            "/" +
            section +
            "/" +
            part +
            "/" +
            meshId +
            "/" +
            meshId +
            suffix +
            ".png";

        if (cfg.textureVersion) {
            url += "?v=" + encodeURIComponent(String(cfg.textureVersion));
        }

        return url;
    }

    function buildTextureConfig(meshId, variantKey) {
        const mesh = window.MESH_REGISTRY && window.MESH_REGISTRY[meshId];
        if (!mesh) {
            return null;
        }

        const sharedMaps = {
            metallicUrl: buildTextureUrl(meshId, mesh.section, mesh.part, "m"),
            roughnessUrl: buildTextureUrl(meshId, mesh.section, mesh.part, "r"),
            normalUrl: buildTextureUrl(meshId, mesh.section, mesh.part, "n")
        };

        const textureSets = { none: {} };

        if (mesh.single) {
            textureSets.default = {
                baseUrl: buildTextureUrl(meshId, mesh.section, mesh.part, "b")
            };
        } else if (mesh.variants && mesh.variants.length) {
            mesh.variants.forEach(function (variant) {
                textureSets[variant] = {
                    baseUrl: buildTextureUrl(
                        meshId,
                        mesh.section,
                        mesh.part,
                        "b",
                        variant
                    )
                };
            });
        }

        let activeVariant = "none";
        if (mesh.single) {
            activeVariant = "default";
        } else if (variantKey && textureSets[variantKey]) {
            activeVariant = variantKey;
        } else if (mesh.variants && mesh.variants.length) {
            activeVariant = mesh.variants[0];
        }

        return {
            targetMaterialName: mesh.material,
            sharedMaps: sharedMaps,
            textureSets: textureSets,
            activeVariant: activeVariant
        };
    }

    window.textureUrlBuilder = {
        buildTextureUrl: buildTextureUrl,
        buildTextureConfig: buildTextureConfig
    };
})();
