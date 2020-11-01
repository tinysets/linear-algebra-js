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
    let result = identity(cols, rows);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            result[col][row] = A[row][col];
        }
    }
    return result;
}
function equal(A, B) {
    return JSON.stringify(A) == JSON.stringify(B);
}
function length(v) {
    let l = 0;
    for (const num of v) {
        l += num * num;
    }
    return l;
}
const EPSILON = 0.00001;
function isZeroVector(v) {
    return length(v) <= EPSILON;
}
function getColumnVector(A, c) {
    let v = [];
    for (const row of A) {
        v.push(row[c]);
    }
    return v;
}
function dot(v1, v2) {
    let result = 0;
    for (let i = 0; i < v1.length; i++) {
        result += v1[i] * v2[i];
    }
    return result;
}
function number_mul_vector(n, vector) {
    let result = [];
    for (let i = 0; i < vector.length; i++) {
        result.push(vector[i] * n);
    }
    return result;
}
function vector_sub(v1, v2) {
    let result = [];
    for (let i = 0; i < v1.length; i++) {
        result.push(v1[i] - v2[i]);
    }
    return result;
}
function solveLinearEquation(coefficientMatrix, constants) {
    let rows = getRows(coefficientMatrix);
    let cols = getCols(coefficientMatrix);
    if (rows == 0 || cols == 0 || constants.length != rows) {
        return; // 参数不合法
    }
    let findMaxRow = (row, col) => {
        let maxRow = row;
        let max = Math.abs(coefficientMatrix[row][col]);
        for (let r = row + 1; r < rows; r++) {
            if (Math.abs(coefficientMatrix[r][col]) > max) {
                max = Math.abs(coefficientMatrix[r][col]);
                maxRow = r;
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
        for (let c = col; c < cols; c++) {
            coefficientMatrix[row][c] = coefficientMatrix[row][c] / divBy;
        }
        constants[row] = constants[row] / divBy;
    };
    let setOtherRowZero = (row, col) => {
        for (let r = 0; r < rows; r++) {
            if (r == row) {
                continue;
            }
            if (coefficientMatrix[r][col] != 0) {
                let mul = -coefficientMatrix[r][col];
                for (let c = col; c < cols; c++) {
                    coefficientMatrix[r][c] = coefficientMatrix[r][c] + mul * coefficientMatrix[row][c];
                }
                constants[r] = constants[r] + mul * constants[row];
            }
        }
    };
    for (let r = 0; r < rows; r++) {
        for (let c = r; c < cols; c++) {
            let maxRow = findMaxRow(r, c);
            swapRow(r, maxRow);
            if (coefficientMatrix[r][c] != 0) { // 主元
                rowDiv(r, c);
                setOtherRowZero(r, c);
                break;
            }
        }
    }
    for (let r = 0; r < rows; r++) {
        let zeroRow = true;
        for (let c = 0; c < cols; c++) {
            if (coefficientMatrix[r][c] != 0) { // 主元
                zeroRow = false;
                break;
            }
        }
        if (zeroRow) {
            if (constants[r] != 0) {
                return null; // 无解
            }
        }
    }
    let pivotRowIndexs = []; // 主元所在的行
    for (let c = 0; c < cols; c++) {
        pivotRowIndexs[c] = -1;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (coefficientMatrix[r][c] != 0) { // 主元
                pivotRowIndexs[c] = r;
                break;
            }
        }
    }
    let newFreeVector = () => {
        let ret = [];
        for (let c = 0; c < cols; c++) {
            ret[c] = 0;
        }
        return ret;
    };
    let resultVectors = [];
    {
        let specialVector = newFreeVector();
        for (let c = 0; c < cols; c++) {
            const pivotRow = pivotRowIndexs[c];
            if (pivotRow != -1) {
                specialVector[c] = constants[pivotRow];
            }
        }
        resultVectors.push(specialVector);
    }
    for (let c = 0; c < cols; c++) {
        if (pivotRowIndexs[c] == -1) { // free variable 自由变量
            let freeVector = newFreeVector();
            for (let cc = 0; cc < cols; cc++) {
                const pivotRow = pivotRowIndexs[cc];
                if (pivotRow != -1) {
                    freeVector[cc] = -coefficientMatrix[pivotRow][c];
                }
            }
            freeVector[c] = 1;
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
    let U = copy(A);
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
function rref(A) {
    let R = copy(A);
    let rows = getRows(R);
    let cols = getCols(R);
    let findMaxRow = (row, col) => {
        let maxRow = row;
        let max = Math.abs(R[row][col]);
        for (let i = row + 1; i < rows; i++) {
            if (Math.abs(R[i][col]) > max) {
                max = Math.abs(R[i][col]);
                maxRow = i;
            }
        }
        return maxRow;
    };
    let swapRow = (rowA, rowB) => {
        if (rowA == rowB) {
            return;
        }
        let tmpRow = R[rowA];
        R[rowA] = R[rowB];
        R[rowB] = tmpRow;
    };
    let rowDiv = (row, col) => {
        let divBy = R[row][col];
        for (let c = col; c < cols; c++) {
            R[row][c] = R[row][c] / divBy;
        }
    };
    let setOtherRowZero = (row, col) => {
        for (let r = 0; r < rows; r++) {
            if (r == row) {
                continue;
            }
            if (R[r][col] != 0) {
                let mul = -R[r][col];
                for (let c = col; c < cols; c++) {
                    R[r][c] = R[r][c] + mul * R[row][c];
                }
            }
        }
    };
    for (let r = 0, c = 0; r < rows && c < cols;) {
        let maxRow = findMaxRow(r, c);
        swapRow(r, maxRow);
        if (R[r][c] != 0) {
            rowDiv(r, c);
            setOtherRowZero(r, c);
            r++;
            c++;
        }
        else {
            c++;
        }
    }
    return R;
}
exports.rref = rref;
// 列空间 的正交化
function Gram_Schmidt_Orthogonalization(A) {
    let rows = getRows(A);
    let cols = getCols(A);
    let basis = [];
    for (let c = 0; c < cols; c++) {
        let v = getColumnVector(A, c);
        if (!isZeroVector(v)) {
            let v_cpoy = copy(v);
            for (const b of basis) {
                let b_norm = number_mul_vector(1 / dot(b, b), b);
                let projection_len = dot(v, b);
                let project_vector = number_mul_vector(projection_len, b_norm);
                v_cpoy = vector_sub(v_cpoy, project_vector);
            }
            if (!isZeroVector(v_cpoy)) {
                basis.push(v_cpoy);
            }
        }
    }
    for (let i = 1; i < basis.length; i++) {
        for (let j = 0; j < i; j++) {
            if (!(dot(basis[i], basis[j]) <= EPSILON)) {
                throw new Error("斯密特正交化不正确");
            }
        }
    }
    return basis;
}
exports.Gram_Schmidt_Orthogonalization = Gram_Schmidt_Orthogonalization;
//# sourceMappingURL=linear-algebra.js.map