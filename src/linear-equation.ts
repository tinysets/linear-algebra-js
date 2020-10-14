
export function solveLinearEquation(coefficientMatrix: number[][], constants: number[]) {
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

    let findMaxRow = (row: number, col: number) => {
        let maxRow = row;
        let max = Math.abs(coefficientMatrix[row][col]);
        for (let i = row + 1; i < coefficientMatrix.length; i++) {
            if (Math.abs(coefficientMatrix[i][col]) > max) {
                max = Math.abs(coefficientMatrix[i][col]);
                maxRow = i;
            }
        }
        return maxRow;
    }

    let swapRow = (rowA: number, rowB: number) => {
        if (rowA != rowB) {
            return;
        }
        let tmpRow = coefficientMatrix[rowA];
        coefficientMatrix[rowA] = coefficientMatrix[rowB];
        coefficientMatrix[rowB] = tmpRow;

        let tmp = constants[rowA];
        constants[rowA] = constants[rowB];
        constants[rowB] = tmp;
    }

    let rowDiv = (row: number, col: number) => {
        let divBy = coefficientMatrix[row][col];
        for (let c = col; c < unknowCount; c++) {
            coefficientMatrix[row][c] = coefficientMatrix[row][c] / divBy;
        }
        constants[row] = constants[row] / divBy;
    }

    let setOtherRowZero = (row: number, col: number) => {
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
    }

    for (let i = 0; i < coefficientMatrix.length; i++) {
        let row = i;
        for (let col = i; col < unknowCount; col++) {
            let maxRow = findMaxRow(row, col);
            swapRow(row, maxRow);
            if (coefficientMatrix[row][col] != 0) {// 主元
                rowDiv(row, col);
                setOtherRowZero(row, col);
                break;
            }
        }
    }
    return;
}