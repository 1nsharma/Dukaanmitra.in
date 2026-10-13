
/**
 * Project Health Controller
 * Handles aggregation of project/store metrics from PostgreSQL
 */

const db = require('../db'); // Assume pg-promise or similar initialized elsewhere

/**
 * GET /api/projects/:projectId/health
 * Aggregates health metrics for a specific store/project
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.getProjectHealth = async (req, res) => {
  const { projectId } = req.params;

  try {
    const query = `
      WITH project_stats AS (
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(*) FILTER (WHERE intent = 'PAYMENT_RECEIVED') as completed_tasks,
          COUNT(*) FILTER (WHERE intent = 'NEW_BILL' AND date < NOW() - INTERVAL '15 days') as overdue_tasks,
          AVG(
            CASE 
              WHEN intent = 'PAYMENT_RECEIVED' 
              THEN EXTRACT(EPOCH FROM (date - (
                SELECT MAX(date) FROM transactions t2 
                WHERE t2.phone = t1.phone AND t2.intent = 'NEW_BILL' AND t2.date < t1.date
              ))) / 3600
            END
          ) as avg_completion_time
        FROM transactions t1
        WHERE store_id = $1
      ),
      history_trend AS (
        SELECT 
          TO_CHAR(date, 'Mon DD') as label,
          COUNT(*) as val
        FROM transactions
        WHERE store_id = $1
        GROUP BY label, date
        ORDER BY date DESC
        LIMIT 7
      )
      SELECT 
        ps.*,
        (SELECT json_agg(ht) FROM history_trend ht) as history
      FROM project_stats ps;
    `;

    const result = await db.one(query, [projectId]);

    res.status(200).json({
      totalTasks: parseInt(result.total_tasks),
      completedTasks: parseInt(result.completed_tasks),
      overdueTasks: parseInt(result.overdue_tasks),
      avgCompletionTime: parseFloat(result.avg_completion_time || 0).toFixed(2),
      history: result.history || []
    });
  } catch (error) {
    console.error('Database aggregation failed:', error);
    res.status(500).json({ error: 'Failed to retrieve project health data.' });
  }
};
