import { myCanva } from "./initialize.js";

export class Wires {
    drawWires(ctx, wires) {
        this.wires = wires;
        
        this.wires.forEach(pos => {
            // Shadow for depth
            ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, pos + 2);
            for (let x = 0; x <= myCanva.width; x += 20) {
                const sag = Math.sin((x / myCanva.width) * Math.PI) * 15;
                ctx.lineTo(x, pos + sag + 2);
            }
            ctx.stroke();
            
            // Main wire with sag
            ctx.strokeStyle = "#9111F2";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, pos);
            for (let x = 0; x <= myCanva.width; x += 20) {
                const sag = Math.sin((x / myCanva.width) * Math.PI) * 15;
                ctx.lineTo(x, pos + sag);
            }
            ctx.stroke();
        });
    }
}