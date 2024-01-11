import { places } from "../stores";
import { get } from "svelte/store";
import type { Place } from "../types";

type variablesType = {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
};

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let clicked = false;
const gridSize = 15;

export const setVar = (t: variablesType) => {
    canvas = t.canvas;
    ctx = t.ctx;
};

const draw = (place: Place) => {
    const { a1, a2, a3, a4, type, selected } = place;
    if (selected) {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = type === "parking" ? "grey" : "orange";
    }
    ctx.beginPath();
    ctx.moveTo(a1[0], a1[1]);
    ctx.lineTo(a2[0], a2[1]);
    ctx.lineTo(a3[0], a3[1]);
    ctx.lineTo(a4[0], a4[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

const isPointInsideTriangle = (x, y, x1, y1, x2, y2, x3, y3) => {
    // Calculate barycentric coordinates
    const detT = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    const alpha = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / detT;
    const beta = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / detT;
    const gamma = 1 - alpha - beta;

    // Check if the point is inside the triangle
    return alpha > 0 && beta > 0 && gamma > 0;
};

const clickOnPlace = (x, y, name = "click") => {
    const pla = get(places);
    const correctPlaceIndex = pla.findIndex((onePlace) => {
        const { a1, a2, a3, a4 } = onePlace;
        if (x >= a1[0] && x <= a3[0] && y >= a1[1] && y <= a3[1]) {
            const c1 = [a1[0] + (a4[0] - a1[0]), a1[1]];
            const c2 = [a3[0] - (a4[0] - a1[0]), a3[1]];
            if (x >= c1[0] && x <= c2[0] && y >= a1[1] && y <= a3[1]) {
                return true;
            } else if (isPointInsideTriangle(x, y, a1[0], a1[1], c1[0], c1[1], a4[0], a4[1])) {
                return true;
            } else if (isPointInsideTriangle(x, y, a2[0], a2[1], a3[0], a3[1], c2[0], c2[1])) {
                return true;
            }
            return false;
        }
    });
    if (correctPlaceIndex > -1) {
        places.update((currVal) => {
            if (name === "click") {
                currVal[correctPlaceIndex].selected = !currVal[correctPlaceIndex].selected;
            } else if (name === "move") {
                currVal[correctPlaceIndex].selected = true;
            }
            return [...currVal];
        });
        drawParking();
    }
};

const handleClick = (event: any) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    clickOnPlace(x, y);
};

const handleMove = (event: any) => {
    if (clicked) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        clickOnPlace(x, y, "move");
    }
};

export const drawParking = () => {
    for (const onePlace of get(places)) {
        draw(onePlace);
    }
};

const setClick = () => {
    clicked = true;
};
const setNotClick = () => {
    clicked = false;
};
export const setUpEvent = (newEditMode: boolean) => {
    if (newEditMode) {
        canvas.addEventListener("click", handleClick);
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("mousedown", setClick);
        canvas.addEventListener("mouseup", setNotClick);
    } else {
        places.update((val) => {
            const newPlaces = val.map((onePlace) => {
                onePlace.selected = false;
                return onePlace;
            });
            return [...newPlaces];
        });
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("mousedown", setClick);
        canvas.removeEventListener("mouseup", setNotClick);
    }
    drawParking();
};

export const generateParking = () => {
    let total = 0;
    let placesTotal = [];
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const a = x * gridSize * 5 + total;
            const b = y * gridSize * 2;
            placesTotal.push({
                selected: false,
                a1: [a, b],
                a2: [a + gridSize * 5, b],
                a3: [a + gridSize * 7, b + gridSize * 2],
                a4: [a + gridSize * 2, b + gridSize * 2],
                type: "parking",
            });
        }
        total += gridSize * 2;
    }
    return placesTotal;
};
