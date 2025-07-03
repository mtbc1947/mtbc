import express from "express";
import { getEvents } from "../controllers/event.controller.js";

const router = express.Router();

console.log("event Route");

router.get("/", getEvents);

export default router;
