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
var nuevoBoton = document.createElement('button'); 
var texto = document.createElement("p");
var nuevoNumero;
//recupera los botones que desplazan al histograma
var boton1;
var boton2;
//recupera los inputs con los numeros para seleccionar una parte del histograma a pintar
var num1;
var num2;
var banSeleccionZona = 0 ; // indica si se va a empezar a realizar la funcion seleccionZona
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
    colorHexa = event.target.value;
    //console.log(colorHexa);
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
function seleccionZona(){
    //escalaGris(true);
    limpiarResultado(); //
    image3 = context1.getImageData( 0, 0, canvas1.width, canvas1.height );//
    canvas3.height = image3.height;//
    canvas3.width = image3.width; //
    context3.putImageData(image3,0,0);//
    banSeleccionZona = 1;
    //se cambia la clase para tener mayor control al momento de normalizar la posicion del mouse
    canvas3.className = "zonaSeleccion";
    canvas4.className = "zonaSeleccion";
}
//funcion que se ejecuta con el clic del mouse
function clic(event){
    const rect = canvas3.getBoundingClientRect();
    if(banSeleccionZona == 1){
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
            gris();//
            for( var j = Math.ceil(posyInicial) ; j< Math.ceil(posyFinal); j++){
                for (var i = Math.ceil(posxInicial) ; i < Math.ceil(posxFinal); i++){ 
                    pixeles[j*image4.width*4 + i*4] = pixelesC[j*image4.width*4 + i*4];
                    pixeles[j*image4.width*4 + i*4+1] = pixelesC[j*image4.width*4 + i*4+1];
                    pixeles[j*image4.width*4 + i*4+2] = pixelesC[j*image4.width*4 + i*4+2];
                } 
            }
            
            canvas4.width = image4.width;
            canvas4.height = image4.height;
            context4.putImageData(image4,0,0);
        }
    }
}
//funcion que se ejecuto con el evento del movimiento del mouse
function zonaSeleccionada(event){
    if(banSeleccionZona == 1){
        if(click){
            const rect = canvas3.getBoundingClientRect();
            context3.putImageData(image3,0,0); // para que solo muestre un rectangulo se debe poner otra vez la imagen
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
/* Pinta la zona seleccionada, se deben pasar parametros en dos textos 
*/
function pintarZona(){
    mostrarHistogramaGris(true);
    /* Crear los inputs para leer los datos que delimitan la intensidad */
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.min= 0; 
    nuevoNumero.max = 255;
    nuevoNumero.placeholder = 0;
    configuracion.appendChild(nuevoNumero); 
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num2";
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
/*
    Suma dos imagenes
    1: si sobrepasa 255 se regresa el valor a 255
    2: Se normalizasa la suma
*/
function sumaImagen(tipo){
    limpiarResultado();
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
/*
    Resta dos imagenes
    1: toma el valor absoluto de la resta
    2: Se normalizasa la resta
*/
function restaImagen(tipo){
    limpiarResultado();
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
/* Filtro de la media (desenfocar una imagen), la matriz con la que se aplica el filtro debe de ser de puros 1
*/
function filtroMedio(){
    limpiarResultado();
    texto.textContent = "Desenfoque (# impares)";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = 0;
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
    image3 = context1.getImageData(0,0, canvas1.width,canvas1.height);
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    var pixelCambio; // pixel al que se debe poner el resultado de la operacion (pixel medio de la matriz) 
    var tam = num1.value;
    var filtro = crearMatriz(tam);
    console.log(filtro);
    var sum = sumaMatriz(filtro);
    console.log(sum);
    //console.log(tam);
    //console.log(i!=image3.width-(tam -1));
    //console.log(j!=image3.height-(tam-1));
   for( var j = 0 ; j< image3.height; j++){
        for (var i = 0 ; i < image3.width; i++){ 
            if((i!=image3.width-(tam -1)) && (j!=image3.height-(tam-1)) ){ // no se desborde tanto a lo alto como a lo ancho
                var intensidadR=0;
                var intensidadG=0;
                var intensidadB=0;
                for(var l=0; l<tam;l++){
                    for(var m=0; m<tam; m++){
                        // se suman para obtener la parte de la matriz que queremos 
                        ////////////////////////////////         (renglon matriz)+(renglon imagen)    + (columna matriz)+(columna imagen)
                        intensidadR += filtro[l*tam + m] * pixeles[((l*image3.width*4)+(j*image3.width*4)) + (m*4) + (i*4) ];
                        intensidadG += filtro[l*tam + m] * pixeles[((l*image3.width*4)+(j*image3.width*4)) + (m*4) + (i*4) +1];
                        intensidadB += filtro[l*tam + m] * pixeles[((l*image3.width*4)+(j*image3.width*4)) + (m*4) + (i*4) +2];
                        if(l==Math.floor(tam/2) && m==Math.floor(tam/2)){
                            pixelCambio = (l*image3.width*4)+(j*image3.width*4) + (m*4) + (i*4);
                            //console.log("pixel" + pixelCambio);
                        }
                    }
                
                }
                pixeles[pixelCambio] = intensidadR/sum;
                pixeles[pixelCambio +1] = intensidadG/sum;
                pixeles[pixelCambio+2] = intensidadB/sum;
            }
        } 
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
}
/*
    Funciones para el filtro de traza de bordes
    
*/ 
function filtroBordes(){
    limpiarResultado();
    texto.textContent = "Tamaño bordes";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'number'; 
    nuevoNumero.id = "num1";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = 1;
    configuracion.appendChild(nuevoNumero); 
    num1 = document.getElementById("num1");

    texto = document.createElement('p'); 
    texto.textContent = "Tipo";
    texto.id = "texto";
    configuracion.appendChild(texto);
    nuevoNumero = document.createElement('input'); 
    nuevoNumero.type = 'text'; 
    nuevoNumero.id = "num2";
    nuevoNumero.className = "tam";
    nuevoNumero.placeholder = "vertical";
    configuracion.appendChild(nuevoNumero); 
    num2 = document.getElementById("num2");
     /* Crear el boton para que indique cuando quiere desenfocar */
     nuevoBoton = document.createElement('button'); 
     nuevoBoton.type = 'button'; 
     nuevoBoton.id = "boton1";
     nuevoBoton.className = "tam";
     nuevoBoton.innerText = 'Trazar'; 
     nuevoBoton.onclick = function(){trazar()}; 
     configuracion.appendChild(nuevoBoton);   
     boton1 = document.getElementById("boton1");  
}
/*
El numero que se lee de num2 significa
    0: bordes horizontales 
    1: bordes vericales 
    2: bordes diagonales 
    4: bordes totales
*/
function trazar(){
    image3 = context1.getImageData(0,0, canvas1.width,canvas1.height);
    pixeles = image3.data;
    numPixeles = image3.width * image3.height;
    var pixelCambio; // pixel al que se debe poner el resultado de la operacion (pixel medio de la matriz) 
    var tam = 3;
    var filtro = Array(tam*tam);
    limpiarArreglo(filtro);
    var valor = num2.value.toLowerCase();
    var tipoBorde = valor =="vertical" ? 7: (valor =="horizontal" ? 5 : valor =="diagonal" ? 8:4);
    filtro[4] = +num1.value;
    if(tipoBorde == 4){ // todos los bordes
        filtro[7] = -num1.value;
        filtro[5] = -num1.value;
        filtro[8] = -num1.value;
        filtro[4] = +num1.value*3; // para cacular los bordes totales se necesita mayor informacion del pixel de enmedio
    }else{ 
        filtro[tipoBorde] = -num1.value;
    }
    var sum = sumaMatriz(filtro);
    //console.log(filtro);
    //console.log(pixeles);
    //console.log(sum);
    //console.log(i!=image3.width-(tam -1));
    //console.log(j!=image3.height-(tam-1));
    var ban=0
   for( var j = 0 ; j< image3.height; j++){
        for (var i = 0 ; i < image3.width; i++){ 
            if((i!=image3.width-(tam -1)) && (j!=image3.height-(tam-1)) ){ // no se desborde tanto a lo alto como a lo ancho
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
                pixeles[pixelCambio] = Math.abs(intensidadR)/sum;
                //console.log("pixel " + pixeles[pixelCambio] )
                pixeles[pixelCambio +1] = Math.abs(intensidadG)/sum;
                pixeles[pixelCambio+2] = Math.abs(intensidadB)/sum;
            }
        } 
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    context3.putImageData(image3,0,0);
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
    if(document.body.contains(document.getElementById("texto"))){
        configuracion.removeChild(document.getElementById("texto"));
    }
    if(document.body.contains(document.getElementById("num1"))){
        configuracion.removeChild(document.getElementById("num1"));
    }
    if(document.body.contains(document.getElementById("num2"))){
        configuracion.removeChild(document.getElementById("num2"));
    }
    context3.clearRect(0, 0, canvas3.width, canvas3.height);
    context4.clearRect(0, 0, canvas4.width, canvas4.height);
    context5.clearRect(0, 0, canvas5.width, canvas5.height);
    context6.clearRect(0, 0, canvas6.width, canvas6.height);
    banSeleccionZona = 0;
    canvas3.className = "responsive";
    canvas4.className = "responsive";
}
function gris(){
    for (var i = 0; i < numPixeles*4; i+=4){ 
        var instensidad = 0.21*pixeles[i] + 0.7*pixeles[i+1] + 0.07*pixeles[i+2];
        pixeles[i] = pixeles [i+1] = pixeles[i+2] = instensidad;
        contIntensidad[pixeles[i]]++;
    }
}

/*calcula la intensidad maxima de un arreglo de pixeles
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
/*calcula la intensidad minima  de un arreglo de pixeles
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

// suma el contenido de la matriz si es menor o igual a cero regresa 1
function sumaMatriz(matriz){
    var sum = 0;
    var tam = matriz.length;
    for(var i = 0; i<tam;i++){
        sum+=matriz[i];
    }      
    return sum <=0? 1: sum;
}

// crea una matirz de 1 del tamaño que se le envie
function crearMatriz(tam){
    var matriz= Array(tam*tam);
    for(var i = 0; i<tam*tam;i++){
        matriz[i]=1;
    }
    return matriz;
}
