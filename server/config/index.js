const getConfig = () => {
    return {
        SERVER_PORT: process.env.SERVER_PORT || 5000,
    };
};

module.exports = { getConfig };
