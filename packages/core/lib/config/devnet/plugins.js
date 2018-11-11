module.exports = {
  '@phantomcore/core-event-emitter': {},
  '@phantomcore/core-config': {},
  '@phantomcore/core-logger': {},
  '@phantomcore/core-logger-winston': {
    transports: {
      console: {
        options: {
          colorize: true,
          level: process.env.PHANTOM_LOG_LEVEL || 'debug'
        }
      },
      dailyRotate: {
        options: {
          filename: process.env.PHANTOM_LOG_FILE || `${process.env.PHANTOM_PATH_DATA}/logs/core/${process.env.PHANTOM_NETWORK_NAME}/%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          level: process.env.PHANTOM_LOG_LEVEL || 'debug',
          zippedArchive: true
        }
      }
    }
  },
  '@phantomcore/core-database': {
    snapshots: `${process.env.PHANTOM_PATH_DATA}/snapshots/${process.env.PHANTOM_NETWORK_NAME}`
  },
  '@phantomcore/core-database-sequelize': {
    // dialect: 'sqlite',
    // storage: process.env.PHANTOM_DB_STORAGE || `${process.env.PHANTOM_PATH_DATA}/database/${process.env.PHANTOM_NETWORK_NAME}10.sqlite`,
    host: process.env.PHANTOM_DB_HOST || 'localhost',
    dialect: process.env.PHANTOM_DB_DIALECT || 'postgres',
    username: process.env.PHANTOM_DB_USERNAME || 'phantom',
    password: process.env.PHANTOM_DB_PASSWORD || 'password',
    database: process.env.PHANTOM_DB_DATABASE || 'phantom_devnet',
    logging: process.env.PHANTOM_DB_LOGGING,
    redis: {
      host: process.env.PHANTOM_REDIS_HOST || 'localhost',
      port: process.env.PHANTOM_REDIS_PORT || 6379
    }
  },
  '@phantomcore/core-transaction-pool': {},
  '@phantomcore/core-transaction-pool-redis': {
    enabled: !process.env.PHANTOM_TRANSACTION_POOL_DISABLED,
    key: 'phantom',
    maxTransactionsPerSender: process.env.PHANTOM_TRANSACTION_POOL_MAX_PER_SENDER || 100,
    whitelist: [],
    redis: {
      host: process.env.PHANTOM_REDIS_HOST || 'localhost',
      port: process.env.PHANTOM_REDIS_PORT || 6379
    }
  },
  '@phantomcore/core-p2p': {
    host: process.env.PHANTOM_P2P_HOST || '0.0.0.0',
    port: process.env.PHANTOM_P2P_PORT || 4002,
    whitelist: ['127.0.0.1', '::ffff:127.0.0.1', '192.168.*']
  },
  '@phantomcore/core-blockchain': {
    fastRebuild: false
  },
  '@phantomcore/core-api': {
    enabled: !process.env.PHANTOM_API_DISABLED,
    host: process.env.PHANTOM_API_HOST || '0.0.0.0',
    port: process.env.PHANTOM_API_PORT || 4003,
    whitelist: ['*']
  },
  '@phantomcore/core-webhooks': {
    enabled: process.env.PHANTOM_WEBHOOKS_ENABLED,
    database: {
      dialect: 'sqlite',
      storage: `${process.env.PHANTOM_PATH_DATA}/database/${process.env.PHANTOM_NETWORK_NAME}/webhooks.sqlite`,
      logging: process.env.PHANTOM_DB_LOGGING
    },
    redis: {
      host: process.env.PHANTOM_REDIS_HOST || 'localhost',
      port: process.env.PHANTOM_REDIS_PORT || 6379
    },
    server: {
      enabled: process.env.PHANTOM_WEBHOOKS_API_ENABLED,
      host: process.env.PHANTOM_WEBHOOKS_HOST || '0.0.0.0',
      port: process.env.PHANTOM_WEBHOOKS_PORT || 4004,
      whitelist: ['127.0.0.1', '::ffff:127.0.0.1', '192.168.*']
    }
  },
  '@phantomcore/core-graphql': {
    enabled: process.env.PHANTOM_GRAPHQL_ENABLED,
    host: process.env.PHANTOM_GRAPHQL_HOST || '0.0.0.0',
    port: process.env.PHANTOM_GRAPHQL_PORT || 4005,
    path: '/graphql',
    graphiql: true
  },
  '@phantomcore/core-forger': {
    hosts: ['http://127.0.0.1:4002']
  },
  '@phantomcore/core-json-rpc': {
    enabled: process.env.PHANTOM_JSON_RPC_ENABLED,
    host: process.env.PHANTOM_JSON_RPC_HOST || '0.0.0.0',
    port: process.env.PHANTOM_JSON_RPC_PORT || 8080,
    allowRemote: true,
    whitelist: ['127.0.0.1', '::ffff:127.0.0.1', '192.168.*']
  }
}
