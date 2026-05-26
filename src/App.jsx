import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [patient, setPatient] = useState({
    name: '',
    age: '',
    sex: '',
    patientId: '',
    studyType: '',
    notes: '',
  });

  const handlePatientChange = (e) => {
    const { name, value } = e.target;

    setPatient({
      ...patient,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    if (selectedFile.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Selecciona una imagen primero');
      return;
    }

    if (!patient.name || !patient.patientId || !patient.studyType) {
      alert('Completa nombre, ID del paciente y tipo de estudio');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://3.144.5.210:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al analizar el archivo');
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Error al subir o analizar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);

    setPatient({
      name: '',
      age: '',
      sex: '',
      patientId: '',
      studyType: '',
      notes: '',
    });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">+</div>
          <span>RADIOSCAN</span>
        </div>

        <div className="doctor-box">
          <div className="doctor-avatar"></div>
          <span>Dr. Usuario</span>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-info">
            <p className="tag">PWA MÉDICA EN LA NUBE</p>
            <h1>Nuevo análisis médico</h1>
            <p>
              Sube una imagen médica, almacénala en Amazon S3 y extrae texto
              automáticamente con AWS Textract.
            </p>
          </div>

          <div className="cloud-badge">
            AWS
            <span>S3 · Textract · Lambda · EC2</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="neo-card upload-card">
            <h2>CARGAR IMAGEN</h2>

            <label className="drop-zone">
              {preview ? (
                <img src={preview} alt="Vista previa" className="preview-img" />
              ) : (
                <>
                  <div className="upload-icon">☁</div>
                  <p>Arrastra o selecciona una imagen médica</p>
                  <span>Formatos recomendados: JPG, PNG</span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <div className="file-info">
                <strong>Archivo:</strong> {file.name}
              </div>
            )}

            <div className="notice">
              Este sistema no realiza diagnósticos médicos. Funciona como apoyo
              para almacenamiento y extracción de texto.
            </div>
          </div>

          <div className="neo-card form-card">
            <h2>DATOS DEL PACIENTE</h2>

            <label>NOMBRE COMPLETO</label>
            <input
              name="name"
              value={patient.name}
              onChange={handlePatientChange}
              placeholder="Ej: María González"
            />

            <div className="form-row">
              <div>
                <label>EDAD</label>
                <input
                  name="age"
                  value={patient.age}
                  onChange={handlePatientChange}
                  placeholder="Ej: 45"
                />
              </div>

              <div>
                <label>SEXO</label>
                <select
                  name="sex"
                  value={patient.sex}
                  onChange={handlePatientChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <label>ID DEL PACIENTE</label>
            <input
              name="patientId"
              value={patient.patientId}
              onChange={handlePatientChange}
              placeholder="Ej: PAC-001"
            />

            <label>TIPO DE ESTUDIO</label>
            <select
              name="studyType"
              value={patient.studyType}
              onChange={handlePatientChange}
            >
              <option value="">Seleccionar tipo de estudio</option>
              <option value="Radiografía de tórax">Radiografía de tórax</option>
              <option value="Radiografía de mano">Radiografía de mano</option>
              <option value="Tomografía">Tomografía</option>
              <option value="Resonancia magnética">Resonancia magnética</option>
              <option value="Documento médico">Documento médico</option>
            </select>

            <label>NOTAS CLÍNICAS</label>
            <textarea
              name="notes"
              value={patient.notes}
              onChange={handlePatientChange}
              placeholder="Ingrese información relevante del caso..."
            />

            <div className="button-row">
              <button className="secondary-btn" onClick={clearForm}>
                LIMPIAR
              </button>

              <button
                className="primary-btn"
                onClick={uploadFile}
                disabled={loading}
              >
                {loading ? 'ANALIZANDO...' : 'ANALIZAR'}
              </button>
            </div>
          </div>
        </section>

        {result && (
          <section className="neo-card result-card">
            <div className="result-header">
              <div>
                <p className="tag">RESULTADO</p>
                <h2>Análisis completado</h2>
              </div>

              <span className="status-badge">COMPLETADO</span>
            </div>

            <div className="summary-grid">
              <div>
                <span>Paciente</span>
                <strong>{patient.name}</strong>
              </div>

              <div>
                <span>ID</span>
                <strong>{patient.patientId}</strong>
              </div>

              <div>
                <span>Estudio</span>
                <strong>{patient.studyType}</strong>
              </div>

              <div>
                <span>Archivo</span>
                <strong>{result.originalname}</strong>
              </div>

              <div>
                <span>Bucket</span>
                <strong>{result.bucket}</strong>
              </div>

              <div>
                <span>Tipo</span>
                <strong>{result.mimetype}</strong>
              </div>
            </div>

            <h3>TEXTO EXTRAÍDO POR TEXTRACT</h3>

            <pre>
              {result.extractedText?.trim()
                ? result.extractedText
                : 'No se detectó texto claro en la imagen.'}
            </pre>

            {patient.notes && (
              <div className="notes-box">
                <strong>Notas clínicas:</strong>
                <p>{patient.notes}</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;