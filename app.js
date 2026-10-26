"use strict";

/**
 * Activa o desactiva los mensajes informativos de depuración
 * @type {boolean}
 */
const _DEBUGMODE = true;

/**
 * Objeto encargado de gestionar los mensajes de consola
 * @type {Object}
 */
const miLogger = {

    /**
     * Muestra un mensaje informativo si el modo debug está activo
     * @param {string} mensaje - Mensaje que se mostrará en consola
     * @returns {void} No devuelve ningún valor
     */
    info: (mensaje) => {
        if (_DEBUGMODE) {
            console.log(`[INFO] ${mensaje}`);
        }
    },

    /**
     * Muestra un mensaje de error independientemente del modo debug
     * @param {string} mensaje - Descripción del error detectado
     * @returns {void} No devuelve ningún valor
     */
    error: (mensaje) => {
        console.error(`[ERROR] ${mensaje}`);
    }
};

/**
 * Cantidad de recursos disponibles para atender emergencias
 * Se reduce en una unidad por cada incidente atendido
 * @type {number}
 */
let recursosDisponibles = 3;

/**
 * Representa un incidente recibido por la central de emergencias
 * @typedef {Object} Incidente
 * @property {number} id - Identificador único del incidente
 * @property {string} descripcion - Descripción de la emergencia
 * @property {number} gravedad - Nivel de gravedad entre 1 y 5
 * @property {boolean} resuelta - Indica si el incidente está resuelto
 */

/**
 * Lote de incidentes pendientes de procesamiento
 * @type {Incidente[]}
 */
const loteIncidentes = [
    { id: 101, descripcion: "Gato atrapado en un árbol", gravedad: 1, resuelta: false },
    { id: 102, descripcion: "Falsa alarma de humo en local", gravedad: 2, resuelta: true },
    { id: 103, descripcion: "Incendio estructural en bloque de viviendas", gravedad: 5, resuelta: false },
    { id: 104, descripcion: "Contenedor ardiendo en la vía pública", gravedad: 3, resuelta: false },
    { id: 105, descripcion: "Inundación leve de un sótano", gravedad: 2, resuelta: true },
    { id: 106, descripcion: "Accidente de tráfico múltiple en la A-4", gravedad: 5, resuelta: false },
    { id: 107, descripcion: "Rescate en ascensor bloqueado", gravedad: 2, resuelta: false }
];

// Estado inicial del simulador
miLogger.info(`Sistema Eme-JS iniciado`);
miLogger.info(`Incidentes recibidos: ${loteIncidentes.length}`);
miLogger.info(`Recursos disponibles: ${recursosDisponibles}`);

// Procesamiento del lote de incidentes
for (let i = 0; i < loteIncidentes.length; i++) {

    /** @type {Incidente} */
    const incidente = loteIncidentes[i];

    // Omitir los incidentes que ya están resueltos
    if (incidente.resuelta === true) {
        miLogger.info(`Incidente ${incidente.id} ya resuelto, se omite`);
        continue;
    }

    // Detener el procesamiento si no quedan recursos
    if (recursosDisponibles <= 0) {
        miLogger.error(`No hay recursos disponibles para atender el incidente ${incidente.id}`);
        break;
    }

    // Convertir la gravedad a tipo numérico
    incidente.gravedad = Number(incidente.gravedad);

    // Validar la gravedad
    if (Number.isNaN(incidente.gravedad) || incidente.gravedad < 1 || incidente.gravedad > 5) {
       
        if (_DEBUGMODE) {
            debugger;
        }

        miLogger.error(`Incidente ${incidente.id} tiene una gravedad inválida: ${incidente.gravedad}`);
        
        continue;
    }

    /**
     * Prioridad asignada según la gravedad del incidente
     * @type {string|undefined}
     */
    let prioridad;

    // Clasificación de la prioridad
    if (incidente.gravedad === 5) {
        prioridad = "Crítica";
    }
    else if (incidente.gravedad === 4) {
        prioridad = "Alta";
    } else if (incidente.gravedad >= 2) {
        prioridad = "Media";
    } else if (incidente.gravedad === 1) {
        prioridad = "Baja";
    }

    // Consumir un recurso al atender la emergencia
    recursosDisponibles--;

    // Mostrar el estado del incidente y los recursos restantes
    miLogger.info(`Atendiendo incidente ${incidente.id}`);
    miLogger.info(`Prioridad: ${prioridad}`);
    miLogger.info(`Recursos disponibles tras atender el incidente ${incidente.id}: ${recursosDisponibles}`);
}