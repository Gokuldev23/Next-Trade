// src/lib/auth/pg-adapter.ts

export function PostgresAdapter(pool) {
  return {
    async createUser(user) {
      const res = await pool.query(
        `INSERT INTO users (name, email, image) VALUES ($1, $2, $3) RETURNING *`,
        [user.name, user.email, user.image]
      );
      return res.rows[0];
    },

    async getUser(id) {
      const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return res.rows[0] ?? null;
    },

    async getUserByEmail(email) {
      const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);
      return res.rows[0] ?? null;
    },

    async createSession({ sessionToken, userId, expires }) {
      const res = await pool.query(
        `INSERT INTO sessions (session_token, user_id, expires) VALUES ($1, $2, $3) RETURNING *`,
        [sessionToken, userId, expires]
      );
      return {
        sessionToken: res.rows[0].session_token,
        userId: res.rows[0].user_id,
        expires: res.rows[0].expires,
      };
    },

    async getSessionAndUser(sessionToken) {
      const res = await pool.query(
        `SELECT * FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.session_token = $1`,
        [sessionToken]
      );
      if (res.rows.length === 0) return null;

      const row = res.rows[0];
      return {
        session: {
          sessionToken: row.session_token,
          userId: row.user_id,
          expires: row.expires,
        },
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          image: row.image,
        },
      };
    },

    async deleteSession(sessionToken) {
      await pool.query(`DELETE FROM sessions WHERE session_token = $1`, [
        sessionToken,
      ]);
    },

    // You can add more methods like updateUser, deleteUser, etc. when needed.
  };
}
