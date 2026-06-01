import { Pool, RowDataPacket, ExecuteValues } from 'mysql2/promise';

export async function callProcedure<T = RowDataPacket>(
  pool: Pool,
  name: string,
  params: ExecuteValues = [],
): Promise<T[]> {
  const placeholders = (params as unknown[]).map(() => '?').join(', ');
  const sql = `CALL ${name}(${placeholders})`;
  const [rows] = await pool.execute(sql, params);
  // CALL retorna [[rows], fields] — pegamos o primeiro result set
  return (rows as T[][])[0] ?? (rows as T[]);
}

export async function callProcedureFirst<T = RowDataPacket>(
  pool: Pool,
  name: string,
  params: ExecuteValues = [],
): Promise<T | null> {
  const rows = await callProcedure<T>(pool, name, params);
  return rows[0] ?? null;
}
