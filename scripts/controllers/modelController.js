// Mesh visibility — show/hide by Mesh ID (node name in Sketchfab scene).
(function () {
    "use strict";

    function initModelController() {
        hideAllRegisteredMeshes().then(function () {
            console.log("[ModelController] ready — all registered meshes hidden");
        });
    }

    function hideAllRegisteredMeshes() {
        const meshIds = Object.keys(window.MESH_REGISTRY || {});
        return applyVisibility([], meshIds);
    }

    function applyVisibility(showIds, hideIds) {
        if (!window.sketchfabAPI || !window.sketchfabAPI.ready) {
            console.warn("[ModelController] Sketchfab API not ready");
            return Promise.resolve(false);
        }

        const hide = (hideIds || []).filter(Boolean);
        const show = (showIds || []).filter(Boolean);
        const ops = [];

        hide.forEach(function (meshId) {
            ops.push(window.sketchfabAPI.hideNodeByName(meshId));
        });
        show.forEach(function (meshId) {
            ops.push(window.sketchfabAPI.showNodeByName(meshId));
        });

        if (!ops.length) {
            return Promise.resolve(true);
        }

        return Promise.all(ops).then(function () {
            return true;
        });
    }

    function selectMeshProduct(meshId) {
        const mesh = window.MESH_REGISTRY && window.MESH_REGISTRY[meshId];
        if (!mesh) {
            console.warn("[ModelController] Unknown mesh:", meshId);
            return Promise.resolve(false);
        }

        return applyVisibility([meshId], mesh.competitors || []);
    }

    window.modelController = {
        init: initModelController,
        applyVisibility: applyVisibility,
        selectMeshProduct: selectMeshProduct,
        hideAllRegisteredMeshes: hideAllRegisteredMeshes
    };
})();
