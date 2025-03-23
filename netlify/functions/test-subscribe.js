// Simple test for the subscribe function
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      message: 'Test subscription endpoint is working!',
      received: event.body ? JSON.parse(event.body) : null
    })
  };
};
