const serverless = require("serverless-http");
const connectDB = require("../../config/db");
const app = require("../../app");

const handler = serverless(app);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    return await handler(event, context);
  } catch (error) {
    console.error("Netlify Function error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
    };
  }
};
