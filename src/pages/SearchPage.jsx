import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppCard from "../components/AppCard";
const apiUrl = import.meta.env.VITE_API_URL;

function SearchPage() {
    const [search, setSearch] = useState("");
    const [immobili, setImmobili] = useState([]);
    const [warning, setWarning] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [postiLetto, setPostiLetto] = useState(0);
    const [tipologia, setTipologia] = useState("");
    const [postiLocali, setPostiLocali] = useState(0);
    const [postiBagno, setPostiBagno] = useState(0);
    const [superficieMinima, setSuperficieMinima] = useState(0);
    const [superficieMassima, setSuperficieMassima] = useState(0);
    const [votoMedio, setVotoMedio] = useState(0);
    const [params, setParams] = useState([]);

    const [count, setCount] = useState(0);


    //useParams search city
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCity = searchParams.get("city") || ""; //ottengo la città dall'url
    const [searchCity, setSearchCity] = useState(initialCity);
    const [tipiAlloggio, setTipiAlloggio] = useState([]);
    const [selectedTipologia, setSelectedTipologia] = useState('')

    const backEndUrl = import.meta.env.VITE_API_URL;

    // Useeffect per pulire l'url al refresh
    useEffect(() => {
        window.history.replaceState(null, "", window.location.pathname);
    }, []);

    useEffect(() => {
        window.scrollTo(0,0);
        if (searchCity.trim() !== "") {
            getImmobili(searchCity);
            setSearch(searchCity);
           
        }
        getTipiAlloggi();
    }, []);


    useEffect(() => {
        if (searchCity.trim() !== "") {
            getImmobili(searchCity);
            setSearch(searchCity);
        }
    }, [searchCity, postiLocali, postiBagno, superficieMinima, superficieMassima, selectedTipologia, votoMedio, postiLetto]);

    const getImmobili = (city) => {
        // Creiamo un oggetto con i parametri aggiornati
        const queryParams = {
            order_by_voto: "desc",
            search: city,
            locali: postiLocali || undefined,
            bagni: postiBagno || undefined,
            superficie_min: superficieMinima || undefined,
            superficie_max: superficieMassima || undefined,
            tipi_alloggio: selectedTipologia || undefined,
            voto_medio: votoMedio || undefined,
            posti_letto: postiLetto || undefined
        };

        console.log("Query Params inviati:", queryParams);

        // Rimuoviamo i parametri non definiti per evitare di inviare undefined
        const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== undefined)
        );

        axios
            .get(`${backEndUrl}/immobili`, { params: filteredParams })
            .then((resp) => {
                console.log("Risposta immobili:", resp);
                const savedHeartCounts = JSON.parse(localStorage.getItem("heartCounts")) || {};
                const immobiliWithLikes = resp.data.immobili.map((immobili) => {
                    return { ...immobili, heartCount: savedHeartCounts[immobili.id] || 0, voto: immobili.voto_medio || 0 }
                });
                immobiliWithLikes.sort((a, b) => b.heartCount - a.heartCount || b.voto - a.voto);
                setImmobili(immobiliWithLikes);
                setHasSearched(true);
                setCount(resp.data.count);
                // Aggiorna i parametri di ricerca nell'URL
                setSearchParams(filteredParams);
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    setWarning("Nessun immobile trovato");
                    console.error("Nessun immobile trovato:", err);
                } else {
                    console.error("Errore nel recupero degli immobili:", err);
                    setWarning("Errore nel recupero degli immobili. Riprova più tardi.");
                }
            });

        console.log("filteredParams", filteredParams)
    };





    const getTipiAlloggi = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/tipi-alloggi`).then((resp) => {
            const { results } = resp.data
            setTipiAlloggio(results)
            console.log('results',results, resp);
        }).catch((error) => {

            console.error('Errore nel recupero dei tipi di alloggi', error.status)
        })
    }


    const handleSelectChange = (event) => {
        const { name, value } = event.target; // De-strutturazione per un codice più pulito
        console.log("target", name);
        setSelectedTipologia(value);
        setParams((prevParams) => [...prevParams, `${name}=${value}`]); // Aggiungi il nuovo parametro a quelli esistenti
        setWarning(""); // Reset del messaggio di errore
    };



    const handleSearch = () => {
        if (search.trim() === "") {
            setWarning("Inserisci una città o un indirizzo per la ricerca.");
            return;
        }
        setWarning(""); // Reset del messaggio di errore
        getImmobili(search);
        setSearchCity(search);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };

    const handleLike = (event, id) => {
        event.stopPropagation();
        event.preventDefault();
        setImmobili((prevImmobili) => {
            const updated = prevImmobili.map((immobili) => {
                if (immobili.id === id) {
                    const newHeartCount = immobili.heartCount + 1;
                    const savedHeartCounts = JSON.parse(localStorage.getItem("heartCounts")) || {};
                    savedHeartCounts[immobili.id] = newHeartCount;
                    localStorage.setItem("heartCounts", JSON.stringify(savedHeartCounts));
                    return { ...immobili, heartCount: newHeartCount }
                }
                return immobili
            })
            updated.sort((a, b) => b.heartCount - a.heartCount || b.voto - a.voto);
            return updated
        })
    }

    //funzione stelle
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

    //default image
    const defaultImage = "../images/placeholder.webp";

    console.log(selectedTipologia);
    console.log("tipiAlloggio",tipiAlloggio);
    console.log("immobili", immobili.immobili);
    return (
        <main>
            <div className="text-center">
                <h1 className="mt-3">Ricerca Avanzata</h1>
            </div>


            <div className="container">
                <div className="row g-1">
                    <div className="col-12 d-flex flex-column align-items-center">
                        <label htmlFor="search"><strong>Città o Indirizzo</strong></label>
                        <input
                            className="form-control w-100 custom-width-city"
                            id="search"
                            name="search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>

                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="posti_letto"><strong>Numero di posti letto</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="posti_letto"
                            name="posti_letto"
                            type="number"
                            min="0"
                            max="100"
                            value={postiLetto}
                            onChange={(event) => setPostiLetto(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>


                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="posti_letto"><strong>Tipo di alloggio</strong></label>
                        <select
                            className="form-select"
                            id="tipi_alloggio"
                            name="tipi_alloggio"
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
                    </div>


                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="locali"><strong>Numero Locali</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="locali"
                            name="locali"
                            type="number"
                            min="0"
                            max="100"
                            value={postiLocali}
                            onChange={(event) => setPostiLocali(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="bagni"><strong>Numero Bagni</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="bagni"
                            name="bagni"
                            type="number"
                            min="0"
                            max="100"
                            value={postiBagno}
                            onChange={(event) => setPostiBagno(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="superficie_min"><strong>Superficie minima</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="superficie_min"
                            name="superficie_min"
                            type="number"
                            value={superficieMinima}
                            onChange={(event) => setSuperficieMinima(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="superficie_max"><strong>Superficie massima</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="superficie_max"
                            name="superficie_max"
                            type="number"
                            value={superficieMassima}
                            onChange={(event) => setSuperficieMassima(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>

                    <div className="col-12 d-flex flex-column align-items-center">
                        <label htmlFor="search"><strong>Voto medio</strong></label>
                        <input
                            className="form-control w-100 custom-width-city"
                            id="votoMedio"
                            name="votoMedio"
                            type="number"
                            min="1"
                            max="5"
                            value={votoMedio}
                            onChange={(event) => setVotoMedio(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center mt-3">
                <button className="btn btn-orange" onClick={handleSearch}>
                    Cerca
                </button>
            </div>

            {warning && <p className="text-danger text-center mt-2">{warning}</p>}

            {!hasSearched && (
                <div className="text-center mt-4">
                    <h2 className="mt-5">I risultati appariranno qui dopo la tua ricerca</h2>
                </div>
            )}
            {(hasSearched && !warning) && immobili.length > 0 ? (
                <div className="container mt-5">
                    <div className="my-3 ">Immobili trovati:<strong className="ms-2"> {count}</strong></div>
                    <div className="row g-3 row-cols-1 row-cols-lg-2 row-cols-xxl-4">
                        {immobili.map((immobile) => (
                            <AppCard
                                immobile={immobile}
                                defaultImage={defaultImage}
                                Link={Link}
                                renderStars={renderStars}
                                handleLike={handleLike}
                                apiUrl={apiUrl}
                                bagni={immobile.bagni}
                                locali={immobile.locali}
                                postiLetto={immobile.posti_letto}
                                alloggio={immobile.tipo_alloggio}
                                mq={immobile.mq}
                            />
                        )
                        )}
                    </div>
                </div>
            ) : hasSearched && immobili.length === 0 ? (
                <p className="text-center mt-4">Nessun risultato trovato</p>
            ) : null}
        </main>
    );
}

export default SearchPage;
