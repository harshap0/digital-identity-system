const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/analyze", async (req, res) => {
  try {
    const documents = await prisma.document.findMany();

    const strengths = [...new Set(documents.map(doc => doc.skill))];

    const allSkills = [
      "Python",
      "React",
      "Node.js",
      "Docker",
      "AWS",
      "Java",
      "Machine Learning"
    ];

    const missingSkills = allSkills.filter(
      skill => !strengths.includes(skill)
    );

    let score = Math.min(strengths.length * 20 + 20, 100);

    let level = "Beginner";

    if (score >= 80) level = "Excellent";
    else if (score >= 60) level = "Good";
    else if (score >= 40) level = "Average";

    const recommendedRoles = [];

    if (strengths.includes("Python"))
      recommendedRoles.push("Python Developer");

    if (strengths.includes("React"))
      recommendedRoles.push("Frontend Developer");

    if (strengths.includes("Node.js"))
      recommendedRoles.push("Backend Developer");

    if (strengths.includes("Machine Learning"))
      recommendedRoles.push("AI/ML Engineer");

    res.json({
      score,
      level,
      strengths,
      missingSkills,
      recommendedRoles
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI Analysis Failed"
    });
  }
});

module.exports = router;