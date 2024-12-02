import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

import { type CardState } from './types';
import {
    DataInputsParams,
    InstallementType,
    OverpaymentResult,
} from '../components/calculator/types';

const initialState: CardState = {
    dataInputs: {
        [DataInputsParams.totalPrincipal]: 0,
        [DataInputsParams.interestRate]: 0,
        [DataInputsParams.numberOfMonths]: 0,
        [DataInputsParams.installementType]: InstallementType.equal,
        [DataInputsParams.overpaymentResult]: OverpaymentResult.lowerInterest,
        [DataInputsParams.overpayment]: {},
    },
};

const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        updateDataInput: (
            state: CardState,
            action: PayloadAction<{
                name: DataInputsParams;
                value: number | string;
            }>
        ) => {
            const { name, value } = action.payload;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            state.dataInputs[name] = value || 0;
        },
        updateOverpaymentInput: (
            state: CardState,
            action: PayloadAction<{
                nr: number;
                value: number;
            }>
        ) => {
            const { nr, value } = action.payload;
            if (!value) delete state.dataInputs.overpayment[nr];
            else {
                state.dataInputs.overpayment[nr] = value;
            }
        },
    },
});

export const { updateDataInput, updateOverpaymentInput } = cardSlice.actions;

export const selectDataInputs = (state: RootState) => state.card.dataInputs;
export const selectOverpayment = (state: RootState) =>
    state.card.dataInputs.overpayment;

export default cardSlice.reducer;
