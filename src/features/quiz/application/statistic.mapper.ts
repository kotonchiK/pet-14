import { Answers, GameStatus, Statistic } from "../api/models/output";
import { GameEntity, StatisticEntity } from "../infrastructure/domains/game.entity";
import { OutputGameModel } from "../api/models/game.output";

export const statisticMapper = (games?:StatisticEntity):Statistic => {
    if(!games) {
        return {
            sumScore:0,
            avgScores:0,
            gamesCount:0,
            winsCount:0,
            lossesCount:0,
            drawsCount:0
        }
    }

    function formatAvgScore(score: number):number {
        // Округляем до 2 знаков после запятой
        const roundedScore = score.toFixed(2);

        // Преобразуем в строку и удаляем незначащие нули и точку, если нужно
        const formattedScore = roundedScore.replace(/\.?0+$/, '');

        return Number(formattedScore)
    }

    const avg = games.sumScore / games.gamesCount

    const avgScores = formatAvgScore(avg)

    return {
        sumScore:games.sumScore,
        avgScores:avgScores,
        gamesCount:games.gamesCount,
        winsCount:games.winsCount,
        lossesCount:games.lossesCount,
        drawsCount:games.drawsCount
    };
}