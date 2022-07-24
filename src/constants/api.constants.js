// export const BASE_URL = "http://localhost:8389/";
export const BASE_URL = "https://wbmheroku-boot.herokuapp.com/";

export const API_ENDPOINTS = {
  //   GET_MATERIAL: "material/materialList?sortby=asc",
  GET_MATERIAL: "material/materialList/materialName/1",
  SAVE_MATERIAL: "material/savematerial",
  CREATE_TRANSACTION: "transaction/saveTransactions",
  TEMP_TRANSACTION: "transaction/temporaryTransactionList",
  CURRENT_DAY_TRANSACTION: "transaction/currentDayTransactionList",
};
