const app = require("./src/app.js");
const {connectToDB} = require("./src/configs/database.js");
connectToDB();

app.listen(process.env.PORT, () => {
    console.log(`Server on ${process.env.PORT}`);
});