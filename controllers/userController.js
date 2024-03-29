  let db = require('../database/models')
const bcryptjs = require('bcryptjs');
const { validationResult } = require("express-validator");

let userController = {
    register:  (req, res) => { 
        res.render('register')
        
    },

    processRegister: async function (req, res) {
        const validate = validationResult(req)
       


        //Redrirecciona solo cuando no esta esto.Pero estando tampoco guarda en al DB. Pero sin esto no podemos validar la imagen.

        if (validate.errors.length > 0) {
           /*  console.log(validate.mapped()); */
            return res.render('register.ejs', {
                errors: validate.mapped(),
                oldData: req.body
            });
        }


        let validateEmail = await db.Users.findOne({
            where: {
                email: req.body.email
            }
        })

        if (validateEmail) {
            let errors = {
                email: {
                    msg: 'Este email ya esta en uso, intenta con otro'
                }
            }
            console.log(`halo`);
            return res.render('register.ejs', { errors: errors })
        }
        //no se guarda la img en DB (en product si)
        let avatarImg = "default.png"
        let imageFromBody = req.file
        if (imageFromBody) {
            avatarImg = req.file.filename
            console.log("mama")
        } 
        await db.Users.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: bcryptjs.hashSync(req.body.password, 10),
            image: avatarImg,
            rol_id: 1 
        })


        .then(user=> res.redirect("/user/login"))
        .catch(err=>console.log(err))

    },


    /* db.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: bcryptjs.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
        rol_id: 1 
    },{
    where: {
        id: req.params.id
    }}).then(() => res.redirect('/')) */

    /* res.redirect('/') */



    login: (req, res) => {
        res.render('login.ejs')
    },
    loginProcess: async function (req, res) {
        let userLogin = await db.Users.findOne({
            where: {
                email: req.body.email
            },
        });

        if (userLogin) {
            let isOkPassword = bcryptjs.compareSync(req.body.password, userLogin.password);
            if (isOkPassword) {
                delete userLogin.password;
                req.session.userLogged = userLogin;
                req.session.usuarioLogueado = userLogin;
                req.session.adminLogueado = userLogin.rol_id
                if (req.body.remember_user) {
                    res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
                }
                return res.redirect('/user/profile');
            }
            return res.render("login", {
                errors: {
                    email: {
                        msg: "Las credenciales son invalidas"
                    }
                }
            });
        }
        return res.render("login", {
            errors: {
                email:
                    { msg: "El email no se encuentra en nuestra base de datos" }
            }
        })
    },
    profile: (req, res) => {
        return res.render('perfil', {
            user: req.session.userLogged
        });
    },

    detail: (req,res) => {
        db.Users.findByPk(req.params.id, {
            include: [{ association: 'rol' }]
        })
            .then(function (user) {
                res.render('detail.ejs', { user: user })
            })
    },
     
    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('userEmail');

        return res.redirect('/user/login');
    } 
}


module.exports = userController