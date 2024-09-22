const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("livraria_web", "root", "22032019", {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate()
console.log("criou o banco")

module.exports = sequelize