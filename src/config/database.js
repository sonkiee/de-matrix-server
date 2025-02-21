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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (attempts = 5, delay = 3000) {
    for (let i = 0; i < attempts; i++) {
        try {
            const conn = yield mongoose_1.default.connect(process.env.MONGO_URI, {});
            console.log(`✅ MongoDB Connected: ${conn.connection.host}in ${process.env.NODE_ENV} mode`);
            return;
        }
        catch (error) {
            console.error(`❌ Database connection failed (Attempt ${i + 1}/${attempts})`);
            if (i < attempts - 1) {
                console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
                yield new Promise((res) => setTimeout(res, delay));
                delay *= 2; // Exponential backoff
            }
            else {
                console.error("🚨 Could not connect to MongoDB. Exiting...");
                process.exit(1);
            }
        }
    }
});
exports.default = connectDB;
