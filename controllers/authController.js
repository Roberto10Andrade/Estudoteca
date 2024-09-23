const User = require("../models/User")
const bcrypt = require("bcryptjs")

module.exports = class authController {
    static async login(req, res) {
        res.render("auth/login")
    }
    static async register(req, res) {
        res.render("auth/register")
    }
    static async registerPost(req, res) {
        const {name,email, password, confirmpassword, accountType} = req.body
        let admin = false

        if (accountType ==="on") {
            admin = true
        } else {
            admin = false
        }

        if (password != confirmpassword) {
            req.flash("message", "As senha não são iguais")
            res.render("auth/register")
            return
        }

        const alreadyExist = await User.findOne({where: { email : email }})
        if (alreadyExist) {
            req.flash("message", "Usuário já cadastrado!")
            res.render("auth/register")

            return
        }
        
        const Salt = bcrypt.genSaltSync(10)
        const hash = await bcrypt.hash(password, Salt)



        try {
            const CreatedUser = await User.create({name, email, password:hash, admin})
            req.session.userid = CreatedUser.id
            req.session.admin = admin
            req.flash("message", "Usuário criado com sucesso!")

            req.session.save(() => {
                res.redirect("/books")
            })
        } catch (err) {
            console.log("Ocorreu um erro ao criar o Usuário: ", err)
        }
    }
    static async loginPost(req, res) {
        const {email, password} = req.body

        const user = await User.findOne({where: {email:email}})

        if (!user) {
            req.flash("message", "O usuário não existe")
            res.render("auth/login")

            return
        }

        const matchPassword = bcrypt.compareSync(password, user.password)
        if (!matchPassword){
            req.flash("message", "Senha incorreta!")
            res.render("auth/login")
            return
        }

        try {
            req.session.userid = user.id
            req.session.admin = user.admin
            req.flash("message", "Usuário conectado com sucesso!")

            req.session.save(() => {
                res.redirect("/books")
            })
        } catch(err) {
            console.log("Erro ao logar o usuário: ", err)
        }
    }
    static async logout(req, res) {
        req.session.destroy()
        res.redirect("/books")
    }
}
