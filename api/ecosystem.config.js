module.exports = {
  apps : [{
    name: 'API',
    script: 'dist/index.js',
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    // max_memory_restart: '1G',
    instance_var: 'INSTANCE_ID', // play nicely with node-config
    env: {
      NODE_ENV: 'development',
      // MY_API_PORT: 3030
    }
  }]
};
