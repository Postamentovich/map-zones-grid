require("dotenv").config();

const getConfig = () => {
    return {
        SERVER_PORT: process.env.SERVER_PORT || 5000,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT || 3306,
    };
};

module.exports = { getConfig };
