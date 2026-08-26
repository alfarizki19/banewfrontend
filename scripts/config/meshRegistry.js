(function () {
    "use strict";

    // Mesh-centric registry — no texture URLs. Commerce fields are placeholders.
    window.MESH_REGISTRY = {
        STK001001: {
            section: "lowerstripped",
            part: "stock",
            material: "stock",
            partSlot: "stock",
            single: false,
            variants: ["black", "coyotebrown", "fde", "grey", "odgreen"],
            competitors: []
        },
        TRG001001: {
            section: "lowerstripped",
            part: "trigger",
            material: "trigger",
            partSlot: "trigger",
            single: false,
            variants: ["black", "silver"],
            competitors: []
        },
        SAF001001: {
            section: "lowerstripped",
            part: "safetyselector",
            material: "safety-selector",
            partSlot: "safety-selector",
            single: false,
            variants: ["black", "fde", "grey", "odgreen"],
            competitors: []
        },
        PGP001001: {
            section: "lowerstripped",
            part: "pistolgrip",
            material: "pistol-grip",
            partSlot: "pistol-grip",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        MAG001001: {
            section: "lowerstripped",
            part: "magazine",
            material: "magazine",
            partSlot: "magazine",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        BCG001001: {
            section: "upperstripped",
            part: "boltcarriergroup",
            material: "bolt-carrier-group",
            partSlot: "bolt-carrier-group",
            single: true,
            variants: null,
            competitors: ["BCG002001"]
        },
        BCG002001: {
            section: "upperstripped",
            part: "boltcarriergroup",
            material: "bolt-carrier-group",
            partSlot: "bolt-carrier-group",
            single: true,
            variants: null,
            competitors: ["BCG001001"]
        },
        CGH001001: {
            section: "upperstripped",
            part: "charginghandle",
            material: "charging-handle",
            partSlot: "charging-handle",
            single: false,
            variants: ["black", "fde", "silver"],
            competitors: []
        },
        UPR001001: {
            section: "upperstripped",
            part: "upperreceiver",
            material: "upper-receiver",
            partSlot: "upper-receiver",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        LWR001001: {
            section: "lowerstripped",
            part: "lowerreceiver",
            material: "lower-receiver",
            partSlot: "lower-receiver",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        BUF001001: {
            section: "lowerstripped",
            part: "buffersystems",
            material: "buffer-systems",
            partSlot: "buffer-system",
            single: true,
            variants: null,
            competitors: []
        },
        TGG001001: {
            section: "lowerstripped",
            part: "triggerguard",
            material: "trigger-guard",
            partSlot: "trigger-guard",
            single: false,
            variants: ["black", "coyotebrown", "fde", "odgreen", "wolfgrey"],
            competitors: []
        }
    };
})();
