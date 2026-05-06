const db = require('./db');

async function setPerformerLive(performerId, clubId, io) {
  try {
    await db.query(
      'UPDATE entertainer_profiles SET current_status = $1 WHERE id = $2',
      ['on-stage', performerId]
    );

    const result = await db.query(
      'SELECT stage_name FROM entertainer_profiles WHERE id = $1',
      [performerId]
    );

    const stageName = result.rows[0]?.stage_name || 'Check back soon';

    io.emit('lineupChanged', {
      current: stageName,
      next: 'Check back soon',
      clubId: clubId
    });

    console.log(`System Alert: ${stageName} is now LIVE.`);
  } catch (err) {
    console.error('Error updating live status:', err);
  }
}

module.exports = { setPerformerLive };
