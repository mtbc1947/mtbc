import express from "express";
import {
    getAllMembers,
    getMember,
    updateMember,
    createMember,
    deleteMember,
} from "../controllers/member.controller.js";

const router = express.Router();

console.log("member Route");

router.get("/", getAllMembers);
router.get("/:id", getMember);
router.put("/:id", updateMember);

router.post("/", createMember);
router.delete("/:id", deleteMember);

export default router;
