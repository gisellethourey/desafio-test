const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    it("GET/cafes devuelve un 200 y obtener al menos un objeto del arreglo", async () => {
        const response = await request(server).get("/cafes").send();
        const status = response.statusCode;
        expect(status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach(element => {
            expect(typeof element).toBe('object');
            expect(element).not.toBeNull()  
        });
        });

    it("Obteniendo un 404 al intentar eliminar un café con un id que no existe", async()=>{
        const nonExistentId = 9999;
        const response = await request(server)
        .delete(`/cafes/${nonExistentId}`)
        .set('Authorization', 'valid-token')
        const status = response.statusCode;
        expect(status).toBe(404);
        expect(response.body).toEqual({ message:"No se encontró ningún cafe con ese id" });
    });
    it("POST/cafes agrega un nuevo cafe y devuelve un 201", async () => {
        const id = Math.floor(Math.random()*999);
        const cafe = {id, nombre: "Nuevo cafe"};
        const {body: cafes, status}= await request(server)
        .post("/cafes")
        .send(cafe);
        expect(status).toBe(201);
        expect(cafes).toContainEqual(cafe)
    });
    it("PUT/cafes devuelve un 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload",
        async () => {
            const urlId = 1;
            const payload ={id: 2, nombre: "Nuevo café"};
            const response = await request(server)
            .put (`/cafes/${urlId}`)
            .send(payload)
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "El id del parámetro no coincide con el id del café recibido"
        });
    });
});