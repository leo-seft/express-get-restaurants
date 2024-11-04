const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");
const res = require("express/lib/response");
const req = require("express/lib/request");

//TODO: Create your GET Request Route Below: 

app.get("/restaurants", async (request, response) => {
    const restaurants = await Restaurant.findAll();
    response.json(restaurants);
});

app.get("/restaurants/:id", async (request, response) => {
    const restaurantId = request.params.id;
    const restaurant = await Restaurant.findByPk(restaurantId);
    response.json(restaurant);
})

app.use(express.json())

app.post("/restaurants", async (request,response) => {
    const newRestaurant = await Restaurant.create(request.body);
    response.json(newRestaurant)
})

app.put("/restaurants/:id", async(request, response) => {
    const restaurantId = request.params.id;
    let restaurant = await Restaurant.findByPk(restaurantId);
    restaurant = await restaurant.update(request.body)
    response.json(restaurant)
})

app.delete("/restaurants/:id", async(request, response) => {
    const restaurantId = request.params.id;
    let restaurant = await Restaurant.findByPk(restaurantId);
    restaurant = await restaurant.destroy()
    response.status(204).send()
})

module.exports = app;