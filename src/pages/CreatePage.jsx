import { useEffect, useState } from "react";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

function CreatePage() {

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

        const { name, value } = event.target;

        if (event.target.type === "number") {
            parseInt(value);
        }

        setNewImmobile((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        event.preventDefault()
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

            "immagini": newImmobile.immagini
        }

        setDebug(oggetto);

        axios.post(`${apiUrl}/immobili`, oggetto
        ).then((resp) => {
            setAlertMessage('Immobile inserito con successo!');
            setAlertType('success');
            return console.log("success", resp);
        }).catch((err) => {
            setAlertMessage('Si è verificato un problema.');
            setAlertType('danger');
            return console.error("error", err);
        })

    }

    console.log("debug", debug);
    console.log("newImmobile", newImmobile);
    console.log("tipiAlloggioSelezionati", tipiAlloggioSelezionati);
    console.log("selectedTipologia", selectedTipologia);
    return (
        <>
            <h1 className="text-center pt-3 pb-4">Inserisci i dettagli del tuo immobile</h1>
            <section className='d-flex justify-content-center align-items-center flex-column'>

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

                    <div className="mt-3">
                        <label htmlFor="tipi_alloggio">
                            Tipo di Alloggio:
                        </label>
                        <select
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
                        <button type="button" onClick={handleAddTipologia}>
                            Aggiungi
                        </button>
                    </div>

                    <div>
                        {tipiAlloggioSelezionati.map((tipologia) => (
                            <div key={tipologia.id}>
                                <span>{tipologia.nome_tipo_alloggio}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTipologia(tipologia.id)}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn secondary mt-2">Invia</button>
                </form>
            </section>
        </>
    )
}

export default CreatePage