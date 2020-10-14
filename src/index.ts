import { solveLinearEquation } from "./linear-equation";

setTimeout(() => {
    let mat = [
        [2, -1, 0],
        [5, 3, 2],
        [3, 0, 1],
    ];
    let consts = [7, 3, 7];
    solveLinearEquation(mat, consts); // [2,-3,1]
}, 1000);