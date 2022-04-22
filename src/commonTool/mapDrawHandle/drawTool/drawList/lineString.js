import { Style } from "ol/style";
import Stroke from "ol/style/Stroke";
import { drawTool } from "../../core/drawTool";

export class lineStringDraw extends drawTool {
    constructor() {
        super()
    }
    initStyle() {
        return [
            new Style({
                stroke: new Stroke({
                    color: 'block',
                    width: 2,
                }),
            })
        ]
    }
}