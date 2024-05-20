import { createSlice } from "@reduxjs/toolkit";

export type TypeUserInStore = {
  companyLimit: number;
  usedCompanyCount: number;
  userLoged: boolean
};

const initialState: TypeUserInStore = {
  companyLimit: 0,
  usedCompanyCount: 0,
  userLoged: false
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.companyLimit = action.payload?.eventFiltersInfo?.companyLimit;
      state.usedCompanyCount = action.payload?.eventFiltersInfo?.usedCompanyCount;
      state.userLoged = true
    },
    clearUser(state) {
      state.companyLimit = 0
      state.usedCompanyCount = 0
      state.userLoged = false
    },
  },
});

export default userSlice.reducer;
