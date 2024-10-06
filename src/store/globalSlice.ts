import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

import { type GlobalState } from './types';
import { LanguageList, MenuList } from '../utils/constants';
import { translationsEn, translationsPl } from '../utils/i18n';

const initialState: GlobalState = {
    language: LanguageList.en,
    menu: MenuList.about,
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        changeLanguage: (state, action: PayloadAction<LanguageList>) => {
            state.language = action.payload;
        },
        changeMenu: (state, action: PayloadAction<MenuList>) => {
            state.menu = action.payload;
        },
    },
});

export const { changeLanguage, changeMenu } = globalSlice.actions;

export const selectLanguage = (state: RootState) => state.global.language;
export const selectMenu = (state: RootState) => state.global.menu;
export const selectTranslations = (state: RootState) =>
    state.global.language === LanguageList.en ? translationsEn : translationsPl;

export default globalSlice.reducer;
