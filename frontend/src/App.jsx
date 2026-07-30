import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [documentType, setDocumentType] = useState("");
  const [skill, setSkill] = useState("");
  const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("document", file);

  try {
    const response = await axios.post(
      "http://localhost:3001/upload",
      formData
    );

  setDocumentType(response.data.documentType);
  setSkill(response.data.skill);
  } catch (error) {
  console.log(error);
}
};
  return (
    <div className="app">
      <header className="hero">
        <h1>IdentityHub</h1>
        <p>Your AI-powered Digital Identity System</p>

        <label className="upload-btn">
  + Upload Document

  <input
  type="file"
  hidden
  onChange={(event) => {
  const file = event.target.files[0];
  const fileName = file.name;

  setDocuments((prevDocuments) => [
  ...prevDocuments,
  {
    fileName: file.name,
    documentType: "",
    skill: "",
  },
]);

  uploadFile(file);   // <-- THIS IS THE IMPORTANT LINE

  }}
/>
</label>
      </header>
    <section className="snapshot">
  <h2>Journey Snapshot</h2>

  <div className="card">
  <h3>📜 Certificates</h3>

  <p>{documents.length}</p>

  {documents.map((doc, index) => (
  <div key={index}>
    <p>📄 {doc.fileName}</p>
    <p>🟢 Uploaded Successfully</p>
  </div>
))}

<p>📂 Document Type: {documentType}</p>

</div>

  <div className="card">
    <h3>💻 Projects</h3>
    <p>0</p>
  </div>

  <div className="card">
  <h3>🧠 Skills</h3>
  <p>{documents.length}</p>

  {skill && <p>Latest Skill: {skill}</p>}
</div>

  <div className="card">
    <h3>💼 Internships</h3>
    <p>0</p>
  </div>
</section>
    </div>
  );
}

export default App;