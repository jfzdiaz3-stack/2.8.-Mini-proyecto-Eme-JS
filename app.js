/**
 * Activa o desactiva los mensajes informativos de depuración y las paradas del depurador (debugger)
 * @type {boolean}
 */
const _DEBUGMODE = true;

/**
 * Cantidad de recursos (dotaciones) con la que arranca el parque
 * @type {number}
 */
const RECURSOS_INICIALES = 3;

/**
 * Gravedad a partir de la cual se lanza la alerta máxima
 * @type {number}
 */
const GRAVEDAD_MAXIMA = 5;

/**
 * Representa un incidente recibido por la central de emergencias
 * @typedef {Object} Incidente
 * @property {number} id - Identificador único del incidente
 * @property {string} descripcion - Descripción de la emergencia
 * @property {number} gravedad - Nivel de gravedad entre 1 y 5
 * @property {boolean} resuelta - Indica si el incidente ya está resuelto
 */

/**
 * Objeto encargado de gestionar los mensajes de consola
 */
const miLogger = {

    /**
     * Muestra un mensaje informativo solo si el modo debug está activo
     * @param {string} mensaje - Mensaje que se mostrará en consola
     * @returns {void}
     */
    info: (mensaje) => {
        if (_DEBUGMODE) {
            console.log(`[INFO] ${mensaje}`);
        }
    },

    /**
     * Muestra una alerta máxima (siempre visible, es una emergencia crítica)
     * @param {string} mensaje - Texto de la alerta
     * @returns {void}
     */
    alerta: (mensaje) => {
        console.warn(`🚨 [ALERTA MÁXIMA] ${mensaje}`);
    },

    /**
     * Muestra un mensaje de error independientemente del modo debug
     * @param {string} mensaje - Descripción del error detectado
     * @returns {void}
     */
    error: (mensaje) => {
        console.error(`[ERROR] ${mensaje}`);
    }
};

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

/**
 * Convierte la gravedad a número y comprueba que esté entre 1 y 5.
 * Así evitamos errores de coerción si llega como texto ("3") o con un valor raro.
 * Solo se aceptan números o textos: Number(true) daría 1 y Number(null) daría 0,
 * así que cualquier otro tipo se descarta antes de convertir.
 * @param {*} valor - Gravedad tal y como viene en el incidente
 * @returns {number|null} La gravedad como número, o null si no es válida
 */
function validarGravedad(valor) {
    if (typeof valor !== "number" && typeof valor !== "string") {
        return null;
    }

    const gravedad = Number(valor);

    if (Number.isNaN(gravedad) || !Number.isInteger(gravedad) || gravedad < 1 || gravedad > GRAVEDAD_MAXIMA) {
        return null;
    }

    return gravedad;
}

/**
 * Asigna una prioridad textual según la gravedad del incidente
 * @param {number} gravedad - Gravedad ya validada (1 a 5)
 * @returns {string} Prioridad: "Crítica", "Alta", "Media" o "Baja"
 */
function clasificarPrioridad(gravedad) {
    /** @type {string} */
    let prioridad;

    switch (gravedad) {
        case 5:
            prioridad = "Crítica";
            break;
        case 4:
            prioridad = "Alta";
            break;
        case 3:
        case 2: // Casos agrupados
            prioridad = "Media";
            break;
        default:
            prioridad = "Baja";
    }

    return prioridad;
}

/**
 * Calcula los recursos que quedan después de atender un incidente
 * @param {number} recursos - Recursos disponibles antes de atenderlo
 * @returns {number} Recursos disponibles tras consumir uno
 */
function calcularRecursos(recursos) {
    return recursos - 1;
}

/**
 * Procesa un incidente no resuelto: valida su gravedad, le asigna prioridad
 * y lanza la alerta máxima si la gravedad es 5.
 * @param {Incidente} incidente - Incidente que se va a atender
 * @returns {boolean} true si se ha atendido, false si se descarta por datos inválidos
 */
function procesarIncidente(incidente) {
    const gravedad = validarGravedad(incidente.gravedad);

    if (gravedad === null) {
        // Punto crítico: un dato corrupto se colaría en el sistema
        if (_DEBUGMODE) {
            debugger;
        }
        miLogger.error(`Incidente ${incidente.id} tiene una gravedad inválida: ${incidente.gravedad}`);
        return false;
    }

    const prioridad = clasificarPrioridad(gravedad);

    if (gravedad === GRAVEDAD_MAXIMA) {
        miLogger.alerta(`Incidente ${incidente.id}: ${incidente.descripcion}. ¡Movilizando todos los medios!`);
    }

    miLogger.info(`Atendiendo incidente ${incidente.id} (${incidente.descripcion}) · Prioridad: ${prioridad}`);
    return true;
}

/**
 * Recorre el lote de incidentes: ignora los resueltos (continue)
 * y detiene el sistema si se quedan sin recursos (break).
 * @param {Incidente[]} lote - Lista de incidentes a procesar
 * @param {number} recursosIniciales - Recursos con los que arranca el parque
 * @returns {number} Recursos que quedan al terminar
 */
function procesarLote(lote, recursosIniciales) {
    /** @type {number} */
    let recursosDisponibles = recursosIniciales;

    miLogger.info(`Sistema Eme-JS iniciado`);
    miLogger.info(`Incidentes recibidos: ${lote.length} · Recursos disponibles: ${recursosDisponibles}`);

    for (let i = 0; i < lote.length; i++) {
        /** @type {Incidente} */
        const incidente = lote[i];

        // Filtro 1: los incidentes ya resueltos se ignoran
        if (incidente.resuelta === true) {
            miLogger.info(`Incidente ${incidente.id} ya resuelto, se omite`);
            continue;
        }

        // Filtro 2: sin recursos, el sistema se detiene
        if (recursosDisponibles <= 0) {
            // Punto crítico: aquí se corta el bucle y quedan incidentes sin atender
            if (_DEBUGMODE) {
                debugger;
            }
            miLogger.error(`Sin recursos disponibles. Incidente ${incidente.id} y siguientes quedan sin atender`);
            break;
        }

        const atendido = procesarIncidente(incidente);

        if (atendido === false) {
            continue;
        }

        recursosDisponibles = calcularRecursos(recursosDisponibles);
        miLogger.info(`Recursos disponibles tras el incidente ${incidente.id}: ${recursosDisponibles}`);
    }

    miLogger.info(`Fin del procesamiento. Recursos restantes: ${recursosDisponibles}`);
    return recursosDisponibles;
}

procesarLote(loteIncidentes, RECURSOS_INICIALES);