import React from "react";

function AppCard({ immobile, defaultImage, Link, renderStars, handleLike, apiUrl, bagni, locali, postiLetto, alloggio, mq }) {
    const imageUrl = immobile.immagini && immobile.immagini.length > 0
        ? `${apiUrl}/images/${immobile.immagini[0].nome_immagine}`
        : `${defaultImage}`;

    return (
        <div className="col my-3" key={immobile.id}>
            <Link to={`/${immobile.slug}`} className="text-decoration-none">
                <div className="card-container">
                    
                    {/* Immagine */}
                    <div className="img-container">
                        <img
                            src={imageUrl}
                            alt={immobile.titolo_descrittivo}
                            className="card-img"
                        />
                        {/* Like Button */}
                        <button
                            className="like-button"
                            onClick={(e) => handleLike(e, immobile.id)}
                        >
                            <i className="fa-solid fa-heart"></i>
                        </button>
                    </div>

                    {/* Header Card */}
                    <div className="card-header-custom">
                        <h5>{immobile.titolo_descrittivo}</h5>
                    </div>

                    {/* Contenuto */}
                    <div className="card-body-custom">
                        <p className="card-address">{immobile.indirizzo_completo}</p>
                        <p className="card-description">{immobile.descrizione}</p>

                        {/* Info Immobile */}
                        <div className="card-info d-flex">
                            <div className="info-column d-flex flex-column align-items-end pe-5">
                                <p><i className="fa-solid fa-up-right-and-down-left-from-center"></i> {mq} mq</p>
                                <p><i className="fa-solid fa-bath"></i> {bagni} Bagni</p>
                            </div>
                            <div className="info-column d-flex flex-column align-items-start ps-5">
                                <p><i className="fa-solid fa-door-open"></i> {locali} Locali</p>
                                <p><i className="fa-solid fa-bed"></i> {postiLetto} Posti Letto</p>
                            </div>
                            <div className="info-column full-width d-flex flex-column align-items-center">
                                <p><i className="fa-solid fa-house-chimney"></i> {alloggio}</p>
                            </div>
                        </div>

                        {/* Stelle Voto */}
                        <div className="card-stars">
                            {renderStars(Number(immobile.voto_medio))}
                        </div>

                        {/* Likes */}
                        <div className="card-likes">
                            <span>{immobile.heartCount} ❤️</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default AppCard;
