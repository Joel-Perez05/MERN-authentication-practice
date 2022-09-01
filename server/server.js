require("./config/mongoose.config");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));

require("./routes/user.routes")(app);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));