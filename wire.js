import { myCanva } from "./initialize.js";
export class Wires {
    drawWires(ctx, wires) {
        this.wires = wires;
        ctx.strokeStyle = "#9111F2";
        ctx.lineWidth = 2
        this.wires.forEach(pos => {
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(myCanva.width, pos);
            ctx.stroke();
        });
    }
}