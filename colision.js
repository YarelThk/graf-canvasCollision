const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

/*
Contador de objetos eliminados
*/
let eliminadas = 0;

/*
Arrays principales
*/
let objects = [];
let explosions = [];

/*
Sprite del objeto (estrella)
*/
let starImg = new Image();
starImg.src = "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";

/*
Clase Star
Representa cada objeto que cae desde arriba
*/
class Star{

constructor(x,y,size,speed){

this.posX = x;
this.posY = y;

this.size = size;
this.speed = speed;

}

/*
Dibuja el sprite
*/
draw(){

ctx.drawImage(
starImg,
this.posX,
this.posY,
this.size,
this.size
);

}

/*
Movimiento de caída
*/
move(){

this.posY += this.speed;

/*
Si sale del canvas vuelve a iniciar arriba
*/
if(this.posY > height){

this.posY = -this.size;
this.posX = Math.random()*width;

}

}

/*
Actualizar objeto
*/
update(){

this.move();
this.draw();

}

/*
Detectar clic
*/
isClicked(mouseX,mouseY){

return(

mouseX > this.posX &&
mouseX < this.posX + this.size &&
mouseY > this.posY &&
mouseY < this.posY + this.size

);

}

}

/*
Clase Explosion
Genera efecto visual cuando se destruye un objeto
*/
class Explosion{

constructor(x,y){

this.x = x;
this.y = y;

this.radius = 10;
this.alpha = 1;

}

draw(){

ctx.beginPath();

ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);

ctx.fillStyle = "rgba(255,200,0,"+this.alpha+")";

ctx.fill();

ctx.closePath();

}

update(){

this.radius += 2;
this.alpha -= 0.05;

this.draw();

}

}

/*
Generar objetos que caen
*/
function generateObjects(n){

for(let i=0;i<n;i++){

let size = Math.random()*40+40;

let x = Math.random()*width;

let y = Math.random()*-height;

let speed = Math.random()*2+1;

objects.push(
new Star(x,y,size,speed)
);

}

}

/*
Evento de clic del mouse
Detecta mouseX y mouseY
*/
canvas.addEventListener("click",function(e){

let rect = canvas.getBoundingClientRect();

let mouseX = e.clientX - rect.left;
let mouseY = e.clientY - rect.top;

for(let i=0;i<objects.length;i++){

if(objects[i].isClicked(mouseX,mouseY)){

/* crear explosión */
explosions.push(
new Explosion(
objects[i].posX + objects[i].size/2,
objects[i].posY + objects[i].size/2
)
);

/* eliminar objeto */
objects.splice(i,1);

eliminadas++;

/* generar nuevo objeto */
generateObjects(1);

break;

}

}

});

/*
Actualizar velocidad según puntaje
*/
function updateDifficulty(){

objects.forEach(obj=>{

if(eliminadas>10){

obj.speed += 0.01;

}

if(eliminadas>15){

obj.speed += 0.03;

}

});

}

/*
Dibujar contador
*/
function drawScore(){

ctx.fillStyle="white";
ctx.font="22px Arial";

ctx.fillText(
"Eliminadas: "+eliminadas,
width-180,
40
);

}

/*
Dibujar fondo tipo cielo
*/
function drawBackground(){

let gradient = ctx.createLinearGradient(0,0,0,height);

gradient.addColorStop(0,"#020024");
gradient.addColorStop(0.5,"#090979");
gradient.addColorStop(1,"#00d4ff");

ctx.fillStyle = gradient;
ctx.fillRect(0,0,width,height);

}

/*
Animación principal
*/
function animate(){

drawBackground();

objects.forEach(obj=>{
obj.update();
});

explosions.forEach((exp,index)=>{

exp.update();

if(exp.alpha <=0){
explosions.splice(index,1);
}

});

updateDifficulty();

drawScore();

requestAnimationFrame(animate);

}

/*
Objetos iniciales
*/
generateObjects(12);

/*
Iniciar animación
*/
animate();