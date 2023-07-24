import axios from "axios";
import apiRoutes from "./config/apiRoutes";

export async function sendRieltorRequest(formData) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}${apiRoutes.CALL_RIELTOR}`,
      formData
    );
    return response.data.body;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
