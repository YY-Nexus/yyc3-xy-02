import { Pool } from 'pg';
import { createClient } from 'redis';
import { logger } from './logger';

// PostgreSQL连接配置
export const postgresConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'yyc3_ai_xiaoyu',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 创建PostgreSQL连接池
export const pool = new Pool(postgresConfig);

// Redis连接配置
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
};

// 创建Redis客户端
export const redisClient = createClient(redisConfig);

// 数据库连接状态
let isConnected = false;

// 初始化数据库连接
export const initializeDatabase = async (): Promise<void> => {
  try {
    // 测试PostgreSQL连接
    await pool.query('SELECT NOW()');
    logger.info('PostgreSQL connected successfully');

    // 连接Redis
    await redisClient.connect();
    logger.info('Redis connected successfully');

    isConnected = true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

// 关闭数据库连接
export const closeDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    await redisClient.quit();
    isConnected = false;
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database connections:', error);
    throw error;
  }
};

// 检查数据库连接状态
export const isDatabaseConnected = (): boolean => isConnected;

// 数据库健康检查
export const healthCheck = async (): Promise<{ postgres: boolean; redis: boolean }> => {
  const health = {
    postgres: false,
    redis: false,
  };

  try {
    // 检查PostgreSQL
    await pool.query('SELECT 1');
    health.postgres = true;
  } catch (error) {
    logger.error('PostgreSQL health check failed:', error);
  }

  try {
    // 检查Redis
    await redisClient.ping();
    health.redis = true;
  } catch (error) {
    logger.error('Redis health check failed:', error);
  }

  return health;
};

// 导出常用的数据库操作工具
export const db = {
  // 执行查询
  query: async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Query execution failed', { text, error });
      throw error;
    }
  },

  // 执行事务
  transaction: async (callback: (client: any) => Promise<any>) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // 获取单个记录
  one: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows[0];
  },

  // 获取多个记录
  many: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows;
  },

  // 插入记录并返回ID
  insert: async (table: string, data: Record<string, any>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING id
    `;

    const result = await pool.query(query, values);
    return result.rows[0].id;
  },

  // 更新记录
  update: async (table: string, id: string | number, data: Record<string, any>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  },

  // 删除记录
  delete: async (table: string, id: string | number) => {
    const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

// Redis操作工具
export const redis = {
  // 设置键值对
  set: async (key: string, value: any, ttl?: number) => {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, serializedValue);
    } else {
      await redisClient.set(key, serializedValue);
    }
  },

  // 获取值
  get: async <T = any>(key: string): Promise<T | null> => {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  },

  // 删除键
  del: async (key: string) => {
    return await redisClient.del(key);
  },

  // 检查键是否存在
  exists: async (key: string) => {
    return await redisClient.exists(key);
  },

  // 设置过期时间
  expire: async (key: string, ttl: number) => {
    return await redisClient.expire(key, ttl);
  },

  // 获取剩余过期时间
  ttl: async (key: string) => {
    return await redisClient.ttl(key);
  },

  // 原子递增
  incr: async (key: string) => {
    return await redisClient.incr(key);
  },

  // 原子递减
  decr: async (key: string) => {
    return await redisClient.decr(key);
  },
};

export default {
  pool,
  redisClient,
  initializeDatabase,
  closeDatabase,
  isDatabaseConnected,
  healthCheck,
  db,
  redis,
};