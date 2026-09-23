/* =========================================================
   RAVI KANT JHA — WEBSITE MOTION
   Scientific particle / lattice background
   ========================================================= */

const canvas = document.getElementById("scienceCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 140
};

let animationFrame;


/* =========================================================
   CANVAS SETUP
   ========================================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
}

window.addEventListener("resize", resizeCanvas);


/* =========================================================
   PARTICLE SYSTEM
   ========================================================= */

function createParticles() {

    particles = [];

    /*
        Fewer particles on smaller screens.
        This keeps the website lightweight.
    */

    const density =
        window.innerWidth < 700
            ? 35
            : Math.min(90, Math.floor(window.innerWidth / 15));

    for (let i = 0; i < density; i++) {

        particles.push({

            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,

            size: Math.random() * 1.5 + 0.5,

            phase: Math.random() * Math.PI * 2

        });
    }
}


/* =========================================================
   MOUSE INTERACTION
   ========================================================= */

window.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});


/* =========================================================
   DRAW PARTICLES
   ========================================================= */

function drawParticles(time) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Very subtle particle colour.
        It is intentionally muted so that the
        background remains cream and elegant.
    */

    particles.forEach((particle) => {

        particle.x += particle.vx;
        particle.y += particle.vy;

        /*
            Gentle oscillation gives the particles
            a slow organic motion.
        */

        particle.x +=
            Math.sin(time * 0.0002 + particle.phase) * 0.03;

        particle.y +=
            Math.cos(time * 0.0002 + particle.phase) * 0.03;


        /*
            Wrap particles around screen.
        */

        if (particle.x < -20)
            particle.x = canvas.width + 20;

        if (particle.x > canvas.width + 20)
            particle.x = -20;

        if (particle.y < -20)
            particle.y = canvas.height + 20;

        if (particle.y > canvas.height + 20)
            particle.y = -20;


        /*
            Mouse interaction.
        */

        let distanceFromMouse = Infinity;

        if (mouse.x !== null) {

            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;

            distanceFromMouse =
                Math.sqrt(dx * dx + dy * dy);

            if (distanceFromMouse < mouse.radius) {

                const force =
                    (mouse.radius - distanceFromMouse)
                    / mouse.radius;

                particle.x +=
                    (dx / distanceFromMouse) * force * 0.35;

                particle.y +=
                    (dy / distanceFromMouse) * force * 0.35;
            }
        }


        /*
            Particle itself.
        */

        const opacity =
            distanceFromMouse < mouse.radius
                ? 0.35
                : 0.17;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(36, 75, 99, ${opacity})`;

        ctx.fill();

    });


    /*
        Connect nearby particles.
        This creates a subtle computational-network
        / lattice-like structure.
    */

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 135) {

                const opacity =
                    (1 - distance / 135) * 0.12;

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    `rgba(36, 75, 99, ${opacity})`;

                ctx.lineWidth = 0.6;

                ctx.stroke();
            }
        }
    }


    /*
        A very subtle moving wave.
        This gives the background a hint of
        quantum/wave-like motion.
    */

    ctx.beginPath();

    for (let x = 0; x <= canvas.width; x += 12) {

        const wave =
            Math.sin(
                x * 0.008 +
                time * 0.00025
            ) * 18;

        const y =
            canvas.height * 0.72 + wave;

        if (x === 0)
            ctx.moveTo(x, y);
        else
            ctx.lineTo(x, y);
    }

    ctx.strokeStyle =
        "rgba(155, 96, 69, 0.045)";

    ctx.lineWidth = 1;

    ctx.stroke();


    animationFrame =
        requestAnimationFrame(drawParticles);
}


/* =========================================================
   SCROLL NAVIGATION
   ========================================================= */

const navbar =
    document.querySelector(".navbar");


window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section > *, .project"
    );


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach((element) => {

    observer.observe(element);

});


/* =========================================================
   INITIALIZE
   ========================================================= */

resizeCanvas();

requestAnimationFrame(drawParticles);
