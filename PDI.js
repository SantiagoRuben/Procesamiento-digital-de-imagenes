/* Santiago Martinez Ruben Emmanuel */
/* Creamos variables para las imagenes a mostrar*/
var image1 = new Image();
var image2 = new Image();
var image3 = new Image();
var image4 = new Image();
var image5 = new Image();
var image6 = new Image();
/* Variables para obtener informacion de las imagenes */
var pixeles;
var numPixeles;
var contIntensidad = Array(256); 
var contIntensidadG = Array(256);
var contIntensidadB = Array(256);
var contIntensidadEcualizado = Array(256);
var contIntensidadEcualizadoG = Array(256);
var contIntensidadEcualizadoB = Array(256);
var valorActual, valorMaximo;
/* div para agregar configuraciones extras */
var configuracion = document.getElementById("configuracion");
var notas = document.getElementById("nota");
var nuevoBoton = document.createElement('button'); 
var texto = document.createElement("p");
var nuevoNumero;
const matrizInput = document.createElement("div"); // se crea el div donde se dibujara la matriz para bordes
var banMatriz = 0; //indica si agregar los elementos para la matriz o si ya han sido agregados
var slider = document.getElementById("myRange"); // barra para los grados de rotacion
var output = document.getElementById("grados"); // numero de grados actuales
var sliderContainer = document.getElementById("slidecontainer"); // div con toda la informaciondel trackbar
//recupera los botones que desplazan al histograma
var boton1;
var boton2;
//recupera los inputs con los numeros 
var num1;
var num2;
//var numeroMatriz = [];
var numeroMatriz;
var banSeleccionZona = 0 ; // indica si se va a empezar a realizar la funcion seleccionZona
var tipoSeleccion; // sirve para identificar si es seleccion de zona(1) o segmentacion(2)
//posicion del mouse
var posicionX;
var posicionY;
var click = false;
/* Obtenemos las imagenes que se suban*/
var imagen1 = document.getElementById('imagen1');
var imagen2 = document.getElementById('imagen2');
imagen1.addEventListener('change', CargarImagen1); 
imagen2.addEventListener('change', CargarImagen2); 

/* Recuperamos los canvas del DOM */
var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext( '2d' );
var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext( '2d' );
var canvas3 = document.getElementById('canvas3');
var context3 = canvas3.getContext( '2d' );
canvas3.addEventListener("mousedown",function(e){clic(e)});
canvas3.addEventListener("mousemove",function(e){zonaSeleccionada(e)})
var canvas4 = document.getElementById('canvas4');
var context4 = canvas4.getContext( '2d' );
var canvas5 = document.getElementById('canvas5');
var context5 = canvas5.getContext( '2d' );
var canvas6 = document.getElementById('canvas6');
var context6 = canvas6.getContext( '2d' );

/* Recuperamos los colores elegidos */
var R1=0,G1=0,B1=0;
var R2=255,G2=255,B2=255;
var colorHexa="#000000";
var color1 = document.getElementById('color1');
color1.addEventListener('change', actualizarColor1); 
var color2 = document.getElementById('color2');
color2.addEventListener('change', actualizarColor2); 

/** se aplican algunas configuraciones al cargar la pagina */
window.onload= function init(){
    document.body.removeChild(sliderContainer); //removemos la trackBar hasta que se ocupe ese efecto
}
/*Funciones para el cargado de imagenes */
function CargarImagen1(){
    limpiarResultado();
    image1.src = window.URL.createObjectURL(imagen1.files[0]);
    notas.innerHTML = "Se recomienda seleccionar los colores para poder apreciar de mejor forma los efectos de: \<br/>Colorear, gradiente y colorear una zona." ;
    image1.onload = function () {
        canvas1.width = image1.width;
        canvas1.height = image1.height; 
        context1.drawImage( image1, 0, 0 );
    }
}
function CargarImagen2(){
    limpiarResultado();
    image2.src = window.URL.createObjectURL(imagen2.files[0]);
    image2.onload = function () {
        canvas2.width = image2.width;
        canvas2.height = image2.height; 
        context2.drawImage( image2, 0, 0 );
    }
}
/* funciones para tomar los colores elegidos  */
function letra(letra){
    if(letra=='0')
        return 0;
    if(letra=='1')
        return 1;
    if(letra=='2')
        return 2;
    if(letra=='3')
        return 3;
    if(letra=='4')
        return 4;
    if(letra=='5')
        return 5;
    if(letra=='6')
        return 6;
    if(letra=='7')
        return 7;
    if(letra=='8')
        return 8;
    if(letra=='9')
        return 9;
    if(letra=='a')
        return 10;
    if(letra=='b')
        return 11;
    if(letra=='c')
        return 12;
    if(letra=='d')
        return 13;
    if(letra=='e')
        return 14;
    if(letra=='f')
        return 15;
}
function actualizarColor1(event){
    R1=16*letra(event.target.value[1])+letra(event.target.value[2]);
    G1=16*letra(event.target.value[3])+letra(event.target.value[4]);
    B1=16*letra(event.target.value[5])+letra(event.target.value[6]);
    colorHexa = event.target.value;
    if(configuracion.contains(divPixel)){
        divPixel.style.backgroundColor = colorHexa;
    }
}
function actualizarColor2(event){
    R2=16*letra(event.target.value[1])+letra(event.target.value[2]);
    G2=16*letra(event.target.value[3])+letra(event.target.value[4]);
    B2=16*letra(event.target.value[5])+letra(event.target.value[6]);
}
/* Funciones para el procesamiento de las imagenes*/
/* Convertir la imagen a escala de grises 
    En mostrar llega si queremos que la imagen se muestre en pantalla o no
*/
function escalaGris(mostrar){
    limpiarResultado();
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    gris();
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    if(mostrar){
        context3.putImageData(image3,0,0);
    }
        
}
/* Poner en negativo la imagen*/
function negativo(){
    limpiarResultado();
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        pixeles[i] = 255 - pixeles[i];
        pixeles [i+1] = 255 - pixeles[i+1];
        pixeles[i+2] = 255 - pixeles[i+2];
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}
/* Colorear la imagen
    las variables que tambien actualiza son image3,canvas3 y context3 ya que llama
    a la funcion escalaGris.
    Tambien se tiene informacion de pixeles y numPixeles
*/
function colorear(){
    escalaGris(false);
    notas.innerHTML = "Recuerda que puedes seleccionar el color con el cual realizar este efecto.";
    var R = R1/ 255.0;
    var G = G1/ 255.0;
    var B = B1/ 255.0;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        pixeles[i] *= R;
        pixeles [i+1] *= G;
        pixeles[i+2] *= B;
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}
/* funcion para colorear la imgagen en forma de degradado 
    1 = horizontal
    2 = verticla
*/
function gradiente(direccion){
    escalaGris(false);
    notas.innerHTML = "Recuerda que puedes seleccionar el color con el cual realizar este efecto.\<br/>"+
                        "Adem??s, para este efecto se utilizan los dos colores elegidos. ";
    var r1 = R1/ 255.0;
    var g1 = G1/ 255.0;
    var b1 = B1/ 255.0;
    var r2 = R2/ 255.0;
    var g2 = G2/ 255.0;
    var b2 = B2/ 255.0;
    if(direccion == 1){
        var dr = (r2 - r1) / image3.height;
        var dg = (g2 - g1) / image3.height;
        var db = (b2 - b1) / image3.height;
        for (var i = 0; i < numPixeles*4; i+=4){ 
            pixeles[i] *= r1;
            pixeles [i+1] *= g1;
            pixeles[i+2] *= b1;
    
            if(i>0 && i%(image3.width*4)==0){
                r1+=dr;
                g1+=dg;
                b1+=db;
            }
        }
    }else{
        var dr = (r2 - r1) / image3.width;
        var dg = (g2 - g1) / image3.width;
        var db = (b2 - b1) / image3.width;
        var r1Temp = r1;
        var g1Temp = g1;
        var b1Temp = b1; 
        for (var i = 0; i < numPixeles*4; i+=4){ 
            pixeles[i] *= r1;
            pixeles [i+1] *= g1;
            pixeles[i+2] *= b1;
            r1+=dr;
            g1+=dg;
            b1+=db;
            if(i>0 && i%(image3.width*4)==0){
                r1=r1Temp;
                g1 = g1Temp;
                b1 = b1Temp;
            }
        }
    }
    
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}
/* Ecualizar la imagen en escala de grises
    La imagen esta en image3, canvas3 y context3
    Las variables pixeles y numeros de pixeles estan actualizadas
*/
function ecualizarGris(){
    mostrarHistogramaGris(true);
    limpiarArreglo(contIntensidadEcualizado);
    var x = 0;
    var y = 720;
    var i;
    image5 = image3; //context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    var pixelesRes = image5.data;
    //calculamos la intensidad acumulada
    for(i=0;i<contIntensidad.length;i++){
        if(i!=0){
            contIntensidad[i] += contIntensidad[i-1];
        }
    }
    //Ecualizamos la imagen y la mostramos
    for (i = 0; i < numPixeles*4; i+=4){ 
        //pixelesRes[i] = 255.0 * (contIntensidad[pixeles[i]]-contIntensidad[0]) / (image5.width*image5.height - contIntensidad[0]);
        var instensidad = 255.0 * (contIntensidad[pixeles[i]]-contIntensidad[0]) / (image5.width*image5.height - contIntensidad[0]);
        pixelesRes[i] = pixelesRes[i+1] = pixelesRes[i+2] = instensidad;
        contIntensidadEcualizado[pixelesRes[i] ]++;
    }
    canvas5.width = image5.width;
    canvas5.height = image5.height;
    context5.putImageData(image5,0,0);
    //mostrar el histograma ecualizado
    var max = Math.max(...contIntensidadEcualizado);
    canvas6.height = 720;
    canvas6.width = 1024;
    // Color de relleno
    context6.fillStyle = "#F4511E";
    for(var i=0;i<contIntensidad.length;i++){
        var alto = (contIntensidadEcualizado[i]/max) * y;
        // x y anchura altura
        context6.fillRect(x, y-alto, 3, alto);
        x+=4;
    } 
}
/* Ecualizar la imagen a color
    Las variables pixeles y numeros de pixeles estan actualizadas
*/
function ecualizarColor(){
    limpiarArreglo(contIntensidadEcualizado);
    limpiarArreglo(contIntensidadEcualizadoG);
    limpiarArreglo(contIntensidadEcualizadoB);
    mostrarHistogramaColor();
    var x = 0;
    var y = 720;
    var i;
    var rojo ="#F4511E";
    var verde = "#09D017";
    var azul = "#0977D0";
    image4 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    //console.log(image4);
    var pixelesRes = image4.data;
    //calculamos la intensidad acumulada
    for(i=0;i<contIntensidad.length;i++){
        if(i!=0){
            contIntensidad[i] += contIntensidad[i-1];
            contIntensidadG[i] += contIntensidadG[i-1];
            contIntensidadB[i] += contIntensidadB[i-1];
        }
    }
    //Ecualizamos la imagen y la mostramos
    //console.log(contIntensidad);
    //console.log(contIntensidadG);
    //console.log(contIntensidadB);
    for (i = 0; i < numPixeles*4; i+=4){ 
        pixelesRes[i] = 255.0 * (contIntensidad[pixeles[i]]-contIntensidad[0]) / (image4.width*image4.height - contIntensidad[0]);
        pixelesRes[i+1] = 255.0 * (contIntensidadG[pixeles[i+1]]-contIntensidadG[0]) / (image4.width*image4.height - contIntensidadG[0]);
        pixelesRes[i+2] = 255.0 * (contIntensidadB[pixeles[i+2]]-contIntensidadB[0]) / (image4.width*image4.height - contIntensidadB[0]);
        contIntensidadEcualizado[pixelesRes[i] ]++;
        contIntensidadEcualizadoG[pixelesRes[i+1] ]++;
        contIntensidadEcualizadoB[pixelesRes[i+2] ]++;
    }
    canvas4.width = image4.width;
    canvas4.height = image4.height;
    context4.putImageData(image4,0,0);
    //mostrar el histograma ecualizado
    var maxr = Math.max(...contIntensidadEcualizado);
    var maxg = Math.max(...contIntensidadEcualizadoG);
    var maxb = Math.max(...contIntensidadEcualizadoB);
    canvas6.height = 720;
    canvas6.width = 1536;
    for(var i=0;i<contIntensidad.length;i++){
        var altor = (contIntensidadEcualizado[i]/maxr) * y;
        var altog = (contIntensidadEcualizadoG[i]/maxg) * y;
        var altob = (contIntensidadEcualizadoB[i]/maxb) * y;
        // Color de relleno
        context6.fillStyle = rojo;
        // x y anchura altura
        context6.fillRect(x, y-altor, 2, altor);
        x+=2;
        // Color de relleno
        context6.fillStyle = verde;
        // x y anchura altura
        context6.fillRect(x, y-altog, 2, altog);
        x+=2;
        // Color de relleno
        context6.fillStyle = azul;
        // x y anchura altura
        context6.fillRect(x, y-altob, 2, altob);
        x+=2;
    } 
}/* Selecciona una zona con el mouse y se debe mostrar esa zona a color todo lo demas en escala de girses */
function seleccionZonaConfig(){
    //escalaGris(true);
    limpiarResultado(); //
    notas.innerHTML = "La seleccion de la zona debe de realizarse sobre la imagen de abajo, el resultado se mostrara a la derecha.\<br>" +
                        "Para comenzar a seleccionar el area que se quiere mantener de color se debe de dar clic dentro de la imagen,"+
                        "una vez que haya terminado de elegir el area debera dar un segundo clic para poder visualizar el resultado.";
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );//
    canvas3.height = image3.height;//
    canvas3.width = image3.width; //
    context3.putImageData(image3,0,0);//
    banSeleccionZona = 1;
    tipoSeleccion = 1;
    //se cambia la clase para tener mayor control al momento de normalizar la posicion del mouse
    canvas3.className = "zonaSeleccion";
    canvas3.style.setProperty("--ancho", '650px');
    canvas3.style.setProperty("--alto", '350px');
    canvas3.style.setProperty("--margen-izquierdo", '10px');
    canvas4.className = "zonaSeleccion";
}
//funcion que pinta la zona seleccionada
function pintarZonaSeleccionada(posxInicial,posyInicial,posxFinal,posyFinal,pixelesC){
    gris();//
    for( var j = Math.ceil(posyInicial) ; j< Math.ceil(posyFinal); j++){
        for (var i = Math.ceil(posxInicial) ; i < Math.ceil(posxFinal); i++){ 
            pixeles[j*image4.width*4 + i*4] = pixelesC[j*image4.width*4 + i*4];
            pixeles[j*image4.width*4 + i*4+1] = pixelesC[j*image4.width*4 + i*4+1];
            pixeles[j*image4.width*4 + i*4+2] = pixelesC[j*image4.width*4 + i*4+2];
        } 
    }
}
//funcion que se ejecuta con el clic del mouse
function clic(event){
    if(banSeleccionZona == 1){
        const rect = canvas3.getBoundingClientRect();
        click=!click;
        if(click){
            posicionX = event.clientX - Math.abs(rect.left);
            posicionY = event.clientY - rect.top;
            // console.log(rect.left);
            //console.log(rect.top);
            // console.log(event.clientX );
            // console.log(event.clientY);
            // console.log(posicionX);
            //console.log( posicionY);       
        }else{// se colorea la imagen
            var xTemp = posicionX;
            var yTemp = posicionY;
            var x = event.clientX - Math.abs(rect.left);
            var y = event.clientY - rect.top;
            image4 = context3.getImageData( 0, 0, canvas3.width, canvas3.height );
            image5 = context1.getImageData(0,0,canvas1.width,canvas1.height);
            pixeles = image4.data;
            numPixeles = image4.height * image4.width;//
            var pixelesC = image5.data;
            if(posicionX>x){
                posicionX = Math.ceil(x);
                x= Math.ceil(xTemp);
            }
            if(posicionY>y){
                posicionY = Math.ceil(y);
                y= Math.ceil(yTemp);
            }
            //como la imagen se hace chica tenemos que normalizar la posicion del mouse
            var posxInicial = (posicionX*image3.width) / 650.0;
            var posyInicial = (posicionY*image3.height)   / 350.0;
            var posxFinal = ((x)*image3.width) / 650.0;
            var posyFinal = ((y) * image3.height) / 350.0;
            if(tipoSeleccion ==1){// codigo hecho del primer parcial para pintar una zona a color y lo demas en blanco y negro
                pintarZonaSeleccionada(posxInicial,posyInicial,posxFinal,posyFinal,pixelesC);
                canvas4.width = image4.width;
                canvas4.height = image4.height;
                context4.putImageData(image4,0,0);
            }else{//codigo hecho en el tercer parcial para la segmentacion de una imagen
                //poner la funcion de segmentacion
                //Lo que se obtiene es la matriz de covarianza inversa, el arreglo con la media de cada canal, numero total de pixeles
            }            
        }
    }
}
//funcion que se ejecuto con el evento del movimiento del mouse
function zonaSeleccionada(event){
    if(banSeleccionZona == 1){
        if(click){
            const rect = canvas3.getBoundingClientRect();
            if(tipoSeleccion ==1){// dependiendo del tipo se usa la image3 o la image4
                context3.putImageData(image3,0,0); // para que solo muestre un rectangulo se debe poner otra vez la imagen
            }else{
                // para esto es necesario volver a tomar la imagen ya que image4 se ocupa anteriormente
                image4 = context1.getImageData( 0, 0, canvas3.width, canvas3.height ); 
                context3.putImageData(image4,0,0); // para que solo muestre un rectangulo se debe poner otra vez la imagen
            }
            
            var x = event.clientX - Math.abs(rect.left);
            var y = event.clientY - rect.top;
            var xTemp = posicionX;
            var yTemp = posicionY;
            if(posicionX>x){
                posicionX = Math.ceil(x);
                x= Math.ceil(xTemp);
            }
            if(posicionY>y){
                posicionY = Math.ceil(y);
                y= Math.ceil(yTemp);
            }
            //como la imagen se hace chica tenemos que normalizar la posicion del mouse
            var posx = (posicionX*image3.width) / 650.0;
            var posy = (posicionY*image3.height)   / 350.0;
            var ancho = ((x-posicionX)*image3.width) / 650.0;
            var alto = ((y-posicionY) * image3.height) / 350.0;
            context3.lineWidth = 3;
            context3.strokeStyle  = "#F4511E";
            context3.strokeRect(posx, posy,ancho ,alto);
            //regresamos los puntos iniciales a sus valores originales
            posicionX =  xTemp;
            posicionY =  yTemp;
        } 
    }
}
/* Conservar solo un color de la imagen
    1 = rojo
    2 = verde
    3 = azul
*/
function seleccionColor(color){
    limpiarResultado();
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        pixeles[i] = color == 1 ? pixeles[i] : 0;
        pixeles [i+1] = color == 2 ? pixeles[i+1] : 0;
        pixeles[i+2] = color == 3? pixeles[i+2] : 0;
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}
/*  Realiza operaciones logicas
    1 = and
    2 = or
    3 = xor
*/
function operadorLogico(operador){
    limpiarResultado();
    notas.innerHTML = "Para vizualizar de forma correcta el efecto es necesario cargar dos imagenes y que estas sean de las mismas dimensiones";
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    image4 = context2.getImageData( 0, 0, canvas2.width, canvas2.height );
    var pixeles2 = image4.data;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        if(operador == 1 ){
            pixeles[i] = pixeles[i] & pixeles2[i];
            pixeles [i+1] = pixeles[i+1] & pixeles2[i+1];
            pixeles[i+2] = pixeles[i+2] & pixeles2[i+2];
        }
        if(operador == 2 ){
            pixeles[i] = pixeles[i] | pixeles2[i];
            pixeles [i+1] = pixeles[i+1] | pixeles2[i+1];
            pixeles[i+2] = pixeles[i+2] | pixeles2[i+2];
        }
        if(operador == 3 ){
            pixeles[i] = pixeles[i] ^ pixeles2[i];
            pixeles [i+1] = pixeles[i+1] ^ pixeles2[i+1];
            pixeles[i+2] = pixeles[i+2] ^ pixeles2[i+2];
        }
        
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}
/* Mostrar el histograma de una imagen en escala de grises
    las variables que tambien actualiza son image3,canvas3 y context3 ya que llama
    a la funcion escalaGris
*/
function mostrarHistogramaGris(mostrar){
    var x = 0;
    var y = 720;
    limpiarArreglo(contIntensidad);
    escalaGris(mostrar);
    //contarIntensidad(image3);
    var max = Math.max(...contIntensidad);
    canvas4.height = 720;
    canvas4.width = 1024;
    // Color de relleno
    context4.fillStyle = "#F4511E";
    for(var i=0;i<contIntensidad.length;i++){
        var alto = (contIntensidad[i]/max) * y;
        // x y anchura altura
        context4.fillRect(x, y-alto, 3, alto);
        x+=4;
    }    
}
/* Muestra el histograma de la imagen a color */
function mostrarHistogramaColor(){
    limpiarResultado();
    var x = 0;
    var y = 720;
    var rojo ="#F4511E";
    var verde = "#09D017";
    var azul = "#0977D0";
    limpiarArreglo(contIntensidad);
    limpiarArreglo(contIntensidadG);
    limpiarArreglo(contIntensidadB);
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    // contar las veces que se repiten las intensidades
    for (var i = 0; i < numPixeles*4; i+=4){ 
        contIntensidad[pixeles[i]]++;
        contIntensidadG[pixeles[i+1]]++;
        contIntensidadB[pixeles[i+2]]++;
    }  
    var maxR = Math.max(...contIntensidad);
    var maxG = Math.max(...contIntensidadG);
    var maxB = Math.max(...contIntensidadB);
    canvas3.height = 720;
    canvas3.width = 1536;
    
    
    for(var i=0;i<contIntensidad.length;i++){
        var altoR = (contIntensidad[i]/maxR) * y;
        var altoG = (contIntensidadG[i]/maxG) * y;
        var altoB = (contIntensidadB[i]/maxB) * y;
        context3.fillStyle = rojo;
        context3.fillRect(x, y-altoR, 2, altoR);
        x+=2;
        context3.fillStyle = verde;
        context3.fillRect(x, y-altoG, 2, altoG);
        x+=2;
        context3.fillStyle = azul;
        context3.fillRect(x, y-altoB, 2, altoB);
        x+=2;
    }    
}
/* Mueve el histograma de una imagen en escala de grises para aclararla u oscurecerla*/
function moverHistograma(){
    mostrarHistogramaGris(true);
    valoresIntensidad();
    notas.innerHTML = "Al dar clic en el boton + la imagen se aclarar??, al dar clic en el boton - la imagen se oscurecer?? \<br/>" +
                        "Tenga en cuenta que no a todas las imgenes se les podra aplicar este efecto.";
    if(valorActual == 0 && valorMaximo == 0){
        texto.textContent = "Esta imagen no se puede mover su histograma, pruebe con otra";
        texto.id = "texto";
        configuracion.appendChild(texto);
    }else{
        /* Crear los botones para aumentar o disminuir la luz (mover el histograma) */
        nuevoBoton = document.createElement('button'); 
        nuevoBoton.type = 'button'; 
        nuevoBoton.id = "boton1"
        nuevoBoton.innerText = '-'; 
        nuevoBoton.onclick = function(){mover(2)}; 
        configuracion.appendChild(nuevoBoton); 
        nuevoBoton = document.createElement('button'); 
        nuevoBoton.type = 'button'; 
        nuevoBoton.id = "boton2";
        nuevoBoton.innerText = '+'; 
        nuevoBoton.onclick = function(){mover(1)}; 
        configuracion.appendChild(nuevoBoton); 
        boton1 = document.getElementById("boton1");
        boton2 = document.getElementById("boton2");
        /* Crear el texto para para indicar cual es el maximo y minimo para moverse */
        texto.textContent = valorActual + "/" + valorMaximo;
        texto.id = "texto";
        configuracion.appendChild(texto);

        /* Habilitar y deshabilitar botones */
        if(valorActual == valorMaximo){
            boton2.disabled = true;
        }else{
            boton2.disabled = false;
        }
        if(valorActual==0){
            boton1.disabled = true;
        }else{
            boton1.disabled = false;
        }
    }
    
}
/*  Esta funcion se llama al crear los botones en la funcion moverHistograma
    1 = mover a la derecha (iluminar) 
    2 = mover a la izquierda (oscurecer)
    La imagen a la que se le hace los cambios esta en las variables image3, canvas3 y context3
    El histograma se pondra sobre las variables canvas4 y context4
    Las variables pixeles y numPixeles tambien ya han sido asignadas con el valor correspondiente
*/
function mover(direccion){
    limpiarArreglo(contIntensidad);
    var mover = direccion == 1 ? 1:-1;
    var x = 0;
    var y = 720;
    valorActual += mover; 
    var canvas = canvas4;
    var context = context4;
    canvas.height = 720;
    canvas.width = 1024;
    texto.textContent = valorActual + "/" + valorMaximo;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < numPixeles*4; i+=4){ 
        pixeles[i] = pixeles [i+1] = pixeles[i+2] = pixeles[i] + mover;
        contIntensidad[pixeles[i]]++;
    }
    context3.putImageData(image3,0,0);
    //graficar el histograma

    // Color de relleno
    context.fillStyle = "#F4511E";
    var max = Math.max(...contIntensidad);
    for(var i=0;i<contIntensidad.length;i++){
        var alto = (contIntensidad[i]/max) * y;
        // x y anchura altura
        context4.fillRect(x, y-alto, 3, alto);
        x+=4;
    } 
    /* Habilitar y deshabilitar botones */
    if(valorActual == valorMaximo){
        boton2.disabled = true;
    }else{
        boton2.disabled = false;
    }
    if(valorActual==0){
        boton1.disabled = true;
    }else{
        boton1.disabled = false;
    }
}
/* Pinta la zona seleccionada, se deben pasar parametros en dos textos 
*/
function pintarZona(){
    mostrarHistogramaGris(true);
    notas.innerHTML = "En la pantalla se muestran dos recuadros donde deber?? ingresar el intervalo que desea pintar, el intervalo m??ximo es de [0-255].\<br/>"+
                        "El intervalo se??ala las intensidades de los pixeles que deben ser pintados, recuerde que puede seleccionar el color con el cual se pintar?? la imagen";
    /* Crear los inputs para leer los datos que delimitan la intensidad */
    nuevoNumero = document.createElement('input');
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.min= 0; 
    nuevoNumero.max = 255;
    nuevoNumero.placeholder = 0;
    configuracion.appendChild(nuevoNumero); 
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num2";
    nuevoNumero.className = "tam";
    nuevoNumero.min= 0; 
    nuevoNumero.max = 255;
    nuevoNumero.placeholder = 255;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");
    num2 = document.getElementById("num2");
    /* Crear el boton para que indique cuando quiere que se pinte la zona */
    nuevoBoton = document.createElement('button'); 
    nuevoBoton.type = 'button'; 
    nuevoBoton.id = "boton1";
    nuevoBoton.className = "tam";
    nuevoBoton.innerText = 'Pintar'; 
    nuevoBoton.onclick = function(){pintar()}; 
    configuracion.appendChild(nuevoBoton);   
    boton1 = document.getElementById("boton1");  
}
/* Esta funcion se llama desde el boton creado en la funcion pintarZona pinta la zona del elegido por el usuario en 
    el rango que indico previamente.
    La imagen a la que se le hace los cambios esta en las variables image3, canvas3 y context3
    El histograma se pondra sobre las variables canvas4 y context4
    Las variables pixeles y numPixeles tambien ya han sido asignadas con el valor correspondiente
*/
function pintar(){
    //validar numeros de
    if(!validarZona(Number(num1.value),Number(num2.value))){
        return false;
    }else if(document.body.contains(document.getElementById("texto"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("texto"));
    }
    var x = 0;
    var y = 720;
    var canvas = canvas6;
    var context = context6;
    var rojo = "#F4511E";
    canvas.height = 720;
    canvas.width = 1024;
    context.clearRect(0, 0, canvas.width, canvas.height);
    image5 = context3.getImageData( 0, 0, canvas3.width, canvas3.height);
    var pixelesRes = image5.data;
    // tener siempre el valor menor en num1
    if(num1>num2){
        var temp = num1;
        num1=num2;
        num2=temp;
    }
    for (var i = 0; i < numPixeles*4; i+=4){ 
        if(pixeles[i]>num1.value && pixeles[i]<num2.value){
            pixelesRes[i] = R1;
            pixelesRes [i+1] = G1;
            pixelesRes[i+2] = B1;
        }  
    }
    canvas5.width = image5.width;
    canvas5.height = image5.height;
    context5.putImageData(image5,0,0);

    var max = Math.max(...contIntensidad);
    for(var i=0;i<contIntensidad.length;i++){
        var alto = (contIntensidad[i]/max) * y;
        if(i> num1.value && i<num2.value){
            context.fillStyle = colorHexa;
        }else{
            context.fillStyle = rojo
        }
        context.fillRect(x, y-alto, 3, alto);
        x+=4;
    } 
}
/* Dibujo los bordes de la imagen en escala de grises
    1 = verticales
    2 = horizontales
    3 = diagonales
    4 = todos
    Se tiene la informacion en image3, canvas3 y context3
*/
function bordesGris(tipo){
    escalaGris(false);
    var renglonS = image3.width * 4;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        var vertical,horizontal,diagonal;
        //calculamos todos los bordes
        vertical = Math.abs(pixeles[i] - pixeles[i+4]); 
        horizontal = Math.abs(pixeles[i] - pixeles[i+renglonS]);
        diagonal = Math.abs(pixeles[i] - pixeles[i+renglonS+4]);
        if(tipo ==1){
            pixeles[i] = pixeles[i+1] = pixeles[i+2] = vertical;
        } 
        if(tipo == 2){
            pixeles[i] = pixeles[i+1] = pixeles[i+2] = horizontal;
        }      
        if(tipo == 3){
            pixeles[i] = pixeles[i+1] = pixeles[i+2] = diagonal;
        }   
        if(tipo == 4){
            pixeles[i] = pixeles[i+1] = pixeles[i+2] = Math.max(horizontal,vertical,diagonal);
        } 
    }
    canvas3.height = image3.height;
    canvas3.width = image3.width;
    context3.putImageData(image3,0,0);
}
/* Dibujo los bordes de la imagen a color
    1 = verticales
    2 = horizontales
    3 = diagonales
    4 = todos
*/
function bordesColor(tipo){
    limpiarResultado();
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    var renglonS = image3.width * 4;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        var verticalR,horizontalR,diagonalR;
        var verticalG,horizontalG,diagonalG;
        var verticalB,horizontalB,diagonalB;
        //calculamos todos los bordes
        verticalR = Math.abs(pixeles[i] - pixeles[i+4]); 
        verticalG = Math.abs(pixeles[i+1] - pixeles[i+5]); 
        verticalB = Math.abs(pixeles[i+2] - pixeles[i+6]); 
        horizontalR = Math.abs(pixeles[i] - pixeles[i+renglonS]);
        horizontalG = Math.abs(pixeles[i+1] - pixeles[i+renglonS+1]);
        horizontalB = Math.abs(pixeles[i+2] - pixeles[i+renglonS+2]);
        diagonalR = Math.abs(pixeles[i] - pixeles[i+renglonS+4]);
        diagonalG = Math.abs(pixeles[i+1] - pixeles[i+renglonS+5]);
        diagonalB = Math.abs(pixeles[i+2] - pixeles[i+renglonS+6]);
        if(tipo ==1){
            pixeles[i] = verticalR;
            pixeles[i+1] = verticalG;
            pixeles[i+2] = verticalB;
        } 
        if(tipo == 2){
            pixeles[i] = horizontalR;
            pixeles[i+1] = horizontalG;
            pixeles[i+2] = horizontalB;
        }      
        if(tipo == 3){
            pixeles[i] = diagonalR;
            pixeles[i+1] = diagonalG;
            pixeles[i+2] = diagonalB;
        }   
        if(tipo == 4){
            pixeles[i] = Math.max(horizontalR,verticalR,diagonalR);
            pixeles[i+1] = Math.max(horizontalG,verticalG,diagonalG);
            pixeles[i+2] = Math.max(horizontalB,verticalB,diagonalB);
        } 
    }
    canvas3.height = image3.height;
    canvas3.width = image3.width;
    context3.putImageData(image3,0,0);
}
/* Reduce la imagen de acuerdo al valor que llega*/
function reducir(valor){
    limpiarResultado();
    /*  a = filas de la imagen original 
        b = columnas de la imagen original 
    */
    var i,a=0,b;
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    var ancho = canvas1.width;
    pixeles = image3.data;
    image4 = context1.getImageData( 0, 0,canvas1.width/valor, canvas1.height/valor);
    var pixelesRes = image4.data
    var numPixelesRes = image4.width * image4.height;
    for (i=0, b=0; i < numPixelesRes; i++, b+=(valor)){ 
        pixelesRes[i*4] = pixeles[b*4];
        pixelesRes[i*4+1] = pixeles[b*4+1];
        pixelesRes[i*4+2] = pixeles[b*4+2];

        //se debe saltar las filas de acuerdo al tama??o (valor) a reducir
        if(i>0 && i%(image4.width)==0){
            a++;
            b=ancho*valor*a;
        }
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image4,100,0);
}
/* 2 parcial
    Suma dos imagenes
    1: si sobrepasa 255 se regresa el valor a 255
    2: Se normalizasa la suma
*/
function sumaImagen(tipo){
    limpiarResultado();
    notas.innerHTML = "Para vizualizar de forma correcta el efecto es necesario cargar dos imagenes y que estas sean de las mismas dimensiones";
    image3 = context1.getImageData(0,0, canvas1.width,canvas1.height);
    image4 = context2.getImageData( 0, 0, canvas2.width, canvas2.height);
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    //var pixelesRes = Array();
    var pixelesRes = image3.data;
    var pixeles2 = image4.data;
    operacion(pixeles, pixeles2,numPixeles,pixelesRes,1);
   // console.log("pixelesRes")
    var max = maximaIntensidad(pixelesRes); // encontramos la intensidad mas alta de la suma de la imagen
    for(var i = 0; i < numPixeles*4; i+=4){
        if(tipo == 1){
            pixelesRes[i] = pixelesRes[i] >255 ? 255: pixelesRes[i] ;
            pixelesRes[i+1] = pixelesRes[i+1]>255 ? 255: pixelesRes[i+1];
            pixelesRes[i+2] = pixelesRes[i+2]>255 ? 255: pixelesRes[i+2];
        }else{
            pixelesRes[i] = pixelesRes[i] >255 ? (sumaR*255)/max : pixelesRes[i];
            pixelesRes[i+1] = pixelesRes[i+1]>255 ? (sumaG*255)/max : pixelesRes[i+1];
            pixelesRes[i+2] = pixelesRes[i+2]>255 ?(sumaB*255)/max : pixelesRes[i+2];
        }
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);  
}
/*2 parcial
    Resta dos imagenes
    1: toma el valor absoluto de la resta
    2: Se normalizasa la resta
*/
function restaImagen(tipo){
    limpiarResultado();
    notas.innerHTML = "Para vizualizar de forma correcta el efecto es necesario cargar dos imagenes y que estas sean de las mismas dimensiones";
    image3 = context1.getImageData(0,0, canvas1.width,canvas1.height);
    image4 = context2.getImageData( 0, 0, canvas2.width, canvas2.height);
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    var pixelesRes = Array(); 
    //var pixelesRes = image3.data;
    var pixeles2 = image4.data;
    operacion(pixeles, pixeles2,numPixeles,pixelesRes,2);
    //console.log("pixelesRes");
    var max = maximaIntensidad(pixelesRes); // encontramos la intensidad mas alta de la suma de la imagen
    var min = minimaIntensidad(pixelesRes); // encontramos la intensidad mas alta de la suma de la imagen
    for(var i = 0; i < numPixeles*4; i+=4){
        if(tipo == 1){
            pixeles[i] = Math.abs(pixelesRes[i]);
            pixeles[i+1] = Math.abs(pixelesRes[i+1]);
            pixeles[i+2] = Math.abs(pixelesRes[i+2]);
        }else{
            pixeles[i] = pixelesRes[i]<0 ? ((pixelesRes[i]-min)/(max-min)) * 255: pixelesRes[i];
            pixeles[i+1] = pixelesRes[i+1]<0 ? ((pixelesRes[i+1]-min)/(max-min)) * 255 : pixelesRes[i+1];
            pixeles[i+2] = pixelesRes[i+2]<0 ? ((pixelesRes[i+2]-min)/(max-min)) * 255 : pixelesRes[i+2];
        }
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);  
}
/* 2 parcial
Filtro de la media (desenfocar una imagen), la matriz con la que se aplica el filtro debe de ser de puros 1
*/
function filtroMedio(){
    limpiarResultado();
    notas.innerHTML = "Antes de dar clic en desenfocar, es necesario que ingrese el tama??o de la matriz en el recuadro, el numero debera ser impar.\<br/>"+
                        "Mientras mayor sea el numero, m??s visible sera el desenfoque.\<br/>"+
                        "Este efecto puede tardar mas que otros.";
    texto = document.createElement('p'); 
    texto.textContent = "Desenfoque (# impares)";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = 1;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");
     /* Crear el boton para que indique cuando quiere desenfocar */
     nuevoBoton = document.createElement('button'); 
     nuevoBoton.type = 'button'; 
     nuevoBoton.id = "boton1";
     nuevoBoton.className = "tam";
     nuevoBoton.innerText = 'Desenfocar'; 
     nuevoBoton.onclick = function(){desenfocar()}; 
     configuracion.appendChild(nuevoBoton);   
     boton1 = document.getElementById("boton1");  
}
function desenfocar(){
    if(!validarDesenfocar(Number(num1.value))){
        return false;
    }else if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    var tam = Number(num1.value);
    var filtro = crearMatriz(tam);
    convolucion(filtro,tam,false,0,255,false);
}
/** Parcial 2
 * funcion que crea la configuracion para calcular la mediana a trves de l triangulo de pascal
 */
function medianaConfig(){
    limpiarResultado();
    notas.innerHTML = "Antes de dar clic en Trazar, es necesario que ingrese el numero del rengl??n del triangulo de pascal que desea utilizar para el filtro.\<br/>"+
                        "Este efecto puede tardar mas, dependiendo del renglon elegido.";
    texto = document.createElement('p'); 
    texto.textContent = "Renglon elegido";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.value = 2;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");
     /* Crear el boton para que indique el renglon seleccionado */
     nuevoBoton = document.createElement('button'); 
     nuevoBoton.type = 'button'; 
     nuevoBoton.id = "boton1";
     nuevoBoton.className = "tam";
     nuevoBoton.innerText = 'Trazar'; 
     nuevoBoton.onclick = function(){filtroMediana()}; 
     configuracion.appendChild(nuevoBoton);   
     boton1 = document.getElementById("boton1");  
}
/** Parcial2
 * Funcion que calcula la mediana de acuerdo al renglon que ingreso el usuario
 */
function filtroMediana(){
    var fila = Number(num1.value);
    if(!validarMediana(fila)){
        return false;
    }else if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    var tam = fila+1;
    var arreglo=Array();
    //primero se debe crear el renglon del triangulo de pascal
    for(var i=0; i<tam;i++){
        arreglo[i] = Math.round(factorial(fila)/(factorial(i)*factorial(fila-i)));
    }
    console.log(arreglo);
    //creamos la matriz filtro
    var filtro = Array();
    for(var j=0;j<tam;j++){
        for(var i=0; i<tam;i++){
            filtro[j*tam + i] = arreglo[j] * arreglo[i];
        }
    }
    convolucion(filtro,tam,false,0,255,false);
}
/** 
 * Funcion que ocupa la convolucion para detectar los bordes */
function filtroBordes(tipo){
    limpiarResultado();
    var tam = 3;
    var esGris = true;
    if(tipo == 1){
        var filtro = [-1,0,1,
                      -1,0,1,
                      -1,0,1];
    }else if(tipo == 2){
        var filtro = [5,5,5,
                      -3,0,-3,
                      -3,-3,-3];
    }else if(tipo == 3){
        var filtro = [-1,1,1,
                      -1,-2,1,
                      -1,1,1];
    }else if(tipo == 4){
        var filtro = [2,1,0,
                      1,0,-1,
                      0,-1,-2];
    }else if(tipo == 5){
        tam = 7;
        var filtro = [0,0,-1,-1,-1,0,0,
                      0,-2,-3,-3,-3,-2,0,
                      -1,-3,5,5,5,-3,-1,
                      -1,-3,5,16,5,-3,-1,
                      -1,-3,5,5,5,-3,-1,
                      0,-2,-3,-3,-3,-2,0,
                      0,0,-1,-1,-1,0,0];
    }//las matrices son para pasa alta
    else if(tipo == 6){
        var filtro = [-1,-1,-1,
                      -1,9,-1,
                      -1,-1,-1];
        esGris= false;
    } else if(tipo == 7){   //pasa bajas
        var filtro = [1,4,1,
                      4,12,4,
                      1,4,1];
        esGris= false;
    }
    convolucion(filtro,tam,esGris,0,255,false);
}
/*2 parcial
    Funciones para el filtro de una matriz 3x3
*/ 
function convolucionNxN(aumentarImagen){
    limpiarResultado();
    notas.innerHTML = "Ingresar la matriz en el area de texto, las columna separados por un espacio y las filas por un salto de linea (enter).\</br>"+
                        "Tambien indicar el limite inferior y superir, los limites indican a partir de que intensidad se debe asignar 0 o 255 respectivamente";
    texto = document.createElement('p'); 
    texto.textContent = "Matriz filtro:";
    texto.id = "texto";
    configuracion.appendChild(texto);
    
    //Se crea el text area donde ingresaran la matriz
    var textArea = document.createElement('textarea');
    textArea.style = "width:256px;height:136px;"
    textArea.id = "matriz";
    configuracion.appendChild(textArea);
    numeroMatriz = document.getElementById("matriz");
    /*creaMatriz(3);
    for (var i=1; i <= 9; i++){
        numeroMatriz[i-1] = document.getElementById(i);
    }*/
     // limite inferior de la imagen (intensiddad que se igualara a 0)
    texto = document.createElement('p'); 
    texto.textContent = "Inferior";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input');
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.value = 0;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");
     // limite superior de la imagen (intensiddad que se igualara a 255)
    texto = document.createElement('p'); 
    texto.textContent = "Superior";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input');
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num2";
    nuevoNumero.className = "tam";
    nuevoNumero.value = 255;
    configuracion.appendChild(nuevoNumero); 
    num2 = document.getElementById("num2");
     /* Crear el boton  */
     nuevoBoton = document.createElement('button'); 
     nuevoBoton.type = 'button'; 
     nuevoBoton.id = "boton1";
     nuevoBoton.className = "tam";
     nuevoBoton.innerText = 'Trazar'; 
     nuevoBoton.onclick = function(){trazar(aumentarImagen)}; 
     configuracion.appendChild(nuevoBoton);   
     boton1 = document.getElementById("boton1");  
}
/*2 parcial
se llama desde la funcion convolucion n*n al momento de ya haber asignado los datos necesarios
*/
function trazar(aumentarImagen){
    var tam;
    var filtro = [];
    if(!validarTrazar(numeroMatriz.value,filtro) || !validarZona(Number(num1.value),Number(num2.value))){
        return false;
    }else if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    var tam = numeroMatriz.value.split("\n").length;
    console.log(tam);
    console.log(filtro);
    /*for(var i=0; i<9; i++){
        filtro[i] = Number(numeroMatriz[i].value);
    }*/
    convolucion(filtro,tam,true,Number(num1.value),Number(num2.value),aumentarImagen);
    
}
/* recibe la matriz filtro y realiza la convolucion
    si gris es true entonces el efecto lo aplica a escala de grises
    inf y sup son los limites para convertir las intensidades
    si es menor a inf se vuelve 0
    si esmayor a sup se vuelve 255
*/
function convolucion(filtro, tam, escalaGris,inf,sup,aumentarImagen){
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height);
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    console.log(aumentarImagen);
    if(aumentarImagen){ // si se debe aumentar la imagen entonces a la imagen original (image3) se le agregan las columnas y filas de acuerdo al tama??o del filtro
        //crear la imagen mas grande
        image5 = context1.createImageData(image3.width+(tam-1)*2, image3.height+(tam-1)*2);
        imagenNegro(image5);
        var pixelesAumentar = image5.data;
        var b= tam-1; //fila de la imagen
        var a=0;
        for(var i=0; i<numPixeles; i++,a++){
            pixelesAumentar[b*image5.width*4 + (a+(tam-1))*4] = pixeles[i*4];
            pixelesAumentar[b*image5.width*4 + (a+(tam-1))*4 +1] = pixeles[i*4+1];
            pixelesAumentar[b*image5.width*4 + (a+(tam-1))*4 +2] = pixeles[i*4+2];
            if(i>0 && i%(image3.width)==0){
                b++;
                a=0;
            }
        }
        image3 = image5;
        pixeles = image3.data;
        numPixeles = image3.width * image3.height;
    }
    
    if(escalaGris){
        gris();
    }
    
    image4 = context1.createImageData(image3.width, image3.height);
    
    imagenNegro(image4);
    var pixelesRes = image4.data;
    var pixelCambio; // pixel al que se debe poner el resultado de la operacion (pixel medio de la matriz) 
    var sum = sumaMatriz(filtro);
    //console.log(filtro);
    //console.log(pixeles);
    //console.log(sum);
    //console.log(i!=image3.width-(tam -1));
    //console.log(j!=image3.height-(tam-1));
    //var ban=0
    for( var j = 0 ; j< image3.height; j++){
            for (var i = 0 ; i < image3.width; i++){ 
                if((i<image3.width-(tam -1)) || (j<image3.height-(tam-1)) ){ // no se desborde tanto a lo alto como a lo ancho
                    var intensidadR=0;
                    var intensidadG=0;
                    var intensidadB=0;
                    for(var l=0; l<tam;l++){
                        for(var m=0; m<tam; m++){
                            // se suman para obtener la parte de la matriz que queremos 
                            ////////////////////////////////         (renglon matriz)+(renglon imagen)    + (columna matriz)+(columna imagen)
                            intensidadR += filtro[l*tam + m] * pixeles[((l*image3.width*4)+(j*image3.width*4)) + ((m*4) + (i*4))];
                            intensidadG += filtro[l*tam + m] * pixeles[((l*image3.width*4)+(j*image3.width*4)) + ((m*4) + (i*4) +1)];
                            intensidadB += filtro[l*tam + m] * pixeles[((l*image3.width*4)+(j*image3.width*4)) + (m*4) + ((i*4) +2)];
                        /* if(ban==0){
                                console.log(intensidadR);
                            }*/
                            if(l==Math.floor(tam/2) && m==Math.floor(tam/2)){
                                pixelCambio = (l*image3.width*4)+(j*image3.width*4) + (m*4) + (i*4);
                                //console.log("pixel" + pixelCambio);
                            }
                        }
                    }
                    ban=1;
                    pixelesRes[pixelCambio] = (intensidadR/sum) <= inf ? 0 : ((intensidadR/sum) >= sup ? 255:(intensidadR/sum) ) ;
                    //console.log("pixel " + pixeles[pixelCambio] )
                    pixelesRes[pixelCambio +1] = (intensidadG/sum) <= inf ? 0 : ((intensidadG/sum) >= sup ? 255:(intensidadG/sum) ) ;
                    pixelesRes[pixelCambio+2] = (intensidadB/sum) <= inf ? 0 : ((intensidadB/sum) >= sup ? 255:(intensidadB/sum) ) ;
                }
            } 
        }
        canvas3.width = image3.width;
        canvas3.height = image3.height;
        context3.putImageData(image4,0,0);
}
/** Parcial 2
 * funcion que muestra la configuracion para realizar la traslacion de la imagen
 */
function traslacionConfig(){
    limpiarResultado();
    notas.innerHTML = "En la pantalla se muestran dos recuadros donde deber?? ingresar la cantidad de unidades que se desea desplazar.\<br/>"+
                        "El primer recuadro es para desplazarse de forma horizontal y el segundo de forma vertical.\<br/>"+
                        "Para desplazarse a la izquierda o hacia arriba se deben ingresar numeros negativos.";
    /* Crear los inputs para leer los datos que delimitan la intensidad */
    nuevoNumero = document.createElement('input');
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = 0;
    configuracion.appendChild(nuevoNumero); 
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num2";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = 0;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");
    num2 = document.getElementById("num2");
    /* Crear el boton para que indique cuando quiere realizar la traslacion */
    nuevoBoton = document.createElement('button'); 
    nuevoBoton.type = 'button'; 
    nuevoBoton.id = "boton1";
    nuevoBoton.className = "tam";
    nuevoBoton.innerText = 'Trasladar'; 
    nuevoBoton.onclick = function(){trasladar()}; 
    configuracion.appendChild(nuevoBoton);   
    boton1 = document.getElementById("boton1");  
}
/** Parcial2
 * Funcion que realiza la tralacion 
 * se obtiene los valores para trasladar se obtiene de los inputs de la pagina
 */
function trasladar(){
    if(!validarNumeros(Number(num1.value),Number(num2.value))){
        return false;
    }else if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    image4 = context1.getImageData(0,0, canvas1.width,canvas1.height);
    var pixelesRes = image4.data;
    imagenNegro(image4);
    for( var j = 0 ; j< image3.height; j++){
        for (var i = 0 ; i < image3.width; i++){ 
           var tempx = i + Number(num1.value);
           var tempy = j + Number(num2.value);
           
           if(tempx>=0 && tempx<image3.width && tempy>=0 && tempy<image3.height){
                pixelesRes[tempy*image4.width*4 + tempx*4] = pixeles[j*image3.width*4 + i*4];
                pixelesRes[tempy*image4.width*4 + tempx*4 +1] = pixeles[j*image3.width*4 + i*4 +1]
                pixelesRes[tempy*image4.width*4 + tempx*4 +2] = pixeles[j*image3.width*4 + i*4 +2]
           }
        } 
    }

    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image4,0,0);
}
/** Parcial 2
 * Funcion que aumenta el tama??o de una imagen
 * valor: aumento de la imagen : 2,4,8
 */
function escalar(valor) {
    limpiarResultado();
    canvas1.className = "zonaSeleccion";
    canvas3.className ="zonaSeleccion"; 
    if(valor == 2){
        canvas3.style.setProperty("--ancho", '800px');
        canvas3.style.setProperty("--alto", '600px');
        canvas3.style.setProperty("--margen-izquierdo", '50px');
    }else if(valor == 4){
        canvas3.style.setProperty("--ancho", '1100px');
        canvas3.style.setProperty("--alto", '800px');
        canvas3.style.setProperty("--margen-izquierdo", '60px');
    }else if(valor == 8){
        canvas3.style.setProperty("--ancho", '1400px');
        canvas3.style.setProperty("--alto", '1200 px');
        canvas3.style.setProperty("--margen-izquierdo", '300px');
    }
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    // se crea la imagen aumentando su tama??o
    image4 = context1.createImageData(image3.width*valor, image3.height*valor);
    imagenNegro(image4);
    var ancho = image4.width*4;
    var pixelesRes = image4.data;
    var saltaColumnas= 0; // indica cuantos pixeles se tiene que saltar en cuanto a columnas
    var saltaFilas =0;
    for( var j = 0 ; j< image3.height; j++){
        saltaFilas = (valor-1)*j * ancho;
        for (var i = 0 ; i < image3.width; i++){   
            saltaColumnas = (valor-1)*i;
            for(var l=0; l<valor;l++){ 
                for(var m=0; m<valor; m++){
                    var nuevaIntensidad = interpolacionBilineal({x:i,y:j},{x:i+1,y:j},{x:i,y:j+1},{x:i+1,y:j+1},i+1/(m+1),j+1/(l+1),image3);
                    pixelesRes[l*ancho + (m*4) + (j*ancho + i*4) +saltaFilas + (saltaColumnas*4)] = /*pixeles[j*image3.width*4 + i*4];*/nuevaIntensidad.R;
                    pixelesRes[l*ancho + (m*4) + (j*ancho+ i*4) +saltaFilas + (saltaColumnas*4) +1] = /*pixeles[j*image3.width*4 + i*4 +1];*/nuevaIntensidad.G;
                    pixelesRes[l*ancho + (m*4) + (j*ancho+ i*4)+ saltaFilas + (saltaColumnas*4) +2] = /*pixeles[j*image3.width*4 + i*4 +2];*/nuevaIntensidad.B;
                }
            } 
        }
    }
    canvas3.width = image4.width;
    canvas3.height = image4.height;
    context3.putImageData(image4,0,0);
}
/** Parcial2
 * Funcion para desplegar las configuraciones de rotaci??n
 */
 function rotacionConfig(){
    limpiarResultado();
    notas.innerHTML = "En la pantalla se muestran un trackBar para designar el angulo a rotar.\<br/>"+
                        "El angulo podra ir desde 0 hasta 360.\<br/>";
    /* a??ade el trackbar para determinar el angulo de rotacion*/
    configuracion.appendChild(sliderContainer);
    output.innerHTML = slider.value;
     //mostrar la imagen original 
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    var escalaGris= true;
    if(escalaGris){
        gris();
    }
    context3.putImageData(image3,0,0);
}
slider.oninput = function() {
    var grados = Number(slider.value);
    output.innerHTML = grados;
    //dimensiones de la imgen originales
    var filas = image3.height;
    var columnas = image3.width;
    //console.log("filas: " + filas);
    //console.log("col: " + columnas);
    //nuevas dimensiones de la imagen 
    var nDF = filas * Math.abs(coseno(grados)) + columnas * Math.abs(seno(grados));
    //console.log("seno : " + Math.sin(grados * Math.PI/180).toFixed(10))
    //console.log("cos: " +Math.cos(grados * Math.PI/180).toFixed(10) )
    var nDC = filas * Math.abs(seno(grados)) + columnas * Math.abs(coseno(grados));
    //console.log("nDC: " + nDC);
    //console.log("nDF: " + nDF);
    //crear la nueva imagen
    image4 = context2.createImageData(nDC,nDF);
   // console.log("image4.whidt: " + image4.width);
   // console.log("image4.heigt: " + image4.height);
    var pixelesRes = image4.data;
    //console.log( image4.data);
   // console.log("pixeles: " + image4.width*image4.height)
    //calcular el centro de la nueva imagen
    var refx = nDC/2;
    var refy = nDF/2;
    //calcular el despalzamiento respecto al centro de las imagenes
    var xoffset = refx - columnas/2;
    var yoffset = refy - filas/2;
    //console.log("xoffset: " + xoffset);
    //console.log("yoffset: " + yoffset);
    //realizar el mapeo de los nuevos pixelesRes
    imagenNegro(image4); 
    var ban = 0;  
    for( var j = 0 ; j< image3.height; j++){
        for (var i = 0 ; i < image3.width; i++){   //x es y, y es x
            //obtener las nuevas posiciones
            var nuevax = i - refx + xoffset;
            var nuevay = j - refy + yoffset;
            //corregir los indices
            var xprima = refx + nuevax * coseno(grados) + nuevay * seno(grados);
            var yprima = refy +  nuevax * -seno(grados) + nuevay * coseno(grados);
            var tempxprima = xprima;
            var tempyprima = yprima;
            xprima = Math.floor(xprima);
            yprima = Math.floor(yprima);
            if(xprima>=0 && xprima<nDC && yprima>=0 && yprima<nDF){             
                pixelesRes[yprima*image4.width*4 + xprima*4] = pixeles[j*image3.width*4 + i*4] //nuevaIntensidad.R;
                pixelesRes[yprima*image4.width*4 + xprima*4 +1] = pixeles[j*image3.width*4 + i*4 +1] //nuevaIntensidad.G;
                pixelesRes[yprima*image4.width*4 + xprima*4 +2] = pixeles[j*image3.width*4 + i*4 +2] //nuevaIntensidad.B;
            }
            xprima = tempxprima;
            yprima = tempyprima;
            //interpolar para enconcontrar los indices y evitar tantos pixeles sin asignar
            var punto11 = {x:Math.floor(xprima), y:Math.floor(yprima)};
            var punto12 = {x:Math.floor(xprima), y:Math.ceil(yprima)};
            var punto21 = {x:Math.ceil(xprima), y:Math.floor(yprima)};
            var punto22 = {x:Math.ceil(xprima), y:Math.ceil(yprima)};

            var R1 = {x:xprima, y:interpolacionX(punto11,punto21,xprima)};
            var R2 = {x:xprima, y:interpolacionX(punto12,punto22,xprima)};
            var fraccionY =  yprima - R1.y;
            var unoMenosfraccionY = 1 - fraccionY;
            var yAux = unoMenosfraccionY * R1.y + fraccionY*R2.y;
            var P  = {x:interpolacionY(R1,R2,yAux), y:yAux};
           //   var nuevaIntensidad = interpolacionBilineal(punto11,punto21,punto12,punto22,P.x,P.y,image3);
            xprima = Math.round(P.x);
            yprima = Math.round(P.y);
            if(ban==0){
                //var nuevaIntensidad = interpolacionBilineal(punto11,punto21,punto12,punto22,P.x,P.y,image3);
                console.log("xprima: " + xprima);
                console.log("yprima: " + yprima);      
                ban =2
            }
   
           if(xprima>=0 && xprima<nDC && yprima>=0 && yprima<nDF){             
                pixelesRes[yprima*image4.width*4 + xprima*4] = pixeles[j*image3.width*4 + i*4] //nuevaIntensidad.R;
                pixelesRes[yprima*image4.width*4 + xprima*4 +1] = pixeles[j*image3.width*4 + i*4 +1] //nuevaIntensidad.G;
                pixelesRes[yprima*image4.width*4 + xprima*4 +2] = pixeles[j*image3.width*4 + i*4 +2] //nuevaIntensidad.B;
           }
        } 
    }
    //console.log( image4.data);
    canvas3.width = image4.width;
    canvas3.height = image4.height;
    context3.putImageData(image4,0,0);
}

/* Funciones para realizar algunas operaciones */

/* Poner el arregle en ceros */
function limpiarArreglo(arreglo){
    for( var i=0; i< arreglo.length; i++){
        arreglo[i]=0;
    }
}

/* Contar las veces que se repite la intensidad de una imagen */
function contarIntensidad(image){
    pixeles = image.data;
    numPixeles = image.width * image.height;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        contIntensidad[pixeles[i]]++;
    }  
}

/* Encontrar la intensidad mayor y menor del histograma */
function valoresIntensidad(){
    var banMenor = 0;
    var banMayor = 0;
    var j,i
    for( i=0, j=255 ; i< contIntensidad.length; i++,j--){
        if(contIntensidad[i] !=0 && banMenor ==0){
            valorActual = i;
            banMenor = 1;
        }
        if(contIntensidad[j] !=0 && banMayor ==0){
            valorMaximo = 255-j;
            banMayor = 1;
        }
    }
    valorMaximo+=valorActual;
}
/* Comprueba y limpia los elementos del resultado */
function limpiarResultado(){
    if(configuracion.contains(document.getElementById("boton1"))){
        configuracion.removeChild(document.getElementById("boton1"));
    }
    if(configuracion.contains(document.getElementById("boton2"))){
        configuracion.removeChild(document.getElementById("boton2"));
    }
    while(configuracion.contains(document.getElementById("texto"))){
        configuracion.removeChild(document.getElementById("texto"));
    }
    if(configuracion.contains(document.getElementById("textoE"))){
        configuracion.removeChild(document.getElementById("textoE"));
    }
    if(configuracion.contains(document.getElementById("num1"))){
        configuracion.removeChild(document.getElementById("num1"));
    }
    if(configuracion.contains(document.getElementById("num2"))){
        configuracion.removeChild(document.getElementById("num2"));
    }
    if(configuracion.contains(document.getElementById("matriz"))){
        configuracion.removeChild(document.getElementById("matriz"));
    }
    if(configuracion.contains(sliderContainer)){
        configuracion.removeChild(sliderContainer);
        slider.value = 0;
    }
    if(configuracion.contains(divTrackbar)){
        configuracion.removeChild(divTrackbar);
        trackbar.value = 0;
    }
    if(configuracion.contains(divPixel)){
        configuracion.removeChild(divPixel);
    }
    notas.innerHTML = "";
    context3.clearRect(0, 0, canvas3.width, canvas3.height);
    context4.clearRect(0, 0, canvas4.width, canvas4.height);
    context5.clearRect(0, 0, canvas5.width, canvas5.height);
    context6.clearRect(0, 0, canvas6.width, canvas6.height);
    banSeleccionZona = 0;
    canvas1.className = "responsive";
    canvas3.className = "responsive";
    canvas4.className = "responsive";
    clearInterval(capturarIamgen); //// se limpia el intervalo para que se deje de ejecutar la funcion 
    if (typeof stream !== 'undefined') { 
        stream.getTracks()[0].stop();
        console.log("desactivar camara");
    }

}
function gris(){
    for (var i = 0; i < numPixeles*4; i+=4){ 
        var instensidad = 0.21*pixeles[i] + 0.7*pixeles[i+1] + 0.07*pixeles[i+2];
        pixeles[i] = pixeles [i+1] = pixeles[i+2] = instensidad;
        contIntensidad[pixeles[i]]++;
    }
}

/*
calcula la intensidad maxima de un arreglo de pixeles
    recibe el arreglo de los pixeles
    retorna el valor maximo
*/
function maximaIntensidad(pixeles){
    var max = 0;
    for ( var i=0; i<pixeles.length; i++){
        if (max < pixeles[i] && i%3 != 0){ // i%3 se agrega para evitar el canal de opacidad
            max = pixeles[i];
        }   
    }
    return max;
}
/*
calcula la intensidad minima  de un arreglo de pixeles
    recibe el arreglo de los pixeles
    retorna el valor maximo
*/
function minimaIntensidad(pixeles){
    var min = pixeles[0];
    for ( var i=0; i<pixeles.length; i++){
        if (min > pixeles[i] && i%3 != 0){ // i%3 se agrega para evitar el canal de opacidad
            min = pixeles[i];
        }   
    }
    return min;
}
/*
    Suma o resta los pixeles de una imagen y los coloca un en arreglo pixelesRes
    1: Suma
    2: resta
*/
function operacion(pixeles,pixeles2,numPixeles,pixelesRes,op){
    for(var i=0; i<numPixeles*4; i+=4){
        if(op ==1){
            var resultadoR = pixeles[i] + pixeles2[i];
            var resultadoG = pixeles[i+1] + pixeles2[i+1];
            var resultadoB = pixeles[i+2] + pixeles2[i+2];
        }else{
            var resultadoR = pixeles[i] - pixeles2[i];
            var resultadoG = pixeles[i+1] - pixeles2[i+1];
            var resultadoB = pixeles[i+2] - pixeles2[i+2];
        }
        pixelesRes[i] = resultadoR;
        pixelesRes[i+1] = resultadoG;
        pixelesRes[i+2] = resultadoB;
        pixelesRes[i+3] = pixeles[i+3];
    }
}

/* 
suma el contenido de la matriz si es menor o igual a cero regresa 1 
*/
function sumaMatriz(matriz){
    var sum = 0;
    var tam = matriz.length;
    for(var i = 0; i<tam;i++){
        sum+=matriz[i];
    }      
    return sum <=0? 1: sum;
}

// crea una matirz de 1 del tama??o que se le envie
function crearMatriz(tam){
    var matriz= Array(tam*tam);
    for(var i = 0; i<tam*tam;i++){
        matriz[i]=1;
    }
    return matriz;
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

function coseno(x){
    return Math.cos(x * Math.PI/180);

}
function seno(x){
    return Math.sin(x * Math.PI/180);
}
/** Encuentra la coordenada y
 * punto1 : coordenadas del primer punto
 * punto12: coordenadas del segundo punto
 * x: coordenada x del punto requerido
 * regresa la coordena y del punto requerido
 */
function interpolacionX(punto1,punto2,x){
    var y;
    var divisor = punto2.x-punto1.x == 0 ? 1 : punto2.x-punto1.x;
    y = punto1.y + ((punto2.y-punto1.y )/(divisor) * (x-punto1.x));
    return y;
}

function interpolacionY(punto1,punto2,y){
    var x;
    var divisor = punto2.y-punto1.y  == 0 ? 1 : punto2.y-punto1.y;
    x = punto1.x + ((punto2.x-punto1.x)/(divisor) * (y-punto1.y));
    return x;
}
/** Funcion que retorna el nuevo nivel de intensidad dado los cuatro puntos vecinos al punto obtenido x,y */
function interpolacionBilineal(punto1,punto2,punto3,punto4,x,y,image){

    var imageData = image.data;
    var fraccionX = x - punto1.x;
    var fraccionY = y - punto1.y;
    var unoMenosfraccionX = 1 - fraccionX;
    var unoMenosfraccionY = 1 - fraccionY;

    //obtenemos las intencidades de R1
    var rp1 = Math.round(fraccionX * imageData[punto1.y*image.width*4 + punto1.x *4] + unoMenosfraccionX * imageData[punto2.y*image.width*4 + punto2.x*4]);
    var gp1 = Math.round(fraccionX * imageData[punto1.y*image.width*4 + punto1.x *4 +1] + unoMenosfraccionX * imageData[punto2.y*image.width*4 + punto2.x*4 +1]);
    var bp1 = Math.round(fraccionX * imageData[punto1.y*image.width*4 + punto1.x *4 +2] + unoMenosfraccionX * imageData[punto2.y*image.width*4 + punto2.x*4 +2]);
    //obtenemos las intencidades de R2
    var rp2 = Math.round(fraccionX * imageData[punto3.y*image.width*4 + punto3.x *4] + unoMenosfraccionX * imageData[punto4.y*image.width*4 + punto4.x*4]);
    var gp2 = Math.round(fraccionX * imageData[punto3.y*image.width*4 + punto3.x *4 +1] + unoMenosfraccionX * imageData[punto4.y*image.width*4 + punto4.x*4 +1]);
    var bp2 = Math.round(fraccionX * imageData[punto3.y*image.width*4 + punto3.x *4 +2] + unoMenosfraccionX * imageData[punto4.y*image.width*4 + punto4.x*4 +2]);
    //obtenemos las intencidades del punto que queremos encontrar
    var rp3 = Math.round(fraccionY * rp1 + unoMenosfraccionY * rp2);
    var gp3 = Math.round(fraccionY * gp1 + unoMenosfraccionY * gp2);
    var bp3 = Math.round(fraccionY * bp1 + unoMenosfraccionY * bp2);
    return {R:rp3, G:gp3, B:bp3};
}
/**Factorial de un numero */
function factorial (num){
	var total = 1; 
	for (i=1; i<=num; i++) {
		total = total * i; 
	}
	return total; 
}
/** Funcion para crear una matriz de inputs 
 * Serviran para obtener los datos de la matriz filtro
 */
/* function creaMatriz(tam){
    const dimension = tam;
    matrizInput.id = "matriz" ;
    configuracion.appendChild(matrizInput);
    if(banMatriz == 0){
        var NumeroDiv = 1	//se usara para nombrar el id de cada un de los cuadros para poder manipularlos mas facil despues
        for(var i=0; i<dimension; i++){	//for para crear las filas
            var fila = document.createElement("div");	// se crea el div de la fila
            fila.id="fila";
            fila.className= ("fila" );	// se le agrega una clase 
                for(var j=0; j<dimension; j++){	//for para agregar los cuadros pertenecientes a la columna
                    var cuadro = document.createElement('input'); 
                    cuadro.type = 'number'; 
                    cuadro.id = NumeroDiv;
                    cuadro.className = "tam";
                    fila.appendChild(cuadro);	//se a??ade cada cuadro a el div fila
                    NumeroDiv++;
            }// fin for de los cuadros 
            matrizInput.appendChild(fila);	// se a??ade la fila al div tablero
        }// fin for de las filas
        banMatriz = 1;
    }
}*/

/* Funciones para realizar algunas validaciones */

/* Valiada el rango que hay en la funcion pintar(); 
    Compruena que ambos numeros sean entre 0-255
    y que num2 no sea menor que num1
*/
function validarZona(num1,num2){
    if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    texto= document.createElement("p");
    texto.id = "textoE";
    if ((num1 > 255 || num1 < 0) || (num2 > 255 || num2 < 0)) {
        texto.textContent ="Numero fuera de rango (0-255)"; // mostrar el mensaje de error
        configuracion.appendChild(texto);
        return false;
    } 
    if(num2 < num1){
        texto.textContent ="El segundo numero debe de ser mayor al primero";
        configuracion.appendChild(texto);
        return false;
    }
    
    return true;
}

//valida que no vengan vacio los numeros
function validarNumeros(num1,num2){
    if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    texto= document.createElement("p");
    texto.id = "textoE";
    if(isNaN(num1) || isNaN(num2)){
        texto.textContent ="Faltan datos"; // mostrar el mensaje de error
        configuracion.appendChild(texto);
        return false;
    }
    return true;
}

function validarDesenfocar(num){
    if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    texto= document.createElement("p");
    texto.id = "textoE";
    if(num%2 == 0 || num< 0){
        texto.textContent ="El numero debe ser un positivo impar"; // mostrar el mensaje de error
        configuracion.appendChild(texto);
        return false;
    }
    return true;
}

function validarMediana(num){
    if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    texto= document.createElement("p");
    texto.id = "textoE";
    if(num%2 != 0 || num< 0){
        texto.textContent ="El numero debe ser un positivo par"; // mostrar el mensaje de error
        configuracion.appendChild(texto);
        return false;
    }
    return true;
}

/*function validarTrazar(datos){
    if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    texto= document.createElement("p");
    texto.id = "textoE";
    for (var i=0; i <9; i++){
        console.log(datos[i].value)
        if(isNaN(Number(datos[i].value)) || datos[i].value == null || datos[i].value == ""){
            texto.textContent ="Datos incompletos"; // mostrar el mensaje de error
            configuracion.appendChild(texto);
            return false;
        }
    }
    return true;
}*/
/** aparte de validar llena la matriz y el tama??o*/
function validarTrazar(datos,matriz){
    if(document.body.contains(document.getElementById("textoE"))){ //eliminar el mensaje de error en caso de ser necesario
        configuracion.removeChild(document.getElementById("textoE"));
    }
    var indice = 0;
    texto= document.createElement("p");
    texto.id = "textoE";
    var filas = datos.split("\n");
    var tam = filas.length;
    if(tam %2 ==0){
        texto.textContent = "La matriz debe ser de dimension impar" 
        configuracion.appendChild(texto);
        return false;
    }
    for(var i=0; i<tam; i++){
        var elemento = filas[i].split(" ");
        if(elemento.length != tam){
            texto.textContent = "Datos incompletos, en la fila" 
            configuracion.appendChild(texto);
            return false;
        }
        for(var j=0; j<tam; j++){
            matriz[indice] = Number(elemento[j]);
            indice++;
        }
    }
    //console.log(matriz);
    return true;
}
