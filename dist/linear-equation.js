"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function solveLinearEquation(coefficientMatrix, constants) {
    if (coefficientMatrix.length != constants.length && constants.length > 0) {
        // 参数不合法
        return;
    }
    let unknowCount = 0;
    for (const row of coefficientMatrix) {
        if (unknowCount == 0) {
            unknowCount = row.length;
        }
        if (unknowCount != row.length) {
            // 参数不合法
            return;
        }
    }
    let findMaxRow = (row, col) => {
        let maxRow = row;
        let max = Math.abs(coefficientMatrix[row][col]);
        for (let i = row + 1; i < coefficientMatrix.length; i++) {
            if (Math.abs(coefficientMatrix[i][col]) > max) {
                max = Math.abs(coefficientMatrix[i][col]);
                maxRow = i;
            }
        }
        return maxRow;
    };
    let swapRow = (rowA, rowB) => {
        if (rowA != rowB) {
            return;
        }
        let tmpRow = coefficientMatrix[rowA];
        coefficientMatrix[rowA] = coefficientMatrix[rowB];
        coefficientMatrix[rowB] = tmpRow;
        let tmp = constants[rowA];
        constants[rowA] = constants[rowB];
        constants[rowB] = tmp;
    };
    let rowDiv = (row, col) => {
        let divBy = coefficientMatrix[row][col];
        for (let c = col; c < unknowCount; c++) {
            coefficientMatrix[row][c] = coefficientMatrix[row][c] / divBy;
        }
        constants[row] = constants[row] / divBy;
    };
    let setOtherRowZero = (row, col) => {
        for (let r = 0; r < coefficientMatrix.length; r++) {
            if (r == row) {
                continue;
            }
            if (coefficientMatrix[r][col] != 0) {
                let mul = -coefficientMatrix[r][col];
                for (let c = col; c < unknowCount; c++) {
                    coefficientMatrix[r][c] = coefficientMatrix[r][c] + mul * coefficientMatrix[row][c];
                }
                constants[r] = constants[r] + mul * constants[row];
            }
        }
    };
    for (let i = 0; i < coefficientMatrix.length; i++) {
        let row = i;
        for (let col = i; col < unknowCount; col++) {
            let maxRow = findMaxRow(row, col);
            swapRow(row, maxRow);
            if (coefficientMatrix[row][col] != 0) { // 主元
                rowDiv(row, col);
                setOtherRowZero(row, col);
                break;
            }
        }
    }
    for (let i = 0; i < coefficientMatrix.length; i++) {
        let row = i;
        let zeroRow = true;
        for (let col = 0; col < unknowCount; col++) {
            if (coefficientMatrix[row][col] != 0) { // 主元
                zeroRow = false;
                break;
            }
        }
        if (zeroRow) {
            if (constants[row] != 0) {
                return; // 无解
            }
        }
    }
    let mainCellRows = []; // 主元所在的行
    for (let col = 0; col < unknowCount; col++) {
        mainCellRows[col] = -1;
    }
    for (let i = 0; i < coefficientMatrix.length; i++) {
        let row = i;
        for (let col = 0; col < unknowCount; col++) {
            if (coefficientMatrix[row][col] != 0) { // 主元
                mainCellRows[col] = row;
                break;
            }
        }
    }
    let newFreeVector = () => {
        let ret = [];
        for (let i = 0; i < unknowCount; i++) {
            ret[i] = 0;
        }
        return ret;
    };
    let resultVectors = [];
    {
        let specialVector = newFreeVector();
        for (let c = 0; c < unknowCount; c++) {
            const mainCellRow = mainCellRows[c];
            if (mainCellRow != -1) {
                specialVector[c] = constants[mainCellRow];
            }
        }
        resultVectors.push(specialVector);
    }
    for (let col = 0; col < unknowCount; col++) {
        const row = mainCellRows[col];
        if (row == -1) { // free cell  自由变量
            let freeVector = newFreeVector();
            for (let c = 0; c < unknowCount; c++) {
                const mainCellRow = mainCellRows[c];
                if (mainCellRow != -1) {
                    freeVector[c] = -coefficientMatrix[mainCellRow][col];
                }
            }
            freeVector[col] = 1;
            resultVectors.push(freeVector);
        }
    }
    return;
}
exports.solveLinearEquation = solveLinearEquation;
//# sourceMappingURL=linear-equation.js.map