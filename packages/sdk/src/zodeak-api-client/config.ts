import axios from "axios";
export default axios.create({
  baseURL: "https://zodeaknftbackend.zodeak-dev.com/",
  headers: {
    "Content-type": "application/json"
  }
});