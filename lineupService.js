import { query } from './db.js';

// Function to move a performer to "On-Stage"
async function setPerformerLive(performerId, clubId, io) {
    try {
        // 1. Update the database
        await query(
            'UPDATE entertainer_profiles SET current_status = $1 WHERE id = $2',
            ['on-stage', performerId]
        );

        // 2. Fetch the updated lineup for that club
        const result = await query(
            'SELECT stage_name FROM entertainer_profiles WHERE id = $1',
            [performerId]
        );

        // 3. Safely access the result
        if (!result.rows || result.rows.length === 0) {
            console.error('No performer found with id:', performerId);
            return;
        }

        const stageName = result.rows[0].stage_name;

        // 4. Broadcast to all patrons in real-time via Socket.io
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

export { setPerformerLive };
