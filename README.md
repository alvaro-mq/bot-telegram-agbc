# bot-telegram-agbc
Bot de telegram para consultar correspondencia en la AGBC [Agencia Boliviana de Correos](https://www.correos.gob.bo/agbc/)

## Instalacion y configuracion

1. Instalacion de paquetes
```
$ npm i
```
2. copiar el archivo env.sample
```
$ cp .env.sample .env
```
3. configurar archivo .env (URL_AGBC=https://www.correos.gob.bo/ajax/ecobolCorrespondenciaPorNombreDepartamento/)
```
TELEGRAF_TOKEN=<token telegraf>
URL_AGBC=<url agbc>
```
4. iniciar el proyecto
```
$ npm run start
```

## Comandos para el bot
1. comando ayuda
```
/help
```
2. comando buscar (se puede buscar por nombre o nro de seguimiento)
```
Ej: /buscar JUAN PEREZ
```
3. comando adicionar nuevo registro a consultar automaticamente cada cierto periodo
```
Ej: /nuevo
```