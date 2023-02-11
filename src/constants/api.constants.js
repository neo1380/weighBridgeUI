// export const BASE_URL = "http://localhost:8389/";
// export const BASE_URL = "https://wbmheroku-boot.herokuapp.com/";
export const BASE_URL =
  "http://ec2-13-233-224-164.ap-south-1.compute.amazonaws.com/";

export const AUTH_URL = "https://aldakheel-api-v1.vercel.app/api/v1/";

export const API_ENDPOINTS = {
  //   GET_MATERIAL: "material/materialList?sortby=asc",
  LOGIN: "users/login",
  GET_MATERIAL: "material/materialList/materialName/1",
  SAVE_MATERIAL: "material/savematerial",
  CREATE_TRANSACTION: "transaction/saveTransactions",
  TEMP_TRANSACTION: "transaction/temporaryTransactionList",
  CURRENT_DAY_TRANSACTION: "transaction/currentDayTransactionList",
  GET_TRANSACTION_BY_ID: "transaction/transactionById/",
  GET_ALL_TRANSACTIONS: "transaction/transactionList/{sortParam}/{order}",
};
