# 🚨 Eme-JS | Simulador de Emergencias

**Proyecto:** Mini-proyecto Eme-JS  
**Módulo:** Desarrollo Web en Entorno Cliente (DWEC)  
**Equipo:** Irene Pascual Moreno y Jose Fernandez Diaz

## Descripción del proyecto

Eme-JS es un simulador de gestión de emergencias desarrollado con HTML y JavaScript. Su objetivo es procesar un lote de incidentes, clasificarlos según su gravedad y gestionar los recursos disponibles en un parque de bomberos.

El proyecto se ha desarrollado siguiendo la metodología **Pair Programming**, alternando los roles de Driver y Navigator y utilizando Git y GitHub para el control de versiones.

### Enlaces

- **Repositorio:** [GitHub - Eme-JS](https://github.com/jfzdiaz3-stack/2.8.-Mini-proyecto-Eme-JS)
- **Web desplegada:** [Github Pages](https://jfzdiaz3-stack.github.io/2.8.-Mini-proyecto-Eme-JS/)

## Funcionamiento del simulador

El programa procesa una lista de siete incidentes mediante un bucle `for`.

Durante su ejecución:

- Utilizamos `continue` para omitir los incidentes que ya están resueltos.
- Utilizamos `break` para detener el procesamiento cuando se agotan los recursos.
- Convertimos explícitamente la gravedad mediante `Number()`.
- Validamos los valores numéricos para evitar errores de coerción.
- Clasificamos las emergencias según su gravedad.
- Descontamos un recurso por cada emergencia atendida.

La clasificación de prioridades es la siguiente:

| Gravedad | Prioridad |
|----------|-----------|
| 1 | Baja |
| 2 - 3 | Media |
| 4 | Alta |
| 5 | Crítica |

Para gestionar los mensajes de consola hemos implementado un Logger personalizado, controlado mediante la constante global `_DEBUGMODE`.

También hemos documentado el código utilizando JSDoc, incluyendo las etiquetas `@type`, `@param`, `@returns`, `@typedef` y `@property`.

## Metodología Pair Programming

Durante el desarrollo hemos trabajado alternando dos roles:

- **Driver:** encargado de escribir el código y aplicar las soluciones.
- **Navigator:** encargado de revisar la lógica, detectar errores y orientar el proceso de depuración.

Los intercambios de roles se han organizado entre las fases de preparación, implementación, documentación y despliegue.

El historial de commits permite consultar qué integrante ejercía cada rol durante las diferentes fases.

---

# 📔 Diario de Depuración y Co-Evaluación

## 🔍 Captura y análisis de variables

Durante la depuración detectamos un error relacionado con la conversión de tipos en JavaScript.

Para reproducirlo, modificamos temporalmente la gravedad del incidente 101, asignándole el valor `"abc"`.

Al convertir este valor mediante `Number()`, obtuvimos `NaN`. Sin embargo, nuestra validación original no detectaba el problema, ya que las comparaciones de `NaN` con números devolvían `false`.

Como consecuencia, el incidente continuaba procesándose y su prioridad quedaba como `undefined`, pudiendo consumir un recurso incorrectamente.

Utilizamos la instrucción `debugger;` y las DevTools del navegador para inspeccionar las variables del **Scope** y la posición de ejecución en el **Call Stack**.

### Captura 1 - Inspección del Scope y Call Stack

![Código original con debugger](img/03-codigo-debugger-validacion-original.png)

Antes de corregir el error, introdujimos la instrucción `debugger;` para detener la ejecución y analizar el comportamiento del programa. La validación original únicamente comprobaba si la gravedad era menor que 1 o mayor que 5, sin contemplar los valores `NaN`.

### Captura 2 - Identificación del error

![Prioridad undefined](img/06-debugger-prioridad-undefined.png)

Avanzamos línea por línea utilizando F10 hasta llegar a la clasificación de prioridades. Observamos que ninguna condición se cumplía y que la variable `prioridad` permanecía como `undefined`.

### Captura 3 - Corrección y verificación

![Corrección del bug con continue](img/07-debugger-bug-corregido-continue.png)

Corregimos la validación utilizando `Number.isNaN()` para detectar valores no numéricos.

Después repetimos la depuración y comprobamos que el programa llegaba a `continue;`, omitiendo el incidente inválido sin descontar recursos.

Finalmente, restauramos los datos originales del lote de incidentes y mantuvimos la validación corregida.

## 👥 Experiencia de Pair Programming

Trabajar mediante Pair Programming nos ha permitido repartir las responsabilidades durante el desarrollo y revisar el código desde dos perspectivas diferentes.

Mientras una persona se concentraba en escribir las instrucciones, la otra podía prestar más atención a la lógica general y detectar posibles errores.

La depuración ha sido especialmente útil para comprender cómo JavaScript gestiona los tipos de datos y cómo podemos identificar problemas utilizando las herramientas del navegador.

El intercambio de roles también nos ha permitido practicar tanto la implementación como la revisión del código.

**Valoración de Irene:** El Pair Programming ha sido una experiencia bastante positiva para mí. Aunque trabajar en pareja puede resultarme un poco desafiante, esta actividad me ha empujado a salir de mi zona de confort y practicar mis habilidades de comunicación de una forma muy satisfactoria. Tener que explicar mis ideas, escuchar otras perspectivas y coordinarnos constantemente ha sido un ejercicio útil, tanto a nivel técnico como personal. Me ha gustado más de lo que esperaba, como ejercicio puntual.

**Valoración de Pepe:** La experiencia de programar en pareja ha sido positiva. El intercambio de roles entre Driver y Navigator me ha servido tanto para practicar el código como para revisarlo con mi compañera. También ha sido útil para comunicarnos mejor y explicar lo que estábamos haciendo, asegurándonos de entenderlo. En general la experiencia ha hecho que el proceso del proyecto sea menos complicado y que el resultado final sea más seguro.

---

## Automatización y despliegue CI/CD

Para automatizar la publicación del simulador hemos preparado un workflow de GitHub Actions en:

`.github/workflows/deploy.yml`

Este workflow está diseñado para ejecutarse cada vez que se integran cambios en la rama `main`.

El proceso consiste en:

1. Obtener los archivos del repositorio.
2. Configurar GitHub Pages.
3. Preparar los archivos de la web.
4. Publicar automáticamente la aplicación.

De esta forma, las futuras actualizaciones de `main` podrán reflejarse en la web publicada sin necesidad de realizar el despliegue manualmente.

## Tecnologías usadas

- HTML5
- JavaScript (ES6)
- JSDoc
- Chrome DevTools
- Git y GitHub
- GitHub Actions
- GitHub Pages

---

**Desarrollado por Irene Pascual Moreno y Jose Fernandez Diaz.**