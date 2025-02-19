import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detailPageCss.css"
import ReviewModale from "../components/ReviewModale";
import SendEmail from "../components/SendEmail";

const apiUrl = import.meta.env.VITE_API_URL;

function PaginaDettaglio() {
    const { slug } = useParams();
    const [immobile, setImmobile] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(null);
    const [heartCount, setHeartCount] = useState(0);

    const showImmobile = () => {
        // Effettua la richiesta all'API
        axios.get(`${apiUrl}/immobili/${slug}`)
            .then(response => {
                // Salva i dati ricevuti nello stato
                setImmobile(response.data.results);
                const savedHeartCounts = JSON.parse(localStorage.getItem("heartCounts")) || {};
                setHeartCount(savedHeartCounts[response.data.results.immobile.id] || 0);
            })
            .catch(() => {
                // Se c'è un errore, lo gestiamo
                setErrore("Errore nel recupero dei dati");
            })
            .finally(() => {
                // Indichiamo che il caricamento è terminato
                setCaricamento(false);
            });
    }

    useEffect(() => {

        showImmobile();

    }, [slug]); // Effettua la richiesta quando cambia lo slug

    if (caricamento) return <p>Caricamento...</p>;
    if (!immobile) return <p>Elemento non trovato</p>;

    const alloggio = immobile.tipi_alloggio[0].nome_tipo_alloggio;


    //Implemento le stelle per il rating dell'immobile

    const renderStars = (voto) => {
        const fullStars = Math.ceil(voto);
        const emptyStars = 5 - fullStars;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
        }
        return stars;
    };


    // Funzione per evidenziare l'elemento di destinazione
    const handleHighlight = (event) => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.classList.add("highlight");
            targetElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            setTimeout(() => {
                targetElement.classList.add("highlight-remove");
            }, 1500);
            setTimeout(() => {
                targetElement.classList.remove("highlight", "highlight-remove");
            }, 3000);
        }
    };

    const handleLike = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const newHeartCount = heartCount + 1;
        const savedHeartCounts = JSON.parse(localStorage.getItem("heartCounts")) || {};
        savedHeartCounts[immobile.immobile.id] = newHeartCount;
        localStorage.setItem("heartCounts", JSON.stringify(savedHeartCounts));
        setHeartCount(newHeartCount);
    };

    const handleSubmit = (nuovaRecensione) => {
        console.log(nuovaRecensione);

        axios.post(`${apiUrl}/recensioni/${immobile.immobile.id}`, nuovaRecensione)
            .then(response => {
                console.log("Recensione inviata con successo", response.data);
                alert("Recensione aggiunta!");
                showImmobile();
            })
            .catch(error => {
                console.error("Errore nell'invio della recensione", error);
                alert("Errore nell'invio della recensione.");
            });
    };


    return (
        <main>
            <section className="container my-3">
                <div id="immobile">
                    <div id="title" className="d-flex py-2">
                        <h2>
                            <a href="#adress" onClick={handleHighlight}><i className="fa-solid fa-location-dot me-1"></i>
                                {immobile.immobile.titolo_descrittivo}
                            </a>
                        </h2>
                    </div>
                    <div id="carouselExampleIndicators" className="carousel slide img-container">
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

                        <div className="d-flex justify-content-center align-items-center mb-2 like">
                            <button className="btn" onClick={handleLike}>❤️</button>
                            <span>{heartCount}</span>
                        </div>

                        {/* Immagini dinamiche */}
                        <div className="carousel-inner">
                            {immobile.immagini.map((curImage, index) => (
                                <div key={curImage.nome_immagine} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img
                                        src={`${apiUrl}/images/${curImage.nome_immagine}`}
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

                    <hr />
                    <div id="adress">
                        <span><i className="fa-solid fa-map-pin"></i> <strong>Indirizzo:</strong> {immobile.immobile.indirizzo_completo}</span>
                    </div>
                    <hr />
                    <div id="info" className="py-2">
                        <div id="descrizione">
                            <h5 className="pb-2">DESCRIZIONE</h5>
                            <p>{immobile.immobile.descrizione}</p>
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
                            <div className="col-6">
                                <p>
                                    <i className="fa-solid fa-house-chimney"></i> Tipo di alloggio: {alloggio}
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div id="info" className="py-2">
                            <h5>INFO E CONTATTI</h5>
                            <div id="host" className="py-1">
                                <span><i className="fa-solid fa-user"></i> <strong>Host:</strong> {immobile.immobile.username_proprietario
                                    .replace(/_/g, ' ')  // Sostituisci gli underscore con uno spazio
                                    .replace(/\b\w/g, letter => letter.toUpperCase())}  {/* Trasforma la prima lettera di ogni parola in maiuscolo */}
                                </span>
                            </div>
                            <div>
                                <SendEmail />
                            </div>
                        </div>
                        <hr />

                    </div>
                </div>
                <div id="recensioni" className="pt-5">
                    <div id="titolo_recensioni" className="d-flex justify-content-between">
                        <div className="pb-2">
                            <h3>Recensioni clienti</h3>
                            <span>
                                {immobile?.immobile?.tot_recensioni === 1
                                    ? `${immobile.immobile.tot_recensioni} valutazione globale`
                                    : `${immobile.immobile.tot_recensioni} valutazioni globali`}
                            </span>
                        </div>
                        <div className="align-items-center d-flex flex-column justify-content-center px-3">
                            <span className="justify-content-center"><strong>Voto medio</strong></span>
                            <span>
                                {renderStars(immobile.immobile.voto_medio)} {immobile.immobile.voto_medio.toFixed(1)} su 5
                            </span>

                        </div>
                    </div>
                </div>
                <div className="recensione">
                    {immobile.immobile.recensioni.map((curRecensione, i) => (
                        <div key={i} className="card mb-3">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h3>{curRecensione.username
                                    .replace(/_/g, ' ')  // Sostituisci gli underscore con uno spazio
                                    .replace(/\b\w/g, letter => letter.toUpperCase())}
                                </h3>
                                <div className="d-flex align-items-center flex-column">
                                    <span className="px-1">
                                        {renderStars(curRecensione.voto)} {curRecensione.voto} su 5
                                    </span>
                                    <span></span>
                                    <span>Recensione del: {new Date(curRecensione.data).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="card-body fw-medium">
                                <span>{curRecensione.recensione}</span> <br />

                            </div>
                        </div>
                    ))}
                </div>
                <div id="nuova_recensione" className="d-flex py-3">
                    <ReviewModale
                        handleSubmit={handleSubmit}
                        immobile={immobile}
                    />
                </div>
            </section >
            <Link className="btn btn-secondary ms-5" to="/"><i class="fa-solid fa-arrow-left"></i> Indietro</Link>

        </main >
    );
}

export default PaginaDettaglio;