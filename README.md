# Comando para correr el servidor de deno:

-> deno run --allow-net --watch --unstable --allow-read app.ts

# Comando en CMD para hacer un post (esto es independiente de este proyecto, solo para que no se me olvide)

-> curl -X POST [Appi url]
ejemplo: curl -X POST http://localhost:8000/counter

# Conseguir la data del usuario que ingreso a la app

-> https://geolocation.microlink.io/

_Ejemplo de codigo:_
`
const res = await fetch("https://geolocation.microlink.io/");
const json = await res.json();
const {
city: { name: city },
country: { name: country, flag },
} = json;

`

_Recuerda que Deno es una alternativa a NODE js y Hono a Express js_
