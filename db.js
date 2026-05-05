// db.js - Mock Database for Initial Testing

// This acts as your temporary data storage in memory
const mockLineup = [
  { id: 1, name: 'Jade', stage_name: 'Jade', status: 'On Stage' },
  { id: 2, name: 'Ruby', stage_name: 'Ruby', status: 'Up Next' },
  { id: 3, name: 'Amber', stage_name: 'Amber', status: 'Waiting' }
];

const db = {
  // This simulates a standard database query function
  query: async (text, params) => {
    console.log("🛠️ Mock DB received query:", text);
    
    // For now, we just return the full list regardless of the query
    return { rows: mockLineup };
  }
};

module.exports = db;