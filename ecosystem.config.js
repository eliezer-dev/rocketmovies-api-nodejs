module.exports = {
  apps : [{
    name: "app",
    script: "./src/app.js", //atualizar aqui caminho do app.js ou server.js 
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}