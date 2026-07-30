exports.uploadDocument = (req, res) => {
  const fileName = req.file.originalname.toLowerCase();
  let documentType = "Other";
  let skill = "Unknown";

  if (fileName.includes("certificate")) {
    documentType = "Certificate";
  }

  if (fileName.includes("python")) {
    skill = "Python";
  } else if (fileName.includes("react")) {
    skill = "React";
  }

  res.json({
    message: "File uploaded successfully!",
    fileName: req.file.originalname,
    documentType,
    skill,
    status: "Verified",
  });
};