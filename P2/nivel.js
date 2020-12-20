class Nivel extends THREE.Object3D{
  constructor(numBolas,coloresBolas,spline,posDisparador,velocidad){
    super();
    // Animación bolas y camino a seguir
    this.spline = spline;
    this.velocidad = velocidad; // unidades/s
    this.splineLongitud = this.spline.getLength();//Para evitar hacer el cálculo todo el rato.
    this.tiempoFinRecorrido = this.splineLongitud/this.velocidad;
    this.animacion = true;//false;

    /*
     Utilizamos Octree para realizar las colisiones.
     Comenzamos construyendo el árbol.
     Nuestros elementos a considerar, las bolas, las añadimos en la función
     cuando aparezcan en el espacio. Es decir, cuando bola.avanzado>=0.
    */
    this.octree = new THREE.Octree({
      undeferred: false,
      depthMax: Infinity,
      objectsThreshold: 1,
      overlapPct: 0.2
    });

    // Elementos del nivel
    this.superficie = this.createSuperficie();

    this.coloresBolas=coloresBolas;
    this.bolas = this.createBolas(numBolas);

    this.disparador = this.createDisparador(posDisparador);

    this.decoraciones = this.createDecoraciones();

    this.add(this.superficie);
    this.add(this.bolas);
    this.add(this.disparador);

    /*var geometryLine= new THREE.Geometry();
    geometryLine.vertices = this.spline.getPoints(100);
    var visibleSpline= new THREE.Line(geometryLine,new THREE.LineBasicMaterial({color:0xff0000}));*/
    //this.add(this.decoraciones);

    //this.add(visibleSpline);

    //
    this.tiempoAnterior = Date.now();

  }

  createSuperficie(){
    // Creamos las geometrías con las que operaremos.
    var cuadrado = new THREE.BoxGeometry(50,1,50);
    //var circulo = new THREE.CircleGeometry(); Demasiado bonito como para ser cierto
    var shape= new THREE.Shape();
    shape.moveTo(-1,1);
    shape.quadraticCurveTo(-1,-1,0,-1);
    shape.quadraticCurveTo(1,-1,1,1);
    shape.quadraticCurveTo(1,1,0,1);
    shape.quadraticCurveTo(-1,1,-1,1);
    //shape.lineTo(-1,0.5);

    var semicirculo = new THREE.ExtrudeGeometry(
      shape,
      {bevelEnabled: false, steps: 90, extrudePath: this.spline}
    );

    // Operamos con las geometrías
    cuadrado.translate(0,-0.5,0);
    var base=new ThreeBSP(cuadrado)
      .subtract(new ThreeBSP(semicirculo))
      .toGeometry();

    // Creamos los objetos
    var plano = new THREE.Mesh(
      base,
      new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('../imgs/wood.jpg') } )
    );

    var camino = new THREE.Mesh(semicirculo, new THREE.MeshPhongMaterial({color: 0xf08080}));

    //var superficie = new THREE.Object3D();
    //superficie.position.set(0,-0.5,0);

    //superficie.add(plano);
    //this.add(camino);
    //plano.position.set(0,-0.5,0);
    plano.geometry.computeBoundingBox();

    return plano;
  }

  createDisparador(posDisparador){
    var disparador = new THREE.Object3D();
    /*disparador.bola = this.createBola();
    disparador.apuntador = new THREE.Mesh(new THREE.BoxGeometry(2,1,1), new THREE.MeshPhongMaterial({color: 0xf08080}));
    disparador.apuntador.position.set(1,0,0);
    disparador.disparo = false;
    disparador.position.set(posDisparador.x,posDisparador.y,posDisparador.z);

    disparador.add(disparador.bola);
    disparador.add(disparador.apuntador);*/

    var materialLoader = new THREE.MTLLoader();
    var objectLoader = new THREE.OBJLoader();
    materialLoader.load('../models/cañon/Blank.mtl',
      function(materials) {
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/cañon/17957_Hand_cannon_v1.obj',
          function(object) {
            disparador.cannon = object;
            disparador.cannon.position.set(0,1,0);
            disparador.cannon.scale.set(0.35, 0.35, 0.35);
            disparador.cannon.rotation.x = Math.PI/2;
            disparador.add(disparador.cannon);
          }, null, null);
      }
    );

    disparador.bola = this.createBola();
    disparador.disparo = false;

    disparador.position.set(posDisparador.x,posDisparador.y,posDisparador.z);

    disparador.bola.position.set(0,0,5);

    disparador.add(disparador.bola);

    return disparador;
  }

/*  iniciarAnimacion(){
    this.animacion=true;
  }*/

  /*disparar(event){
    var mouse = new THREE.Vector3(
      (event.clientX / window.innerWidth)*2-1,
      0,
      1-2*(event.clientY / window.innerHeight)
    );

    var worldPosition = new THREE.Vector3();
    this.disparador.bola.getWorldPosition(worldPosition)
    this.disparador.vectorAvance = worldPosition.sub(mouse);
    console.log(this.disparador.vectorAvance);
    this.disparador.disparo=true;
  }
*/
  eventos(event){
    var tecla = event.which || event.keyCode;
    if(!this.disparador.disparo){ // Para que no se mueva la bola cuando aún se está disparando
      if (String.fromCharCode(tecla) == "a") {
        this.disparador.rotation.y+=0.02;
      }else if (String.fromCharCode(tecla) == "d") {
        this.disparador.rotation.y-=0.02;
      // Evento de disparo
      }else if (String.fromCharCode(tecla) == "" || String.fromCharCode(tecla) == " ") {
        console.log("Insertando: "+this.insertando);
        console.log("Retrocediendo: "+this.retrocediendo);
        if (!this.insertando && !this.retrocediendo) {
          this.disparador.disparo = true;
        }//else {
          //this.animacion=true;
        //}
      }
    }
  }

  createBolas(numBolas){
    var bolas = new THREE.Object3D();
    bolas = new Array();

    for (var i = 0; i < numBolas; i++) {
      var bola=this.createBola(this.coloresBolas);
      bola.position.set(0,-10,0);
      bola.avanzado=-2*i/this.splineLongitud;
      bolas.push(bola);
      this.add(bola);
    }

    return bolas;
  }

  createDecoraciones(){

  }

  comprobarDisparo(){
    var position = new THREE.Vector3();
    this.disparador.bola.getWorldPosition(position)
    position=position.sub(new THREE.Vector3(0,1,0));
    this.octreeObjects = this.octree.search(position, 1, true);
    if(this.octreeObjects != null && typeof this.octreeObjects != "undefined"){
      //console.log(this.octreeObjects);
      this.octreeObjects.forEach((bola, i) => {
        //console.log(bola);
        //console.log("Position bola i="+ i +" :"+bola.object.position.x +" "+bola.object.position.y+" "+bola.object.position.z);
        var distX = position.x-bola.object.position.x;
        var distZ = position.z-bola.object.position.z;
        if (-1 < distX && distX < 1 && -1 < distZ && distZ < 1 ) {
          this.disparador.disparo=false;
          var index=this.bolas.indexOf(bola.object);
          this.insertarBolas(index);
          /*if(bola.object.colorHex == this.disparador.bola.colorHex){
            var index=this.bolas.indexOf(bola.object);
            if (index>0 && this.bolas[index-1].colorHex == this.disparador.bola.colorHex) {
              console.log("Primero");
              this.borrarBolas(index,this.disparador.bola.colorHex);
              this.cargarDisparador();
            }else if (index < this.bolas.length -1 && this.bolas[index+1].colorHex == this.disparador.bola.colorHex) {
              console.log("Segundo");
              this.borrarBolas(index,this.disparador.bola.colorHex);
              this.cargarDisparador();
            }else {
              this.insertarBolas(index);
              this.disparador.disparo=false;
            }
          }else {
            var index=this.bolas.indexOf(bola.object);
            this.disparador.disparo=false;
            this.insertarBolas(index);
          }
          console.log("HOli");*/
          //this.cargarDisparador();

          /*console.log(bola);
          console.log(distX+" "+distZ);
          console.log("Position disparo:"+position.x +" "+position.y+" "+position.z);
          console.log("Position bola i="+ i +" :"+bola.object.position.x +" "+bola.object.position.y+" "+bola.object.position.z);*/
        }
      });
    }

    if (!this.superficie.geometry.boundingBox.containsPoint(position)) {
      this.cargarDisparador();
    }
  }

  comprobarBolas(index){
    var numMismoColor = 1; // La bola que disparamos tiene el mismo color que ella misma.
    // Primero nos aseguramos de que este dentro de los límites
    if (index >= 0 && index < this.bolas.length) {
      /*
        A continuación comprobamos el número de bolas del mismo color.
        Casos:
         - Las dos de delante son del mismo color.
         - La de delante y la de atrás son del mismo color.
         - Las dos de atrás son del mismo color.
      */
      if (index>0 && this.bolas[index-1].colorHex == this.bolas[index].colorHex) {
        console.log("La de delante");
        numMismoColor++;
        if (index > 1 && this.bolas[index-2].colorHex == this.bolas[index].colorHex) {
          console.log("Las dos de delante");
          numMismoColor++;
        }
      }
      if (index < this.bolas.length -1 && this.bolas[index+1].colorHex == this.bolas[index].colorHex) {
        console.log("La de atrás");
        numMismoColor++;
        if (index < this.bolas.length -2 && this.bolas[index+2].colorHex == this.bolas[index].colorHex) {
          console.log("Las dos de atrás");
          numMismoColor++;
        }
      }
    }

    if (numMismoColor>=3) {
      this.borrarBolas(index,this.bolas[index].colorHex);
    }else {
      this.cargarDisparador();
    }
  }

  cargarDisparador(){
    this.disparador.remove(this.disparador.bola);
    this.disparador.bola = this.createBola();
    this.disparador.bola.position.set(0,0,5);
    this.disparador.add(this.disparador.bola);
    this.disparador.disparo=false;
  }

  borrarBolas(index,colorHex){
    var mismoColor = true;
    this.posiciones = [index];
    var i = index - 1;
    while (mismoColor && i >= 0) {
      if(this.bolas[i].colorHex==colorHex){
        this.posiciones.unshift(i);
        i--;
      }else {
        mismoColor=false;
      }
    }

    i = index + 1;
    mismoColor = true;
    while (mismoColor && i < this.bolas.length) {
      if(this.bolas[i].colorHex==colorHex){
        this.posiciones.push(i);
        i++;
      }else {
        mismoColor=false;
      }
    }

    this.posiciones.forEach((item, j) => {
      this.remove(this.bolas[item]);
      this.octree.remove(this.bolas[item]);
    });

    //console.log("Posiciones "+this.posiciones);//posiciones[0]+" "+posiciones[posiciones.length-1]);
    var diferencia=this.posiciones[this.posiciones.length-1]-this.posiciones[0]+1;
    console.log("Eliminaciones "+this.bolas.splice(this.posiciones[0],diferencia));
    this.retrocediendo=true;
    this.retrocedo=2*(diferencia)/this.splineLongitud;

    if (this.bolas.length == 0 || this.bolas==null) {
      siguienteNivel(juego);
    }

    //console.log("Retrocedo:  "+this.retrocedo);
    //console.log("");
  }

  insertarBolas(index){
    if (index < this.bolas.length - 1) {
      this.insertando=true;
    }
    this.indexInsertando = index;
    this.retrocedo = 1/this.splineLongitud;
  }


  createBola(){
    var color=Math.floor(Math.random()*this.coloresBolas.length); // Número aleatorio entre 0 y length - 1
    var bola = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({color: this.coloresBolas[color]})
    );
    // Para comprobar si la bola ha sido ya añadida a nuestro árbol indexado o no.
    bola.enOctree=false;
    // Aunque no es necesario, lo añadimos por comodidad para
    // evitar hacer comparaciones RGB con variables muy internas.
    bola.colorHex=this.coloresBolas[color];
    return bola;
  }

  update(){
    if (this.animacion) {
      var that = this;

      var tiempoActual = Date.now();
      var time = (tiempoActual - this.tiempoAnterior)/1000; // En segundos
      var avance = (time % this.tiempoFinRecorrido)/this.tiempoFinRecorrido; // [0,1]

      /*
        Avance bolas por recorrido
      */
      this.bolas.forEach((bola, i) => {
        if (this.retrocediendo) {
          if (this.posiciones[0] != 0) {
            if (i < this.posiciones[0]) {
              if (this.retrocedo<=avance) {
                bola.avanzado-=this.retrocedo;
                this.retrocediendo=false;
                console.log("Retrocediendo: "+this.retrocedo);
                this.comprobarBolas(this.posiciones[0]);
              }else{
                bola.avanzado-=avance;
                if (i==0) {
                  this.retrocedo-=avance;
                }
              }
            }
          }else {
            this.retrocediendo=false;
          }

        }else if (this.insertando && i > this.indexInsertando) {
          if (this.retrocedo<=avance) {
            bola.avanzado-=this.retrocedo;
            var copiaBola = this.disparador.bola.clone();//new THREE.Object3D();
            //this.disparador.bola.copy(copiaBola);
            this.bolas.splice(this.indexInsertando+1,0,copiaBola);
            this.add(copiaBola);
            copiaBola.avanzado=this.bolas[this.indexInsertando].avanzado - 2/this.splineLongitud;
            copiaBola.enOctree = false;
            copiaBola.colorHex = this.disparador.bola.colorHex;
            this.cargarDisparador();
            this.insertando=false;
            //console.log("Antes de comprobar Bolas");
            this.comprobarBolas(this.indexInsertando+1);
            //console.log("Insertando: "+this.retrocedo);
          }else{
            bola.avanzado-=avance;
            if (i==(this.bolas.length - 1)) {
              //console.log(2/this.splineLongitud);
              //console.log("Insertando: "+this.retrocedo);
              this.retrocedo-=avance;
            }
          }
        } else {
          bola.avanzado+=avance;
        }

        if (bola.avanzado >= 1) {
          displayEndGame();
          that.animacion = false;

        }else if(bola.avanzado >= 0){
          if (!bola.enOctree) {
            that.octree.add(bola, {useFaces:true});
            bola.enOctree = true;
          }
          var posicion=that.spline.getPointAt(bola.avanzado);
          bola.position.copy(posicion);
          //posicion.add(that.spline.getTangentAt(bola.avanzado));
          //bola.lookAt(posicion);
        }

      });

      /*
        Se actualiza nuestro árbol.
      */
      this.octree.rebuild();
      this.octree.update();

      /*
        Disparo
      */
      if (this.disparador.disparo) {
        this.disparador.bola.translateOnAxis(new THREE.Vector3(0,0,1),this.velocidad*time);
        this.comprobarDisparo();
      }

      this.tiempoAnterior = tiempoActual;
    }
  }
}
