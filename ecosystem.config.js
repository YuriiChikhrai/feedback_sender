module.exports = {
    apps : [{
        name                : "feedback",
        script              : "./serve.js",
        watch               : false,
        max_memory_restart  : "250M",
        autorestart         : true,
        log_date_format     : "YYYY-MM-DD HH:mm Z",
        env                 : {
            PORT            : 8080
        }
    }]
};