/* Creamos variables para las imagenes a mostrar*/
var image1 = new Image();
var image2 = new Image();
var image3 = new Image();
/* Variables para obtener informacion de las imagenes */
var pixeles;
var numPixeles;
var contIntensidad = Array(256); 
var contIntensidadG = Array(256);
var contIntensidadB = Array(256);
var valorActual, valorMaximo;
/* div para agregar configuraciones extras */
var configuracion = document.getElementById("configuracion");
var nuevoBoton = document.createElement('button'); 
var texto = document.createElement("p");
var boton1;
var boton2;
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
var canvas4 = document.getElementById('canvas4');
var context4 = canvas4.getContext( '2d' );

/* Recuperamos los colores elegidos */
var R1=0,G1=0,B1=0;
var R2=255,G2=255,B2=255;
var color1 = document.getElementById('color1');
color1.addEventListener('change', actualizarColor1); 
var color2 = document.getElementById('color2');
color2.addEventListener('change', actualizarColor2); 
/*Funciones para el cargado de imagenes */
function CargarImagen1(){
    limpiarResultado();
    image1.src = window.URL.createObjectURL(imagen1.files[0]);
 
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
}
function actualizarColor2(event){
    R2=16*letra(event.target.value[1])+letra(event.target.value[2]);
    G2=16*letra(event.target.value[3])+letra(event.target.value[4]);
    B2=16*letra(event.target.value[5])+letra(event.target.value[6]);
}
/* Funciones para el procesamiento de las imagenes*/
/* Convertir la imagen a escala de grises */
function escalaGris(){
    limpiarResultado();
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        var instensidad = 0.21*pixeles[i] + 0.7*pixeles[i+1] + 0.07*pixeles[i+2];
        pixeles[i] = pixeles [i+1] = pixeles[i+2] = instensidad;
        contIntensidad[pixeles[i]]++;
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
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
    escalaGris();
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
/* funcion para colorear la imgagen en forma de degradado */
function gradiente(){
    escalaGris();
    var r1 = R1/ 255.0;
    var g1 = G1/ 255.0;
    var b1 = B1/ 255.0;
    var r2 = R2/ 255.0;
    var g2 = G2/ 255.0;
    var b2 = B2/ 255.0;
    var dr = (r2 - r1) / image3.height;
    var dg = (g2 - g1) / image3.height;
    var db = (b2 - b1) / image3.height;
    for (var i = 0; i < numPixeles*4; i+=4){ 
        pixeles[i] *= r1;
        pixeles [i+1] *= g1;
        pixeles[i+2] *= b1;

        if(i>0 && i%(image3.width)==0){
            r1+=dr;
            g1+=dg;
            b1+=db;
        }
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
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
function mostrarHistogramaGris(){
    var x = 0;
    var y = 720;
    limpiarArreglo(contIntensidad);
    escalaGris();
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
    // Grosor de línea
    context3.lineWidth = 1;
    // Color de línea
    
    
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
    mostrarHistogramaGris();
    valoresIntensidad();
    if(valorActual == 0 && valorMaximo == 0){
        texto.textContent = "Esta imagen no se puede mover su histograma, pruebe con otra";
        texto.id = "texto";
        configuracion.appendChild(texto);
    }else{
        /* Crear los botones para aumentar o disminuir la luz (mover el histograma) */
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

        // se puede agregar lo de habilitar y deshabilitar botones que controlan el movimiento del histograma
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

        //se debe saltar las filas de acuerdo al tamaño (valor) a reducir
        if(i>0 && i%(image4.width)==0){
            a++;
            b=ancho*valor*a;
        }
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image4,100,0);
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
    if(document.body.contains(document.getElementById("boton1"))){
        configuracion.removeChild(document.getElementById("boton1"));
    }
    if(document.body.contains(document.getElementById("boton2"))){
        configuracion.removeChild(document.getElementById("boton2"));
    }
    if(document.body.contains(document.getElementById("texto"))){
        configuracion.removeChild(document.getElementById("texto"));
    }
    context4.clearRect(0, 0, canvas4.width, canvas4.height);
    context3.clearRect(0, 0, canvas3.width, canvas3.height);
}
