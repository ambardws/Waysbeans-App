const express = require('express');

const router = express.Router();

const { register, login, checkAuth } = require('../controllers/auth');
const { getProduct, addProduct, getDetailProduct, updateProduct, deleteProduct, getProductByName } = require('../controllers/product');
const { getTransactions, addTransaction, getMyTransactions, editTransaction } = require('../controllers/transaction');
// Controller
const {getUser} = require('../controllers/user');

// Middleware
const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', auth, checkAuth);

router.get('/products', getProduct);
router.get('/product/:id', getDetailProduct);
router.get('/product/name/:name', getProductByName);
router.post('/product', auth, uploadFile('photo'), addProduct);
router.patch('/product/:id',auth, uploadFile('photo'), updateProduct);
router.delete('/product/:id', auth, deleteProduct);

router.get('/transactions', auth, getTransactions);
router.post('/transaction', auth, uploadFile('attachment'), addTransaction);
router.get('/my-transactions', auth, getMyTransactions);
router.patch('/transaction/:id', auth, editTransaction);

router.get('/user',auth, getUser);

module.exports = router;
