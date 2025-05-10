import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css"

const extraerNombreImagen = (nombreSalon) => {
  const match = nombreSalon.match(/(\d+\.\d+)/);
  return match ? match[1] : nombreSalon;
};

function DetalleSalon() {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState(null);

  useEffect(() => {
    axios.get(`https://salones-back.vercel.app/api/salones/${nombre}`)
      .then(res => setDetalles(res.data))
      .catch(err => console.error("Error al obtener detalles:", err));
  }, [nombre]);

  if (!detalles) {
    return <div className="p-8 text-center text-lg">Cargando información...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Detalles del salón {detalles["Salón"]}</h2>
            <ul className="space-y-2">
              {Object.entries(detalles).map(([clave, valor]) => (
                clave !== "_id" && (
                  <li key={clave}>
                    <span className="font-semibold">{clave}:</span> {valor}
                  </li>
                )
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">Imagen del salón</h3>
            <img
              src={`https://econo2-almendros.s3.amazonaws.com/${extraerNombreImagen(detalles["Salón"])}.jpg`}
              alt={`Salón ${detalles["Salón"]}`}
              className="w-full max-w-md rounded-lg border border-gray-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default DetalleSalon;
