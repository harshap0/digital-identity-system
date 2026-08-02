const prisma = require("../config/prisma");

exports.uploadDocument = async (req, res) => {
  try {
    const fileName = req.file.originalname.toLowerCase();

    let documentType = "Other";
    let skill = "Unknown";

    if (fileName.includes("certificate")) {
  documentType = "Certificate";
} else if (fileName.includes("project")) {
  documentType = "Project";
} else if (fileName.includes("internship")) {
  documentType = "Internship";
} else if (fileName.includes("resume") || fileName.includes("cv")) {
  documentType = "Resume";
}

    if (fileName.includes("python")) {
      skill = "Python";
} else if (fileName.includes("react")) {
  skill = "React";
} else if (fileName.includes("java")) {
  skill = "Java";
} else if (fileName.includes("node")) {
  skill = "Node.js";
} else if (fileName.includes("docker")) {
  skill = "Docker";
} else if (fileName.includes("aws")) {
  skill = "AWS";
} else if (
  fileName.includes("machinelearning") ||
  fileName.includes("machine_learning") ||
  fileName.includes("ml")
) {
  skill = "Machine Learning";
}

    const document = await prisma.document.create({
      data: {
        fileName: req.file.originalname,
        documentType,
        skill,
        status: "Verified",

        // Save for the logged-in user
        userId: 0,
      },
    });

    res.status(201).json({
      message: "File uploaded successfully!",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to upload document",
    });
  }
};