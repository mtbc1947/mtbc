import express from "express";
import {
    getAllCommittees,
    getCommittee,
    updateCommittee,
    createCommittee,
    deleteCommittee,
} from "../controllers/committee.controller.js";

const router = express.Router();

console.log("Committee Route");

router.get("/", getAllCommittees);
router.get("/:id", getCommittee);
router.put("/:id", updateCommittee);

router.post("/", createCommittee);
router.delete("/:commKey", deleteCommittee);

export default router;
