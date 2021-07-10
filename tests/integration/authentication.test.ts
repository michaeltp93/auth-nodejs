import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import connection from '../../src/database/connection';
import { IUser } from '../../src/interfaces/User';

const createMockUser = async (user?: Partial<IUser>) => {
    faker.locale = 'pt_BR';

    const userToCreate = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
    };

    const response = await request(app).post('/users').send(userToCreate);

    const outputUser = Object.assign({}, userToCreate, user);

    return { raw: outputUser, fill: response.body };
};

describe('Authentication', () => {
    beforeAll(async () => {
        const connectionDB = await connection.create();
        await connectionDB.runMigrations();
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await connection.clear();
    });

    it('Should not authentication with invalid credentials', async () => {
        const userMockWithInvalidPassword = await createMockUser({
            password: '00000000000000000',
        });

        const response = await request(app).post('/auth').send(userMockWithInvalidPassword.raw);

        expect(response.status).toBe(401);
    });

    it('Should be able to access private routes when authenticated', async () => {
        const userMock = await createMockUser();

        const responseWithToken = await request(app).post('/auth').send(userMock.raw);

        const bearerToken = responseWithToken.headers['access-token'];

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${bearerToken}`);

        expect(response.status).toBe(200);
    });

    it('Should not be able to access private routes without jwt token', async () => {
        const userMock = await createMockUser();

        await request(app).post('/auth').send(userMock.raw);

        const response = await request(app).get('/dashboard');

        expect(response.status).toBe(401);
    });

    it('Should not be able to access private routes with invalid jwt token', async () => {
        const userMock = await createMockUser();

        const responseWithToken = await request(app).post('/auth').send(userMock.raw);

        responseWithToken.headers['access-token'];

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${faker.datatype.uuid()}`);

        expect(response.status).toBe(401);
    });
});
