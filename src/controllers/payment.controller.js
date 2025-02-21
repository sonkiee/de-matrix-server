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
exports.paymentWebhook = exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const order_model_1 = __importDefault(require("../models/order.model"));
const payment_model_1 = __importDefault(require("../models/payment.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const initializePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { orderId } = req.body;
    if (!orderId) {
        res.status(400).json({
            message: "Missing OrderId",
        });
        return;
    }
    const orderIdStr = String(orderId);
    if (!mongoose_1.default.Types.ObjectId.isValid(orderIdStr)) {
        res.status(400).json({ message: "Invalid category ID" });
        return;
    }
    try {
        // Ensure all required fields are provided
        const order = yield order_model_1.default.findById(orderId);
        if (!order) {
            res.status(400).json({ message: "Order not found" });
            return;
        }
        // if (!order.reference) {
        //   order.reference = new mongoose.Types.ObjectId().toString();
        //   await order.save();
        // }
        // Make the API request to Paystack
        const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
            amount: order.totalAmount * 100,
            currency: "NGN", // Currency code
            email: user.email, // Assuming user has an email
            reference: order.reference,
            metadata: {
                orderId: order._id,
            },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        yield payment_model_1.default.create({
            user: user._id,
            order: order._id,
            reference: response.data.data.reference,
            amount: order.totalAmount,
            status: "pending",
        });
        for (const item of order.products) {
            const product = yield product_model_1.default.findById(item.product);
            if (!product) {
                res.status(400).json({ message: `Product ${item.product} not found` });
                return;
            }
            product.stock -= item.quantity;
            yield product.save();
        }
        order.reference = response.data.data.reference;
        yield order.save();
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        console.error("Paystack Initialization Error:", error);
        res
            .status(500)
            .json({ message: "An error occurred while initializing payment", error });
        return;
    }
});
exports.initializePayment = initializePayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference, trxref } = req.query;
    // Ensure all required fields are provided
    if (!reference) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        // Make the API request to Paystack
        const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        if (response.data.data.status === "success") {
            const { reference } = response.data.data;
            const order = yield order_model_1.default.findOne({
                reference: reference,
            });
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
            order.paymentStatus = "paid";
            order.status = "processing";
            yield order.save();
            const payment = yield payment_model_1.default.findOne({ reference });
            if (!payment) {
                // If no existing payment record, create one
                yield payment_model_1.default.create({
                    user: order.user,
                    order: order._id,
                    reference,
                    status: "paid",
                    amount: order.totalAmount / 100, // Convert kobo to Naira if needed
                });
            }
            else {
                // Update existing payment record
                payment.status = "paid";
                yield payment.save();
            }
            res.status(200).json({ message: "Payment successful", order });
        }
        else {
            res.status(400).json({ message: "Payment failed" });
        }
        // Handle Paystack's successful response
        // console.log(response);
        // res.status(200).json({ data: response.data });
    }
    catch (error) {
        console.error("Paystack Verification Error:", error);
        res
            .status(500)
            .json({ message: "An error occurred while verifying payment" });
        return;
    }
});
exports.verifyPayment = verifyPayment;
const paymentWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body;
    if (!event) {
        res.status(400).json({
            message: "Invalid webhook payload",
        });
        return;
    }
    try {
        if (event.event === "charge.success") {
            const { reference, amount } = event.data;
            const order = yield order_model_1.default.findOne({ reference });
            if (!order) {
                console.error(`Order not found for reference ${reference}`);
                res.status(404).json({
                    message: "Order not found",
                });
                return;
            }
            order.paymentStatus = "paid";
            order.status = "processing";
            yield order.save();
            const payment = yield payment_model_1.default.findOne({ reference });
            if (!payment) {
                yield payment_model_1.default.create({
                    user: order.user,
                    order: order._id,
                    reference,
                    status: "paid",
                    amount: order.totalAmount / 100,
                });
            }
            else {
                payment.status = "paid";
                yield payment.save();
            }
            console.log(`Payment verifeif for order ${order._id}`);
            res.status(200).json({
                message: "Payment processed successfully",
            });
        }
        else {
            res.status(400).json({
                message: "Event not handled",
            });
        }
    }
    catch (error) {
        console.error("Webhook Handling Error", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.paymentWebhook = paymentWebhook;
