import { useState, useEffect } from "react";
import api from "./services/api";
import Navbar from "./Navbar";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [analysis, setAnalysis] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  
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
      <Navbar />
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
          <div className="card stat-card certificates">
  <div className="stat-icon">📜</div>

  <h3>Certificates</h3>

  <h1>{certificateCount}</h1>

  <p className="stat-subtitle">
    Verified Achievements
  </p>
</div>

          <div className="card stat-card projects">
  <div className="stat-icon">💻</div>

  <h3>Projects</h3>

  <h1>{projectCount}</h1>

  <p className="stat-subtitle">
    Portfolio Projects
  </p>
</div>

          <div className="card stat-card skills">
  <div className="stat-icon">🧠</div>

  <h3>Skills</h3>

  <h1>{skillCount}</h1>

  <p className="stat-subtitle">
    Technical Expertise
  </p>
</div>

          <div className="card stat-card internships">
  <div className="stat-icon">💼</div>

  <h3>Internships</h3>

  <h1>{internshipCount}</h1>

  <p className="stat-subtitle">
    Industry Experience
  </p>
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

  <div className="documents-header">
    <div>
      <h2>📄 My Documents</h2>
      <p>Manage all your certificates, projects and resumes</p>
    </div>

    <span className="document-count">
      {documents.length} Files
    </span>
  </div>
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
      <div className="document-title">
  <span className="document-icon">
    {doc.documentType === "Certificate" && "📜"}
    {doc.documentType === "Project" && "💻"}
    {doc.documentType === "Internship" && "💼"}
    {doc.documentType === "Resume" && "📄"}
  </span>

  <a
    href={`http://localhost:3001/uploads/${doc.fileName}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {doc.fileName}
  </a>
</div>

      <p>📂 {doc.documentType}</p>
      <p>🧠 {doc.skill}</p>
      <p>📅 {new Date(doc.createdAt).toLocaleDateString()}</p>
      <p>✅ {doc.status}</p>
    </div>

    <div className="document-actions">
      <button
        className="preview-btn"
        onClick={() => setPreviewDoc(doc)}
      >
        👁 Preview
      </button>

      <button
        type="button"
        className="edit-btn"
        onClick={() => {
          console.log("Clicked:", doc);
          setEditingDoc(doc);
        }}
      >
        ✏️ Edit
      </button>

      <button
        className="delete-btn"
        onClick={async () => {
          await api.delete(`/api/documents/${doc.id}`);
          fetchDocuments();
        }}
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
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
}}
  >
    <div
  style={{
    width: "500px",
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  }}
>
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  }}
>
  <h3>✏️ Editing Document</h3>

  <button
    onClick={() => setEditingDoc(null)}
    style={{
      border: "none",
      background: "transparent",
      fontSize: "22px",
      cursor: "pointer",
    }}
  >
    ✖
  </button>
</div>

          <p>
            <strong>{editingDoc.fileName}</strong>
          </p>

          <label style={{ display: "block", marginBottom: "8px" }}>
  Document Type
</label>

<select
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
  }}
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

<label
  style={{
    display: "block",
    marginBottom: "8px",
  }}
>
  Skill
</label>

<input
  type="text"
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    boxSizing: "border-box",
  }}
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
  style={{
    width: "100%",
    marginTop: "20px",
  }}
  onClick={saveDocument}
>
  💾 Save Changes
</button>
        </div>
        </div>
      )}

      {previewDoc && (
        <div
  style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  }}
>
  <div
    style={{
      width: "80%",
      height: "85%",
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    }}
  >
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  }}
>
  <h3>{previewDoc.fileName}</h3>

  <button
    onClick={() => setPreviewDoc(null)}
    style={{
      fontSize: "20px",
      border: "none",
      background: "transparent",
      cursor: "pointer",
    }}
  >
    ✖
  </button>
</div>

          <iframe
            src={`http://localhost:3001/uploads/${previewDoc.fileName}`}
            width="100%"
            height="85%"
            title="Preview"
          />

        </div>
        </div>
      )}
    </div>
  );
}

export default App;