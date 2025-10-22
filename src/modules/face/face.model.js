import { pool } from "../../config/db.js";

export async function saveEmbedding(username, embedding) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const query =
      "INSERT INTO users(username, embedding) VALUES($1,$2) RETURNING id";
    const values = [username, embedding];
    const res = await client.query(query, values);
    await client.query("COMMIT");
    console.log(res.rows[0]);

    return res.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getUserEmbedding(username) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const query = "SELECT embedding FROM users WHERE username = $1";
    const values = [username];

    const res = await client.query(query, values);

    await client.query("COMMIT");

    if (res.rows.length === 0) {
      console.log("User not found");
      return null;
    }

    console.log(res.rows[0]);
    return res.rows[0].embedding;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
