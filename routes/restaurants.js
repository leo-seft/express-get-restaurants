const express = require("express");
const router = express.Router(); 
const Restaurant = require("../models/index")
router.use(express.json())

const {check, validationResult} = require("express-validator")
router.use(express.urlencoded({extended: true}))

router.get("/", async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
});
router.get("/:id", async (req, res) => {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findByPk(restaurantId);
    res.json(restaurant);
})
router.post("/", [check("name").not().isEmpty().trim().withMessage("Name is missing"),check("location").not().isEmpty().trim().withMessage("Location is missing"),check("cuisine").not().isEmpty().trim().withMessage("Cuisine is missing")] ,async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({error: errors.array()})
    }else{
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant)
    }
})
router.put("/:id", async(req, res) => {
    const restaurantId = req.params.id;
    let restaurant = await Restaurant.findByPk(restaurantId);
    restaurant = await restaurant.update(req.body)
    res.json(restaurant)
})
router.delete("/:id", async(req, res) => {
    const restaurantId = req.params.id;
    let restaurant = await Restaurant.findByPk(restaurantId);
    restaurant = await restaurant.destroy()
    res.status(204).send()
})
router.put("/:id", async (req, res) => {
    const restaurantId = req.params.id;
    let restaurant = await Restaurant.findByPk(restaurantId);
  
    restaurant = await restaurant.update(req.body);
    res.json(restaurant);
  });
  

module.exports = router