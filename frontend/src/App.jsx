import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  
  const [search, setSearch] = useState("");
  
  const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("document", file);

  try {
    const response = await axios.post(
      "http://localhost:3001/upload",
      formData
    );

  return response.data;
  } catch (error) {
  console.log(error);
}
};
const filteredDocuments = documents.filter((doc) =>
  doc.fileName.toLowerCase().includes(search.toLowerCase())
);
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
  onChange={async (event) => {
  const file = event.target.files[0];

  if (!file) return;
  const aiData = await uploadFile(file);

  setDocuments((prevDocuments) => [
  ...prevDocuments,
  {
  fileName: file.name,
  documentType: aiData.documentType,
  skill: aiData.skill,
  status: aiData.status,
},
]);

     // <-- THIS IS THE IMPORTANT LINE

  }}
/>
</label>
      </header>
    <section className="snapshot">
  <h2>Journey Snapshot</h2>

  <div className="card">
  <h3>📜 Certificates</h3>

  <p>{documents.length}</p>

  <input
  type="text"
  placeholder="🔍 Search documents..."
  value={search}
  onChange={(event) => setSearch(event.target.value)}
/>
<p>Search: {search}</p>

{documents.length > 0 && filteredDocuments.length === 0 && (
  <p>❌ No documents found.</p>
)}

{filteredDocuments.map((doc, index) => (
  <div key={index}>
    <p>📄 {doc.fileName}</p>
    <p>📂 {doc.documentType}</p>
    <p>🧠 {doc.skill}</p>
    <p>✅ {doc.status}</p>
    
  </div>
))}



</div>

  <div className="card">
    <h3>💻 Projects</h3>
    <p>0</p>
  </div>

  <div className="card">
  <h3>🧠 Skills</h3>
  <p>{documents.length}</p>

  
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