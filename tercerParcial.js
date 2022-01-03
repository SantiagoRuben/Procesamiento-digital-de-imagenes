/* Santiago Martinez Ruben Emmanuel 
* Codigos del tercer parcial */

// Variablas que apuntan a la configuracion para la segmentacion 
var divTrackbar;
var trackbar;
var infoTrackbar; 
var divPixel;
var checkbox;
//Termina configuracion de la segmentacion 

/*funcion para la configuracion de la  segmentacion
*tipo =formula utilizada para la segmentacion */
function segmentacionConfig(tipo){
    limpiarResultado();
    notas.innerHTML = "Es necesario elegir el color 1, ya que a partir de este tono se realizara la segmentacion.\<br/>" +
                        "La barra de desplzamiento que se muestra indica que tan cercano debe de ser el color de la imagen al color elegido para que se tome en cuenta al mometo de segmetnar.\<br/>"+
                        "Al marcar el checkbox, indica que la imagen se mostrara en escala de grises y se resalta el color seleccionado";
    //Crear un div que muestre el color actual al que se esta comparando
    divPixel =document.createElement("div");
    divPixel.className = "tam";
    divPixel.style.backgroundColor = colorHexa;
    divPixel.style.marginTop = "20px";
    configuracion.appendChild(divPixel); 
    // Crear la estructura para la barra de desplzamiento para controlar el umbral
    //div
    divTrackbar = document.createElement("div");
    divTrackbar.className = "slidecontainer";
    divTrackbar.id = "divSegmentacion";
    configuracion.appendChild(divTrackbar); 
    //trackbar
    trackbar = document.createElement("input");
    trackbar.type = "range";
    trackbar.min = 0;
    trackbar.max = 150;
    trackbar.value = 0;
    trackbar.className = "slider";
    divTrackbar.appendChild(trackbar);
    trackbar.oninput = function(){segmentacion(tipo)}
    //texto
    infoTrackbar = document.createElement("p");
    infoTrackbar.className = "tam";
    infoTrackbar.style.fontSize = "18px";   
    infoTrackbar.innerHTML = "Umbral: " + trackbar.value;
    divTrackbar.appendChild(infoTrackbar);
    var texto = document.createElement("p");
    texto.style.fontSize = "18px";
    texto.style.marginLeft = "30px";   
    texto.innerHTML = "Color ? ";
    divTrackbar.appendChild(texto);
    //crear un checkbox
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginTop = "23px";
    checkbox.style.marginLeft = "5px"; 
    checkbox.addEventListener('click', function(){segmentacion(tipo)});
    divTrackbar.appendChild(checkbox); 
}

/*funcion para la  segmentacion de las imagenes
*tipo =formula utilizada para la segmentacion */
function segmentacion(tipo){
    //leer la imagen
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    image4 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    var pixelesOriginales = image4.data; // en este efecto la imagen 4 sera la original ya que la funcion gris() trabaja sobre la imagen 3

    //comprobar el checkbox, si esta activo volvemos la imagen a escala de grises
    if(checkbox.checked){
        gris();
    }
    var umbral = Number(trackbar.value);
    infoTrackbar.innerHTML = "Umbral: " + trackbar.value;
    var diferencia; // el numero que se comparara con el umbral para saber si se pone en blanco o no (se realiza la segmentacion)
    for (var i = 0; i < numPixeles; i++){ 
        if(tipo == 1){
            diferencia = Math.abs(R1 -pixelesOriginales[i*4]) + Math.abs(G1 -pixelesOriginales[i*4+1]) + Math.abs(B1 -pixelesOriginales[i*4+2]);
        }else if(tipo ==2){
            diferencia = Math.pow(R1 -pixelesOriginales[i*4],2) + Math.pow(G1 -pixelesOriginales[i*4+1],2) + Math.pow(B1 -pixelesOriginales[i*4+2],2);
            diferencia = Math.sqrt(diferencia);
        }

        //comprobas en que parte del umbral esta la diferencia
        if(diferencia > umbral){
            if(!checkbox.checked){
                pixeles[i*4] = 0;
                pixeles [i*4+1] = 0;
                pixeles[i*4+2] = 0;
            }
        }else{
            if(!checkbox.checked){
                pixeles[i*4] = 255;
                pixeles [i*4+1] = 255;
                pixeles[i*4+2] = 255;
            }else{
                pixeles[i*4] = pixelesOriginales[i*4];
                pixeles [i*4+1] = pixelesOriginales[i*4+1];
                pixeles[i*4+2] = pixelesOriginales[i*4+2];
            }
        } 
    }
    //mostrar la imagen
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}

