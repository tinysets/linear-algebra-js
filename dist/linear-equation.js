"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function copy(data) {
    return JSON.parse(JSON.stringify(data));
}
function getRows(A) {
    return A.length;
}
function getCols(A) {
    let cols = 0;
    for (const row of A) {
        if (cols == 0) {
            cols = row.length;
        }
        if (cols != row.length) {
            // 参数不合法
            throw new Error("不是矩阵");
        }
    }
    return cols;
}
function identity(rows, cols) {
    let mat = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        mat.push(row);
        for (let j = 0; j < cols; j++) {
            if (i == j) {
                row.push(1);
            }
            else {
                row.push(0);
            }
        }
    }
    return mat;
}
function isIdentity(A) {
    let rows = getRows(A);
    let cols = getCols(A);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row == col) {
                if (A[row][col] != 1) {
                    return false;
                }
            }
            else {
                if (A[row][col] != 0) {
                    return false;
                }
            }
        }
    }
    return true;
}
function mul(A, B) {
    let rows = getRows(A);
    let A_cols = getCols(A);
    let B_rows = getRows(B);
    let cols = getCols(B);
    if (A_cols != B_rows) {
        throw new Error("矩阵规格不同，不能相乘");
    }
    let result = identity(rows, cols);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let sum = 0;
            for (let i = 0; i < A_cols; i++) {
                sum += A[row][i] * B[i][col];
            }
            result[row][col] = sum;
        }
    }
    return result;
}
function transpose(A) {
    let rows = getRows(A);
    let cols = getCols(A);
    if (rows != cols) {
        throw new Error("矩阵不是方阵");
    }
    let result = identity(rows, cols);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            result[row][col] = A[col][row];
        }
    }
    return result;
}
function equal(A, B) {
    return JSON.stringify(A) == JSON.stringify(B);
}
function solveLinearEquation(coefficientMatrix, constants) {
    let order = coefficientMatrix.length;
    if (order != constants.length || order == 0) {
        return; // 参数不合法
    }
    for (const row of coefficientMatrix) {
        if (order != row.length) {
            return; // 参数不合法
        }
    }
    let findMaxRow = (row, col) => {
        let maxRow = row;
        let max = Math.abs(coefficientMatrix[row][col]);
        for (let i = row + 1; i < order; i++) {
            if (Math.abs(coefficientMatrix[i][col]) > max) {
                max = Math.abs(coefficientMatrix[i][col]);
                maxRow = i;
            }
        }
        return maxRow;
    };
    let swapRow = (rowA, rowB) => {
        if (rowA == rowB) {
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
        for (let c = col; c < order; c++) {
            coefficientMatrix[row][c] = coefficientMatrix[row][c] / divBy;
        }
        constants[row] = constants[row] / divBy;
    };
    let setOtherRowZero = (row, col) => {
        for (let r = 0; r < order; r++) {
            if (r == row) {
                continue;
            }
            if (coefficientMatrix[r][col] != 0) {
                let mul = -coefficientMatrix[r][col];
                for (let c = col; c < order; c++) {
                    coefficientMatrix[r][c] = coefficientMatrix[r][c] + mul * coefficientMatrix[row][c];
                }
                constants[r] = constants[r] + mul * constants[row];
            }
        }
    };
    for (let i = 0; i < order; i++) {
        let row = i;
        for (let col = i; col < order; col++) {
            let maxRow = findMaxRow(row, col);
            swapRow(row, maxRow);
            if (coefficientMatrix[row][col] != 0) { // 主元
                rowDiv(row, col);
                setOtherRowZero(row, col);
                break;
            }
        }
    }
    for (let i = 0; i < order; i++) {
        let row = i;
        let zeroRow = true;
        for (let col = 0; col < order; col++) {
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
    for (let col = 0; col < order; col++) {
        mainCellRows[col] = -1;
    }
    for (let i = 0; i < order; i++) {
        let row = i;
        for (let col = 0; col < order; col++) {
            if (coefficientMatrix[row][col] != 0) { // 主元
                mainCellRows[col] = row;
                break;
            }
        }
    }
    let newFreeVector = () => {
        let ret = [];
        for (let i = 0; i < order; i++) {
            ret[i] = 0;
        }
        return ret;
    };
    let resultVectors = [];
    {
        let specialVector = newFreeVector();
        for (let c = 0; c < order; c++) {
            const mainCellRow = mainCellRows[c];
            if (mainCellRow != -1) {
                specialVector[c] = constants[mainCellRow];
            }
        }
        resultVectors.push(specialVector);
    }
    for (let col = 0; col < order; col++) {
        const row = mainCellRows[col];
        if (row == -1) { // free cell  自由变量
            let freeVector = newFreeVector();
            for (let c = 0; c < order; c++) {
                const mainCellRow = mainCellRows[c];
                if (mainCellRow != -1) {
                    freeVector[c] = -coefficientMatrix[mainCellRow][col];
                }
            }
            freeVector[col] = 1;
            resultVectors.push(freeVector);
        }
    }
    return resultVectors;
}
exports.solveLinearEquation = solveLinearEquation;
function lu(A) {
    let rows = getRows(A);
    let cols = getCols(A);
    let min = Math.min(rows, cols);
    let P = identity(rows, rows);
    let L = identity(rows, rows);
    let U = identity(rows, cols);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            U[row][col] = A[row][col];
        }
    }
    let findMaxRow = (row, col) => {
        let maxRow = row;
        let max = Math.abs(U[row][col]);
        for (let i = row + 1; i < rows; i++) {
            if (Math.abs(U[i][col]) > max) {
                max = Math.abs(U[i][col]);
                maxRow = i;
            }
        }
        return maxRow;
    };
    let swapRow = (rowA, rowB) => {
        if (rowA == rowB) {
            return;
        }
        let tmpRow = U[rowA];
        U[rowA] = U[rowB];
        U[rowB] = tmpRow;
        tmpRow = P[rowA];
        P[rowA] = P[rowB];
        P[rowB] = tmpRow;
    };
    let setBottomRowZero = (row, col) => {
        let cell = U[row][col];
        for (let r = row + 1; r < rows; r++) {
            if (U[r][col] != 0) {
                let mul = -U[r][col] / cell;
                L[r][col] = -mul;
                for (let c = col; c < cols; c++) {
                    U[r][c] = U[r][c] + mul * U[row][c];
                }
            }
        }
    };
    for (let r = 0; r < min; r++) {
        let row = r;
        let col = r;
        let maxRow = findMaxRow(row, col);
        swapRow(row, maxRow);
        if (U[row][col] != 0) {
            setBottomRowZero(row, col);
        }
    }
    if (isIdentity(P)) {
        return { P, L, U };
    }
    else {
        let { L, U } = lu(mul(P, A));
        let P_inv = transpose(P);
        let result_A = mul(P_inv, mul(L, U));
        let eq = equal(result_A, A);
        if (!eq) {
            throw new Error("PLU结果不正确");
        }
        return { P: P_inv, L, U };
    }
}
exports.lu = lu;
//# sourceMappingURL=linear-equation.js.map