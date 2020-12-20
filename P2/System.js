/*

  La clase central del proyecto. Aquí se gestionan los elementos comunes de cada nivel y se genera el vector de niveles.
  La escena principal del juego se encuentra aquí y cada nivel variará según los Object3D.

  Vamos a comenzar haciendo un único nivel y cuando este funcione haremos varios niveles.
  Para el avance de los niveles actualmente hay dos ideas:
  - Añadir y quitar el nivel i de la escena de nuestro sistema conforme vayamos avanzado. Mi preferencia.
      + Debería de ser con un this.nivelActual=this.niveles[i];
      + Crear cada nivel conforme vayamos avanzando vs Crearlos todos al inicio.
  - Estar todos puestos y cambiar la posición de la cámara. Se usa en varios juegos pero me parece cutre.

  Para las colisiones luego te comento lo que he pensado.


*/

class System extends THREE.Scene{
  constructor(myCanvas) {
    super();


    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Creamos las luces.
    this.createLights();

    // Creamos la cámara.
    this.createCamera();

    this.niveles = this.defineNiveles();

    this.indiceNivel = 0;

    this.actualizarNivel(); // Define y actualiza el valor de this.nivelActual

    var that = this;
    window.addEventListener("keypress", (event) => that.nivelActual.eventos(event));

  }

  /*
    Aquí definiremos los distintos parámetros que crearán los distintos niveles.
  */
  defineNiveles(){
    var niveles = new Array();
    /*
      Colores disponibles:
        Coral -> 0xff7f50
        CornflowerBlue -> 0x6495ed
        Chartreuse -> 0x7fff00
        DarkOrange -> 0xff8c00
        DarkOrchid -> 0x9932cc
        GreenYellow -> 0xadff2f
        SpringGreen -> 0x00ff7f
        LemonChiffon -> 0xfffacd
    */

    /*var prueba = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25,0,0),
      new THREE.Vector3(25,0,0)
    ]);

    var coloresBolas = [0xff7f50,0x6495ed,0x7fff00,0xff8c00];
    var posDisparador = new THREE.Vector3(0,1,-10);
    niveles.push(new contVarNiveles(20,coloresBolas,prueba,posDisparador,5)); //numBolas y velocidad

    /*
      Nivel 1
    */
    var nivel1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25,0,10),
      new THREE.Vector3(-15,0,-10),
      new THREE.Vector3(5,0,10),
      new THREE.Vector3(25,0,-10)
    ]);

    var coloresBolas = [0x7fff00,0xff8c00];
    var posDisparador = new THREE.Vector3(5,1,-10);

    niveles.push(new contVarNiveles(20,coloresBolas,nivel1,posDisparador,5)); //numBolas y velocidad


    /*
      Nivel 2
    */
    var nivel2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25,0,-20),
      new THREE.Vector3(-15,0,10),
      new THREE.Vector3(10,0,20),
      new THREE.Vector3(15,0,15),
      new THREE.Vector3(5,0,-15),
      new THREE.Vector3(18,0,-18),
      new THREE.Vector3(25,0,0)
    ]);

    var coloresBolas = [0x6495ed,0x7fff00,0xff8c00];
    var posDisparador = new THREE.Vector3(-5,1,-5);

    niveles.push(new contVarNiveles(25,coloresBolas,nivel2,posDisparador,5));

    /*
      Nivel 3
    */
    var nivel3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5,0,-25),
      new THREE.Vector3(-17,0,-10),
      new THREE.Vector3(-21,0,20),
      new THREE.Vector3(-15,0,23),
      new THREE.Vector3(-5,0,10),
      new THREE.Vector3(5,0,15),
      new THREE.Vector3(15,0,10),
      new THREE.Vector3(25,0,-10)
    ]);

    var coloresBolas = [0xff7f50,0x6495ed,0x7fff00,0xff8c00];
    var posDisparador = new THREE.Vector3(5,1,-10);

    niveles.push(new contVarNiveles(30,coloresBolas,nivel3,posDisparador,5));

    /*
      Nivel 4
    */
    var nivel4 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20,0,-25),
      new THREE.Vector3(-15,0,-5),
      new THREE.Vector3(-21,0,10),
      new THREE.Vector3(-15,0,15),
      new THREE.Vector3(-10,0,21),
      new THREE.Vector3(5,0,15),
      new THREE.Vector3(10,0,10),
      new THREE.Vector3(5,0,5),
      new THREE.Vector3(-5,0,-10),
      new THREE.Vector3(5,0,-20),
      new THREE.Vector3(25,0,10)
    ]);

    var coloresBolas = [0xff7f50,0x6495ed,0x7fff00,0xff8c00];
    var posDisparador = new THREE.Vector3(-5,1,5);

    niveles.push(new contVarNiveles(35,coloresBolas,nivel4,posDisparador,5));

    /*
      Nivel 5
    */
    var nivel5 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(25,0,-20),
      new THREE.Vector3(15,0,-18),
      new THREE.Vector3(5,0,-22),
      new THREE.Vector3(-5,0,-10),
      new THREE.Vector3(5,0,0),
      new THREE.Vector3(5,0,5),
      new THREE.Vector3(-10,0,0),
      new THREE.Vector3(-15,0,3),
      new THREE.Vector3(-18,0,8),
      new THREE.Vector3(-15,0,17),
      new THREE.Vector3(-5,0,12),
      new THREE.Vector3(15,0,15),
      new THREE.Vector3(21,0,0),
      new THREE.Vector3(12,0,-5),
      new THREE.Vector3(10,0,-10),
      new THREE.Vector3(25,0,-15)
    ]);

    var coloresBolas = [0xff7f50,0x6495ed,0x7fff00,0xff8c00,0xfffacd];
    var posDisparador = new THREE.Vector3(5,1,-10);

    niveles.push(new contVarNiveles(40,coloresBolas,nivel5,posDisparador,5));

    return niveles;
  }

  /*
    FIXME: Actualmente es copypaste de la P1.
    Hay que configurarlo para el tema de SOMBRAS, LUCES, etc....
    Últimos temas de teoría.
  */
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }


  /*
    FIXME: Actualmente es copypaste de la P1.
    Hay que configurarlo para el tema de SOMBRAS, LUCES, etc....
    Últimos temas de teoría.
  */
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);

    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5);//this.guiControls.lightIntensity );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }

  /*
    FIXME: Actualmente es copypaste de la P1.
    Hay que configurarlo para el tema de SOMBRAS, LUCES, etc....
    Últimos temas de teoría.
  */
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (0, 60, 1);// P2: Queremos verlo desde arriba.
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new THREE.TrackballControls (this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }

  /*
    COPYPASTE P1 8D
  */
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  /*
    COPYPASTE P1 8D
  */
  update () {
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.

    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.camera);

    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    //this.spotLight.intensity = this.guiControls.lightIntensity;

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();

    // Se actualiza el resto del modelo
    this.nivelActual.update();
  }

  actualizarNivel(){
    if (typeof this.nivelActual != "undefined") {
      this.remove(this.nivelActual);
    }

    /*var that=this;

    var onAfter =function(renderer,scene,camera,geometry,material,group) {
      console.log("Entro");
      that.nivelActual.iniciarAnimacion();
    };*/
    if (this.indiceNivel < this.niveles.length) {
      this.nivelActual = new Nivel(
        this.niveles[this.indiceNivel].numBolas,
        this.niveles[this.indiceNivel].coloresBolas,
        this.niveles[this.indiceNivel].spline,
        this.niveles[this.indiceNivel].posDisparador,
        this.niveles[this.indiceNivel].velocidad
      );

      this.indiceNivel++;
      this.add(this.nivelActual);
      //this.nivelActual.onAfterRender=onAfter;
    }else {
      displayEndGame();
    }

  }

  reintentar(){
    this.indiceNivel = 0;
    this.actualizarNivel();
    displayEndGame();
  }
}

/*
  Para ahorrar líneas de código, crea un elemento del vector niveles con
  los parámetros indicados.
*/
class contVarNiveles {
    constructor(numBolas,coloresBolas,spline,posDisparador,velocidad) {
      this.numBolas=numBolas;
      this.coloresBolas=coloresBolas;
      this.spline=spline;
      this.posDisparador=posDisparador;
      this.velocidad=velocidad;
    }
  }


 class Juego {
   constructor() {

   }

   nuevoJuego(){
     if (typeof this.sistema == "undefined") {
        this.sistema = new System("#WebGL-output");
        var startgame = document.getElementById('StartGame');
        startgame.style.display = "none";

        // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
        window.addEventListener ("resize", () => this.sistema.onWindowResize());

        // Que no se nos olvide, la primera visualización.
        this.sistema.update();
     }else {
       this.sistema.reintentar();
     }
   }
 }

 function siguienteNivel(juego){
   juego.sistema.actualizarNivel();
 }
  var juego = new Juego();
