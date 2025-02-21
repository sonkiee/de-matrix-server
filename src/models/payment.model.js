"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    reference: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.models.Payment ||
    mongoose_1.default.model("Payment", PaymentSchema);
