app.controller('toolsController', function($scope, sharedScope) {
    $scope.shared = sharedScope.data;

    $scope.shared.current.workarea = $scope.shared.workareas[0];
    $scope.shared.current.paper = $scope.shared.current.workarea.papers[0];
    $scope.shared.current.field = $scope.shared.current.paper.fields[0];

    $scope.favourites = [];
    $scope.relatedFonts = [];
    $scope.foundFont = [];
    $scope.foundMore = "";
    $scope.search = "";
    
    $scope.screenModes = [{
        workareas : 1,
        width: 1,
        height: 1,
        title: "Specimen Mode"
    },{
        workareas : 2,
        width: 2,
        height: 1,
        title: "Compare(2) Mode"
    },{
        workareas : 4,
        width: 2,
        height: 2,
        title: "Compare(4) Mode"
    }];
    $scope.changeMode = function (x) {
        $scope.nrOfWorkareas = $scope.screenModes[x].workareas;
        $scope.width = $scope.screenModes[x].width;
        $scope.height = $scope.screenModes[x].height;
        $scope.currentScreenMode = $scope.screenModes[x];
    };
    $scope.currentScreenMode = null;
    $scope.nrOfWorkareas = null;
    $scope.width = null;
    $scope.height = null;
    $scope.changeMode(2);


    $scope.category = ["Sans Serif", "Serif", "Slab Serif", "Monospace", "Script", "Fun"];
    $scope.style = ["Normal", "Italic"];
    $scope.align = ["left", "center", "right"];
    $scope.cmyk = ["C", "M", "Y", "K"];
    $scope.shared.settings = {
        category : $scope.category[0],
        style : $scope.style[0],
        totalFonts : null,
        dropdown : {
            category : false,
            style : false,
            workarea : false,
            color : false,
            favourites : null,
            related : null,
            search : null
        }
    };
    
    $scope.removeField = function () {
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field, index) {
                    if (field.fieldId == fieldId) {
                        paper.fields.splice(index, 1);
                    }
                });
            });    
        }); 
    };
    
    $scope.countFonts = function () {
        var n = 0;
        angular.forEach($scope.font, function(font) {
            if (font[3] == $scope.shared.settings.category && font[10] == $scope.shared.settings.style && font[12] == "google") {
               n++;
            }
        });  
        return n; 
    };

    $scope.setFont = function(field, id) {
        var font = $scope.font[id];
        var fontFamily = font[0];
        var fontWeight = font[9];
        var fontStyle = font[10];
        WebFont.load({
            google : {
                families : [fontFamily + ":" + fontWeight + fontStyle.toLowerCase()]
            },
            loading : function() {
            },
            active : function() {
                field.fontFamily = fontFamily;
                field.fontWeight = fontWeight;
                field.fontStyle = fontStyle;
                field.id = id;
                field.correctedSize = $scope.correctSize(field.fontSize, font[2]);
                $scope.shared.settings.category = font[3];
                $scope.shared.settings.style = fontStyle;
                field.sliders = [font[4], font[5], font[6], font[7], font[8]];
                $scope.findRelated(id);
                for (var x in $scope.shared.settings.dropdown) {
                    $scope.shared.settings.dropdown[x] = false;
                }
                $scope.shared.settings.totalFonts = $scope.countFonts();
                $scope.$apply();
            },
            inactive : function() {
            }
        });
    };
    
    
    $scope.correctSize = function (wantedSize, measuredSize) {
        var size = Math.round (wantedSize * 700 / measuredSize);
        return size;
    };
    
    $scope.findFieldId = function () {
        var max = 0;
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId > max) {
                        max = field.fieldId;
                    }
                });
            });    
        }); 
        max++;
        return max;    
    };
    
    $scope.addField = function () {
        var fieldId = $scope.shared.current.field.fieldId; 
        var newField = {
            fieldId: $scope.findFieldId(),
            text : "Bright vixens jump @ dozy fowl! #quack",
            fontFamily : null,
            fontWeight : null,
            id : 1119,
            fontStyle : "regular",
            fontSize : 20,
            correctedSize: null,
            lineHeight : 50,
            textAlign : "left",
            color : "rgb(0,0,0)",
            cmyk : [0, 0, 0, 100],
            left : 200,
            top : 200,
            width : 200,
            height : 400,
            sliders : [50, 50, 50, 50, 50]
        };
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                var clone = angular.copy(newField);
                paper.fields.push(clone);
                $scope.setFont(clone, clone.id);
            });    
        }); 
        var last = $scope.shared.current.paper.fields.length - 1;
        $scope.shared.current.field = $scope.shared.current.paper.fields[last];
    };
    
    $scope.changePaper = function (width, height) {
        var padding = 10;
        var newWidth = width / ($("framework").outerWidth() - 2 * padding) * 100 + "%";
        var newHeight = height / ($("framework").outerHeight() - 2 * padding) * 100 + "%";
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                paper.width = newWidth;
                paper.height = newHeight;
            });    
        }); 
    };
    
    $scope.changeBox = function (left, top, width, height) {
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId == fieldId) {
                        field.left = left * $scope.width;
                        field.top = top * $scope.width;
                        field.width = width * $scope.width;
                        field.height = height * $scope.width;
                    }
                });
            });    
        }); 
    };
    
    $scope.changeText = function (value) {
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId == fieldId && field != $scope.shared.current.field) {
                        field.text = value;
                    }
                });
            });    
        }); 
    };
    
    $scope.changeAlign = function (value) {
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId == fieldId) {
                        field.textAlign = value;
                    }
                });
            });    
        }); 
    };
    
    $scope.changeFontSize = function (value) {
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId == fieldId) {
                        field.fontSize = value;
                        field.correctedSize = $scope.correctSize(value, $scope.font[field.id][2]);
                    }
                });
            });    
        }); 
    };
    
    $scope.changeLineHeight = function (value) {
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId == fieldId) {
                        field.lineHeight = value;
                    }
                });
            });    
        }); 
    };
    
    $scope.setCurrentField = function (field, paper) {
        var font = $scope.font[field.id];
        $scope.shared.current.field = field;
        $scope.shared.current.paper = paper;
        $scope.shared.settings.category = font[3];
        $scope.shared.settings.style = font[10];  
        field.sliders = [font[4], font[5], font[6], font[7], font[8]];
        $scope.shared.settings.totalFonts = $scope.countFonts();
    };

    $scope.searchFont = function() {
        $scope.foundFont = [];
        $scope.foundMore = "";
        var j = 0;
        var search = $scope.search.toLowerCase();
        if (search.length > 0) {
            for (var i = 1; i < $scope.font.length; i++) {
                if ($scope.font[i][12] == "google") {
                    needle = $scope.font[i][0].toLowerCase();
                    if (needle.indexOf(search) > -1) {
                        if (j < 15) {
                            $scope.foundFont.push({
                                string : $scope.makeFontString(i),
                                id : i
                            });
                        }
                        j++;
                    }
                }
            }
        }
        if (j > 14) {
            $scope.foundMore = "... and " + j + " more fonts";
        }
    };
    
    $scope.addFavourite = function () {
        var id = $scope.shared.current.field.id;
        var found = false;
        angular.forEach($scope.favourites, function(favourite) {
            if (favourite.id == id) {
                found = true;
            }
        });
        if (found) {
            //$scope.message("Font already favourited");
        } else {
            $scope.favourites.push({
                id: id,
                string: $scope.makeFontString(id)
            });
            $("#favourites-head").addClass("highlighted");
            setTimeout(function(){ $("#favourites-head").removeClass("highlighted"); }, 300);
        }
    };

    $scope.shared.openDropdown = function(type) {
        for (var x in $scope.shared.settings.dropdown) {
            if (x != type) {
                $scope.shared.settings.dropdown[x] = false;
            }
        }
        $scope.shared.settings.dropdown[type] = !$scope.shared.settings.dropdown[type];
    };

    $scope.shared.changeWorkarea = function(workarea) {
        $scope.shared.current.workarea = workarea;
        $scope.shared.current.paper = $scope.shared.current.workarea.papers[0];
        $scope.shared.current.field = $scope.shared.current.paper.fields[0];
        $scope.shared.settings.dropdown.workarea = false;
    };

    $scope.changeCategory = function(category) {
        $scope.shared.settings.category = category;
        $scope.shared.findFont();
        $scope.shared.settings.dropdown.category = false;
    };

    $scope.changeStyle = function(style) {
        $scope.shared.settings.style = style;
        $scope.shared.findFont();
        $scope.shared.settings.dropdown.style = false;
    };

    $scope.updateColor = function() {
        var c = $scope.shared.current.field.cmyk[0];
        var m = $scope.shared.current.field.cmyk[1];
        var y = $scope.shared.current.field.cmyk[2];
        var k = $scope.shared.current.field.cmyk[3];
        c /= 100;
        m /= 100;
        y /= 100;
        k /= 100;
        var r = Math.round(255 * (1 - c) * (1 - k));
        var g = Math.round(255 * (1 - m) * (1 - k));
        var b = Math.round(255 * (1 - y) * (1 - k));

        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        if (r.length == 1) {
            r = "0" + r;
        }
        if (g.length == 1) {
            g = "0" + g;
        }
        if (b.length == 1) {
            b = "0" + b;
        }

        var color = "#" + r + g + b;
        var fieldId = $scope.shared.current.field.fieldId; 
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    if (field.fieldId == fieldId) {
                        field.color = color;
                    }
                });
            });    
        });
    };

    $scope.makeFontString = function(id) {
        var italic = "";
        if ($scope.font[id][10] != "Normal") {
            italic = " " + $scope.font[id][10];
        }
        var string = $scope.font[id][0] + " " + $scope.font[id][9] + italic;
        return string;
    };

    $scope.findRelated = function(id) {
        $scope.relatedFonts = [];
        for (var i = 1; i < $scope.font.length; i++) {
            var thisFont = $scope.font[i];
            if (thisFont[0] == $scope.font[id][0] && id != i && thisFont[12] == "google") {
                $scope.relatedFonts.push({
                    string : $scope.makeFontString(i),
                    weight : $scope.font[i][9],
                    id : i
                });
                ;
            }
        }
    };

    $scope.shared.findFont = function() {
        var differenceArray = [];
        for (var i = 1; i < $scope.font.length; i++) {
            var thisFont = $scope.font[i];
            if (thisFont[3] == $scope.shared.settings.category && thisFont[10] == $scope.shared.settings.style && thisFont[12] == "google") {
                var difference = 0;
                for ( j = 0; j < 5; j++) {
                    if ($scope.shared.sliders[j].edit) {
                        var property = anti_normal($scope.shared.current.field.sliders[j]);
                        difference += Math.abs(thisFont[j + 4] - property);
                    }
                }
                differenceArray[i] = new Array(i, difference);
            }
        }
        differenceArray.sort(function(a, b) {
            return a[1] - b[1];
        });
        var fontId = differenceArray[0][0];
        $scope.setFont($scope.shared.current.field, fontId);
    };
    
    $scope.init = function () {
        angular.forEach($scope.shared.workareas, function(workarea) {
            angular.forEach(workarea.papers, function(paper) {
                angular.forEach(paper.fields, function(field) {
                    $scope.setFont(field, field.id);
                    field.width = 0.8 * $("workarea").outerWidth();
                    field.height = 0.8 * $("workarea").outerHeight();
                });
            });    
        });    
    };

    function anti_normal(x) {
        var y = x + 12 * Math.sin(x / 15.71);
        return y;
    }

    /********** font array **********/

    $scope.font = [];
    $scope.font[0] = ['...', '-', 0, '-', 50, 50, 50, 50, 50, '-', '-', '-', '-'];
    $scope.font[1] = ['ABeeZee', 'ABeeZee-Italic.ttf', 278, 'Sans Serif', 25, 0, 53, 46, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/ABeeZee', 'google'];
    $scope.font[2] = ['ABeeZee', 'ABeeZee-Regular.ttf', 278, 'Sans Serif', 25, 0, 53, 45, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/ABeeZee', 'google'];
    $scope.font[3] = ['Abel', 'Abel-Regular.ttf', 267, 'Sans Serif', 17, 0, 38, 25, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Abel', 'google'];
    $scope.font[4] = ['Abril Fatface', 'AbrilFatface-Regular.ttf', 254, 'Serif', 66, 48, 48, 66, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Abril Fatface', 'google'];
    $scope.font[5] = ['Aclonica', 'Aclonica.ttf', 301, 'Sans Serif', 45, 2, 59, 48, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Aclonica', 'google'];
    $scope.font[6] = ['Acme', 'Acme-Regular.ttf', 272, 'Sans Serif', 34, 20, 41, 36, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Acme', 'google'];
    $scope.font[7] = ['Actor', 'Actor-Regular.ttf', 274, 'Sans Serif', 22, 0, 47, 44, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Actor', 'google'];
    $scope.font[8] = ['Adamina', 'Adamina-Regular.ttf', 298, 'Serif', 14, 63, 32, 27, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Adamina', 'google'];
    $scope.font[9] = ['Advent Pro', 'AdventPro-Bold.ttf', 268, 'Sans Serif', 33, 0, 44, 30, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[10] = ['Advent Pro', 'AdventPro-ExtraLight.ttf', 268, 'Sans Serif', 7, 0, 41, 30, 19, 200, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[11] = ['Advent Pro', 'AdventPro-Light.ttf', 268, 'Sans Serif', 11, 0, 41, 30, 19, 300, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[12] = ['Advent Pro', 'AdventPro-Medium.ttf', 268, 'Sans Serif', 20, 2, 42, 30, 19, 500, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[13] = ['Advent Pro', 'AdventPro-Regular.ttf', 268, 'Sans Serif', 15, 0, 42, 30, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[14] = ['Advent Pro', 'AdventPro-SemiBold.ttf', 268, 'Sans Serif', 27, 0, 43, 30, 19, 600, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[15] = ['Advent Pro', 'AdventPro-Thin.ttf', 268, 'Sans Serif', 3, 0, 40, 30, 19, 100, 'Normal', 'http://www.google.com/fonts/specimen/Advent Pro', 'google'];
    $scope.font[16] = ['Aguafina Script', 'AguafinaScript-Regular.ttf', 239, 'Script', 13, 19, 7, 21, 52, 400, 'Normal', 'http://www.google.com/fonts/specimen/Aguafina Script', 'google'];
    $scope.font[17] = ['Akronim', 'Akronim-Regular.ttf', 259, 'Fun', 23, 0, 18, 27, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Akronim', 'google'];
    $scope.font[18] = ['Aladin', 'Aladin-Regular.ttf', 253, 'Fun', 21, 13, 20, 34, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Aladin', 'google'];
    $scope.font[19] = ['Aldrich', 'Aldrich-Regular.ttf', 278, 'Fun', 18, 0, 37, 33, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Aldrich', 'google'];
    $scope.font[20] = ['Alef', 'Alef-Bold.ttf', 271, 'Sans Serif', 39, 0, 60, 46, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Alef', 'google'];
    $scope.font[21] = ['Alef', 'Alef-Regular.ttf', 271, 'Sans Serif', 24, 0, 53, 39, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alef', 'google'];
    $scope.font[22] = ['Alegreya', 'Alegreya-Black.ttf', 264, 'Serif', 57, 45, 30, 54, 29, 900, 'Normal', 'http://www.google.com/fonts/specimen/Alegreya', 'google'];
    $scope.font[23] = ['Alegreya', 'Alegreya-BlackItalic.ttf', 258, 'Serif', 53, 42, 27, 45, 35, 900, 'Italic', 'http://www.google.com/fonts/specimen/Alegreya', 'google'];
    $scope.font[24] = ['Alegreya', 'Alegreya-Bold.ttf', 259, 'Serif', 32, 50, 30, 51, 35, 700, 'Normal', 'http://www.google.com/fonts/specimen/Alegreya', 'google'];
    $scope.font[25] = ['Alegreya', 'Alegreya-BoldItalic.ttf', 252, 'Serif', 28, 42, 24, 31, 39, 700, 'Italic', 'http://www.google.com/fonts/specimen/Alegreya', 'google'];
    $scope.font[26] = ['Alegreya', 'Alegreya-Italic.ttf', 248, 'Serif', 4, 50, 20, 19, 42, 400, 'Italic', 'http://www.google.com/fonts/specimen/Alegreya', 'google'];
    $scope.font[27] = ['Alegreya', 'Alegreya-Regular.ttf', 255, 'Serif', 8, 54, 30, 46, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alegreya', 'google'];
    $scope.font[28] = ['Alegreya SC', 'AlegreyaSC-Black.ttf', 273, 'All Caps', 44, 28, 52, 56, 12, 900, 'Normal', 'http://www.google.com/fonts/specimen/Alegreya SC', 'google'];
    $scope.font[29] = ['Alegreya SC', 'AlegreyaSC-BlackItalic.ttf', 273, 'All Caps', 47, 25, 50, 54, 12, 900, 'Italic', 'http://www.google.com/fonts/specimen/Alegreya SC', 'google'];
    $scope.font[30] = ['Alegreya SC', 'AlegreyaSC-Bold.ttf', 274, 'All Caps', 29, 32, 51, 55, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Alegreya SC', 'google'];
    $scope.font[31] = ['Alegreya SC', 'AlegreyaSC-BoldItalic.ttf', 274, 'All Caps', 29, 31, 49, 54, 12, 700, 'Italic', 'http://www.google.com/fonts/specimen/Alegreya SC', 'google'];
    $scope.font[32] = ['Alegreya SC', 'AlegreyaSC-Italic.ttf', 275, 'All Caps', 15, 35, 49, 51, 12, 400, 'Italic', 'http://www.google.com/fonts/specimen/Alegreya SC', 'google'];
    $scope.font[33] = ['Alegreya SC', 'AlegreyaSC-Regular.ttf', 275, 'All Caps', 16, 36, 51, 54, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alegreya SC', 'google'];
    $scope.font[34] = ['Alex Brush', 'AlexBrush-Regular.ttf', 167, 'Script', 23, 11, 40, 37, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alex Brush', 'google'];
    $scope.font[35] = ['Alfa Slab One', 'AlfaSlabOne-Regular.ttf', 296, 'Slab Serif', 81, 12, 59, 50, 10, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alfa Slab One', 'google'];
    $scope.font[36] = ['Alice', 'Alice-Regular.ttf', 253, 'Serif', 19, 65, 43, 61, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alice', 'google'];
    $scope.font[37] = ['Alike', 'Alike-Regular.ttf', 275, 'Serif', 21, 55, 35, 43, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Alike', 'google'];
    $scope.font[38] = ['Allan', 'Allan-Bold.ttf', 281, 'Script', 21, 0, 5, 15, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Allan', 'google'];
    $scope.font[39] = ['Allan', 'Allan-Regular.ttf', 271, 'Script', 10, 2, 3, 12, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Allan', 'google'];
    $scope.font[40] = ['Allerta', 'Allerta-Regular.ttf', 294, 'Sans Serif', 32, 0, 55, 39, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Allerta', 'google'];
    $scope.font[41] = ['Allerta Stencil', 'AllertaStencil-Regular.ttf', 294, 'Sans Serif', 32, 0, 55, 39, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Allerta Stencil', 'google'];
    $scope.font[42] = ['Allura', 'Allura-Regular.ttf', 161, 'Script', 23, 20, 48, 52, 49, 400, 'Normal', 'http://www.google.com/fonts/specimen/Allura', 'google'];
    $scope.font[43] = ['Almendra', 'Almendra-Bold.ttf', 275, 'Fun', 31, 35, 29, 34, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Almendra', 'google'];
    $scope.font[44] = ['Almendra', 'Almendra-BoldItalic.ttf', 278, 'Fun', 29, 22, 23, 27, 22, 700, 'Italic', 'http://www.google.com/fonts/specimen/Almendra', 'google'];
    $scope.font[45] = ['Almendra', 'Almendra-Italic.ttf', 267, 'Fun', 13, 25, 22, 21, 25, 400, 'Italic', 'http://www.google.com/fonts/specimen/Almendra', 'google'];
    $scope.font[46] = ['Almendra', 'Almendra-Regular.ttf', 264, 'Serif', 10, 57, 25, 27, 32, 400, 'Normal', 'http://www.google.com/fonts/specimen/Almendra', 'google'];
    $scope.font[47] = ['Almendra Display', 'AlmendraDisplay-Regular.ttf', 259, 'Fun', 0, 20, 29, 27, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Almendra Display', 'google'];
    $scope.font[48] = ['Almendra SC', 'AlmendraSC-Bold.ttf', 298, 'All Caps', 34, 26, 46, 45, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Almendra SC', 'google'];
    $scope.font[49] = ['Almendra SC', 'AlmendraSC-BoldItalic.ttf', 302, 'All Caps', 32, 17, 40, 39, 12, 700, 'Italic', 'http://www.google.com/fonts/specimen/Almendra SC', 'google'];
    $scope.font[50] = ['Almendra SC', 'AlmendraSC-Italic.ttf', 291, 'All Caps', 13, 24, 35, 32, 12, 400, 'Italic', 'http://www.google.com/fonts/specimen/Almendra SC', 'google'];
    $scope.font[51] = ['Almendra SC', 'AlmendraSC-Regular.ttf', 287, 'All Caps', 16, 41, 45, 40, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Almendra SC', 'google'];
    $scope.font[52] = ['Amarante', 'Amarante-Regular.ttf', 263, 'Serif', 24, 29, 33, 30, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Amarante', 'google'];
    $scope.font[53] = ['Amaranth', 'Amaranth-Bold.ttf', 270, 'Sans Serif', 48, 68, 49, 43, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Amaranth', 'google'];
    $scope.font[54] = ['Amaranth', 'Amaranth-BoldItalic.ttf', 265, 'Sans Serif', 48, 73, 48, 42, 24, 700, 'Italic', 'http://www.google.com/fonts/specimen/Amaranth', 'google'];
    $scope.font[55] = ['Amaranth', 'Amaranth-Italic.ttf', 264, 'Sans Serif', 34, 82, 47, 41, 25, 400, 'Italic', 'http://www.google.com/fonts/specimen/Amaranth', 'google'];
    $scope.font[56] = ['Amaranth', 'Amaranth-Regular.ttf', 267, 'Sans Serif', 34, 61, 48, 42, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Amaranth', 'google'];
    $scope.font[57] = ['Amatic SC', 'AmaticSC-Bold.ttf', 349, 'Fun', 6, 24, 0, 1, 2, 700, 'Normal', 'http://www.google.com/fonts/specimen/Amatic SC', 'google'];
    $scope.font[58] = ['Amatic SC', 'AmaticSC-Regular.ttf', 352, 'Fun', 2, 23, 0, 0, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Amatic SC', 'google'];
    $scope.font[59] = ['Amethysta', 'Amethysta-Regular.ttf', 273, 'Serif', 15, 74, 43, 40, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Amethysta', 'google'];
    $scope.font[60] = ['Anaheim', 'Anaheim-Regular.ttf', 257, 'Monospace', 23, 19, 0, 25, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Anaheim', 'google'];
    $scope.font[61] = ['Andada', 'Andada-Bold.ttf', 272, 'Slab Serif', 52, 48, 50, 49, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Andada', 'google'];
    $scope.font[62] = ['Andada', 'Andada-BoldItalic.ttf', 282, 'Slab Serif', 46, 19, 38, 33, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Andada', 'google'];
    $scope.font[63] = ['Andada', 'Andada-Italic.ttf', 277, 'Slab Serif', 24, 24, 35, 26, 23, 400, 'Italic', 'http://www.google.com/fonts/specimen/Andada', 'google'];
    $scope.font[64] = ['Andada', 'Andada-Regular.ttf', 269, 'Slab Serif', 27, 61, 49, 44, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Andada', 'google'];
    $scope.font[65] = ['Andika', 'Andika-R.ttf', 265, 'Sans Serif', 26, 14, 56, 43, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Andika', 'google'];
    $scope.font[66] = ['Annie Use Your Telescope', 'AnnieUseYourTelescope.ttf', 204, 'Fun', 11, 0, 32, 36, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Annie Use Your Telescope', 'google'];
    $scope.font[67] = ['Anonymous Pro', 'AnonymousPro-Bold.ttf', 243, 'Monospace', 57, 28, 49, 69, 31, 700, 'Normal', 'http://www.google.com/fonts/specimen/Anonymous Pro', 'google'];
    $scope.font[68] = ['Anonymous Pro', 'AnonymousPro-BoldItalic.ttf', 243, 'Monospace', 58, 28, 49, 72, 31, 700, 'Italic', 'http://www.google.com/fonts/specimen/Anonymous Pro', 'google'];
    $scope.font[69] = ['Anonymous Pro', 'AnonymousPro-Italic.ttf', 243, 'Monospace', 30, 28, 49, 72, 31, 400, 'Italic', 'http://www.google.com/fonts/specimen/Anonymous Pro', 'google'];
    $scope.font[70] = ['Anonymous Pro', 'AnonymousPro-Regular.ttf', 243, 'Monospace', 29, 28, 49, 69, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Anonymous Pro', 'google'];
    $scope.font[71] = ['Antic', 'Antic-Regular.ttf', 270, 'Sans Serif', 17, 0, 49, 46, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Antic', 'google'];
    $scope.font[72] = ['Antic Didone', 'AnticDidone-Regular.ttf', 268, 'Serif', 6, 55, 43, 46, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Antic Didone', 'google'];
    $scope.font[73] = ['Antic Slab', 'AnticSlab-Regular.ttf', 267, 'Slab Serif', 21, 42, 58, 49, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Antic Slab', 'google'];
    $scope.font[74] = ['Anton', 'Anton.ttf', 391, 'Sans Serif', 36, 0, 22, 8, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/Anton', 'google'];
    $scope.font[75] = ['Arapey', 'Arapey-Italic.ttf', 239, 'Serif', 7, 36, 31, 42, 28, 400, 'Italic', 'http://www.google.com/fonts/specimen/Arapey', 'google'];
    $scope.font[76] = ['Arapey', 'Arapey-Regular.ttf', 234, 'Serif', 13, 59, 36, 58, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Arapey', 'google'];
    $scope.font[77] = ['Arbutus', 'Arbutus-Regular.ttf', 281, 'Fun', 37, 46, 54, 50, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Arbutus', 'google'];
    $scope.font[78] = ['Arbutus Slab', 'ArbutusSlab-Regular.ttf', 270, 'Serif', 24, 60, 46, 45, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Arbutus Slab', 'google'];
    $scope.font[79] = ['Architects Daughter', 'ArchitectsDaughter.ttf', 242, 'Fun', 16, 2, 44, 56, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Architects Daughter', 'google'];
    $scope.font[80] = ['Archivo Black', 'ArchivoBlack-Regular.ttf', 281, 'Sans Serif', 59, 0, 66, 53, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Archivo Black', 'google'];
    $scope.font[81] = ['Archivo Narrow', 'ArchivoNarrow-Bold.ttf', 280, 'Sans Serif', 34, 0, 40, 31, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Archivo Narrow', 'google'];
    $scope.font[82] = ['Archivo Narrow', 'ArchivoNarrow-BoldItalic.ttf', 280, 'Sans Serif', 34, 0, 40, 31, 18, 700, 'Italic', 'http://www.google.com/fonts/specimen/Archivo Narrow', 'google'];
    $scope.font[83] = ['Archivo Narrow', 'ArchivoNarrow-Italic.ttf', 280, 'Sans Serif', 22, 2, 34, 27, 18, 400, 'Italic', 'http://www.google.com/fonts/specimen/Archivo Narrow', 'google'];
    $scope.font[84] = ['Archivo Narrow', 'ArchivoNarrow-Regular.ttf', 280, 'Sans Serif', 23, 0, 34, 26, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Archivo Narrow', 'google'];
    $scope.font[85] = ['Arimo', 'Arimo-Bold.ttf', 282, 'Sans Serif', 40, 0, 54, 46, 17, 700, 'Normal', 'http://www.google.com/fonts/specimen/Arimo', 'google'];
    $scope.font[86] = ['Arimo', 'Arimo-BoldItalic.ttf', 282, 'Sans Serif', 40, 2, 54, 47, 17, 700, 'Italic', 'http://www.google.com/fonts/specimen/Arimo', 'google'];
    $scope.font[87] = ['Arimo', 'Arimo-Italic.ttf', 282, 'Sans Serif', 25, 0, 47, 39, 17, 400, 'Italic', 'http://www.google.com/fonts/specimen/Arimo', 'google'];
    $scope.font[88] = ['Arimo', 'Arimo-Regular.ttf', 282, 'Sans Serif', 25, 0, 47, 38, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Arimo', 'google'];
    $scope.font[89] = ['Arizonia', 'Arizonia-Regular.ttf', 146, 'Script', 24, 45, 59, 80, 64, 400, 'Normal', 'http://www.google.com/fonts/specimen/Arizonia', 'google'];
    $scope.font[90] = ['Armata', 'Armata-Regular.ttf', 310, 'Sans Serif', 19, 0, 51, 29, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Armata', 'google'];
    $scope.font[91] = ['Artifika', 'Artifika-Regular.ttf', 276, 'Serif', 25, 35, 52, 52, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Artifika', 'google'];
    $scope.font[92] = ['Arvo', 'Arvo-Bold.ttf', 270, 'Slab Serif', 55, 47, 68, 56, 21, 700, 'Normal', 'http://www.google.com/fonts/specimen/Arvo', 'google'];
    $scope.font[93] = ['Arvo', 'Arvo-BoldItalic.ttf', 270, 'Slab Serif', 62, 19, 66, 56, 21, 700, 'Italic', 'http://www.google.com/fonts/specimen/Arvo', 'google'];
    $scope.font[94] = ['Arvo', 'Arvo-Italic.ttf', 270, 'Slab Serif', 34, 17, 60, 54, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Arvo', 'google'];
    $scope.font[95] = ['Arvo', 'Arvo-Regular.ttf', 270, 'Slab Serif', 29, 51, 58, 50, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Arvo', 'google'];
    $scope.font[96] = ['Asap', 'Asap-Bold.ttf', 282, 'Sans Serif', 43, 0, 48, 41, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Asap', 'google'];
    $scope.font[97] = ['Asap', 'Asap-BoldItalic.ttf', 285, 'Sans Serif', 42, 73, 47, 40, 22, 700, 'Italic', 'http://www.google.com/fonts/specimen/Asap', 'google'];
    $scope.font[98] = ['Asap', 'Asap-Italic.ttf', 284, 'Sans Serif', 23, 73, 47, 38, 22, 400, 'Italic', 'http://www.google.com/fonts/specimen/Asap', 'google'];
    $scope.font[99] = ['Asap', 'Asap-Regular.ttf', 282, 'Sans Serif', 23, 0, 48, 37, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Asap', 'google'];
    $scope.font[100] = ['Asset', 'Asset.ttf', 280, 'Fun', 93, 100, 100, 100, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Asset', 'google'];
    $scope.font[101] = ['Astloch', 'Astloch-Bold.ttf', 322, 'Fun', 13, 7, 12, 7, 28, 700, 'Normal', 'http://www.google.com/fonts/specimen/Astloch', 'google'];
    $scope.font[102] = ['Astloch', 'Astloch-Regular.ttf', 321, 'Fun', 1, 2, 11, 4, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Regular', 'google'];
    $scope.font[103] = ['Asul', 'Asul-Bold.ttf', 269, 'Serif', 35, 26, 43, 55, 25, 700, 'Normal', 'http://www.google.com/fonts/specimen/Asul', 'google'];
    $scope.font[104] = ['Asul', 'Asul-Regular.ttf', 263, 'Serif', 19, 21, 35, 49, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Asul', 'google'];
    $scope.font[105] = ['Atomic Age', 'AtomicAge-Regular.ttf', 273, 'Fun', 24, 23, 45, 31, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Atomic Age', 'google'];
    $scope.font[106] = ['Aubrey', 'Aubrey-Regular.ttf', 240, 'Sans Serif', 20, 25, 39, 40, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Aubrey', 'google'];
    $scope.font[107] = ['Audiowide', 'Audiowide-Regular.ttf', 282, 'Fun', 25, 0, 43, 45, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Audiowide', 'google'];
    $scope.font[108] = ['Autour One', 'AutourOne-Regular.ttf', 326, 'Fun', 17, 25, 36, 32, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Autour One', 'google'];
    $scope.font[109] = ['Average', 'Average-Regular.ttf', 247, 'Serif', 12, 71, 40, 61, 40, 400, 'Normal', 'http://www.google.com/fonts/specimen/Average', 'google'];
    $scope.font[110] = ['Average Sans', 'AverageSans-Regular.ttf', 244, 'Sans Serif', 26, 5, 53, 50, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Average Sans', 'google'];
    $scope.font[111] = ['Averia Gruesa Libre', 'AveriaGruesaLibre-Regular.ttf', 252, 'Sans Serif', 32, 64, 57, 46, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Averia Gruesa Libre', 'google'];
    $scope.font[112] = ['Averia Libre', 'AveriaLibre-Bold.ttf', 260, 'Sans Serif', 38, 75, 58, 47, 24, 700, 'Normal', 'http://www.google.com/fonts/specimen/Averia Libre', 'google'];
    $scope.font[113] = ['Averia Libre', 'AveriaLibre-BoldItalic.ttf', 257, 'Sans Serif', 34, 68, 55, 48, 26, 700, 'Italic', 'http://www.google.com/fonts/specimen/Averia Libre', 'google'];
    $scope.font[114] = ['Averia Libre', 'AveriaLibre-Italic.ttf', 248, 'Sans Serif', 28, 70, 56, 48, 29, 400, 'Italic', 'http://www.google.com/fonts/specimen/Averia Libre', 'google'];
    $scope.font[115] = ['Averia Libre', 'AveriaLibre-Light.ttf', 251, 'Sans Serif', 30, 57, 57, 46, 24, 300, 'Normal', 'http://www.google.com/fonts/specimen/Averia Libre', 'google'];
    $scope.font[116] = ['Averia Libre', 'AveriaLibre-LightItalic.ttf', 245, 'Sans Serif', 23, 75, 55, 47, 30, 300, 'Italic', 'http://www.google.com/fonts/specimen/Averia Libre', 'google'];
    $scope.font[117] = ['Averia Libre', 'AveriaLibre-Regular.ttf', 254, 'Sans Serif', 32, 64, 57, 46, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Averia Libre', 'google'];
    $scope.font[118] = ['Averia Sans Libre', 'AveriaSansLibre-Bold.ttf', 265, 'Sans Serif', 35, 30, 54, 45, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Averia Sans Libre', 'google'];
    $scope.font[119] = ['Averia Sans Libre', 'AveriaSansLibre-BoldItalic.ttf', 263, 'Sans Serif', 34, 30, 52, 46, 22, 700, 'Italic', 'http://www.google.com/fonts/specimen/Averia Sans Libre', 'google'];
    $scope.font[120] = ['Averia Sans Libre', 'AveriaSansLibre-Italic.ttf', 254, 'Sans Serif', 27, 39, 54, 46, 25, 400, 'Italic', 'http://www.google.com/fonts/specimen/Averia Sans Libre', 'google'];
    $scope.font[121] = ['Averia Sans Libre', 'AveriaSansLibre-Light.ttf', 254, 'Sans Serif', 27, 25, 53, 43, 24, 300, 'Normal', 'http://www.google.com/fonts/specimen/Averia Sans Libre', 'google'];
    $scope.font[122] = ['Averia Sans Libre', 'AveriaSansLibre-LightItalic.ttf', 250, 'Sans Serif', 21, 36, 55, 45, 27, 300, 'Italic', 'http://www.google.com/fonts/specimen/Averia Sans Libre', 'google'];
    $scope.font[123] = ['Averia Sans Libre', 'AveriaSansLibre-Regular.ttf', 257, 'Sans Serif', 30, 27, 53, 43, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Averia Sans Libre', 'google'];
    $scope.font[124] = ['Averia Serif Libre', 'AveriaSerifLibre-Bold.ttf', 256, 'Serif', 38, 55, 48, 60, 31, 700, 'Normal', 'http://www.google.com/fonts/specimen/Averia Serif Libre', 'google'];
    $scope.font[125] = ['Averia Serif Libre', 'AveriaSerifLibre-BoldItalic.ttf', 246, 'Serif', 30, 54, 44, 60, 36, 700, 'Italic', 'http://www.google.com/fonts/specimen/Averia Serif Libre', 'google'];
    $scope.font[126] = ['Averia Serif Libre', 'AveriaSerifLibre-Italic.ttf', 245, 'Serif', 22, 44, 40, 51, 37, 400, 'Italic', 'http://www.google.com/fonts/specimen/Averia Serif Libre', 'google'];
    $scope.font[127] = ['Averia Serif Libre', 'AveriaSerifLibre-Light.ttf', 253, 'Serif', 23, 53, 44, 54, 30, 300, 'Normal', 'http://www.google.com/fonts/specimen/Averia Serif Libre', 'google'];
    $scope.font[128] = ['Averia Serif Libre', 'AveriaSerifLibre-LightItalic.ttf', 242, 'Serif', 15, 44, 39, 49, 40, 300, 'Italic', 'http://www.google.com/fonts/specimen/Averia Serif Libre', 'google'];
    $scope.font[129] = ['Averia Serif Libre', 'AveriaSerifLibre-Regular.ttf', 253, 'Serif', 27, 54, 45, 57, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Averia Serif Libre', 'google'];
    $scope.font[130] = ['Bad Script', 'BadScript-Regular.ttf', 283, 'Script', 3, 15, 12, 11, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bad Script', 'google'];
    $scope.font[131] = ['Balthazar', 'Balthazar-Regular.ttf', 218, 'Serif', 19, 39, 41, 76, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Balthazar', 'google'];
    $scope.font[132] = ['Bangers', 'Bangers.ttf', 386, 'Fun', 22, 0, 8, 11, 2, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bangers', 'google'];
    $scope.font[133] = ['Basic', 'Basic-Regular.ttf', 266, 'Sans Serif', 25, 2, 58, 42, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Basic', 'google'];
    $scope.font[134] = ['Baumans', 'Baumans-Regular.ttf', 256, 'Fun', 19, 19, 31, 44, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Baumans', 'google'];
    $scope.font[135] = ['Belgrano', 'Belgrano-Regular.ttf', 273, 'Slab Serif', 32, 60, 62, 53, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Belgrano', 'google'];
    $scope.font[136] = ['Belleza', 'Belleza-Regular.ttf', 241, 'Sans Serif', 28, 0, 53, 54, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Belleza', 'google'];
    $scope.font[137] = ['BenchNine', 'BenchNine-Bold.ttf', 262, 'Sans Serif', 23, 0, 24, 22, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/BenchNine', 'google'];
    $scope.font[138] = ['BenchNine', 'BenchNine-Light.ttf', 262, 'Sans Serif', 14, 2, 20, 17, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/BenchNine', 'google'];
    $scope.font[139] = ['BenchNine', 'BenchNine-Regular.ttf', 262, 'Sans Serif', 19, 0, 22, 20, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/BenchNine', 'google'];
    $scope.font[140] = ['Bentham', 'Bentham-Regular.ttf', 220, 'Serif', 20, 63, 53, 78, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bentham', 'google'];
    $scope.font[141] = ['Berkshire Swash', 'BerkshireSwash-Regular.ttf', 276, 'Fun', 30, 14, 28, 34, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Berkshire Swash', 'google'];
    $scope.font[142] = ['Bevan', 'Bevan.ttf', 279, 'Slab Serif', 91, 6, 67, 61, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bevan', 'google'];
    $scope.font[143] = ['Bigelow Rules', 'BigelowRules-Regular.ttf', 207, 'Fun', 12, 27, 16, 19, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bigelow Rules', 'google'];
    $scope.font[144] = ['Bigshot One', 'BigshotOne.ttf', 248, 'Serif', 55, 54, 43, 67, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bigshot One', 'google'];
    $scope.font[145] = ['Bilbo', 'Bilbo-Regular.ttf', 211, 'Fun', 6, 23, 19, 17, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bilbo', 'google'];
    $scope.font[146] = ['Bilbo Swash Caps', 'BilboSwashCaps-Regular.ttf', 211, 'Script', 2, 27, 11, 12, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bilbo Swash Caps', 'google'];
    $scope.font[147] = ['Bitter', 'Bitter-Bold.ttf', 288, 'Serif', 41, 55, 39, 37, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Bitter', 'google'];
    $scope.font[148] = ['Bitter', 'Bitter-Italic.ttf', 283, 'Serif', 18, 34, 35, 30, 22, 400, 'Italic', 'http://www.google.com/fonts/specimen/Bitter', 'google'];
    $scope.font[149] = ['Bitter', 'Bitter-Regular.ttf', 282, 'Serif', 19, 63, 37, 34, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bitter', 'google'];
    $scope.font[150] = ['Black Ops One', 'BlackOpsOne-Regular.ttf', 277, 'Fun', 46, 0, 41, 47, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Black Ops One', 'google'];
    $scope.font[151] = ['Black Ops One', 'BlackOpsOne.ttf', 277, 'Fun', 46, 0, 41, 47, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Black Ops One', 'google'];
    $scope.font[152] = ['Bonbon', 'Bonbon-Regular.ttf', 268, 'Fun', 9, 37, 38, 40, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bonbon', 'google'];
    $scope.font[153] = ['Boogaloo', 'Boogaloo-Regular.ttf', 263, 'Fun', 25, 0, 19, 25, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Boogaloo', 'google'];
    $scope.font[154] = ['Bowlby One', 'BowlbyOne-Regular.ttf', 314, 'Sans Serif', 80, 7, 66, 51, 11, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bowlby One', 'google'];
    $scope.font[155] = ['Bowlby One SC', 'BowlbyOneSC-Regular.ttf', 348, 'All Caps', 100, 0, 50, 40, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bowlby One SC', 'google'];
    $scope.font[156] = ['Brawler', 'Brawler-Regular.ttf', 281, 'Serif', 14, 64, 36, 43, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Brawler', 'google'];
    $scope.font[157] = ['Bree Serif', 'BreeSerif-Regular.ttf', 269, 'Slab Serif', 42, 33, 47, 40, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bree Serif', 'google'];
    $scope.font[158] = ['Bubblegum Sans', 'BubblegumSans-Regular.ttf', 244, 'Script', 20, 7, 22, 32, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bubblegum Sans', 'google'];
    $scope.font[159] = ['Bubbler One', 'BubblerOne-Regular.ttf', 267, 'Sans Serif', 9, 0, 39, 31, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Bubbler One', 'google'];
    $scope.font[160] = ['Buda', 'Buda-Light.ttf', 225, 'Serif', 2, 28, 39, 55, 44, 300, 'Normal', 'http://www.google.com/fonts/specimen/Buda', 'google'];
    $scope.font[161] = ['Buenard', 'Buenard-Bold.ttf', 238, 'Serif', 38, 63, 44, 73, 46, 700, 'Normal', 'http://www.google.com/fonts/specimen/Buenard', 'google'];
    $scope.font[162] = ['Buenard', 'Buenard-Regular.ttf', 236, 'Serif', 17, 69, 42, 64, 48, 400, 'Normal', 'http://www.google.com/fonts/specimen/Buenard', 'google'];
    $scope.font[163] = ['Butcherman', 'Butcherman-Regular.ttf', 416, 'Fun', 20, 34, 16, 8, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Butcherman', 'google'];
    $scope.font[164] = ['Butcherman Caps', 'ButchermanCaps-Regular.ttf', 416, 'Fun', 20, 34, 16, 8, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Butcherman Caps', 'google'];
    $scope.font[165] = ['Butterfly Kids', 'ButterflyKids-Regular.ttf', 189, 'Script', 2, 25, 22, 47, 37, 400, 'Normal', 'http://www.google.com/fonts/specimen/Butterfly Kids', 'google'];
    $scope.font[166] = ['Cabin', 'Cabin-Bold.ttf', 267, 'Sans Serif', 37, 0, 49, 50, 28, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[167] = ['Cabin', 'Cabin-BoldItalic.ttf', 267, 'Sans Serif', 38, 5, 49, 44, 28, 700, 'Italic', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[168] = ['Cabin', 'Cabin-Italic.ttf', 261, 'Sans Serif', 28, 2, 45, 44, 31, 400, 'Italic', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[169] = ['Cabin', 'Cabin-Medium.ttf', 263, 'Sans Serif', 30, 0, 49, 50, 30, 500, 'Normal', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[170] = ['Cabin', 'Cabin-MediumItalic.ttf', 263, 'Sans Serif', 30, 5, 46, 45, 30, 500, 'Italic', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[171] = ['Cabin', 'Cabin-Regular.ttf', 261, 'Sans Serif', 26, 0, 49, 50, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[172] = ['Cabin', 'Cabin-SemiBold.ttf', 265, 'Sans Serif', 34, 0, 49, 50, 29, 600, 'Normal', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[173] = ['Cabin', 'Cabin-SemiBoldItalic.ttf', 265, 'Sans Serif', 34, 2, 48, 44, 29, 600, 'Italic', 'http://www.google.com/fonts/specimen/Cabin', 'google'];
    $scope.font[174] = ['Cabin Condensed', 'CabinCondensed-Bold.ttf', 267, 'Sans Serif', 35, 0, 39, 41, 28, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cabin Condensed', 'google'];
    $scope.font[175] = ['Cabin Condensed', 'CabinCondensed-Medium.ttf', 263, 'Sans Serif', 29, 0, 39, 41, 30, 500, 'Normal', 'http://www.google.com/fonts/specimen/Cabin Condensed', 'google'];
    $scope.font[176] = ['Cabin Condensed', 'CabinCondensed-Regular.ttf', 261, 'Sans Serif', 26, 0, 39, 41, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cabin Condensed', 'google'];
    $scope.font[177] = ['Cabin Condensed', 'CabinCondensed-SemiBold.ttf', 265, 'Sans Serif', 33, 0, 39, 40, 29, 600, 'Normal', 'http://www.google.com/fonts/specimen/Cabin Condensed', 'google'];
    $scope.font[178] = ['Cabin Sketch', 'CabinSketch-Bold.ttf', 265, 'Fun', 24, 7, 31, 45, 26, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cabin Sketch', 'google'];
    $scope.font[179] = ['Cabin Sketch', 'CabinSketch-Regular.ttf', 258, 'Fun', 14, 12, 32, 41, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cabin Sketch', 'google'];
    $scope.font[180] = ['Caesar Dressing', 'CaesarDressing-Regular.ttf', 261, 'Fun', 27, 1, 32, 27, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Caesar Dressing', 'google'];
    $scope.font[181] = ['Cagliostro', 'Cagliostro-Regular.ttf', 232, 'Sans Serif', 32, 0, 64, 65, 46, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cagliostro', 'google'];
    $scope.font[182] = ['Calligraffitti', 'Calligraffitti-Regular.ttf', 292, 'Script', 3, 20, 9, 15, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Calligraffitti', 'google'];
    $scope.font[183] = ['Cambo', 'Cambo-Regular.ttf', 275, 'Serif', 16, 59, 32, 31, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cambo', 'google'];
    $scope.font[184] = ['Candal', 'Candal.ttf', 281, 'Sans Serif', 63, 0, 70, 55, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Candal', 'google'];
    $scope.font[185] = ['Cantarell', 'Cantarell-Bold.ttf', 258, 'Sans Serif', 38, 0, 71, 61, 30, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cantarell', 'google'];
    $scope.font[186] = ['Cantarell', 'Cantarell-BoldOblique.ttf', 258, 'Sans Serif', 38, 2, 71, 61, 30, 'BoldOblique', 'Normal', 'http://www.google.com/fonts/specimen/Cantarell', 'google'];
    $scope.font[187] = ['Cantarell', 'Cantarell-Oblique.ttf', 258, 'Sans Serif', 25, 0, 59, 49, 30, 'Oblique', 'Normal', 'http://www.google.com/fonts/specimen/Cantarell', 'google'];
    $scope.font[188] = ['Cantarell', 'Cantarell-Regular.ttf', 258, 'Sans Serif', 24, 2, 59, 48, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cantarell', 'google'];
    $scope.font[189] = ['Cantata One', 'CantataOne-Regular.ttf', 267, 'Serif', 36, 66, 56, 58, 48, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cantata One', 'google'];
    $scope.font[190] = ['Cantora One', 'CantoraOne-Regular.ttf', 267, 'Sans Serif', 38, 16, 47, 42, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cantora One', 'google'];
    $scope.font[191] = ['Capriola', 'Capriola-Regular.ttf', 299, 'Sans Serif', 32, 91, 54, 40, 32, 400, 'Normal', 'http://www.google.com/fonts/specimen/Capriola', 'google'];
    $scope.font[192] = ['Cardo', 'Cardo-Bold.ttf', 246, 'Serif', 32, 68, 55, 79, 61, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cardo', 'google'];
    $scope.font[193] = ['Cardo', 'Cardo-Italic.ttf', 242, 'Serif', 10, 25, 34, 36, 69, 400, 'Italic', 'http://www.google.com/fonts/specimen/Cardo', 'google'];
    $scope.font[194] = ['Cardo', 'Cardo-Regular.ttf', 242, 'Serif', 14, 69, 46, 70, 65, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cardo', 'google'];
    $scope.font[195] = ['Carme', 'Carme-Regular.ttf', 267, 'Sans Serif', 25, 0, 55, 52, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Carme', 'google'];
    $scope.font[196] = ['Carrois Gothic', 'CarroisGothic-Regular.ttf', 288, 'Sans Serif', 21, 0, 45, 31, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Carrois Gothic', 'google'];
    $scope.font[197] = ['Carter One', 'CarterOne.ttf', 305, 'Script', 31, 0, 25, 28, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Carter One', 'google'];
    $scope.font[198] = ['Caudex', 'Caudex-Bold.ttf', 272, 'Serif', 25, 40, 35, 55, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Caudex', 'google'];
    $scope.font[199] = ['Caudex', 'Caudex-BoldItalic.ttf', 273, 'Serif', 26, 40, 35, 54, 21, 700, 'Italic', 'http://www.google.com/fonts/specimen/Caudex', 'google'];
    $scope.font[200] = ['Caudex', 'Caudex-Italic.ttf', 259, 'Serif', 17, 41, 42, 61, 24, 400, 'Italic', 'http://www.google.com/fonts/specimen/Caudex', 'google'];
    $scope.font[201] = ['Caudex', 'Caudex-Regular.ttf', 259, 'Serif', 17, 41, 41, 61, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Caudex', 'google'];
    $scope.font[202] = ['Cedarville Cursive', 'Cedarville-Cursive.ttf', 172, 'Script', 35, 37, 78, 36, 58, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cedarville Cursive', 'google'];
    $scope.font[203] = ['Ceviche One', 'CevicheOne-Regular.ttf', 321, 'Script', 23, 9, 1, 21, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ceviche One', 'google'];
    $scope.font[204] = ['Changa One', 'Changa-Regular.ttf', 271, 'Sans Serif', 30, 0, 47, 35, 11, 400, 'Normal', 'http://www.google.com/fonts/specimen/Changa One', 'google'];
    $scope.font[205] = ['Changa One', 'ChangaOne-Italic.ttf', 267, 'Sans Serif', 60, 0, 54, 49, 13, 400, 'Italic', 'http://www.google.com/fonts/specimen/Changa One', 'google'];
    $scope.font[206] = ['Changa One', 'ChangaOne-Regular.ttf', 267, 'Sans Serif', 63, 0, 53, 52, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Changa One', 'google'];
    $scope.font[207] = ['Chango', 'Chango-Regular.ttf', 273, 'Sans Serif', 100, 7, 93, 76, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chango', 'google'];
    $scope.font[208] = ['Chau Philomene One', 'ChauPhilomeneOne-Italic.ttf', 282, 'Sans Serif', 39, 2, 41, 31, 27, 400, 'Italic', 'http://www.google.com/fonts/specimen/Chau Philomene One', 'google'];
    $scope.font[209] = ['Chau Philomene One', 'ChauPhilomeneOne-Regular.ttf', 282, 'Sans Serif', 39, 0, 40, 31, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chau Philomene One', 'google'];
    $scope.font[210] = ['Chela One', 'ChelaOne-Regular.ttf', 285, 'Sans Serif', 44, 18, 35, 29, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chela One', 'google'];
    $scope.font[211] = ['Chelsea Market', 'ChelseaMarket-Regular.ttf', 303, 'Sans Serif', 38, 0, 55, 46, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chelsea Market', 'google'];
    $scope.font[212] = ['Cherry Cream Soda', 'CherryCreamSoda.ttf', 248, 'Script', 26, 11, 54, 56, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cherry Cream Soda', 'google'];
    $scope.font[213] = ['Cherry Swash', 'CherrySwash-Bold.ttf', 267, 'Slab Serif', 48, 58, 61, 55, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cherry Swash', 'google'];
    $scope.font[214] = ['Cherry Swash', 'CherrySwash-Regular.ttf', 267, 'Slab Serif', 28, 58, 53, 48, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cherry Swash', 'google'];
    $scope.font[215] = ['Chewy', 'Chewy.ttf', 299, 'Script', 26, 0, 11, 15, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chewy', 'google'];
    $scope.font[216] = ['Chicle', 'Chicle-Regular.ttf', 271, 'Script', 20, 15, 7, 19, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chicle', 'google'];
    $scope.font[217] = ['Chivo', 'Chivo-Black.ttf', 272, 'Sans Serif', 60, 0, 59, 54, 20, 900, 'Normal', 'http://www.google.com/fonts/specimen/Chivo', 'google'];
    $scope.font[218] = ['Chivo', 'Chivo-BlackItalic.ttf', 273, 'Sans Serif', 60, 0, 58, 54, 20, 900, 'Italic', 'http://www.google.com/fonts/specimen/Chivo', 'google'];
    $scope.font[219] = ['Chivo', 'Chivo-Italic.ttf', 273, 'Sans Serif', 27, 2, 55, 43, 20, 400, 'Italic', 'http://www.google.com/fonts/specimen/Chivo', 'google'];
    $scope.font[220] = ['Chivo', 'Chivo-Regular.ttf', 273, 'Sans Serif', 26, 0, 54, 42, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Chivo', 'google'];
    $scope.font[221] = ['Cinzel', 'Cinzel-Bold.ttf', 320, 'All Caps', 29, 31, 55, 54, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cinzel', 'google'];
    $scope.font[222] = ['Cinzel', 'Cinzel-Regular.ttf', 320, 'All Caps', 12, 36, 53, 51, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cinzel', 'google'];
    $scope.font[223] = ['Cinzel Decorative', 'CinzelDecorative-Black.ttf', 374, 'All Caps', 36, 29, 54, 45, 12, 900, 'Normal', 'http://www.google.com/fonts/specimen/Cinzel Decorative', 'google'];
    $scope.font[224] = ['Cinzel Decorative', 'CinzelDecorative-Bold.ttf', 374, 'All Caps', 26, 29, 52, 43, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cinzel Decorative', 'google'];
    $scope.font[225] = ['Cinzel Decorative', 'CinzelDecorative-Regular.ttf', 374, 'All Caps', 9, 29, 47, 40, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cinzel Decorative', 'google'];
    $scope.font[226] = ['Clara', 'Clara-Regular.ttf', 271, 'Script', 17, 33, 29, 22, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Clara', 'google'];
    $scope.font[227] = ['Clicker Script', 'ClickerScript-Regular.ttf', 161, 'Script', 18, 21, 46, 44, 46, 400, 'Normal', 'http://www.google.com/fonts/specimen/Clicker Script', 'google'];
    $scope.font[228] = ['Coda', 'Coda-Heavy.ttf', 339, 'Sans Serif', 69, 2, 53, 34, 12, 800, 'Normal', 'http://www.google.com/fonts/specimen/Coda', 'google'];
    $scope.font[229] = ['Coda', 'Coda-Regular.ttf', 286, 'Sans Serif', 26, 0, 45, 34, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Coda', 'google'];
    $scope.font[230] = ['Coda Caption', 'CodaCaption-Heavy.ttf', 338, 'Sans Serif', 60, 0, 57, 30, 12, 800, 'Normal', 'http://www.google.com/fonts/specimen/Coda Caption', 'google'];
    $scope.font[231] = ['Codystar', 'Codystar-Light.ttf', 399, 'Fun', 2, 0, 26, 19, 0, 300, 'Normal', 'http://www.google.com/fonts/specimen/Codystar', 'google'];
    $scope.font[232] = ['Codystar', 'Codystar-Regular.ttf', 400, 'Fun', 3, 0, 26, 19, 2, 400, 'Normal', 'http://www.google.com/fonts/specimen/Codystar', 'google'];
    $scope.font[233] = ['Combo', 'Combo-Regular.ttf', 276, 'Script', 7, 3, 16, 15, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Combo', 'google'];
    $scope.font[234] = ['Comfortaa', 'Comfortaa-Bold.ttf', 292, 'Sans Serif', 27, 0, 52, 46, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Comfortaa', 'google'];
    $scope.font[235] = ['Comfortaa', 'Comfortaa-Light.ttf', 292, 'Sans Serif', 15, 0, 52, 46, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Comfortaa', 'google'];
    $scope.font[236] = ['Comfortaa', 'Comfortaa-Regular.ttf', 292, 'Sans Serif', 21, 0, 52, 46, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Comfortaa', 'google'];
    $scope.font[237] = ['Coming Soon', 'ComingSoon.ttf', 309, 'Script', 3, 1, 18, 15, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Coming Soon', 'google'];
    $scope.font[238] = ['Concert One', 'ConcertOne-Regular.ttf', 261, 'Sans Serif', 46, 0, 53, 40, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Concert One', 'google'];
    $scope.font[239] = ['Condiment', 'Condiment-Regular.ttf', 225, 'Script', 16, 17, 26, 33, 59, 400, 'Normal', 'http://www.google.com/fonts/specimen/Condiment', 'google'];
    $scope.font[240] = ['Contrail One', 'ContrailOne-Regular.ttf', 317, 'Sans Serif', 30, 2, 33, 17, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Contrail One', 'google'];
    $scope.font[241] = ['Convergence', 'Convergence-Regular.ttf', 289, 'Sans Serif', 29, 0, 52, 37, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Convergence', 'google'];
    $scope.font[242] = ['Cookie', 'Cookie-Regular.ttf', 198, 'Script', 25, 10, 20, 38, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cookie', 'google'];
    $scope.font[243] = ['Copse', 'Copse-Regular.ttf', 266, 'Slab Serif', 33, 71, 51, 45, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Copse', 'google'];
    $scope.font[244] = ['Corben', 'Corben-Bold.ttf', 337, 'Serif', 86, 46, 56, 39, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Corben', 'google'];
    $scope.font[245] = ['Corben', 'Corben-Regular.ttf', 252, 'Serif', 21, 55, 49, 72, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Corben', 'google'];
    $scope.font[246] = ['Courgette', 'Courgette-Regular.ttf', 273, 'Script', 15, 22, 26, 23, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Courgette', 'google'];
    $scope.font[247] = ['Cousine', 'Cousine-Bold.ttf', 282, 'Monospace', 71, 61, 40, 39, 10, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cousine', 'google'];
    $scope.font[248] = ['Cousine', 'Cousine-BoldItalic.ttf', 282, 'Monospace', 61, 65, 41, 39, 10, 700, 'Italic', 'http://www.google.com/fonts/specimen/Cousine', 'google'];
    $scope.font[249] = ['Cousine', 'Cousine-Italic.ttf', 282, 'Monospace', 38, 68, 41, 30, 10, 400, 'Italic', 'http://www.google.com/fonts/specimen/Cousine', 'google'];
    $scope.font[250] = ['Cousine', 'Cousine-Regular.ttf', 282, 'Monospace', 38, 67, 40, 30, 10, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cousine', 'google'];
    $scope.font[251] = ['Coustard', 'Coustard-Black.ttf', 292, 'Slab Serif', 86, 45, 71, 63, 8, 700, 'Normal', 'http://www.google.com/fonts/specimen/Coustard', 'google'];
    $scope.font[252] = ['Coustard', 'Coustard-Regular.ttf', 284, 'Slab Serif', 37, 46, 55, 50, 9, 400, 'Normal', 'http://www.google.com/fonts/specimen/Coustard', 'google'];
    $scope.font[253] = ['Covered By Your Grace', 'CoveredByYourGrace.ttf', 263, 'Script', 13, 1, 11, 17, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Covered By Your Grace', 'google'];
    $scope.font[254] = ['Crafty Girls', 'CraftyGirls.ttf', 276, 'Script', 5, 3, 36, 34, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Crafty Girls', 'google'];
    $scope.font[255] = ['Creepster', 'Creepster-Regular.ttf', 408, 'Fun', 20, 20, 8, 6, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/Creepster', 'google'];
    $scope.font[256] = ['Creepster Caps', 'CreepsterCaps-Regular.ttf', 408, 'Fun', 20, 20, 8, 6, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/Creepster Caps', 'google'];
    $scope.font[257] = ['Crete Round', 'CreteRound-Italic.ttf', 271, 'Slab Serif', 39, 12, 48, 45, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Crete Round', 'google'];
    $scope.font[258] = ['Crete Round', 'CreteRound-Regular.ttf', 264, 'Slab Serif', 41, 56, 51, 45, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Crete Round', 'google'];
    $scope.font[259] = ['Crimson Text', 'CrimsonText-Bold.ttf', 234, 'Serif', 42, 69, 54, 81, 36, 700, 'Normal', 'http://www.google.com/fonts/specimen/Crimson Text', 'google'];
    $scope.font[260] = ['Crimson Text', 'CrimsonText-BoldItalic.ttf', 239, 'Serif', 35, 39, 28, 45, 33, 700, 'Italic', 'http://www.google.com/fonts/specimen/Crimson Text', 'google'];
    $scope.font[261] = ['Crimson Text', 'CrimsonText-Italic.ttf', 231, 'Serif', 10, 31, 28, 36, 37, 400, 'Italic', 'http://www.google.com/fonts/specimen/Crimson Text', 'google'];
    $scope.font[262] = ['Crimson Text', 'CrimsonText-Roman.ttf', 228, 'Serif', 16, 68, 43, 75, 41, 400, 'Normal', 'http://www.google.com/fonts/specimen/Crimson Text', 'google'];
    $scope.font[263] = ['Crimson Text', 'CrimsonText-Semibold.ttf', 231, 'Serif', 30, 68, 48, 78, 39, 600, 'Normal', 'http://www.google.com/fonts/specimen/Crimson Text', 'google'];
    $scope.font[264] = ['Crimson Text', 'CrimsonText-SemiboldItalic.ttf', 235, 'Serif', 22, 36, 26, 40, 31, 600, 'Italic', 'http://www.google.com/fonts/specimen/Crimson Text', 'google'];
    $scope.font[265] = ['Croissant One', 'CroissantOne-Regular.ttf', 283, 'Script', 25, 30, 41, 30, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Croissant One', 'google'];
    $scope.font[266] = ['Crushed', 'Crushed.ttf', 358, 'All Caps', 13, 3, 22, 21, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Crushed', 'google'];
    $scope.font[267] = ['Cuprum', 'Cuprum-Bold.ttf', 266, 'Sans Serif', 36, 0, 43, 35, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Cuprum', 'google'];
    $scope.font[268] = ['Cuprum', 'Cuprum-BoldItalic.ttf', 267, 'Sans Serif', 36, 0, 43, 35, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Cuprum', 'google'];
    $scope.font[269] = ['Cuprum', 'Cuprum-Italic.ttf', 267, 'Sans Serif', 26, 2, 39, 30, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/Cuprum', 'google'];
    $scope.font[270] = ['Cuprum', 'Cuprum-Regular.ttf', 267, 'Sans Serif', 26, 0, 39, 30, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cuprum', 'google'];
    $scope.font[271] = ['Cutive', 'Cutive-Regular.ttf', 309, 'Slab Serif', 29, 71, 61, 43, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cutive', 'google'];
    $scope.font[272] = ['Cutive Mono', 'CutiveMono-Regular.ttf', 212, 'Monospace', 20, 100, 100, 100, 64, 400, 'Normal', 'http://www.google.com/fonts/specimen/Cutive Mono', 'google'];
    $scope.font[273] = ['Damion', 'Damion-Regular.ttf', 188, 'Script', 22, 62, 40, 46, 41, 400, 'Normal', 'http://www.google.com/fonts/specimen/Damion', 'google'];
    $scope.font[274] = ['Dancing Script', 'DancingScript-Bold.ttf', 197, 'Script', 31, 26, 38, 33, 48, 700, 'Normal', 'http://www.google.com/fonts/specimen/Dancing Script', 'google'];
    $scope.font[275] = ['Dancing Script', 'DancingScript-Regular.ttf', 194, 'Script', 22, 27, 37, 32, 50, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dancing Script', 'google'];
    $scope.font[276] = ['Dawning of a New Day', 'DawningofaNewDay.ttf', 162, 'Script', 19, 42, 55, 54, 42, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dawning of a New Day', 'google'];
    $scope.font[277] = ['Days One', 'DaysOne-Regular.ttf', 279, 'Sans Serif', 50, 0, 67, 53, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Days One', 'google'];
    $scope.font[278] = ['Delius', 'Delius-Regular.ttf', 278, 'Sans Serif', 21, 0, 50, 41, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Delius', 'google'];
    $scope.font[279] = ['Delius Swash Caps', 'DeliusSwashCaps-Regular.ttf', 278, 'Sans Serif', 21, 0, 50, 41, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Delius Swash Caps', 'google'];
    $scope.font[280] = ['Delius Unicase', 'DeliusUnicase-Bold.ttf', 407, 'All Caps', 22, 47, 44, 29, 14, 700, 'Normal', 'http://www.google.com/fonts/specimen/Delius Unicase', 'google'];
    $scope.font[281] = ['Delius Unicase', 'DeliusUnicase-Regular.ttf', 407, 'All Caps', 13, 51, 44, 28, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Delius Unicase', 'google'];
    $scope.font[282] = ['Della Respira', 'DellaRespira-Regular.ttf', 249, 'Serif', 15, 33, 49, 66, 57, 400, 'Normal', 'http://www.google.com/fonts/specimen/Della Respira', 'google'];
    $scope.font[283] = ['Denk One', 'DenkOne-Regular.ttf', 313, 'Sans Serif', 34, 25, 38, 22, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Denk One', 'google'];
    $scope.font[284] = ['Devonshire', 'Devonshire-Regular.ttf', 244, 'Script', 14, 33, 5, 12, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Devonshire', 'google'];
    $scope.font[285] = ['Dhyana', 'Dhyana-Bold.ttf', 309, 'Sans Serif', 37, 0, 50, 35, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Dhyana', 'google'];
    $scope.font[286] = ['Dhyana', 'Dhyana-Regular.ttf', 305, 'Sans Serif', 23, 0, 49, 34, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dhyana', 'google'];
    $scope.font[287] = ['Didact Gothic', 'DidactGothic.ttf', 249, 'Sans Serif', 21, 0, 53, 51, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Didact Gothic', 'google'];
    $scope.font[288] = ['Diplomata', 'Diplomata-Regular.ttf', 298, 'Fun', 68, 65, 91, 72, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Diplomata', 'google'];
    $scope.font[289] = ['Domine', 'Domine-Regular.ttf', 288, 'Serif', 17, 58, 37, 30, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Domine', 'google'];
    $scope.font[290] = ['Donegal One', 'DonegalOne-Regular.ttf', 277, 'Serif', 22, 69, 45, 43, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Donegal One', 'google'];
    $scope.font[291] = ['Doppio One', 'DoppioOne-Regular.ttf', 275, 'Sans Serif', 33, 0, 53, 43, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Doppio One', 'google'];
    $scope.font[292] = ['Dorsa', 'Dorsa-Regular.ttf', 267, 'Sans Serif', 9, 0, 0, 0, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dorsa', 'google'];
    $scope.font[293] = ['Dosis', 'Dosis-Bold.ttf', 253, 'Sans Serif', 41, 0, 50, 47, 35, 700, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[294] = ['Dosis', 'Dosis-ExtraBold.ttf', 254, 'Sans Serif', 50, 0, 51, 50, 34, 800, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[295] = ['Dosis', 'Dosis-ExtraLight.ttf', 252, 'Sans Serif', 9, 0, 42, 35, 39, 200, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[296] = ['Dosis', 'Dosis-Light.ttf', 252, 'Sans Serif', 14, 0, 44, 37, 38, 300, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[297] = ['Dosis', 'Dosis-Medium.ttf', 253, 'Sans Serif', 25, 0, 46, 40, 37, 500, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[298] = ['Dosis', 'Dosis-Regular.ttf', 252, 'Sans Serif', 19, 0, 45, 39, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[299] = ['Dosis', 'Dosis-SemiBold.ttf', 253, 'Sans Serif', 32, 0, 48, 43, 36, 600, 'Normal', 'http://www.google.com/fonts/specimen/Dosis', 'google'];
    $scope.font[300] = ['Dr Sugiyama', 'DrSugiyama-Regular.ttf', 139, 'Script', 22, 100, 49, 57, 77, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dr Sugiyama', 'google'];
    $scope.font[301] = ['Droid Sans', 'DroidSans-Bold.ttf', 291, 'Sans Serif', 42, 0, 52, 38, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Droid Sans', 'google'];
    $scope.font[302] = ['Droid Sans', 'DroidSans.ttf', 286, 'Sans Serif', 24, 0, 48, 35, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Droid Sans', 'google'];
    $scope.font[303] = ['Droid Sans Mono', 'DroidSansMono.ttf', 286, 'Monospace', 36, 53, 37, 31, 41, 400, 'Normal', 'http://www.google.com/fonts/specimen/Droid Sans Mono', 'google'];
    $scope.font[304] = ['Droid Serif', 'DroidSerif-Bold.ttf', 286, 'Serif', 41, 65, 44, 37, 17, 700, 'Normal', 'http://www.google.com/fonts/specimen/Droid Serif', 'google'];
    $scope.font[305] = ['Droid Serif', 'DroidSerif-BoldItalic.ttf', 291, 'Serif', 41, 43, 41, 37, 16, 700, 'Italic', 'http://www.google.com/fonts/specimen/Droid Serif', 'google'];
    $scope.font[306] = ['Droid Serif', 'DroidSerif-Italic.ttf', 291, 'Serif', 15, 45, 30, 27, 16, 400, 'Italic', 'http://www.google.com/fonts/specimen/Droid Serif', 'google'];
    $scope.font[307] = ['Droid Serif', 'DroidSerif.ttf', 286, 'Serif', 16, 73, 38, 25, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Droid Serif', 'google'];
    $scope.font[308] = ['Duru Sans', 'DuruSans-Regular.ttf', 302, 'Sans Serif', 21, 0, 56, 35, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Duru Sans', 'google'];
    $scope.font[309] = ['Dynalight', 'Dynalight-Regular.ttf', 188, 'Script', 12, 13, 29, 33, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Dynalight', 'google'];
    $scope.font[310] = ['EB Garamond', 'EBGaramond-Regular.ttf', 234, 'Serif', 12, 63, 37, 75, 44, 400, 'Normal', 'http://www.google.com/fonts/specimen/EB Garamond', 'google'];
    $scope.font[311] = ['Eagle Lake', 'EagleLake-Regular.ttf', 282, 'Script', 19, 38, 46, 36, 40, 400, 'Normal', 'http://www.google.com/fonts/specimen/Eagle Lake', 'google'];
    $scope.font[312] = ['Eater', 'Eater-Regular.ttf', 470, 'Fun', 15, 22, 20, 16, 2, 400, 'Normal', 'http://www.google.com/fonts/specimen/Eater', 'google'];
    $scope.font[313] = ['Eater Caps', 'EaterCaps-Regular.ttf', 470, 'Fun', 15, 22, 20, 16, 2, 400, 'Normal', 'http://www.google.com/fonts/specimen/Eater Caps', 'google'];
    $scope.font[314] = ['Economica', 'Economica-Bold.ttf', 290, 'Sans Serif', 24, 0, 26, 16, 13, 700, 'Normal', 'http://www.google.com/fonts/specimen/Economica', 'google'];
    $scope.font[315] = ['Economica', 'Economica-BoldItalic.ttf', 290, 'Sans Serif', 22, 2, 23, 16, 13, 700, 'Italic', 'http://www.google.com/fonts/specimen/Economica', 'google'];
    $scope.font[316] = ['Economica', 'Economica-Italic.ttf', 290, 'Sans Serif', 15, 2, 22, 13, 15, 400, 'Italic', 'http://www.google.com/fonts/specimen/Economica', 'google'];
    $scope.font[317] = ['Economica', 'Economica-Regular.ttf', 290, 'Sans Serif', 15, 0, 22, 12, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Economica', 'google'];
    $scope.font[318] = ['Electrolize', 'Electrolize-Regular.ttf', 267, 'Sans Serif', 25, 0, 52, 42, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Electrolize', 'google'];
    $scope.font[319] = ['Elsie', 'Elsie-Regular.ttf', 253, 'Serif', 18, 58, 39, 46, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Elsie', 'google'];
    $scope.font[320] = ['Elsie Swash Caps', 'ElsieSwashCaps-Regular.ttf', 253, 'Serif', 18, 58, 39, 46, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Elsie Swash Caps', 'google'];
    $scope.font[321] = ['Emblema One', 'EmblemaOne-Regular.ttf', 259, 'Fun', 52, 4, 54, 57, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Emblema One', 'google'];
    $scope.font[322] = ['Emilys Candy', 'EmilysCandy-Regular.ttf', 268, 'Fun', 18, 40, 29, 39, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Emilys Candy', 'google'];
    $scope.font[323] = ['Engagement', 'Engagement-Regular.ttf', 175, 'Script', 18, 32, 19, 37, 50, 400, 'Normal', 'http://www.google.com/fonts/specimen/Engagement', 'google'];
    $scope.font[324] = ['Englebert', 'Englebert-Regular.ttf', 264, 'Sans Serif', 17, 25, 41, 33, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Englebert', 'google'];
    $scope.font[325] = ['Enriqueta', 'Enriqueta-Bold.ttf', 259, 'Slab Serif', 46, 51, 59, 58, 33, 700, 'Normal', 'http://www.google.com/fonts/specimen/Enriqueta', 'google'];
    $scope.font[326] = ['Enriqueta', 'Enriqueta-Regular.ttf', 256, 'Slab Serif', 28, 56, 57, 53, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Enriqueta', 'google'];
    $scope.font[327] = ['Erica One', 'EricaOne-Regular.ttf', 277, 'Sans Serif', 92, 0, 68, 50, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Erica One', 'google'];
    $scope.font[328] = ['Esteban', 'Esteban-Regular.ttf', 258, 'Serif', 14, 73, 39, 39, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Esteban', 'google'];
    $scope.font[329] = ['Euphoria Script', 'EuphoriaScript-Regular.ttf', 199, 'Script', 10, 0, 21, 22, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Euphoria Script', 'google'];
    $scope.font[330] = ['Ewert', 'Ewert-Regular.ttf', 406, 'Fun', 47, 8, 29, 21, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ewert', 'google'];
    $scope.font[331] = ['Exo', 'Exo-Black.ttf', 284, 'Sans Serif', 57, 0, 50, 42, 25, 900, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[332] = ['Exo', 'Exo-BlackItalic.ttf', 284, 'Sans Serif', 57, 0, 51, 42, 25, 900, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[333] = ['Exo', 'Exo-Bold.ttf', 284, 'Sans Serif', 40, 0, 49, 39, 26, 700, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[334] = ['Exo', 'Exo-BoldItalic.ttf', 284, 'Sans Serif', 40, 0, 49, 40, 26, 700, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[335] = ['Exo', 'Exo-ExtraBold.ttf', 284, 'Sans Serif', 47, 2, 50, 40, 25, 800, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[336] = ['Exo', 'Exo-ExtraBoldItalic.ttf', 284, 'Sans Serif', 48, 0, 50, 41, 25, 800, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[337] = ['Exo', 'Exo-ExtraLight.ttf', 284, 'Sans Serif', 9, 0, 48, 35, 26, 200, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[338] = ['Exo', 'Exo-ExtraLightItalic.ttf', 284, 'Sans Serif', 9, 0, 47, 35, 26, 200, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[339] = ['Exo', 'Exo-Italic.ttf', 284, 'Sans Serif', 19, 2, 48, 39, 26, 400, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[340] = ['Exo', 'Exo-Light.ttf', 284, 'Sans Serif', 15, 0, 48, 36, 26, 300, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[341] = ['Exo', 'Exo-LightItalic.ttf', 284, 'Sans Serif', 14, 2, 48, 37, 26, 300, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[342] = ['Exo', 'Exo-Medium.ttf', 284, 'Sans Serif', 25, 0, 48, 39, 26, 500, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[343] = ['Exo', 'Exo-MediumItalic.ttf', 284, 'Sans Serif', 25, 2, 49, 39, 26, 500, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[344] = ['Exo', 'Exo-Regular.ttf', 284, 'Sans Serif', 20, 0, 48, 39, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[345] = ['Exo', 'Exo-SemiBold.ttf', 284, 'Sans Serif', 32, 0, 48, 39, 26, 600, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[346] = ['Exo', 'Exo-SemiBoldItalic.ttf', 284, 'Sans Serif', 32, 0, 49, 39, 26, 600, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[347] = ['Exo', 'Exo-Thin.ttf', 284, 'Sans Serif', 3, 2, 48, 34, 26, 100, 'Normal', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[348] = ['Exo', 'Exo-ThinItalic.ttf', 284, 'Sans Serif', 4, 0, 47, 34, 26, 100, 'Italic', 'http://www.google.com/fonts/specimen/Exo', 'google'];
    $scope.font[349] = ['Expletus Sans', 'ExpletusSans-Bold.ttf', 276, 'Sans Serif', 41, 0, 55, 48, 25, 700, 'Normal', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[350] = ['Expletus Sans', 'ExpletusSans-BoldItalic.ttf', 276, 'Sans Serif', 41, 2, 56, 49, 25, 700, 'Italic', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[351] = ['Expletus Sans', 'ExpletusSans-Italic.ttf', 276, 'Sans Serif', 25, 9, 53, 43, 25, 400, 'Italic', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[352] = ['Expletus Sans', 'ExpletusSans-Medium.ttf', 276, 'Sans Serif', 30, 2, 53, 43, 25, 500, 'Normal', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[353] = ['Expletus Sans', 'ExpletusSans-MediumItalic.ttf', 276, 'Sans Serif', 30, 7, 52, 44, 25, 500, 'Italic', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[354] = ['Expletus Sans', 'ExpletusSans-Regular.ttf', 276, 'Sans Serif', 25, 5, 52, 43, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[355] = ['Expletus Sans', 'ExpletusSans-SemiBold.ttf', 276, 'Sans Serif', 34, 5, 54, 46, 25, 600, 'Normal', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[356] = ['Expletus Sans', 'ExpletusSans-SemiBoldItalic.ttf', 276, 'Sans Serif', 35, 5, 55, 46, 25, 600, 'Italic', 'http://www.google.com/fonts/specimen/Expletus Sans', 'google'];
    $scope.font[357] = ['Fanwood Text', 'FanwoodText-Italic.ttf', 211, 'Serif', 16, 31, 45, 73, 59, 400, 'Italic', 'http://www.google.com/fonts/specimen/Fanwood Text', 'google'];
    $scope.font[358] = ['Fanwood Text', 'FanwoodText-Regular.ttf', 209, 'Serif', 20, 66, 51, 84, 62, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fanwood Text', 'google'];
    $scope.font[359] = ['Fascinate', 'Fascinate-Regular.ttf', 267, 'Fun', 82, 0, 44, 50, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fascinate', 'google'];
    $scope.font[360] = ['Fascinate Inline', 'FascinateInline-Regular.ttf', 267, 'Fun', 83, 0, 44, 50, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fascinate Inline', 'google'];
    $scope.font[361] = ['Fauna One', 'FaunaOne-Regular.ttf', 313, 'Slab Serif', 21, 4, 44, 23, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fauna One', 'google'];
    $scope.font[362] = ['Federant', 'Federant-Regular.ttf', 281, 'Script', 17, 22, 27, 22, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Federant', 'google'];
    $scope.font[363] = ['Federo', 'Federo-Regular.ttf', 245, 'Sans Serif', 32, 0, 51, 58, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Federo', 'google'];
    $scope.font[364] = ['Felipa', 'Felipa-Regular.ttf', 281, 'Script', 11, 2, 6, 12, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Felipa', 'google'];
    $scope.font[365] = ['Fenix', 'Fenix-Regular.ttf', 245, 'Serif', 17, 69, 37, 57, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fenix', 'google'];
    $scope.font[366] = ['Finger Paint', 'FingerPaint-Regular.ttf', 293, 'Script', 15, 5, 33, 23, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Finger Paint', 'google'];
    $scope.font[367] = ['Fjalla One', 'FjallaOne-Regular.ttf', 359, 'Sans Serif', 27, 0, 23, 8, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fjalla One', 'google'];
    $scope.font[368] = ['Fjord One', 'FjordOne-Regular.ttf', 255, 'Serif', 15, 70, 41, 49, 48, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fjord One', 'google'];
    $scope.font[369] = ['Flamenco', 'Flamenco-Light.ttf', 203, 'Slab Serif', 2, 37, 65, 88, 76, 300, 'Normal', 'http://www.google.com/fonts/specimen/Flamenco', 'google'];
    $scope.font[370] = ['Flamenco', 'Flamenco-Regular.ttf', 206, 'Slab Serif', 22, 30, 64, 88, 74, 400, 'Normal', 'http://www.google.com/fonts/specimen/Flamenco', 'google'];
    $scope.font[371] = ['Fondamento', 'Fondamento-Italic.ttf', 267, 'Script', 15, 26, 29, 30, 33, 400, 'Italic', 'http://www.google.com/fonts/specimen/Fondamento', 'google'];
    $scope.font[372] = ['Fondamento', 'Fondamento-Regular.ttf', 267, 'Script', 14, 26, 28, 30, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fondamento', 'google'];
    $scope.font[373] = ['Fontdiner Swanky', 'FontdinerSwanky.ttf', 279, 'Fun', 63, 30, 42, 62, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fontdiner Swanky', 'google'];
    $scope.font[374] = ['Forum', 'Forum-Regular.ttf', 231, 'Serif', 9, 32, 38, 79, 32, 400, 'Normal', 'http://www.google.com/fonts/specimen/Forum', 'google'];
    $scope.font[375] = ['Francois One', 'FrancoisOne.ttf', 304, 'Sans Serif', 38, 0, 37, 24, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Francois One', 'google'];
    $scope.font[376] = ['Freckle Face', 'FreckleFace-Regular.ttf', 227, 'Fun', 34, 10, 38, 47, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Freckle Face', 'google'];
    $scope.font[377] = ['Fredericka the Great', 'FrederickatheGreat-Regular.ttf', 262, 'Fun', 29, 48, 36, 42, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fredericka the Great', 'google'];
    $scope.font[378] = ['Fredoka One', 'FredokaOne-Regular.ttf', 281, 'Sans Serif', 52, 0, 55, 48, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fredoka One', 'google'];
    $scope.font[379] = ['Fresca', 'Fresca-Regular.ttf', 261, 'Sans Serif', 24, 82, 47, 40, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fresca', 'google'];
    $scope.font[380] = ['Frijole', 'Frijole-Regular.ttf', 348, 'Fun', 47, 24, 44, 42, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Frijole', 'google'];
    $scope.font[381] = ['Fruktur', 'Fruktur-Regular.ttf', 318, 'Script', 21, 27, 15, 17, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fruktur', 'google'];
    $scope.font[382] = ['Fugaz One', 'FugazOne-Regular.ttf', 265, 'Sans Serif', 54, 89, 63, 48, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Fugaz One', 'google'];
    $scope.font[383] = ['GFS Didot', 'GFSDidot-Regular.ttf', 244, 'Serif', 17, 72, 53, 66, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/GFS Didot', 'google'];
    $scope.font[384] = ['GFS Neohellenic', 'GFSNeohellenic.ttf', 207, 'Serif', 10, 3, 50, 97, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/GFS Neohellenic', 'google'];
    $scope.font[385] = ['GFS Neohellenic', 'GFSNeohellenicBold.ttf', 208, 'Serif', 34, 0, 52, 96, 42, 700, 'Normal', 'http://www.google.com/fonts/specimen/GFS Neohellenic', 'google'];
    $scope.font[386] = ['GFS Neohellenic', 'GFSNeohellenicBoldItalic.ttf', 216, 'Serif', 31, 36, 50, 93, 34, 700, 'Italic', 'http://www.google.com/fonts/specimen/GFS Neohellenic', 'google'];
    $scope.font[387] = ['GFS Neohellenic', 'GFSNeohellenicItalic.ttf', 217, 'Serif', 8, 32, 43, 90, 35, 400, 'Italic', 'http://www.google.com/fonts/specimen/GFS Neohellenic', 'google'];
    $scope.font[388] = ['Gabriela', 'Gabriela-Regular.ttf', 280, 'Serif', 15, 38, 38, 40, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gabriela', 'google'];
    $scope.font[389] = ['Gafata', 'Gafata-Regular.ttf', 262, 'Sans Serif', 17, 0, 48, 41, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gafata', 'google'];
    $scope.font[390] = ['Galdeano', 'Galdeano-Regular.ttf', 241, 'Serif', 18, 9, 32, 48, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Galdeano', 'google'];
    $scope.font[391] = ['Galindo', 'Galindo-Regular.ttf', 268, 'Fun', 32, 8, 40, 42, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Galindo', 'google'];
    $scope.font[392] = ['Gentium Basic', 'GenBasB.ttf', 250, 'Serif', 32, 58, 42, 58, 43, 700, 'Normal', 'http://www.google.com/fonts/specimen/Gentium Basic', 'google'];
    $scope.font[393] = ['Gentium Basic', 'GenBasBI.ttf', 255, 'Serif', 31, 40, 28, 37, 41, 700, 'Italic', 'http://www.google.com/fonts/specimen/Gentium Basic', 'google'];
    $scope.font[394] = ['Gentium Basic', 'GenBasI.ttf', 254, 'Serif', 9, 39, 20, 28, 42, 400, 'Italic', 'http://www.google.com/fonts/specimen/Gentium Basic', 'google'];
    $scope.font[395] = ['Gentium Basic', 'GenBasR.ttf', 250, 'Serif', 10, 61, 34, 46, 43, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gentium Basic', 'google'];
    $scope.font[396] = ['Gentium Book Basic', 'GenBkBasB.ttf', 250, 'Serif', 40, 56, 45, 61, 43, 700, 'Normal', 'http://www.google.com/fonts/specimen/Gentium Book Basic', 'google'];
    $scope.font[397] = ['Gentium Book Basic', 'GenBkBasBI.ttf', 255, 'Serif', 38, 40, 31, 40, 41, 700, 'Italic', 'http://www.google.com/fonts/specimen/Gentium Book Basic', 'google'];
    $scope.font[398] = ['Gentium Book Basic', 'GenBkBasI.ttf', 254, 'Serif', 16, 39, 22, 31, 42, 400, 'Italic', 'http://www.google.com/fonts/specimen/Gentium Book Basic', 'google'];
    $scope.font[399] = ['Gentium Book Basic', 'GenBkBasR.ttf', 250, 'Serif', 18, 60, 37, 51, 43, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gentium Book Basic', 'google'];
    $scope.font[400] = ['Geo', 'Geo-Oblique.ttf', 235, 'Fun', 17, 0, 33, 32, 24, 'Oblique', 'Normal', 'http://www.google.com/fonts/specimen/Geo', 'google'];
    $scope.font[401] = ['Geo', 'Geo-Regular.ttf', 235, 'Fun', 17, 0, 33, 31, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Geo', 'google'];
    $scope.font[402] = ['Geostar Fill', 'GeostarFill-Regular.ttf', 250, 'Fun', 39, 49, 64, 67, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Geostar Fill', 'google'];
    $scope.font[403] = ['Germania One', 'GermaniaOne-Regular.ttf', 295, 'Fun', 25, 7, 19, 20, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Germania One', 'google'];
    $scope.font[404] = ['Gilda Display', 'GildaDisplay-Regular.ttf', 258, 'Serif', 8, 74, 41, 48, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gilda Display', 'google'];
    $scope.font[405] = ['Give You Glory', 'GiveYouGlory.ttf', 259, 'Script', 0, 4, 31, 16, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Give You Glory', 'google'];
    $scope.font[406] = ['Glass Antiqua', 'GlassAntiqua-Regular.ttf', 256, 'Slab Serif', 17, 25, 35, 51, 2, 400, 'Normal', 'http://www.google.com/fonts/specimen/Glass Antiqua', 'google'];
    $scope.font[407] = ['Glegoo', 'Glegoo-Regular.ttf', 305, 'Slab Serif', 19, 25, 45, 23, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/Glegoo', 'google'];
    $scope.font[408] = ['Gloria Hallelujah', 'GloriaHallelujah.ttf', 270, 'Script', 13, 10, 37, 30, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gloria Hallelujah', 'google'];
    $scope.font[409] = ['Goblin One', 'GoblinOne.ttf', 289, 'Serif', 74, 100, 100, 94, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Goblin One', 'google'];
    $scope.font[410] = ['Gochi Hand', 'GochiHand-Regular.ttf', 222, 'Script', 24, 0, 36, 46, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gochi Hand', 'google'];
    $scope.font[411] = ['Gorditas', 'Gorditas-Bold.ttf', 272, 'Script', 35, 34, 41, 30, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Gorditas', 'google'];
    $scope.font[412] = ['Gorditas', 'Gorditas-Regular.ttf', 274, 'Script', 25, 37, 38, 26, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gorditas', 'google'];
    $scope.font[413] = ['Goudy Bookletter 1911', 'GoudyBookletter1911.ttf', 240, 'Serif', 12, 64, 36, 61, 43, 400, 'Normal', 'http://www.google.com/fonts/specimen/Goudy Bookletter 1911', 'google'];
    $scope.font[414] = ['Graduate', 'Graduate-Regular.ttf', 347, 'All Caps', 16, 33, 51, 29, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Graduate', 'google'];
    $scope.font[415] = ['Grand Hotel', 'GrandHotel-Regular.ttf', 219, 'Script', 32, 16, 18, 28, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Grand Hotel', 'google'];
    $scope.font[416] = ['Gravitas One', 'GravitasOne.ttf', 290, 'Serif', 100, 64, 92, 79, 9, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gravitas One', 'google'];
    $scope.font[417] = ['Great Vibes', 'GreatVibes-Regular.ttf', 180, 'Script', 22, 8, 34, 41, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Great Vibes', 'google'];
    $scope.font[418] = ['Griffy', 'Griffy-Regular.ttf', 255, 'Fun', 14, 35, 31, 35, 32, 400, 'Normal', 'http://www.google.com/fonts/specimen/Griffy', 'google'];
    $scope.font[419] = ['Gruppo', 'Gruppo-Regular.ttf', 200, 'Sans Serif', 15, 0, 82, 100, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gruppo', 'google'];
    $scope.font[420] = ['Gudea', 'Gudea-Bold.ttf', 267, 'Sans Serif', 40, 0, 50, 43, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Gudea', 'google'];
    $scope.font[421] = ['Gudea', 'Gudea-Italic.ttf', 267, 'Sans Serif', 19, 0, 40, 34, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/Gudea', 'google'];
    $scope.font[422] = ['Gudea', 'Gudea-Regular.ttf', 267, 'Sans Serif', 21, 0, 47, 40, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Gudea', 'google'];
    $scope.font[423] = ['Habibi', 'Habibi-Regular.ttf', 264, 'Serif', 12, 52, 46, 52, 47, 400, 'Normal', 'http://www.google.com/fonts/specimen/Habibi', 'google'];
    $scope.font[424] = ['Hammersmith One', 'HammersmithOne-Regular.ttf', 272, 'Sans Serif', 36, 2, 55, 49, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Hammersmith One', 'google'];
    $scope.font[425] = ['Hammersmith One', 'HammersmithOne.ttf', 272, 'Sans Serif', 36, 2, 52, 50, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Hammersmith One', 'google'];
    $scope.font[426] = ['Hanalei', 'Hanalei-Regular.ttf', 377, 'Fun', 27, 0, 16, 18, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Hanalei', 'google'];
    $scope.font[427] = ['Hanalei Fill', 'HanaleiFill-Regular.ttf', 377, 'Fun', 23, 7, 16, 18, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Hanalei Fill', 'google'];
    $scope.font[428] = ['Handlee', 'Handlee-Regular.ttf', 253, 'Script', 8, 1, 24, 27, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Handlee', 'google'];
    $scope.font[429] = ['Hanuman', 'Hanuman.ttf', 296, 'Sans Serif', 18, 0, 43, 33, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Hanuman', 'google'];
    $scope.font[430] = ['Hanuman', 'Hanumanb.ttf', 296, 'Sans Serif', 18, 0, 43, 33, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Hanuman', 'google'];
    $scope.font[431] = ['Happy Monkey', 'HappyMonkey-Regular.ttf', 267, 'Sans Serif', 21, 0, 63, 55, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Happy Monkey', 'google'];
    $scope.font[432] = ['Headland One', 'HeadlandOne-Regular.ttf', 316, 'Serif', 13, 58, 39, 27, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Headland One', 'google'];
    $scope.font[433] = ['Henny Penny', 'HennyPenny-Regular.ttf', 293, 'Fun', 17, 37, 26, 37, 44, 400, 'Normal', 'http://www.google.com/fonts/specimen/Henny Penny', 'google'];
    $scope.font[434] = ['Herr Von Muellerhoff', 'HerrVonMuellerhoff-Regular.ttf', 148, 'Script', 22, 56, 31, 46, 71, 400, 'Normal', 'http://www.google.com/fonts/specimen/Herr Von Muellerhoff', 'google'];
    $scope.font[435] = ['Holtwood One SC', 'HoltwoodOneSC.ttf', 367, 'All Caps', 53, 24, 62, 46, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Holtwood One SC', 'google'];
    $scope.font[436] = ['Homemade Apple', 'HomemadeApple.ttf', 195, 'Script', 44, 56, 87, 26, 85, 400, 'Normal', 'http://www.google.com/fonts/specimen/Homemade Apple', 'google'];
    $scope.font[437] = ['Homenaje', 'Homenaje-Regular.ttf', 278, 'Sans Serif', 23, 0, 25, 17, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Homenaje', 'google'];
    $scope.font[438] = ['IM Fell Double Pica', 'IMFeDPit28P.ttf', 229, 'Serif', 20, 50, 31, 24, 49, 400, 'Italic', 'http://www.google.com/fonts/specimen/IM Fell Double Pica', 'google'];
    $scope.font[439] = ['IM Fell Double Pica', 'IMFeDPrm28P.ttf', 229, 'Serif', 22, 69, 41, 72, 55, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell Double Pica', 'google'];
    $scope.font[440] = ['IM Fell Double Pica SC', 'IMFeDPsc28P.ttf', 245, 'All Caps', 24, 41, 52, 60, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell Double Pica SC', 'google'];
    $scope.font[441] = ['IM Fell English', 'IMFeENit28P.ttf', 226, 'Serif', 10, 62, 30, 24, 64, 400, 'Italic', 'http://www.google.com/fonts/specimen/IM Fell English', 'google'];
    $scope.font[442] = ['IM Fell English', 'IMFeENrm28P.ttf', 240, 'Serif', 18, 61, 41, 76, 50, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell English', 'google'];
    $scope.font[443] = ['IM Fell English SC', 'IMFeENsc28P.ttf', 240, 'All Caps', 21, 48, 56, 67, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell English SC', 'google'];
    $scope.font[444] = ['IM Fell French Canon', 'IMFeFCit28P.ttf', 255, 'Serif', 13, 37, 31, 25, 26, 400, 'Italic', 'http://www.google.com/fonts/specimen/IM Fell French Canon', 'google'];
    $scope.font[445] = ['IM Fell French Canon', 'IMFeFCrm28P.ttf', 253, 'Serif', 20, 68, 38, 61, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell French Canon', 'google'];
    $scope.font[446] = ['IM Fell French Canon SC', 'IMFeFCsc28P.ttf', 257, 'All Caps', 22, 42, 54, 60, 9, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell French Canon SC', 'google'];
    $scope.font[447] = ['IM Fell Great Primer', 'IMFeGPit28P.ttf', 250, 'Serif', 14, 42, 30, 18, 36, 400, 'Italic', 'http://www.google.com/fonts/specimen/IM Fell Great Primer', 'google'];
    $scope.font[448] = ['IM Fell Great Primer', 'IMFeGPrm28P.ttf', 241, 'Serif', 21, 65, 36, 66, 42, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell Great Primer', 'google'];
    $scope.font[449] = ['IM Fell Great Primer SC', 'IMFeGPsc28P.ttf', 256, 'All Caps', 22, 60, 52, 58, 8, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell Great Primer SC', 'google'];
    $scope.font[450] = ['IM Fell DW Pica', 'IMFePIit28P.ttf', 229, 'Serif', 24, 40, 35, 24, 52, 400, 'Italic', 'http://www.google.com/fonts/specimen/IM Fell DW Pica', 'google'];
    $scope.font[451] = ['IM Fell DW Pica', 'IMFePIrm28P.ttf', 228, 'Serif', 20, 50, 43, 69, 54, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell DW Pica', 'google'];
    $scope.font[452] = ['IM Fell DW Pica SC', 'IMFePIsc28P.ttf', 245, 'All Caps', 26, 51, 52, 60, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/IM Fell DW Pica SC', 'google'];
    $scope.font[453] = ['Iceberg', 'Iceberg-Regular.ttf', 286, 'Sans Serif', 27, 0, 40, 25, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Iceberg', 'google'];
    $scope.font[454] = ['Iceland', 'Iceland-Regular.ttf', 195, 'Sans Serif', 28, 0, 67, 78, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Iceland', 'google'];
    $scope.font[455] = ['Imprima', 'Imprima-Regular.ttf', 267, 'Sans Serif', 22, 0, 49, 39, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Imprima', 'google'];
    $scope.font[456] = ['Inconsolata', 'Inconsolata-Bold.ttf', 249, 'Monospace', 64, 28, 32, 51, 59, 700, 'Normal', 'http://www.google.com/fonts/specimen/Inconsolata', 'google'];
    $scope.font[457] = ['Inconsolata', 'Inconsolata-Regular.ttf', 244, 'Monospace', 32, 33, 35, 51, 64, 400, 'Normal', 'http://www.google.com/fonts/specimen/Inconsolata', 'google'];
    $scope.font[458] = ['Inder', 'Inder-Regular.ttf', 269, 'Sans Serif', 28, 0, 56, 47, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Inder', 'google'];
    $scope.font[459] = ['Indie Flower', 'IndieFlower.ttf', 237, 'Script', 10, 2, 32, 42, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Indie Flower', 'google'];
    $scope.font[460] = ['Inika', 'Inika-Bold.ttf', 273, 'Serif', 35, 59, 39, 49, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Inika', 'google'];
    $scope.font[461] = ['Inika', 'Inika-Regular.ttf', 274, 'Serif', 12, 65, 39, 34, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Inika', 'google'];
    $scope.font[462] = ['Irish Grover', 'IrishGrover.ttf', 201, 'Fun', 25, 27, 52, 66, 46, 400, 'Normal', 'http://www.google.com/fonts/specimen/Irish Grover', 'google'];
    $scope.font[463] = ['Irish Growler', 'IrishGrowler.ttf', 201, 'Fun', 25, 27, 52, 66, 46, 400, 'Normal', 'http://www.google.com/fonts/specimen/Irish Growler', 'google'];
    $scope.font[464] = ['Istok Web', 'IstokWeb-Bold.ttf', 273, 'Sans Serif', 40, 0, 56, 47, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Istok Web', 'google'];
    $scope.font[465] = ['Istok Web', 'IstokWeb-BoldItalic.ttf', 273, 'Sans Serif', 25, 0, 52, 44, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Istok Web', 'google'];
    $scope.font[466] = ['Istok Web', 'IstokWeb-Italic.ttf', 273, 'Sans Serif', 25, 0, 52, 44, 20, 400, 'Italic', 'http://www.google.com/fonts/specimen/Istok Web', 'google'];
    $scope.font[467] = ['Istok Web', 'IstokWeb-Regular.ttf', 273, 'Sans Serif', 24, 0, 51, 43, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Istok Web', 'google'];
    $scope.font[468] = ['Italiana', 'Italiana-Regular.ttf', 267, 'Serif', 8, 17, 30, 48, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Italiana', 'google'];
    $scope.font[469] = ['Italianno', 'Italianno-Regular.ttf', 158, 'Script', 14, 22, 29, 51, 51, 400, 'Normal', 'http://www.google.com/fonts/specimen/Italianno', 'google'];
    $scope.font[470] = ['Jacques Francois', 'JacquesFrancois-Regular.ttf', 238, 'Serif', 21, 76, 55, 60, 51, 400, 'Normal', 'http://www.google.com/fonts/specimen/Jacques Francois', 'google'];
    $scope.font[471] = ['Jacques Francois Shadow', 'JacquesFrancoisShadow-Regular.ttf', 259, 'Fun', 36, 38, 42, 44, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Jacques Francois Shadow', 'google'];
    $scope.font[472] = ['Jim Nightshade', 'JimNightshade-Regular.ttf', 221, 'Script', 9, 19, 15, 16, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Jim Nightshade', 'google'];
    $scope.font[473] = ['Jockey One', 'JockeyOne-Regular.ttf', 273, 'Sans Serif', 40, 0, 37, 37, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Jockey One', 'google'];
    $scope.font[474] = ['Jolly Lodger', 'JollyLodger-Regular.ttf', 199, 'Fun', 29, 0, 22, 34, 47, 400, 'Normal', 'http://www.google.com/fonts/specimen/Jolly Lodger', 'google'];
    $scope.font[475] = ['Josefin Sans', 'JosefinSans-Bold.ttf', 200, 'Sans Serif', 34, 0, 72, 77, 71, 700, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[476] = ['Josefin Sans', 'JosefinSans-BoldItalic.ttf', 200, 'Sans Serif', 33, 2, 73, 79, 71, 700, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[477] = ['Josefin Sans', 'JosefinSans-Italic.ttf', 200, 'Sans Serif', 15, 0, 71, 76, 71, 400, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[478] = ['Josefin Sans', 'JosefinSans-Light.ttf', 200, 'Sans Serif', 9, 0, 70, 76, 71, 300, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[479] = ['Josefin Sans', 'JosefinSans-LightItalic.ttf', 200, 'Sans Serif', 9, 0, 70, 76, 71, 300, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[480] = ['Josefin Sans', 'JosefinSans-Regular.ttf', 200, 'Sans Serif', 15, 0, 71, 76, 71, 400, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[481] = ['Josefin Sans', 'JosefinSans-SemiBold.ttf', 200, 'Sans Serif', 25, 0, 71, 77, 71, 600, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[482] = ['Josefin Sans', 'JosefinSans-SemiBoldItalic.ttf', 200, 'Sans Serif', 25, 0, 72, 79, 71, 600, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[483] = ['Josefin Sans', 'JosefinSans-Thin.ttf', 200, 'Sans Serif', 3, 0, 69, 76, 71, 100, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[484] = ['Josefin Sans', 'JosefinSans-ThinItalic.ttf', 200, 'Sans Serif', 3, 2, 70, 76, 71, 100, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Sans', 'google'];
    $scope.font[485] = ['Josefin Slab', 'JosefinSlab-Bold.ttf', 200, 'Slab Serif', 39, 71, 88, 98, 77, 700, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[486] = ['Josefin Slab', 'JosefinSlab-BoldItalic.ttf', 200, 'Slab Serif', 40, 72, 89, 100, 77, 700, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[487] = ['Josefin Slab', 'JosefinSlab-Italic.ttf', 200, 'Slab Serif', 16, 79, 85, 96, 77, 400, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[488] = ['Josefin Slab', 'JosefinSlab-Light.ttf', 200, 'Slab Serif', 8, 84, 81, 96, 77, 300, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[489] = ['Josefin Slab', 'JosefinSlab-LightItalic.ttf', 200, 'Slab Serif', 9, 84, 82, 96, 77, 300, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[490] = ['Josefin Slab', 'JosefinSlab-Regular.ttf', 200, 'Slab Serif', 14, 79, 84, 96, 77, 400, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[491] = ['Josefin Slab', 'JosefinSlab-SemiBold.ttf', 200, 'Slab Serif', 27, 74, 86, 98, 77, 600, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[492] = ['Josefin Slab', 'JosefinSlab-SemiBoldItalic.ttf', 200, 'Slab Serif', 28, 76, 87, 100, 77, 600, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[493] = ['Josefin Slab', 'JosefinSlab-Thin.ttf', 200, 'Slab Serif', 0, 85, 80, 96, 77, 100, 'Normal', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[494] = ['Josefin Slab', 'JosefinSlab-ThinItalic.ttf', 200, 'Slab Serif', 1, 85, 81, 96, 77, 100, 'Italic', 'http://www.google.com/fonts/specimen/Josefin Slab', 'google'];
    $scope.font[495] = ['Joti One', 'JotiOne-Regular.ttf', 282, 'Script', 20, 21, 34, 21, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Joti One', 'google'];
    $scope.font[496] = ['Judson', 'Judson-Bold.ttf', 241, 'Serif', 40, 56, 49, 75, 14, 700, 'Normal', 'http://www.google.com/fonts/specimen/Judson', 'google'];
    $scope.font[497] = ['Judson', 'Judson-Italic.ttf', 241, 'Serif', 21, 29, 40, 73, 14, 400, 'Italic', 'http://www.google.com/fonts/specimen/Judson', 'google'];
    $scope.font[498] = ['Judson', 'Judson-Regular.ttf', 241, 'Serif', 21, 56, 43, 69, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Judson', 'google'];
    $scope.font[499] = ['Julee', 'Julee-Regular.ttf', 266, 'Script', 5, 13, 18, 21, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Julee', 'google'];
    $scope.font[500] = ['Julius Sans One', 'JuliusSansOne-Regular.ttf', 346, 'All Caps', 7, 0, 49, 40, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Julius Sans One', 'google'];
    $scope.font[501] = ['Junge', 'Junge-Regular.ttf', 276, 'Serif', 6, 36, 39, 39, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Junge', 'google'];
    $scope.font[502] = ['Jura', 'Jura-DemiBold.ttf', 264, 'Sans Serif', 20, 0, 61, 64, 9, 600, 'Normal', 'http://www.google.com/fonts/specimen/Jura', 'google'];
    $scope.font[503] = ['Jura', 'Jura-Light.ttf', 248, 'Sans Serif', 11, 0, 55, 54, 17, 300, 'Normal', 'http://www.google.com/fonts/specimen/Jura', 'google'];
    $scope.font[504] = ['Jura', 'Jura-Medium.ttf', 258, 'Sans Serif', 17, 0, 59, 61, 12, 500, 'Normal', 'http://www.google.com/fonts/specimen/Jura', 'google'];
    $scope.font[505] = ['Jura', 'Jura-Regular.ttf', 253, 'Sans Serif', 15, 0, 58, 58, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Jura', 'google'];
    $scope.font[506] = ['Just Another Hand', 'JustAnotherHand.ttf', 186, 'Script', 14, 4, 4, 21, 43, 400, 'Normal', 'http://www.google.com/fonts/specimen/Just Another Hand', 'google'];
    $scope.font[507] = ['Just Me Again Down Here', 'JustMeAgainDownHere.ttf', 203, 'Script', 11, 1, 21, 28, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Just Me Again Down Here', 'google'];
    $scope.font[508] = ['Kameron', 'Kameron-Bold.ttf', 237, 'Slab Serif', 63, 43, 80, 90, 15, 700, 'Normal', 'http://www.google.com/fonts/specimen/Kameron', 'google'];
    $scope.font[509] = ['Kameron', 'Kameron-Regular.ttf', 234, 'Slab Serif', 32, 60, 66, 75, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kameron', 'google'];
    $scope.font[510] = ['Karla', 'Karla-Bold.ttf', 260, 'Sans Serif', 37, 0, 59, 47, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Karla', 'google'];
    $scope.font[511] = ['Karla', 'Karla-BoldItalic.ttf', 261, 'Sans Serif', 34, 0, 51, 41, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Karla', 'google'];
    $scope.font[512] = ['Karla', 'Karla-Italic.ttf', 256, 'Sans Serif', 21, 0, 49, 39, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Karla', 'google'];
    $scope.font[513] = ['Karla', 'Karla-Regular.ttf', 256, 'Sans Serif', 24, 0, 57, 46, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Karla', 'google'];
    $scope.font[514] = ['Kaushan Script', 'KaushanScript-Regular.ttf', 229, 'Script', 21, 0, 32, 27, 49, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kaushan Script', 'google'];
    $scope.font[515] = ['Kavoon', 'Kavoon-Regular.ttf', 314, 'Script', 30, 17, 23, 21, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kavoon', 'google'];
    $scope.font[516] = ['Keania One', 'KeaniaOne-Regular.ttf', 266, 'Fun', 32, 0, 30, 36, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Keania One', 'google'];
    $scope.font[517] = ['Kelly Slab', 'KellySlab-Regular.ttf', 267, 'Slab Serif', 27, 39, 47, 26, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kelly Slab', 'google'];
    $scope.font[518] = ['Kenia', 'Kenia-Regular.ttf', 271, 'Fun', 27, 0, 21, 25, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kenia', 'google'];
    $scope.font[519] = ['Kite One', 'KiteOne-Regular.ttf', 279, 'Sans Serif', 20, 2, 47, 39, 47, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kite One', 'google'];
    $scope.font[520] = ['Knewave', 'Knewave-Regular.ttf', 307, 'Script', 33, 0, 20, 23, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Knewave', 'google'];
    $scope.font[521] = ['Kotta One', 'KottaOne-Regular.ttf', 267, 'Serif', 9, 37, 31, 37, 43, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kotta One', 'google'];
    $scope.font[522] = ['Kranky', 'Kranky.ttf', 225, 'Fun', 26, 40, 44, 53, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kranky', 'google'];
    $scope.font[523] = ['Kreon', 'Kreon-Bold.ttf', 263, 'Slab Serif', 45, 29, 44, 46, 21, 700, 'Normal', 'http://www.google.com/fonts/specimen/Kreon', 'google'];
    $scope.font[524] = ['Kreon', 'Kreon-Light.ttf', 257, 'Slab Serif', 21, 36, 38, 41, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Kreon', 'google'];
    $scope.font[525] = ['Kreon', 'Kreon-Regular.ttf', 259, 'Slab Serif', 32, 36, 42, 44, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kreon', 'google'];
    $scope.font[526] = ['Kristi', 'Kristi.ttf', 219, 'Script', 4, 32, 0, 5, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Kristi', 'google'];
    $scope.font[527] = ['Krona One', 'KronaOne-Regular.ttf', 308, 'Sans Serif', 38, 0, 73, 54, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Krona One', 'google'];
    $scope.font[528] = ['La Belle Aurore', 'LaBelleAurore.ttf', 171, 'Script', 15, 69, 64, 39, 43, 400, 'Normal', 'http://www.google.com/fonts/specimen/La Belle Aurore', 'google'];
    $scope.font[529] = ['Lancelot', 'Lancelot-Regular.ttf', 213, 'Serif', 8, 67, 40, 67, 54, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lancelot', 'google'];
    $scope.font[530] = ['Lato', 'Lato-Black.ttf', 277, 'Sans Serif', 46, 0, 52, 48, 23, 900, 'Normal', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[531] = ['Lato', 'Lato-BlackItalic.ttf', 276, 'Sans Serif', 46, 0, 46, 43, 23, 900, 'Italic', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[532] = ['Lato', 'Lato-Bold.ttf', 274, 'Sans Serif', 36, 0, 50, 47, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[533] = ['Lato', 'Lato-BoldItalic.ttf', 274, 'Sans Serif', 36, 2, 45, 40, 23, 700, 'Italic', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[534] = ['Lato', 'Lato-Hairline.ttf', 261, 'Sans Serif', 0, 0, 48, 41, 26, 100, 'Normal', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[535] = ['Lato', 'Lato-HairlineItalic.ttf', 261, 'Sans Serif', 1, 0, 41, 37, 26, 100, 'Italic', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[536] = ['Lato', 'Lato-Italic.ttf', 270, 'Sans Serif', 25, 0, 44, 39, 24, 400, 'Italic', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[537] = ['Lato', 'Lato-Light.ttf', 265, 'Sans Serif', 12, 0, 49, 44, 25, 300, 'Normal', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[538] = ['Lato', 'Lato-LightItalic.ttf', 265, 'Sans Serif', 13, 0, 43, 39, 25, 300, 'Italic', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[539] = ['Lato', 'Lato-Regular.ttf', 270, 'Sans Serif', 25, 0, 49, 45, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lato', 'google'];
    $scope.font[540] = ['League Script', 'LeagueScript.ttf', 184, 'Script', 3, 22, 60, 45, 45, 400, 'Normal', 'http://www.google.com/fonts/specimen/League Script', 'google'];
    $scope.font[541] = ['Leckerli One', 'LeckerliOne-Regular.ttf', 267, 'Script', 47, 13, 31, 32, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Leckerli One', 'google'];
    $scope.font[542] = ['Ledger', 'Ledger-Regular.ttf', 259, 'Slab Serif', 34, 48, 70, 56, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ledger', 'google'];
    $scope.font[543] = ['Lekton', 'Lekton-Bold.ttf', 253, 'Monospace', 55, 33, 29, 41, 36, 700, 'Normal', 'http://www.google.com/fonts/specimen/Lekton', 'google'];
    $scope.font[544] = ['Lekton', 'Lekton-Italic.ttf', 260, 'Monospace', 16, 0, 24, 23, 8, 400, 'Italic', 'http://www.google.com/fonts/specimen/Lekton', 'google'];
    $scope.font[545] = ['Lekton', 'Lekton-Regular.ttf', 254, 'Monospace', 17, 35, 28, 31, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lekton', 'google'];
    $scope.font[546] = ['Lemon', 'Lemon-Regular.ttf', 334, 'Script', 30, 15, 32, 23, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lemon', 'google'];
    $scope.font[547] = ['Lemon One', 'LemonOne-Regular.ttf', 334, 'Script', 30, 15, 32, 23, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lemon One', 'google'];
    $scope.font[548] = ['Libre Baskerville', 'LibreBaskerville-Bold.ttf', 288, 'Serif', 35, 68, 51, 54, 34, 700, 'Normal', 'http://www.google.com/fonts/specimen/Libre Baskerville', 'google'];
    $scope.font[549] = ['Libre Baskerville', 'LibreBaskerville-Italic.ttf', 294, 'Serif', 14, 40, 29, 16, 32, 400, 'Italic', 'http://www.google.com/fonts/specimen/Libre Baskerville', 'google'];
    $scope.font[550] = ['Libre Baskerville', 'LibreBaskerville-Regular.ttf', 288, 'Serif', 15, 74, 47, 48, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Libre Baskerville', 'google'];
    $scope.font[551] = ['Life Savers', 'LifeSavers-Bold.ttf', 233, 'Fun', 15, 56, 40, 49, 47, 700, 'Normal', 'http://www.google.com/fonts/specimen/Life Savers', 'google'];
    $scope.font[552] = ['Life Savers', 'LifeSavers-Regular.ttf', 233, 'Fun', 8, 58, 37, 45, 47, 400, 'Normal', 'http://www.google.com/fonts/specimen/Life Savers', 'google'];
    $scope.font[553] = ['Lilita One', 'LilitaOne-Regular.ttf', 271, 'Sans Serif', 56, 2, 47, 42, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lilita One', 'google'];
    $scope.font[554] = ['Lily Script One', 'LilyScriptOne-Regular.ttf', 260, 'Script', 40, 22, 25, 34, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lily Script One', 'google'];
    $scope.font[555] = ['Limelight', 'Limelight-Regular.ttf', 278, 'Serif', 69, 0, 51, 55, 5, 400, 'Normal', 'http://www.google.com/fonts/specimen/Limelight', 'google'];
    $scope.font[556] = ['Limelight', 'Limelight.ttf', 278, 'Serif', 69, 0, 51, 55, 5, 400, 'Normal', 'http://www.google.com/fonts/specimen/Limelight', 'google'];
    $scope.font[557] = ['Linden Hill', 'LindenHill-Italic.ttf', 217, 'Serif', 10, 42, 23, 31, 63, 400, 'Italic', 'http://www.google.com/fonts/specimen/Linden Hill', 'google'];
    $scope.font[558] = ['Linden Hill', 'LindenHill-Regular.ttf', 217, 'Serif', 15, 75, 44, 85, 66, 400, 'Normal', 'http://www.google.com/fonts/specimen/Linden Hill', 'google'];
    $scope.font[559] = ['Lobster', 'Lobster.ttf', 271, 'Script', 25, 33, 16, 18, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lobster 1.4', 'google'];
    $scope.font[560] = ['Lobster Two', 'LobsterTwo-Bold.ttf', 270, 'Script', 25, 38, 20, 21, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Lobster Two', 'google'];
    $scope.font[561] = ['Lobster Two', 'LobsterTwo-BoldItalic.ttf', 270, 'Script', 25, 38, 19, 23, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Lobster Two', 'google'];
    $scope.font[562] = ['Lobster Two', 'LobsterTwo-Italic.ttf', 270, 'Script', 15, 28, 15, 21, 20, 400, 'Italic', 'http://www.google.com/fonts/specimen/Lobster Two', 'google'];
    $scope.font[563] = ['Lobster Two', 'LobsterTwo-Regular.ttf', 270, 'Script', 15, 31, 15, 20, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lobster Two', 'google'];
    $scope.font[564] = ['Londrina Solid', 'LondrinaSolid-Regular.ttf', 271, 'Sans Serif', 42, 2, 39, 33, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Londrina Solid', 'google'];
    $scope.font[565] = ['Lora', 'Lora-Bold.ttf', 272, 'Serif', 40, 49, 41, 45, 25, 700, 'Normal', 'http://www.google.com/fonts/specimen/Lora', 'google'];
    $scope.font[566] = ['Lora', 'Lora-BoldItalic.ttf', 278, 'Serif', 33, 37, 31, 31, 24, 700, 'Italic', 'http://www.google.com/fonts/specimen/Lora', 'google'];
    $scope.font[567] = ['Lora', 'Lora-Italic.ttf', 278, 'Serif', 10, 36, 30, 28, 24, 400, 'Italic', 'http://www.google.com/fonts/specimen/Lora', 'google'];
    $scope.font[568] = ['Lora', 'Lora-Regular.ttf', 272, 'Serif', 14, 48, 39, 45, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lora', 'google'];
    $scope.font[569] = ['Love Ya Like A Sister', 'LoveYaLikeASister.ttf', 271, 'Fun', 16, 39, 32, 38, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Love Ya Like A Sister', 'google'];
    $scope.font[570] = ['Loved by the King', 'LovedbytheKing.ttf', 246, 'Script', 1, 8, 11, 7, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Loved by the King', 'google'];
    $scope.font[571] = ['Lovers Quarrel', 'LoversQuarrel-Regular.ttf', 120, 'Script', 26, 9, 38, 49, 74, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lovers Quarrel', 'google'];
    $scope.font[572] = ['Luckiest Guy', 'LuckiestGuy.ttf', 361, 'All Caps', 44, 4, 38, 38, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Luckiest Guy', 'google'];
    $scope.font[573] = ['Lusitana', 'Lusitana-Bold.ttf', 246, 'Serif', 38, 58, 47, 78, 51, 700, 'Normal', 'http://www.google.com/fonts/specimen/Lusitana', 'google'];
    $scope.font[574] = ['Lusitana', 'Lusitana-Regular.ttf', 242, 'Serif', 19, 55, 45, 69, 53, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lusitana', 'google'];
    $scope.font[575] = ['Lustria', 'Lustria-Regular.ttf', 276, 'Serif', 10, 61, 39, 48, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Lustria', 'google'];
    $scope.font[576] = ['Macondo', 'Macondo-Regular.ttf', 248, 'Script', 7, 8, 29, 32, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Macondo', 'google'];
    $scope.font[577] = ['Macondo Swash Caps', 'MacondoSwashCaps-Regular.ttf', 248, 'Script', 7, 8, 30, 32, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Macondo Swash Caps', 'google'];
    $scope.font[578] = ['Magra', 'Magra-Bold.ttf', 288, 'Sans Serif', 44, 0, 42, 35, 21, 700, 'Normal', 'http://www.google.com/fonts/specimen/Magra', 'google'];
    $scope.font[579] = ['Magra', 'Magra-Regular.ttf', 283, 'Sans Serif', 25, 0, 42, 33, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Magra', 'google'];
    $scope.font[580] = ['Maiden Orange', 'MaidenOrange.ttf', 272, 'Slab Serif', 30, 17, 13, 8, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Maiden Orange', 'google'];
    $scope.font[581] = ['Mako', 'Mako-Regular.ttf', 268, 'Sans Serif', 26, 0, 50, 40, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mako', 'google'];
    $scope.font[582] = ['Marcellus', 'Marcellus-Regular.ttf', 267, 'Serif', 14, 12, 39, 60, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Marcellus', 'google'];
    $scope.font[583] = ['Marcellus SC', 'MarcellusSC-Regular.ttf', 280, 'All Caps', 19, 7, 51, 57, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Marcellus SC', 'google'];
    $scope.font[584] = ['Marck Script', 'MarckScript-Regular.ttf', 199, 'Script', 10, 40, 44, 37, 47, 400, 'Normal', 'http://www.google.com/fonts/specimen/Marck Script', 'google'];
    $scope.font[585] = ['Margarine', 'Margarine-Regular.ttf', 299, 'Script', 14, 5, 20, 18, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Margarine', 'google'];
    $scope.font[586] = ['Marko One', 'MarkoOne-Regular.ttf', 282, 'Serif', 39, 29, 51, 54, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Marko One', 'google'];
    $scope.font[587] = ['Marmelad', 'Marmelad-Regular.ttf', 268, 'Sans Serif', 30, 0, 55, 45, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Marmelad', 'google'];
    $scope.font[588] = ['Marvel', 'Marvel-Bold.ttf', 267, 'Sans Serif', 18, 2, 32, 22, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Marvel', 'google'];
    $scope.font[589] = ['Marvel', 'Marvel-BoldItalic.ttf', 267, 'Sans Serif', 18, 0, 33, 22, 18, 700, 'Italic', 'http://www.google.com/fonts/specimen/Marvel', 'google'];
    $scope.font[590] = ['Marvel', 'Marvel-Italic.ttf', 267, 'Sans Serif', 14, 0, 32, 21, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/Marvel', 'google'];
    $scope.font[591] = ['Marvel', 'Marvel-Regular.ttf', 267, 'Sans Serif', 14, 0, 32, 21, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Marvel', 'google'];
    $scope.font[592] = ['Mate', 'Mate-Italic.ttf', 256, 'Serif', 1, 40, 23, 28, 44, 400, 'Italic', 'http://www.google.com/fonts/specimen/Mate', 'google'];
    $scope.font[593] = ['Mate', 'Mate-Regular.ttf', 250, 'Serif', 10, 75, 37, 52, 45, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mate', 'google'];
    $scope.font[594] = ['Mate SC', 'MateSC-Regular.ttf', 261, 'All Caps', 17, 35, 53, 59, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mate SC', 'google'];
    $scope.font[595] = ['Maven Pro', 'MavenPro-Black.ttf', 266, 'Sans Serif', 53, 0, 63, 46, 18, 900, 'Normal', 'http://www.google.com/fonts/specimen/Maven Pro', 'google'];
    $scope.font[596] = ['Maven Pro', 'MavenPro-Bold.ttf', 266, 'Sans Serif', 36, 0, 60, 46, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Maven Pro', 'google'];
    $scope.font[597] = ['Maven Pro', 'MavenPro-Medium.ttf', 266, 'Sans Serif', 26, 0, 57, 46, 18, 500, 'Normal', 'http://www.google.com/fonts/specimen/Maven Pro', 'google'];
    $scope.font[598] = ['Maven Pro', 'MavenPro-Regular.ttf', 266, 'Sans Serif', 21, 0, 56, 46, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Maven Pro', 'google'];
    $scope.font[599] = ['McLaren', 'McLaren-Regular.ttf', 264, 'Sans Serif', 30, 2, 63, 46, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/McLaren', 'google'];
    $scope.font[600] = ['Meddon', 'Meddon.ttf', 202, 'Script', 45, 64, 100, 45, 62, 400, 'Normal', 'http://www.google.com/fonts/specimen/Meddon', 'google'];
    $scope.font[601] = ['MedievalSharp', 'MedievalSharp.ttf', 294, 'Serif', 8, 14, 28, 13, 6, 400, 'Normal', 'http://www.google.com/fonts/specimen/MedievalSharp', 'google'];
    $scope.font[602] = ['Medula One', 'MedulaOne-Regular.ttf', 268, 'Sans Serif', 21, 43, 16, 10, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Medula One', 'google'];
    $scope.font[603] = ['Megrim', 'Megrim.ttf', 309, 'All Caps', 4, 0, 44, 35, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Megrim', 'google'];
    $scope.font[604] = ['Meie Script', 'MeieScript-Regular.ttf', 157, 'Script', 32, 45, 78, 60, 58, 400, 'Normal', 'http://www.google.com/fonts/specimen/Meie Script', 'google'];
    $scope.font[605] = ['Merienda', 'Merienda-Bold.ttf', 319, 'Script', 15, 4, 23, 20, 28, 700, 'Normal', 'http://www.google.com/fonts/specimen/Merienda', 'google'];
    $scope.font[606] = ['Merienda', 'Merienda-Regular.ttf', 319, 'Script', 10, 4, 23, 18, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Merienda', 'google'];
    $scope.font[607] = ['Merienda One', 'MeriendaOne-Regular.ttf', 319, 'Script', 15, 4, 23, 20, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Merienda One', 'google'];
    $scope.font[608] = ['Merriweather', 'Merriweather-Black.ttf', 300, 'Serif', 47, 50, 43, 42, 17, 900, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[609] = ['Merriweather', 'Merriweather-Bold.ttf', 299, 'Serif', 32, 54, 39, 34, 17, 700, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[610] = ['Merriweather', 'Merriweather-BoldItalic.ttf', 309, 'Serif', 25, 30, 23, 18, 16, 700, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[611] = ['Merriweather', 'Merriweather-HeavyItalic.ttf', 309, 'Serif', 40, 31, 26, 24, 16, 900, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[612] = ['Merriweather', 'Merriweather-Italic.ttf', 309, 'Serif', 11, 30, 21, 13, 16, 400, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[613] = ['Merriweather', 'Merriweather-Light.ttf', 295, 'Serif', 4, 60, 36, 27, 19, 300, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[614] = ['Merriweather', 'Merriweather-LightItalic.ttf', 309, 'Serif', 4, 27, 19, 10, 16, 300, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[615] = ['Merriweather', 'Merriweather-Regular.ttf', 297, 'Serif', 14, 59, 35, 25, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather', 'google'];
    $scope.font[616] = ['Merriweather Sans', 'MerriweatherSans-Bold.ttf', 301, 'Sans Serif', 42, 0, 55, 40, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[617] = ['Merriweather Sans', 'MerriweatherSans-BoldItalic.ttf', 301, 'Sans Serif', 36, 2, 47, 34, 21, 700, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[618] = ['Merriweather Sans', 'MerriweatherSans-ExtraBold.ttf', 301, 'Sans Serif', 50, 2, 57, 43, 23, 800, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[619] = ['Merriweather Sans', 'MerriweatherSans-ExtraBoldItalic.ttf', 301, 'Sans Serif', 48, 2, 50, 37, 20, 800, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[620] = ['Merriweather Sans', 'MerriweatherSans-Italic.ttf', 301, 'Sans Serif', 25, 0, 43, 31, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[621] = ['Merriweather Sans', 'MerriweatherSans-Light.ttf', 301, 'Sans Serif', 21, 0, 50, 35, 21, 300, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[622] = ['Merriweather Sans', 'MerriweatherSans-LightItalic.ttf', 301, 'Sans Serif', 18, 0, 43, 30, 21, 300, 'Italic', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[623] = ['Merriweather Sans', 'MerriweatherSans-Regular.ttf', 301, 'Sans Serif', 28, 0, 50, 35, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Merriweather Sans', 'google'];
    $scope.font[624] = ['Metal Mania', 'MetalMania-Regular.ttf', 311, 'Fun', 17, 13, 17, 20, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Metal Mania', 'google'];
    $scope.font[625] = ['Metamorphous', 'Metamorphous-Regular.ttf', 315, 'Fun', 16, 33, 36, 29, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Metamorphous', 'google'];
    $scope.font[626] = ['Metrophobic', 'Metrophobic.ttf', 264, 'Sans Serif', 22, 0, 49, 43, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Metrophobic', 'google'];
    $scope.font[627] = ['Michroma', 'Michroma.ttf', 300, 'Sans Serif', 24, 0, 72, 54, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Michroma', 'google'];
    $scope.font[628] = ['Milonga', 'Milonga-Regular.ttf', 250, 'Serif', 20, 60, 47, 61, 100, 400, 'Normal', 'http://www.google.com/fonts/specimen/Milonga', 'google'];
    $scope.font[629] = ['Miltonian', 'Miltonian-Regular.ttf', 251, 'Fun', 36, 47, 43, 53, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Miltonian', 'google'];
    $scope.font[630] = ['Miltonian Tattoo', 'MiltonianTattoo-Regular.ttf', 251, 'Fun', 33, 50, 44, 53, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Miltonian Tattoo', 'google'];
    $scope.font[631] = ['Miniver', 'Miniver-Regular.ttf', 259, 'Script', 28, 26, 30, 21, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Miniver', 'google'];
    $scope.font[632] = ['Miss Fajardose', 'MissFajardose-Regular.ttf', 95, 'Script', 10, 42, 56, 100, 81, 400, 'Normal', 'http://www.google.com/fonts/specimen/Miss Fajardose', 'google'];
    $scope.font[633] = ['Modern Antiqua', 'ModernAntiqua-Regular.ttf', 287, 'Serif', 17, 70, 39, 19, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Modern Antiqua', 'google'];
    $scope.font[634] = ['Molengo', 'Molengo-Regular.ttf', 245, 'Sans Serif', 25, 100, 55, 51, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Molengo', 'google'];
    $scope.font[635] = ['Molle', 'Molle-Regular.ttf', 232, 'Script', 36, 62, 46, 40, 28, 400, 'Italic', 'http://www.google.com/fonts/specimen/Molle', 'google'];
    $scope.font[636] = ['Monda', 'Monda-Bold.ttf', 280, 'Sans Serif', 38, 0, 53, 36, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Monda', 'google'];
    $scope.font[637] = ['Monda', 'Monda-Regular.ttf', 276, 'Sans Serif', 26, 0, 54, 35, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Monda', 'google'];
    $scope.font[638] = ['Monoton', 'Monoton-Regular.ttf', 375, 'Fun', 37, 0, 31, 27, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Monoton', 'google'];
    $scope.font[639] = ['Monsieur La Doulaise', 'MonsieurLaDoulaise-Regular.ttf', 103, 'Script', 33, 65, 92, 74, 96, 400, 'Normal', 'http://www.google.com/fonts/specimen/Monsieur La Doulaise', 'google'];
    $scope.font[640] = ['Montaga', 'Montaga-Regular.ttf', 254, 'Serif', 14, 53, 40, 57, 42, 400, 'Normal', 'http://www.google.com/fonts/specimen/Montaga', 'google'];
    $scope.font[641] = ['Montez', 'Montez-Regular.ttf', 160, 'Script', 19, 60, 42, 62, 63, 400, 'Normal', 'http://www.google.com/fonts/specimen/Montez', 'google'];
    $scope.font[642] = ['Montserrat', 'Montserrat-Bold.ttf', 287, 'Sans Serif', 43, 0, 58, 48, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Montserrat', 'google'];
    $scope.font[643] = ['Montserrat', 'Montserrat-Regular.ttf', 284, 'Sans Serif', 31, 0, 59, 49, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Montserrat', 'google'];
    $scope.font[644] = ['Montserrat Alternates', 'MontserratAlternates-Bold.ttf', 287, 'Sans Serif', 43, 0, 59, 48, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Montserrat Alternates', 'google'];
    $scope.font[645] = ['Montserrat Alternates', 'MontserratAlternates-Regular.ttf', 284, 'Sans Serif', 32, 0, 60, 49, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Montserrat Alternates', 'google'];
    $scope.font[646] = ['Mountains of Christmas', 'MountainsofChristmas-Bold.ttf', 236, 'Fun', 27, 24, 31, 49, 46, 700, 'Normal', 'http://www.google.com/fonts/specimen/Mountains of Christmas', 'google'];
    $scope.font[647] = ['Mountains of Christmas', 'MountainsofChristmas-Regular.ttf', 217, 'Fun', 16, 37, 33, 55, 54, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mountains of Christmas', 'google'];
    $scope.font[648] = ['Mouse Memoirs', 'MouseMemoirs-Regular.ttf', 264, 'Sans Serif', 32, 20, 23, 17, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mouse Memoirs', 'google'];
    $scope.font[649] = ['Mr Bedfort', 'MrBedfort-Regular.ttf', 163, 'Script', 21, 58, 56, 53, 81, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mr Bedfort', 'google'];
    $scope.font[650] = ['Mr Dafoe', 'MrDafoe-Regular.ttf', 182, 'Script', 59, 20, 36, 33, 42, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mr Dafoe', 'google'];
    $scope.font[651] = ['Mr De Haviland', 'MrDeHaviland-Regular.ttf', 106, 'Script', 20, 41, 53, 62, 81, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mr De Haviland', 'google'];
    $scope.font[652] = ['Mrs Saint Delafield', 'MrsSaintDelafield-Regular.ttf', 115, 'Script', 31, 15, 57, 37, 80, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mrs Saint Delafield', 'google'];
    $scope.font[653] = ['Mrs Sheppards', 'MrsSheppards-Regular.ttf', 167, 'Script', 100, 0, 42, 42, 58, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mrs Sheppards', 'google'];
    $scope.font[654] = ['Muli', 'Muli-Italic.ttf', 267, 'Sans Serif', 23, 0, 57, 50, 24, 400, 'Italic', 'http://www.google.com/fonts/specimen/Muli', 'google'];
    $scope.font[655] = ['Muli', 'Muli-Light.ttf', 267, 'Sans Serif', 16, 0, 57, 49, 25, 300, 'Normal', 'http://www.google.com/fonts/specimen/Muli', 'google'];
    $scope.font[656] = ['Muli', 'Muli-LightItalic.ttf', 267, 'Sans Serif', 16, 2, 58, 49, 26, 300, 'Italic', 'http://www.google.com/fonts/specimen/Muli', 'google'];
    $scope.font[657] = ['Muli', 'Muli-Regular.ttf', 267, 'Sans Serif', 23, 0, 57, 50, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Muli', 'google'];
    $scope.font[658] = ['Mystery Quest', 'MysteryQuest-Regular.ttf', 284, 'Fun', 10, 36, 27, 28, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Mystery Quest', 'google'];
    $scope.font[659] = ['Neucha', 'Neucha.ttf', 269, 'Sans Serif', 25, 2, 37, 27, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Neucha', 'google'];
    $scope.font[660] = ['Neuton', 'Neuton-Bold.ttf', 236, 'Serif', 37, 73, 39, 64, 16, 700, 'Normal', 'http://www.google.com/fonts/specimen/Neuton', 'google'];
    $scope.font[661] = ['Neuton', 'Neuton-ExtraBold.ttf', 242, 'Serif', 55, 70, 45, 66, 11, 800, 'Normal', 'http://www.google.com/fonts/specimen/Neuton', 'google'];
    $scope.font[662] = ['Neuton', 'Neuton-ExtraLight.ttf', 225, 'Serif', 0, 75, 38, 54, 25, 200, 'Normal', 'http://www.google.com/fonts/specimen/Neuton', 'google'];
    $scope.font[663] = ['Neuton', 'Neuton-Italic.ttf', 227, 'Serif', 17, 60, 24, 45, 23, 400, 'Italic', 'http://www.google.com/fonts/specimen/Neuton', 'google'];
    $scope.font[664] = ['Neuton', 'Neuton-Light.ttf', 231, 'Serif', 8, 74, 32, 55, 19, 300, 'Normal', 'http://www.google.com/fonts/specimen/Neuton', 'google'];
    $scope.font[665] = ['Neuton', 'Neuton-Regular.ttf', 231, 'Serif', 19, 74, 35, 60, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Neuton', 'google'];
    $scope.font[666] = ['New Rocker', 'NewRocker-Regular.ttf', 274, 'Fun', 27, 8, 28, 32, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/New Rocker', 'google'];
    $scope.font[667] = ['News Cycle', 'NewsCycle-Bold.ttf', 275, 'Sans Serif', 30, 2, 40, 35, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/News Cycle', 'google'];
    $scope.font[668] = ['News Cycle', 'NewsCycle-Regular.ttf', 275, 'Sans Serif', 17, 0, 39, 32, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/News Cycle', 'google'];
    $scope.font[669] = ['Niconne', 'Niconne-Regular.ttf', 163, 'Script', 23, 26, 48, 70, 57, 400, 'Normal', 'http://www.google.com/fonts/specimen/Niconne', 'google'];
    $scope.font[670] = ['Nixie One', 'NixieOne-Regular.ttf', 267, 'Slab Serif', 5, 79, 63, 50, 10, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nixie One', 'google'];
    $scope.font[671] = ['Nobile', 'Nobile-Bold.ttf', 312, 'Sans Serif', 48, 0, 51, 37, 28, 700, 'Normal', 'http://www.google.com/fonts/specimen/Nobile', 'google'];
    $scope.font[672] = ['Nobile', 'Nobile-BoldItalic.ttf', 295, 'Sans Serif', 41, 2, 44, 36, 27, 700, 'Italic', 'http://www.google.com/fonts/specimen/Nobile', 'google'];
    $scope.font[673] = ['Nobile', 'Nobile-Italic.ttf', 299, 'Sans Serif', 19, 5, 42, 32, 23, 400, 'Italic', 'http://www.google.com/fonts/specimen/Nobile', 'google'];
    $scope.font[674] = ['Nobile', 'Nobile-Medium.ttf', 308, 'Sans Serif', 34, 0, 49, 35, 22, 500, 'Normal', 'http://www.google.com/fonts/specimen/Nobile', 'google'];
    $scope.font[675] = ['Nobile', 'Nobile-MediumItalic.ttf', 298, 'Sans Serif', 25, 2, 43, 33, 23, 500, 'Italic', 'http://www.google.com/fonts/specimen/Nobile', 'google'];
    $scope.font[676] = ['Nobile', 'Nobile-Regular.ttf', 304, 'Sans Serif', 23, 0, 48, 35, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nobile', 'google'];
    $scope.font[677] = ['Norican', 'Norican-Regular.ttf', 219, 'Script', 36, 6, 26, 40, 37, 400, 'Normal', 'http://www.google.com/fonts/specimen/Norican', 'google'];
    $scope.font[678] = ['Nosifer', 'Nosifer-Regular.ttf', 523, 'Fun', 27, 3, 24, 12, 4, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nosifer', 'google'];
    $scope.font[679] = ['Nosifer Caps', 'NosiferCaps-Regular.ttf', 523, 'Fun', 27, 3, 24, 12, 4, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nosifer Caps', 'google'];
    $scope.font[680] = ['Nothing You Could Do', 'NothingYouCouldDo.ttf', 185, 'Script', 10, 4, 73, 42, 53, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nothing You Could Do', 'google'];
    $scope.font[681] = ['Noticia Text', 'NoticiaText-Bold.ttf', 288, 'Slab Serif', 47, 38, 51, 40, 11, 700, 'Normal', 'http://www.google.com/fonts/specimen/Noticia Text', 'google'];
    $scope.font[682] = ['Noticia Text', 'NoticiaText-BoldItalic.ttf', 294, 'Slab Serif', 47, 0, 46, 34, 10, 700, 'Italic', 'http://www.google.com/fonts/specimen/Noticia Text', 'google'];
    $scope.font[683] = ['Noticia Text', 'NoticiaText-Italic.ttf', 294, 'Slab Serif', 27, 2, 37, 23, 10, 400, 'Italic', 'http://www.google.com/fonts/specimen/Noticia Text', 'google'];
    $scope.font[684] = ['Noticia Text', 'NoticiaText-Regular.ttf', 288, 'Slab Serif', 27, 44, 45, 28, 11, 400, 'Normal', 'http://www.google.com/fonts/specimen/Noticia Text', 'google'];
    $scope.font[685] = ['Noto Sans', 'NotoSans-Bold.ttf', 291, 'Sans Serif', 42, 0, 55, 42, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Noto Sans', 'google'];
    $scope.font[686] = ['Noto Sans', 'NotoSans-BoldItalic.ttf', 291, 'Sans Serif', 41, 2, 51, 37, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Noto Sans', 'google'];
    $scope.font[687] = ['Noto Sans', 'NotoSans-Italic.ttf', 286, 'Sans Serif', 24, 2, 47, 35, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Noto Sans', 'google'];
    $scope.font[688] = ['Noto Sans', 'NotoSans-Regular.ttf', 286, 'Sans Serif', 23, 0, 51, 39, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Noto Sans', 'google'];
    $scope.font[689] = ['Noto Sans UI', 'NotoSansUI-Bold.ttf', 291, 'Sans Serif', 42, 0, 55, 42, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Noto Sans UI', 'google'];
    $scope.font[690] = ['Noto Sans UI', 'NotoSansUI-BoldItalic.ttf', 291, 'Sans Serif', 41, 2, 51, 37, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Noto Sans UI', 'google'];
    $scope.font[691] = ['Noto Sans UI', 'NotoSansUI-Italic.ttf', 286, 'Sans Serif', 24, 2, 47, 35, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Noto Sans UI', 'google'];
    $scope.font[692] = ['Noto Sans UI', 'NotoSansUI-Regular.ttf', 286, 'Sans Serif', 23, 0, 51, 39, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Noto Sans UI', 'google'];
    $scope.font[693] = ['Noto Serif', 'NotoSerif-Bold.ttf', 286, 'Slab Serif', 53, 55, 58, 41, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Noto Serif', 'google'];
    $scope.font[694] = ['Noto Serif', 'NotoSerif-BoldItalic.ttf', 291, 'Slab Serif', 53, 25, 55, 41, 11, 700, 'Italic', 'http://www.google.com/fonts/specimen/Noto Serif', 'google'];
    $scope.font[695] = ['Noto Serif', 'NotoSerif-Italic.ttf', 291, 'Slab Serif', 29, 28, 43, 33, 11, 400, 'Italic', 'http://www.google.com/fonts/specimen/Noto Serif', 'google'];
    $scope.font[696] = ['Noto Serif', 'NotoSerif-Regular.ttf', 286, 'Slab Serif', 30, 65, 52, 31, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Noto Serif', 'google'];
    $scope.font[697] = ['Nova Cut', 'NovaCut.ttf', 308, 'Fun', 16, 0, 29, 21, 17, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Cut', 'google'];
    $scope.font[698] = ['Nova Flat', 'NovaFlat.ttf', 307, 'Sans Serif', 24, 0, 48, 24, 15, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Flat', 'google'];
    $scope.font[699] = ['Nova Mono', 'NovaMono.ttf', 291, 'Monospace', 28, 22, 23, 0, 0, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nova Mono', 'google'];
    $scope.font[700] = ['Nova Oval', 'NovaOval.ttf', 307, 'Sans Serif', 24, 0, 48, 25, 15, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Oval', 'google'];
    $scope.font[701] = ['Nova Round', 'NovaRound.ttf', 307, 'Sans Serif', 24, 0, 48, 24, 15, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Round', 'google'];
    $scope.font[702] = ['Nova Script', 'NovaScript.ttf', 307, 'Fun', 17, 12, 29, 22, 17, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Script', 'google'];
    $scope.font[703] = ['Nova Slim', 'NovaSlim.ttf', 307, 'Sans Serif', 24, 0, 47, 24, 15, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Slim', 'google'];
    $scope.font[704] = ['Nova Square', 'NovaSquare.ttf', 308, 'Sans Serif', 24, 0, 47, 26, 14, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Nova Square', 'google'];
    $scope.font[705] = ['Numans', 'Numans-Regular.ttf', 286, 'Sans Serif', 25, 0, 61, 41, 11, 400, 'Normal', 'http://www.google.com/fonts/specimen/Numans', 'google'];
    $scope.font[706] = ['Nunito', 'Nunito-Bold.ttf', 262, 'Sans Serif', 49, 0, 61, 58, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Nunito', 'google'];
    $scope.font[707] = ['Nunito', 'Nunito-Light.ttf', 258, 'Sans Serif', 24, 0, 55, 50, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Nunito', 'google'];
    $scope.font[708] = ['Nunito', 'Nunito-Regular.ttf', 261, 'Sans Serif', 36, 0, 58, 55, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Nunito', 'google'];
    $scope.font[709] = ['OFL Sorts Mill Goudy TT', 'OFLGoudyStMTT-Italic.ttf', 228, 'Serif', 9, 50, 39, 54, 63, 400, 'Italic', 'http://www.google.com/fonts/specimen/OFL Sorts Mill Goudy TT', 'google'];
    $scope.font[710] = ['OFL Sorts Mill Goudy TT', 'OFLGoudyStMTT.ttf', 238, 'Serif', 11, 64, 49, 78, 56, 400, 'Normal', 'http://www.google.com/fonts/specimen/OFL Sorts Mill Goudy TT', 'google'];
    $scope.font[711] = ['Offside', 'Offside-Regular.ttf', 329, 'Sans Serif', 18, 11, 49, 19, 11, 400, 'Normal', 'http://www.google.com/fonts/specimen/Offside', 'google'];
    $scope.font[712] = ['Old Standard TT', 'OldStandard-Bold.ttf', 253, 'Serif', 31, 45, 41, 36, 28, 700, 'Normal', 'http://www.google.com/fonts/specimen/Old Standard TT', 'google'];
    $scope.font[713] = ['Old Standard TT', 'OldStandard-Italic.ttf', 251, 'Serif', 9, 20, 38, 30, 34, 400, 'Italic', 'http://www.google.com/fonts/specimen/Old Standard TT', 'google'];
    $scope.font[714] = ['Old Standard TT', 'OldStandard-Regular.ttf', 243, 'Serif', 11, 58, 42, 42, 37, 400, 'Normal', 'http://www.google.com/fonts/specimen/Old Standard TT', 'google'];
    $scope.font[715] = ['Oldenburg', 'Oldenburg-Regular.ttf', 272, 'Slab Serif', 28, 72, 69, 50, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oldenburg', 'google'];
    $scope.font[716] = ['Oleo Script', 'OleoScript-Bold.ttf', 241, 'Script', 37, 27, 29, 34, 31, 700, 'Normal', 'http://www.google.com/fonts/specimen/Oleo Script', 'google'];
    $scope.font[717] = ['Oleo Script', 'OleoScript-Regular.ttf', 241, 'Script', 29, 27, 23, 29, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oleo Script', 'google'];
    $scope.font[718] = ['Oleo Script Swash Caps', 'OleoScriptSwashCaps-Bold.ttf', 241, 'Script', 37, 27, 31, 33, 31, 700, 'Normal', 'http://www.google.com/fonts/specimen/Oleo Script Swash Caps', 'google'];
    $scope.font[719] = ['Oleo Script Swash Caps', 'OleoScriptSwashCaps-Regular.ttf', 241, 'Script', 29, 27, 24, 27, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oleo Script Swash Caps', 'google'];
    $scope.font[720] = ['Open Sans', 'OpenSans-Bold.ttf', 291, 'Sans Serif', 42, 0, 55, 42, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[721] = ['Open Sans', 'OpenSans-BoldItalic.ttf', 291, 'Sans Serif', 41, 2, 50, 37, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[722] = ['Open Sans Condensed', 'OpenSans-CondBold.ttf', 290, 'Sans Serif', 36, 2, 37, 29, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans Condensed', 'google'];
    $scope.font[723] = ['Open Sans Condensed', 'OpenSans-CondLight.ttf', 282, 'Sans Serif', 11, 0, 26, 19, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans Condensed', 'google'];
    $scope.font[724] = ['Open Sans Condensed', 'OpenSans-CondLightItalic.ttf', 282, 'Sans Serif', 11, 0, 21, 17, 22, 300, 'Italic', 'http://www.google.com/fonts/specimen/Open Sans Condensed', 'google'];
    $scope.font[725] = ['Open Sans', 'OpenSans-ExtraBold.ttf', 295, 'Sans Serif', 53, 2, 57, 43, 17, 800, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[726] = ['Open Sans', 'OpenSans-ExtraBoldItalic.ttf', 295, 'Sans Serif', 53, 2, 52, 38, 17, 800, 'Italic', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[727] = ['Open Sans', 'OpenSans-Italic.ttf', 285, 'Sans Serif', 22, 0, 46, 35, 21, 400, 'Italic', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[728] = ['Open Sans', 'OpenSans-Light.ttf', 283, 'Sans Serif', 12, 0, 48, 38, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[729] = ['Open Sans', 'OpenSans-LightItalic.ttf', 283, 'Sans Serif', 11, 2, 43, 35, 22, 300, 'Italic', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[730] = ['Open Sans', 'OpenSans-Regular.ttf', 285, 'Sans Serif', 22, 0, 51, 39, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[731] = ['Open Sans', 'OpenSans-Semibold.ttf', 288, 'Sans Serif', 32, 0, 53, 41, 20, 600, 'Normal', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[732] = ['Open Sans', 'OpenSans-SemiboldItalic.ttf', 288, 'Sans Serif', 32, 2, 48, 36, 20, 600, 'Italic', 'http://www.google.com/fonts/specimen/Open Sans', 'google'];
    $scope.font[733] = ['Oranienbaum', 'Oranienbaum-Regular.ttf', 246, 'Serif', 16, 54, 30, 33, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oranienbaum', 'google'];
    $scope.font[734] = ['Orbitron', 'Orbitron-Black.ttf', 310, 'Sans Serif', 40, 0, 59, 42, 13, 900, 'Normal', 'http://www.google.com/fonts/specimen/Orbitron', 'google'];
    $scope.font[735] = ['Orbitron', 'Orbitron-Bold.ttf', 310, 'Sans Serif', 34, 0, 59, 42, 13, 700, 'Normal', 'http://www.google.com/fonts/specimen/Orbitron', 'google'];
    $scope.font[736] = ['Orbitron', 'Orbitron-Medium.ttf', 310, 'Sans Serif', 28, 0, 58, 42, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Orbitron', 'google'];
    $scope.font[737] = ['Orbitron', 'Orbitron-Regular.ttf', 310, 'Sans Serif', 20, 0, 57, 43, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Orbitron', 'google'];
    $scope.font[738] = ['Oregano', 'Oregano-Italic.ttf', 191, 'Script', 27, 0, 41, 39, 44, 400, 'Italic', 'http://www.google.com/fonts/specimen/Oregano', 'google'];
    $scope.font[739] = ['Oregano', 'Oregano-Regular.ttf', 234, 'Script', 12, 2, 17, 31, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oregano', 'google'];
    $scope.font[740] = ['Orienta', 'Orienta-Regular.ttf', 283, 'Sans Serif', 26, 0, 53, 38, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Orienta', 'google'];
    $scope.font[741] = ['Original Surfer', 'OriginalSurfer-Regular.ttf', 255, 'Script', 25, 0, 36, 37, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Original Surfer', 'google'];
    $scope.font[742] = ['Oswald', 'Oswald-Bold.ttf', 340, 'Sans Serif', 39, 0, 26, 13, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Oswald', 'google'];
    $scope.font[743] = ['Oswald', 'Oswald-Light.ttf', 312, 'Sans Serif', 17, 0, 23, 10, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Oswald', 'google'];
    $scope.font[744] = ['Oswald', 'Oswald-Regular.ttf', 334, 'Sans Serif', 30, 0, 27, 12, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oswald', 'google'];
    $scope.font[745] = ['Overlock', 'Overlock-Black.ttf', 257, 'Sans Serif', 47, 14, 54, 52, 32, 900, 'Normal', 'http://www.google.com/fonts/specimen/Overlock', 'google'];
    $scope.font[746] = ['Overlock', 'Overlock-BlackItalic.ttf', 265, 'Sans Serif', 46, 41, 48, 47, 29, 900, 'Italic', 'http://www.google.com/fonts/specimen/Overlock', 'google'];
    $scope.font[747] = ['Overlock', 'Overlock-Bold.ttf', 258, 'Sans Serif', 32, 18, 50, 49, 32, 700, 'Normal', 'http://www.google.com/fonts/specimen/Overlock', 'google'];
    $scope.font[748] = ['Overlock', 'Overlock-BoldItalic.ttf', 264, 'Sans Serif', 32, 36, 42, 44, 30, 700, 'Italic', 'http://www.google.com/fonts/specimen/Overlock', 'google'];
    $scope.font[749] = ['Overlock', 'Overlock-Italic.ttf', 259, 'Sans Serif', 21, 32, 40, 43, 32, 400, 'Italic', 'http://www.google.com/fonts/specimen/Overlock', 'google'];
    $scope.font[750] = ['Overlock', 'Overlock-Regular.ttf', 252, 'Sans Serif', 21, 14, 49, 47, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Overlock', 'google'];
    $scope.font[751] = ['Overlock SC', 'OverlockSC-Regular.ttf', 279, 'All Caps', 16, 3, 47, 52, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Overlock SC', 'google'];
    $scope.font[752] = ['Over the Rainbow', 'OvertheRainbow.ttf', 334, 'Script', 2, 19, 11, 0, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Over the Rainbow', 'google'];
    $scope.font[753] = ['Ovo', 'Ovo-Regular.ttf', 250, 'Serif', 12, 72, 42, 63, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ovo', 'google'];
    $scope.font[754] = ['Oxygen', 'Oxygen-Bold.ttf', 287, 'Sans Serif', 36, 0, 52, 41, 18, 700, 'Normal', 'http://www.google.com/fonts/specimen/Oxygen', 'google'];
    $scope.font[755] = ['Oxygen', 'Oxygen-Light.ttf', 286, 'Sans Serif', 15, 2, 46, 38, 19, 300, 'Normal', 'http://www.google.com/fonts/specimen/Oxygen', 'google'];
    $scope.font[756] = ['Oxygen', 'Oxygen-Regular.ttf', 286, 'Sans Serif', 21, 2, 47, 39, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oxygen', 'google'];
    $scope.font[757] = ['Oxygen Mono', 'OxygenMono-Regular.ttf', 286, 'Monospace', 36, 48, 37, 23, 49, 400, 'Normal', 'http://www.google.com/fonts/specimen/Oxygen Mono', 'google'];
    $scope.font[758] = ['PT Mono', 'PTM55FT.ttf', 267, 'Monospace', 32, 61, 50, 48, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/PT Mono', 'google'];
    $scope.font[759] = ['PT Sans Caption', 'PT_Sans-Caption-Web-Bold.ttf', 280, 'Sans Serif', 41, 0, 57, 46, 13, 700, 'Normal', 'http://www.google.com/fonts/specimen/PT Sans Caption', 'google'];
    $scope.font[760] = ['PT Sans Caption', 'PT_Sans-Caption-Web-Regular.ttf', 280, 'Sans Serif', 26, 0, 58, 43, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/PT Sans Caption', 'google'];
    $scope.font[761] = ['PT Sans Narrow', 'PT_Sans-Narrow-Web-Bold.ttf', 267, 'Sans Serif', 36, 0, 36, 33, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/PT Sans Narrow', 'google'];
    $scope.font[762] = ['PT Sans Narrow', 'PT_Sans-Narrow-Web-Regular.ttf', 267, 'Sans Serif', 21, 2, 34, 28, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/PT Sans Narrow', 'google'];
    $scope.font[763] = ['PT Sans', 'PT_Sans-Web-Bold.ttf', 267, 'Sans Serif', 40, 0, 49, 43, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/PT Sans', 'google'];
    $scope.font[764] = ['PT Sans', 'PT_Sans-Web-BoldItalic.ttf', 267, 'Sans Serif', 38, 0, 46, 39, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/PT Sans', 'google'];
    $scope.font[765] = ['PT Sans', 'PT_Sans-Web-Italic.ttf', 267, 'Sans Serif', 21, 2, 46, 34, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/PT Sans', 'google'];
    $scope.font[766] = ['PT Sans', 'PT_Sans-Web-Regular.ttf', 267, 'Sans Serif', 23, 0, 50, 40, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/PT Sans', 'google'];
    $scope.font[767] = ['PT Serif Caption', 'PT_Serif-Caption-Web-Italic.ttf', 280, 'Slab Serif', 32, 18, 47, 35, 13, 400, 'Italic', 'http://www.google.com/fonts/specimen/PT Serif Caption', 'google'];
    $scope.font[768] = ['PT Serif Caption', 'PT_Serif-Caption-Web-Regular.ttf', 280, 'Slab Serif', 35, 46, 57, 50, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/PT Serif Caption', 'google'];
    $scope.font[769] = ['PT Serif', 'PT_Serif-Web-Bold.ttf', 273, 'Serif', 41, 53, 41, 55, 24, 700, 'Normal', 'http://www.google.com/fonts/specimen/PT Serif', 'google'];
    $scope.font[770] = ['PT Serif', 'PT_Serif-Web-BoldItalic.ttf', 278, 'Serif', 38, 28, 32, 40, 23, 700, 'Italic', 'http://www.google.com/fonts/specimen/PT Serif', 'google'];
    $scope.font[771] = ['PT Serif', 'PT_Serif-Web-Italic.ttf', 276, 'Serif', 14, 28, 24, 24, 23, 400, 'Italic', 'http://www.google.com/fonts/specimen/PT Serif', 'google'];
    $scope.font[772] = ['PT Serif', 'PT_Serif-Web-Regular.ttf', 273, 'Serif', 15, 55, 31, 39, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/PT Serif', 'google'];
    $scope.font[773] = ['Pacifico', 'Pacifico.ttf', 250, 'Script', 40, 31, 26, 25, 47, 400, 'Normal', 'http://www.google.com/fonts/specimen/Pacifico', 'google'];
    $scope.font[774] = ['Paprika', 'Paprika-Regular.ttf', 363, 'Script', 9, 7, 17, 12, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Paprika', 'google'];
    $scope.font[775] = ['Parisienne', 'Parisienne-Regular.ttf', 175, 'Script', 25, 1, 49, 45, 60, 400, 'Normal', 'http://www.google.com/fonts/specimen/Parisienne', 'google'];
    $scope.font[776] = ['Passero One', 'PasseroOne-Regular.ttf', 266, 'Fun', 26, 1, 25, 28, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Passero One', 'google'];
    $scope.font[777] = ['Passion One', 'PassionOne-Black.ttf', 248, 'Sans Serif', 89, 2, 56, 66, 16, 900, 'Normal', 'http://www.google.com/fonts/specimen/Passion One', 'google'];
    $scope.font[778] = ['Passion One', 'PassionOne-Bold.ttf', 250, 'Sans Serif', 69, 5, 51, 53, 17, 700, 'Normal', 'http://www.google.com/fonts/specimen/Passion One', 'google'];
    $scope.font[779] = ['Passion One', 'PassionOne-Regular.ttf', 253, 'Sans Serif', 54, 0, 41, 42, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Passion One', 'google'];
    $scope.font[780] = ['Pathway Gothic One', 'PathwayGothicOne-Regular.ttf', 288, 'Sans Serif', 20, 0, 22, 12, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Pathway Gothic One', 'google'];
    $scope.font[781] = ['Patrick Hand', 'PatrickHand-Regular.ttf', 257, 'Script', 11, 3, 14, 22, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Patrick Hand', 'google'];
    $scope.font[782] = ['Patrick Hand SC', 'PatrickHandSC-Regular.ttf', 247, 'All Caps', 16, 3, 42, 49, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Patrick Hand SC', 'google'];
    $scope.font[783] = ['Patua One', 'PatuaOne-Regular.ttf', 274, 'Slab Serif', 51, 27, 45, 46, 11, 400, 'Normal', 'http://www.google.com/fonts/specimen/Patua One', 'google'];
    $scope.font[784] = ['Paytone One', 'PaytoneOne.ttf', 271, 'Sans Serif', 66, 95, 61, 59, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Paytone One', 'google'];
    $scope.font[785] = ['Peralta', 'Peralta-Regular.ttf', 262, 'Fun', 26, 64, 48, 45, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Peralta', 'google'];
    $scope.font[786] = ['Permanent Marker', 'PermanentMarker.ttf', 327, 'Script', 22, 2, 23, 21, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Permanent Marker', 'google'];
    $scope.font[787] = ['Petit Formal Script', 'PetitFormalScript-Regular.ttf', 314, 'Script', 7, 22, 31, 16, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Petit Formal Script', 'google'];
    $scope.font[788] = ['Petrona', 'Petrona-Regular.ttf', 241, 'Slab Serif', 31, 61, 56, 65, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Petrona', 'google'];
    $scope.font[789] = ['Philosopher', 'Philosopher-Bold.ttf', 251, 'Sans Serif', 42, 75, 57, 55, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Philosopher', 'google'];
    $scope.font[790] = ['Philosopher', 'Philosopher-BoldItalic.ttf', 251, 'Sans Serif', 42, 75, 58, 55, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Philosopher', 'google'];
    $scope.font[791] = ['Philosopher', 'Philosopher-Italic.ttf', 251, 'Sans Serif', 28, 84, 55, 49, 20, 400, 'Italic', 'http://www.google.com/fonts/specimen/Philosopher', 'google'];
    $scope.font[792] = ['Philosopher', 'Philosopher-Regular.ttf', 251, 'Sans Serif', 28, 82, 55, 49, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Philosopher', 'google'];
    $scope.font[793] = ['Piedra', 'Piedra-Regular.ttf', 307, 'Fun', 33, 5, 20, 24, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Piedra', 'google'];
    $scope.font[794] = ['Pinyon Script', 'PinyonScript-Regular.ttf', 176, 'Script', 14, 9, 49, 40, 63, 400, 'Normal', 'http://www.google.com/fonts/specimen/Pinyon Script', 'google'];
    $scope.font[795] = ['Pirata One', 'PirataOne-Regular.ttf', 304, 'Fun', 21, 8, 15, 15, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Pirata One', 'google'];
    $scope.font[796] = ['Plaster', 'Plaster-Regular.ttf', 266, 'Fun', 59, 0, 62, 59, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Plaster', 'google'];
    $scope.font[797] = ['Play', 'Play-Bold.ttf', 258, 'Sans Serif', 47, 0, 60, 52, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Play', 'google'];
    $scope.font[798] = ['Play', 'Play-Regular.ttf', 258, 'Sans Serif', 27, 0, 55, 45, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Play', 'google'];
    $scope.font[799] = ['Playball', 'Playball-Regular.ttf', 218, 'Script', 29, 17, 32, 36, 40, 400, 'Normal', 'http://www.google.com/fonts/specimen/Playball', 'google'];
    $scope.font[800] = ['Playfair Display', 'PlayfairDisplay-Black.ttf', 283, 'Serif', 55, 44, 37, 40, 25, 900, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[801] = ['Playfair Display', 'PlayfairDisplay-BlackItalic.ttf', 293, 'Serif', 49, 18, 32, 33, 25, 900, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[802] = ['Playfair Display', 'PlayfairDisplay-Bold.ttf', 282, 'Serif', 39, 50, 35, 34, 26, 700, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[803] = ['Playfair Display', 'PlayfairDisplay-BoldItalic.ttf', 292, 'Serif', 35, 20, 27, 22, 25, 700, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[804] = ['Playfair Display', 'PlayfairDisplay-Italic.ttf', 290, 'Serif', 12, 25, 21, 9, 26, 400, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[805] = ['Playfair Display', 'PlayfairDisplay-Regular.ttf', 281, 'Serif', 14, 60, 31, 27, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[806] = ['Playfair Display', 'PlayfairDisplay-SemiBold.ttf', 284, 'Serif', 23, 56, 31, 34, 28, 600, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[807] = ['Playfair Display', 'PlayfairDisplay-SemiBoldItalic.ttf', 283, 'Serif', 21, 24, 27, 19, 31, 600, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[808] = ['Playfair Display SC', 'PlayfairDisplaySC-Black.ttf', 325, 'All Caps', 39, 31, 56, 52, 12, 900, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[809] = ['Playfair Display SC', 'PlayfairDisplaySC-BlackItalic.ttf', 325, 'All Caps', 42, 36, 61, 55, 12, 900, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[810] = ['Playfair Display SC', 'PlayfairDisplaySC-Bold.ttf', 325, 'All Caps', 31, 33, 54, 49, 12, 700, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[811] = ['Playfair Display SC', 'PlayfairDisplaySC-BoldItalic.ttf', 325, 'All Caps', 32, 36, 59, 51, 12, 700, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[812] = ['Playfair Display SC', 'PlayfairDisplaySC-Italic.ttf', 325, 'All Caps', 18, 36, 54, 44, 12, 400, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[813] = ['Playfair Display SC', 'PlayfairDisplaySC-Regular.ttf', 325, 'All Caps', 17, 36, 51, 43, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[814] = ['Playfair Display SC', 'PlayfairDisplaySC-SemiBold.ttf', 329, 'All Caps', 23, 34, 51, 47, 12, 600, 'Normal', 'http://www.google.com/fonts/specimen/Playfair Display SC', 'google'];
    $scope.font[815] = ['Playfair Display', 'PlayfairDisplaySC-SemiBoldItalic.ttf', 329, 'All Caps', 23, 36, 55, 47, 12, 600, 'Italic', 'http://www.google.com/fonts/specimen/Playfair Display', 'google'];
    $scope.font[816] = ['Podkova', 'Podkova-Bold.ttf', 242, 'Slab Serif', 52, 70, 66, 68, 21, 700, 'Normal', 'http://www.google.com/fonts/specimen/Podkova', 'google'];
    $scope.font[817] = ['Podkova', 'Podkova-Regular.ttf', 229, 'Slab Serif', 31, 75, 72, 71, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Podkova', 'google'];
    $scope.font[818] = ['Poiret One', 'PoiretOne-Regular.ttf', 240, 'Sans Serif', 9, 0, 56, 61, 42, 400, 'Normal', 'http://www.google.com/fonts/specimen/Poiret One', 'google'];
    $scope.font[819] = ['Poller One', 'PollerOne.ttf', 258, 'Sans Serif', 87, 0, 88, 83, 42, 400, 'Normal', 'http://www.google.com/fonts/specimen/Poller One', 'google'];
    $scope.font[820] = ['Poly', 'Poly-Italic.ttf', 263, 'Slab Serif', 30, 19, 41, 38, 31, 400, 'Italic', 'http://www.google.com/fonts/specimen/Poly', 'google'];
    $scope.font[821] = ['Poly', 'Poly-Regular.ttf', 255, 'Slab Serif', 33, 48, 55, 51, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Poly', 'google'];
    $scope.font[822] = ['Pompiere', 'Pompiere-Regular.ttf', 197, 'Sans Serif', 16, 14, 43, 47, 100, 400, 'Normal', 'http://www.google.com/fonts/specimen/Pompiere ', 'google'];
    $scope.font[823] = ['Pontano Sans', 'PontanoSans-Regular.ttf', 267, 'Sans Serif', 20, 0, 47, 39, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Pontano Sans', 'google'];
    $scope.font[824] = ['Port Lligat Sans', 'PortLligatSans-Regular.ttf', 253, 'Sans Serif', 23, 39, 47, 37, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Port Lligat Sans', 'google'];
    $scope.font[825] = ['Port Lligat Slab', 'PortLligatSlab-Regular.ttf', 255, 'Slab Serif', 25, 21, 39, 34, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Port Lligat Slab', 'google'];
    $scope.font[826] = ['Prata', 'Prata-Regular.ttf', 276, 'Serif', 20, 56, 42, 46, 35, 400, 'Normal', 'http://www.google.com/fonts/specimen/Prata', 'google'];
    $scope.font[827] = ['Press Start 2P', 'PressStart2P-Regular.ttf', 334, 'Fun', 44, 92, 50, 49, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Press Start 2P', 'google'];
    $scope.font[828] = ['Princess Sofia', 'PrincessSofia-Regular.ttf', 177, 'Fun', 22, 23, 42, 63, 100, 400, 'Normal', 'http://www.google.com/fonts/specimen/Princess Sofia', 'google'];
    $scope.font[829] = ['Prociono', 'Prociono-Regular.ttf', 281, 'Serif', 17, 54, 26, 28, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Prociono', 'google'];
    $scope.font[830] = ['Prosto One', 'ProstoOne-Regular.ttf', 272, 'Sans Serif', 42, 0, 70, 56, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Prosto One', 'google'];
    $scope.font[831] = ['Puritan', 'Puritan-Bold.ttf', 264, 'Sans Serif', 31, 2, 49, 44, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Puritan', 'google'];
    $scope.font[832] = ['Puritan', 'Puritan-BoldItalic.ttf', 264, 'Sans Serif', 32, 2, 49, 44, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Puritan', 'google'];
    $scope.font[833] = ['Puritan', 'Puritan-Italic.ttf', 264, 'Sans Serif', 23, 7, 49, 44, 20, 400, 'Italic', 'http://www.google.com/fonts/specimen/Puritan', 'google'];
    $scope.font[834] = ['Puritan', 'Puritan-Regular.ttf', 264, 'Sans Serif', 23, 2, 49, 44, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Puritan', 'google'];
    $scope.font[835] = ['Purple Purse', 'PurplePurse-Regular.ttf', 208, 'Serif', 62, 84, 72, 96, 66, 400, 'Normal', 'http://www.google.com/fonts/specimen/Purple Purse', 'google'];
    $scope.font[836] = ['Quando', 'Quando-Regular.ttf', 320, 'Serif', 17, 55, 36, 16, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Quando', 'google'];
    $scope.font[837] = ['Quantico', 'Quantico-Bold.ttf', 267, 'Sans Serif', 42, 0, 58, 42, 24, 700, 'Normal', 'http://www.google.com/fonts/specimen/Quantico', 'google'];
    $scope.font[838] = ['Quantico', 'Quantico-BoldItalic.ttf', 267, 'Sans Serif', 42, 2, 58, 42, 24, 700, 'Italic', 'http://www.google.com/fonts/specimen/Quantico', 'google'];
    $scope.font[839] = ['Quantico', 'Quantico-Italic.ttf', 267, 'Sans Serif', 29, 0, 56, 39, 24, 400, 'Italic', 'http://www.google.com/fonts/specimen/Quantico', 'google'];
    $scope.font[840] = ['Quantico', 'Quantico-Regular.ttf', 267, 'Sans Serif', 29, 0, 56, 39, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Quantico', 'google'];
    $scope.font[841] = ['Quattrocento', 'Quattrocento-Bold.ttf', 250, 'Serif', 27, 69, 51, 69, 40, 700, 'Normal', 'http://www.google.com/fonts/specimen/Quattrocento', 'google'];
    $scope.font[842] = ['Quattrocento', 'Quattrocento-Regular.ttf', 249, 'Serif', 8, 69, 49, 67, 41, 400, 'Normal', 'http://www.google.com/fonts/specimen/Quattrocento', 'google'];
    $scope.font[843] = ['Quattrocento Sans', 'QuattrocentoSans-Bold.ttf', 245, 'Sans Serif', 36, 0, 59, 55, 37, 700, 'Normal', 'http://www.google.com/fonts/specimen/Quattrocento Sans', 'google'];
    $scope.font[844] = ['Quattrocento Sans', 'QuattrocentoSans-BoldItalic.ttf', 245, 'Sans Serif', 36, 0, 59, 56, 38, 700, 'Italic', 'http://www.google.com/fonts/specimen/Quattrocento Sans', 'google'];
    $scope.font[845] = ['Quattrocento Sans', 'QuattrocentoSans-Italic.ttf', 246, 'Sans Serif', 22, 2, 58, 56, 37, 400, 'Italic', 'http://www.google.com/fonts/specimen/Quattrocento Sans', 'google'];
    $scope.font[846] = ['Quattrocento Sans', 'QuattrocentoSans-Regular.ttf', 245, 'Sans Serif', 23, 0, 58, 55, 37, 400, 'Normal', 'http://www.google.com/fonts/specimen/Quattrocento Sans', 'google'];
    $scope.font[847] = ['Questrial', 'Questrial-Regular.ttf', 267, 'Sans Serif', 21, 0, 51, 49, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Questrial', 'google'];
    $scope.font[848] = ['Quicksand', 'Quicksand-Bold.ttf', 266, 'Sans Serif', 33, 0, 62, 48, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Quicksand', 'google'];
    $scope.font[849] = ['Quicksand', 'Quicksand-BoldItalic.ttf', 268, 'Sans Serif', 33, 2, 62, 48, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Quicksand', 'google'];
    $scope.font[850] = ['Quicksand', 'Quicksand-Italic.ttf', 262, 'Sans Serif', 13, 0, 64, 50, 22, 400, 'Italic', 'http://www.google.com/fonts/specimen/Quicksand', 'google'];
    $scope.font[851] = ['Quicksand', 'Quicksand-Light.ttf', 262, 'Sans Serif', 5, 0, 64, 49, 22, 300, 'Normal', 'http://www.google.com/fonts/specimen/Quicksand', 'google'];
    $scope.font[852] = ['Quicksand', 'Quicksand-LightItalic.ttf', 262, 'Sans Serif', 5, 0, 64, 49, 22, 300, 'Italic', 'http://www.google.com/fonts/specimen/Quicksand', 'google'];
    $scope.font[853] = ['Quicksand', 'Quicksand-Regular.ttf', 262, 'Sans Serif', 13, 0, 64, 49, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Quicksand', 'google'];
    $scope.font[854] = ['Quintessential', 'Quintessential-Regular.ttf', 268, 'Script', 10, 20, 19, 16, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Quintessential', 'google'];
    $scope.font[855] = ['Qwigley', 'Qwigley-Regular.ttf', 166, 'Script', 7, 17, 22, 28, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Qwigley', 'google'];
    $scope.font[856] = ['Racing Sans One', 'RacingSansOne-Regular.ttf', 230, 'Sans Serif', 75, 2, 69, 78, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Racing Sans One', 'google'];
    $scope.font[857] = ['Radley', 'Radley-Italic.ttf', 237, 'Serif', 18, 44, 46, 61, 38, 400, 'Italic', 'http://www.google.com/fonts/specimen/Radley', 'google'];
    $scope.font[858] = ['Radley', 'Radley-Regular.ttf', 236, 'Serif', 24, 71, 50, 75, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Radley', 'google'];
    $scope.font[859] = ['Raleway', 'Raleway-Bold.ttf', 280, 'Sans Serif', 38, 2, 55, 49, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[860] = ['Raleway', 'Raleway-ExtraBold.ttf', 280, 'Sans Serif', 47, 2, 55, 50, 19, 800, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[861] = ['Raleway', 'Raleway-ExtraLight.ttf', 278, 'Sans Serif', 7, 2, 51, 43, 20, 200, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[862] = ['Raleway', 'Raleway-Heavy.ttf', 281, 'Sans Serif', 57, 0, 57, 51, 18, 900, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[863] = ['Raleway', 'Raleway-Light.ttf', 278, 'Sans Serif', 13, 0, 52, 45, 20, 300, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[864] = ['Raleway', 'Raleway-Medium.ttf', 279, 'Sans Serif', 25, 0, 53, 46, 19, 500, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[865] = ['Raleway', 'Raleway-Regular.ttf', 278, 'Sans Serif', 18, 2, 53, 46, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[866] = ['Raleway', 'Raleway-SemiBold.ttf', 279, 'Sans Serif', 32, 0, 54, 48, 19, 600, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[867] = ['Raleway', 'Raleway-Thin.ttf', 277, 'Sans Serif', 3, 0, 50, 43, 20, 100, 'Normal', 'http://www.google.com/fonts/specimen/Raleway', 'google'];
    $scope.font[868] = ['Rambla', 'Rambla-Bold.ttf', 280, 'Sans Serif', 41, 0, 45, 36, 15, 700, 'Normal', 'http://www.google.com/fonts/specimen/Rambla', 'google'];
    $scope.font[869] = ['Rambla', 'Rambla-BoldItalic.ttf', 280, 'Sans Serif', 41, 0, 45, 36, 15, 700, 'Italic', 'http://www.google.com/fonts/specimen/Rambla', 'google'];
    $scope.font[870] = ['Rambla', 'Rambla-Italic.ttf', 273, 'Sans Serif', 26, 0, 43, 34, 18, 400, 'Italic', 'http://www.google.com/fonts/specimen/Rambla', 'google'];
    $scope.font[871] = ['Rambla', 'Rambla-Regular.ttf', 273, 'Sans Serif', 26, 0, 43, 34, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rambla', 'google'];
    $scope.font[872] = ['Rammetto One', 'RammettoOne-Regular.ttf', 324, 'Sans Serif', 72, 7, 64, 43, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rammetto One', 'google'];
    $scope.font[873] = ['Ranchers', 'Ranchers-Regular.ttf', 311, 'Fun', 26, 1, 16, 22, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ranchers', 'google'];
    $scope.font[874] = ['Rancho', 'Rancho-Regular.ttf', 205, 'Script', 17, 7, 18, 30, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rancho', 'google'];
    $scope.font[875] = ['Rationale', 'Rationale-Regular.ttf', 271, 'Sans Serif', 23, 0, 34, 25, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rationale', 'google'];
    $scope.font[876] = ['Redressed', 'Redressed.ttf', 206, 'Script', 19, 21, 30, 41, 41, 400, 'Normal', 'http://www.google.com/fonts/specimen/Redressed', 'google'];
    $scope.font[877] = ['Reenie Beanie', 'ReenieBeanie.ttf', 117, 'Script', 19, 6, 84, 52, 81, 400, 'Normal', 'http://www.google.com/fonts/specimen/Reenie Beanie', 'google'];
    $scope.font[878] = ['Revalia', 'Revalia-Regular.ttf', 297, 'Fun', 20, 3, 48, 45, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Revalia', 'google'];
    $scope.font[879] = ['Ribeye', 'Ribeye-Regular.ttf', 264, 'Fun', 38, 42, 44, 42, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ribeye', 'google'];
    $scope.font[880] = ['Righteous', 'Righteous-Regular.ttf', 279, 'Sans Serif', 39, 0, 52, 46, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Righteous', 'google'];
    $scope.font[881] = ['Risque', 'Risque-Regular.ttf', 263, 'Fun', 22, 23, 30, 38, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Risque', 'google'];
    $scope.font[882] = ['Roboto', 'Roboto-Black.ttf', 282, 'Sans Serif', 49, 0, 49, 43, 23, 900, 'Normal', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[883] = ['Roboto', 'Roboto-BlackItalic.ttf', 282, 'Sans Serif', 48, 2, 45, 39, 23, 900, 'Italic', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[884] = ['Roboto', 'Roboto-Bold.ttf', 282, 'Sans Serif', 41, 0, 49, 42, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[885] = ['Roboto', 'Roboto-BoldItalic.ttf', 282, 'Sans Serif', 40, 2, 45, 37, 23, 700, 'Italic', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[886] = ['Roboto', 'Roboto-Italic.ttf', 282, 'Sans Serif', 26, 2, 45, 34, 23, 400, 'Italic', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[887] = ['Roboto', 'Roboto-Light.ttf', 282, 'Sans Serif', 14, 0, 47, 37, 23, 300, 'Normal', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[888] = ['Roboto', 'Roboto-LightItalic.ttf', 282, 'Sans Serif', 14, 0, 43, 33, 23, 300, 'Italic', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[889] = ['Roboto', 'Roboto-Medium.ttf', 282, 'Sans Serif', 34, 0, 49, 40, 23, 500, 'Normal', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[890] = ['Roboto', 'Roboto-MediumItalic.ttf', 282, 'Sans Serif', 33, 2, 44, 36, 23, 500, 'Italic', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[891] = ['Roboto', 'Roboto-Regular.ttf', 282, 'Sans Serif', 26, 0, 48, 38, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[892] = ['Roboto', 'Roboto-Thin.ttf', 282, 'Sans Serif', 5, 0, 46, 36, 23, 100, 'Normal', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[893] = ['Roboto', 'Roboto-ThinItalic.ttf', 282, 'Sans Serif', 5, 2, 46, 36, 23, 100, 'Italic', 'http://www.google.com/fonts/specimen/Roboto', 'google'];
    $scope.font[894] = ['Roboto Condensed', 'RobotoCondensed-Bold.ttf', 282, 'Sans Serif', 40, 0, 39, 32, 23, 700, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Condensed', 'google'];
    $scope.font[895] = ['Roboto Condensed', 'RobotoCondensed-BoldItalic.ttf', 282, 'Sans Serif', 40, 2, 36, 30, 23, 700, 'Italic', 'http://www.google.com/fonts/specimen/Roboto Condensed', 'google'];
    $scope.font[896] = ['Roboto Condensed', 'RobotoCondensed-Italic.ttf', 282, 'Sans Serif', 27, 2, 36, 28, 23, 400, 'Italic', 'http://www.google.com/fonts/specimen/Roboto Condensed', 'google'];
    $scope.font[897] = ['Roboto Condensed', 'RobotoCondensed-Light.ttf', 282, 'Sans Serif', 15, 0, 35, 28, 23, 300, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Condensed', 'google'];
    $scope.font[898] = ['Roboto Condensed', 'RobotoCondensed-LightItalic.ttf', 282, 'Sans Serif', 15, 0, 34, 25, 23, 300, 'Italic', 'http://www.google.com/fonts/specimen/Roboto Condensed', 'google'];
    $scope.font[899] = ['Roboto Condensed', 'RobotoCondensed-Regular.ttf', 282, 'Sans Serif', 28, 0, 38, 30, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Condensed', 'google'];
    $scope.font[900] = ['Roboto Slab', 'RobotoSlab-Bold.ttf', 282, 'Slab Serif', 50, 39, 51, 41, 14, 700, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Slab', 'google'];
    $scope.font[901] = ['Roboto Slab', 'RobotoSlab-Light.ttf', 282, 'Slab Serif', 16, 49, 49, 34, 14, 300, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Slab', 'google'];
    $scope.font[902] = ['Roboto Slab', 'RobotoSlab-Regular.ttf', 282, 'Slab Serif', 31, 51, 50, 35, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Slab', 'google'];
    $scope.font[903] = ['Roboto Slab', 'RobotoSlab-Thin.ttf', 282, 'Slab Serif', 3, 51, 48, 33, 14, 100, 'Normal', 'http://www.google.com/fonts/specimen/Roboto Slab', 'google'];
    $scope.font[904] = ['Rochester', 'Rochester-Regular.ttf', 214, 'Script', 20, 16, 22, 35, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rochester', 'google'];
    $scope.font[905] = ['Rock Salt', 'RockSalt.ttf', 281, 'Script', 16, 7, 54, 25, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rock Salt', 'google'];
    $scope.font[906] = ['Rokkitt', 'Rokkitt-Bold.ttf', 222, 'Slab Serif', 42, 56, 65, 84, 14, 700, 'Normal', 'http://www.google.com/fonts/specimen/Rokkitt', 'google'];
    $scope.font[907] = ['Rokkitt', 'Rokkitt-Light.ttf', 218, 'Slab Serif', 13, 69, 69, 89, 18, 300, 'Normal', 'http://www.google.com/fonts/specimen/Rokkitt', 'google'];
    $scope.font[908] = ['Rokkitt', 'Rokkitt-Regular.ttf', 211, 'Slab Serif', 31, 61, 64, 90, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rokkitt', 'google'];
    $scope.font[909] = ['Romanesco', 'Romanesco-Regular.ttf', 202, 'Script', 15, 3, 4, 22, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Romanesco', 'google'];
    $scope.font[910] = ['Ropa Sans', 'RopaSans-Italic.ttf', 261, 'Sans Serif', 25, 2, 47, 30, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/Ropa Sans', 'google'];
    $scope.font[911] = ['Ropa Sans', 'RopaSans-Regular.ttf', 261, 'Sans Serif', 26, 0, 47, 29, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ropa Sans', 'google'];
    $scope.font[912] = ['Rosario', 'Rosario-Bold.ttf', 265, 'Sans Serif', 37, 9, 49, 47, 32, 700, 'Normal', 'http://www.google.com/fonts/specimen/Rosario', 'google'];
    $scope.font[913] = ['Rosario', 'Rosario-BoldItalic.ttf', 265, 'Sans Serif', 36, 7, 43, 43, 32, 700, 'Italic', 'http://www.google.com/fonts/specimen/Rosario', 'google'];
    $scope.font[914] = ['Rosario', 'Rosario-Italic.ttf', 261, 'Sans Serif', 24, 9, 43, 41, 33, 400, 'Italic', 'http://www.google.com/fonts/specimen/Rosario', 'google'];
    $scope.font[915] = ['Rosario', 'Rosario-Regular.ttf', 265, 'Sans Serif', 25, 14, 47, 42, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rosario', 'google'];
    $scope.font[916] = ['Rosarivo', 'Rosarivo-Italic.ttf', 288, 'Serif', 7, 38, 20, 15, 51, 400, 'Italic', 'http://www.google.com/fonts/specimen/Rosarivo', 'google'];
    $scope.font[917] = ['Rosarivo', 'Rosarivo-Regular.ttf', 285, 'Serif', 10, 58, 35, 42, 54, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rosarivo', 'google'];
    $scope.font[918] = ['Rouge Script', 'RougeScript-Regular.ttf', 183, 'Script', 15, 2, 22, 28, 46, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rouge Script', 'google'];
    $scope.font[919] = ['Ruda', 'Ruda-Black.ttf', 314, 'Serif', 37, 0, 26, 16, 0, 900, 'Normal', 'http://www.google.com/fonts/specimen/Ruda', 'google'];
    $scope.font[920] = ['Ruda', 'Ruda-Bold.ttf', 312, 'Sans Serif', 29, 0, 44, 27, 10, 700, 'Normal', 'http://www.google.com/fonts/specimen/Ruda', 'google'];
    $scope.font[921] = ['Ruda', 'Ruda-Regular.ttf', 311, 'Sans Serif', 21, 0, 42, 23, 10, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ruda', 'google'];
    $scope.font[922] = ['Rufina', 'Rufina-Bold.ttf', 264, 'Slab Serif', 47, 40, 60, 61, 27, 700, 'Normal', 'http://www.google.com/fonts/specimen/Rufina', 'google'];
    $scope.font[923] = ['Rufina', 'Rufina-Regular.ttf', 263, 'Slab Serif', 34, 42, 58, 55, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rufina', 'google'];
    $scope.font[924] = ['Ruge Boogie', 'RugeBoogie-Regular.ttf', 207, 'Script', 14, 3, 19, 30, 37, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ruge Boogie', 'google'];
    $scope.font[925] = ['Ruluko', 'Ruluko-Regular.ttf', 256, 'Sans Serif', 21, 59, 48, 42, 34, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ruluko', 'google'];
    $scope.font[926] = ['Rum Raisin', 'RumRaisin-Regular.ttf', 301, 'Fun', 18, 8, 15, 18, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rum Raisin', 'google'];
    $scope.font[927] = ['Ruslan Display', 'RuslanDisplay.ttf', 267, 'Fun', 81, 0, 51, 47, 1, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ruslan Display', 'google'];
    $scope.font[928] = ['Russo One', 'RussoOne-Regular.ttf', 272, 'Sans Serif', 53, 84, 63, 50, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Russo One', 'google'];
    $scope.font[929] = ['Ruthie', 'Ruthie-Regular.ttf', 143, 'Script', 16, 13, 40, 34, 71, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ruthie', 'google'];
    $scope.font[930] = ['Rye', 'Rye-Regular.ttf', 314, 'Fun', 24, 35, 33, 37, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Rye', 'google'];
    $scope.font[931] = ['Sacramento', 'Sacramento-Regular.ttf', 147, 'Script', 25, 33, 55, 69, 74, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sacramento', 'google'];
    $scope.font[932] = ['Sail', 'Sail-Regular.ttf', 213, 'Script', 33, 8, 40, 43, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sail', 'google'];
    $scope.font[933] = ['Salsa', 'Salsa-Regular.ttf', 270, 'Sans Serif', 30, 39, 53, 42, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Salsa', 'google'];
    $scope.font[934] = ['Sanchez', 'Sanchez-Italic.ttf', 263, 'Slab Serif', 28, 43, 65, 58, 16, 400, 'Italic', 'http://www.google.com/fonts/specimen/Sanchez', 'google'];
    $scope.font[935] = ['Sanchez', 'Sanchez-Regular.ttf', 263, 'Slab Serif', 28, 42, 64, 56, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sanchez', 'google'];
    $scope.font[936] = ['Sancreek', 'Sancreek-Regular.ttf', 355, 'Fun', 20, 17, 20, 19, 13, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sancreek', 'google'];
    $scope.font[937] = ['Sansita One', 'SansitaOne.ttf', 294, 'Sans Serif', 56, 39, 51, 42, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sansita One', 'google'];
    $scope.font[938] = ['Sarina', 'Sarina-Regular.ttf', 261, 'Script', 55, 59, 62, 39, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sarina', 'google'];
    $scope.font[939] = ['Satisfy', 'Satisfy-Regular.ttf', 213, 'Script', 16, 36, 33, 27, 36, 400, 'Normal', 'http://www.google.com/fonts/specimen/Satisfy', 'google'];
    $scope.font[940] = ['Scada', 'Scada-Bold.ttf', 267, 'Sans Serif', 42, 0, 54, 43, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Scada', 'google'];
    $scope.font[941] = ['Scada', 'Scada-BoldItalic.ttf', 267, 'Sans Serif', 43, 0, 54, 43, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Scada', 'google'];
    $scope.font[942] = ['Scada', 'Scada-Italic.ttf', 267, 'Sans Serif', 30, 2, 49, 39, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/Scada', 'google'];
    $scope.font[943] = ['Scada', 'Scada-Regular.ttf', 267, 'Sans Serif', 30, 0, 49, 39, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Scada', 'google'];
    $scope.font[944] = ['Scheherazade', 'ScheherazadeRegOT.ttf', 185, 'Serif', 16, 63, 39, 100, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Scheherazade', 'google'];
    $scope.font[945] = ['Schoolbell', 'Schoolbell.ttf', 237, 'Script', 12, 1, 29, 53, 39, 400, 'Normal', 'http://www.google.com/fonts/specimen/Schoolbell', 'google'];
    $scope.font[946] = ['Seaweed Script', 'SeaweedScript-Regular.ttf', 193, 'Script', 35, 28, 37, 32, 50, 400, 'Normal', 'http://www.google.com/fonts/specimen/Seaweed Script', 'google'];
    $scope.font[947] = ['Sevillana', 'Sevillana-Regular.ttf', 224, 'Script', 10, 26, 26, 26, 49, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sevillana', 'google'];
    $scope.font[948] = ['Seymour One', 'SeymourOne-Regular.ttf', 269, 'Sans Serif', 91, 0, 100, 82, 23, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/Seymour One', 'google'];
    $scope.font[949] = ['Shadows Into Light', 'ShadowsIntoLight.ttf', 308, 'Script', 1, 3, 8, 3, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Shadows Into Light', 'google'];
    $scope.font[950] = ['Shadows Into Light Two', 'ShadowsIntoLightTwo-Regular.ttf', 329, 'Script', 2, 1, 6, 8, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Shadows Into Light Two', 'google'];
    $scope.font[951] = ['Shanti', 'Shanti-Regular.ttf', 267, 'Sans Serif', 26, 84, 52, 42, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Shanti', 'google'];
    $scope.font[952] = ['Share', 'Share-Bold.ttf', 267, 'Sans Serif', 40, 0, 47, 39, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Share', 'google'];
    $scope.font[953] = ['Share', 'Share-BoldItalic.ttf', 267, 'Sans Serif', 40, 0, 47, 40, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Share', 'google'];
    $scope.font[954] = ['Share', 'Share-Italic.ttf', 267, 'Sans Serif', 25, 2, 44, 32, 19, 400, 'Italic', 'http://www.google.com/fonts/specimen/Share', 'google'];
    $scope.font[955] = ['Share', 'Share-Regular.ttf', 267, 'Sans Serif', 24, 0, 44, 31, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Share', 'google'];
    $scope.font[956] = ['Share Tech', 'ShareTech-Regular.ttf', 267, 'Sans Serif', 25, 0, 44, 30, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Share Tech', 'google'];
    $scope.font[957] = ['Share Tech Mono', 'ShareTechMono-Regular.ttf', 267, 'Monospace', 38, 6, 32, 20, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Share Tech Mono', 'google'];
    $scope.font[958] = ['Shojumaru', 'Shojumaru-Regular.ttf', 321, 'Fun', 100, 0, 46, 47, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Shojumaru', 'google'];
    $scope.font[959] = ['Short Stack', 'ShortStack-Regular.ttf', 294, 'Script', 11, 5, 39, 28, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Short Stack', 'google'];
    $scope.font[960] = ['Sigmar One', 'SigmarOne.ttf', 321, 'All Caps', 63, 1, 60, 50, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sigmar One', 'google'];
    $scope.font[961] = ['Signika', 'Signika-Bold.ttf', 272, 'Sans Serif', 45, 82, 48, 41, 24, 700, 'Normal', 'http://www.google.com/fonts/specimen/Signika', 'google'];
    $scope.font[962] = ['Signika', 'Signika-Light.ttf', 265, 'Sans Serif', 21, 59, 47, 37, 27, 300, 'Normal', 'http://www.google.com/fonts/specimen/Signika', 'google'];
    $scope.font[963] = ['Signika', 'Signika-Regular.ttf', 268, 'Sans Serif', 29, 68, 48, 39, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Signika', 'google'];
    $scope.font[964] = ['Signika', 'Signika-Semibold.ttf', 270, 'Sans Serif', 38, 73, 48, 40, 25, 600, 'Normal', 'http://www.google.com/fonts/specimen/Signika', 'google'];
    $scope.font[965] = ['Signika Negative', 'SignikaNegative-Bold.ttf', 272, 'Sans Serif', 44, 73, 49, 41, 25, 700, 'Normal', 'http://www.google.com/fonts/specimen/Signika Negative', 'google'];
    $scope.font[966] = ['Signika Negative', 'SignikaNegative-Light.ttf', 265, 'Sans Serif', 19, 57, 48, 37, 28, 300, 'Normal', 'http://www.google.com/fonts/specimen/Signika Negative', 'google'];
    $scope.font[967] = ['Signika Negative', 'SignikaNegative-Regular.ttf', 268, 'Sans Serif', 28, 66, 48, 38, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Signika Negative', 'google'];
    $scope.font[968] = ['Signika Negative', 'SignikaNegative-Semibold.ttf', 269, 'Sans Serif', 36, 73, 48, 39, 26, 600, 'Normal', 'http://www.google.com/fonts/specimen/Signika Negative', 'google'];
    $scope.font[969] = ['Simonetta', 'Simonetta-Black.ttf', 252, 'Serif', 42, 40, 40, 66, 52, 900, 'Normal', 'http://www.google.com/fonts/specimen/Simonetta', 'google'];
    $scope.font[970] = ['Simonetta', 'Simonetta-BlackItalic.ttf', 249, 'Serif', 46, 50, 39, 49, 52, 900, 'Italic', 'http://www.google.com/fonts/specimen/Simonetta', 'google'];
    $scope.font[971] = ['Simonetta', 'Simonetta-Italic.ttf', 238, 'Serif', 7, 49, 28, 36, 58, 400, 'Italic', 'http://www.google.com/fonts/specimen/Simonetta', 'google'];
    $scope.font[972] = ['Simonetta', 'Simonetta-Regular.ttf', 242, 'Serif', 6, 47, 35, 69, 56, 400, 'Normal', 'http://www.google.com/fonts/specimen/Simonetta', 'google'];
    $scope.font[973] = ['Sintony', 'Sintony-Bold.ttf', 305, 'Sans Serif', 35, 0, 49, 33, 14, 700, 'Normal', 'http://www.google.com/fonts/specimen/Sintony', 'google'];
    $scope.font[974] = ['Sintony', 'Sintony-Regular.ttf', 305, 'Sans Serif', 22, 0, 48, 31, 14, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sintony', 'google'];
    $scope.font[975] = ['Sirin Stencil', 'SirinStencil-Regular.ttf', 278, 'Fun', 16, 0, 24, 30, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sirin Stencil', 'google'];
    $scope.font[976] = ['Six Caps', 'SixCaps.ttf', 400, 'All Caps', 8, 0, 0, 0, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Six Caps', 'google'];
    $scope.font[977] = ['Skranji', 'Skranji-Bold.ttf', 320, 'Sans Serif', 49, 20, 49, 43, 11, 700, 'Normal', 'http://www.google.com/fonts/specimen/Skranji', 'google'];
    $scope.font[978] = ['Skranji', 'Skranji-Regular.ttf', 301, 'Sans Serif', 41, 11, 46, 39, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Skranji', 'google'];
    $scope.font[979] = ['Slackey', 'Slackey.ttf', 243, 'Fun', 39, 11, 60, 75, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Slackey', 'google'];
    $scope.font[980] = ['Smokum', 'Smokum-Regular.ttf', 267, 'Fun', 6, 36, 17, 18, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Smokum', 'google'];
    $scope.font[981] = ['Smythe', 'Smythe-Regular.ttf', 259, 'Serif', 7, 45, 0, 0, 9, 400, 'Normal', 'http://www.google.com/fonts/specimen/Smythe', 'google'];
    $scope.font[982] = ['Sniglet', 'Sniglet-Regular.ttf', 282, 'Sans Serif', 99, 0, 72, 49, 23, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sniglet', 'google'];
    $scope.font[983] = ['Snippet', 'Snippet.ttf', 270, 'Sans Serif', 15, 14, 52, 48, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Snippet', 'google'];
    $scope.font[984] = ['Snowburst One', 'SnowburstOne-Regular.ttf', 329, 'Fun', 5, 24, 32, 31, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Snowburst One', 'google'];
    $scope.font[985] = ['Sofadi One', 'SofadiOne-Regular.ttf', 221, 'Sans Serif', 37, 0, 78, 79, 48, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sofadi One', 'google'];
    $scope.font[986] = ['Sofia', 'Sofia-Regular.ttf', 243, 'Script', 15, 36, 34, 31, 37, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sofia', 'google'];
    $scope.font[987] = ['Sonsie One', 'SonsieOne-Regular.ttf', 283, 'Script', 54, 63, 71, 64, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sonsie One', 'google'];
    $scope.font[988] = ['Sorts Mill Goudy', 'SortsMillGoudy-Italic.ttf', 230, 'Serif', 9, 45, 38, 52, 61, 400, 'Italic', 'http://www.google.com/fonts/specimen/Sorts Mill Goudy', 'google'];
    $scope.font[989] = ['Sorts Mill Goudy', 'SortsMillGoudy-Regular.ttf', 238, 'Serif', 13, 65, 49, 79, 56, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sorts Mill Goudy', 'google'];
    $scope.font[990] = ['Source Code Pro', 'SourceCodePro-Black.ttf', 267, 'Monospace', 100, 18, 51, 56, 23, 900, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[991] = ['Source Code Pro', 'SourceCodePro-Bold.ttf', 265, 'Monospace', 84, 20, 52, 56, 38, 700, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[992] = ['Source Code Pro', 'SourceCodePro-ExtraLight.ttf', 255, 'Monospace', 0, 36, 59, 51, 100, 200, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[993] = ['Source Code Pro', 'SourceCodePro-Light.ttf', 256, 'Monospace', 9, 35, 58, 52, 95, 300, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[994] = ['Source Code Pro', 'SourceCodePro-Medium.ttf', 261, 'Monospace', 51, 26, 55, 54, 62, 500, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[995] = ['Source Code Pro', 'SourceCodePro-Regular.ttf', 260, 'Monospace', 38, 29, 55, 51, 69, 400, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[996] = ['Source Code Pro', 'SourceCodePro-Semibold.ttf', 262, 'Monospace', 61, 25, 54, 54, 56, 600, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[997] = ['Source Sans Pro', 'SourceSansPro-Black.ttf', 267, 'Sans Serif', 54, 0, 54, 47, 18, 900, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[998] = ['Source Sans Pro', 'SourceSansPro-BlackItalic.ttf', 267, 'Sans Serif', 50, 2, 51, 45, 18, 900, 'Italic', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[999] = ['Source Sans Pro', 'SourceSansPro-Bold.ttf', 265, 'Sans Serif', 46, 0, 52, 46, 20, 700, 'Normal', 'http://www.google.com/fonts/specimen/Source Sans Pro', 'google'];
    $scope.font[1000] = ['Source Sans Pro', 'SourceSansPro-BoldItalic.ttf', 265, 'Sans Serif', 42, 2, 50, 43, 20, 700, 'Italic', 'http://www.google.com/fonts/specimen/Source Sans Pro', 'google'];
    $scope.font[1001] = ['Source Sans Pro', 'SourceSansPro-ExtraLight.ttf', 255, 'Sans Serif', 7, 0, 47, 43, 29, 200, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[1002] = ['Source Sans Pro', 'SourceSansPro-ExtraLightItalic.ttf', 255, 'Sans Serif', 7, 0, 45, 39, 29, 200, 'Italic', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[1003] = ['Source Sans Pro', 'SourceSansPro-Italic.ttf', 260, 'Sans Serif', 23, 0, 47, 42, 24, 400, 'Italic', 'http://www.google.com/fonts/specimen/Source Sans Pro', 'google'];
    $scope.font[1004] = ['Source Sans Pro', 'SourceSansPro-Light.ttf', 256, 'Sans Serif', 11, 0, 48, 43, 28, 300, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[1005] = ['Source Sans Pro', 'SourceSansPro-LightItalic.ttf', 256, 'Sans Serif', 11, 2, 46, 39, 28, 300, 'Italic', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[1006] = ['Source Sans Pro', 'SourceSansPro-Regular.ttf', 260, 'Sans Serif', 25, 0, 49, 45, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Source Sans Pro', 'google'];
    $scope.font[1007] = ['Source Sans Pro', 'SourceSansPro-Semibold.ttf', 262, 'Sans Serif', 36, 0, 52, 46, 23, 600, 'Normal', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[1008] = ['Source Sans Pro', 'SourceSansPro-SemiboldItalic.ttf', 262, 'Sans Serif', 32, 2, 49, 43, 23, 600, 'Italic', 'http://www.google.com/fonts/specimen/Source Code Pro', 'google'];
    $scope.font[1009] = ['Special Elite', 'SpecialElite.ttf', 273, 'Monospace', 29, 89, 29, 49, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Special Elite', 'google'];
    $scope.font[1010] = ['Spicy Rice', 'SpicyRice-Regular.ttf', 309, 'Fun', 30, 13, 20, 24, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Spicy Rice', 'google'];
    $scope.font[1011] = ['Spinnaker', 'Spinnaker-Regular.ttf', 261, 'Sans Serif', 28, 0, 63, 57, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Spinnaker', 'google'];
    $scope.font[1012] = ['Spirax', 'Spirax-Regular.ttf', 248, 'Script', 17, 0, 31, 39, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Spirax', 'google'];
    $scope.font[1013] = ['Squada One', 'SquadaOne-Regular.ttf', 261, 'Sans Serif', 42, 0, 40, 31, 12, 400, 'Normal', 'http://www.google.com/fonts/specimen/Squada One', 'google'];
    $scope.font[1014] = ['Stalemate', 'Stalemate-Regular.ttf', 105, 'Script', 20, 30, 51, 88, 100, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stalemate', 'google'];
    $scope.font[1015] = ['Stalin One', 'StalinOne-Regular.ttf', 283, 'Fun', 53, 26, 62, 78, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stalin One', 'google'];
    $scope.font[1016] = ['Stalinist One', 'StalinistOne-Regular.ttf', 283, 'Fun', 53, 26, 62, 78, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stalinist One', 'google'];
    $scope.font[1017] = ['Stardos Stencil', 'StardosStencil-Bold.ttf', 262, 'Serif', 43, 55, 42, 54, 21, 700, 'Normal', 'http://www.google.com/fonts/specimen/Stardos Stencil', 'google'];
    $scope.font[1018] = ['Stardos Stencil', 'StardosStencil-Regular.ttf', 259, 'Serif', 25, 52, 37, 40, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stardos Stencil', 'google'];
    $scope.font[1019] = ['Stint Ultra Condensed', 'StintUltraCondensed-Regular.ttf', 248, 'Slab Serif', 20, 19, 0, 0, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stint Ultra Condensed', 'google'];
    $scope.font[1020] = ['Stint Ultra Expanded', 'StintUltraExpanded-Regular.ttf', 248, 'Slab Serif', 20, 100, 100, 93, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stint Ultra Expanded', 'google'];
    $scope.font[1021] = ['Stoke', 'Stoke-Light.ttf', 263, 'Serif', 27, 79, 69, 66, 54, 300, 'Normal', 'http://www.google.com/fonts/specimen/Stoke', 'google'];
    $scope.font[1022] = ['Stoke', 'Stoke-Regular.ttf', 271, 'Serif', 27, 79, 65, 61, 52, 400, 'Normal', 'http://www.google.com/fonts/specimen/Stoke', 'google'];
    $scope.font[1023] = ['Strait', 'Strait-Regular.ttf', 278, 'Sans Serif', 23, 0, 41, 25, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Strait', 'google'];
    $scope.font[1024] = ['Sue Ellen Francisco', 'SueEllenFrancisco.ttf', 205, 'Fun', 15, 0, 20, 27, 75, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sue Ellen Francisco ', 'google'];
    $scope.font[1025] = ['Sunshiney', 'Sunshiney.ttf', 172, 'Script', 14, 27, 42, 48, 55, 400, 'Normal', 'http://www.google.com/fonts/specimen/Sunshiney', 'google'];
    $scope.font[1026] = ['Supermercado One', 'SupermercadoOne-Regular.ttf', 289, 'Sans Serif', 32, 0, 41, 21, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Supermercado One', 'google'];
    $scope.font[1027] = ['Swanky and Moo Moo', 'SwankyandMooMoo.ttf', 134, 'Script', 24, 1, 97, 94, 51, 400, 'Normal', 'http://www.google.com/fonts/specimen/Swanky and Moo Moo', 'google'];
    $scope.font[1028] = ['Tangerine', 'Tangerine_Bold.ttf', 137, 'Script', 1, 41, 38, 57, 89, 700, 'Normal', 'http://www.google.com/fonts/specimen/Tangerine', 'google'];
    $scope.font[1029] = ['Tangerine', 'Tangerine_Regular.ttf', 136, 'Script', 0, 34, 30, 46, 90, 400, 'Normal', 'http://www.google.com/fonts/specimen/Tangerine', 'google'];
    $scope.font[1030] = ['Tauri', 'Tauri-Regular.ttf', 296, 'Sans Serif', 31, 0, 49, 35, 29, 400, 'Normal', 'http://www.google.com/fonts/specimen/Tauri', 'google'];
    $scope.font[1031] = ['Telex', 'Telex-Regular.ttf', 274, 'Sans Serif', 26, 0, 53, 44, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Telex Regular', 'google'];
    $scope.font[1032] = ['Tenor Sans', 'TenorSans-Regular.ttf', 267, 'Sans Serif', 24, 0, 60, 51, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/Tenor Sans', 'google'];
    $scope.font[1033] = ['Terminal Dosis', 'TerminalDosis-Bold.ttf', 253, 'Sans Serif', 41, 0, 50, 47, 35, 700, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1034] = ['Terminal Dosis', 'TerminalDosis-ExtraBold.ttf', 254, 'Sans Serif', 50, 0, 51, 50, 34, 800, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1035] = ['Terminal Dosis', 'TerminalDosis-ExtraLight.ttf', 252, 'Sans Serif', 9, 0, 42, 35, 39, 200, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1036] = ['Terminal Dosis', 'TerminalDosis-Light.ttf', 252, 'Sans Serif', 14, 0, 44, 37, 38, 300, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1037] = ['Terminal Dosis', 'TerminalDosis-Medium.ttf', 253, 'Sans Serif', 25, 0, 46, 40, 37, 500, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1038] = ['Terminal Dosis', 'TerminalDosis-Regular.ttf', 252, 'Sans Serif', 19, 0, 45, 39, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1039] = ['Terminal Dosis', 'TerminalDosis-SemiBold.ttf', 253, 'Sans Serif', 32, 0, 48, 43, 36, 600, 'Normal', 'http://www.google.com/fonts/specimen/Terminal Dosis', 'google'];
    $scope.font[1040] = ['Text Me One', 'TextMeOne-Regular.ttf', 268, 'Sans Serif', 12, 14, 50, 28, 24, 400, 'Normal', 'http://www.google.com/fonts/specimen/Text Me One', 'google'];
    $scope.font[1041] = ['Thabit', 'Thabit.ttf', 224, 'Monospace', 19, 78, 83, 98, 72, 400, 'Normal', 'http://www.google.com/fonts/specimen/Thabit', 'google'];
    $scope.font[1042] = ['The Girl Next Door', 'TheGirlNextDoor.ttf', 243, 'Script', 8, 48, 42, 27, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/The Girl Next Door', 'google'];
    $scope.font[1043] = ['Tienne', 'Tienne-Bold.ttf', 269, 'Serif', 45, 37, 57, 64, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Tienne', 'google'];
    $scope.font[1044] = ['Tienne', 'Tienne-Heavy.ttf', 262, 'Serif', 72, 36, 66, 81, 18, 900, 'Normal', 'http://www.google.com/fonts/specimen/Tienne', 'google'];
    $scope.font[1045] = ['Tienne', 'Tienne-Regular.ttf', 277, 'Serif', 21, 38, 48, 48, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Tienne', 'google'];
    $scope.font[1046] = ['Tinos', 'Tinos-Bold.ttf', 245, 'Serif', 48, 45, 41, 51, 30, 700, 'Normal', 'http://www.google.com/fonts/specimen/Tinos', 'google'];
    $scope.font[1047] = ['Tinos', 'Tinos-BoldItalic.ttf', 245, 'Serif', 42, 28, 38, 58, 30, 700, 'Italic', 'http://www.google.com/fonts/specimen/Tinos', 'google'];
    $scope.font[1048] = ['Tinos', 'Tinos-Italic.ttf', 245, 'Serif', 16, 36, 33, 55, 30, 400, 'Italic', 'http://www.google.com/fonts/specimen/Tinos', 'google'];
    $scope.font[1049] = ['Tinos', 'Tinos-Regular.ttf', 245, 'Serif', 16, 70, 37, 51, 30, 400, 'Normal', 'http://www.google.com/fonts/specimen/Tinos', 'google'];
    $scope.font[1050] = ['Titan One', 'TitanOne-Regular.ttf', 301, 'Sans Serif', 75, 2, 60, 47, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Titan One', 'google'];
    $scope.font[1051] = ['Titillium Web', 'TitilliumWeb-Black.ttf', 270, 'Sans Serif', 70, 0, 52, 51, 16, 900, 'Normal', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1052] = ['Titillium Web', 'TitilliumWeb-Bold.ttf', 267, 'Sans Serif', 40, 0, 50, 43, 19, 700, 'Normal', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1053] = ['Titillium Web', 'TitilliumWeb-BoldItalic.ttf', 267, 'Sans Serif', 41, 0, 46, 40, 19, 700, 'Italic', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1054] = ['Titillium Web', 'TitilliumWeb-ExtraLight.ttf', 267, 'Sans Serif', 8, 0, 45, 35, 24, 100, 'Normal', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1055] = ['Titillium Web', 'TitilliumWeb-ExtraLightItalic.ttf', 267, 'Sans Serif', 9, 0, 42, 33, 24, 100, 'Italic', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1056] = ['Titillium Web', 'TitilliumWeb-Italic.ttf', 267, 'Sans Serif', 21, 2, 43, 35, 22, 400, 'Italic', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1057] = ['Titillium Web', 'TitilliumWeb-Light.ttf', 267, 'Sans Serif', 16, 2, 47, 38, 23, 300, 'Normal', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1058] = ['Titillium Web', 'TitilliumWeb-LightItalic.ttf', 267, 'Sans Serif', 17, 2, 42, 35, 23, 300, 'Italic', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1059] = ['Titillium Web', 'TitilliumWeb-Regular.ttf', 267, 'Sans Serif', 21, 0, 47, 39, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1060] = ['Titillium Web', 'TitilliumWeb-SemiBold.ttf', 267, 'Sans Serif', 32, 0, 48, 41, 21, 600, 'Normal', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1061] = ['Titillium Web', 'TitilliumWeb-SemiBoldItalic.ttf', 267, 'Sans Serif', 32, 0, 45, 39, 21, 600, 'Italic', 'http://www.google.com/fonts/specimen/Titillium Web', 'google'];
    $scope.font[1062] = ['Trade Winds', 'TradeWinds-Regular.ttf', 285, 'Fun', 28, 5, 34, 38, 5, 400, 'Normal', 'http://www.google.com/fonts/specimen/Trade Winds', 'google'];
    $scope.font[1063] = ['Trocchi', 'Trocchi-Regular.ttf', 280, 'Slab Serif', 35, 67, 54, 43, 10, 400, 'Normal', 'http://www.google.com/fonts/specimen/Trocchi', 'google'];
    $scope.font[1064] = ['Trochut', 'Trochut-Bold.ttf', 257, 'Serif', 42, 24, 29, 34, 22, 700, 'Normal', 'http://www.google.com/fonts/specimen/Trochut', 'google'];
    $scope.font[1065] = ['Trochut', 'Trochut-Italic.ttf', 257, 'Serif', 17, 26, 15, 10, 22, 400, 'Italic', 'http://www.google.com/fonts/specimen/Trochut', 'google'];
    $scope.font[1066] = ['Trochut', 'Trochut-Regular.ttf', 257, 'Serif', 17, 26, 14, 10, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Trochut', 'google'];
    $scope.font[1067] = ['Trykker', 'Trykker-Regular.ttf', 268, 'Serif', 11, 60, 46, 48, 40, 400, 'Normal', 'http://www.google.com/fonts/specimen/Trykker', 'google'];
    $scope.font[1068] = ['Tulpen One', 'TulpenOne-Regular.ttf', 265, 'Sans Serif', 9, 2, 6, 2, 31, 400, 'Normal', 'http://www.google.com/fonts/specimen/Tulpen One', 'google'];
    $scope.font[1069] = ['Ubuntu', 'Ubuntu-Bold.ttf', 280, 'Sans Serif', 43, 0, 54, 43, 26, 700, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1070] = ['Ubuntu', 'Ubuntu-BoldItalic.ttf', 280, 'Sans Serif', 44, 0, 52, 40, 26, 700, 'Italic', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1071] = ['Ubuntu', 'Ubuntu-Italic.ttf', 277, 'Sans Serif', 26, 0, 48, 38, 28, 400, 'Italic', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1072] = ['Ubuntu', 'Ubuntu-Light.ttf', 276, 'Sans Serif', 17, 0, 49, 40, 28, 300, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1073] = ['Ubuntu', 'Ubuntu-LightItalic.ttf', 276, 'Sans Serif', 18, 2, 46, 37, 28, 300, 'Italic', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1074] = ['Ubuntu', 'Ubuntu-Medium.ttf', 279, 'Sans Serif', 34, 0, 52, 43, 27, 500, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1075] = ['Ubuntu', 'Ubuntu-MediumItalic.ttf', 279, 'Sans Serif', 35, 0, 51, 39, 27, 500, 'Italic', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1076] = ['Ubuntu', 'Ubuntu-Regular.ttf', 277, 'Sans Serif', 26, 0, 50, 41, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu', 'google'];
    $scope.font[1077] = ['Ubuntu Condensed', 'UbuntuCondensed-Regular.ttf', 280, 'Sans Serif', 23, 0, 34, 24, 26, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu Condensed', 'google'];
    $scope.font[1078] = ['Ubuntu Mono', 'UbuntuMono-Bold.ttf', 257, 'Monospace', 68, 10, 27, 48, 56, 700, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu Mono', 'google'];
    $scope.font[1079] = ['Ubuntu Mono', 'UbuntuMono-BoldItalic.ttf', 257, 'Monospace', 70, 6, 28, 43, 56, 700, 'Italic', 'http://www.google.com/fonts/specimen/Ubuntu Mono', 'google'];
    $scope.font[1080] = ['Ubuntu Mono', 'UbuntuMono-Italic.ttf', 249, 'Monospace', 41, 4, 33, 43, 82, 400, 'Italic', 'http://www.google.com/fonts/specimen/Ubuntu Mono', 'google'];
    $scope.font[1081] = ['Ubuntu Mono', 'UbuntuMono-Regular.ttf', 253, 'Monospace', 38, 11, 29, 44, 69, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ubuntu Mono', 'google'];
    $scope.font[1082] = ['Ultra', 'Ultra.ttf', 287, 'Slab Serif', 100, 39, 87, 71, 3, 400, 'Normal', 'http://www.google.com/fonts/specimen/Ultra', 'google'];
    $scope.font[1083] = ['Underdog', 'Underdog-Regular.ttf', 286, 'Fun', 12, 31, 28, 27, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Underdog', 'google'];
    $scope.font[1084] = ['UnifrakturCook', 'UnifrakturCook-Bold.ttf', 273, 'Fun', 25, 13, 21, 24, 37, 700, 'Normal', 'http://www.google.com/fonts/specimen/UnifrakturCook', 'google'];
    $scope.font[1085] = ['UnifrakturMaguntia', 'UnifrakturMaguntia-Book.ttf', 284, 'Fun', 19, 19, 21, 22, 30, 'Book', 'Normal', 'http://www.google.com/fonts/specimen/UnifrakturMaguntia', 'google'];
    $scope.font[1086] = ['Unkempt', 'Unkempt-Bold.ttf', 224, 'Script', 14, 33, 45, 47, 27, 700, 'Normal', 'http://www.google.com/fonts/specimen/Unkempt', 'google'];
    $scope.font[1087] = ['Unkempt', 'Unkempt-Regular.ttf', 222, 'Script', 9, 37, 44, 47, 27, 400, 'Normal', 'http://www.google.com/fonts/specimen/Unkempt', 'google'];
    $scope.font[1088] = ['Unlock', 'Unlock-Regular.ttf', 294, 'Serif', 56, 31, 40, 31, 4, 400, 'Normal', 'http://www.google.com/fonts/specimen/Unlock', 'google'];
    $scope.font[1089] = ['Unna', 'Unna-Regular.ttf', 224, 'Serif', 23, 49, 45, 69, 61, 400, 'Normal', 'http://www.google.com/fonts/specimen/Unna', 'google'];
    $scope.font[1090] = ['VT323', 'VT323-Regular.ttf', 223, 'Fun', 23, 47, 34, 42, 19, 400, 'Normal', 'http://www.google.com/fonts/specimen/VT323', 'google'];
    $scope.font[1091] = ['Vampiro One', 'VampiroOne-Regular.ttf', 291, 'Script', 53, 15, 34, 33, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Vampiro One', 'google'];
    $scope.font[1092] = ['Varela', 'Varela-Regular.ttf', 272, 'Sans Serif', 26, 0, 57, 47, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Varela', 'google'];
    $scope.font[1093] = ['Varela Round', 'VarelaRound-Regular.ttf', 278, 'Sans Serif', 25, 0, 55, 46, 21, 400, 'Normal', 'http://www.google.com/fonts/specimen/Varela Round', 'google'];
    $scope.font[1094] = ['Vibur', 'Vibur-Regular.ttf', 224, 'Script', 13, 50, 25, 34, 38, 500, 'Normal', 'http://www.google.com/fonts/specimen/Vibur', 'google'];
    $scope.font[1095] = ['Vidaloka ', 'Vidaloka-Regular.ttf', 267, 'Serif', 30, 42, 31, 37, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Vidaloka ', 'google'];
    $scope.font[1096] = ['Viga', 'Viga-Regular.ttf', 294, 'Sans Serif', 36, 2, 46, 32, 16, 400, 'Normal', 'http://www.google.com/fonts/specimen/Viga', 'google'];
    $scope.font[1097] = ['Voces', 'Voces-Regular.ttf', 276, 'Sans Serif', 28, 0, 54, 42, 22, 400, 'Normal', 'http://www.google.com/fonts/specimen/Voces', 'google'];
    $scope.font[1098] = ['Volkhov', 'Volkhov-Bold.ttf', 267, 'Serif', 47, 70, 49, 58, 41, 700, 'Normal', 'http://www.google.com/fonts/specimen/Volkhov', 'google'];
    $scope.font[1099] = ['Volkhov', 'Volkhov-BoldItalic.ttf', 275, 'Serif', 32, 43, 34, 42, 39, 700, 'Italic', 'http://www.google.com/fonts/specimen/Volkhov', 'google'];
    $scope.font[1100] = ['Volkhov', 'Volkhov-Italic.ttf', 275, 'Serif', 16, 45, 33, 34, 39, 400, 'Italic', 'http://www.google.com/fonts/specimen/Volkhov', 'google'];
    $scope.font[1101] = ['Volkhov', 'Volkhov-Regular.ttf', 267, 'Serif', 30, 70, 46, 51, 41, 400, 'Normal', 'http://www.google.com/fonts/specimen/Volkhov', 'google'];
    $scope.font[1102] = ['Vollkorn', 'Vollkorn-Bold.ttf', 251, 'Serif', 70, 65, 60, 88, 32, 700, 'Normal', 'http://www.google.com/fonts/specimen/Vollkorn', 'google'];
    $scope.font[1103] = ['Vollkorn', 'Vollkorn-BoldItalic.ttf', 254, 'Serif', 70, 33, 51, 85, 30, 700, 'Italic', 'http://www.google.com/fonts/specimen/Vollkorn', 'google'];
    $scope.font[1104] = ['Vollkorn', 'Vollkorn-Italic.ttf', 254, 'Serif', 20, 37, 21, 36, 30, 400, 'Italic', 'http://www.google.com/fonts/specimen/Vollkorn', 'google'];
    $scope.font[1105] = ['Vollkorn', 'Vollkorn-Regular.ttf', 251, 'Serif', 20, 61, 41, 58, 32, 400, 'Normal', 'http://www.google.com/fonts/specimen/Vollkorn', 'google'];
    $scope.font[1106] = ['Voltaire', 'Voltaire-Regular.ttf', 277, 'Sans Serif', 25, 0, 34, 28, 28, 400, 'Normal', 'http://www.google.com/fonts/specimen/Voltaire', 'google'];
    $scope.font[1107] = ['Waiting for the Sunrise', 'WaitingfortheSunrise.ttf', 238, 'Script', 2, 4, 26, 16, 33, 400, 'Normal', 'http://www.google.com/fonts/specimen/Waiting for the Sunrise', 'google'];
    $scope.font[1108] = ['Wallpoet', 'Wallpoet-Regular.ttf', 236, 'Fun', 30, 0, 60, 72, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Wallpoet', 'google'];
    $scope.font[1109] = ['Walter Turncoat', 'WalterTurncoat.ttf', 270, 'Script', 12, 6, 31, 26, 5, 400, 'Normal', 'http://www.google.com/fonts/specimen/Walter Turncoat', 'google'];
    $scope.font[1110] = ['Warnes', 'Warnes-Regular.ttf', 288, 'Fun', 17, 69, 49, 52, 20, 400, 'Normal', 'http://www.google.com/fonts/specimen/Warnes', 'google'];
    $scope.font[1111] = ['Wellfleet', 'Wellfleet-Regular.ttf', 300, 'Slab Serif', 30, 36, 47, 24, 10, 400, 'Normal', 'http://www.google.com/fonts/specimen/Wellfleet', 'google'];
    $scope.font[1112] = ['Wendy One', 'WendyOne-Regular.ttf', 249, 'Sans Serif', 63, 80, 64, 61, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Wendy One', 'google'];
    $scope.font[1113] = ['Wire One', 'WireOne.ttf', 277, 'Sans Serif', 3, 9, 12, 6, 18, 400, 'Normal', 'http://www.google.com/fonts/specimen/Wire One', 'google'];
    $scope.font[1114] = ['Yanone Kaffeesatz', 'YanoneKaffeesatz-Bold.ttf', 267, 'Sans Serif', 33, 2, 24, 24, 25, 700, 'Normal', 'http://www.google.com/fonts/specimen/Yanone Kaffeesatz', 'google'];
    $scope.font[1115] = ['Yanone Kaffeesatz', 'YanoneKaffeesatz-ExtraLight.ttf', 267, 'Sans Serif', 5, 0, 32, 24, 25, 200, 'Normal', 'http://www.google.com/fonts/specimen/Yanone Kaffeesatz', 'google'];
    $scope.font[1116] = ['Yanone Kaffeesatz Light', 'YanoneKaffeesatz-Light.ttf', 267, 'Sans Serif', 11, 0, 30, 24, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Yanone Kaffeesatz Light', 'google'];
    $scope.font[1117] = ['Yanone Kaffeesatz', 'YanoneKaffeesatz-Regular.ttf', 267, 'Sans Serif', 23, 2, 27, 24, 25, 400, 'Normal', 'http://www.google.com/fonts/specimen/Yanone Kaffeesatz', 'google'];
    $scope.font[1118] = ['Yellowtail', 'Yellowtail-Regular.ttf', 225, 'Script', 36, 26, 20, 30, 38, 400, 'Normal', 'http://www.google.com/fonts/specimen/Yellowtail', 'google'];
    $scope.font[1119] = ['Yeseva One', 'YesevaOne-Regular.ttf', 267, 'Serif', 50, 50, 50, 57, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Yeseva One', 'google'];
    $scope.font[1120] = ['Yeseva One', 'YesevaOne.ttf', 267, 'Serif', 55, 66, 62, 60, 15, 400, 'Normal', 'http://www.google.com/fonts/specimen/Yeseva One', 'google'];
    $scope.font[1121] = ['Yesteryear', 'Yesteryear-Regular.ttf', 167, 'Script', 60, 0, 43, 63, 66, 400, 'Normal', 'http://www.google.com/fonts/specimen/Yesteryear', 'google'];
    $scope.font[1122] = ['Zeyada', 'Zeyada.ttf', 229, 'Script', 10, 26, 19, 20, 17, 400, 'Normal', 'http://www.google.com/fonts/specimen/Zeyada', 'google'];
    $scope.font[1123] = ['Aaargh', 'Aaargh.ttf', 310, 'Sans Serif', 11, 0, 53, 34, 36, 'Normal', 'Normal', 'http://www.dafont.com/aaargh.font', 'custom'];
    $scope.font[1124] = ['Aleo', 'Aleo-Bold.otf', 275, 'Slab Serif', 44, 48, 52, 49, 15, 700, 'Normal', 'http://fontfabric.com/aleo-free-font/', 'custom'];
    $scope.font[1125] = ['Aleo', 'Aleo-BoldItalic.otf', 274, 'Slab Serif', 44, 8, 46, 50, 15, 700, 'Italic', 'http://fontfabric.com/aleo-free-font/', 'custom'];
    $scope.font[1126] = ['Aleo', 'Aleo-Italic.otf', 270, 'Slab Serif', 29, 6, 45, 45, 16, 400, 'Italic', 'http://fontfabric.com/aleo-free-font/', 'custom'];
    $scope.font[1127] = ['Aleo', 'Aleo-Light.otf', 265, 'Slab Serif', 12, 46, 52, 43, 17, 300, 'Normal', 'http://fontfabric.com/aleo-free-font/', 'custom'];
    $scope.font[1128] = ['Aleo', 'Aleo-LightItalic.otf', 265, 'Slab Serif', 13, 7, 46, 43, 17, 300, 'Italic', 'http://fontfabric.com/aleo-free-font/', 'custom'];
    $scope.font[1129] = ['Aleo', 'Aleo-Regular.otf', 270, 'Slab Serif', 28, 45, 49, 44, 16, 400, 'Normal', 'http://fontfabric.com/aleo-free-font/', 'custom'];
    $scope.font[1130] = ['Aller Display CS', 'AllerDisplay.ttf', 285, 'All Caps', 39, 0, 49, 50, 12, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1131] = ['Aller Display', 'Aller_Bd.ttf', 280, 'Sans Serif', 41, 77, 51, 43, 21, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1132] = ['Aller Display', 'Aller_BdIt.ttf', 280, 'Sans Serif', 41, 75, 50, 40, 21, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1133] = ['Aller Display', 'Aller_It.ttf', 276, 'Sans Serif', 28, 70, 49, 39, 22, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1134] = ['Aller Display', 'Aller_Lt.ttf', 274, 'Sans Serif', 19, 70, 49, 39, 23, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1135] = ['Aller Display', 'Aller_LtIt.ttf', 274, 'Sans Serif', 18, 70, 48, 38, 23, 300, 'Italic', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1136] = ['Aller Display', 'Aller_Rg.ttf', 277, 'Sans Serif', 28, 75, 50, 41, 22, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Aller', 'custom'];
    $scope.font[1137] = ['Amble', 'Amble-Bold.ttf', 260, 'Sans Serif', 46, 0, 58, 54, 19, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1138] = ['Amble', 'Amble-BoldItalic.ttf', 260, 'Sans Serif', 44, 0, 55, 51, 19, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1139] = ['Amble', 'Amble-Italic.ttf', 260, 'Sans Serif', 28, 0, 53, 46, 19, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1140] = ['Amble', 'Amble-Light.ttf', 260, 'Sans Serif', 19, 2, 58, 47, 19, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1141] = ['Amble Condensed', 'Amble-LightCondensed.ttf', 260, 'Sans Serif', 18, 0, 46, 37, 19, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1142] = ['Amble Condensed', 'Amble-LightCondensedItalic.ttf', 260, 'Sans Serif', 19, 0, 43, 35, 19, 300, 'Italic', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1143] = ['Amble', 'Amble-LightItalic.ttf', 260, 'Sans Serif', 19, 2, 55, 44, 19, 300, 'Italic', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1144] = ['Amble', 'Amble-Regular.ttf', 260, 'Sans Serif', 28, 0, 57, 48, 19, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/amble', 'custom'];
    $scope.font[1145] = ['Aurulent Sans', 'AurulentSans-Bold.otf', 283, 'Sans Serif', 40, 0, 56, 46, 24, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Aurulent-Sans', 'custom'];
    $scope.font[1146] = ['Aurulent Sans', 'AurulentSans-BoldItalic.otf', 283, 'Sans Serif', 41, 0, 57, 46, 24, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Aurulent-Sans', 'custom'];
    $scope.font[1147] = ['Aurulent Sans', 'AurulentSans-Italic.otf', 283, 'Sans Serif', 26, 0, 48, 39, 24, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Aurulent-Sans', 'custom'];
    $scope.font[1148] = ['Aurulent Sans', 'AurulentSans-Regular.otf', 283, 'Sans Serif', 26, 0, 48, 39, 24, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Aurulent-Sans', 'custom'];
    $scope.font[1149] = ['BPreplay', 'BPreplay.otf', 303, 'Sans Serif', 18, 2, 45, 31, 17, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/BPreplay', 'custom'];
    $scope.font[1150] = ['BPreplay', 'BPreplayBold.otf', 307, 'Sans Serif', 40, 0, 44, 32, 20, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/BPreplay', 'custom'];
    $scope.font[1151] = ['BPreplay', 'BPreplayBoldItalics.otf', 312, 'Sans Serif', 40, 89, 43, 31, 18, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/BPreplay', 'custom'];
    $scope.font[1152] = ['BPreplay', 'BPreplayItalics.otf', 308, 'Sans Serif', 17, 86, 42, 30, 14, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/BPreplay', 'custom'];
    $scope.font[1153] = ['Casper', 'Casper Bold Italic.ttf', 269, 'Sans Serif', 32, 2, 54, 47, 19, 700, 'Italic', 'http://fontfabric.com/casper-free-font/', 'custom'];
    $scope.font[1154] = ['Casper', 'Casper Bold.ttf', 269, 'Sans Serif', 32, 0, 53, 46, 19, 700, 'Normal', 'http://fontfabric.com/casper-free-font/', 'custom'];
    $scope.font[1155] = ['Casper', 'Casper Italic.ttf', 269, 'Sans Serif', 25, 0, 51, 45, 19, 400, 'Italic', 'http://fontfabric.com/casper-free-font/', 'custom'];
    $scope.font[1156] = ['Casper', 'Casper.ttf', 269, 'Sans Serif', 25, 0, 50, 44, 19, 400, 'Normal', 'http://fontfabric.com/casper-free-font/', 'custom'];
    $scope.font[1157] = ['Charis SIL', 'CharisSILB.ttf', 267, 'Serif', 36, 58, 46, 58, 25, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Charis-SIL', 'custom'];
    $scope.font[1158] = ['Charis SIL', 'CharisSILBI.ttf', 274, 'Serif', 36, 50, 36, 43, 23, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Charis-SIL', 'custom'];
    $scope.font[1159] = ['Charis SIL', 'CharisSILI.ttf', 270, 'Serif', 18, 50, 29, 36, 25, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Charis-SIL', 'custom'];
    $scope.font[1160] = ['Charis SIL', 'CharisSILR.ttf', 263, 'Serif', 18, 61, 39, 49, 28, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Charis-SIL', 'custom'];
    $scope.font[1161] = ['Dekar', 'Dekar Light.otf', 265, 'Sans Serif', 1, 0, 41, 31, 20, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/dekar', 'custom'];
    $scope.font[1162] = ['Dekar', 'Dekar.otf', 262, 'Sans Serif', 13, 2, 43, 32, 22, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/dekar', 'custom'];
    $scope.font[1163] = ['File', 'File.otf', 286, 'Fun', 33, 3, 28, 38, 16, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/File', 'custom'];
    $scope.font[1164] = ['Fontin Sans', 'Fontin_Sans_BI_45b.otf', 278, 'Sans Serif', 35, 14, 47, 37, 24, 700, 'Italic', 'http://www.exljbris.com/fontinsans.html', 'custom'];
    $scope.font[1165] = ['Fontin Sans', 'Fontin_Sans_B_45b.otf', 278, 'Sans Serif', 34, 16, 52, 43, 25, 700, 'Normal', 'http://www.exljbris.com/fontinsans.html', 'custom'];
    $scope.font[1166] = ['Fontin Sans', 'Fontin_Sans_I_45b.otf', 269, 'Sans Serif', 24, 16, 47, 35, 28, 400, 'Italic', 'http://www.exljbris.com/fontinsans.html', 'custom'];
    $scope.font[1167] = ['Fontin Sans', 'Fontin_Sans_R_45b.otf', 269, 'Sans Serif', 23, 16, 52, 41, 28, 400, 'Normal', 'http://www.exljbris.com/fontinsans.html', 'custom'];
    $scope.font[1168] = ['Fontin Sans SC', 'Fontin_Sans_SC_45b.otf', 283, 'All Caps', 18, 3, 53, 50, 12, 400, 'Normal', 'http://www.exljbris.com/fontinsans.html', 'custom'];
    $scope.font[1169] = ['Foro', 'ForoLig.otf', 269, 'Slab Serif', 19, 71, 55, 40, 17, 300, 'Normal', 'http://www.myfonts.com/fonts/hoftype/foro/', 'custom'];
    $scope.font[1170] = ['Foro Rounded', 'ForoRndLig.otf', 269, 'Slab Serif', 19, 72, 55, 41, 17, 300, 'Normal', 'http://www.myfonts.com/fonts/hoftype/foro-rounded/', 'custom'];
    $scope.font[1171] = ['Gandhi Sans', 'GandhiSans-Bold.otf', 263, 'Sans Serif', 37, 0, 51, 46, 26, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/gandhi-sans', 'custom'];
    $scope.font[1172] = ['Gandhi Sans', 'GandhiSans-BoldItalic.otf', 270, 'Sans Serif', 35, 68, 47, 39, 24, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/gandhi-sans', 'custom'];
    $scope.font[1173] = ['Gandhi Sans', 'GandhiSans-Italic.otf', 267, 'Sans Serif', 21, 68, 46, 36, 26, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/gandhi-sans', 'custom'];
    $scope.font[1174] = ['Gandhi Sans', 'GandhiSans-Regular.otf', 260, 'Sans Serif', 22, 0, 51, 46, 27, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/gandhi-sans', 'custom'];
    $scope.font[1175] = ['Gandhi Serif', 'GandhiSerif-Bold.otf', 260, 'Serif', 33, 54, 44, 52, 26, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/gandhi-serif', 'custom'];
    $scope.font[1176] = ['Gandhi Serif', 'GandhiSerif-BoldItalic.otf', 267, 'Serif', 30, 30, 33, 40, 25, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/gandhi-serif', 'custom'];
    $scope.font[1177] = ['Gandhi Serif', 'GandhiSerif-Italic.otf', 267, 'Serif', 11, 33, 28, 31, 25, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/gandhi-serif', 'custom'];
    $scope.font[1178] = ['Gandhi Serif', 'GandhiSerif-Regular.otf', 260, 'Serif', 13, 62, 39, 48, 26, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/gandhi-serif', 'custom'];
    $scope.font[1179] = ['Griffos', 'GriffosFont.ttf', 219, 'Serif', 17, 63, 38, 76, 51, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/GriffosFont', 'custom'];
    $scope.font[1180] = ['Griffos SC', 'GriffosSCapsFont.ttf', 228, 'All Caps', 19, 42, 58, 68, 14, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/GriffosFont', 'custom'];
    $scope.font[1181] = ['Hagin Caps', 'Hagin Caps Medium.otf', 337, 'All Caps', 18, 16, 30, 20, 12, 400, 'Normal', 'http://fontfabric.com/hagin-free-font/', 'custom'];
    $scope.font[1182] = ['Hagin Caps', 'Hagin Caps Thin.otf', 337, 'All Caps', 0, 33, 26, 14, 12, 300, 'Normal', 'http://fontfabric.com/hagin-free-font/', 'custom'];
    $scope.font[1183] = ['Hero', 'Hero Light.otf', 280, 'Sans Serif', 7, 0, 55, 46, 7, 300, 'Normal', 'http://fontfabric.com/hero-free-font/', 'custom'];
    $scope.font[1184] = ['Hero', 'Hero.otf', 276, 'Sans Serif', 19, 0, 56, 47, 10, 400, 'Normal', 'http://fontfabric.com/hero-free-font/', 'custom'];
    $scope.font[1185] = ['Intro ', 'Intro.otf', 373, 'All Caps', 31, 33, 48, 37, 12, 400, 'Normal', 'http://fontfabric.com/intro-free-font/', 'custom'];
    $scope.font[1186] = ['Kelson Sans', 'Kelson Sans Bold.otf', 309, 'Sans Serif', 34, 0, 42, 25, 13, 700, 'Normal', 'http://fontfabric.com/kelson-sans/', 'custom'];
    $scope.font[1187] = ['Kelson Sans', 'Kelson Sans Light.otf', 315, 'Sans Serif', 10, 0, 29, 16, 11, 300, 'Normal', 'http://fontfabric.com/kelson-sans/', 'custom'];
    $scope.font[1188] = ['Kelson Sans', 'Kelson Sans Regular.otf', 310, 'Sans Serif', 23, 2, 39, 23, 16, 400, 'Normal', 'http://fontfabric.com/kelson-sans/', 'custom'];
    $scope.font[1189] = ['Liberation Sans', 'LiberationSans-Bold.ttf', 282, 'Sans Serif', 40, 0, 54, 46, 17, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Liberation-Sans', 'custom'];
    $scope.font[1190] = ['Liberation Sans', 'LiberationSans-BoldItalic.ttf', 282, 'Sans Serif', 40, 2, 54, 46, 17, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Liberation-Sans', 'custom'];
    $scope.font[1191] = ['Liberation Sans', 'LiberationSans-Italic.ttf', 282, 'Sans Serif', 25, 0, 47, 39, 17, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Liberation-Sans', 'custom'];
    $scope.font[1192] = ['Liberation Sans', 'LiberationSans-Regular.ttf', 282, 'Sans Serif', 24, 0, 47, 38, 17, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Liberation-Sans', 'custom'];
    $scope.font[1193] = ['Liberation Serif', 'LiberationSerif-Bold.ttf', 245, 'Serif', 46, 45, 41, 51, 30, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Liberation-Serif', 'custom'];
    $scope.font[1194] = ['Liberation Serif', 'LiberationSerif-BoldItalic.ttf', 245, 'Serif', 42, 28, 39, 58, 30, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Liberation-Serif', 'custom'];
    $scope.font[1195] = ['Liberation Serif', 'LiberationSerif-Italic.ttf', 245, 'Serif', 16, 36, 34, 55, 30, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Liberation-Serif', 'custom'];
    $scope.font[1196] = ['Liberation Serif', 'LiberationSerif-Regular.ttf', 245, 'Serif', 15, 71, 37, 51, 30, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Liberation-Serif', 'custom'];
    $scope.font[1197] = ['Linux Libertine Mono O', 'LinLibertine_M.otf', 265, 'Monospace', 39, 74, 64, 66, 36, 'Mono', 'Normal', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1198] = ['Linux Libertine O', 'LinLibertine_R.otf', 237, 'Serif', 15, 71, 43, 64, 38, 400, 'Normal', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1199] = ['Linux Libertine O', 'LinLibertine_RB.otf', 238, 'Serif', 42, 72, 56, 81, 37, 700, 'Normal', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1200] = ['Linux Libertine O', 'LinLibertine_RBI.otf', 238, 'Serif', 39, 46, 51, 64, 39, 700, 'Italic', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1201] = ['Linux Libertine O', 'LinLibertine_RI.otf', 238, 'Serif', 14, 35, 37, 48, 39, 400, 'Italic', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1202] = ['Linux Libertine O', 'LinLibertine_RZ.otf', 239, 'Serif', 32, 61, 45, 72, 36, 600, 'Normal', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1203] = ['Linux Libertine O', 'LinLibertine_RZI.otf', 238, 'Serif', 37, 42, 50, 64, 39, 600, 'Italic', 'http://www.linuxlibertine.org', 'custom'];
    $scope.font[1204] = ['Lovelo', 'Lovelo Black.otf', 381, 'All Caps', 23, 0, 41, 36, 12, 900, 'Normal', 'http://fontfabric.com/lovelo-font/', 'custom'];
    $scope.font[1205] = ['Medio', 'Medio.otf', 218, 'Serif', 20, 63, 52, 90, 58, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Medio', 'custom'];
    $scope.font[1206] = ['Museo', 'Museo300-Regular.otf', 268, 'Sans Serif', 19, 73, 56, 50, 19, 300, 'Normal', 'http://www.exljbris.com/museo.html', 'custom'];
    $scope.font[1207] = ['Museo', 'Museo500-Regular.otf', 270, 'Sans Serif', 28, 70, 57, 53, 19, 500, 'Normal', 'http://www.exljbris.com/museo.html', 'custom'];
    $scope.font[1208] = ['Museo', 'Museo700-Regular.otf', 272, 'Sans Serif', 38, 70, 59, 54, 19, 700, 'Normal', 'http://www.exljbris.com/museo.html', 'custom'];
    $scope.font[1209] = ['Museo Cyrl 500', 'MuseoCyrl_500.otf', 270, 'Sans Serif', 28, 70, 57, 52, 19, 500, 'Normal', 'http://www.exljbris.com/museo.html', 'custom'];
    $scope.font[1210] = ['Museo Sans', 'MuseoSansCyrl_500.otf', 270, 'Sans Serif', 28, 0, 57, 53, 19, 500, 'Normal', 'http://www.exljbris.com/museosans.html', 'custom'];
    $scope.font[1211] = ['Museo Sans', 'MuseoSans_500_Italic.otf', 270, 'Sans Serif', 28, 0, 56, 54, 19, 500, 'Italic', 'http://www.exljbris.com/museosans.html', 'custom'];
    $scope.font[1212] = ['Museo Slab', 'Museo_Slab_500_2.otf', 270, 'Slab Serif', 33, 56, 61, 59, 9, 400, 'Normal', 'http://www.exljbris.com/museoslab.html', 'custom'];
    $scope.font[1213] = ['Museo Slab', 'Museo_Slab_500italic.otf', 271, 'Slab Serif', 34, 13, 61, 60, 9, 400, 'Italic', 'http://www.exljbris.com/museoslab.html', 'custom'];
    $scope.font[1214] = ['Myra 4F Caps', 'Myra 4F Caps Bold.otf', 373, 'All Caps', 25, 0, 43, 30, 12, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/myra-4f-caps', 'custom'];
    $scope.font[1215] = ['Myra 4F Caps', 'Myra 4F Caps Light.otf', 373, 'All Caps', 8, 0, 38, 26, 12, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/myra-4f-caps', 'custom'];
    $scope.font[1216] = ['Myra 4F Caps', 'Myra 4F Caps Regular.otf', 373, 'All Caps', 17, 0, 41, 28, 12, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/myra-4f-caps', 'custom'];
    $scope.font[1217] = ['New Cicle', 'New_Cicle_Fina.ttf', 267, 'Sans Serif', 11, 0, 44, 44, 18, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/New-Cicle', 'custom'];
    $scope.font[1218] = ['New Cicle', 'New_Cicle_Fina_Italic.ttf', 267, 'Sans Serif', 11, 0, 45, 45, 18, 300, 'Italic', 'http://www.fontsquirrel.com/fonts/New-Cicle', 'custom'];
    $scope.font[1219] = ['New Cicle', 'New_Cicle_Gordita.ttf', 267, 'Sans Serif', 19, 0, 44, 45, 16, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/New-Cicle', 'custom'];
    $scope.font[1220] = ['New Cicle', 'New_Cicle_Gordita_Italic.ttf', 267, 'Sans Serif', 19, 0, 45, 45, 16, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/New-Cicle', 'custom'];
    $scope.font[1221] = ['New Cicle', 'New_Cicle_Semi.ttf', 267, 'Sans Serif', 15, 0, 43, 44, 17, 'Reuglar', 'Normal', 'http://www.fontsquirrel.com/fonts/New-Cicle', 'custom'];
    $scope.font[1222] = ['New Cicle', 'New_Cicle_Semi_Italic.ttf', 267, 'Sans Serif', 15, 0, 45, 45, 17, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/New-Cicle', 'custom'];
    $scope.font[1223] = ['Nexa', 'Nexa Bold.otf', 264, 'Sans Serif', 36, 5, 57, 50, 21, 700, 'Normal', 'http://fontfabric.com/nexa-font/', 'custom'];
    $scope.font[1224] = ['Nexa', 'Nexa Light.otf', 265, 'Sans Serif', 13, 0, 55, 50, 20, 300, 'Normal', 'http://fontfabric.com/nexa-font/', 'custom'];
    $scope.font[1225] = ['Noticia Text', 'NoticiaText-Bold.ttf', 288, 'Serif', 35, 53, 38, 36, 16, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/noticia-text', 'custom'];
    $scope.font[1226] = ['Noticia Text', 'NoticiaText-BoldItalic.ttf', 294, 'Serif', 35, 25, 32, 28, 15, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/noticia-text', 'custom'];
    $scope.font[1227] = ['Noticia Text', 'NoticiaText-Italic.ttf', 294, 'Serif', 12, 26, 24, 15, 15, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/noticia-text', 'custom'];
    $scope.font[1228] = ['Noticia Text', 'NoticiaText-Regular.ttf', 288, 'Serif', 12, 57, 32, 21, 16, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/noticia-text', 'custom'];
    $scope.font[1229] = ['Oblik', 'OblikSerif-Bold.otf', 280, 'Slab Serif', 42, 67, 61, 39, 9, 700, 'Normal', 'http://www.linotype.com/808073/oblik-family.html', 'custom'];
    $scope.font[1230] = ['Oblik', 'Oblik_Bold.otf', 279, 'Sans Serif', 35, 0, 53, 41, 19, 700, 'Normal', 'http://www.linotype.com/808073/oblik-family.html', 'custom'];
    $scope.font[1231] = ['Oblik', 'Oblik_Bold_Italic.otf', 279, 'Sans Serif', 36, 2, 53, 42, 19, 700, 'Italic', 'http://www.linotype.com/808073/oblik-family.html', 'custom'];
    $scope.font[1232] = ['Prime', 'Prime Light.otf', 267, 'Sans Serif', 11, 0, 49, 34, 28, 300, 'Normal', 'http://fontfabric.com/prime-free-font/', 'custom'];
    $scope.font[1233] = ['Prime', 'Prime Regular.otf', 267, 'Sans Serif', 24, 0, 53, 38, 28, 400, 'Normal', 'http://fontfabric.com/prime-free-font/', 'custom'];
    $scope.font[1234] = ['Sreda', 'Sreda.ttf', 269, 'Slab Serif', 43, 47, 82, 76, 0, 400, 'Normal', 'http://www.myfonts.com/fonts/glen-jan/sreda/', 'custom'];
    $scope.font[1235] = ['Static', 'Static Bold Italic.otf', 256, 'Sans Serif', 32, 0, 46, 34, 27, 700, 'Italic', 'http://fontfabric.com/static-free-font/', 'custom'];
    $scope.font[1236] = ['Static', 'Static Bold.otf', 256, 'Sans Serif', 30, 0, 45, 33, 27, 700, 'Normal', 'http://fontfabric.com/static-free-font/', 'custom'];
    $scope.font[1237] = ['Static', 'Static Italic.otf', 256, 'Sans Serif', 21, 2, 47, 31, 29, 400, 'Italic', 'http://fontfabric.com/static-free-font/', 'custom'];
    $scope.font[1238] = ['Static', 'Static.otf', 256, 'Sans Serif', 20, 0, 46, 30, 29, 400, 'Normal', 'http://fontfabric.com/static-free-font/', 'custom'];
    $scope.font[1239] = ['Bitstream Vera Serif', 'VeraSerif-Bold.ttf', 277, 'Slab Serif', 63, 46, 75, 61, 17, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Bitstream-Vera-Serif', 'custom'];
    $scope.font[1240] = ['Bitstream Vera Serif', 'VeraSerif.ttf', 277, 'Slab Serif', 28, 58, 61, 43, 17, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Bitstream-Vera-Serif', 'custom'];
    $scope.font[1241] = ['Vetka', 'Vetka.otf', 267, 'Fun', 4, 10, 19, 25, 12, 400, 'Normal', 'http://ruskhasanov.com/8721/1146800/design/vetka-free-font', 'custom'];
    $scope.font[1242] = ['Weston Free', 'Weston Free.otf', 374, 'All Caps', 16, 36, 53, 37, 12, 400, 'Normal', 'http://fontfabric.com/weston-free-font/', 'custom'];
    $scope.font[1243] = ['Weston Free', 'Weston Light Free.otf', 374, 'All Caps', 8, 39, 54, 38, 12, 300, 'Normal', 'http://fontfabric.com/weston-free-font/', 'custom'];
    $scope.font[1244] = ['Archive', 'archive.otf', 351, 'All Caps', 29, 38, 46, 29, 12, 400, 'Normal', 'http://fontfabric.com/archive-free-font/', 'custom'];
    $scope.font[1245] = ['Code Pro Demo', 'code_pro_demo.otf', 373, 'All Caps', 16, 47, 39, 38, 12, 400, 'Normal', 'http://www.myfonts.com/fonts/font-fabric/code-pro/', 'custom'];
    $scope.font[1246] = ['Code Pro Demo', 'code_pro_light_demo.otf', 373, 'All Caps', 1, 57, 39, 38, 12, 300, 'Normal', 'http://www.myfonts.com/fonts/font-fabric/code-pro/', 'custom'];
    $scope.font[1247] = ['Contra', 'contra-italic.ttf', 278, 'Serif', 12, 31, 31, 39, 21, 400, 'Italic', 'http://www.fonts2u.com/contra-italic.font', 'custom'];
    $scope.font[1248] = ['Contra', 'contra.ttf', 279, 'Serif', 11, 68, 33, 37, 20, 400, 'Normal', 'http://www.fonts2u.com/contra.font', 'custom'];
    $scope.font[1249] = ['Calluna', 'exljbris - Calluna-Regular.otf', 256, 'Serif', 14, 62, 36, 57, 35, 400, 'Normal', 'http://www.exljbris.com/calluna.html', 'custom'];
    $scope.font[1250] = ['Calluna Sans', 'exljbris - CallunaSans-Regular.otf', 240, 'Sans Serif', 25, 0, 57, 55, 36, 400, 'Normal', 'http://www.exljbris.com/callunasans.html', 'custom'];
    $scope.font[1251] = ['Latin Modern Roman', 'lmroman10-bold.otf', 240, 'Serif', 30, 60, 69, 90, 34, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1252] = ['Latin Modern Roman', 'lmroman10-bolditalic.otf', 245, 'Serif', 29, 29, 65, 70, 32, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1253] = ['Latin Modern Roman', 'lmroman10-italic.otf', 242, 'Serif', 8, 23, 46, 46, 35, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1254] = ['Latin Modern Roman', 'lmroman10-regular.otf', 236, 'Slab Serif', 23, 62, 67, 68, 29, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1255] = ['Latin Modern Roman Caps', 'lmromancaps10-oblique.otf', 274, 'All Caps', 16, 40, 63, 54, 12, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1256] = ['Latin Modern Roman Caps', 'lmromancaps10-regular.otf', 274, 'All Caps', 16, 39, 63, 54, 12, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1257] = ['Latin Modern Roman Demi', 'lmromandemi10-oblique.otf', 240, 'All Caps', 29, 39, 60, 63, 100, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1258] = ['Latin Modern Roman Demi', 'lmromandemi10-regular.otf', 240, 'Slab Serif', 43, 49, 65, 65, 26, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1259] = ['Latin Modern Roman Dunhill', 'lmromandunh10-oblique.otf', 236, 'Slab Serif', 24, 62, 68, 69, 100, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1260] = ['Latin Modern Roman Dunhill', 'lmromandunh10-regular.otf', 236, 'Slab Serif', 23, 62, 67, 68, 100, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1261] = ['Latin Modern Roman Slanted', 'lmromanslant10-bold.otf', 240, 'Slab Serif', 44, 48, 84, 85, 26, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1262] = ['Latin Modern Roman Slanted', 'lmromanslant10-regular.otf', 236, 'Serif', 9, 70, 54, 70, 37, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Latin-Modern-Roman', 'custom'];
    $scope.font[1263] = ['Luxi Mono', 'luximb.ttf', 283, 'Monospace', 74, 60, 56, 46, 64, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/Luxi-Mono', 'custom'];
    $scope.font[1264] = ['Luxi Mono', 'luximbi.ttf', 283, 'Monospace', 75, 60, 57, 48, 64, 700, 'Italic', 'http://www.fontsquirrel.com/fonts/Luxi-Mono', 'custom'];
    $scope.font[1265] = ['Luxi Mono', 'luximr.ttf', 283, 'Monospace', 41, 63, 40, 33, 64, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Luxi-Mono', 'custom'];
    $scope.font[1266] = ['Luxi Mono', 'luximri.ttf', 283, 'Monospace', 42, 63, 42, 34, 64, 400, 'Italic', 'http://www.fontsquirrel.com/fonts/Luxi-Mono', 'custom'];
    $scope.font[1267] = ['Mentone', 'mentone-semibol-ita.otf', 267, 'Sans Serif', 36, 2, 58, 49, 28, 600, 'Italic', 'http://www.fontsquirrel.com/fonts/Mentone', 'custom'];
    $scope.font[1268] = ['Mentone', 'mentone-semibol.otf', 267, 'Sans Serif', 36, 5, 57, 49, 28, 600, 'Normal', 'http://www.fontsquirrel.com/fonts/Mentone', 'custom'];
    $scope.font[1269] = ['Miso', 'miso-bold.otf', 262, 'Sans Serif', 26, 0, 30, 22, 20, 700, 'Normal', 'http://www.fontspace.com/m%C3%A5rten-nettelbladt/miso', 'custom'];
    $scope.font[1270] = ['Miso', 'miso-light.otf', 233, 'Sans Serif', 9, 0, 37, 22, 24, 300, 'Normal', 'http://www.fontspace.com/m%C3%A5rten-nettelbladt/miso', 'custom'];
    $scope.font[1271] = ['Mplus', 'mplus-1c-black.ttf', 278, 'Sans Serif', 60, 0, 65, 48, 20, 900, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1272] = ['Mplus', 'mplus-1c-bold.ttf', 278, 'Sans Serif', 41, 0, 60, 44, 20, 700, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1273] = ['Mplus', 'mplus-1c-heavy.ttf', 278, 'Sans Serif', 51, 0, 63, 46, 20, 900, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1274] = ['Mplus', 'mplus-1c-light.ttf', 278, 'Sans Serif', 13, 0, 54, 38, 20, 300, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1275] = ['Mplus', 'mplus-1c-medium.ttf', 278, 'Sans Serif', 31, 0, 57, 42, 20, 500, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1276] = ['Mplus', 'mplus-1c-regular.ttf', 278, 'Sans Serif', 22, 0, 56, 40, 20, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1277] = ['Mplus', 'mplus-1c-thin.ttf', 278, 'Sans Serif', 3, 0, 53, 37, 20, 100, 'Normal', 'http://www.fontsquirrel.com/fonts/M-1c', 'custom'];
    $scope.font[1278] = ['Multicolore ', 'multicolore.otf', 372, 'All Caps', 20, 2, 48, 38, 12, 400, 'Normal', 'http://www.dafont.com/multicolore.font', 'custom'];
    $scope.font[1279] = ['Negotiate', 'negotiate_free.ttf', 266, 'Sans Serif', 32, 0, 48, 41, 27, 400, 'Normal', 'http://www.fontsquirrel.com/fonts/Negotiate', 'custom'];
    $scope.font[1280] = ['Silverfake', 'silverfake.otf', 261, 'All Caps', 23, 100, 100, 100, 12, 400, 'Normal', 'http://fontfabric.com/silverfake-free-font/', 'custom'];

    $scope.init();

});
