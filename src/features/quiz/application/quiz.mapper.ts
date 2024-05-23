import {OutputQuestionModel} from "../api/models/output";
import { QuestionEntity } from "../infrastructure/domains/question.entity";

export const questionMapper = (question:QuestionEntity):OutputQuestionModel => {
    return {
        id:question.id.toString(),
        body:question.body,
        correctAnswers:question.correctAnswers,
        published:question.published,
        createdAt:question.createdAt,
        updatedAt:question.updatedAt
    }
}