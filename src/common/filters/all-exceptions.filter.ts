import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';

// Custom exception filter to handle all types of exceptions
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Method to handle the caught exception
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse(); // Get the response object from the context
    const request = ctx.getRequest(); // Get the request object from the context

    // Determine the status code based on the type of exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // If it's an HttpException, use the provided status
        : HttpStatus.INTERNAL_SERVER_ERROR; // Otherwise, default to internal server error status

    let message: string;

    // Process the message based on the type of exception
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response; // If response is a string, use it directly
      } else if (typeof response === 'object' && 'message' in response) {
        // If response is an object and contains 'message'
        message = Array.isArray(response['message'])
          ? response['message'].join(', ') // If 'message' is an array, join it into a string
          : (response['message'] as string); // If 'message' is a string, use it
      } else {
        message = exception.message; // Default to exception message
      }
    } else {
      message = 'Internal server error'; // Default message for non-HttpExceptions
    }

    // Define the error response structure
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(), // Current timestamp in ISO format
      path: request.url, // The URL that caused the error
      message, // The error message
    };

    // Send the response with the appropriate status code and error details
    response.status(status).json(errorResponse);
  }
}
