(function () {
    "use strict";

    // Mesh-centric registry — no texture URLs. Commerce fields are placeholders.
    window.MESH_REGISTRY = {
        STK004001: {
            section: "lowerstripped",
            part: "stock",
            material: "stock",
            partSlot: "stock",
            single: false,
            variants: ["black", "coyotebrown", "fde", "grey", "odgreen"],
            competitors: []
        },
        TRG011001: {
            section: "lowerstripped",
            part: "trigger",
            material: "trigger",
            partSlot: "trigger",
            single: false,
            variants: ["black", "silver"],
            competitors: []
        },
        SAF010001: {
            section: "lowerstripped",
            part: "safetyselector",
            material: "safety-selector",
            partSlot: "safety-selector",
            single: false,
            variants: ["black", "fde", "grey", "odgreen"],
            competitors: []
        },
        PGP008001: {
            section: "lowerstripped",
            part: "pistolgrip",
            material: "pistol-grip",
            partSlot: "pistol-grip",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        MAG007001: {
            section: "lowerstripped",
            part: "magazine",
            material: "magazine",
            partSlot: "magazine",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        BCG009001: {
            section: "upperstripped",
            part: "boltcarriergroup",
            material: "bolt-carrier-group",
            partSlot: "bolt-carrier-group",
            single: true,
            variants: null,
            competitors: ["BCG001001"]
        },
        BCG001001: {
            section: "upperstripped",
            part: "boltcarriergroup",
            material: "bolt-carrier-group",
            partSlot: "bolt-carrier-group",
            single: true,
            variants: null,
            competitors: ["BCG009001"]
        },
        BRL002001: {
            section: "upperstripped",
            part: "barrel",
            material: "barrel",
            partSlot: "barrel",
            single: true,
            variants: null,
            competitors: ["BRL003001"]
        },
        BRL003001: {
            section: "upperstripped",
            part: "barrel",
            material: "barrel",
            partSlot: "barrel",
            single: true,
            variants: null,
            competitors: ["BRL002001"]
        },
        CGH010001: {
            section: "upperstripped",
            part: "charginghandle",
            material: "charging-handle",
            partSlot: "charging-handle",
            single: false,
            variants: ["black", "fde", "silver"],
            competitors: []
        },
        UPR006001: {
            section: "upperstripped",
            part: "upperreceiver",
            material: "upper-receiver",
            partSlot: "upper-receiver",
            single: false,
            variants: ["black", "fde"],
            competitors: []
        },
        LWR006001: {
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
        TGG004001: {
            section: "lowerstripped",
            part: "triggerguard",
            material: "trigger-guard",
            partSlot: "trigger-guard",
            single: false,
            variants: ["black", "coyotebrown", "fde", "odgreen", "wolfgrey"],
            competitors: ["TGG005001"]
        },
        TGG005001: {
            section: "lowerstripped",
            part: "triggerguard",
            material: "trigger-guard",
            partSlot: "trigger-guard",
            single: false,
            variants: ["black"],
            competitors: ["TGG004001"]
        }
    };

    // Pre-migration node names not in MESH_REGISTRY (safe to hide; excludes IDs reused globally).
    window.LEGACY_MESH_IDS = [
        "UPR001001",
        "LWR001001",
        "BCG002001",
        "CGH001001",
        "BRL001001",
        "TRG001001",
        "PGP001001",
        "STK001001",
        "SAF001001",
        "MAG001001",
        "TGG001001",
        "TGG002001"
    ];
})();
