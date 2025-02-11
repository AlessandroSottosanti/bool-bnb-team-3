import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function PaginaDettaglio() {
    const { id } = useParams();
    const [immobile, setImmobile] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(null);

    useEffect(() => {
        // Effettua la richiesta all'API
        axios.get(`${apiUrl}/immobili/${id}`)
            .then(response => {
                // Salva i dati ricevuti nello stato
                setImmobile(response.data.results);
            })
            .catch(() => {
                // Se c'è un errore, lo gestiamo
                setErrore("Errore nel recupero dei dati");
            })
            .finally(() => {
                // Indichiamo che il caricamento è terminato
                setCaricamento(false);
            });
    }, [id]); // Effettua la richiesta quando cambia l'ID

    if (caricamento) return <p>Caricamento...</p>;
    if (!immobile) return <p>Elemento non trovato</p>;

    return (
        <>
            <section className="container my-3">
                <div className="card">
                    <h2>{immobile.titolo_descrittivo}</h2>
                    <img src="https://placeholder.pics/svg/100x100" alt="Immagine di esempio" style={{ maxWidth: "300px" }} />
                    <p>{immobile.descrizione}</p>
                    <span>{immobile.indirizzo}</span>
                    <span>{immobile.prezzo_affitto}€ Al mese</span>
                    <span>{immobile.citta}</span>
                </div>
                <button type="button" className="btn btn-primary "><Link to="/">Porcoddioo</Link></button>
            </section>
        </>

    );
}

export default PaginaDettaglio;