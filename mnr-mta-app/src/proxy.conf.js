const PROXY_CONFIG = [
    {
        context: ["/train_list", "/station_list"],
        target: "https://t08appservice.azurewebsites.net",
        secure: false,
        changeOrigin: true
    }
];

module.exports = PROXY_CONFIG;