// ==UserScript==
// @name         Descifrador 1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Laboratorio 4 Criptografía UDP 2023-2
// @author       Pablo Castro
// @match        https://cripto.tiiny.site/
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variable global para almacenar la clave de descifrado
    let claveGlobal = "";

    //Parte 1
    // Función que hace "match" si encuentra una mayúscula y la concatena
    function extraerContraseña(texto) {
        return texto.match(/[A-Z]/g).join('');
    }

    // Buscar el párrafo en la página y extraer las mayúsculas para formar la clave
    function buscarYMostrarContraseña() {
        let parrafo = document.querySelector("p");
        if (parrafo) {
            claveGlobal = extraerContraseña(parrafo.innerText || parrafo.textContent);
            console.log("La contraseña encontrada es: " + claveGlobal);
        } else {
            console.log("No se encontró el párrafo en la página.");
        }
    }
    //Parte 2
    // Función para contar la cantidad de mensajes cifrados
    function analizarMensajesCifrados() {
        let divs = document.querySelectorAll("div[id]");
        let contador = 0;
        divs.forEach(div => {
            if (div.id) {
                contador++;
            }
        });
        console.log("Los mensajes cifrados son: " + contador);
    }
    //Parte 3.1
    // Función para descifrar un mensaje con 3DES
    function descifrarMensaje3DES(mensajeCifradoBase64, clave) {
        let claveHex = CryptoJS.enc.Utf8.parse(clave);
        let mensajeDescifrado = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(mensajeCifradoBase64)
        }, claveHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return mensajeDescifrado.toString(CryptoJS.enc.Utf8);
    }
    //Funcion para imprimir mensajes en la pagina (parte 3.2)
    function imprimirMensajesEnPagina(mensajeDescifrado) {
        let div = document.createElement('div');
        div.textContent = `${mensajeDescifrado}`;
        document.body.appendChild(div);
    }

    //Parte 3.2
    // Función para descifrar todos los mensajes cifrados en la página
    // Tambien muestra los mensajes en la página
    function descifrarTodosLosMensajes() {
        let divs = document.querySelectorAll("div[id]");
        divs.forEach(div => {
            let mensajeCifradoBase64 = div.id;
            if (mensajeCifradoBase64) {
                let mensajeDescifrado = descifrarMensaje3DES(mensajeCifradoBase64, claveGlobal);
                console.log("Mensaje descifrado: " + mensajeDescifrado);
                imprimirMensajesEnPagina(mensajeDescifrado);
            }
        });
    }
    window.addEventListener('load', () => {
        buscarYMostrarContraseña();
        analizarMensajesCifrados();
        descifrarTodosLosMensajes();
    });
})();