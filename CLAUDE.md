@AGENTS.md

## Solo para Claude Code

Lo de arriba se importa de `AGENTS.md`, que es la fuente única y la que comparten Claude Code y Cursor. **Cualquier instrucción nueva va allí**, no en este fichero: lo que se escriba aquí es invisible para quien trabaje con Cursor.

- **Instrucciones anidadas**: las tres demos tienen su propio `CLAUDE.md` en `src/pages/demos/<puerto>/`, que se carga al leer ficheros de esas carpetas. Son la excepción a la fuente única —Cursor no los ve— y no se han duplicado a propósito: desaparecen cuando #28 unifique las demos en una sola app.
- **Memoria automática**: es local a cada máquina y no se comparte con el equipo. Si algo aprendido debe valer para todos, escríbelo en `AGENTS.md`.
