import { expect } from 'chai';
import mongoose from 'mongoose';
import config from '../../config/config.js';
import CartService from '../../services/cartService.js';
import ProductService from '../../services/productService.js';

describe('Pruebas unitarias del módulo de carritos', () => {
    let testProduct;
    const productMock = {
        title: "Gabinete Corsair",
        description: "Gabinete gamer para PC de escritorio nuevo",
        price: 125,
        thumbnail: "No disponible",
        code: "PC127gfGTJYgdGGg",
        stock: 25,
        category: "PC",
    };
    let cartId;
    before(async () => {
        await mongoose.connect(process.env.MONGO_URL);
        testProduct = await ProductService.addProduct(productMock);
    });
    after(async () => {
        await ProductService.deleteProduct(testProduct._id);
    });
    it('Prueba de CartService.addCart', async () => {
        const cart = await CartService.addCart();
        expect(cart).to.have.property('_id');
        cartId = cart._id;
    });
    it('Prueba de CartService.getCart', async () => {
        const cart = await CartService.getCartById(cartId);
        expect(cart).to.be.a('object').and.have.property('_id');
        const invalidCart = await CartService.getCartById('InvalidId');
        expect(invalidCart).to.not.have.property('_id');
    });
    it('Prueba de CartService.addProduct', async () => {
        const cart = await CartService.addProductToCart(cartId, testProduct._id);
        console.log(cart)
        expect(cart.products).to.be.a('array').and.not.have.length(0);
        expect(cart).to.have.property('_id');
        expect(cart._id.toString()).to.be.equal(cartId.toString());
        expect(cart).to.have.property('products').that.is.an('array').that.is.not.empty;
        const addedProduct = cart.products[0];
        expect(addedProduct).to.have.property('_id');
        expect(addedProduct.productID.toString()).to.be.equal(testProduct._id.toString());
    });
    it('Prueba de CartService.deleteProducts', async () => {
        await CartService.deleteProdInCart(cartId, testProduct._id);
        const cart = await CartService.getCartById(cartId);
        expect(cart.products).to.be.a('array').and.have.length(0);
    });
});