import { useState } from "react";

function ReviewModal({ onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recensione, setRecensione] = useState("");
  const [voto, setvoto] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Funzione per aprire/chiudere il modale
  const toggleModal = () => setIsOpen(!isOpen);

  // Funzione per inviare la recensione
  const handleSubmit = (e) => {
    e.preventDefault();
    if (voto === 0 || recensione.trim() === "") {
      alert("Devi inserire un voto e una recensione.");
      return;
    }
    onSubmit({ email, username, voto, recensione });
    setEmail("");
    setUsername("");
    setrecensione("");
    setvoto(0);
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
            <h3>Scrivi una recensione</h3>
            <form onSubmit={handleSubmit}>
              <div className="email">
                <label htmlFor="email">Email:</label>
                <input type="email" />
              </div>

              <div className="username">
                <label htmlFor="username">Username:</label>
                <input type="username" />
              </div>

              <div className="voto">
                <label htmlFor="voto">Voto:</label>
                <select
                  id="voto"
                  value={voto}
                  onChange={(e) => setvoto(Number(e.target.value))}
                  required
                >
                  <option value={0}>Seleziona un voto</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
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
