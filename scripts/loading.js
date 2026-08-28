(function () {
    const MID_DELAY_MS = 280;
    const FILL_MS = 700;
    const HOLD_AFTER_FULL_MS = 2500;
    const overlay = document.getElementById("loading-overlay");
    const bar = overlay && overlay.querySelector(".loading-bar-progress");

    if (!overlay || !bar) {
        return;
    }

    let isComplete = false;

    function hideOverlay() {
        overlay.classList.add("is-hidden");
        overlay.setAttribute("aria-hidden", "true");
    }

    function fillThenHold() {
        if (isComplete) {
            return;
        }

        isComplete = true;
        bar.classList.remove("is-mid");
        bar.classList.add("is-full");
        window.setTimeout(hideOverlay, FILL_MS + HOLD_AFTER_FULL_MS);
    }

    window.requestAnimationFrame(function () {
        bar.classList.add("is-mid");
    });

    window.setTimeout(function () {
        if (!isComplete) {
            bar.classList.add("is-mid");
        }
    }, MID_DELAY_MS);

    if (document.readyState === "complete") {
        window.setTimeout(fillThenHold, MID_DELAY_MS + 200);
        return;
    }

    window.addEventListener("load", fillThenHold);
})();
