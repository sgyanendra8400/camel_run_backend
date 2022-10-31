import mongoose from 'mongoose';

export const ConnetDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URL}`, {
      // useNewUrlParser:true
    });
    console.log('Mongoose Connected...')
  } catch (error) {
    console.error(`Mongoose Error: `, error);
  }
};
module.exports = { ConnetDB };
