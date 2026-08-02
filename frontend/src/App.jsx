import { useState, useEffect } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [analysis, setAnalysis] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  useEffect(() => {
  console.log("App Mounted");
  fetchDocuments();
}, []);

  const fetchDocuments = async () => {
  try {
    const response = await api.get("/api/documents");
    setDocuments(response.data.documents || []);

    const aiResponse = await api.get("/api/ai/analyze");
    setAnalysis(aiResponse.data);
    console.log(aiResponse.data);

  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

  const uploadFile = async (file) => {
    
  const formData = new FormData();
  formData.append("document", file);

  console.log("Uploading to:", "http://localhost:3001/upload");
  console.log("File:", file.name);
  
  try {
    const response = await api.post("/upload", formData);

    console.log("Upload Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};
const saveDocument = async () => {
  if (!editingDoc) return;

  try {
    await api.put(`/api/documents/${editingDoc.id}`, {
      documentType: editingDoc.documentType,
      skill: editingDoc.skill,
    });

    await fetchDocuments();

    setEditingDoc(null);

    alert("✅ Document updated successfully!");
  } catch (error) {
    console.error(error);
    alert("❌ Failed to update document");
  }
};

  const filteredDocuments = documents.filter((doc) => {
  const matchesSearch =
    doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(search.toLowerCase()) ||
    doc.skill.toLowerCase().includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" || doc.documentType === filter;

  return matchesSearch && matchesFilter;
});

  const certificateCount = documents.filter(
  (doc) => doc.documentType === "Certificate"
).length;

const skillCount = new Set(documents.map((doc) => doc.skill)).size;

const projectCount = documents.filter(
  (doc) => doc.documentType === "Project"
).length;

const internshipCount = documents.filter(
  (doc) => doc.documentType === "Internship"
).length;
  // 🤖 AI Identity Score
  const aiScore = Math.min(
    certificateCount * 20 +
      skillCount * 15 +
      projectCount * 20 +
      internshipCount * 25,
    100
  );

  let aiLevel = "Beginner";

  if (aiScore >= 80) {
    aiLevel = "Excellent";
  } else if (aiScore >= 60) {
    aiLevel = "Good";
  } else if (aiScore >= 40) {
    aiLevel = "Average";
  }
  console.log("editingDoc =", editingDoc);

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

              await uploadFile(file);
              await fetchDocuments();
            }}
          />
        </label>
      </header>

      <section className="snapshot">
        <h2>📊 AI Journey Dashboard</h2>

        <div className="stats-grid">
          <div className="card">
            <h3>📜 Certificates</h3>
            <h1>{certificateCount}</h1>
          </div>

          <div className="card">
            <h3>💻 Projects</h3>
            <h1>{projectCount}</h1>
          </div>

          <div className="card">
            <h3>🧠 Skills</h3>
            <h1>{skillCount}</h1>
          </div>

          <div className="card">
            <h3>💼 Internships</h3>
            <h1>{internshipCount}</h1>
          </div>

          <div className="card">
  <h3>🤖 AI Identity Score</h3>

  <h1>{analysis ? analysis.score : aiScore}/100</h1>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{
        width: `${analysis ? analysis.score : aiScore}%`,
      }}
    ></div>
  </div>

  <p>{analysis ? analysis.level : aiLevel} ⭐</p>

  {analysis && (
    <>
      <hr />

      <h4>💪 Strengths</h4>

      <ul>
        {analysis.strengths.map((item, index) => (
          <li key={index}>✅ {item}</li>
        ))}
      </ul>

      <h4>📚 Missing Skills</h4>

      <ul>
        {analysis.missingSkills.map((item, index) => (
          <li key={index}>❌ {item}</li>
        ))}
      </ul>

      <h4>💼 Recommended Roles</h4>

      <ul>
        {analysis.recommendedRoles.map((item, index) => (
          <li key={index}>🚀 {item}</li>
        ))}
      </ul>
    </>
  )}

</div>
        </div>

        <div className="card">
          <h3>📄 My Documents</h3>

<div className="filter-buttons">
  <button onClick={() => setFilter("All")}>All</button>
  <button onClick={() => setFilter("Certificate")}>Certificates</button>
  <button onClick={() => setFilter("Project")}>Projects</button>
  <button onClick={() => setFilter("Internship")}>Internships</button>
  <button onClick={() => setFilter("Resume")}>Resumes</button>
</div>

<input
  type="text"
  placeholder="🔍 Search documents..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

          {documents.length === 0 && (
            <p>No documents uploaded yet.</p>
          )}

          {documents.length > 0 && filteredDocuments.length === 0 && (
            <p>❌ No documents found.</p>
          )}

          {filteredDocuments.map((doc) => (
  <div key={doc.id} className="document-card">
    <div>
      <p>
        <a
          href={`http://localhost:3001/uploads/${doc.fileName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 {doc.fileName}
        </a>
      </p>

      <p>📂 {doc.documentType}</p>
      <p>🧠 {doc.skill}</p>
      <p>📅 {new Date(doc.createdAt).toLocaleDateString()}</p>
      <p>✅ {doc.status}</p>
    </div>

    <div className="document-actions">
  <button
  type="button"
  className="edit-btn"
  onClick={() => {
    console.log("Before:", editingDoc);
    console.log("Clicked:", doc);
    setEditingDoc(doc);
  }}
>
  ✏️ Edit
</button>

  <button
    onClick={async () => {
      await api.delete(`/api/documents/${doc.id}`);
      fetchDocuments();
    }}
    className="delete-btn"
  >
    🗑 Delete
  </button>
</div>
  </div>
))}
        </div>

        <div className="bottom-grid">
          <div className="card">
            <h3>🧠 AI Relationships</h3>

            {documents.map((doc) => (
              <div key={doc.id} className="relationship-card">
                <p>📄 {doc.fileName}</p>
                <p>⬇️</p>
                <p>🧠 {doc.skill}</p>
                <p>⬇️</p>
                <p>💻 {doc.skill} Project</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>📅 Digital Journey Timeline</h3>

            {documents.map((doc) => (
              <div key={doc.id} className="timeline-item">
                <p>2026</p>
                <p>│</p>
                <p>└── 📜 {doc.fileName}</p>
              </div>
            ))}
          </div>
                </div>
      </section>

      {editingDoc && (
  <div
    style={{
      position: "fixed",
      top: "50px",
      left: "50px",
      background: "white",
      border: "4px solid red",
      padding: "20px",
      zIndex: 99999,
    }}
  >
          <h3>✏️ Editing Document</h3>

          <p>
            <strong>{editingDoc.fileName}</strong>
          </p>

          <label>Document Type</label>

<select
  value={editingDoc.documentType}
  onChange={(e) =>
    setEditingDoc({
      ...editingDoc,
      documentType: e.target.value,
    })
  }
>
  <option>Certificate</option>
  <option>Project</option>
  <option>Internship</option>
  <option>Resume</option>
</select>

<br />
<br />

<label>Skill</label>

<input
  type="text"
  value={editingDoc.skill}
  onChange={(e) =>
    setEditingDoc({
      ...editingDoc,
      skill: e.target.value,
    })
  }
/>
<br />
<br />

<button
  className="upload-btn"
  onClick={saveDocument}
>
  💾 Save Changes
</button>
        </div>
      )}

    </div>
  );
}

export default App;