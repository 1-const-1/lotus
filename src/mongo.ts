import {MongoClient} from "mongodb";

const mongoURI = "mongodb+srv://test_user:test_pass@cluster0.lpeuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const mongoClient = new MongoClient(mongoURI);