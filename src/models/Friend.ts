import { createSchema, Type, typedModel } from 'ts-mongoose';

const Friend = createSchema(
  {
    list: Type.array({ required: true }).of({
      id: Type.objectId({ required: true, unique: true }),
      status: Type.string({ required: true }),
    }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default typedModel('Friend', Friend);