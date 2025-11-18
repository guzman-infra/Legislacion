(function() {
    'use strict';

    const quizEngine = (() => {
        const questions = Object.freeze([
            {
                id: 1,
                question: '¿Qué caracteriza a la seguridad social como derecho humano?',
                options: [
                    'Es un privilegio para ciertos grupos sociales',
                    'Es un derecho inherente a todo ser humano, indispensable para su dignidad',
                    'Solo aplica a trabajadores formales',
                    'Requiere condiciones especiales para acceder'
                ],
                correct: 1,
                explanation: 'La seguridad social es un derecho inherente a todo ser humano, indispensable para su dignidad, aplicable a todas las personas sin distinción.'
            },
            {
                id: 2,
                question: '¿Cuál de los siguientes NO es un principio de la seguridad social?',
                options: [
                    'Solidaridad',
                    'Universalidad',
                    'Igualdad de trato',
                    'Privatización total'
                ],
                correct: 3,
                explanation: 'Los principios son: Solidaridad, Universalidad, Igualdad de trato, Obligatoriedad, Responsabilidad del Estado y Administración democrática.'
            },
            {
                id: 3,
                question: '¿Qué porcentaje de los ingresos gravados se calcula para el subsidio por enfermedad?',
                options: [
                    '50%',
                    '60%',
                    '70%',
                    '80%'
                ],
                correct: 2,
                explanation: 'El monto del subsidio por enfermedad se calcula sobre el 70% de los ingresos gravados del trabajador.'
            },
            {
                id: 4,
                question: '¿Cuál es la duración máxima que cubre el subsidio por enfermedad por período de incapacidad?',
                options: [
                    '6 meses',
                    '1 año con posibilidad de prórroga',
                    '2 años',
                    '3 meses'
                ],
                correct: 1,
                explanation: 'El subsidio por enfermedad cubre hasta un año por enfermedad, con posibilidad de prórroga según evaluación médica.'
            },
            {
                id: 5,
                question: '¿Qué ley creó la Historia Laboral en Uruguay?',
                options: [
                    'Ley Nº 18.083',
                    'Ley Nº 16.713',
                    'Ley Nº 15.000',
                    'Ley Nº 20.000'
                ],
                correct: 1,
                explanation: 'La Historia Laboral fue creada por la Ley Nº 16.713 y consiste en la declaración electrónica de todos los haberes percibidos.'
            },
            {
                id: 6,
                question: '¿Desde qué año hasta cuándo la Historia Laboral se vinculaba únicamente a los derechos jubilatorios?',
                options: [
                    '1990 hasta 2000',
                    '1996 hasta el 30/06/2007',
                    '2000 hasta 2010',
                    '1985 hasta 1995'
                ],
                correct: 1,
                explanation: 'Desde 1996 hasta el 30/06/2007 la Historia Laboral se vinculaba únicamente a los derechos jubilatorios.'
            },
            {
                id: 7,
                question: '¿Qué reforma hizo que la Historia Laboral también impacte en el cálculo del IRPF y seguro de salud?',
                options: [
                    'Ley Nº 16.713',
                    'Ley Nº 18.083 (reforma tributaria)',
                    'Ley Nº 20.000',
                    'Ley Nº 15.000'
                ],
                correct: 1,
                explanation: 'A partir de la reforma tributaria (Ley Nº 18.083), la información de la Historia Laboral también impacta en el cálculo del IRPF y en el seguro de salud del trabajador.'
            },
            {
                id: 8,
                question: '¿Qué sistema de jubilaciones funciona en Uruguay?',
                options: [
                    'Solo sistema público del BPS',
                    'Solo sistema privado de AFAPs',
                    'Régimen mixto que combina BPS con AFAPs',
                    'Sistema completamente privado'
                ],
                correct: 2,
                explanation: 'El sistema de jubilaciones y pensiones en Uruguay funciona mediante un régimen mixto que combina el sistema público del BPS con las Administradoras de Fondos de Ahorro Previsional (AFAPs).'
            },
            {
                id: 9,
                question: '¿Qué información incluye actualmente la Historia Laboral?',
                options: [
                    'Solo haberes percibidos',
                    'Solo períodos trabajados',
                    'Haberes, períodos trabajados, retenciones de IRPF y datos sobre seguro de salud',
                    'Solo datos jubilatorios'
                ],
                correct: 2,
                explanation: 'La Historia Laboral incluye haberes, períodos trabajados, retenciones de IRPF y datos sobre el seguro de salud correspondiente.'
            },
            {
                id: 10,
                question: '¿Para acceder al seguro de desempleo se requiere?',
                options: [
                    'Solo estar registrado en el BPS',
                    'Cumplir con un período mínimo de aportes y estar registrado en el BPS',
                    'Tener más de 50 años',
                    'No tener otros ingresos'
                ],
                correct: 1,
                explanation: 'Para acceder al seguro de desempleo se requiere cumplir con un período mínimo de aportes y estar registrado en el BPS.'
            }
        ]);

        const createState = () => ({
            currentQuestion: 0,
            score: 0,
            answers: [],
            isActive: false,
            isCompleted: false,
            startTime: null,
            endTime: null
        });

        const findElements = () => ({
            container: document.getElementById('quizContainer'),
            startBtn: document.getElementById('btnIniciarQuiz'),
            questionEl: document.getElementById('quizQuestion'),
            optionsEl: document.getElementById('quizOptions'),
            progressEl: document.getElementById('quizProgress'),
            scoreEl: document.getElementById('quizScore'),
            resultEl: document.getElementById('quizResult'),
            nextBtn: document.getElementById('btnSiguiente'),
            restartBtn: document.getElementById('btnReiniciarQuiz')
        });

        const buildQuiz = (state, ui) => {
            const operations = [];
            const quiz = {};

            operations.push(() => {
                quiz.start = () => {
                    if (state.isActive) return;
                    state.isActive = true;
                    state.isCompleted = false;
                    state.currentQuestion = 0;
                    state.score = 0;
                    state.answers = [];
                    state.startTime = performance.now();
                    const contentEl = document.querySelector('.quiz-content');
                    if (contentEl) contentEl.style.display = 'block';
                    quiz.render();
                    if (ui.container) ui.container.classList.add('active');
                };
            });

            operations.push(() => {
                quiz.submitAnswer = (selectedIndex) => {
                    if (!state.isActive || state.isCompleted) return;
                    const current = questions[state.currentQuestion];
                    const isCorrect = selectedIndex === current.correct;
                    state.answers.push({
                        questionId: current.id,
                        selected: selectedIndex,
                        correct: current.correct,
                        isCorrect: isCorrect
                    });
                    if (isCorrect) state.score++;
                    quiz.showFeedback(isCorrect, current.explanation);
                };
            });

            operations.push(() => {
                quiz.showFeedback = (isCorrect, explanation) => {
                    const options = ui.optionsEl?.querySelectorAll('.quiz-option');
                    if (!options) return;
                    options.forEach((opt, idx) => {
                        opt.disabled = true;
                        const current = questions[state.currentQuestion];
                        if (idx === current.correct) {
                            opt.classList.add('correct');
                        } else if (idx === state.answers[state.answers.length - 1].selected && !isCorrect) {
                            opt.classList.add('incorrect');
                        }
                    });
                    if (ui.resultEl) {
                        ui.resultEl.innerHTML = `
                            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                                <strong>${isCorrect ? '¡Correcto!' : 'Incorrecto'}</strong>
                                <p>${explanation}</p>
                            </div>
                        `;
                        ui.resultEl.classList.add('show');
                    }
                    if (ui.nextBtn) {
                        ui.nextBtn.style.display = 'block';
                        ui.nextBtn.disabled = false;
                    }
                };
            });

            operations.push(() => {
                quiz.next = () => {
                    if (!state.isActive) return;
                    state.currentQuestion++;
                    if (state.currentQuestion >= questions.length) {
                        quiz.finish();
                    } else {
                        quiz.render();
                    }
                };
            });

            operations.push(() => {
                quiz.render = () => {
                    if (state.currentQuestion >= questions.length) {
                        quiz.finish();
                        return;
                    }
                    const current = questions[state.currentQuestion];
                    if (ui.questionEl) {
                        ui.questionEl.textContent = `${state.currentQuestion + 1}. ${current.question}`;
                    }
                    if (ui.optionsEl) {
                        ui.optionsEl.innerHTML = current.options.map((opt, idx) => `
                            <button class="quiz-option" data-index="${idx}">
                                ${opt}
                            </button>
                        `).join('');
                        ui.optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
                            btn.addEventListener('click', () => quiz.submitAnswer(parseInt(btn.dataset.index)));
                        });
                    }
                    if (ui.progressEl) {
                        const progressText = ui.progressEl.querySelector('.quiz-progress-text');
                        if (progressText) {
                            progressText.textContent = `Pregunta ${state.currentQuestion + 1} de ${questions.length}`;
                        }
                        ui.progressEl.style.width = `${((state.currentQuestion + 1) / questions.length) * 100}%`;
                    }
                    if (ui.resultEl) {
                        ui.resultEl.classList.remove('show');
                        ui.resultEl.innerHTML = '';
                    }
                    if (ui.nextBtn) {
                        ui.nextBtn.style.display = 'none';
                        ui.nextBtn.disabled = true;
                    }
                };
            });

            operations.push(() => {
                quiz.finish = () => {
                    state.isCompleted = true;
                    state.isActive = false;
                    state.endTime = performance.now();
                    const duration = ((state.endTime - state.startTime) / 1000).toFixed(1);
                    const percentage = Math.round((state.score / questions.length) * 100);
                    const contentEl = document.querySelector('.quiz-content');
                    if (contentEl) contentEl.style.display = 'none';
                    if (ui.container) ui.container.classList.add('completed');
                    if (ui.restartBtn) ui.restartBtn.style.display = 'block';
                    if (ui.scoreEl) {
                        ui.scoreEl.innerHTML = `
                            <div class="score-display">
                                <h3>Quiz Completado</h3>
                                <div class="score-value">${state.score} / ${questions.length}</div>
                                <div class="score-percentage">${percentage}%</div>
                                <p class="score-time">Tiempo: ${duration} segundos</p>
                                <div class="score-details">
                                    ${state.answers.map((ans, idx) => {
                                        const q = questions[idx];
                                        return `
                                            <div class="answer-item ${ans.isCorrect ? 'correct' : 'incorrect'}">
                                                <strong>Pregunta ${idx + 1}:</strong> ${ans.isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                        ui.scoreEl.classList.add('show');
                    }
                };
            });

            operations.push(() => {
                quiz.reset = () => {
                    state.currentQuestion = 0;
                    state.score = 0;
                    state.answers = [];
                    state.isActive = false;
                    state.isCompleted = false;
                    state.startTime = null;
                    state.endTime = null;
                    const contentEl = document.querySelector('.quiz-content');
                    if (contentEl) contentEl.style.display = 'none';
                    const startEl = document.querySelector('.quiz-start');
                    if (startEl) startEl.style.display = 'block';
                    if (ui.container) {
                        ui.container.classList.remove('active', 'completed');
                    }
                    if (ui.scoreEl) {
                        ui.scoreEl.classList.remove('show');
                        ui.scoreEl.innerHTML = '';
                    }
                    if (ui.resultEl) {
                        ui.resultEl.classList.remove('show');
                        ui.resultEl.innerHTML = '';
                    }
                    if (ui.restartBtn) {
                        ui.restartBtn.style.display = 'none';
                    }
                };
            });

            operations.push(() => {
                quiz.getState = () => Object.assign({}, state);
            });

            operations.push(() => {
                quiz.setup = () => {
                    if (ui.startBtn) {
                        ui.startBtn.addEventListener('click', quiz.start);
                    }
                    if (ui.nextBtn) {
                        ui.nextBtn.addEventListener('click', quiz.next);
                        ui.nextBtn.style.display = 'none';
                    }
                    if (ui.restartBtn) {
                        ui.restartBtn.addEventListener('click', () => {
                            quiz.reset();
                        });
                    }
                };
            });

            operations.forEach(op => op());
            return Object.freeze(quiz);
        };

        const assemble = () => {
            const state = createState();
            const ui = findElements();
            const quiz = buildQuiz(state, ui);
            quiz.setup();
            return quiz;
        };

        return Object.freeze({ assemble, questions });
    })();

    const initialize = () => quizEngine.assemble();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { quizEngine };
    }

})();

