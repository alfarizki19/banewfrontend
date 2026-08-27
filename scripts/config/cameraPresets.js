(function () {
    "use strict";

    // Sync with workspace/sketchfab/camera-position/presets.json
    window.CAMERA_PRESETS = {
        modelUid: "56e3db8243e946eea0eb0100ea5aa3e6",
        fovDefault: 45,
        transitionDuration: 0.5,
        parts: {
            "upper-receiver": {
                position: [-0.181, 0.132, 0.116],
                target: [0.015, 0.013, 0.017],
                fov: 45
            },
            "charging-handle": {
                position: [-0.092, 0.208, 0.217],
                target: [0.031, 0.103, 0.026],
                fov: 45
            },
            "bolt-carrier-group": {
                position: [-0.224, 0.067, 0.118],
                target: [-0.006, -0.02, 0.032],
                fov: 45
            },
            barrel: {
                position: [-0.267, -0.754, 0.233],
                target: [0.038, -0.224, -0.022],
                fov: 45
            },
            "lower-receiver": {
                position: [0.217, -0.143, -0.035],
                target: [0.008, -0.009, -0.004],
                fov: 45
            },
            "pistol-grip": {
                position: [-0.253, 0.194, -0.066],
                target: [0.029, 0.079, -0.057],
                fov: 45
            },
            stock: {
                position: [0.213, 0.03, 0.097],
                target: [0.037, 0.189, 0.019],
                fov: 45
            },
            trigger: {
                position: [0.204, -0.118, 0.029],
                target: [-0.006, 0.014, -0.001],
                fov: 45
            },
            "safety-selector": {
                position: [0.156, -0.039, -0.023],
                target: [-0.07, 0.067, -0.007],
                fov: 45
            },
            magazine: {
                position: [0.303, -0.23, -0.077],
                target: [-0.153, -0.025, -0.105],
                fov: 45
            },
            "buffer-system": {
                position: [0.235, 0.005, 0.158],
                target: [0.019, 0.125, 0.04],
                fov: 45
            },
            "trigger-guard": {
                position: [0.115, -0.082, 0.045],
                target: [-0.007, 0.009, -0.045],
                fov: 45
            }
        }
    };

    window.getCameraPresetForPart = function (partSlug) {
        const presets = window.CAMERA_PRESETS && window.CAMERA_PRESETS.parts;
        if (!partSlug || !presets) {
            return null;
        }
        return presets[partSlug] || null;
    };
})();
