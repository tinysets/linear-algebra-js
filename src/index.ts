import { solveLinearEquation } from "./linear-equation";

setTimeout(() => {
    // let mat = [
    //     [2, -1, 0],
    //     [5, 3, 2],
    //     [3, 0, 1],
    // ];
    // let consts = [7, 3, 7];// [2,-3,1]

    // let mat = [
    //     [1, 2, 3],
    //     [0, 0, 0],
    //     [0, 0, 0],
    // ];
    // let consts = [5, 0, 0];

    // let mat = [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0],
    // ];
    // let consts = [0, 0, 0];

    // let mat = [
    //     [0, 1, 3],
    // ];
    // let consts = [1];

    let mat = [
        [0, 0, 1, 3],
        [0, 0, 0, 0],
    ];
    let consts = [1, 0];

    solveLinearEquation(mat, consts);
}, 1000);