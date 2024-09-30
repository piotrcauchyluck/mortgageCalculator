import { DataRow, InstallementType, OverpaymentResult } from './types';
import { parseNumber } from './utils';

interface DataRowInputs {
    nr: number;
    month: string;
    debt: number;
    interestRate: number;
    type: InstallementType;
    overpaymentResult: OverpaymentResult;
    totalMonthsNumber: number;
    totalDebt: number;
}

interface DataInputs {
    debt: number;
    interestRate: number;
    months: number;
    type: InstallementType;
    overpaymentResult: OverpaymentResult;
}

const calculateDataRow = (inputs: DataRowInputs): DataRow => {
    const { nr, month, debt, type } = inputs;
    if (nr === 0) {
        return { nr, month, debt };
    }

    const { interestRate, totalMonthsNumber, totalDebt } = inputs;

    const interestRateMonthly = interestRate / 12;

    let principalInstallment;
    const interest = parseNumber(debt * interestRateMonthly);

    if (type === InstallementType.decreasing) {
        principalInstallment = parseNumber(totalDebt / totalMonthsNumber);
    } else {
        const totalAmount =
            (totalDebt *
                interestRateMonthly *
                Math.pow(1 + interestRateMonthly, totalMonthsNumber)) /
            (Math.pow(1 + interestRateMonthly, totalMonthsNumber) - 1);
        principalInstallment = parseNumber(totalAmount - interest);
    }

    return {
        nr,
        month,
        debt: parseNumber(debt - principalInstallment),
        principalInstallment,
        interest,
        installmentAmount: parseNumber(principalInstallment + interest),
        overpayment: 0,
    };
};

export const calculateData = (inputs: DataInputs): DataRow[] => {
    const { debt, months, ...rest } = inputs;
    const firstRow = calculateDataRow({
        nr: 0,
        month: '01.2021',
        debt,
        totalMonthsNumber: months,
        totalDebt: debt,
        ...rest,
    });
    let remainingDebt = debt;
    const data = [...Array(months).keys()].map((index) => {
        const dataRow = calculateDataRow({
            nr: index + 1,
            month: '01.2021',
            debt: remainingDebt,
            totalMonthsNumber: months,
            totalDebt: debt,
            ...rest,
        });
        remainingDebt = dataRow.debt;

        return dataRow;
    });

    return [firstRow, ...data];
};
