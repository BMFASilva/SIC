import  GravidezMedia from './models/GravidezMedia.js';
import mongoose from 'mongoose';

const dados = [
    { semana: 1, peso: 0.001, comprimento: 0.1, facto: "O embrião é uma bola de células em divisão." },
    { semana: 2, peso: 0.002, comprimento: 0.2, facto: "As células começam a diferenciar-se e a formar os órgãos principais." },
    { semana: 3, peso: 0.003, comprimento: 0.3, facto: "O coração começa a bater e o sistema nervoso central começa a formar-se." },
    { semana: 4, peso: 0.004, comprimento: 0.4, facto: "O embrião já tem um formato de feijão e os principais órgãos estão em desenvolvimento." },
    { semana: 5, peso: 0.005, comprimento: 0.5, facto: "Os braços e as pernas começam a formar-se. O batimento cardíaco pode ser detetado." },
    { semana: 6, peso: 0.006, comprimento: 0.6, facto: "Os dedos começam a formar-se, e os órgãos internos continuam a desenvolver-se." },
    { semana: 7, peso: 0.008, comprimento: 0.7, facto: "A face começa a assumir uma forma humana e os olhos estão mais definidos." },
    { semana: 8, peso: 0.01, comprimento: 1, facto: "Os ossos e as articulações começam a desenvolver-se." },
    { semana: 9, peso: 0.012, comprimento: 1.2, facto: "O feto já tem o tamanho de uma azeitona e os órgãos internos continuam a desenvolver-se." },
    { semana: 10, peso: 0.015, comprimento: 1.5, facto: "O feto começa a mover-se e a tomar forma humana." },
    { semana: 11, peso: 0.023, comprimento: 1.8, facto: "O sistema urinário começa a produzir urina." },
    { semana: 12, peso: 0.014, comprimento: 5.4, facto: "Os órgãos internos continuam a formar-se e o feto tem uma aparência humana." },
    { semana: 13, peso: 0.023, comprimento: 7.4, facto: "Os dedos das mãos e dos pés agora têm unhas." },
    { semana: 14, peso: 0.043, comprimento: 8.7, facto: "O feto tem uma pele fina e está mais ativo." },
    { semana: 15, peso: 0.07, comprimento: 10.1, facto: "O feto já começa a ouvir sons externos." },
    { semana: 16, peso: 0.1, comprimento: 11.6, facto: "Os músculos faciais estão mais desenvolvidos, e o feto pode fazer expressões faciais." },
    { semana: 17, peso: 0.14, comprimento: 13.0, facto: "O cabelo começa a formar-se no couro cabeludo." },
    { semana: 18, peso: 0.19, comprimento: 14.2, facto: "O feto já se está a mover mais e é possível sentir os primeiros movimentos." },
    { semana: 19, peso: 0.24, comprimento: 15.3, facto: "O feto começa a engolir líquido amniótico." },
    { semana: 20, peso: 0.3, comprimento: 16.4, facto: "O feto começa a acumular gordura sob a pele." },
    { semana: 21, peso: 0.36, comprimento: 26.7, facto: "A pele do feto é vermelha e enrugada, com veias visíveis." },
    { semana: 22, peso: 0.43, comprimento: 27.8, facto: "O feto começa a dormir e a acordar em intervalos." },
    { semana: 23, peso: 0.5, comprimento: 28.9, facto: "A pele do feto ainda é fina, mas começa a ficar mais espessa." },
    { semana: 24, peso: 0.6, comprimento: 30.0, facto: "O feto tem unhas e os pulmões começam a desenvolver-se." },
    { semana: 25, peso: 0.66, comprimento: 34.6, facto: "Os olhos estão mais abertos e o feto já começa a perceber a luz." },
    { semana: 26, peso: 0.76, comprimento: 35.6, facto: "O feto começa a reagir ao som e pode reconhecer a voz da mãe." },
    { semana: 27, peso: 0.87, comprimento: 36.6, facto: "Os pulmões continuam a desenvolver-se e a produção de surfactante aumenta." },
    { semana: 28, peso: 1.0, comprimento: 37.6, facto: "O feto já tem um ritmo de sono e vigília mais regular." },
    { semana: 29, peso: 1.15, comprimento: 38.6, facto: "O feto continua a ganhar peso e a desenvolver-se rapidamente." },
    { semana: 30, peso: 1.32, comprimento: 39.9, facto: "Os ossos do feto continuam a endurecer, mas o crânio permanece flexível." },
    { semana: 31, peso: 1.5, comprimento: 41.1, facto: "O feto já começa a acumular mais gordura sob a pele, ficando mais arredondado." },
    { semana: 32, peso: 1.7, comprimento: 42.4, facto: "A pele do feto fica mais suave e menos enrugada." },
    { semana: 33, peso: 1.9, comprimento: 43.7, facto: "O feto já tem um padrão de sono mais regular e pode mover os dedos com precisão." },
    { semana: 34, peso: 2.15, comprimento: 45.0, facto: "O feto já está pronto para nascer, mas precisa de ganhar mais peso." },
    { semana: 35, peso: 2.38, comprimento: 46.2, facto: "Os pulmões estão quase totalmente desenvolvidos e o feto está a ganhar mais peso." },
    { semana: 36, peso: 2.62, comprimento: 47.4, facto: "O feto continua a mover-se, mas o espaço no útero está mais apertado." },
    { semana: 37, peso: 2.85, comprimento: 48.6, facto: "O feto está quase pronto para nascer, com todos os sistemas a funcionar bem." },
    { semana: 38, peso: 3.08, comprimento: 49.8, facto: "O feto está a começar a descer para a posição de nascimento." },
    { semana: 39, peso: 3.29, comprimento: 50.7, facto: "O feto já tem uma boa quantidade de gordura e está quase pronto para o nascimento." },
    { semana: 40, peso: 3.46, comprimento: 51.2, facto: "O feto está completamente desenvolvido e pronto para nascer." }
];

export const seedDatabase = async () => {
    try {
        const count = await GravidezMedia.countDocuments();
        if (count === 0) {
            console.log('📌 Base de dados vazia. Inserindo dados iniciais...');
            await GravidezMedia.insertMany(dados);
            console.log('✅ Dados inseridos com sucesso!');
        } else {
            console.log('🔹 Dados já existem na base de dados. Nenhuma ação necessária.');
        }
    } catch (error) {
        console.error('❌ Erro ao popular a base de dados:', error);
    }
};