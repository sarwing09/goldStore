import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styles: `
  
  .container-login100 {
    position: relative;
    width: 100%;
    height: 100vh; /* Toda la altura de la pantalla */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: #013440; /* Color petróleo de fondo */
}

/* Efecto de gradiente animado */
.container-login100::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(-45deg, #013440, #015958, #A67C00, #FFD700);
    background-size: 300% 300%;
    animation: bg-animation 6s ease infinite;
    opacity: 0.8; /* Transparencia para un efecto más sutil */
    z-index: -1; /* Detrás del contenido */
}

/* Animación del gradiente */
@keyframes bg-animation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* Estilo del contenido */
.container-login100 h1 {
    font-size: 3rem;
    color: #FFD700; /* Oro */
    text-shadow: 2px 2px 10px rgba(255, 215, 0, 0.8);
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    letter-spacing: 3px;
}


  `
})
export class MainComponent {

}
