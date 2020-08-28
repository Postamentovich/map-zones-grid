require("dotenv").config();

const getConfig = () => {
    return {
        SERVER_PORT: process.env.SERVER_PORT || 5000,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
    };
};

module.exports = { getConfig };
