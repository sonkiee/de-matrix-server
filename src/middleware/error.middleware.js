"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }
};
exports.errorHandler = errorHandler;
