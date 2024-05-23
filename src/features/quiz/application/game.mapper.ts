import { Answers, GameStatus } from "../api/models/output";
import { GameEntity } from "../infrastructure/domains/game.entity";
import { OutputGameModel } from "../api/models/game.output";

export const gameMapper = (game:GameEntity,
                           answersForFirstPlayer:Answers[],
                           answersForSecondPlayer:Answers[],
                           ):OutputGameModel => {
    let questions = null
    let secondPlayerProgress = null
    if (game.status !== GameStatus.PendingSecondPlayer) {
        questions = game.questions.map(({ id, body }) => ({
            id: String(id),
            body
        }));
        secondPlayerProgress = {
            answers:answersForSecondPlayer,
            player: {
                id: game.player2.id.toString(),
                login: game.player2.login,
            },
            score: game.player2.score
        };
    }
    const firstPlayerProgress = {
        answers:answersForFirstPlayer,
        player: {
            id: game.player1.id.toString(),
            login: game.player1.login,
        },
        score: game.player1.score
    };

    return {
        firstPlayerProgress,
        secondPlayerProgress,
        questions,
        id: game.id.toString(),
        status: game.status,
        pairCreatedDate:game.pairCreatedDate,
        startGameDate:game.startGameDate,
        finishGameDate:game.finishGameDate
    };

}

//  const firstPlayerProgress = {
//         answers:answersForFirstPlayer,
//         player: {
//             id: game.player1.id.toString(),
//             login: game.player1.login,
//         },
//         score: game.player1.score
//     };
//
//     let secondPlayerProgress = null;
//     let questions = null;
//     let startGameDate = null;
//     let finishGameDate = null;
//
//     if (game.status !== GameStatus.PendingSecondPlayer) {
//         secondPlayerProgress = {
//             answers: answersForSecondPlayer,
//             player: {
//                 id: game.player2.id.toString(),
//                 login: game.player2.login,
//             },
//             score: game.player2.score
//         };
//         questions = simplifiedQuestions;
//         startGameDate = game.startGameDate;
//
//         if (game.status === GameStatus.Finished) {
//             finishGameDate = game.finishGameDate;
//         }
//     }
//
//     return {
//         firstPlayerProgress,
//         secondPlayerProgress,
//         questions,
//         id: game.id.toString(),
//         status: game.status,
//         pairCreatedDate: game.pairCreatedDate,
//         startGameDate,
//         finishGameDate
//     };