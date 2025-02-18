
function AppCard({ immobile, defaultImage, Link, renderStars, handleLike, apiUrl, bagni, locali, postiLetto, alloggio, mq }) {
    const imageUrl = immobile.immagini && immobile.immagini.length > 0
        ? `${apiUrl}/images/${immobile.immagini[0].nome_immagine}`
        : `${defaultImage}`;

    return (
        <div className="col my-3" key={immobile.id}>
            <Link to={`/${immobile.slug}`}>
                <div className="card h-100 d-flex flex-column">
                    {/* Immagine segnaposto */}
                    <img
                        src={imageUrl}
                        alt={immobile.titolo_descrittivo}
                        className=""
                    />
                    <div
                        className="card-header text-center d-flex align-items-center justify-content-center"
                        style={{ minHeight: "80px" }}
                    >
                        <h5 className="m-0">{immobile.titolo_descrittivo}</h5>
                    </div>

                    <div className="card-body d-flex flex-column flex-grow-1 text-center">

                        <p className="flex-grow-1">{immobile.descrizione}</p>


                        <p>{immobile.indirizzo_completo}</p>
                        <div className="row">
                            <div className="col-6"> <p>
                                <i className="fa-solid fa-up-right-and-down-left-from-center"></i> MQ:{mq}
                            </p>
                                <p>
                                    <i className="fa-solid fa-bath"></i> Bagni: {bagni}
                                </p>
                                {/* <p>
                                    <i className="fa-solid fa-house-chimney"></i>Tipo di alloggio:{alloggio}
                                </p> */}

                            </div>
                            <div className="col-6">
                                <p>
                                    <i className="fa-solid fa-door-open"></i> Locali:{locali}
                                </p>
                                <p>
                                    <i className="fa-solid fa-bed"></i> Posti letto:{postiLetto}
                                </p></div>


                        </div>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                            {renderStars(Number(immobile.voto_medio))}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                            <button className="btn me-2" onClick={(e) => handleLike(e, immobile.id)}>❤️</button>
                            <span>{immobile.heartCount}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default AppCard;