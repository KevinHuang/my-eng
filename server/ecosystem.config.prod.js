module.exports = {
    apps: [{
      name: "prod",
      script: "server.bundle.js",
      watch: false,
      ignore_watch: [],
      node_args: [],
      output: './pm2/out.log',
      error: './pm2/error.log',
      env: {
        PORT: 3000
      }
    }, {
      name: "beta",
      script: "server.bundle.js",
      watch: true,
      ignore_watch: [],
      node_args: [],
      output: './pm2/out.log',
      error: './pm2/error.log',
      env: {
        PORT: 4200
      }
    }]
  }