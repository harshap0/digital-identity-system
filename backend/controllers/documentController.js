const prisma = require("../config/prisma");

const getDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.document.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType, skill } = req.body;

    const document = await prisma.document.update({
      where: {
        id: Number(id),
      },
      data: {
        documentType,
        skill,
      },
    });

    res.status(200).json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getDocuments,
  deleteDocument,
  updateDocument,
};