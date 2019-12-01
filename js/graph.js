"use strict";
class Nodo {
    constructor(tag) {
        this.tag = tag;
    }
}
class Grafo {
    constructor() {
        this.nodos = [];
        this.adj = [];
    }
    addNodo(tag) {
        this.nodos.push(new Nodo(tag));
        for (let i = 0; i < this.adj.length; i++) {
            this.adj[i].push(-1);
        }
        this.adj.push(new Array(this.nodos.length).fill(-1));
    }
    addArista(ori, dest) {
        if (ori in this.adj && dest in this.adj) {
            this.adj[ori][dest] = 1;
            this.adj[dest][ori] = 1;
        }
    }
    getElements() {
        let nodes = [];
        for (let n of this.nodos) {
            let d = { data: { id: n.tag }, selectable: true };
            nodes.push(d);
        }
        let edges = [];
        for (let i = 0; i < this.nodos.length; i++) {
            for (let j = 0; j <= i; j++) {
                if (this.adj[i][j] > 0) {
                    let s = this.nodos[i].tag;
                    let t = this.nodos[j].tag;
                    edges.push({ data: { id: s + "to" + t, source: s, target: t, directed: 'false' } });
                }
            }
        }
        return { nodes: nodes, edges: edges };
    }
    matriz() {
        var str = "";
        for (let i = 0; i < this.adj.length; i++) {
            str += i + "->" + row(this.adj[i]) + "\n";
        }
        return str;
    }
}
function row(o) {
    var str = "{";
    for (var k in o) {
        str += k + ":" + o[k] + " ";
    }
    return str + "}";
}
