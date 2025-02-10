import axios from "axios";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage() {
    const [immobili, setImmobili] = useState([]);

    useEffect(() => {
        getImmobili();
    }, []);

    const getImmobili = () => {
        axios.get(`${apiUrl}/immobili`)
            .then((resp) => {
                setImmobili(resp.data.results);
            });

    }

    return (
        <>
            <h1>HomePage</h1>
            <div className="container d-flex">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6">
                    {immobili &&
                        immobili.map((immobile) => {
                            return (
                                    <div  key={immobile.id}>
                                        <div  className="card col my-3 p-0">
                                            <div className="card-header">
                                                <h2>
                                                    {immobile.titolo_descrittivo}
                                                </h2>
                                            </div>
                                            <div className="card-body">
                                                {immobile.descrizione}
                                            </div>

                                        </div>
                                    </div>

                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default HomePage;