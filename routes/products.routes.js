const { Router } = require('express')
const router = new Router()

const Product = require('../models/Product.model')
const mongoose = require('mongoose');
const User = require('../models/User.model');

//ruta
router.get('/products/telescopio', (req, res, next) => {
  Product.find({category:"telescopio"}).then(products => {
    res.render('products/products-list', {
      products: products
    })
  }).catch((error) => next(error))
})





router.post('/products/addToCart/:id', (req, res, next) => {
  const {id} = req.params
  const user = req.session.currentUser
  if (!user){
    res.render('/login')
    return
  }
  console.log (user._id, req.user, user)
  User.findByIdAndUpdate(user._id, { $push: {cart: id}})
  .then(()=>{
    res.redirect(`/products/${id}`)
  }
  )
  .catch((error) => next(error))
})

//Routes Cart

router.get('/products/cart', (req, res,)=>{
  const user = req.session.currentUser

  User.findById(user._id)
  .populate('cart')
  .then((foundedUser)=>{
    let total=0
    for(let i =0; i<foundedUser.cart.length;i++){
      total+=foundedUser.cart[i].price
    }
    res.render('products/products-cart', {products:foundedUser.cart, total})
  })
})


router.get('/products/:id', (req, res, next) => {

  const {
    id
  } = req.params

  Product.findById(id)
    .then(product => {
      res.render('products/product-details', {product});
    }).catch((e) => {
      next(e);
    })
});


module.exports = router 