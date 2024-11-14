"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoClient = void 0;
const mongodb_1 = require("mongodb");
const mongoURI = "mongodb+srv://test_user:test_pass@cluster0.lpeuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
exports.mongoClient = new mongodb_1.MongoClient(mongoURI);
