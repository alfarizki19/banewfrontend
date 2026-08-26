(function () {
    "use strict";

    // Slug → display label + swatch hex (UX mockup + mesh-specific slugs).
    window.VARIANT_CATALOG = {
        black: { label: "Black", hex: "#1D1F20" },
        coyotebrown: { label: "Coyote Brown", hex: "#9A7B4F" },
        fde: { label: "FDE", hex: "#8A755B" },
        grey: { label: "Grey", hex: "#666C70" },
        wolfgrey: { label: "Wolf Grey", hex: "#7A8085" },
        odgreen: { label: "OD Green", hex: "#59604A" },
        silver: { label: "Silver", hex: "#9CA3A7" }
    };

    window.getVariantDisplay = function (slug) {
        const entry = window.VARIANT_CATALOG[slug];
        if (!entry) {
            return null;
        }
        return {
            slug: slug,
            label: entry.label,
            hex: entry.hex
        };
    };

    window.getVariantsForMesh = function (meshId) {
        const mesh = window.MESH_REGISTRY && window.MESH_REGISTRY[meshId];
        if (!mesh || mesh.single || !mesh.variants || !mesh.variants.length) {
            return [];
        }
        return mesh.variants
            .map(function (slug) {
                return window.getVariantDisplay(slug);
            })
            .filter(Boolean);
    };
})();
