"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BannerSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["small", "big"],
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    title: String,
    description: String,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.models.Banner || mongoose_1.default.model("Banner", BannerSchema);
