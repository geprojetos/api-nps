import { Connection, createConnection, getConnectionOptions } from "typeorm";

enum EnviromentType {
  TEST = "test",
}

export default async (): Promise<Connection> => {
  const deafultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(deafultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "./src/database/database.test.sqlite"
          : deafultOptions.database,
    })
  );
};
