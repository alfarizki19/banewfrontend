// Sketchfab Viewer API wrapper — show/hide nodes by mesh name (Mesh ID).
(function () {
    "use strict";

    let apiGlobal = null;
    let apiReady = false;

    function initSketchfab(api) {
        apiGlobal = api;
        apiReady = true;
        window.sketchfabAPIReady = true;
    }

    function getNodeInstancesByName(nodeName, cb) {
        if (!apiGlobal) {
            cb(new Error("Sketchfab API not initialized"), null);
            return;
        }

        apiGlobal.getNodeMap(function (err, nodes) {
            if (err) {
                cb(err, null);
                return;
            }

            const allNodes = Object.values(nodes);
            const query = String(nodeName).toLowerCase();

            const exactInstanceIDs = allNodes
                .filter(function (n) {
                    return n && n.name === nodeName;
                })
                .map(function (n) {
                    return n.instanceID;
                })
                .filter(Boolean);

            const fallbackInstanceIDs = exactInstanceIDs.length
                ? []
                : allNodes
                      .filter(function (n) {
                          return (
                              n &&
                              typeof n.name === "string" &&
                              n.name.toLowerCase().includes(query)
                          );
                      })
                      .map(function (n) {
                          return n.instanceID;
                      })
                      .filter(Boolean);

            const instanceIDs = exactInstanceIDs.length
                ? exactInstanceIDs
                : fallbackInstanceIDs;
            cb(null, instanceIDs);
        });
    }

    function showNodeByName(nodeName) {
        return new Promise(function (resolve) {
            if (!apiGlobal) {
                resolve(false);
                return;
            }

            getNodeInstancesByName(nodeName, function (err, instanceIDs) {
                if (err || !instanceIDs || instanceIDs.length === 0) {
                    console.warn(
                        '[Sketchfab] No nodes match "' + nodeName + '" (show).',
                        err
                    );
                    resolve(false);
                    return;
                }

                try {
                    instanceIDs.forEach(function (instanceID) {
                        apiGlobal.show(instanceID);
                    });
                    resolve(true);
                } catch (e) {
                    console.error("[Sketchfab] show() failed:", e);
                    resolve(false);
                }
            });
        });
    }

    function hideNodeByName(nodeName) {
        return new Promise(function (resolve) {
            if (!apiGlobal) {
                resolve(false);
                return;
            }

            getNodeInstancesByName(nodeName, function (err, instanceIDs) {
                if (err || !instanceIDs || instanceIDs.length === 0) {
                    console.warn(
                        '[Sketchfab] No nodes match "' + nodeName + '" (hide).',
                        err
                    );
                    resolve(false);
                    return;
                }

                try {
                    instanceIDs.forEach(function (instanceID) {
                        apiGlobal.hide(instanceID);
                    });
                    resolve(true);
                } catch (e) {
                    console.error("[Sketchfab] hide() failed:", e);
                    resolve(false);
                }
            });
        });
    }

    function debugNodeMatches(nodeName, attempt) {
        const maxAttempts = 30;
        const currentAttempt = attempt || 0;

        if (!apiGlobal) {
            if (currentAttempt < maxAttempts) {
                setTimeout(function () {
                    debugNodeMatches(nodeName, currentAttempt + 1);
                }, 200);
                return;
            }
            console.warn(
                "[Sketchfab] debugNodeMatches(): API not initialized (timed out)"
            );
            return;
        }

        const query = String(nodeName).toLowerCase();
        apiGlobal.getNodeMap(function (err, nodes) {
            if (err) {
                console.error("[Sketchfab] debugNodeMatches(): getNodeMap failed:", err);
                return;
            }

            const allNodes = Object.values(nodes).filter(function (n) {
                return n && typeof n.name === "string";
            });

            const exact = allNodes.filter(function (n) {
                return n.name === nodeName;
            });
            const list = exact.length
                ? exact
                : allNodes.filter(function (n) {
                      return n.name.toLowerCase().includes(query);
                  });

            console.log(
                '[Sketchfab] debugNodeMatches("' + nodeName + '"): found ' +
                    list.length +
                    " nodes",
                list.map(function (n) {
                    return { name: n.name, instanceID: n.instanceID };
                })
            );
        });
    }

    window.sketchfabAPI = {
        get api() {
            return apiGlobal;
        },
        get ready() {
            return apiReady;
        },
        initSketchfab: initSketchfab,
        showNodeByName: showNodeByName,
        hideNodeByName: hideNodeByName,
        debugNodeMatches: debugNodeMatches
    };
})();
