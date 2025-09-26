import express from "express";
import {
    getEvents,
    createEvent,
    updateEvent,
    importEvents,
} from "../controllers/event.controller.js";

import multer from "multer";

const router = express.Router();

console.log("Event Route");

const upload = multer({ dest: "tmp/" });

router.get("/", getEvents);
router.post("/", createEvent);
router.put("/:id", updateEvent);
//router.post("/import", importEvents);
router.post("/import", upload.single("file"), importEvents);

export default router;
