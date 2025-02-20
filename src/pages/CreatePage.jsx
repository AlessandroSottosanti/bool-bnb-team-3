import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import {useAlertContext} from "../contexts/AlertContext.jsx";


function CreatePage() {

    const [immagini, setImmagini] = useState([]);

    const initImmobile = {
        email_proprietario: '',
        username_proprietario: '',
        titolo_descrittivo: '',
        indirizzo_completo: '',
        descrizione: '',
        mq: 0,
        bagni: 0,
        locali: 0,
        posti_letto: 0,
        immagini: []
    };


    const [newImmobile, setNewImmobile] = useState(initImmobile)
    const [tipiAlloggio, setTipiAlloggio] = useState([]);
    const [tipiAlloggioSelezionati, setTipiAlloggioSelezionati] = useState([])
    const [selectedTipologia, setSelectedTipologia] = useState('')
    const [preview, setPreview] = useState([]);
    const fileInputRef = useRef(null); // Ref per l'input file
    const [errors, setErrors] = useState({});

    const {setError} = useAlertContext();
    const {setMessage} = useAlertContext();

    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};
        Object.keys(newImmobile).forEach(key => {
            if (key !== "immagini" && !newImmobile[key]) {
                newErrors[key] = "Questo campo è obbligatorio";
            }
        });
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };
        const initForm = {
        "immobile": initImmobile,
        "tipi_alloggio": tipiAlloggioSelezionati,

        "immagini": newImmobile.immagini
    };

    const [debug, setDebug] = useState(initForm);


    useEffect(() => {
        window.scrollTo(0,0);
        getTipiAlloggi();
    }, [])


    const getTipiAlloggi = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/tipi-alloggi`).then((resp) => {
            const { results } = resp.data
            setTipiAlloggio(results)
        }).catch((error) => {
            console.error('Errore nel recupero dei tipi di alloggi', error)
        })
    }

    const handleSelectChange = (event) => {
        setSelectedTipologia(event.target.value)
    };

    const handleAddTipologia = () => {
        if (selectedTipologia) {
            const tipologiaDaAggiungere = tipiAlloggio.find(
                (tipologia) => tipologia.id === parseInt(selectedTipologia)
            )

            if (
                tipologiaDaAggiungere &&
                !tipiAlloggioSelezionati.some((item) => item.id === tipologiaDaAggiungere.id)
            ) {
                setTipiAlloggioSelezionati((prev) => [...prev, tipologiaDaAggiungere]);
            }

            setSelectedTipologia('')
        }
    }

    const removeTipologia = (id) => {
        setTipiAlloggioSelezionati((prev) =>
            prev.filter((tipologia) => tipologia.id !== id)
        )
    }

    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    


    const handleChange = (event) => {
        let { name, value, type, files } = event.target;

        if (event.target.type === "number") {
            value = value ? parseInt(value) : '';
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
                immagini: [...prev.immagini, ...newFiles] // Aggiungi le nuove immagini al campo 'immagini'
            }));
        }

        setNewImmobile((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

         // Resetta l'input file
         if (fileInputRef.current) {
            console.log('fileInputRef', fileInputRef);
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
        setNewImmobile({ ...newImmobile, immagini: [] })
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        const oggetto = {
            "immobile": {
                "email_proprietario": newImmobile.email_proprietario,
                "username_proprietario": newImmobile.username_proprietario,
                "titolo_descrittivo": newImmobile.titolo_descrittivo,
                "indirizzo_completo": newImmobile.indirizzo_completo,
                "descrizione": newImmobile.descrizione,
                "mq": newImmobile.mq,
                "bagni": newImmobile.bagni,
                "locali": newImmobile.locali,
                "posti_letto": newImmobile.posti_letto,
            },
            "tipi_alloggio": tipiAlloggioSelezionati.map((alloggio) => alloggio.id),

            "immagini": newImmobile.immagini // Aggiungi le immagini al corpo della richiesta
        };

        setDebug(oggetto);

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
            
            setMessage("Inserimento immobile avvenuto con successo!");
            setTimeout(() => {
                setMessage("");
            }, 5000);
            navigate(`/${response.data.immobile_slug}`);

        }).catch((err) => {
            console.log(err);
            setError(err);
            setTimeout(() => {
                setError("");
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
    <h1 className="text-center pt-3 pb-4">Inserisci i dettagli del tuo immobile</h1>
  </div>

  <section className="d-flex justify-content-center align-items-center flex-column">
    <form onSubmit={handleSubmit} className="form-container ">
      
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          {Object.keys(newImmobile).map((key) =>
            key !== "mq" &&
            key !== "bagni" &&
            key !== "locali" &&
            key !== "posti_letto" &&
            key !== "immagini" &&
            key !== "descrizione" &&
            key !== "" ? (
              <div className="mb-3 text-center" key={key}>
                <label htmlFor={key} className="form-label d-block">{key.replace("_", " ")} <span className="text-muted">(obbligatorio)</span></label>
                <input
                  type="text"
                  className="form-control text-center"
                  id={key}
                  name={key}
                  value={newImmobile[key]}
                  onChange={handleChange}
                />
              </div>
            ) : null
          )}
        </div>

        <div className="col-12 col-lg-6">
          {["mq", "bagni", "locali", "posti_letto"].map((key) => (
            <div className="mb-3 text-center" key={key}>
              <label htmlFor={key} className="form-label d-block">{key.replace("_", " ")} <span className="text-muted">(obbligatorio)</span></label>
              <input
                type="number"
                className="form-control text-center"
                id={key}
                name={key}
                value={newImmobile[key]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Campo Descrizione su col-12 anche su schermi grandi */}
        <div className="col-12">
          <div className="mb-3 text-center">
            <label htmlFor="descrizione" className="form-label d-block">Descrizione <span className="text-muted">(obbligatorio)</span></label>
            <textarea
              className="form-control"
              id="descrizione"
              name="descrizione"
              value={newImmobile.descrizione}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>
      </div>

      {/* Selettore Tipo Alloggio */}
      <div className="mb-3 text-center">
        <label htmlFor="tipi_alloggio" className="form-label d-block">Tipo di Alloggio</label>
        <div className="d-flex gap-2 justify-content-center">
          <select className="form-select w-50" id="tipi_alloggio" value={selectedTipologia} onChange={handleSelectChange}>
            <option value="">Seleziona un tipo di alloggio</option>
            {tipiAlloggio.map((tipologia) => (
              <option key={tipologia.id} value={tipologia.id}>{tipologia.nome_tipo_alloggio}</option>
            ))}
          </select>
          <button className="btn btn-orange" type="button" onClick={handleAddTipologia}>Aggiungi</button>
        </div>
      </div>

      {/* Caricamento immagini */}
      <div className="mb-3 text-center">
        <h2>Carica immagini dell'immobile</h2>
        <p className="text-muted">La prima immagine sarà usata come copertina. (Massimo 30 file)</p>
        <label htmlFor="fileInput" className="form-label d-block">Scegli un file</label>
        <input type="file" className="form-control w-50 mx-auto" id="fileInput" multiple onChange={handleChange} />
      </div>

      <div className="img-preview-container d-flex flex-wrap justify-content-center gap-3">
        {preview.map((image, index) => (
          <div key={index} className="position-relative">
            <img src={image} alt={`Anteprima ${index}`} className="preview-img"/>
            <button type="button" className="btn-remove-image" onClick={() => removeImage(index)}>&times;</button>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center">
     {/* Pulsante submit */}
     <button type="submit" className="btn btn-outline-orange mt-3">+ Crea nuovo immobile</button>
    </div>
    </form>
  </section>

  <Link className="btn btn-secondary btn-back" to="/"><i className="fa-solid fa-arrow-left"></i> Indietro</Link>
</main>

    )
}

export default CreatePage