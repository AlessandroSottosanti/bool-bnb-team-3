import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detailPageCss.css"
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    //Implemento le stelle per il rating dell'immobile

    const voto = immobile.immobile.recensioni[0].voto;
    const votoMedio = immobile.immobile.voto_medio;

    const renderStars = (voto) => {
        const fullStars = Math.ceil(voto);
        const emptyStars = 5 - fullStars;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} style={{ color: '#ffc107' }} />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} style={{ color: '#e4e5e9' }} />);
        }
        return stars;
    };

    return (
        <>
            <section className="container my-3">
                <div id="immobile">
                    <div id="title" className="d-flex py-2">
                        <h2>
                            <a href="#descrizione"><i className="fa-solid fa-location-dot me-1"></i></a>
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
                                    <img
                                        src={`/images/${curImage.nome_immagine}`}
                                        alt={`Slide ${index + 1}`}
                                        onError={(e) => e.target.src = 'https://placehold.co/600x400'}
                                    />
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
                    <div id="host" className="pt-3">
                        <h5>
                            Nome dell'host: {immobile.immobile.username_proprietario
                                .replace(/_/g, ' ')  // Sostituisci gli underscore con uno spazio
                                .replace(/\b\w/g, letter => letter.toUpperCase())}  {/* Trasforma la prima lettera di ogni parola in maiuscolo */}
                        </h5>
                    </div>
                    <hr />
                    <div id="info" className="py-2">
                        <div id="descrizione">
                            <h5 className="pb-2">DESCRIZIONE</h5>
                            <p>{immobile.immobile.descrizione}</p>
                            <span><i className="fa-solid fa-map-pin"></i> - {immobile.immobile.indirizzo_completo}</span>
                        </div>
                        <hr />
                        <div className="dettagli row">
                            <h5 className="pb-2">Dettagli della struttura</h5>
                            <div className="col-6">
                                <p>
                                    <i className="fa-solid fa-up-right-and-down-left-from-center"></i> MQ: {immobile.immobile.mq}
                                </p>
                                <p>
                                    <i className="fa-solid fa-bath"></i> Bagni: {immobile.immobile.bagni}
                                </p>
                            </div>
                            <div className="col-6">
                                <p>
                                    <i className="fa-solid fa-door-open"></i> Locali: {immobile.immobile.locali}
                                </p>
                                <p>
                                    <i className="fa-solid fa-bed"></i> Posti letto: {immobile.immobile.posti_letto}
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div id="info" className="py-2">
                            <h5>INFO E CONTATTI</h5>
                            <span><i className="fa-solid fa-envelope"></i> Email: {immobile.immobile.email_proprietario}</span>
                        </div>
                        <hr />
                    </div>
                </div>
                <button id="detail-button" type="button" className="btn btn-secondary"><Link to="/">Torna alla home</Link></button>
                <div id="recensioni" className="pt-5">
                    <div id="titolo_recensioni" className="d-flex justify-content-between">
                        <h3 className="pb-2">Recensioni</h3>
                        <p className="align-self-center  px-3"><strong>Voto medio</strong><br /> {renderStars(immobile.immobile.voto_medio)}</p>
                    </div>
                    <div className="card">
                        {immobile.immobile.recensioni.map((curRecensione, i) => (
                            <div key={i} className="recensione">
                                <div className="card-header d-flex justify-content-between">
                                    <h3>{curRecensione.username
                                        .replace(/_/g, ' ')  // Sostituisci gli underscore con uno spazio
                                        .replace(/\b\w/g, letter => letter.toUpperCase())}
                                    </h3>
                                    <p className="align-self-center">{renderStars(votoMedio)}</p>
                                </div>
                                <div className="card-body fw-medium">
                                    <span>{curRecensione.recensione}</span> <br />
                                    <span>Voto: {curRecensione.voto}</span>
                                    <p>Recensione del: {new Date(curRecensione.data).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
        </>
    );
}

export default PaginaDettaglio;