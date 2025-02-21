"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.isValidObjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Utility function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!(0, exports.isValidObjectId)(id)) {
        res.status(400).json({
            message: "Invalid ID format",
            details: "The provided ID must be a valid MongoDB ObjectId",
        });
        return;
    }
    next();
};
exports.validateObjectId = validateObjectId;
