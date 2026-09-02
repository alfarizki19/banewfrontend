// Bootstrap Sketchfab Viewer API for the configurator production model.
(function () {
    "use strict";

    const IFRAME_ID = "sketchfab-iframe";

    function getModelUid() {
        return window.SKETCHFAB_MODEL_UID || "b426f4e50646455f930a2d3d7b1f9ca8";
    }

    function getEmbedOptions() {
        return window.SKETCHFAB_EMBED_OPTS || {
            autostart: 1,
            transparent: 1,
            ui_infos: 0,
            ui_watermark: 0,
            ui_watermark_link: 0
        };
    }

    function syncIframeEmbedUrl(iframe) {
        if (!iframe || typeof window.getSketchfabEmbedUrl !== "function") {
            return;
        }
        iframe.src = window.getSketchfabEmbedUrl(getModelUid(), getEmbedOptions());
    }

    function initControllers() {
        if (window.modelController && typeof window.modelController.init === "function") {
            window.modelController.init();
        }
        if (window.textureController && typeof window.textureController.init === "function") {
            window.textureController.init();
        }
        if (window.buildController && typeof window.buildController.init === "function") {
            window.buildController.init();
        }
    }

    function initSketchfabViewer() {
        const iframe = document.getElementById(IFRAME_ID);

        if (!iframe || !window.Sketchfab) {
            setTimeout(initSketchfabViewer, 100);
            return;
        }

        syncIframeEmbedUrl(iframe);

        const client = new window.Sketchfab(iframe);
        const embedOptions = getEmbedOptions();

        client.init(getModelUid(), Object.assign({}, embedOptions, {
            success: function (api) {
                api.start();
                window.sketchfabAPI = window.sketchfabAPI || {};
                window.sketchfabAPI.initSketchfab(api);

                api.addEventListener("viewerready", function () {
                    console.log("[Sketchfab] viewerready — configurator 3D stack init");
                    initControllers();
                    if (window.cameraDebug && typeof window.cameraDebug.start === "function") {
                        window.cameraDebug.start();
                    }
                });
            },
            error: function () {
                console.error("[Sketchfab] Viewer init failed for model", getModelUid());
            }
        }));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSketchfabViewer);
    } else {
        initSketchfabViewer();
    }
})();
