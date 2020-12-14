import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';

const Friend = createSchema(
  {
    list: Type.array({ required: true }).of({
      id: Type.objectId({ required: true }),
      status: Type.string({ required: true }),
    }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

Friend.plugin(mongooseUniqueValidator);

export default typedModel('Friend', Friend);
