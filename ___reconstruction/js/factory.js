app.factory("sharedScope", function($rootScope) {
    var scope = $rootScope.$new(true);
    scope.data = {
        workarea: [{
            name: "Specimen mode",
            papers: [{
                left: 0,
                top: 100,
                width: "100%",
                height: "360px",
                overflow: "hidden",
                fields: [{
                    text: "The quick brown fox jumps over a lazy dog.",
                    fontFamily: "Dosis",
                    fontWeight: 900,
                    fontStyle: "regular",
                    fontSize: 136,
                    lineHeight: 0.8,
                    textAlign: "left",
                    color: "rgb(0,0,0)",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    sliders: [50, 50, 50, 50, 50]
                }]
            }]
        }],
        current: {
            workarea: null,
            paper: null,
            field: null
        },
        sliders: [{
            name: "Boldness",
            edit: true
        }, {
            name: "Serif Size",
            edit: false
        }, {
            name: "Width",
            edit: true
        }, {
            name: "Roundness",
            edit: false
        }, {
            name: "Ascender",
            edit: false
        }]
    };
    return scope;
});

