import { useEffect, useRef, useState } from "react";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

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
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null); // Ref per l'input file


    const initForm = {
        "immobile": initImmobile,
        "tipi_alloggio": tipiAlloggioSelezionati,

        "immagini": newImmobile.immagini
    };

    const [debug, setDebug] = useState(initForm);


    useEffect(() => {
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
        console.log("event.target.type", event.target.type);
    
        let { name, value, type, files } = event.target;
    
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
    
        if (type === "number") {
            value = parseInt(value);
        }
    
        setNewImmobile((prev) => ({
            ...prev,
            [name]: value
        }));
    
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
        }).then((resp) => {
            setAlertMessage('Immobile inserito con successo!');
            setAlertType('success');
            console.log("success", resp);
        }).catch((err) => {
            setAlertMessage('Si è verificato un problema.');
            setAlertType('danger');
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
            <h1 className="text-center pt-3 pb-4">Inserisci i dettagli del tuo immobile</h1>
            <section className='d-flex justify-content-center align-items-center flex-column'>

               
                <form onSubmit={handleSubmit} className="text-center">
                    <div className="form-group">
                        <label htmlFor="email">Indirizzo email</label>
                        <input type="email" className="form-control" id="email" name="email_proprietario" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" name="username_proprietario" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="titolo">Titolo descrittivo</label>
                        <input type="text" className="form-control" id="titolo" name="titolo_descrittivo" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="indirizzo">Indirizzo</label>
                        <input type="text" className="form-control" id="indirizzo" name="indirizzo_completo" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="metriQuadri">Metri quadri</label>
                        <input type="number" className="form-control" id="metriQuadri" name="mq" min="0" step="1" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="numLocali">Numero locali</label>
                        <input type="number" className="form-control" id="numLocali" name="locali" min="0" step="1" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="numLetti">Numero posti letto</label>
                        <input type="number" className="form-control" id="numLetti" name="posti_letto" min="0" step="1" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="numBagni">Numero bagni</label>
                        <input type="number" className="form-control" id="numBagni" name="bagni" min="0" step="1" onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="descrizione">Descrizione</label>
                        <textarea className="form-control" id="descrizione" name="descrizione" onChange={handleChange} />
                    </div>

                    <label className="mt-3" htmlFor="tipi_alloggio">
                        Tipo di Alloggio
                    </label>
                    <div className="mt-3 d-flex gap-2">

                        <select
                            className="form-select"
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
                        <button className="btn btn-primary" type="button" onClick={handleAddTipologia}>
                            Aggiungi
                        </button>
                    </div>
                    <div className="d-flex gap-3  my-2">
                        {tipiAlloggioSelezionati.map((tipologia) => (
                            <div className=" d-flex align-items-center flex-row gap-2" key={tipologia.id}>
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


                    <div className="container mt-4 d-flex flex-column mb-5">
                        <h2>Carica immagini dell'immobile</h2>
                        <p>La prima immagine inserita sarà utilizzata come copertina del post.</p>

                        <label htmlFor="fileInput" className="form-label">Scegli un file</label>
                        <div className="mb-3 d-flex justify-content-center align-items-center gap-2 row">
                            <input
                                type="file"
                                className="form-control"
                                id="fileInput"
                                multiple
                                onChange={handleChange}  // Gestisci l'evento quando il file viene selezionato
                            />
                        </div>
                        <div id="fileHelp" className="form-text mb-5">Puoi caricare uno o più file con un massimo di 30</div>

                        {/* Contenitore per le anteprime delle immagini */}
                        <div className="d-flex flex-wrap gap-3">
                            { preview && preview.map((image, index) => (
                                <div key={index} className="position-relative" style={{ width: "150px", height: "150px" }}>
                                    <img src={image} alt={`Anteprima immagine ${index + 1}`} className="img-fluid" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                                    {/* Pulsante X per rimuovere l'immagine */}
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

                    
                    <button type="submit" className="btn btn-success mt-2 mb-5">+ Crea nuovo immobile</button>
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
                        ></button>
                    </div>
                )}
            </section>
        </main>
    )
}

export default CreatePage