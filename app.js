
"use strict";

const _DEBUGMODE = true;

const miLogger = {
    info: (mensaje) => {
        if (_DEBUGMODE) {
            console.log(`[INFO] ${mensaje}`);
        }
    },

    error: (mensaje) => {
        console.error(`[ERROR] ${mensaje}`);
    }
};

let recursosDisponibles = 3;

const loteIncidentes = [
    { id: 101, descripcion: "Gato atrapado en un árbol", gravedad: 1, resuelta: false },
    { id: 102, descripcion: "Falsa alarma de humo en local", gravedad: 2, resuelta: true },
    { id: 103, descripcion: "Incendio estructural en bloque de viviendas", gravedad: 5, resuelta: false },
    { id: 104, descripcion: "Contenedor ardiendo en la vía pública", gravedad: 3, resuelta: false },
    { id: 105, descripcion: "Inundación leve de un sótano", gravedad: 2, resuelta: true },
    { id: 106, descripcion: "Accidente de tráfico múltiple en la A-4", gravedad: 5, resuelta: false },
    { id: 107, descripcion: "Rescate en ascensor bloqueado", gravedad: 2, resuelta: false }
];

miLogger.info(`Sistema Eme-JS iniciado`);
miLogger.info(`Incidentes recibidos: ${loteIncidentes.length}`);
miLogger.info(`Recursos disponibles: ${recursosDisponibles}`);