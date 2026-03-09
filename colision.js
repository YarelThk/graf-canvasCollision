const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

// Color de fondo del canvas
canvas.style.background = "#ff8";

/*
Clase Circle
Representa un círculo que se mueve dentro del canvas
Se añadieron atributos y métodos para manejar colisiones
*/
class Circle {

    constructor(x, y, radius, color, text, speed) {

        // Posición inicial
        this.posX = x;
        this.posY = y;

        // Radio del círculo
        this.radius = radius;

        // Color original
        this.originalColor = color;

        // Color actual
        this.color = color;

        // Texto dentro del círculo
        this.text = text;

        // Velocidad del círculo
        this.speed = speed;

        // Dirección inicial de movimiento
        this.dx = (Math.random() * 2 - 1) * this.speed;
        this.dy = (Math.random() * 2 - 1) * this.speed;
    }

    /*
    Método draw()
    Dibuja el círculo y su etiqueta en el canvas
    */
    draw(context) {

        context.beginPath();

        context.strokeStyle = this.color;
        context.lineWidth = 2;

        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "14px Arial";
        context.fillStyle = "black";
        context.fillText(this.text, this.posX, this.posY);

        context.closePath();
    }

    /*
    Método move()
    Actualiza la posición del círculo
    También detecta rebote con los bordes del canvas
    */
    move() {

        this.posX += this.dx;
        this.posY += this.dy;

        // Rebote horizontal
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Rebote vertical
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    /*
    Método checkCollision()
    Detecta colisión entre dos círculos
    usando la fórmula de distancia entre centros
    También cambia la dirección del movimiento
    */
    checkCollision(otherCircle) {

        // Diferencia entre centros
        let dx = this.posX - otherCircle.posX;
        let dy = this.posY - otherCircle.posY;

        /*
        Fórmula de distancia:
        d = √((x2-x1)^2 + (y2-y1)^2)
        */
        let distance = Math.sqrt(dx * dx + dy * dy);

        /*
        Hay colisión si la distancia entre centros
        es menor que la suma de los radios
        */
        if (distance < this.radius + otherCircle.radius) {

            // Flash azul durante la colisión
            this.color = "#0000FF";
            otherCircle.color = "#0000FF";

            /*
            Cambio de dirección después de la colisión
            Ambos círculos rebotan en dirección contraria
            */
            this.dx = -this.dx;
            this.dy = -this.dy;

            otherCircle.dx = -otherCircle.dx;
            otherCircle.dy = -otherCircle.dy;

        }

    }

    /*
    Método update()
    Ejecuta movimiento y dibujo
    */
    update(context) {

        this.move();
        this.draw(context);

    }

}

// Array que almacenará todos los círculos
let circles = [];

/*
Función generateCircles(n)
Genera N círculos con valores aleatorios
Velocidad entre 1 y 5 unidades
*/
function generateCircles(n) {

    for (let i = 0; i < n; i++) {

        // Radio entre 20 y 40
        let radius = Math.random() * 20 + 20;

        // Posición aleatoria
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;

        // Color aleatorio
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        // Velocidad entre 1 y 5
        let speed = Math.random() * 4 + 1;

        // Texto del círculo
        let text = `C${i + 1}`;

        circles.push(new Circle(x, y, radius, color, text, speed));
    }

}

/*
Función animate()
Se ejecuta continuamente para actualizar la animación
*/
function animate() {

    // Limpiar canvas
    ctx.clearRect(0, 0, window_width, window_height);

    /*
    Restaurar color original antes de revisar colisiones
    Esto permite que el azul solo aparezca como "flash"
    */
    circles.forEach(circle => {
        circle.color = circle.originalColor;
    });

    /*
    Detección de colisiones colectivas
    Cada círculo se compara con los demás
    */
    for (let i = 0; i < circles.length; i++) {

        for (let j = i + 1; j < circles.length; j++) {

            circles[i].checkCollision(circles[j]);

        }

    }

    // Actualizar movimiento y dibujo
    circles.forEach(circle => {
        circle.update(ctx);
    });

    // Repetir animación
    requestAnimationFrame(animate);
}

//Generar 20 círculos e iniciar animación
generateCircles(20);
animate();