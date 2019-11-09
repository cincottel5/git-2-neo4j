# GIT 2 NEO4J

El proposito de este aplicativo, es extraer el historial de cambios de un repositorio de Git, y alimentar una base de datos Neo4j con el acoplamiento lógico.

## Proceso del aplicativo

1. Descargar repositorio
2. Mapear el resultado del commando ``` git log```
3. Buscar en la base de datos las clases encontradas.
4. Crear las relaciones entre commit y clases en la base de datos

## Parametros

Los parametros de la aplicación se encuentran en el archivo ```src/config/app.config```, en donde se pueden establecer los siguientes atributos al sistema:

| Llave                  | Valor                                                                              |
|------------------------|------------------------------------------------------------------------------------|
| ```repository_url```   | Url del repositorio de git, de donde se realizará la extracción de la información. |
| ```file_log_url```     | Archivo que guarda el historial de cambios de git.                                 |
| ```file_search_path``` | Carpeta del repositorio donde se encuentra el código fuente de la aplicación.      |
| ```neo4j_project_id``` | Identificador del proyecto en la base de datos Neo4j.                              |
| ```ignore_paths```     | Directorios que se eliminaran de las rutas creadas.                                |
| Regex                  | Expresiones regulares usadas para el analisis del archivo log.                     |
| Base de datos          | Credenciales de base de datos.                                                     |

## Ejecución

1. Descargar la aplicación.
2. Importar las librerias con el comando ```npm install```.
3. Definir los parametros de configuración en el archivo ```src/config/app.config```.
4. Ejecutar el comando ```npm start``` desde la carpeta raíz.