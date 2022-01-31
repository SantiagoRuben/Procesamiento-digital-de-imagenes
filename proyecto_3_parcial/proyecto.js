/* Santiago Martinez Ruben Emmanuel */
/* Creamos variables para las imagenes a mostrar*/
var image1 = new Image();
var image2 = new Image();
/* Variables para obtener informacion de las imagenes */
var pixeles;
var numPixeles;
/* Variables para controlar las configuraciones */
var sliderUmbral = document.getElementById("rangoUmbral"); // barra para los grados del umbral
sliderUmbral.oninput =  function(){funcionUmbral()};
var infoUmbral = document.getElementById("umbral"); // numero del umbral

var sliderR = document.getElementById("rangoR"); // barra para los grados del umbral
sliderR.oninput =  function(){color()};
var infoR = document.getElementById("R"); // numero del umbral

var sliderG = document.getElementById("rangoG"); // barra para los grados del umbral
sliderG.oninput =  function(){color()};
var infoG = document.getElementById("G"); // numero del umbral

var sliderB = document.getElementById("rangoB"); // barra para los grados del umbral
sliderB.oninput =  function(){color()};
var infoB = document.getElementById("B"); // numero del umbral

var divPixel = document.getElementById("divPixel"); // Color por el que se esta segmentando
/* Obtenemos las imagenes que se suban*/
var imagen = document.getElementById('imagen1');
imagen.addEventListener('change', CargarImagen); 
/* Recuperamos los canvas del DOM */
var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext( '2d' );
var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext( '2d' );
canvas2.addEventListener("mousedown",function(e){rellenar(e)});
var banSeleccionPixel = 0;
/* Recuperamos los colores elegidos y el umbral */
var R=0,G=0,B=0, umbral=10;
// variable para saber que operodor morfologico se quiere aplicar
var tipoOperador;

//Recuperamos el resto de los componentes
var patronMatriz = document.getElementById("matriz");
var patronCruz = document.getElementById("cruz");
var tamPatron = document.getElementById("tamPatron");
var numVeces = document.getElementById("numVeces");
var boton = document.getElementById("boton");
var nota = document.getElementById("nota");
var nombreOperador = document.getElementById("nombreOperador");
/* Funcion para cargar la imagen seleccionada*/
function CargarImagen(){
    limpiarResultado();
    image1.src = window.URL.createObjectURL(imagen.files[0]);
    image1.onload = function () {
        canvas1.width = image1.width;
        canvas1.height = image1.height; 
        context1.drawImage( image1, 0, 0 );
    }
}

/** Al cargar la pagian todo debe estar desabilitado */
limpiarResultado();

/* Funcion para la actualizacion del umbral*/
function funcionUmbral(){
    umbral = Number(sliderUmbral.value);
    infoUmbral.innerText = "Umbral: " + umbral;
    segmentacion();
}

/** Funcion para cambiar el color elegido */
function color(){
    R = Number(sliderR.value);
    infoR.innerText = "R: " + R;
    G = Number(sliderG.value);
    infoG.innerText = "G: " + G;
    B = Number(sliderB.value);
    infoB.innerText = "B: " + B;
    mostrarColor(R,G,B);
    segmentacion();
}

/** Funcion para la cofiguracion de la segmentacion */
function segmentacionConfig(){
    // Habilitar y desabilitar las configuraciones necesarias
    sliderUmbral.disabled = false;
    sliderR.disabled = false;
    sliderG.disabled = false;
    sliderB.disabled = false;
    patronMatriz.disabled = true;
    patronCruz.disabled = true;
    tamPatron.disabled = true;
    numVeces.disabled = true;
    boton.disabled = true;
    boton.className = "tam";
    banSeleccionPixel = 0;

    nota.innerHTML = "Los cambios de la imagen se realizan cada que se mueve una barra, no se habilitara el boton.\<br/>" ;
    nombreOperador.innerText = "Nombre del efecto: " + "Segmentación";
    segmentacion();
}

/* Funcion que realiza la segmentacion de la imagen */
function segmentacion(){
    //Se leen las imagenes
    image2 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    var imagenResultado = context1.getImageData( 0, 0, canvas1.width, canvas1.height );

    pixeles = image2.data;
    numPixeles = image2.width * image2.height;
    var pixelesResultado = imagenResultado.data;
    var diferencia;
    for (var i = 0; i < numPixeles; i++){ 
        //calcular la diferencia
        diferencia = Math.abs(R -pixeles[i*4]) + Math.abs(G -pixeles[i*4+1]) + Math.abs(B -pixeles[i*4+2]);

        //comprobar con el umbral
        if(diferencia > umbral){
            pixelesResultado[i*4] = 255;
            pixelesResultado [i*4+1] = 255;
            pixelesResultado[i*4+2] = 255;
        }else{
            pixelesResultado[i*4] = 0;
            pixelesResultado [i*4+1] = 0;
            pixelesResultado[i*4+2] = 0;
        }
    }
    mostrarImagen(imagenResultado)
}

/** Funcion para la configuracion de los operadores morfologicos 
 * tipo= 1:dilatacion, 2:erosion, 3:perimetro, 4:esquelitizacion, 5:limpieza
*/
function operadoresMorfologicosConfig(tipo){
    // Habilitar y desabilitar las configuraciones necesarias
    sliderUmbral.disabled = true;
    sliderR.disabled = true;
    sliderG.disabled = true;
    sliderB.disabled = true;
    patronMatriz.disabled = false;
    patronCruz.disabled = false;
    tamPatron.disabled = false;
    numVeces.disabled = true;
    boton.disabled = false;
    boton.className = "boton";
    banSeleccionPixel = 0;

    var texto = "Nombre del efecto: ";
    var explicacion = "";
    if(tipo == 1){
        nombreOperador.innerText = texto + "Dilatación";
    }
    if(tipo == 2){
        nombreOperador.innerText = texto + "Erosión";
    }
    if(tipo == 3){
        nombreOperador.innerText = texto + "Perimetro";
    }
    if(tipo == 4){
        numVeces.disabled = false;
        nombreOperador.innerText = texto + "Cierre";
        explicacion = "Tambien es necesario especificar el numero de veces que se ejecutara el efecto";
    }
    if(tipo == 5){
        numVeces.disabled = false;
        nombreOperador.innerText = texto + "Limpieza";
        explicacion = "\<br/>Tambien es necesario especificar el numero de veces que se ejecutara el efecto";
    }
    if(tipo == 6){
        numVeces.disabled = false;
        nombreOperador.innerText = texto + "Esqueletización";
        explicacion = "\<br/>Tambien es necesario especificar el numero de veces que se ejecutara el efecto";
    }
    nota.innerHTML = "Antes de presionar el boton de aplicar es necesario seleccionar e introducir el tamaño del patron a usar. " +explicacion+ "\<br/>" +
    "El tamaño debe de ser un numero positivo impar";
    tipoOperador = tipo;
}

/* Funcion para la configuracion del operador mofilogico relleno */
function rellenoConfig(){
    // Habilitar y desabilitar las configuraciones necesarias
    sliderUmbral.disabled = true;
    sliderR.disabled = true;
    sliderG.disabled = true;
    sliderB.disabled = true;
    patronMatriz.disabled = true;
    patronCruz.disabled = true;
    tamPatron.disabled = true;
    numVeces.disabled = true;
    boton.disabled = true;
    boton.className = "tam";
    numVeces.value = null;
    nota.innerHTML = "Seleccionar un punto de la imagen (B/N) sobre la que se quiera rellenar.\<br>";
    nombreOperador.innerText = "Nombre del efecto: " + "Rellenar";
    banSeleccionPixel = 1;
}
/* Funcion que manda a llamar al operador mofologico correspondiente */
function aplicarFiltro(){
    var tam = Number(tamPatron.value);
    if(!ValidaTamanio(tam)){ // Comprobar que el tamaño de la matriz sea valido
        alert("El tamaño de la matriz debe ser impar positivo");
        return false;
    }
    var tipoPatron = validarPatron()
    if(tipoPatron == 0){ // comprobar que se haya seleccionado un patron
        alert("Debes de seleccionar un patron");
        return false;
    }
    var numVecesAux = Number(numVeces.value);
    var patron = crearPatron(tam,tipoPatron);
    image2 = context2.getImageData( 0, 0, canvas2.width, canvas2.height );
    if(tipoOperador == 1 || tipoOperador ==2){//dilatacion y erosion
       var imagenResultado = operadoresMorfologicos(tam,patron,tipoOperador,image2);
    }else if(tipoOperador == 3){ // perimetro
        var pixeles1 = image2.data; // datos de la imagen principal
        var imagenErosion= operadoresMorfologicos(tam,patron,2,image2); // crear la imagen con el efecto erosion
        var pixeles2 = imagenErosion.data
        var imagenResultado = context1.createImageData(image2.width, image2.height); //imagen donde ira el resultado del perimetro
        imagenNegro(imagenResultado);
        restaImagenes(pixeles1,pixeles2,imagenResultado.data);

    }else if(tipoOperador == 4){ // cierre
        if(!validarNumVeces(numVecesAux)){
            return false;
        }
        while(numVecesAux > 0){
            var imagenDilatacion= operadoresMorfologicos(tam,patron,1,image2); // se debe primero aplicar el efecto de dilatacion
            var imagenResultado = operadoresMorfologicos(tam,patron,2,imagenDilatacion); // luego se aplica la erosion
            numVecesAux = numVecesAux - 1;
        }
        
    }else if(tipoOperador ==5){ // Limpieza
        if(!validarNumVeces(numVecesAux)){
            return false;
        }
        while(numVecesAux > 0){
            var imagenErosion= operadoresMorfologicos(tam,patron,2,image2); // se debe primero aplicar el efecto de erosion
            var imagenResultado = operadoresMorfologicos(tam,patron,1,imagenErosion); // luego se aplica la erosion
            numVecesAux = numVecesAux - 1;
        }
    }else if(tipoOperador == 6){// esquelitazacion
        if(!validarNumVeces(numVecesAux)){
            return false;
        }
        while(numVecesAux > 0){
            var imagenResultado = operadoresMorfologicos(tam,patron,2,image2);
            numVecesAux = numVecesAux - 1;
        }
    }
    mostrarImagen(imagenResultado);
}

/** Funcion que crea el patron necesario */
function crearPatron(tam,tipoPatron){
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
    return patron;
}

/** Funcion que raliza las operadores morfologicos
 * tam = tamaño del patron
 * patron = patron para verificar la imagen
 * imagenOriginal = imagen sobre la cual se va a trabajar
 */
 function operadoresMorfologicos(tam,patron,tipoOperador,imagenOriginal){  
    pixeles = imagenOriginal.data;
    numPixeles = imagenOriginal.width * imagenOriginal.height;
    var imagenResultado = context1.createImageData(imagenOriginal.width, imagenOriginal.height); //imagen donde ira el resultado
    imagenNegro(imagenResultado);
    var pixelesRes = imagenResultado.data;
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
    return imagenResultado;
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

/** Funcion que detecta el clic para rellenar la figura 
 * event = el evento que recibio 
*/
function rellenar(event){
    if(banSeleccionPixel == 1){
        const rect = canvas2.getBoundingClientRect();
        var posicionX = event.clientX - rect.left;
        var posicionY = event.clientY - rect.top;
        //como la imagen se hace chica tenemos que normalizar la posicion del mouse
        var posx = Math.round((posicionX*image2.width) / 650.0);
        var posy = Math.round((posicionY*image2.height)   / 350.0);

        image2 = context2.getImageData( 0, 0, canvas1.width, canvas1.height );
        pixeles = image2.data;
        //SE PROCEDE A REALIZAR EL RELLENO (se puede meter a una funcion)
        var pila = Array(); //variable que contendra la pila de los pixeles
        var pixelInicial = {x:posx, y:posy}; //variable inicial del relleno
        var temp; // variable donde se guardara el pixel actual
        pila.push(pixelInicial);
        while(pila.length !=0){
            console.log(pila)
            //obtener y pintar el pixel
            temp = pila.splice(0,1);
            pixeles[temp[0].y*image2.width*4 + temp[0].x *4] = 255;
            pixeles[temp[0].y*image2.width*4 + temp[0].x *4 + 1] = 255;
            pixeles[temp[0].y*image2.width*4 + temp[0].x *4 + 2] = 255;
            //comprobar cuales pixeles vecinos necesitan ser rellenados
            if(pixeles[(temp[0].y-1)*image2.width*4 + temp[0].x *4] ==0 ){
                var pixelUp = {x:temp[0].x, y:temp[0].y-1};
                pila.push(pixelUp);
            }
            if(pixeles[(temp[0].y+1)*image2.width*4 + temp[0].x *4] ==0 ){
                var pixelDown = {x:temp[0].x, y:temp[0].y+1};
                pila.push(pixelDown);
            }
            if(pixeles[temp[0].y*image2.width*4 + (temp[0].x-1) *4] ==0 ){
                var pixelLeft = {x:temp[0].x -1, y:temp[0].y};
                pila.push(pixelLeft);
            }
            if(pixeles[temp[0].y*image2.width*4 + (temp[0].x+1) *4] ==0 ){
                var pixelRight = {x:temp[0].x+1, y:temp[0].y};
                pila.push(pixelRight);
            }
        }
        mostrarImagen(image2);
    }
}

/* Resta los pixeles de una imagen y los coloca un en arreglo pixelesRes */
function restaImagenes(pixeles,pixeles2,pixelesRes){
    for(var i=0; i<numPixeles*4; i+=4){
        var resultadoR = pixeles[i] - pixeles2[i];
        var resultadoG = pixeles[i+1] - pixeles2[i+1];
        var resultadoB = pixeles[i+2] - pixeles2[i+2];
        pixelesRes[i] = resultadoR;
        pixelesRes[i+1] = resultadoG;
        pixelesRes[i+2] = resultadoB;
    }
}

/** Funcion para mostrar una imagen en el canvas
 * se debe mandar el cnavas, contexto y la imagen a mostrar
 */
 function mostrarImagen(image){
    canvas2.width = image.width;
    canvas2.height = image.height;
    context2.putImageData(image,0,0);
}
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

/* limpia los elementos del resultado y desactiva todos los elementos de configuracion*/
function limpiarResultado(){
    sliderUmbral.disabled = true;
    sliderR.disabled = true;
    sliderG.disabled = true;
    sliderB.disabled = true;
    patronMatriz.disabled = true;
    patronCruz.disabled = true;
    tamPatron.disabled = true;
    boton.disabled = true;
    boton.className = "tam";
    numVeces.disabled = true;

    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    banSeleccionPixel = 0;
}

/** Funcion para poner una imagen en negro */
function imagenNegro(imagen){ 
    var pixel = imagen.data;
    var numPixel = imagen.width * imagen.height;
    for (var i = 0; i < numPixel*4; i+=4){ 
        pixel[i] = 0;
        pixel [i+1] = 0;
        pixel[i+2] = 0;
        pixel[i+3] = 255;
    }
}

/** Funcion que valida el tamaño del patron */
function ValidaTamanio(num){
    if(num%2 == 0 || num < 0){
        return false;
    }
    return true;
}

/** Funcion que valida el tamaño del patron */
function validarNumVeces(num){
    if( num < 1){
        alert("El numero de veces debe ser mayor a cero")
        return false;
    }
    return true;
}

/** Funcion que retorna el tipo de patron */
function validarPatron(){
    var tipoPatron=0;
    if(patronMatriz.checked){
        tipoPatron = 1;
    }else if (patronCruz.checked){
        tipoPatron = 2;
    }
    return tipoPatron;
}