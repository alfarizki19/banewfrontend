(function () {
    const DESKTOP_MIN = 901;
    const sheet = document.getElementById("bottom-sheet");
    const dragZone = document.getElementById("sheet-drag-zone");
    const caliberButtons = document.querySelectorAll("[data-caliber]");
    const menuButtons = document.querySelectorAll("[data-menu]");
    const partButtons = document.querySelectorAll("[data-part]");
    const viewBuildButton = document.getElementById("view-build-btn");
    const cartButton = document.getElementById("cart-button");
    const sheetTitle = document.getElementById("sheet-title");
    const sheetSubtitle = document.getElementById("sheet-subtitle");
    const sheetBack = document.getElementById("sheet-back");
    const productBack = document.getElementById("product-back");
    const productView = document.getElementById("product-view");
    const productEyebrow = document.getElementById("product-eyebrow");
    const productHeading = document.getElementById("product-heading");
    const productLead = document.getElementById("product-lead");
    const navBackButtons = document.querySelectorAll(".js-nav-back");

    const panelViews = {
        caliber: document.getElementById("caliber-view"),
        main: document.getElementById("main-menu-view"),
        "part-upper": document.getElementById("part-upper-view"),
        "part-lower": document.getElementById("part-lower-view"),
        product: document.getElementById("product-view")
    };

    const sheetGroups = {
        caliber: document.getElementById("caliber-group"),
        main: document.getElementById("main-menu-group"),
        "part-upper": document.getElementById("part-upper-group"),
        "part-lower": document.getElementById("part-lower-group"),
        product: document.getElementById("product-group")
    };

    const cartOverlay = document.getElementById("cart-overlay");

    const PART_TITLES = {
        "upper-complete": "Upper complete",
        "lower-complete": "Lower complete",
        "upper-receiver": "Upper Receiver",
        barrel: "Barrel",
        handguard: "Handguard",
        "gas-block": "Gas Block",
        "gas-tube": "Gas Tube",
        "muzzle-device": "Muzzle Device",
        "bolt-carrier-group": "Bolt Carrier Group",
        "charging-handle": "Charging Handle",
        "forward-assist": "Forward Assist",
        "ejection-port-cover": "Ejection Port Cover",
        "lower-receiver": "Lower Receiver",
        trigger: "Trigger",
        "pistol-grip": "Pistol Grip",
        stock: "Stock",
        "buffer-system": "Buffer System",
        "safety-selector": "Safety Selector",
        magazine: "Magazine",
        "magazine-release": "Magazine Release",
        "bolt-catch": "Bolt Catch",
        "trigger-guard": "Trigger Guard",
        "takedown-pin": "Takedown Pin"
    };

    const states = {
        collapsed: "collapsed",
        half: "half",
        full: "full"
    };

    let currentState = states.half;
    let currentView = "caliber";
    let selectedCaliber = null;
    let selectedMenu = null;
    let selectedPart = null;
    let productBackTarget = "main";
    let isCartOpen = false;
    let isDragging = false;
    let hasDragged = false;
    let startY = 0;
    let startHeight = 0;
    const DRAG_THRESHOLD = 6;

    const sheetCopy = {
        caliber: {
            title: "Select Caliber",
            subtitle: "Choose a caliber to begin your build.",
            back: "Caliber",
            backTarget: "caliber",
            showBack: false
        },
        main: {
            title: "Build Your AR",
            subtitle: "Select a section to customize your build.",
            back: "Caliber",
            backTarget: "caliber",
            showBack: true
        },
        "part-upper": {
            title: "Stripped Upper",
            subtitle: "Choose a part to configure.",
            back: "Main menu",
            backTarget: "main",
            showBack: true
        },
        "part-lower": {
            title: "Stripped Lower",
            subtitle: "Choose a part to configure.",
            back: "Main menu",
            backTarget: "main",
            showBack: true
        },
        product: {
            title: "Select Product",
            subtitle: "Available products will appear here.",
            back: "Back",
            backTarget: "main",
            showBack: true
        }
    };

    function isMobileLayout() {
        return window.innerWidth < DESKTOP_MIN;
    }

    function getViewportHeight() {
        return window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;
    }

    function getSnapHeights() {
        const viewportHeight = getViewportHeight();
        const ratio = viewportHeight <= 700 ? 0.5 : 0.46;
        const minHalf = viewportHeight <= 700 ? 285 : 300;
        const halfHeight = Math.max(
            minHalf,
            Math.min(420, viewportHeight * ratio)
        );

        return {
            collapsed: 58,
            half: halfHeight,
            full: viewportHeight
        };
    }

    function clearDragStyles() {
        if (!sheet) {
            return;
        }

        sheet.style.height = "";
        sheet.style.minHeight = "";
        sheet.style.maxHeight = "";
        sheet.style.transition = "";
    }

    function sheetLabelFor(state) {
        const topic = sheetCopy[currentView]
            ? sheetCopy[currentView].title
            : "Menu";

        if (state === states.collapsed) {
            return topic + " collapsed";
        }

        if (state === states.half) {
            return topic + " partially expanded";
        }

        return topic + " fully expanded";
    }

    function setSheetState(state) {
        if (!sheet) {
            return;
        }

        currentState = state;
        sheet.dataset.state = state;
        clearDragStyles();
        sheet.setAttribute("aria-label", sheetLabelFor(state));
    }

    function getNearestState(height) {
        const snap = getSnapHeights();
        const collapsedDistance = Math.abs(height - snap.collapsed);
        const halfDistance = Math.abs(height - snap.half);
        const fullDistance = Math.abs(height - snap.full);
        const minimumDistance = Math.min(
            collapsedDistance,
            halfDistance,
            fullDistance
        );

        if (minimumDistance === collapsedDistance) {
            return states.collapsed;
        }

        if (minimumDistance === fullDistance) {
            return states.full;
        }

        return states.half;
    }

    function snapFromCurrentPosition() {
        const height = sheet.getBoundingClientRect().height;
        setSheetState(getNearestState(height));
    }

    function handleTap() {
        if (currentState === states.collapsed) {
            setSheetState(states.half);
            return;
        }

        if (currentState === states.half) {
            setSheetState(states.full);
            return;
        }

        setSheetState(states.collapsed);
    }

    function hideAllViews() {
        Object.keys(panelViews).forEach(function (key) {
            panelViews[key].classList.add("screen-hidden");
        });

        Object.keys(sheetGroups).forEach(function (key) {
            sheetGroups[key].classList.add("screen-hidden");
        });
    }

    function showView(viewId) {
        currentView = viewId;
        hideAllViews();
        panelViews[viewId].classList.remove("screen-hidden");
        sheetGroups[viewId].classList.remove("screen-hidden");

        const copy = sheetCopy[viewId];
        sheetTitle.textContent = copy.title;
        sheetSubtitle.textContent = copy.subtitle;
        const mark = document.createElement("span");
        mark.className = "back-link__mark";
        mark.setAttribute("aria-hidden", "true");
        sheetBack.textContent = copy.back;
        sheetBack.prepend(mark);
        sheetBack.dataset.back = copy.backTarget;
        sheetBack.classList.toggle("screen-hidden", !copy.showBack);

        if (isMobileLayout()) {
            setSheetState(viewId === "caliber" ? states.half : states.full);
        }
    }

    function updateCartCaliber() {
        const labels = document.querySelectorAll(".js-cart-caliber");
        const text = selectedCaliber || "—";

        labels.forEach(function (label) {
            label.textContent = text;
        });
    }

    function openCart() {
        if (!selectedCaliber || !cartOverlay) {
            return;
        }

        updateCartCaliber();
        isCartOpen = true;
        cartOverlay.classList.add("is-open");
        cartOverlay.setAttribute("aria-hidden", "false");
    }

    function closeCart() {
        if (!cartOverlay) {
            return;
        }

        isCartOpen = false;
        cartOverlay.classList.remove("is-open");
        cartOverlay.setAttribute("aria-hidden", "true");
    }

    function openProduct(slotId, backTarget) {
        const title = PART_TITLES[slotId] || "Product";
        productBackTarget = backTarget;
        productView.dataset.productSlot = slotId;
        productEyebrow.textContent = title;
        productHeading.textContent = title;
        productLead.textContent = "Available products will appear here.";
        productBack.dataset.back = backTarget;
        productBack.lastChild.textContent = backTarget === "main" ? " Main menu" : " Parts";
        sheetCopy.product.title = title;
        sheetCopy.product.backTarget = backTarget;
        sheetCopy.product.back = backTarget === "main" ? "Main menu" : "Parts";
        showView("product");
    }

    function selectCaliber(caliberName) {
        selectedCaliber = caliberName;

        caliberButtons.forEach(function (button) {
            const isSelected = button.getAttribute("data-caliber") === caliberName;
            button.classList.toggle("is-selected", isSelected);
        });

        showView("main");
    }

    function selectMenu(menuId) {
        if (menuId === "gear") {
            return;
        }

        selectedMenu = menuId;

        menuButtons.forEach(function (button) {
            const isSelected = button.getAttribute("data-menu") === menuId;
            button.classList.toggle("is-selected", isSelected);
        });

        if (menuId === "upper-complete") {
            openProduct("upper-complete", "main");
            return;
        }

        if (menuId === "lower-complete") {
            openProduct("lower-complete", "main");
            return;
        }

        if (menuId === "upper-striped") {
            showView("part-upper");
            return;
        }

        if (menuId === "lower-striped") {
            showView("part-lower");
        }
    }

    function selectPart(partId, family) {
        selectedPart = partId;

        partButtons.forEach(function (button) {
            const isSelected = button.getAttribute("data-part") === partId;
            button.classList.toggle("is-selected", isSelected);
        });

        const backTarget = family === "lower" ? "part-lower" : "part-upper";
        openProduct(partId, backTarget);
    }

    caliberButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectCaliber(button.getAttribute("data-caliber"));
        });
    });

    menuButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectMenu(button.getAttribute("data-menu"));
        });
    });

    partButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectPart(
                button.getAttribute("data-part"),
                button.getAttribute("data-part-family")
            );
        });
    });

    navBackButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const target = button.dataset.back || "main";

            if (currentView === "product") {
                showView(productBackTarget);
                return;
            }

            showView(target);
        });
    });

    function onViewBuild() {
        openCart();
    }

    if (viewBuildButton) {
        viewBuildButton.addEventListener("click", onViewBuild);
    }

    if (cartButton) {
        cartButton.addEventListener("click", onViewBuild);
    }

    document.querySelectorAll(".js-cart-close").forEach(function (button) {
        button.addEventListener("click", function () {
            closeCart();
        });
    });

    if (dragZone && sheet) {
        dragZone.addEventListener("pointerdown", function (event) {
            if (!isMobileLayout()) {
                return;
            }

            isDragging = true;
            hasDragged = false;
            startY = event.clientY;
            startHeight = sheet.getBoundingClientRect().height;
            sheet.style.minHeight = "58px";
            sheet.style.maxHeight = getViewportHeight() + "px";
            sheet.style.height = startHeight + "px";
            sheet.style.transition = "none";

            if (dragZone.setPointerCapture) {
                dragZone.setPointerCapture(event.pointerId);
            }
        });

        dragZone.addEventListener("pointermove", function (event) {
            if (!isDragging) {
                return;
            }

            const deltaY = startY - event.clientY;

            if (Math.abs(deltaY) > DRAG_THRESHOLD) {
                hasDragged = true;
            }

            const snap = getSnapHeights();
            const newHeight = Math.max(
                snap.collapsed,
                Math.min(snap.full, startHeight + deltaY)
            );

            sheet.style.height = newHeight + "px";
        });

        dragZone.addEventListener("pointerup", function (event) {
            if (!isDragging) {
                return;
            }

            isDragging = false;

            if (!hasDragged) {
                clearDragStyles();
                handleTap();
            } else {
                snapFromCurrentPosition();
            }

            if (
                dragZone.hasPointerCapture &&
                dragZone.hasPointerCapture(event.pointerId)
            ) {
                dragZone.releasePointerCapture(event.pointerId);
            }
        });

        dragZone.addEventListener("pointercancel", function () {
            if (!isDragging) {
                return;
            }

            isDragging = false;
            snapFromCurrentPosition();
        });

        dragZone.addEventListener("keydown", function (event) {
            if (!isMobileLayout()) {
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleTap();
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setSheetState(
                    currentState === states.collapsed ? states.half : states.full
                );
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                setSheetState(
                    currentState === states.full ? states.half : states.collapsed
                );
            }
        });
    }

    function refreshSheet() {
        if (!isDragging && isMobileLayout()) {
            setSheetState(currentState);
        }
    }

    window.addEventListener("resize", refreshSheet);

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", refreshSheet);
    }

    if (isMobileLayout()) {
        setSheetState(states.half);
    }
})();
