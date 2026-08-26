(function () {
    "use strict";

    // part slug (data-part) → products for that slot.
    window.PRODUCT_CATALOG = {
        "upper-receiver": [
            {
                id: "UPR001001",
                meshId: "UPR001001",
                name: "AR-15 Stripped Upper Receiver",
                price: 0
            }
        ],
        "lower-receiver": [
            {
                id: "LWR001001",
                meshId: "LWR001001",
                name: "Billet Lower Receiver",
                price: 0
            }
        ],
        "bolt-carrier-group": [
            {
                id: "BCG001001",
                meshId: "BCG001001",
                name: "Lantac Enhanced Bolt Carrier Group, .223 / 5.56mm, Nickel Boron",
                price: 0
            },
            {
                id: "BCG002001",
                meshId: "BCG002001",
                name: "Aero Precision 5.56 Complete Bolt Carrier Group w/ Logo, Black Nitride",
                price: 0
            }
        ],
        "charging-handle": [
            {
                id: "CGH001001",
                meshId: "CGH001001",
                name: "Radian Weapons AR-15 / M16 Raptor-LT Ambidextrous Charging Handle",
                price: 0
            }
        ],
        magazine: [
            {
                id: "MAG001001",
                meshId: "MAG001001",
                name: "Duramag SS 5.56/.223 AR-15 Stainless Steel Magazine, 30 Round",
                price: 0
            }
        ],
        "pistol-grip": [
            {
                id: "PGP001001",
                meshId: "PGP001001",
                name: "Hogue AR-15 Overmolded Beavertail Pistol Grip with Finger Grooves",
                price: 0
            }
        ],
        stock: [
            {
                id: "STK001001",
                meshId: "STK001001",
                name: "B5 Systems Bravo Mil-Spec AR-15 Stock",
                price: 0
            }
        ],
        trigger: [
            {
                id: "TRG001001",
                meshId: "TRG001001",
                name: "Rise Armament High Performance Drop-In Trigger",
                price: 0
            }
        ],
        "safety-selector": [
            {
                id: "SAF001001",
                meshId: "SAF001001",
                name: "Radian Weapons AR-15 / AR-10 Talon 45/90 Ambidextrous Safety Selector 2-Lever Kit",
                price: 0
            }
        ],
        "buffer-system": [
            {
                id: "BUF001001",
                meshId: "BUF001001",
                name: "Mil-Spec Carbine Buffer System",
                price: 0
            }
        ],
        "trigger-guard": [
            {
                id: "TGG001001",
                meshId: "TGG001001",
                name: "Enhanced Trigger Guard",
                price: 0
            }
        ]
    };

    window.getProductsForPart = function (partSlot) {
        return window.PRODUCT_CATALOG[partSlot] || [];
    };

    window.findProductByMeshId = function (meshId) {
        const catalogs = window.PRODUCT_CATALOG;
        let partSlot;
        for (partSlot in catalogs) {
            if (!Object.prototype.hasOwnProperty.call(catalogs, partSlot)) {
                continue;
            }
            const match = catalogs[partSlot].find(function (product) {
                return product.meshId === meshId;
            });
            if (match) {
                return match;
            }
        }
        return null;
    };
})();
