const uploadDocument = async (req, res) => {
  console.log("UPLOAD CONTROLLER HIT");

  console.log(req.file);

  return res.json({
    success: true,
    file: req.file,
  });
};

module.exports = { uploadDocument };