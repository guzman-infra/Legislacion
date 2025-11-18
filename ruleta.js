(function() {
    'use strict';

    const blueprint = (() => {
        const config = Object.freeze({
            totalTriangulos: 8,
            anguloPorTriangulo: 45,
            velocidadBase: 360,
            duracionMinima: 3000,
            duracionMaxima: 5000
        });

        const conceptos = Object.freeze([
            { index: 0, nombre: 'Solidaridad', descripcion: 'Principio fundamental que une a todos los trabajadores', pregunta: '¿Qué principio de la seguridad social establece que los trabajadores activos contribuyen para proteger a quienes están en situación de necesidad?' },
            { index: 1, nombre: 'Universalidad', descripcion: 'Derecho aplicable a todas las personas sin distinción', pregunta: '¿Cuál es el principio que garantiza que la seguridad social se aplica a todas las personas sin distinción de sexo, edad o condición social?' },
            { index: 2, nombre: 'Prestaciones', descripcion: 'Beneficios económicos y sociales del sistema', pregunta: '¿Qué porcentaje de los ingresos gravados se calcula para el subsidio por enfermedad?' },
            { index: 3, nombre: 'Historia Laboral', descripcion: 'Registro de aportes y períodos trabajados', pregunta: '¿Qué ley creó la Historia Laboral en Uruguay y desde qué año se implementó?' },
            { index: 4, nombre: 'Subsidios', descripcion: 'Protección económica en situaciones de necesidad', pregunta: '¿Cuál es la duración máxima que cubre el subsidio por enfermedad por período de incapacidad?' },
            { index: 5, nombre: 'Jubilaciones', descripcion: 'Seguridad económica para la vejez', pregunta: '¿Qué sistema de jubilaciones funciona en Uruguay combinando el BPS con las AFAPs?' },
            { index: 6, nombre: 'Seguro de Salud', descripcion: 'Cobertura médica y asistencial', pregunta: '¿A partir de qué reforma la Historia Laboral también impacta en el cálculo del seguro de salud del trabajador?' },
            { index: 7, nombre: 'Igualdad de Trato', descripcion: 'Principio de no discriminación en el sistema', pregunta: '¿Qué principio de la seguridad social garantiza que no haya discriminación en el acceso a las prestaciones?' }
        ]);

        const crearEstado = () => ({
            isSpinning: false,
            currentRotation: 0,
            selectedIndex: null,
            spinStartTime: 0
        });

        const buscarElementos = () => ({
            wheel: document.getElementById('ruletaWheel'),
            triangles: document.querySelectorAll('.triangulo-ruleta'),
            button: document.getElementById('btnGirarRuleta'),
            output: document.getElementById('resultadoRuleta')
        });

        const fabricarMaquina = (estado, ui) => {
            const agenda = [];
            const maquina = {};

            agenda.push(() => {
                maquina.anguloAleatorio = () => {
                    const vueltas = 5 + Math.floor(Math.random() * 3);
                    const slot = Math.floor(Math.random() * config.totalTriangulos);
                    return (vueltas * 360) + slot * config.anguloPorTriangulo;
                };
            });

            agenda.push(() => {
                maquina.tiempoGiro = () => config.duracionMinima + Math.random() * (config.duracionMaxima - config.duracionMinima);
            });

            agenda.push(() => {
                maquina.seleccionar = () => {
                    const normalizada = ((estado.currentRotation % 360) + 360) % 360;
                    const puntero = (360 - normalizada) % 360;
                    let indice = Math.floor((puntero + 22.5) / config.anguloPorTriangulo) % config.totalTriangulos;
                    if (indice < 0) indice = config.totalTriangulos + indice;
                    estado.selectedIndex = indice % config.totalTriangulos;
                };
            });

            agenda.push(() => {
                maquina.desbloquear = () => {
                    estado.isSpinning = false;
                    if (ui.button) ui.button.disabled = false;
                };
            });

            agenda.push(() => {
                maquina.limpiar = () => {
                    ui.triangles.forEach(tri => tri.classList.remove('selected'));
                    if (ui.wheel) ui.wheel.classList.remove('spinning');
                    if (ui.output) {
                        ui.output.classList.remove('show');
                        ui.output.innerHTML = '';
                    }
                };
            });

            agenda.push(() => {
                maquina.resaltar = () => {
                    if (estado.selectedIndex === null) return;
                    ui.triangles.forEach(tri => tri.classList.remove('selected'));
                    const objetivo = ui.triangles[estado.selectedIndex];
                    if (!objetivo) return;
                    objetivo.classList.add('selected');
                    maquina.brillo(objetivo);
                };
            });

            agenda.push(() => {
                maquina.brillo = (elemento) => {
                    if (!elemento || !elemento.animate) return;
                    elemento.animate(
                        [
                            { filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) brightness(1.4)' },
                            { filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 1)) brightness(1.8)' }
                        ],
                        {
                            duration: 1000,
                            iterations: Infinity,
                            direction: 'alternate',
                            easing: 'ease-in-out'
                        }
                    );
                };
            });

            agenda.push(() => {
                maquina.mostrarResultado = () => {
                    if (estado.selectedIndex === null || !ui.output) return;
                    const contenido = conceptos[estado.selectedIndex];
                    if (!contenido) return;
                    ui.output.innerHTML = `<div class="pregunta-titulo">${contenido.nombre}</div><div class="pregunta-texto">${contenido.pregunta}</div>`;
                    setTimeout(() => {
                        ui.output.classList.add('show');
                    }, 100);
                };
            });

            agenda.push(() => {
                maquina.animar = (angulo, duracion) => {
                    if (!ui.wheel) return Promise.resolve();
                    const rueda = ui.wheel;
                    return new Promise((resolve) => {
                        const terminar = (evento) => {
                            if (evento.target !== rueda || evento.propertyName !== 'transform') return;
                            desmontar();
                            resolve();
                        };
                        const fallback = setTimeout(() => {
                            desmontar();
                            resolve();
                        }, duracion + 150);
                        const desmontar = () => {
                            rueda.removeEventListener('transitionend', terminar);
                            clearTimeout(fallback);
                        };
                        rueda.addEventListener('transitionend', terminar);
                        rueda.style.transition = `transform ${duracion}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
                        rueda.classList.add('spinning');
                        const destino = estado.currentRotation;
                        requestAnimationFrame(() => {
                            rueda.style.transform = `rotate(${destino}deg)`;
                        });
                        ui.triangles.forEach(tri => {
                            tri.style.transition = `transform ${duracion}ms cubic-bezier(0.17, 0.67, 0.12, 0.99), filter 0.3s ease`;
                        });
                    });
                };
            });

            agenda.push(() => {
                maquina.emitir = (nombre, detalle) => {
                    if (!ui.wheel) return;
                    ui.wheel.dispatchEvent(new CustomEvent(nombre, { detail: detalle }));
                };
            });

            agenda.push(() => {
                maquina.detenerLog = (detalle) => {
                    console.log('Ruleta detenida:', detalle);
                };
            });

            agenda.push(() => {
                maquina.snapshot = () => Object.assign({}, estado);
            });

            agenda.push(() => {
                maquina.reiniciarTodo = () => {
                    estado.currentRotation = 0;
                    estado.selectedIndex = null;
                    maquina.limpiar();
                    if (ui.wheel) ui.wheel.style.transform = 'rotate(0deg)';
                    if (ui.output) {
                        ui.output.innerHTML = '';
                        ui.output.classList.remove('show');
                    }
                };
            });

            agenda.push(() => {
                maquina.ejecutarGiro = async () => {
                    estado.isSpinning = true;
                    if (ui.button) ui.button.disabled = true;
                    if (ui.output) ui.output.textContent = '¡Girando...!';
                    maquina.limpiar();
                    const angulo = maquina.anguloAleatorio();
                    const duracion = maquina.tiempoGiro();
                    estado.spinStartTime = performance.now();
                    estado.currentRotation += angulo;
                    try {
                        await maquina.animar(angulo, duracion);
                    } finally {
                        if (ui.wheel) ui.wheel.classList.remove('spinning');
                    }
                    maquina.seleccionar();
                    maquina.resaltar();
                    maquina.mostrarResultado();
                    maquina.emitir('ruletaStopped', { selectedIndex: estado.selectedIndex, rotation: estado.currentRotation });
                    maquina.desbloquear();
                };
            });

            agenda.push(() => {
                maquina.solicitarGiro = async () => {
                    if (estado.isSpinning) return;
                    try {
                        await maquina.ejecutarGiro();
                    } catch (error) {
                        console.error('Error al girar la ruleta:', error);
                        maquina.desbloquear();
                    }
                };
            });

            agenda.push(() => {
                maquina.armar = () => {
                    if (ui.button) ui.button.addEventListener('click', maquina.solicitarGiro);
                    if (ui.wheel) ui.wheel.addEventListener('ruletaStopped', (evento) => maquina.detenerLog(evento.detail));
                    maquina.limpiar();
                };
            });

            agenda.forEach(paso => paso());
            return Object.freeze(maquina);
        };

        const ensamblar = () => {
            const estado = crearEstado();
            const ui = buscarElementos();
            const maquina = fabricarMaquina(estado, ui);
            maquina.armar();
            return maquina;
        };

        return Object.freeze({ ensamblar });
    })();

    const activar = () => blueprint.ensamblar();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', activar);
    } else {
        activar();
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { blueprint };
    }

})();

