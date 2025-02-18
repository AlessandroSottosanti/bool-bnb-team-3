import React, { useState } from "react";

function SendEmail() {
    const initialEmailData = {
        name: "",
        surname: "",
        email: "",
        phone: "",
        subject: "",
        text: "",
    }

    const [emailData, setEmailData] = useState(initialEmailData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Funzione per aggiornare lo stato dei campi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData({ ...emailData, [name]: value });
        console.log(emailData);

    };


    // Funzione per inviare la mail
    const sendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("Invio in corso...");

        try {
            const response = await fetch("http://localhost:3000/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailData),
            });

            const data = await response.json();

            if (response.status === 200) {
                setMessage(data.message);
                setErrors({});
                setEmailData(initialEmailData);

                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                setMessage("");
                setErrors({
                    ...errors,
                    form: data.message,
                });
            }
        } catch (error) {
            console.error("Errore:", error);
            setMessage("Errore nell'invio dell'email.");
        }

        setLoading(false);
    };

    return (
        <div className="my-2">
            <p><strong> <i>Se hai qualche problema o vuoi chiedere qualsiasi tipo di informazione non esitare a contattaci compilando il form qui sotto, un nostro consulente sarà lieto di risponderti il prima possibile.</i></strong></p>
            <div id="contact-form">
                <form onSubmit={sendEmail} className="w-75">
                    <div className="col-12 d-flex justify-content-between">
                        <div className="primi mt-1 mb-3">
                            <label className="d-block">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={emailData.name}
                                onChange={handleChange}
                                placeholder="Scrivi il tuo nome"
                                required
                            />
                            {errors.name && <span className="error">{errors.name}</span>}
                        </div>
                        <div className="primi mt-1 mb-3">
                            <label className="d-block">
                                Cognome
                            </label>
                            <input
                                type="text"
                                name="surname"
                                value={emailData.surname}
                                onChange={handleChange}
                                placeholder="Scrivi il tuo cognome"
                                required
                            />
                            {errors.surname && <span className="error">{errors.surname}</span>}
                        </div>

                    </div>
                    <div className="col mt-1 mb-3">
                        <label className="d-block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={emailData.email}
                            onChange={handleChange}
                            placeholder="Scrivi la tua email"
                            required
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="col mt-1 mb-3">
                        <label className="d-block">
                            Telefono
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={emailData.phone}
                            onChange={handleChange}
                            placeholder="Scrivi il tuo numero di telefono"
                            required
                        />
                        {errors.phone && <span className="error">{errors.phone}</span>}
                    </div>
                    <div className="col mt-1 mb-3">
                        <label className="d-block">
                            Oggetto
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={emailData.subject}
                            onChange={handleChange}
                            placeholder="Inserisci l'oggetto della email"
                            required
                        />
                        {errors.subject && <span className="error">{errors.subject}</span>}
                    </div>

                    <div className="col mt-1 mb-3">
                        <label className="d-block">
                            Messaggio
                        </label>
                        <textarea
                            name="text"
                            value={emailData.text}
                            onChange={handleChange}
                            placeholder="Scrivi il tuo messaggio"
                            required
                        ></textarea>
                        {errors.text && <span className="error">{errors.text}</span>}
                    </div>

                    <button type="submit" disabled={loading} className="w-100 mt-3">
                        {loading ? "..." : "Invia Email"}
                    </button>
                </form>
                {message && <p>{message}</p>}
                {errors.form && <div className="error">{errors.form}</div>}
            </div>
        </div>
    );
};

export default SendEmail;
