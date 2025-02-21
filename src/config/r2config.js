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
exports.uploadToR2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT;
if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error("Missing Cloudflare R2 credentials in environment variables.");
}
const s3Client = new client_s3_1.S3Client({
    region: "auto",
    endpoint,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
const uploadToR2 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `products/${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "private", // ✅ Explicitly typed
    };
    yield s3Client.send(new client_s3_1.PutObjectCommand(params));
    return `${process.env.R2_PUBLIC_ENDPOINT}/${fileName}`;
    // return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`;
});
exports.uploadToR2 = uploadToR2;
