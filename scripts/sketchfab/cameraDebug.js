// Realtime Sketchfab camera position overlay (toggle via DEBUG_CONFIG.cameraOverlay).
(function () {
    "use strict";

    const WRAP_ID = "camera-debug-wrap";
    const OVERLAY_ID = "camera-debug";
    const COPY_BTN_ID = "camera-debug-copy";
    let running = false;
    let rafId = null;
    let lastCameraState = null;
    let copyHandlerBound = false;

    function isEnabled() {
        return Boolean(window.DEBUG_CONFIG && window.DEBUG_CONFIG.cameraOverlay);
    }

    function getWrapEl() {
        return document.getElementById(WRAP_ID);
    }

    function getOverlayEl() {
        return document.getElementById(OVERLAY_ID);
    }

    function roundVec(vec) {
        if (!vec || vec.length < 3) {
            return null;
        }
        return [
            Number(vec[0].toFixed(3)),
            Number(vec[1].toFixed(3)),
            Number(vec[2].toFixed(3))
        ];
    }

    function formatVec(vec) {
        const rounded = roundVec(vec);
        if (!rounded) {
            return "—, —, —";
        }
        return rounded.join(", ");
    }

    function buildClipboardText(state) {
        if (!state || !state.position || !state.target) {
            return "";
        }

        const lines = [
            "position: [" + state.position.join(", ") + "]",
            "target: [" + state.target.join(", ") + "]"
        ];

        if (typeof state.fov === "number" && !isNaN(state.fov)) {
            lines.push("fov: " + state.fov.toFixed(1));
        }

        lines.push("");
        lines.push(
            "setCameraLookAt([" +
                state.position.join(", ") +
                "], [" +
                state.target.join(", ") +
                "]);"
        );

        return lines.join("\n");
    }

    function writeClipboard(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            return navigator.clipboard.writeText(text);
        }

        return new Promise(function (resolve, reject) {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();

            try {
                document.execCommand("copy");
                document.body.removeChild(textarea);
                resolve();
            } catch (error) {
                document.body.removeChild(textarea);
                reject(error);
            }
        });
    }

    function flashCopyLabel(button, label) {
        const original = button.textContent;
        button.textContent = label;
        window.setTimeout(function () {
            button.textContent = original;
        }, 1200);
    }

    function copyCameraCoordinates() {
        const button = document.getElementById(COPY_BTN_ID);
        const text = buildClipboardText(lastCameraState);

        if (!text) {
            if (button) {
                flashCopyLabel(button, "No data");
            }
            return Promise.resolve(false);
        }

        return writeClipboard(text)
            .then(function () {
                if (button) {
                    flashCopyLabel(button, "Copied!");
                }
                return true;
            })
            .catch(function (error) {
                console.warn("[CameraDebug] Clipboard copy failed:", error);
                if (button) {
                    flashCopyLabel(button, "Failed");
                }
                return false;
            });
    }

    function bindCopyHandler() {
        if (copyHandlerBound) {
            return;
        }

        const button = document.getElementById(COPY_BTN_ID);
        if (!button) {
            return;
        }

        copyHandlerBound = true;
        button.addEventListener("click", function () {
            copyCameraCoordinates();
        });
    }

    function updateOverlay(camera, fov) {
        const el = getOverlayEl();
        if (!el) {
            return;
        }

        const position = roundVec(camera.position);
        const target = roundVec(camera.target);
        const fovValue =
            typeof fov === "number" && !isNaN(fov) ? Number(fov.toFixed(1)) : null;

        lastCameraState = {
            position: position,
            target: target,
            fov: fovValue
        };

        let text =
            "cam pos [" +
            formatVec(camera.position) +
            "] · target [" +
            formatVec(camera.target) +
            "]";

        if (fovValue !== null) {
            text += " · fov " + fovValue.toFixed(1);
        }

        el.textContent = text;
    }

    function tick() {
        if (!running) {
            return;
        }

        const api = window.sketchfabAPI && window.sketchfabAPI.api;
        if (!api || typeof api.getCameraLookAt !== "function") {
            rafId = window.requestAnimationFrame(tick);
            return;
        }

        api.getCameraLookAt(function (err, camera) {
            if (!running) {
                return;
            }

            if (err || !camera) {
                rafId = window.requestAnimationFrame(tick);
                return;
            }

            if (typeof api.getFov === "function") {
                api.getFov(function (fovErr, fov) {
                    if (!running) {
                        return;
                    }
                    updateOverlay(camera, fovErr ? null : fov);
                    rafId = window.requestAnimationFrame(tick);
                });
            } else {
                updateOverlay(camera, null);
                rafId = window.requestAnimationFrame(tick);
            }
        });
    }

    function applyVisibility() {
        const wrap = getWrapEl();
        if (wrap) {
            wrap.hidden = !isEnabled();
        }
    }

    function start() {
        applyVisibility();
        bindCopyHandler();
        if (!isEnabled() || running) {
            return;
        }

        running = true;
        tick();
    }

    function stop() {
        running = false;
        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function init() {
        applyVisibility();
        bindCopyHandler();
    }

    window.cameraDebug = {
        init: init,
        start: start,
        stop: stop,
        isEnabled: isEnabled,
        copyCoordinates: copyCameraCoordinates,
        getLastCameraState: function () {
            return lastCameraState ? Object.assign({}, lastCameraState) : null;
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
