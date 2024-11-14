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
const form_parser_1 = require("../form-parser");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
test("Check the correct form", () => __awaiter(void 0, void 0, void 0, function* () {
    let tValue = null;
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    app.post("/form", (req, res) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            tValue = (0, form_parser_1.FormParser)(body);
            expect(tValue.value).toBe(1);
            res.end();
        });
    });
    yield new Promise((resolve) => {
        resolve(server.listen(10000));
    });
    const form = new FormData();
    form.append("product_name", "name_example");
    form.append("pec_1", "pec_1_exaple");
    form.append("price", "123523");
    yield fetch("http://localhost:10000/form", {
        method: "POST",
        body: form,
    });
    server.close();
}));
