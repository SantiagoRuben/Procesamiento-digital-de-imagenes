/* Santiago Martinez Ruben Emmanuel 
* Codigos del tercer parcial */

// Variablas que apuntan a la configuracion para la segmentacion 
var divTrackbar;
var trackbar;
var infoTrackbar; 
var divPixel;
var checkbox;
//trackbars para los colores
var trackbarRGB = Array(3);
var infoTrackbarRGB = Array(3); 
//Termina configuracion de la segmentacion 

//Variables para la camara
var video;
var capturarIamgen; ////variable para limpiar el intervalo de ejecucion (pausar o finalizar la impresion de la camara)
var stream;
//terminan las variables de la camara

/*funcion para la configuracion de la  segmentacion
*tipo =formula utilizada para la segmentacion  (1:euclidiana,2:cuadraticaa,3:mahalanobis)
* tiempo = Si es en tiempo real o una imagen estatica (1:imagen estatica, 2:imagen en tiempo real)
*numBarras = numero de barras extras para los colores RGB*/
function segmentacionConfig(tipo,tiempo,numBarras){
    limpiarResultado();
    var mensaje = numBarras==0? "Es necesario elegir el color 1, ya que a partir de este tono se realizara la segmentacion.\<br/>":"Para elegir el color se debe de mover las barras con las letras R G B.\<br/>";
    notas.innerHTML = mensaje +
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
    //crear el div que contendra las barras del umbral y de los colores RGB
    var divContenedor = document.createElement("div");
    divContenedor.style.width = "80%";
    divTrackbar.appendChild(divContenedor); 
    //crear el div del umbral
    var divContenedorUmbral = document.createElement("div");
    divContenedorUmbral.className = "slidecontainer";
    divContenedor.appendChild(divContenedorUmbral); 
    //trackbar
    trackbar = document.createElement("input");
    trackbar.type = "range";
    trackbar.min = 0;
    trackbar.max = 150;
    trackbar.value = 10;
    trackbar.className = "slider";
    divContenedorUmbral.appendChild(trackbar);
    trackbar.oninput = function(){segmentacion(tipo,tiempo,numBarras)}
    //texto
    infoTrackbar = document.createElement("p");
    infoTrackbar.className = "tam";
    infoTrackbar.style.fontSize = "18px";   
    infoTrackbar.innerHTML = "Umbral: " + trackbar.value;
    divContenedorUmbral.appendChild(infoTrackbar);
    //crear los div individuales de los color RGB
    for(var i=0; i<numBarras; i++){
        var color = i==0? "R":(i==1? "G":"B");
        var div = document.createElement("div");
        div.className = "slidecontainer";
        divContenedor.appendChild(div); 
        //trackbar
        trackbarRGB[i] = document.createElement("input");
        trackbarRGB[i].type = "range";
        trackbarRGB[i].min = 0;
        trackbarRGB[i].max = 255;
        trackbarRGB[i].value = 0;
        trackbarRGB[i].className = "slider";
        div.appendChild(trackbarRGB[i]);
        trackbarRGB[i].oninput = function(){segmentacion(tipo,tiempo,numBarras)}
        //texto
        infoTrackbarRGB[i] = document.createElement("p");
        infoTrackbarRGB[i].className = "tam";
        infoTrackbarRGB[i].style.fontSize = "18px";   
        infoTrackbarRGB[i].innerHTML = color + ": " + trackbarRGB[i].value;
        div.appendChild(infoTrackbarRGB[i]);
    }
    
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
    checkbox.addEventListener('click', function(){segmentacion(tipo,tiempo,numBarras)});
    divTrackbar.appendChild(checkbox); 

    //Si el tipo es 3 entonces se debe mostrar la imagen para hacer la seleccion de los pixeles para la segmetnacion
    if(tipo==3){
        notas.innerHTML = "Seleccionar una area de color similar en la imagen de abajo, sobre esa area se trabajara la segmentación.\<br/>" +
                        "La barra de desplzamiento que se muestra indica que tan cercano debe de ser el color de la imagen al color elegido para que se tome en cuenta al mometo de segmetnar.\<br/>"+
                        "Al marcar el checkbox, indica que la imagen se mostrara en escala de grises y se resalta el color seleccionado";
        // en este efecto la imagen 4 sera la original ya que la funcion gris() trabaja sobre las variables pixeles y numPixeles y estas estan apuntando a la direccionde la imagen3
        image4 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );//
        mostrarImagen(canvas3,context3,image4);
        banSeleccionZona = 1;
        tipoSeleccion = 2;
        //se cambia la clase para tener mayor control al momento de normalizar la posicion del mouse
        canvas3.className = "zonaSeleccion";
        canvas3.style.setProperty("--ancho", '650px');
        canvas3.style.setProperty("--alto", '350px');
        canvas3.style.setProperty("--margen-izquierdo", '10px');
        canvas4.className = "zonaSeleccion";
    }

    // Si el tiempo es 2, crear la configuracion necesaria para la obtencion de la camara
    if(tiempo==2){
        initCam();
        video = document.createElement("video");
        video.id="video"; 
        video.playsInline = true;   
        video.autoplay = true;    
        //configuracion.appendChild(video);
        capturarIamgen = setInterval(function() {mostrarCamara(tipo)},2,numBarras);
    }
}

/*funcion para la  segmentacion de las imagenes
*tipo =formula utilizada para la segmentacion 
tiempo = Si es en tiempo real o imagen estatica
color= la forma de obtener el color por selector o por barras*/
function segmentacion(tipo,tiempo,color){
    //obtener el color
    var R,B,G;
    if(color==0){
        R = R1;
        G = G1;
        B = B1;
    }else{
        R = Number(trackbarRGB[0].value);
        G = Number(trackbarRGB[1].value);
        B = Number(trackbarRGB[2].value);
        for (var i=0; i<3;i++){
            var color = i==0? "R":(i==1? "G":"B");
            infoTrackbarRGB[i].innerHTML = color + ": " + trackbarRGB[i].value;
        }
        mostrarColor(R,G,B);
    }
    var algortimo = tipo == 1 ? "Euclidiana": (tipo == 2 ? "Cuadratica":"Mahalanobis");
    console.time("Segmentacion " + algortimo);
    //leer la imagen
    //si tiempo es igual a 1 entonces es una imagen estatica
    if(tiempo == 1){
        image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
        image4 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    }else{//imagen en tiempo real
        image3 = context3.getImageData( 0, 0, canvas3.width, canvas3.height );
        image4 = context3.getImageData( 0, 0, canvas3.width, canvas3.height );
    }

    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    var pixelesOriginales = image4.data; // en este efecto la imagen 4 sera la original ya que la funcion gris() trabaja sobre las variables pixeles y numPixeles y estas estan apuntando a la direccionde la imagen3

    //comprobar el checkbox, si esta activo volvemos la imagen a escala de grises
    if(checkbox.checked){
        gris();
    }
    var umbral = Number(trackbar.value);
    infoTrackbar.innerHTML = "Umbral: " + trackbar.value;
    var diferencia =100; // el numero que se comparara con el umbral para saber si se pone en blanco o no (se realiza la segmentacion)
    for (var i = 0; i < numPixeles; i++){ 
        if(tipo == 1){
            diferencia = Math.abs(R -pixelesOriginales[i*4]) + Math.abs(G -pixelesOriginales[i*4+1]) + Math.abs(B -pixelesOriginales[i*4+2]);
        }else if(tipo ==2){
            diferencia = Math.pow(R -pixelesOriginales[i*4],2) + Math.pow(G -pixelesOriginales[i*4+1],2) + Math.pow(B -pixelesOriginales[i*4+2],2);
            diferencia = Math.sqrt(diferencia);
        }else if(tipo==3){
            // Se debe de calcular la diferencia que hay utilizando la formula correspondiente
        }

        //comprobar en que parte del umbral esta la diferencia
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
    
    if(tipo!=3 && tiempo==1){
        mostrarImagen(canvas3,context3,image3);
    }else{
        mostrarImagen(canvas4,context4,image3);
    }
    console.timeEnd("Segmentacion " + algortimo);
}

/** Funcion para imprimir la imagen de la camara de forma normal*/
function mostrarCamara(tipo){
    //poner la imagen en el canvas 
    canvas3.width = 650;
    canvas3.height = 350;
    context3.drawImage(video, 0, 0, 650, 350);
    segmentacion(tipo,2);
}

//Funciones extras
/** Muestra el color en el div de acuerdo a los valores de la barra */
function mostrarColor(R,G,B){
    var RHex= R.toString(16);
    RHex = RHex.length==1 ? "0"+RHex:RHex;
    var GHex = G.toString(16);
    GHex = GHex.length==1 ? "0"+GHex:GHex;
    var BHex = B.toString(16);
    BHex = BHex.length==1 ? "0"+BHex:BHex;
    var hex = "#" + RHex + GHex + BHex;
    divPixel.style.backgroundColor = hex;
}

/** Funcion para mostrar una imagen en el canvas
 * se debe mandar el cnavas, contexto y la imagen a mostrar
 */
function mostrarImagen(canvas,context,image){
    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(image,0,0);
}
/** Funcion para solicitar el acceso a la camara */
// Access webcam
async function initCam() {
    const constraints = {
       audio: false,
       video: {
            width: 1280, height: 720
        }
    };
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    }catch (e) {
        alert("Es necesario dar acceso a la camara")
    }
}
/** Si el acceso a la camara fue correcto */
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}
