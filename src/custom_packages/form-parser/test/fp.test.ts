import path from "path";
import { FormParser } from "../form-parser";
import express from "express";
import http from "http";

test("Check the correct form", async () => {
  let tValue = null;

  const app = express();
  const server = http.createServer(app);

  app.post("/form", (req, res)=> {
    let body = "";
    req.on("data", (chunk)=> {
      body += chunk;
    });
    req.on("end", ()=> {
      tValue = FormParser(body);

      expect(tValue.value).toBe(1);

      res.end();
    });
  });

  await new Promise ((resolve) => {
    resolve(server.listen(10000));
  });

  const form = new FormData();
  form.append("product_name", "name_example");
  form.append("pec_1", "pec_1_exaple");
  form.append("price", "123523");


  await fetch("http://localhost:10000/form", {
    method: "POST",
    body: form,
  });

  server.close();
  
});
