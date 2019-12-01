"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var g = new Grafo();
    let addNodoBtn = document.getElementById('addNodo');
    let addAristaBtn = document.getElementById('addArista');
    let deleteBtn = document.getElementById('delete');
    let sortBtn = document.getElementById('sort');
    let pngBtn = document.getElementById('png');
    let saveBtn = document.getElementById('save');
    let openBtn = document.getElementById('openBtn');
    console.log(g);
    var cy = cytoscape({
        container: document.getElementById('cy'),
        layout: {
            name: 'avsdf',
            nodeSeparation: 100
        },
        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'color': '#000000',
                    'background-color': '#3a7ecf'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#3a7ecf',
                    'opacity': 0.5
                }
            },
            {
                selector: ':selected', style: {
                    'background-color': 'cyan',
                    'line-color': 'cyan'
                }
            }
        ],
        elements: g.getElements()
    });
    cy.on('taphold', function (e) {
        let ele = e.target;
        if (ele.selected()) {
            ele.unselect();
        }
        else {
            ele.select();
        }
    });
    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 78:
                addNodo(cy);
                break;
            case 69:
                addArista(cy);
                break;
            case 46:
                delElements(cy);
                break;
            case 79:
                animate(cy);
                break;
            case 80:
                printPNG(cy);
                break;
            case 83:
                saveJSON(cy);
                break;
            default:
                console.log(e.keyCode);
        }
    }, false);
    if (addNodoBtn != null)
        addNodoBtn.addEventListener("click", function () {
            addNodo(cy);
        });
    if (addAristaBtn != null)
        addAristaBtn.addEventListener("click", function () {
            addArista(cy);
        });
    if (deleteBtn != null)
        deleteBtn.addEventListener("click", function () {
            delElements(cy);
        });
    if (sortBtn != null)
        sortBtn.addEventListener("click", function () {
            animate(cy);
        });
    if (pngBtn != null)
        pngBtn.addEventListener("click", function () {
            printPNG(cy);
        });
    if (saveBtn != null)
        saveBtn.addEventListener("click", function () {
            saveJSON(cy);
        });
    if (openBtn != null)
        openBtn.onchange = function (e) {
            let file = document.forms['options']['open'].files[0];
            var fr = new FileReader();
            fr.onload = function (e) {
                // e.target.result should contain the text
                if (e.target != null && e.target.result != null) {
                    let jsongr = JSON.parse(e.target.result.toString());
                    console.log(jsongr);
                    cy.json(jsongr);
                }
            };
            fr.readAsText(file);
        };
});
function addNodo(cy) {
    let id = prompt("Tag");
    if (id != null && id != '') {
        cy.add({ group: "nodes", data: { id: id } });
        animate(cy);
    }
}
function addArista(cy) {
    let nodos = cy.$(":selected").nodes();
    if (0 < nodos.length && nodos.length <= 2) {
        let ida = nodos[0].data('id');
        let idb = ida;
        if (nodos.length == 2) {
            idb = nodos[1].data('id');
        }
        cy.add({ group: "edges", data: { id: ida + "to" + idb, source: ida, target: idb, directed: 'false' } });
        animate(cy);
    }
}
function delElements(cy) {
    let eles = cy.$(":selected").remove();
    animate(cy);
    return eles;
}
function printPNG(cy) {
    let name = prompt("Nombre del archivo", "graph.png");
    if (name != null) {
        if (!name.endsWith('.png') && !name.endsWith('.PNG'))
            name += ".png";
        let file = cy.png({ output: "blob", full: true });
        download(file, name);
    }
}
function saveJSON(cy) {
    let name = prompt("Nombre del archivo", "graph.ggr");
    if (name != null) {
        if (!name.endsWith('.ggr'))
            name += ".ggr";
        let jsongr = JSON.stringify(cy.json());
        var file = new Blob([jsongr], { type: "application/json" });
        download(file, name);
    }
}
function animate(cy) {
    var layout = cy.layout({
        name: 'avsdf',
        animate: "end",
        animationDuration: 1000,
        animationEasing: 'ease-in-out',
        nodeSeparation: 100
    });
    layout.run();
}
function download(file, filename) {
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
