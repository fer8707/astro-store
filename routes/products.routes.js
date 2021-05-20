const stripe = require('stripe')('sk_test_51HOEcuG8Ry359GF5lcpD5APEa7R1wvrK0uxyfVVLZkdfutNKuu89DSm75BqXiTdxTIzTBmBQIpXrupAERhSouXnR00c6TEI3AG');
const { Router } = require('express')
const router = new Router()

const Product = require('../models/Product.model')
const mongoose = require('mongoose');
const User = require('../models/User.model');
const YOUR_DOMAIN = 'http://localhost:3000'

//ruta
router.get('/products/telescopio', (req, res, next) => {
  Product.find({category:"telescopio"}).then(products => {
    res.render('products/products-list', {
      products: products
    })
  }).catch((error) => next(error))
})
router.get('/products/taza', (req, res, next) => {
  Product.find({category:"taza"}).then(products => {
    res.render('products/products-list', {
      products: products
    })
  }).catch((error) => next(error))
})
router.get('/products/playera', (req, res, next) => {
  Product.find({category:"playera"}).then(products => {
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
  User.findByIdAndUpdate(user._id, { $push: {cart: id}}, {new: true})
  .then((user)=>{
    req.session.productsNumb = user.cart.length
    res.redirect(`/products/${id}`)
  }
  )
  .catch((error) => next(error))
})

//Routes Cart

router.get('/products/cart', (req, res,)=>{
  const user = req.session.currentUser
  if (!user){
    res.render('/login')
    return
  }

  User.findById(user._id)
  .populate('cart')
  .then((foundedUser)=>{
    let total=0
    for(let i =0; i<foundedUser.cart.length;i++){
      total+=foundedUser.cart[i].price
    }
    req.session.total = total
    res.render('products/products-cart', {products:foundedUser.cart, total})
  })
  
})
router.get('/products/checkout', (req, res, next) => {
  
    res.render('products/checkout')
})
router.get('/products/success', (req, res, next) => {
  const user = req.session.currentUser
  User.findByIdAndUpdate(user._id, {cart:[]}, {new: true})
  .then((user)=>{
    req.session.productsNumb = user.cart.length
    res.redirect('/products/success2')
  })
})
router.get('/products/success2', (req, res, next) => {
  
  res.render('products/success')
})
router.get('/products/cancel', (req, res, next) => {
  
  res.render('products/cancel')
})
router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: 'Total de carrito',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: req.session.total*100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/products/success`,
    cancel_url: `${YOUR_DOMAIN}/products/cancel`,
  });

  res.json({ id: session.id });
});
// dejar lo siguiente hasta abajo
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