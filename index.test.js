const request = require('supertest')
const express = require('express')
const {describe, expect, test} = require("@jest/globals")

const sequelize = require('sequelize')
const route = require("./routes/restaurants")
const Restaurant = require("./models/index")
const app = require("./src/app")
const seedRestaurant = require("./seedData")


describe("Tests for GET /restaurants", () =>{
    test("Returns the correct status code", async () =>{
        const response = await request(app).get("/restaurants")
        expect(response.statusCode).toBe(200)
    })
    test("Returns an array", async () => {
        const response = await request(app).get("/restaurants")
        expect(response.body).toBeInstanceOf(Array)
    })
    test("Returns correct number of restaurants", async () => {
        const countRestaurnats = await Restaurant.count()
        const response = await request(app).get("/restaurants")
        expect(response.body.length).toBe(countRestaurnats)
    })
    test("Returns correct restaurant data", async () => {
        const testRestaurant = await Restaurant.create({
            name: "Test Restaurant",
            location: "123 Test St",
            cuisine: "Test Cuisine"
        })
        const response = await request(app).get("/restaurants")
    
        const returnedRestaurant = response.body.find(r => r.id === testRestaurant.id)
    
        expect(returnedRestaurant).toBeDefined();
        expect(returnedRestaurant.name).toBe("Test Restaurant")
        expect(returnedRestaurant.location).toBe("123 Test St")
        expect(returnedRestaurant.cuisine).toBe("Test Cuisine")
    
    })
    test("GET /restauraunt/:id returns the correct data", async () => {
        const testRestaurant = await Restaurant.create({
            name: "Test Restaurant",
            location: "123 Test St",
            cuisine: "Test Cuisine"
        })
        const response = await request(app).get(`/restaurants/${testRestaurant.id}`)
        
        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(testRestaurant.id)
        expect(response.body.name).toBe("Test Restaurant")
        expect(response.body.location).toBe("123 Test St")
        expect(response.body.cuisine).toBe("Test Cuisine")
    })
})
describe("Other tests for /restaurants", () =>{
    test("POST /restaurants returns array with updated value", async () => {
        const newRestaurant = {
            name: "Test Restaurant",
            location: "123 Test St",
            cuisine: "Test Cuisine"
        };

        const postResponse = await request(app).post("/restaurants").send(newRestaurant);

        expect(postResponse.status).toBe(201);
        expect(postResponse.body).toBeDefined();
        expect(postResponse.body.name).toBe("Test Restaurant");
        expect(postResponse.body.location).toBe("123 Test St");
        expect(postResponse.body.cuisine).toBe("Test Cuisine");

        // const getResponse = await request(app).get("/restaurants");
        // const createdRestaurant = getResponse.body.find(r => r.id === postResponse.body.id);

        // expect(createdRestaurant).toBeDefined();
        // expect(createdRestaurant.name).toBe("Test Restaurant");
        // expect(createdRestaurant.location).toBe("123 Test St");
        // expect(createdRestaurant.cuisine).toBe("Test Cuisine");


})
    test("PUT /restaurants/:id updates correct restaurant data", async () => {
        const testRestaurant = await Restaurant.create({
            name: "Test Restaurant",
            location: "123 Test St",
            cuisine: "Test Cuisine"
        });
        const updatedRestaurant = {
            name: "Updated Restaurant",
            location: "123 Updated St",
            cuisine: "Updated Cuisine"
        };
        const putResponse = await request(app).put(`/restaurants/${testRestaurant.id}`).send(updatedRestaurant);
        
        expect(putResponse.body.name).toBe(updatedRestaurant.name);
        expect(putResponse.body.location).toBe(updatedRestaurant.location);
        expect(putResponse.body.cuisine).toBe(updatedRestaurant.cuisine);
})
test("PUT /restaurants/:id updates correct restaurant data", async () => {
    const testRestaurant = await Restaurant.create({
        name: "Test Restaurant",
        location: "123 Test St",
        cuisine: "Test Cuisine"
    });

    const deleteResponse = await request(app).delete(`/restaurants/${testRestaurant.id}`)

    const deletedRestaurant = await Restaurant.findByPk(testRestaurant.id);
    expect(deletedRestaurant).toBeNull();
})
})
describe("Tests for POST /restaurants valid", () =>{
    test("Error check for leaving out name", async () => {
        const postResponse = await request(app).post(`/restaurants`).send({
            location: "New York", cuisine: "Fast Food"
        })
      expect(postResponse.body).toEqual({
        error:[ {
            "type": "field",
            "msg": "Name is missing",
            "path": "name",
            "location": "body"
          }]
      })  
    }),
    test("Error check for leaving out location", async () => {
        const postResponse = await request(app).post(`/restaurants`).send({
            name: "Mcdonalds", cuisine: "Fast Food"
        })
      expect(postResponse.body).toEqual({
        error:[ {
            "type": "field",
            "msg": "Location is missing",
            "path": "location",
            "location": "body"
          }]
      })  
    }),
    test("Error check for leaving out cuisine", async () => {
        const postResponse = await request(app).post(`/restaurants`).send({
            name: "Mcdonalds", location: "New York"
        })
      expect(postResponse.body).toEqual({
        error:[ {
            "type": "field",
            "msg": "Cuisine is missing",
            "path": "cuisine",
            "location": "body"
          }]
      })  
    })
})