import { useState } from "react"

function CreatePage() {
    const [newImmobile, setNewImmobile] = useState({
        email_proprietario: '',
        username_proprietario: '',
        titolo_descrittivo: '',
        indirizzo_completo: '',
        descrizione: '',
        mq: 0,
        bagni: 0,
        locali: 0,
        posti_letto: 0
    })

    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target

        setNewImmobile((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/immobili`, {
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
                "data_eliminazione": null
            }
        }).then((resp) => {
            setAlertMessage('Immobile inserito con successo!')
            setAlertType('success')
        }).catch((error) => {
            setAlertMessage('Si è verificato un problema.')
            setAlertType('danger')
        })
    }

    return (
        <>
    
            <section className='d-flex justify-content-center align-items-center'>
            {alertMessage && (
                <div className={`alert alert-${alertType}`} role='alert'>
                    {alertMessage}
                </div>
            )}
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Indirizzo email</label>
                        <input type="email" className="form-control" id="email" name="email_proprietario" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" name="username_proprietario" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="titolo">Titolo descrittivo</label>
                        <input type="text" className="form-control" id="titolo" name="titolo_descrittivo" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="indirizzo">Indirizzo</label>
                        <input type="text" className="form-control" id="indirizzo" name="indirizzo_completo" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="metriQuadri">Metri quadri</label>
                        <input type="number" className="form-control" id="metriQuadri" name="mq" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numLocali">Numero locali</label>
                        <input type="number" className="form-control" id="numLocali" name="locali" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numLetti">Numero posti letto</label>
                        <input type="number" className="form-control" id="numLetti" name="posti_letto" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numBagni">Numero bagni</label>
                        <input type="number" className="form-control" id="numBagni" name="bagni" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descrizione">Descrizione</label>
                        <textarea className="form-control" id="descrizione" name="descrizione" onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </section>
        </>
    )
}

export default CreatePage