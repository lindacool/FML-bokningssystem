const express = require('express');
const router = express.Router();
const {
    Booking,
    validateBooking
} = require('../model/bookingModel');
const {
    User,
    validateUser
} = require('../model/userModel');
const {
    Restaurant,
    validateRestaurant
} = require('../model/restaurantModel');
// Importerade Moment i både api samt client för att lättare kunna arbeta med datumformatering
const moment = require('moment');
const { request } = require('express');



router.get("/", async (req, res) => {

    const allUsers = await User.find();
    
    res.send(allUsers);
    
});


router.get("/getAvailability/:restaurantId/:date/:people", async (req, res) => {

    // Skickar med user input: Date + # of people. OBS: Just nu så blir datumet en dag tidigare
    // I post-requestens params så måste restaurangens ID (drop down?) samt datum i format YYYY-MM-DD
    var date = new moment(req.params.date).format('L');
    const bookings = await Booking.find({
        date: date
    });
    const restaurant = await Restaurant.findOne({
        restaurantId: req.params.restaurantId
    });
    let tableSize = restaurant.tableSize;
    let sittings = restaurant.sitting;
    let tableAmount = restaurant.tables;

    let availabilityPerSitting = sittings.map(sitting => {

        return getAvailabilityPerSitting(tableSize, tableAmount, sitting);

    });

    // Kolla upp om det finns tillräckligt med bord för varje tid. Returnera endast de tider som finns tillgängliga
    let tablesNeeded = Math.ceil(req.params.people / tableSize);
    let tablesAvailable = [];
    availabilityPerSitting.forEach(sitting => {

        if (sitting.tablesAvailable >= tablesNeeded) {
            tablesAvailable.push(sitting.sitting);
        };
    });


    // Funktion som räknar ut hur många bord som finns tillgängliga och returnerar ett objekt innehållande bokningen samt antal lediga bord
    function getAvailabilityPerSitting(tableSize, tableAmount, sitting) {

        let tablesOccupied = 0;

        bookings.forEach(booking => {
            if (booking.time == sitting) {
                if (booking.numberOfPeople > tableSize) {
                    tablesOccupied += Math.ceil(booking.numberOfPeople / tableSize);
                } else {
                    tablesOccupied += 1;
                }
            }
        });

        let tablesAvailable = (tableAmount - tablesOccupied);

        return {
            sitting: sitting,
            tablesAvailable: tablesAvailable
        }
    }

    // Få tillbaka: Tillgängliga tider för det datumet / alternativt felmeddelande som säger att det inte finns tillräckligt många bord för det sällskapet
    res.send(tablesAvailable)

});

router.post("/createUser/:firstName/:lastName/:email/:phoneNumber", async (req, res) => {

    // const userToFind = await User.findOne({
    //     email: req.body.email
    // });
    let userToFind = false;
    const allUsers = await User.find();

    // Om inte användaren finns så skapas en ny user
    if (!userToFind) {
        let newUser = await new User({
            userId: allUsers.length + 1,
            firstName: req.params.firstName,
            lastName: req.params.lastName,
            email: req.params.email,
            phoneNumber: req.params.phoneNumber
        }).save((error, succes) => {
            if (error) {
                res.send(error.message)
            }
            if (succes) {
                res.send(newUser)
            }
        });
    };

});

router.post("/createBooking/:restaurantId/:date/:people/:sitting/:email", async (req, res) => {

    const userToFind = await User.findOne({
        email: req.params.email
    });
    const bookings = await Booking.find();

    var lastBookingId = bookings[bookings.length - 1].bookingId;

    let newBooking = await new Booking({
        bookingId: lastBookingId + 1,
        restaurantId: req.params.restaurantId,
        date: new moment(req.params.date).format('L'),
        time: req.params.sitting,
        numberOfPeople: req.params.people,
        customerId: 99 // Måste hämtas från användaren
    }).save((error, succes) => {
        if (error) {
            res.send(error.message)
        } else {
            res.send(newBooking);
        }
    });

    // Skicka bekräftelsemail till kunden där denne kan avboka tiden

});



router.delete("/deleteBooking/:id", async (req, res) => {

    // Tar bort en bokning från databasen. Användaren skickar en delete-request i form av en knapp eller länk där bokingsId skickas med.
    const booking = await Booking.remove({
        bookingId: req.params.id
    });

    res.send(booking)

});

module.exports = router;