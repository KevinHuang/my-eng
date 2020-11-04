module.exports = {
    apps: [{
      name: "my_eng_server",
      script: "dist/server.bundle.js",
      watch: true,
      ignore_watch: [
        './schema',
        './pm2',
        './audio'
      ],
      node_args: [
        "--inspect"
      ],
      output: './pm2/out.log',
      error: './pm2/error.log'
    }, {
      name: "hlc_phonetic_server_brk",
      script: "dist/server.bundle.js",
      watch: true,
      ignore_watch: [
        './schema',
        './pm2'
      ],
      node_args: [
        "--inspect-brk"
      ],
      output: './pm2/out.log',
      error: './pm2/error.log'
    }]
  }  