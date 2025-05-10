import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [salones, setSalones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://salones-back.vercel.app/api/salones")
      .then(res => setSalones(res.data))
      .catch(err => console.error("Error al obtener salones:", err));
  }, []);

  const enviarPregunta = async () => {
    if (!mensaje.trim()) return;

    const preguntaUsuario = mensaje;
    setMensaje("");

    setHistorial((prev) => [...prev, { autor: "usuario", texto: preguntaUsuario }]);

    try {
      const res = await axios.post("https://salones-back.vercel.app/api/chat", { message: preguntaUsuario });
      const respuestaIA = res.data.reply;
      setHistorial((prev) => [...prev, { autor: "ia", texto: respuestaIA }]);
    } catch (err) {
      console.error("Error en el chat:", err);
      setHistorial((prev) => [...prev, { autor: "ia", texto: "Hubo un error al procesar tu pregunta." }]);
    }
  };

  const handleSeleccion = (e) => {
    const nombreSalon = e.target.value;
    navigate(`/salon/${encodeURIComponent(nombreSalon)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Selecciona un salón</h1>

        <select
          onChange={handleSeleccion}
          defaultValue=""
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="" disabled>-- Selecciona --</option>
          {salones.map((s, idx) => (
            <option key={idx} value={s["Salón"]}>
              {s["Salón"]}
            </option>
          ))}
        </select>

        <div>
          <h3 className="text-lg font-semibold mb-2">¿Tienes una pregunta sobre los salones?</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviarPregunta();
              }}
              placeholder="Ej: ¿Qué salón tiene más capacidad?"
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={enviarPregunta}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
            >
              Preguntar
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <strong>Historial del Chat:</strong>
          <div className="mt-2 space-y-2">
            {historial.map((item, index) => (
              <div key={index}>
                <span className="font-semibold">{item.autor === "usuario" ? "Tú" : "ChatGPT"}:</span> {item.texto}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
