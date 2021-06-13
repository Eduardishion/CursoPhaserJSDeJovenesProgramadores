/**
 * configuracion del juego 
 */
const config = {
    title: "Juego de lalo",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        type: Phaser.AUTO,
        parent: "contenedor",
        width: 800,
        height: 600,
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default:'arcade',
        arcade: {
            gravity:{y: 300},
            // al poner false o true podemos ver el contorno que marca 
            //la caja contendedora de la imgan
            debug: false //al usar true o false, activamos los mimiltes fisicos de los objetos
        }
    },
      
}

//instancia a objeto phaser
let game = new Phaser.Game(config);

//declaracion de variables globales 
//para acumular puntos y 
var Puntos = 0;
//para mostrar los puntos en la pantalla
var Puntostexto ="";
//variable para detectar que el juego se a terminado
var gameOver = false;

var TextoGameOver = "";
 

/**
 * metodo para precargar recursos y asignar rutas de arfhivos staticos 
 * en este metodo precargamos imagenes y sprits staticos
 */
function preload (){

    //asiganacion de ruta de recursos 
    this.load.setPath('./Assets/');
    
    // carga de imagenes estaticas
    this.load.image([
        'Coin',
        'Esfera',
        'Fondo',
        'Plataforma',
        'yellow',//archivo de particula
    ]);
    
    // carga de imagenes sprits
    //primera parametro identificador dentro los metodos

    //segundo paramentro es el nombre de la imagen a cargar
    //tercer parametro es el corte en pixeles del sprite 
    //donde el personaje esta en reposo y apunta al frame del prsonaje en reposo
    this.load.spritesheet('Kaze','kaze.png',{frameWidth:32.5, frameHeight: 48 });
    //agregando audio
    this.load.audio('sonido' , 'coin_audio.mp3');
    
};
/**
 * metodo donde se renderisar los recursos 
 * y se establecen la posicion de los elementos en el esenacio 
 */
function create(){

    /*----------------------primera parte del juego--------------------------*/

    //1.-cargar fondo del escenario 
    //agregando imagen de fondo a la escena 
    //al usar setScale extendemos la imagen al tamaño total del lienso
    this.add.image(400, 300, 'Fondo').setScale(1,1.15);


    //agregaremos un cuerpo estatico que se podra ser repetido indefinicamente 
    plataforma = this.physics.add.staticGroup();

    //cuerpo estatico que representa una plataforma
    //parametros son eje X y eje Y, el nombre del recurso que se desea replicar y 
    //que previamente a sido precargado en preload()
    //en este caso plataforma mide 400px x 60px
    //para ajustar los milites fisicos del cuerpo adecuandamente usaremos  refreshBody()
    //el cual corrige que los limites se extiendan completamebte del objeto
    plataforma.create(400, 590, 'Plataforma').setScale(2.1, 1).refreshBody();
    //agregando mas objetos platafoma 
    plataforma.create(400, 0, 'Plataforma').setScale(2.1, 1).refreshBody();
    plataforma.create(700, 410, 'Plataforma').setScale(0.3, 1).refreshBody();
    plataforma.create(400, 300, 'Plataforma').setScale(0.2, 1).refreshBody();
    plataforma.create(800, 150, 'Plataforma');
    plataforma.create(-50, 300, 'Plataforma');
    plataforma.create(0, 450, 'Plataforma');
    plataforma.create(730, 300, 'Plataforma');
    plataforma.create(-100, 150, 'Plataforma');
    plataforma.create(0, 450, 'Plataforma');

    // para corregir que la collicon sea directamente imagen con imagen 
    plataforma.getChildren()[0].setOffset(0,10);

    //agregando el personaje y detectando colicion con plataformas 
    //carga de sprite 
    //paramentros son el eje x y eje y donde apracera el pesonaje, el nombre del recurso a usar
    Kaze = this.physics.add.sprite(230,100,'Kaze');
    //detaccion de coliciones 
    Kaze.setCollideWorldBounds(true);
    //rebote de personaje
    Kaze.setBounce(0.5);


    //ahora detectaremos la colicion del personaje con las plataformas para esto usaremos el metodo collider
    //como parametro usamos el primer objeto a colicionar  en este caso el personaje 
    //segunda parametro el segundo objeto a colicionar en este caso la plataforma
    this.physics.add.collider(Kaze,plataforma);


    //resusando los demas sprites del persanaje 

    //deteccion de tecla isquierda
    this.anims.create({
        key: 'Izquierda',//nombre clase de la animacion 
        frames: this.anims.generateFrameNumbers('Kaze', {start:0, end:3}), //son los frames de la animacion
        frameRate: 10, //es la velocidad por fotograma por segundo
        repeat: -1 //repeticion de la animacion 
    });

    //deteccion de tecla dereccha 
    this.anims.create({
        key: 'Derecha',
        frames: this.anims.generateFrameNumbers('Kaze', {start:5, end:8}),
        frameRate: 10,
        repeat: -1
    });

    //cuando esta en reposo 
    this.anims.create({
        key: 'Quieto',
        frames: [ { key: 'Kaze', frame: 4 } ],
        frameRate: 20
    });

     /*----------------------primera parte del juego--------------------------*/
    
   
    /*----------------------segunda parte del juego--------------------------*/
    
    //agregar los joyitas que recolectara el persona 
    coins = this.physics.add.group({
        key: 'Coin',//identificador del recurso 
        repeat: 11, //numero de joyitas que se renderiaran 
        setXY: { x: 12, y: 50, stepX: 60 } //posicion donde se colocaran cada joyita
    });
    
    // deteccion de colicion de las jotitas con las platafomas 
    this.physics.add.collider(plataforma, coins);

    //rebote de joyitas
    coins.children.iterate(function (child) {
        child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //para mostrar puntos 
    //sus parametros son la poscion donde paracera
    //la variable donde se mostrara y el tamaño de la fuente y color de fuente 
    Puntostexto    = this.add.text(300,560,'Puntos: 0',{fontSize: '40px', fill:'red'});
    



    //creando objeto de los enemigos de tipo grupo para replicar,
    //y seran las bolitas que no debemos tocar para no perder 
    enemigos = this.physics.add.group();
    //para deteccion de las botitas con las plataformas
    this.physics.add.collider(enemigos,plataforma);

    

    //deteccion de colicion del personaje con las bolitas 
    this.physics.add.collider(Kaze,enemigos,choque,null, this);

     /*----------------------segunda parte del juego--------------------------*/


     //agregando partuculas al objeto 
     particulas = this.add.particles('yellow');//asignacion de recurso particula 
     let emitter = particulas.createEmitter({
         speed: 100,
         scale:{
             start: 1,
             end: 0
         },
         blendMode:'ADD'
     });

     //configuraciones de particulas
     emitter.setScale(0.5, 1);
     emitter.setAlpha(0.3, 0.8);
     //agregandio particulas al personaje
     emitter.startFollow(Kaze);
};

function update(time, delta){
      //reininio del juego si la variable gameover el true
     if(gameOver){
        return;
     }

      /*----------------------segunda parte del juego--------------------------*/

     //creando objeto cursors para deteccion de teclas y aplicar movimientos al personaje
     cursors = this.input.keyboard.createCursorKeys();

     //aplicacndo movimiento dependiendo de que tecla a sido activada
     //deteccion isquierda
     if (cursors.left.isDown){

        Kaze.setVelocityX(-300); //para asignar velodidad en eje X y determinar cuanto se movera el personaje a la isquierda
        Kaze.anims.play('Izquierda', true);//para activar animacion de sprite antes declardas
     //deteccion derecha
     }else if (cursors.right.isDown){

        Kaze.setVelocityX(300);//para asignar velodidad en eje X y determinar cuanto se movera el personaje a la derecha
        Kaze.anims.play('Derecha', true);//para activar animacion de sprite antes declardas
    //al estar en reposo 
    }else{

        Kaze.setVelocityX(0); //para asignar velodidad en eje X en reposo no se asigna velocida por estar en reposo
        Kaze.anims.play('Quieto');//para activar animacion de sprite antes declardas

    }
    //deteccion hacia arriba
    if (cursors.up.isDown && Kaze.body.touching.down)
    {
        Kaze.setVelocityY(-410);//para asignar velodidad en eje Y y determinar cuanto se movera el personaje hacia arriba
    }

    //detectar superposicion
    //para detectar cuando cada joyita sea recolectada por el personaje desaparesca
    this.physics.add.overlap(Kaze, coins, esconder, null, this);

     /*----------------------segunda parte del juego--------------------------*/



}

/**
 * para esconde las joyotas al ser detectadas
 * @param {*} Kaze  el onjeto del personaje 
 * @param {*} Coin  la joyita a desaparecer
 */
function esconder(Kaze, Coin) {
    // agregando sonido
    const EFECTO = this.sound.add('sonido');
    
    //reproduciendo sonido
    EFECTO.play();
    

    Coin.disableBody(true, true);
    //sumar 10 a los puntos cada que cada joyita sea recolectada
    Puntos+= 10;
    //para mostrar el texto actualiado al sumar puntos
    Puntostexto .setText('Puntos:'+ Puntos);



    //condicion para detectar que cuando todas las joyitas hallan sido recolectadas aparesca una esfera
    if(coins.countActive(true) === 0){

        //para crear mas joyyitas despues de haber recolectado las anteriores
        coins.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        //para elegir alateoriamente la posicion de la joyita
        var x = (Kaze.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        //creacion de una esfera cada cuando se recolecta una joyita
        Esferas = enemigos.create(x, 16, 'Esfera');
        //para que los obejtos reboten
        Esferas.setBounce(1);
        //para se detecte la colicion 
        Esferas.setCollideWorldBounds(true);
        // y tengan una velocidad contante
        Esferas.setVelocity(50,5);
    }
    
}

/**
 * 
 * @param {*} kaze personaje 
 * @param {*} Esferas enemigos 
 */
function choque(kaze, Esferas) {

    // si es tocado manda mensaje de game over
    //agregar texto para Game Over
    TextoGameOver  = this.add.text(215,250,'Game Over',{fontSize: '60px', fill:'white'});
    //cambio de color de kase

    
    //pausamos las fisicas del juego 
    this.physics.pause();
    //al detectar la colicion se cambia al estado de reposo 
    Kaze.anims.play('Quieto');
    //y terminamos el juego 
    gameOver = true;
}


