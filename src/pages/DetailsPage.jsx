import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detailPageCss.css"

const apiUrl = import.meta.env.VITE_API_URL;

function PaginaDettaglio() {
    const { slug } = useParams();
    const [immobile, setImmobile] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(null);


    useEffect(() => {
        // Effettua la richiesta all'API
        axios.get(`${apiUrl}/immobili/${slug}`)
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
    }, [slug]); // Effettua la richiesta quando cambia lo slug


    if (caricamento) return <p>Caricamento...</p>;
    if (!immobile) return <p>Elemento non trovato</p>;

    return (
        <>
            <section className="container my-3">
                <div id="immobile">
                        <div id="title" className="d-flex">
                            <h2>
                                <a href="#map"><i className="fa-solid fa-location-dot me-1"></i></a>
                                {immobile.immobile.titolo_descrittivo}
                            </h2>
                        </div>
                        <div id="carouselExampleIndicators" className="carousel slide">
                            {/* Indicatori dinamici */}
                            <div className="carousel-indicators">
                                {immobile.immagini.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to={index}
                                        className={index === 0 ? "active" : ""}
                                        aria-current={index === 0 ? "true" : undefined}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>

                            {/* Immagini dinamiche */}
                            <div className="carousel-inner">
                                {immobile.immagini.map((curImage, index) => (
                                    <div key={curImage.nome_immagine} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                        <img src={`/images/${curImage.nome_immagine}`} alt={`Slide ${index + 1}`} />
                                    </div>
                                ))}
                            </div>

                            {/* Pulsanti di controllo */}
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div className="container">
                            <div id="info">
                                <div id="descrizione">
                                    <h4>Descrizione</h4>
                                    <p>{immobile.descrizione}</p>
                                    <span>- {immobile.immobile.indirizzo_completo} - </span>
                                </div>
                                <div id="info">
                                    <p>PER INFO E CONTATTI</p>
                                    <span>Email: {immobile.immobile.email_proprietario}</span>
                                </div>

                            </div>
                        </div>
                </div>
                <button type="button" className="btn btn-primary "><Link to="/">Torna alla home</Link></button>
                <div id="recensioni">
                    <div className="card">
                        {immobile.immobile.recensioni.map((curRecensione, i) => (
                            <div key={i} className="recensione">
                                <h3>{curRecensione.username}</h3>
                                <p>{curRecensione.recensione}</p>
                                <span>Voto: {curRecensione.voto}</span>
                                <p>Recensione del: {new Date(curRecensione.data).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
        </>
    );
}

export default PaginaDettaglio;