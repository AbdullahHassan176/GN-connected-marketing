import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'global-next-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: new AzureMonitorTraceExporter({
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable some instrumentations that might cause issues
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

// Start the SDK
sdk.start();

// Export the tracer
export const tracer = trace.getTracer('global-next-api', '1.0.0');

// Custom span decorator for Azure Functions
export function withTracing<T extends any[], R>(
  operationName: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const span = tracer.startSpan(operationName, {
      kind: SpanKind.SERVER,
      attributes: {
        'service.name': 'global-next-api',
        'operation.name': operationName,
      },
    });

    try {
      const result = await fn(...args);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  };
}

// Create span for API operations
export function createApiSpan(operationName: string, attributes?: Record<string, any>) {
  const span = tracer.startSpan(operationName, {
    kind: SpanKind.SERVER,
    attributes: {
      'service.name': 'global-next-api',
      'operation.name': operationName,
      ...attributes,
    },
  });

  return span;
}

// Add custom attributes to current span
export function addSpanAttributes(attributes: Record<string, any>) {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttributes(attributes);
  }
}

// Add custom events to current span
export function addSpanEvent(name: string, attributes?: Record<string, any>) {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

// Record exceptions in current span
export function recordSpanException(error: Error, attributes?: Record<string, any>) {
  const span = trace.getActiveSpan();
  if (span) {
    span.recordException(error, attributes);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  }
}

// Set span status
export function setSpanStatus(code: SpanStatusCode, message?: string) {
  const span = trace.getActiveSpan();
  if (span) {
    span.setStatus({ code, message });
  }
}

// Export the SDK for cleanup
export { sdk };
