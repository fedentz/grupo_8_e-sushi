let db = require('../database/models')

let productController = {
    
    product: (req, res) => {
        
        db.Product.findAll()
        .then(function(product){
            return res.render('productList.ejs', {product:product})
        }) 
        
    },

    crear: function(req, res){
        
        db.Category.findAll()
        .then(category => {
            return res.render('create.ejs',{category})
            
        })
    
    },
    guardado: function(req, res){
        console.log(req.body)
        let productImg
        let imageFromBody = req.file
        if(imageFromBody){
            productImg = "img-product/" + req.file.originalname
        } else {
            productImg = "img-product/default.png"
        }    

        db.Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: productImg,
            category_id:req.body.category_id , 
        }).then(() =>  res.render('create.ejs') ) 
       
    },

    listado: function(req,res){
     db.Product.findAll()
     .then(function(product){
        res.render('productList.ejs', {product:product})
     })   
    },

    detalle: function(req,res){


        db.Product.findByPk(req.params.id, {
            include: [{association: 'category'}]
        })
        .then(function(product){
            res.render('product.ejs', {product: product})
        })

    },

    editar: function(req,res){
        db.Product.findByPk(req.params.id, {
            include: [{association: 'category'}]
        })
        .then(function(product){
            res.render('edit.ejs', {product: product})
        })
    },

    actualizar: function(req,res){
        db.Product.update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            stock: req.body.stock,
            category_id:req.body.category_id
        }, {
            where: {
                id: req.params.id
            }
        })

        res.redirect('/products/' + req.params.id)
    },

    borrar: function(req,res){
        db.Product.destroy({
            where: {
                id: req.params.id
            }
        })

        res.redirect('/products')
    }
}

module.exports = productController