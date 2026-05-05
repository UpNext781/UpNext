const db = require('./db');

// Function to move a performer to "On-Stage"
async function setPerformerLive(performerId, clubId, io) {
    try {
        // 1. Update the database
        await db.query(
            'UPDATE entertainer_profiles SET current_status = $1 WHERE id = $2',
            ['on-stage', performerId]
        );

        // 2. Fetch the updated lineup for that club
        const result = await db.query(
            'SELECT stage_name FROM entertainer_profiles WHERE id = $1',
            [performerId]
        );

        const stageName = result.rows.stage_name;

        // 3. Broadcast to all patrons in real-time via Socket.io
        io.emit('lineupChanged', {
            current: stageName,
            status: 'LIVE',
            clubId: clubId
        });

        console.log(`System Alert: ${stageName} is now LIVE.`);
    } catch (err) {
        console.error('Error updating live status:', err);
    }
}

module.exports = { setPerformerLive };
