import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse = {
        errorsMessages: [],
      };
      const responseBody:any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((m: any) => errorResponse.errorsMessages.push(m));
      } else if (typeof responseBody === 'object') {
        errorResponse.errorsMessages.push(responseBody);
      }
      // @ts-ignore
      response.status(status).json(errorResponse);
      return
    }
    ///////// ELSE
      // @ts-ignore
    response.status(status).send()
  }
}

@Catch (Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>;
    if (process.env.envorinment !== 'production') {
      // @ts-ignore
      response.status (500).send({error:exception.toString()}) ;
    } else {
  // @ts-ignore
      response.status(500).send('some error ocurred');
    }
  }
}