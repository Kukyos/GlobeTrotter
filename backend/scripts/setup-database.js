import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function setupDatabase() {
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT) || 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'globetrotter';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created or already exists`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', '..', 'DATABASE_SCHEMA.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        await connection.query(statement);
      }
    }

    console.log('✅ Database schema created successfully');

    // Create default admin user (password: admin123)
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    await connection.query(`
      INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [
      'admin-001',
      'admin@globetrotter.com',
      hashedPassword,
      'Admin',
      'User',
      'admin'
    ]);

    console.log('✅ Default admin user created (email: admin@globetrotter.com, password: admin123)');

    await connection.end();
    console.log('✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
