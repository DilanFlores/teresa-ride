import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: ".env.test" });

export async function prepareTestDatabase() {
    console.log(" Preparando base de datos de pruebas...");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST||'localhost',
        user: process.env.DB_USER||'root',
        password: process.env.DB_PASSWORD||'',
        port: Number(process.env.DB_PORT||3306),
        multipleStatements: true,
    });

    try {
        console.log(" Verificando base de datos teresaride_test...");
        await connection.query(`CREATE DATABASE IF NOT EXISTS teresaride_test`);
        await connection.query(`USE teresaride_test`);

        await connection.query("SET FOREIGN_KEY_CHECKS = 0");

        console.log(" Limpiando tablas existentes...");
        const tables = [
            'user_notification',
            'invoice',
            'review',
            'payment',
            'reservation',
            'notification',
            'trip',
            'vehicle',
            'user'
        ];

        for (const table of tables) {
            await connection.query(`DROP TABLE IF EXISTS ${table}`);
        }

        await connection.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("  Cargando estructura de tablas...");
        const structurePath = path.resolve(__dirname, "../../database/teresaride_structure.sql");
        const structureSql = fs.readFileSync(structurePath, "utf8");
        
        await connection.query("SET FOREIGN_KEY_CHECKS = 0");
        await connection.query(structureSql);
        await connection.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log(" Cargando datos de prueba (seed)...");
        const seedPath = path.resolve(__dirname, "../../database/seed.sql");
        const seedSql = fs.readFileSync(seedPath, "utf8");
        
        await connection.query("SET FOREIGN_KEY_CHECKS = 0");
        await connection.query(seedSql);
        await connection.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log(" Base de datos lista con datos de prueba");
        console.log(" Los stored procedures se mantienen intactos");
        console.log(" Usuario de prueba: dilan.fl25@gmail.com / 12345678");

    } catch (error) {
        console.error(" Error preparando la base de datos:", error);
        throw error;
    } finally {
        await connection.end();
    }
}