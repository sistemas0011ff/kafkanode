import convict from 'convict';
import convict_format_with_validator from 'convict-format-with-validator';
import dotenv from 'dotenv';   

dotenv.config();  

convict.addFormats(convict_format_with_validator);

const schema = {
  env: {
    doc: 'The application environment.',
    format: ['production', 'qa', 'development', 'local'],
    env: 'NODE_ENV',
    default: process.env.NODE_ENV || 'local'
  },
  apm: {
    serviceName: {
      doc: 'Service name for APM',
      format: String,
      env: 'ELASTIC_APM_SERVICE_NAME',
      default: process.env.ELASTIC_APM_SERVICE_NAME || 'default'
    },
    serverUrl: {
      doc: 'Server URL for APM',
      format: 'url',
      env: 'ELASTIC_APM_SERVER_URL',
      default: process.env.ELASTIC_APM_SERVER_URL || 'http://localhost'
    },
    secretToken: {
      doc: 'Secret token for APM',
      format: String,
      env: 'ELASTIC_APM_SECRET_TOKEN',
      default: process.env.ELASTIC_APM_SECRET_TOKEN || 'secret'
    },
    environment: {
      doc: 'Environment for APM',
      format: String,
      env: 'ELASTIC_APM_ENVIRONMENT',
      default: process.env.ELASTIC_APM_ENVIRONMENT || 'development'
    },
    captureHeaders: {
      doc: 'Check if capture headers for APM',
      format: Boolean,
      env: 'ELASTIC_APM_CAPTURE_HEADERS',
      default: process.env.ELASTIC_APM_CAPTURE_HEADERS === 'true'
    },
    errorAbortedRequests: {
      doc: 'Error on aborted requests for APM',
      format: Boolean,
      env: 'ELASTIC_APM_ERROR_ON_ABORTED_REQUESTS',
      default: process.env.ELASTIC_APM_ERROR_ON_ABORTED_REQUESTS === 'true'
    },
    maxQueueSize: {
      doc: 'Define the max queue size for logs to send to the APM server',
      format: Number,
      env: 'ELASTIC_APM_MAX_QUEUE_SIZE',
      default: parseInt(process.env.ELASTIC_APM_MAX_QUEUE_SIZE, 10) || 4096
    },
    enabled: {
      doc: 'Define if APM service is enabled',
      format: Number,
      env: 'APM_ENABLED',
      default: parseInt(process.env.APM_ENABLED, 10) || 0
    }
  },
  logLevel: {
    doc: 'Base path for the API',
    format: String,
    env: 'LOG_LEVEL',
    default: process.env.LOG_LEVEL || 'info'
  },
  http: {
    basePath: {
      doc: 'Base path for the API',
      format: String,
      env: 'BASE_PATH',
      default: process.env.BASE_PATH || ''
    },
    port: {
      doc: 'API port',
      format: Number,
      env: 'PORT',
      default: parseInt(process.env.PORT, 10) || 3199
    }
  },
  jwt: {
    secretKey: {
      doc: 'JWT encryption key (for routes without protection)',
      format: String,
      env: 'JWT_SECRET_KEY',
      default: process.env.JWT_SECRET_KEY || 'testKey'
    },
    protectedSecretKey: {
      doc: 'JWT encryption key (for routes with protection)',
      format: String,
      env: 'JWT_PROTECTED_SECRET_KEY',
      default:'testKey2'
    }
  },
  country: {
    doc: 'Country code',
    format: String,
    env: 'COUNTRY',
    default: process.env.COUNTRY || ''
  },
  database: {
    url: {
      doc: 'Database URL',
      format: 'url',
      env: 'DATABASE_URL',
      default: process.env.DATABASE_URL || ''
    }
  },
  kafka: {
    broker: {
      doc: 'Kafka broker addresses',
      format: String,
      env: 'KAFKA_BROKER',
      default: process.env.KAFKA_BROKER || ''
    },
    topic: {
      doc: 'Kafka topic for transactions',
      format: String,
      env: 'KAFKA_TOPIC',
      default: process.env.KAFKA_TOPIC || 'transactions_created'
    },
    useTransactions: {
      doc: 'Enable exactly-once transactions for Kafka',
      format: Boolean,
      env: 'KAFKA_USE_TRANSACTIONS',
      default: process.env.KAFKA_USE_TRANSACTIONS === 'true'
    },
    isIdempotent: {
      doc: 'Enable idempotency for Kafka to avoid duplicates',
      format: Boolean,
      env: 'KAFKA_IS_IDEMPOTENT',
      default: process.env.KAFKA_IS_IDEMPOTENT === 'true'
    }
  }
};

const config = convict(schema);

config.load(process.env);

export { config, schema };
