import L from "leaflet";

export class GridMapControl extends L.Control {
    onAdd(map) {
        this.map = map;
        this.container = document.createElement("div");
        this.init();
        return this.container;
    }

    onRemove(map) {
        if (this.container) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    init() {}
}
