// Load textures from CDN URLs and update Sketchfab material channels.
(function () {
    "use strict";

    const state = {
        api: null,
        configured: false,
        textureSets: null,
        sharedMaps: null,
        targetMaterialName: null,
        textureUidCache: new Map()
    };

    function initTextureCore(api) {
        state.api = api || null;
    }

    function configureTextureController(config) {
        state.textureSets = config && config.textureSets ? config.textureSets : null;
        state.sharedMaps = config && config.sharedMaps ? config.sharedMaps : null;
        state.targetMaterialName = config && config.targetMaterialName ? config.targetMaterialName : null;
        state.configured = !!(
            state.textureSets &&
            state.sharedMaps &&
            state.targetMaterialName
        );
    }

    function pickChannelKey(material, candidates) {
        const channels = material && material.channels ? material.channels : {};
        const keys = Object.keys(channels);
        if (!keys.length) {
            return null;
        }

        const lowerKeys = keys.map(function (k) {
            return { k: k, lower: k.toLowerCase() };
        });

        let i;
        for (i = 0; i < candidates.length; i++) {
            const candLower = String(candidates[i]).toLowerCase();
            const exact = lowerKeys.find(function (x) {
                return x.lower === candLower;
            });
            if (exact) {
                return exact.k;
            }
        }

        for (i = 0; i < candidates.length; i++) {
            const candLower = String(candidates[i]).toLowerCase();
            const partial = lowerKeys.find(function (x) {
                return x.lower.includes(candLower);
            });
            if (partial) {
                return partial.k;
            }
        }

        return null;
    }

    function getMaterialByName(materials, materialName) {
        const target = String(materialName);
        return (materials || []).find(function (m) {
            return m && m.name === target;
        }) || null;
    }

    function addTextureByUrl(url) {
        if (!state.api) {
            return Promise.reject(new Error("Sketchfab API not initialized in TextureCore"));
        }

        if (state.textureUidCache.has(url)) {
            return Promise.resolve(state.textureUidCache.get(url));
        }

        return new Promise(function (resolve, reject) {
            state.api.addTexture(url, function (err, textureUid) {
                if (err) {
                    reject(err);
                    return;
                }
                state.textureUidCache.set(url, textureUid);
                resolve(textureUid);
            });
        });
    }

    function setChannelTexture(channelObj, textureUid) {
        if (!channelObj) {
            return;
        }
        channelObj.texture = { uid: textureUid };
        if ("enable" in channelObj) {
            channelObj.enable = true;
        }
    }

    function clearChannelTexture(channelObj) {
        if (!channelObj) {
            return;
        }
        if ("texture" in channelObj) {
            channelObj.texture = null;
        }
        if ("enable" in channelObj) {
            channelObj.enable = false;
        }
    }

    function applyTextureSet(setKey) {
        const safeSetKey = String(setKey || "");

        if (!state.api) {
            console.warn("[TextureCore] applyTextureSet(): API not ready");
            return Promise.resolve(false);
        }
        if (!state.configured) {
            console.warn("[TextureCore] applyTextureSet(): not configured yet");
            return Promise.resolve(false);
        }

        if (safeSetKey === "none") {
            return new Promise(function (resolve) {
                state.api.getMaterialList(function (err, materials) {
                    if (err) {
                        console.error("[TextureCore] getMaterialList failed:", err);
                        resolve(false);
                        return;
                    }

                    const material = getMaterialByName(materials, state.targetMaterialName);
                    if (!material) {
                        console.warn("[TextureCore] Material not found:", state.targetMaterialName);
                        resolve(false);
                        return;
                    }

                    const baseKey = pickChannelKey(material, [
                        "AlbedoPBR",
                        "BaseColorPBR",
                        "BaseColor",
                        "Albedo",
                        "DiffuseColorPBR",
                        "DiffuseColor"
                    ]);
                    const roughKey = pickChannelKey(material, ["RoughnessPBR", "Roughness"]);
                    const metalKey = pickChannelKey(material, ["MetallicPBR", "Metallic"]);
                    const normalKey = pickChannelKey(material, [
                        "NormalMapPBR",
                        "NormalMap",
                        "NormalPBR",
                        "Normal"
                    ]);

                    clearChannelTexture(baseKey ? material.channels[baseKey] : null);
                    clearChannelTexture(roughKey ? material.channels[roughKey] : null);
                    clearChannelTexture(metalKey ? material.channels[metalKey] : null);
                    clearChannelTexture(normalKey ? material.channels[normalKey] : null);

                    state.api.setMaterial(material, function () {
                        resolve(true);
                    });
                });
            });
        }

        const setCfg = state.textureSets && state.textureSets[safeSetKey];
        if (!setCfg || !setCfg.baseUrl) {
            console.warn('[TextureCore] Unknown texture set or missing baseUrl: "' + safeSetKey + '"');
            return Promise.resolve(false);
        }

        const baseUrl = setCfg.baseUrl;
        const metallicUrl = state.sharedMaps.metallicUrl;
        const roughnessUrl = state.sharedMaps.roughnessUrl;
        const normalUrl = state.sharedMaps.normalUrl;

        if (!metallicUrl || !roughnessUrl || !normalUrl) {
            console.warn("[TextureCore] sharedMaps missing (metallic/roughness/normal)");
            return Promise.resolve(false);
        }

        return new Promise(function (resolve) {
            Promise.all([
                addTextureByUrl(baseUrl),
                addTextureByUrl(metallicUrl),
                addTextureByUrl(roughnessUrl),
                addTextureByUrl(normalUrl)
            ])
                .then(function (uids) {
                    const baseUid = uids[0];
                    const metallicUid = uids[1];
                    const roughnessUid = uids[2];
                    const normalUid = uids[3];

                    state.api.getMaterialList(function (err, materials) {
                        if (err) {
                            console.error("[TextureCore] getMaterialList failed:", err);
                            resolve(false);
                            return;
                        }

                        const material = getMaterialByName(materials, state.targetMaterialName);
                        if (!material) {
                            console.warn("[TextureCore] Material not found:", state.targetMaterialName);
                            resolve(false);
                            return;
                        }

                        const baseKey = pickChannelKey(material, [
                            "AlbedoPBR",
                            "BaseColorPBR",
                            "BaseColor",
                            "Albedo",
                            "DiffuseColorPBR",
                            "DiffuseColor"
                        ]);
                        const roughKey = pickChannelKey(material, ["RoughnessPBR", "Roughness"]);
                        const metalKey = pickChannelKey(material, ["MetallicPBR", "Metallic"]);
                        const normalKey = pickChannelKey(material, [
                            "NormalMapPBR",
                            "NormalMap",
                            "NormalPBR",
                            "Normal"
                        ]);

                        if (baseKey) {
                            setChannelTexture(material.channels[baseKey], baseUid);
                        }
                        if (roughKey) {
                            setChannelTexture(material.channels[roughKey], roughnessUid);
                        }
                        if (metalKey) {
                            setChannelTexture(material.channels[metalKey], metallicUid);
                        }
                        if (normalKey) {
                            setChannelTexture(material.channels[normalKey], normalUid);
                        }

                        state.api.setMaterial(material, function () {
                            resolve(true);
                        });
                    });
                })
                .catch(function (e) {
                    console.error("[TextureCore] applyTextureSet() failed:", e);
                    resolve(false);
                });
        });
    }

    window.textureCore = {
        initTextureCore: initTextureCore,
        configureTextureController: configureTextureController,
        applyTextureSet: applyTextureSet
    };
})();
