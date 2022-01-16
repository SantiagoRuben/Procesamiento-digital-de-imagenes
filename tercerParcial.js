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

//variables para operadores moroflogicos
var aplicacionesFiltro; //cuenta las vecesd que se aplico el filtro
var banSeleccionPixel = 0; // indica si se debe de escoger el pixel desde donde se debe comenzar a rellenar
//terminan variables para operadores moroflogicos

/*funcion para la configuracion de la  segmentacion
*tipo =formula utilizada para la segmentacion  (1:euclidiana,2:cuadratica,3:mahalanobis)
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
    }else{
        segmentacion(tipo,tiempo,numBarras)
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

/** Funcion para la configuracion de los operadores dilatacion, erosion y perimetro
 * tipo operador = 1:dilatacion, 2:erosion, 3:periometro
 * tipo patron= 1:matriz completa, 2:matres seccionada
*/
function operadoresMorfologicosConfig(tipoOperador,tipoPatron){
    limpiarResultado();  
    var operador = tipoOperador ==1? "Dilatacion":(tipoOperador==2? "Erosion":"Perimetro")
    texto = document.createElement('p'); 
    texto.textContent = operador + " (# impares)";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = 1;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");
     /* Crear el boton */
     nuevoBoton = document.createElement('button'); 
     nuevoBoton.type = 'button'; 
     nuevoBoton.id = "boton1";
     nuevoBoton.className = "tam";
     nuevoBoton.innerText = 'Aplicar'; 
     if(tipoOperador!=3){
         var texto = tipoOperador==1 ? "grande":"pequeña";
        notas.innerHTML = "Antes de dar clic en aplicar, es necesario que ingrese el tamaño de la matriz en el recuadro, el numero debera ser impar.\<br/>"+
        "Mientras mayor sea el numero, más "+ texto + " se hara la figura.\<br/>"+
        "Este efecto puede tardar mas que otros.";
     }else{
        notas.innerHTML = "Antes de dar clic en aplicar, es necesario que ingrese el tamaño de la matriz en el recuadro, el numero debera ser impar.\<br/>"+
        "Mientras mayor sea el numero, se notara más el perimetro.\<br/>"+
        "Este efecto puede tardar mas que otros.";
    }    
     nuevoBoton.onclick = function(){crearPatron(tipoOperador,tipoPatron)};  
     configuracion.appendChild(nuevoBoton);   
     boton1 = document.getElementById("boton1");  
}

/** Funcion que realiza la operacion de dilatacion 
 * tam = tamaño del patron
 * patron = patron para verificar la imagen
 * pixelesOriginales = pixeles de la imagen original
 * pixelesRes = pixeles de la imagen resultado
 * fila = indice de las filas
 * columna= indice de las columnas
*/
function dilatacion(tam,patron,imagenOriginal,pixelesOriginales,pixelesRes,fila,columna){
    var ban= false; // se ocupa la bandara para saber si por lo menos hay un color blanco en la region que se esta revisando 
    var pixelCambio; // pixel al que se debe poner el resultado de la operacion (pixel medio de la matriz) 
    for(var j=0; j<tam; j++){
        for(var i=0; i<tam; i++){
            // se revisa si el pixel esta activado (su intensida es 255)
            if(patron[j][i] == 1 && pixelesOriginales[((j*imagenOriginal.width*4)+(fila*imagenOriginal.width*4)) + ((i*4) + (columna*4))] == 255){            
                ban=true;
            }
            if(j==Math.floor(tam/2) && i==Math.floor(tam/2)){
                pixelCambio = (j*imagenOriginal.width*4)+(fila*imagenOriginal.width*4) + (i*4) + (columna*4);
            }
        }
    }
    if(ban== true){ // si hay por lo menos un pixel activado como vecino se debe pintar el centro
        pixelesRes[pixelCambio] = 255;
        pixelesRes[pixelCambio +1] = 255;
        pixelesRes[pixelCambio+2] = 255;
    }
}
/** Funcion que realiza la operacion de erosion 
 * tam = tamaño del patron
 * patron = patron para verificar la imagen
 * pixelesOriginales = pixeles de la imagen original
 * pixelesRes = pixeles de la imagen resultado
 * fila = indice de las filas
 * columna= indice de las columnas
*/
function erosion(tam,patron,imagenOriginal,pixelesOriginales,pixelesRes,fila,columna){
    var ban= true; // se ocupa la bandara para saber si todos los pixeles a su alrededor son 1
    var pixelCambio; // pixel al que se debe poner el resultado de la operacion (pixel medio de la matriz) 
    for(var j=0; j<tam; j++){
        for(var i=0; i<tam; i++){
            // se revisa si el pixel esta desactivado (su intensida es 0)
            if(patron[j][i] == 1 && pixelesOriginales[((j*imagenOriginal.width*4)+(fila*imagenOriginal.width*4)) + ((i*4) + (columna*4))] != 255){            
                ban=false;
            }
            if(j==Math.floor(tam/2) && i==Math.floor(tam/2)){
                pixelCambio = (j*imagenOriginal.width*4)+(fila*imagenOriginal.width*4) + (i*4) + (columna*4);
            }
        }
    }
    if(ban== true){ // si hay por lo menos un pixel activado como vecino se debe pintar el centro
        pixelesRes[pixelCambio] = 255;
        pixelesRes[pixelCambio +1] = 255;
        pixelesRes[pixelCambio+2] = 255;
    }
}

/**Funcion que muestra la confuguracion para la esqueletizacion, cerrar imagen
 * tipoOperador = 1:esqueletizacion, 2:cerrar
 * tipo patron= 1:matriz completa, 2:matres seccionada
 */
function esqueletizacionYCerrarConfig(tipoOperador,tipoPatron){
    limpiarResultado();  
    notas.innerHTML = "Para poder realizar este efecto es necesari dar clic en el boton que se muestra las veces que se requiera para que.\<br/>"+
    "la imagen resultado solo muestre el esqueleto de la figura.\<br/>"+
    "Este efecto puede tardar mas que otros.";
    aplicacionesFiltro =0;
    texto = document.createElement('p'); 
    texto.innerHTML = "Numero de veces que se aplico el filtro: " + aplicacionesFiltro;
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoBoton = document.createElement('button'); 
    nuevoBoton.type = 'button'; 
    nuevoBoton.id = "boton1";
    nuevoBoton.className = "tam";
    nuevoBoton.innerText = 'Aplicar'; 
    nuevoBoton.onclick = function(){esqueletizacionCerrar(tipoOperador,tipoPatron)}; 
    
    configuracion.appendChild(nuevoBoton);   
    boton1 = document.getElementById("boton1");  
}

/** Funcion que aplica la esqueletizacion o cerrar la iamgen, solo matriz 3x3
 * tipoOperador = 1:esqueletizacion, 2:cerrar
 * tipo patron= 1:matriz completa, 2:matres seccionada
*/
function esqueletizacionCerrar(tipoOperador,tipoPatron){
    var patron;
    aplicacionesFiltro++;
    texto.innerHTML = "Numero de veces que se aplico el filtro: " + aplicacionesFiltro;
    if(tipoPatron ==1 ){
        patron = [
            [1,1,1],
            [1,1,1],
            [1,1,1]
        ]
    }else{
        patron = [
            [0,1,0],
            [1,1,1],
            [0,1,0]
        ]
    }
    if(aplicacionesFiltro == 1){
        image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height);
    }else{
        image3 = context3.getImageData( 0, 0, canvas3.width, canvas3.height);
    }

    if(tipoOperador == 1){
        var imageResult = operadoresMorfologicos(3,patron,2,image3); 
    }else{
        var imageDilatacion = operadoresMorfologicos(3,patron,1,image3); 
        var imageResult = operadoresMorfologicos(3,patron,2,imageDilatacion); 
    }
    mostrarImagen(canvas3,context3,imageResult);

}
/** Funcion para generar el patron que se ocupara para aplicar los operadores morfologicos 
 * TipoPatron = tipo del patron, 1= matriz completa, 2= No se revisan las diagonales
 * tipoOperador = 1:dilatacion, 2:erosion
*/
function crearPatron(tipoOperador,tipoPatron){
    if(!validarDesenfocar(Number(num1.value))){// valida que el numero no sea nmulo y sea impar positivo
        return false;
    }else if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    var tam = Number(num1.value);
    // crear el patron a utilizar
    var patron = Array(tam);
    var renglon;
    for(var j = 0; j<tam;j++){
        renglon = Array(tam);
        for(var i=0; i<tam; i++){
           //Poner un 1 si el patron esta debe ser la matriz completa o "i" o "j" es igual a la mitad del tamaño del patron
           if(tipoPatron ==1 || j == Math.floor(tam/2) || i== Math.floor(tam/2) ){
               renglon[ i] = 1; 
           }else{
                renglon[+ i] = 0; 
           }
        }
       patron[j] = renglon;
    }   
    //console.log(patron);
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height);
    var imageResult = operadoresMorfologicos(tam,patron,tipoOperador,image3); 

    if(tipoOperador == 3){
        var pixeles1= image3.data;
        numPixeles = image3.width * image3.height;
        var pixeles2 = imageResult.data;
        var imagePerimetro = context1.createImageData(image3.width, image3.height); //imagen donde ira el resultado del perimetro
        imagenNegro(imagePerimetro);
        operacion(pixeles1,pixeles2,numPixeles,imagePerimetro.data,2);
        mostrarImagen(canvas3,context3,imagePerimetro);
    }else{
        mostrarImagen(canvas3,context3,imageResult);
    }
   
}


/** Funcion que raliza las operadores morfologicos
 * tam = tamaño del patron
 * patron = patron para verificar la imagen
 * imagenOriginal = imagen sobre la cual se va a trabajar
 */
function operadoresMorfologicos(tam,patron,tipoOperador,imagenOriginal){
    
    pixeles = imagenOriginal.data;
    numPixeles = imagenOriginal.width * imagenOriginal.height;
    image4 = context1.createImageData(imagenOriginal.width, imagenOriginal.height); //imagen donde ira el resultado
    imagenNegro(image4);
    var pixelesRes = image4.data;
    for( var j = 0 ; j< imagenOriginal.height; j++){
        for (var i = 0 ; i < imagenOriginal.width; i++){ 
            if((i<imagenOriginal.width-(tam -1)) || (j<imagenOriginal.height-(tam-1)) ){ // no se desborde tanto a lo alto como a lo ancho
                if(tipoOperador==1){ // si el operador es 1 significa que se debe aplicar la dilatacion
                    dilatacion(tam,patron,imagenOriginal,pixeles,pixelesRes,j,i);
                }else{ /// se debe hacer la erosion
                    erosion(tam,patron,imagenOriginal,pixeles,pixelesRes,j,i);
                }
            }
        } 
    }
    return image4;
}

/**Funcion que despliega la configuracion del relleno */
function rellenoConfig(){
    notas.innerHTML = "Seleccionar un punto de la segunda imagen sobre la que se quiera rellenar,el resultado se mostrara a la derecha.\<br>"+
    "Si no se ve la segunda iomagen porfavor desplácese hacia abajo";
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );//
    canvas3.height = image3.height;
    canvas3.width = image3.width; 
    context3.putImageData(image3,0,0);
    banSeleccionPixel = 1;

    //se cambia la clase para tener mayor control al momento de normalizar la posicion del mouse
    canvas3.className = "zonaSeleccion";
    canvas3.style.setProperty("--ancho", '650px');
    canvas3.style.setProperty("--alto", '350px');
    canvas3.style.setProperty("--margen-izquierdo", '10px');
    canvas4.className = "zonaSeleccion";
}
/** Funcion que detecta el clic para rellenar la figura 
 * event = el evento que recibio 
*/
function rellenar(event){
    if(banSeleccionPixel == 1){
        const rect = canvas3.getBoundingClientRect();
        posicionX = event.clientX - rect.left;
        posicionY = event.clientY - rect.top;
        //como la imagen se hace chica tenemos que normalizar la posicion del mouse
        var posx = Math.round((posicionX*image3.width) / 650.0);
        var posy = Math.round((posicionY*image3.height)   / 350.0);

        pixeles = image3.data;
        //SE PROCEDE A REALIZAR EL RELLENO (se puede meter a una funcion)
        var pila = Array(); //variable que contendra la pila de los pixeles
        var pixelInicial = {x:posx, y:posy}; //variable inicial del relleno
        var temp; // variable donde se guardara el pixel actual
        pila.push(pixelInicial);
        while(pila.length !=0){
            console.log(pila)
            //obtener y pintar el pixel
            temp = pila.splice(0,1);
            pixeles[temp[0].y*image3.width*4 + temp[0].x *4] = 255;
            pixeles[temp[0].y*image3.width*4 + temp[0].x *4 + 1] = 255;
            pixeles[temp[0].y*image3.width*4 + temp[0].x *4 + 2] = 255;
            //comprobar cuales pixeles vecinos necesitan ser rellenados
            if(pixeles[(temp[0].y-1)*image3.width*4 + temp[0].x *4] ==0 ){
                var pixelUp = {x:temp[0].x, y:temp[0].y-1};
                pila.push(pixelUp);
            }
            if(pixeles[(temp[0].y+1)*image3.width*4 + temp[0].x *4] ==0 ){
                var pixelDown = {x:temp[0].x, y:temp[0].y+1};
                pila.push(pixelDown);
            }
            if(pixeles[temp[0].y*image3.width*4 + (temp[0].x-1) *4] ==0 ){
                var pixelLeft = {x:temp[0].x -1, y:temp[0].y};
                pila.push(pixelLeft);
            }
            if(pixeles[temp[0].y*image3.width*4 + (temp[0].x+1) *4] ==0 ){
                var pixelRight = {x:temp[0].x+1, y:temp[0].y};
                pila.push(pixelRight);
            }
        }
        //mostrar la imagen
        canvas4.height = image3.height;
        canvas4.width = image3.width; 
        context4.putImageData(image3,0,0);
    }
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
