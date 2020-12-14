import { createSchema, Type, typedModel } from 'ts-mongoose';

const Notification = createSchema(
  {
    list: Type.array({ required: true, defualt: [] }).of({
      title: Type.string({ required: true }),
      description: Type.string({ required: true }),
      category: Type.string({ required: true }),
    }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default typedModel('Notification', Notification);
