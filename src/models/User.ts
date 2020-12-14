import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';

const User = createSchema(
  {
    name: Type.string({ required: true, unique: true, trim: true }),
    email: Type.string({ required: true, unique: true, trim: true }),
    password: Type.string(),
    discord: Type.string({ unique: true, spars: true }),
    friend: Type.objectId({ required: true, unique: true }),
    notification: Type.objectId({ required: true, unique: true }),
    profile: Type.string(),
    admin: Type.boolean({ required: true, default: false }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

User.plugin(mongooseUniqueValidator);

export default typedModel('User', User);
