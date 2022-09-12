const { body } = require('express-validator')
const path = require('path');

const validations = [
body('first_name').notEmpty().withMessage('Tienes que escribir un nombre'),
body('last_name').notEmpty().withMessage('Tienes que escribir un apellido'),
body('phone_number').notEmpty().withMessage('Tienes que escribir un numero de telefono'),
body('email').notEmpty().withMessage('Tienes que escribir un email').bail().isEmail().withMessage('Debes escribir un email valido'),
body('password').notEmpty().withMessage('Tienes que escribir una password'),
body('country').notEmpty().withMessage('Tienes que elegir un pais'),
body('avatar').custom((value,{ req }) => {
    let file = req.file;
    let acceptedExtension = ['.jpg','.jpeg','.png','.gif'];
    if(!file){
        throw new Error('Tienes que subir una imagen')
    }else {
        let fileExtension = path.extname(file.originalname)
        if (!acceptedExtension.includes(fileExtension)){
            throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtension.join(', ')}`)
           }
    }
return true;
})]

module.exports = validations