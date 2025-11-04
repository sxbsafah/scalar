import express from "express";
import { config } from "@/config/config";
import cors from "cors";




const app = express();
const PORT = config.PORT || 3000;


app.use(cors({
  origin: function (origin, callback) {
    if (config.NODE_ENV === "development" || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}))


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
