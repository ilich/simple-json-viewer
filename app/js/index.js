$(document).ready(() =>{

    let jsonTextEditor = (function () {
        let $editor = $("#json-text");

        return {
            parse: function () {
                try {
                    let obj = JSON.parse($editor.val());
                    return obj;
                } 
                catch (err) {
                    alert(err.message);
                    return null;
                }
            },
            format: function (minify) {
                let obj = this.parse();
                if (obj === null) {
                    return;
                }

                let content = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, '\t');
                $editor.val(content);
            },
            resize: function () {
                let height = $(window).height() - $editor.position().top - 30;
                $editor.height(height);
            }
        }
    })();

    let jsonTree = (function () {
        let $tree = $("#json-tree");

        return {
            show: function () {
                let obj = jsonTextEditor.parse();
                if (obj === null) {
                    e.preventDefault();
                    return;
                }

                var counter, data;

                function renderObjectTree(parentId, obj) {
                    for (let prop in obj) {
                        if (!obj.hasOwnProperty(prop)) {
                            continue;
                        }

                        counter++;
                        let id = `item${counter}`;
                        if ($.isPlainObject(obj[prop])) {
                            data.push({
                                id: id,
                                parent: parentId,
                                text: prop,
                                icon: "glyphicon glyphicon-folder-open"
                            });

                            renderTree(id, obj[prop]);
                        }
                        else if ($.isArray(obj[prop])) {
                            data.push({
                                id: id,
                                parent: parentId,
                                text: prop,
                                icon: "glyphicon glyphicon-folder-open"
                            });

                            for (let i = 0; i < obj[prop].length; i++) {
                                let arrItem = obj[prop][i];
                                renderTree(id, arrItem);
                            }
                        }
                        else {
                            data.push({
                                id: id,
                                parent: parentId,
                                text: `${prop} : "${obj[prop]}"`,
                                icon: "glyphicon glyphicon-asterisk"
                            });
                        }
                    }
                }

                function renderTree(parentId, obj) {

                    if ($.isPlainObject(obj)) {
                        renderObjectTree(parentId, obj);
                    }
                    else if ($.isArray(obj)) {
                        for (let i = 0; i < obj.length; i++) {
                            let arrItem = obj[i];
                            renderTree(parentId, arrItem);
                        }
                    }
                    else {
                        counter++;
                            let id = `item${counter}`;
                            
                        data.push({
                            id: id,
                            parent: parentId,
                            text: `"${obj}"`,
                            icon: "glyphicon glyphicon-asterisk"
                        });
                    }
                }

                data = [];
                counter = 0;
                renderTree("#", obj);
                
                var treeObj = $tree.jstree(true);
                if (treeObj === false) {
                    $tree.jstree({
                        core : {
                            data: data
                        }
                    });
                }
                else {
                    treeObj.settings.core.data = data;
                    treeObj.refresh();
                }
            }
        }
    })();

    jsonTextEditor.resize();
    $(window).resize(() => {
        jsonTextEditor.resize();
    });

    $("#json-format").click(() => {
        jsonTextEditor.format(false);
    });

    $("#json-minify").click(() => {
        jsonTextEditor.format(true);
    });

    $('a[data-toggle="tab"]').on("show.bs.tab", (e) => {
        let tabId = e.target.getAttribute("aria-controls");
        if (tabId === "viewer") {
            jsonTree.show();
        }
    });

});