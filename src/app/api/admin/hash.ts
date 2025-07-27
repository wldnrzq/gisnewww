const bcrypt = require("bcryptjs");
const plainPassword = "adminsatu";
const hashedPassword = bcrypt.hashSync(plainPassword, 10);
console.log(hashedPassword);