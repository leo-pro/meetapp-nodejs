module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  port: 5432,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
