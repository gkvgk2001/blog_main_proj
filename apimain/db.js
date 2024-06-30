import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gaurav123",
  database: "blogs",
  authPlugin: "mysql_native_password",
});
