import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/subscription', {
  dialect: 'postgres',
  logging: false, // set to console.log to see the raw SQL queries
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    
    // Sync all defined models to the DB
    await sequelize.sync({ alter: true });
    console.log('All models synchronized');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
};

export default sequelize;
