import { Connection, createConnection, getConnection, getConnectionOptions } from 'typeorm';

const connection = {
    async create(): Promise<Connection> {
        const defaultOptions = await getConnectionOptions();
        return createConnection(defaultOptions);
    },

    async get(): Promise<Connection> {
        return getConnection();
    },

    async runAllMigration(): Promise<void> {
        const connection = getConnection();
        await connection.runMigrations();
    },

    async undoLastMigrations(): Promise<void> {
        const connection = getConnection();
        await connection.undoLastMigration();
    },

    async close(): Promise<void> {
        await getConnection().close();
    },

    async clear(): Promise<void> {
        if (process.env.NODE_ENV === 'test') {
            const connection = getConnection();
            const entities = connection.entityMetadatas;

            const entityDeletionPromises = entities.map((entity) => async () => {
                const repository = connection.getRepository(entity.name);
                const schemaPrefix = entity.schema ? `${entity.schema}` : '';
                await repository.query(
                    `TRUNCATE ${schemaPrefix}${entity.tableName} RESTART IDENTITY CASCADE`,
                );
            });

            await Promise.all(entityDeletionPromises);
        }
    },
};

export default connection;
