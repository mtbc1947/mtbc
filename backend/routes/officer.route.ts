import express from "express";
import {
    getAllOfficers,
    getOfficer,
    updateOfficer,
    createOfficer,
    deleteOfficer,
    getOfficersForCommittee,
} from "../controllers/officer.controller.js";

const router = express.Router();

console.log("Officer Route");

router.get("/", getAllOfficers);
router.get("/:id", getOfficer);
router.get("/commKey/:commKey", getOfficersForCommittee);
router.put("/:id", updateOfficer);

router.post("/", createOfficer);
router.delete("/:id", deleteOfficer);

export default router;
