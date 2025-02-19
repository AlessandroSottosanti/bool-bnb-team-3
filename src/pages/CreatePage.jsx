import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function CreatePage() {
  const [immagini, setImmagini] = useState([]);

  const initImmobile = {
    email_proprietario: "",
    username_proprietario: "",
    titolo_descrittivo: "",
    indirizzo_completo: "",
    descrizione: "",
    mq: 0,
    bagni: 0,
    locali: 0,
    posti_letto: 0,
    immagini: [],
  };

  const [newImmobile, setNewImmobile] = useState(initImmobile);
  const [tipiAlloggio, setTipiAlloggio] = useState([]);
  const [tipiAlloggioSelezionati, setTipiAlloggioSelezionati] = useState([]);
  const [selectedTipologia, setSelectedTipologia] = useState("");
  const [preview, setPreview] = useState([]);
  const fileInputRef = useRef(null); // Ref per l'input file

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    Object.keys(newImmobile).forEach((key) => {
      if (key !== "immagini" && !newImmobile[key]) {
        newErrors[key] = "Questo campo è obbligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const initForm = {
    immobile: initImmobile,
    tipi_alloggio: tipiAlloggioSelezionati,

    immagini: newImmobile.immagini,
  };

  const [debug, setDebug] = useState(initForm);

  useEffect(() => {
    window.scrollTo(0, 0);
    getTipiAlloggi();
  }, []);

  const getTipiAlloggi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/tipi-alloggi`)
      .then((resp) => {
        const { results } = resp.data;
        setTipiAlloggio(results);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei tipi di alloggi", error);
      });
  };

  const handleSelectChange = (event) => {
    setSelectedTipologia(event.target.value);
  };

  const handleAddTipologia = () => {
    if (selectedTipologia) {
      const tipologiaDaAggiungere = tipiAlloggio.find(
        (tipologia) => tipologia.id === parseInt(selectedTipologia)
      );

      if (
        tipologiaDaAggiungere &&
        !tipiAlloggioSelezionati.some(
          (item) => item.id === tipologiaDaAggiungere.id
        )
      ) {
        setTipiAlloggioSelezionati((prev) => [...prev, tipologiaDaAggiungere]);
      }

      setSelectedTipologia("");
    }
  };

  const removeTipologia = (id) => {
    setTipiAlloggioSelezionati((prev) =>
      prev.filter((tipologia) => tipologia.id !== id)
    );
  };

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const handleChange = (event) => {
    let { name, value, type, files } = event.target;

    if (event.target.type === "number") {
      value = value ? parseInt(value) : "";
    }

    if (type === "file") {
      // Converte i file selezionati in un array
      const newFiles = Array.from(files);

      // Aggiungi i nuovi file all'array esistente delle immagini
      setImmagini((prevImmagini) => [...prevImmagini, ...newFiles]);

      // Crea un nuovo array di anteprime per tutte le immagini selezionate
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      // Imposta lo stato delle anteprime
      setPreview((prevPreviews) => [...prevPreviews, ...newPreviews]);

      // Aggiorna anche l'array immagini nel nuovo immobile
      setNewImmobile((prev) => ({
        ...prev,
        immagini: [...prev.immagini, ...newFiles], // Aggiungi le nuove immagini al campo 'immagini'
      }));
    }

    setNewImmobile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Resetta l'input file
    if (fileInputRef.current) {
      console.log("fileInputRef", fileInputRef);
      fileInputRef.current.value = "";
    }
  };

  // Funzione per rimuovere una immagine dalla lista
  const removeImage = (index) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImmagini((prevImmagini) => prevImmagini.filter((_, i) => i !== index));
    setPreview((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setNewImmobile({ ...newImmobile, immagini: [] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const oggetto = {
      immobile: {
        email_proprietario: newImmobile.email_proprietario,
        username_proprietario: newImmobile.username_proprietario,
        titolo_descrittivo: newImmobile.titolo_descrittivo,
        indirizzo_completo: newImmobile.indirizzo_completo,
        descrizione: newImmobile.descrizione,
        mq: newImmobile.mq,
        bagni: newImmobile.bagni,
        locali: newImmobile.locali,
        posti_letto: newImmobile.posti_letto,
      },
      tipi_alloggio: tipiAlloggioSelezionati.map((alloggio) => alloggio.id),

      immagini: newImmobile.immagini, // Aggiungi le immagini al corpo della richiesta
    };

    setDebug(oggetto);

    // Invia i dati con le immagini al server
    axios
      .post(`${apiUrl}/immobili`, oggetto, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log("resp", resp);
        setDebug(initForm);
        setNewImmobile(initImmobile);
        setTipiAlloggio([]);
        setTipiAlloggioSelezionati([]);
        setPreview([]);

        // navigate('/')
      })
      .catch((err) => {
        setAlertMessage(err.response.data.message);
        setAlertType("danger");
        setTimeout(() => {
          setAlertMessage("");
          setAlertType("");
        }, 5000);
        console.error("error", err);
      });
  };

  console.log("debug", debug);
  console.log("newImmobile", newImmobile);
  console.log("tipiAlloggioSelezionati", tipiAlloggioSelezionati);
  console.log("selectedTipologia", selectedTipologia);
  console.log("immagini", newImmobile.immagini, debug.immagini);
  return (
    <main>
      <div className="container my-4">
        <h1 className="text-center pt-3 pb-4">
          Inserisci i dettagli del tuo immobile
        </h1>
      </div>
      <section className="d-flex justify-content-center align-items-center flex-column">
        <form onSubmit={handleSubmit} className="text-center needs-validation">
          <div className="container">
            <div className="row g-3">
              <div className="col-12 col-lg-6">
               
                  {Object.keys(newImmobile).map(
                    (key) =>
                      key !== "mq" &&
                      key !== "bagni" &&
                      key !== "locali" &&
                      key !== "posti_letto" &&
                      key !== "immagini" &&
                      key !== "" && (
                        <div className="col-12" key={key}>
                          <label htmlFor={key} className="form-label">
                            {key.replace("_", " ")}{" "}
                            <small className="text-muted">(obbligatorio)</small>
                          </label>
                          <div className="d-flex justify-content-center">
                            <input
                              type="text"
                              className={`form-control form-control-sm w-50 ${
                                errors[key] ? "is-invalid" : ""
                              }`}
                              id={key}
                              name={key}
                              value={newImmobile[key]}
                              onChange={handleChange}
                            />
                          </div>
                          {errors[key] && (
                            <div className="invalid-feedback">
                              {errors[key]}
                            </div>
                          )}
                        </div>
                      )
                  )}
                
              </div>
              <div className="col-12 col-lg-6">
                <div className="row g-3">
                  {Object.keys(newImmobile).map(
                    (key) =>
                      (key === "mq" ||
                        key === "bagni" ||
                        key === "locali" ||
                        key === "posti_letto") && (
                        <div className="col-12" key={key}>
                          <label htmlFor={key} className="form-label">
                            {key.replace("_", " ")}{" "}
                            <small className="text-muted">(obbligatorio)</small>
                          </label>
                          <div className="d-flex justify-content-center">
                            <input
                              type="number"
                              className={`form-control form-control-sm w-25 text-center ${
                                errors[key] ? "is-invalid" : ""
                              }`}
                              id={key}
                              name={key}
                              value={newImmobile[key]}
                              onChange={handleChange}
                            />
                          </div>
                          {errors[key] && (
                            <div className="invalid-feedback">
                              {errors[key]}
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>

            <div className="row g-3 mt-3 justify-content-center">
              <div className="col-12 col-md-6">
                <label htmlFor="tipi_alloggio">Tipo di Alloggio</label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select w-75"
                    id="tipi_alloggio"
                    value={selectedTipologia}
                    onChange={handleSelectChange}
                  >
                    <option value="">Seleziona un tipo di alloggio</option>
                    {tipiAlloggio.map((tipologia) => (
                      <option key={tipologia.id} value={tipologia.id}>
                        {tipologia.nome_tipo_alloggio}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-orange"
                    type="button"
                    onClick={handleAddTipologia}
                  >
                    Aggiungi
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-3 my-2">
                  {tipiAlloggioSelezionati.map((tipologia) => (
                    <div
                      className="d-flex align-items-center gap-2"
                      key={tipologia.id}
                    >
                      <span>{tipologia.nome_tipo_alloggio}</span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeTipologia(tipologia.id)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="container mt-4 mb-5">
            <h2>Carica immagini dell'immobile</h2>
            <p>
              La prima immagine inserita sarà utilizzata come copertina del
              post.
            </p>

            <label htmlFor="fileInput" className="form-label">
              Scegli un file
            </label>
            <div className="mb-3 d-flex justify-content-center align-items-center gap-2">
              <input
                type="file"
                className="form-control w-50"
                id="fileInput"
                multiple
                onChange={handleChange}
              />
            </div>
            <div id="fileHelp" className="form-text mb-3">
              Max. 30 file
            </div>

            <div className="d-flex flex-wrap gap-3">
              {preview &&
                preview.map((image, index) => (
                  <div
                    key={index}
                    className="position-relative"
                    style={{ width: "150px", height: "150px" }}
                  >
                    <img
                      src={image}
                      alt={`Anteprima immagine ${index + 1}`}
                      className="img-fluid rounded"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger position-absolute top-0 end-0 m-1"
                      onClick={() => removeImage(index)}
                      style={{ borderRadius: "50%" }}
                    >
                      <span className="text-white">&times;</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>

<<<<<<< HEAD
        // Invia i dati con le immagini al server
        axios.post(`${apiUrl}/immobili`, oggetto, {
            headers: {
                "Content-type": "multipart/form-data",
            },
        }).then((response) => {
            console.log("resp", response.data.immobile_slug);
            setDebug(initForm);
            setNewImmobile(initImmobile);
            setTipiAlloggio([]);
            setTipiAlloggioSelezionati([]);
            setPreview([]);
            
            navigate(`/${response.data.immobile_slug}`);

        }).catch((err) => {
            setAlertMessage(err.response.data.message);
            setAlertType('danger');
            setTimeout(() => {
=======
          <button type="submit" className="btn btn-outline-orange mt-2 mb-5">
            + Crea nuovo immobile
          </button>
        </form>

        {alertMessage && (
          <div
            className={`alert alert-${alertType} alert-dismissible fade show`}
            role="alert"
          >
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              onClick={() => {
>>>>>>> db5bd10b691c4d6cfd9e7eb3ad9f2f61fc9006bc
                setAlertMessage("");
                setAlertType("");
              }}
            ></button>
          </div>
        )}
      </section>

      <Link className="btn btn-secondary ms-5" to="/">
        <i className="fa-solid fa-arrow-left"></i> Indietro
      </Link>
    </main>
  );
}

export default CreatePage;
