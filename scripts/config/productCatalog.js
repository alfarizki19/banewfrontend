(function () {
    "use strict";

    // part slug (data-part) → products for that slot.
    window.PRODUCT_CATALOG = {
        "upper-receiver": [
            {
                id: "UPR006001",
                meshId: "UPR006001",
                name: "CMMG Mk4 AR-15 Stripped Upper Receiver",
                price: 0
            }
        ],
        "lower-receiver": [
            {
                id: "LWR006001",
                meshId: "LWR006001",
                name: "CMMG Stripped AR-15 Lower Receiver",
                price: 0
            }
        ],
        "bolt-carrier-group": [
            {
                id: "BCG009001",
                meshId: "BCG009001",
                name: "Lantac Enhanced Bolt Carrier Group, .223 / 5.56mm, Nickel Boron",
                price: 0
            },
            {
                id: "BCG001001",
                meshId: "BCG001001",
                name: "Aero Precision 5.56 Complete Bolt Carrier Group w/ Logo, Black Nitride",
                price: 0
            }
        ],
        "charging-handle": [
            {
                id: "CGH010001",
                meshId: "CGH010001",
                name: "Radian Weapons AR-15 / M16 Raptor-LT Ambidextrous Charging Handle",
                price: 0
            }
        ],
        barrel: [
            {
                id: "BRL002001",
                meshId: "BRL002001",
                name: "Anderson AR-15 16\" 5.56 Barrel, Carbine Gas, 1:8, M4 Contour",
                price: 0
            },
            {
                id: "BRL003001",
                meshId: "BRL003001",
                name: "Ballistic Advantage AR-15 Modern Series 13.7\" 5.56 NATO Barrel, Government Contour, Mid Length",
                price: 0
            },
            {
                id: "BRL003002",
                meshId: "BRL003002",
                name: "Ballistic Advantage Modern Series 10.5\" 5.56 NATO Barrel, Government Profile, Carbine Length",
                price: 0
            },
            {
                id: "BRL006001",
                meshId: "BRL006001",
                name: "CMMG 5.56mm MR 12.5\" Barrel Sub-Assembly, Nitride",
                price: 0
            },
            {
                id: "BRL006002",
                meshId: "BRL006002",
                name: "CMMG 5.56mm MT 18\" Barrel Sub-Assembly, 416 S/S",
                price: 0
            },
            {
                id: "BRL013001",
                meshId: "BRL013001",
                name: "Guntec AR-15 Barrel, 16\" 5.56mm, M4 Contour Carbine Length 1/2-28 Thread",
                price: 0
            },
            {
                id: "BRL003003",
                meshId: "BRL003003",
                name: "Ballistic Advantage Modern Series 14.7\" 5.56 NATO Barrel, Pencil Profile, Mid Length",
                price: 0
            },
            {
                id: "BRL003004",
                meshId: "BRL003004",
                name: "Ballistic Advantage Modern Series 16\" 5.56 NATO Barrel, Pencil Profile, Mid Length",
                price: 0
            }
        ],
        magazine: [
            {
                id: "MAG007001",
                meshId: "MAG007001",
                name: "Duramag SS 5.56/.223 AR-15 Stainless Steel Magazine, 30 Round",
                price: 0
            }
        ],
        "pistol-grip": [
            {
                id: "PGP008001",
                meshId: "PGP008001",
                name: "Hogue AR-15 Overmolded Beavertail Pistol Grip with Finger Grooves",
                price: 0
            }
        ],
        stock: [
            {
                id: "STK004001",
                meshId: "STK004001",
                name: "B5 Systems Bravo Mil-Spec AR-15 Stock",
                price: 0
            }
        ],
        trigger: [
            {
                id: "TRG011001",
                meshId: "TRG011001",
                name: "Rise Armament High Performance Drop-In Trigger",
                price: 0
            }
        ],
        "safety-selector": [
            {
                id: "SAF010001",
                meshId: "SAF010001",
                name: "Radian Weapons AR-15 / AR-10 Talon 45/90 Ambidextrous Safety Selector 2-Lever Kit",
                price: 0
            }
        ],
        "buffer-system": [
            {
                id: "BUF001001",
                meshId: "BUF001001",
                name: "Aero Precision AR-15 Carbine Buffer Kit",
                price: 0
            }
        ],
        "trigger-guard": [
            {
                id: "TGG004001",
                meshId: "TGG004001",
                name: "B5 Systems Reinforced Polymer AR-15 Trigger Guard",
                price: 0
            },
            {
                id: "TGG005001",
                meshId: "TGG005001",
                name: "Bushmaster AR-15 Trigger Guard Assembly",
                price: 0
            }
        ],
        "takedown-pin": [
            {
                id: "TDP001001",
                meshId: "TDP001001",
                name: "Aero Precision AR15 EZ Install Pivot/Takedown Pin Set",
                price: 0
            },
            {
                id: "TDP006001",
                meshId: "TDP006001",
                name: "CMMG AR-15 HD Pivot And Takedown Pins Kit",
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
