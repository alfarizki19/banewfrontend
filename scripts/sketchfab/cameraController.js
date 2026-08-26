// Part-based Sketchfab camera — setCameraLookAt on part / product card clicks.
(function () {
    "use strict";

    function getApi() {
        return window.sketchfabAPI && window.sketchfabAPI.api;
    }

    function getDuration(options) {
        if (options && typeof options.duration === "number") {
            return options.duration;
        }
        const cfg = window.CAMERA_PRESETS;
        if (cfg && typeof cfg.transitionDuration === "number") {
            return cfg.transitionDuration;
        }
        return 0.5;
    }

    function applyFov(api, fov) {
        if (typeof fov !== "number" || isNaN(fov) || typeof api.setFov !== "function") {
            return Promise.resolve(true);
        }

        return new Promise(function (resolve) {
            api.setFov(fov, function () {
                resolve(true);
            });
        });
    }

    function applyLookAt(api, preset, duration) {
        return new Promise(function (resolve) {
            api.setCameraLookAt(preset.position, preset.target, duration, function (err) {
                if (err) {
                    console.warn("[CameraController] setCameraLookAt failed:", err);
                    resolve(false);
                    return;
                }
                applyFov(api, preset.fov).then(function () {
                    resolve(true);
                });
            });
        });
    }

    function applyForPart(partSlug, options) {
        const preset =
            typeof window.getCameraPresetForPart === "function"
                ? window.getCameraPresetForPart(partSlug)
                : null;

        if (!preset || !preset.position || !preset.target) {
            return Promise.resolve(false);
        }

        const api = getApi();
        if (!api || typeof api.setCameraLookAt !== "function") {
            return Promise.resolve(false);
        }

        return applyLookAt(api, preset, getDuration(options));
    }

    window.cameraController = {
        applyForPart: applyForPart,
        getPreset: function (partSlug) {
            return typeof window.getCameraPresetForPart === "function"
                ? window.getCameraPresetForPart(partSlug)
                : null;
        }
    };
})();
