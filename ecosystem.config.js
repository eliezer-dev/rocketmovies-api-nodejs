module.exports = {
  apps : [{
    name: "rocketmovies-api-nodejs",
    script: "./src/app.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}