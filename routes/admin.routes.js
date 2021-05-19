const { Router } = require('express')
const router = new Router()

const Product = require('../models/Product.model')
const mongoose = require('mongoose');

//ruta
router.get('/products-list', (req, res, next) => {
  
  const user = req.session.currentUser
  if (!user){
    res.render('index')
    return
  }
  const role = req.session.currentUser.role
  if (role!='admin'){
    res.render('index')
    return
  }
  Product.find().then(products => {
    res.render('admin/products-list', {
      products: products
    })
  }).catch((error) => next(error))

});


// Create product
router.get('/product/create', (req, res, next) => {
  const user = req.session.currentUser
  if (!user){
    res.render('index')
    return
  }
  const role = req.session.currentUser.role
  if (role!='admin'){
    res.render('index')
    return
  }
    res.render('admin/addProduct')
})

router.post('/product/create', (req, res, next) => {
  const {
    name,
    description,
    image,
    price,
    category
  } = req.body;


  Product.create({
      name,
      description,
      image,
      price,
      category
    })
    .then(() => res.redirect("/products-list"))
    .catch((error) => next(error));
});

//edit product
router.get('/product/:id/edit', (req, res, next) => {
  const user = req.session.currentUser
  if (!user){
    res.render('index')
    return
  }
  const role = req.session.currentUser.role
  if (role!='admin'){
    res.render('index')
    return
  }
  const {
    id
  } = req.params
  
  Product.findById(id)
    .then((editproduct) => {
      console.log(editproduct);
      res.render("admin/update-form", {
        product: editproduct
      });
    }).catch((e) => {
      next(e)
    })
  });
  
  router.post('/product/:id/edit', (req, res, next) => {
    const {
      name,
      description,
      image,
      price,
      category
    } = req.body;
    const {
      id
    } = req.params
  
    Product.findByIdAndUpdate(id, {
        name,
        name,
        description,
        image,
        price,
        category
      })
      .then((updateProduct) => {
        res.redirect('/products-list');
  
      }).catch((e) => {
        next(e);
      })
  
  });

  //delete
  router.get('/product/:id/delete', (req, res, next) => {
    const user = req.session.currentUser
  if (!user){
    res.render('index')
    return
  }
  const role = req.session.currentUser.role
  if (role!='admin'){
    res.render('index')
    return
  }
    
    const {
      id
    } = req.params
    Product.findByIdAndDelete(id)
      .then(() => {
        res.redirect('/products-list')
      })
      .catch(e => next(e))
});



module.exports = router 

