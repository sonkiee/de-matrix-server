"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newOrder = exports.getUserOrderById = exports.getUserOrders = exports.getOrderById = exports.getOrders = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find();
        if (orders.length === 0) {
            res.status(404).json({ message: "No orders found" });
            return;
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield order_model_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({ order });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getOrderById = getOrderById;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find({ user: req.user._id });
        if (!orders) {
            res.status(404).json({ message: "No orders found" });
            return;
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getUserOrders = getUserOrders;
const getUserOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield order_model_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({ order });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getUserOrderById = getUserOrderById;
const newOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, shippingAddress } = req.body;
    const user = req.user._id;
    try {
        if (!products || !shippingAddress) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        if (!Array.isArray(products)) {
            res.status(400).json({ message: "please provide an Array of products" });
            return;
        }
        let totalAmount = 0;
        const orderProducts = [];
        for (const item of products) {
            if (!item.productId) {
                res.status(400).json({
                    message: "Each product must have productId",
                });
                return;
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(item.productId)) {
                res
                    .status(400)
                    .json({ message: `Invalid product ID: ${item.productId}` });
                return;
            }
            const product = yield product_model_1.default.findById(item.productId);
            if (!product) {
                res
                    .status(404)
                    .json({ message: `Product with ID ${item.productId} not found` });
                return;
            }
            if (product.stock < item.quantity) {
                res
                    .status(400)
                    .json({ message: `Product ${product.name} is out of stock` });
                return;
            }
            totalAmount += product.price * item.quantity;
            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        }
        const order = yield order_model_1.default.create({
            user,
            products: orderProducts,
            totalAmount,
            shippingAddress,
            reference: (0, uuid_1.v4)(),
            status: "pending",
            paymentStatus: "pending",
        });
        const createdOrder = yield order.save();
        res.status(201).json({ createdOrder });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.newOrder = newOrder;
