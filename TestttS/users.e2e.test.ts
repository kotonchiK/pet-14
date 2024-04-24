import { basicAuth, startDb, stopDb } from "./serverForTests";
import { HttpStatus } from "@nestjs/common";
import request from "supertest";
describe('E2E Test for users', () => {
  let httpServer
  beforeAll(async () => {
    httpServer = await startDb()
  })

  afterAll(async () => {
    await stopDb()
  })

  it('Create new user', async () => {

    const dto = {
      email:'testEmail@mail.com',
      login:'testLogin',
      password:'testPassword'
    }

    const response = await request(httpServer)
      .post('/users')
      .send(dto)
      .set('Authorization', basicAuth())

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.login).toBe(dto.login);
    expect(response.body.email).toBe(dto.email);
    expect(response.body.createdAt).toEqual(expect.any(String));

    const userId = response.body.id

    expect.setState({userId})
  });

  it("Get all users", async () => {

    const response = await request(httpServer)
      .get('/users')
      .set('Authorization', basicAuth())

    console.log(response.body)

    expect(response.body.items).toEqual(expect.any(Array))
    expect(response.status).toBe(HttpStatus.OK)
  });

  it('Delete user ', async () => {
    const {userId} = expect.getState()

    await request(httpServer)
      .delete('/users/' + userId)
      .set('Authorization', basicAuth())
      .expect(HttpStatus.NO_CONTENT)
  })

  it('Delete user, should return 404 ', async () => {
    const {userId} = expect.getState()

    await request(httpServer)
      .delete('/users/' + userId)
      .set('Authorization', basicAuth())
      .expect(HttpStatus.NOT_FOUND)
  })

})

