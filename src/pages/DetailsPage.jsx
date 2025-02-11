import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detailPageCss.css"

const apiUrl = import.meta.env.VITE_API_URL;

function PaginaDettaglio() {
    const { id } = useParams();
    const [immobile, setImmobile] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(null);

    const containerStyle = {
        width: '100%',
        height: '300px',
    };

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
                    <div id="carouselExampleIndicators" className="carousel slide">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://placeholder.pics/svg/300x200" alt="Immagine di esempio" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://placeholder.pics/svg/300x200" alt="Immagine di esempio" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://placeholder.pics/svg/300x200" alt="Immagine di esempio" />
                            </div>
                        </div>
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
                            <div id="title" className="d-flex">
                                <h2>
                                    <a href="#map"><i className="fa-solid fa-location-dot me-1"></i></a>
                                    {immobile.titolo_descrittivo}
                                </h2>
                                <span className="fs-3">{immobile.prezzo_affitto}€ Al mese</span>
                            </div>
                            <div id="descrizione">
                                <h4>Descrizione</h4>
                                <p>{immobile.descrizione}</p>
                                <span>- {immobile.indirizzo} - </span>
                                <span>{immobile.citta}</span>
                            </div>
                            <div id="info">
                                <p>PER INFO E CONTATTI</p>
                                <span>Email: EMAILDASOSTIUIRE@RICORDATELO.COM</span>
                                <span>Telefono:3334455698</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div id="map">
                    <LoadScript googleMapsApiKey="AIzaSyC2ti5F0giuf6rGXMRyDdjGlmcdWUnLsMY">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={{
                                lat: 41.9028,
                                lng: 12.4964,
                            }}
                            zoom={13}
                        >
                            <Marker
                                position={{
                                    lat: 41.9028,
                                    lng: 12.4964,
                                }}
                                title="Posizione immobile"
                            />
                        </GoogleMap>
                    </LoadScript>
                </div>
                <button type="button" className="btn btn-primary "><Link to="/">Porcoddioo</Link></button>
            </section >
        </>
    );
}

export default PaginaDettaglio;