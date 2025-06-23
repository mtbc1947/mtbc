import express from "express";
import {
    getReferences,
    deleteReference,
} from "../controllers/reference.controller.js";
import {
    getReference,
    getPageReferences,
    createReference,
} from "../controllers/reference.controller.js";

const router = express.Router();

console.log("reference Route");

router.get("/", getReferences);
router.get("/webPage/:webPage", getPageReferences);
router.get("/refKey/:refKey/", getReference);

router.post("/", createReference);
router.delete("/:id", deleteReference);

export default router;
