import uniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';

const User = createSchema(
  {
    name: Type.string({ required: true, unique: true, trim: true }),
    email: Type.string({ required: true, unique: true, trim: true }),
    password: Type.string({ required: true }),
    discord: Type.string({ unique: true }),
    friend: Type.objectId({ required: true, unique: true }),
    notification: Type.array().of(Type.objectId()),
    profile: Type.string(),
    admin: Type.boolean({ required: true, default: false }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

User.plugin(uniqueValidator);

export default typedModel('User', User);
