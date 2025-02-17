import { useState } from "react";

function ReviewModal({ handleSubmit, immobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recensione, setRecensione] = useState("");
  const [voto, setVoto] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Funzione per aprire/chiudere il modale
  const toggleModal = () => setIsOpen(!isOpen);

  // Funzione per gestire l'invio della recensione
  const onSubmit = (e) => {
    e.preventDefault();
    if (voto === 0 || recensione.trim() === "" || email.trim() === "" || username.trim() === "") {
      alert("Tutti i campi sono obbligatori.");
      return;
    }

    const nuovaRecensione = {
      email,
      username,
      recensione,
      voto,
    };

    handleSubmit(nuovaRecensione); // Passa i dati al padre per gestire l'invio

    // Reset dei campi
    setEmail("");
    setUsername("");
    setRecensione("");
    setVoto(0);
    
    toggleModal(); // Chiude il modale dopo l'invio
  };

  return (
    <div>
      {/* Pulsante per aprire il modale */}
      <button onClick={toggleModal} className="open-modal-btn">
        Aggiungi una nuova recensione
      </button>

      {/* Modale */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>{immobile?.immobile?.titolo_descrittivo || "Immobile"}</h1>
            <h2>Scrivi una recensione</h2>
            <form onSubmit={onSubmit}>
              <div className="email">
                <label htmlFor="email">Email:</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="username">
                <label htmlFor="username">Username:</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="voto">
                <label htmlFor="voto">Voto:</label>
                <select
                  id="voto"
                  value={voto}
                  onChange={(e) => setVoto(Number(e.target.value))}
                  required
                >
                  <option value={0}>Seleziona un voto</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="recensione-text">
                <label htmlFor="recensione">Recensione:</label>
                <textarea
                  id="recensione"
                  value={recensione}
                  onChange={(e) => setRecensione(e.target.value)}
                  rows="4"
                  placeholder="Scrivi la tua recensione..."
                  required
                ></textarea>
              </div>

              <button type="submit">Invia Recensione</button>
              <button type="button" onClick={toggleModal} className="close-btn">
                Chiudi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewModal;
