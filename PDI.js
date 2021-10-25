/* Creamos variables para las imagenes a mostrar*/
var image1 = new Image();
var image2 = new Image();
var image3 = new Image();
/* Variables para obtener informacion de las imagenes */
var pixeles;
var numPixeles;
var contIntensidad = Array(256);
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
    // Grosor de línea
    context4.lineWidth = 1;
    // Color de línea
    context4.strokeStyle = "#212121";
    // Color de relleno
    context4.fillStyle = "#F4511E";
    for(var i=0;i<contIntensidad.length;i++){
        var alto = (contIntensidad[i]/max) * y;
        // x y anchura altura
        context4.rect(x, y-alto, 2, alto);
        // Hacemos que se dibuje
        context4.stroke();
        // Lo rellenamos
        context4.fill();
        x+=4;
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
    // Grosor de línea
    context.lineWidth = 1;
    // Color de línea
    context.strokeStyle = "#212121";
    // Color de relleno
    context.fillStyle = "#F4511E";
    var max = Math.max(...contIntensidad);
    for(var i=0;i<contIntensidad.length;i++){
        var alto = (contIntensidad[i]/max) * y;
        // x y anchura altura
        context.rect(x, y-alto, 2, alto);
        // Hacemos que se dibuje
        context.stroke();
        // Lo rellenamos
        context.fill();
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