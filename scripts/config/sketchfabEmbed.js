(function () {
    "use strict";

    window.SKETCHFAB_MODEL_UID = "56e3db8243e946eea0eb0100ea5aa3e6";

    // Premium white-label embed — hide Sketchfab chrome inside iframe.
    window.SKETCHFAB_EMBED_OPTS = {
        autostart: 1,
        transparent: 1,
        preload: 1,
        ui_controls: 0,
        ui_infos: 0,
        ui_watermark: 0,
        ui_watermark_link: 0,
        ui_stop: 0,
        ui_general_controls: 0,
        ui_inspector: 0,
        ui_fullscreen: 0,
        ui_settings: 0,
        ui_help: 0,
        ui_annotations: 0
    };

    window.buildSketchfabEmbedQuery = function (opts) {
        return Object.keys(opts)
            .map(function (key) {
                return (
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(String(opts[key]))
                );
            })
            .join("&");
    };

    window.getSketchfabEmbedUrl = function (modelUid, opts) {
        const uid = modelUid || window.SKETCHFAB_MODEL_UID;
        const options = opts || window.SKETCHFAB_EMBED_OPTS;
        return (
            "https://sketchfab.com/models/" +
            uid +
            "/embed?" +
            window.buildSketchfabEmbedQuery(options)
        );
    };
})();
