# GIT 2 NEO4J

Aplicación desarrollada en NodeJS para extraer el historial de cambios de un repositorio en Git, en los registros del proyecto correspondiente, de una base de datos Neo4j. 

## Instalación

### Sistema operativo (Mac OS y Linux)

1. Clonar el repositorio con el comando ```git clone```.
2. Descargar las dependencias del proyecto con el comando ```npm install```.


#### MAC

En sistemas operativos MAC OS, es necesario descargar las herramientas de desarrollo y las herramientas de linea de comandos para esto se siguien los siguientes pasos:

* Ejecutar el comando ```xcode-select --install```

#### Windows (Parcialmente)

La aplicación utiliza comandos de Linux, que no funcionarán en un sistema operativo Windows de forma nativa. 
Para hacer que la aplicación pueda ser ejecutada en Windows, se cuentan con las siguientes alternativas:

##### Método 1 
* Ejecutar el comando ```npm start``` que ejecuta el proyecto, desde una ventana de GitBash en modo Administrador.

##### Método 2
* Comentar la linea 26 del archivo ```app.ts```.
* Realizar de forma manual, la descarga del repositorio objetivo, en la carpeta del proyecto ```public/repo```.
* Ubicando en la carpeta del repositorio descargado, ejecutar el comando: ```git --git-dir=public/repo/.git log --stat --name-only >> ../log.txt```.

### Proceso del aplicativo

1. Descargar repositorio descrito en el archivo de configuración.
2. Extraer historial de cambios del repositorio descargado.
3. Mapear el resultado del commando ``` git log```.
4. Buscar en la base de datos las clases encontradas.
5. Crear las relaciones entre commit y clases en la base de datos.
6. Crear relaciones entre los archivos existentes en un ```Commit```.

### Parametros

Los parametros de la aplicación se encuentran en el archivo ```src/config/app.config```, en donde se pueden establecer los siguientes atributos al sistema:

| Llave                  | Valor                                                                              |
|------------------------|------------------------------------------------------------------------------------|
| ```repository_url```   | Url del repositorio de git, de donde se realizará la extracción de la información. |
| ```file_log_url```     | Archivo que guarda el historial de cambios de git.                                 |
| ```file_search_path``` | Carpeta del repositorio donde se encuentra el código fuente de la aplicación.      |
| ```neo4j_project_id``` | Identificador del proyecto en la base de datos Neo4j.                              |
| ```ignore_paths```     | Directorios que se eliminarán de las rutas creadas.                                |
| Regex                  | Expresiones regulares usadas para el analisis del archivo log.                     |
| Base de datos          | Credenciales de base de datos.                                                     |

## Ejecución

1. 
2. Definir los parametros de configuración en el archivo ```src/config/app.config```.
3. Ejecutar desde una terminal, desde la carpeta raíz, el comando ```npm start```.

## Suposiciones
* Las credenciales de la base de datos son válidas.
* Se tiene acceso a una base de datos Neo4j.
* El usuario de git tiene permisos sobre el repositorio objetivo.
* El usuario tiene permisos para modificar la carpeta del proyecto.

## Licencia
[MIT](https://choosealicense.com/licenses/mit/)