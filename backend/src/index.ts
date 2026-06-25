import app from "./routes";

import { config } from "dotenv";

config();

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server started on : ${process.env.BACKEND_URL}`);
});
