db.createUser({
  user: 'root',
  pwd: 'dev',
  roles: [
    {
      role: 'readWrite',
      db: 'test',
    },
  ],
});
