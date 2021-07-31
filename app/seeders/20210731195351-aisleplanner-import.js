'use strict';
const fs = require('fs').promises
var parser = require('csv-parse');

const getCSV = function (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/../import/' + file + '.csv', "utf8")
      .then(data => {
        parser(data, { 'columns': true }, function (err, rows) {
          resolve(rows);
        });
      })
  })
}

const getParties = function () {
  return new Promise(async (resolve, reject) => {
    await getCSV('parties').then(async data => {
      resolve(data.map(parties => ({
        id: parties["RSVP ID"],
        code: parties["Phone"],
        confirmed: false,
        email: parties["Email"],
        language: (parties["Language"] ? parties["Language"] : 'en'),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    })
  })
}

const getGuests = function () {
  return new Promise(async (resolve, reject) => {
    await getCSV('guests').then(async data => {

      resolve(data.map(guests => ({
        inviteId: guests["RSVP ID"],
        attending: ((guests["Response"] === "Awaiting RSVP") ? null : (guests["Response"] === "Attending")),
        name: (
          guests["First Name"].toLowerCase().includes("spouse") ||
          guests["First Name"].toLowerCase().includes("guest")
        ) ? "" : (guests["First Name"] + " " + guests["Last Name"]),
        createdAt: new Date(),
        updatedAt: new Date()
      })))

    })
  })
}




module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log("Importing")
    await getParties()
      .then(async parties => {
        await queryInterface.bulkInsert('Invites', parties, {});
        console.log("Imported Invites")
      })
      .then(async () => {
        await getGuests().then(async guests => {
          await queryInterface.bulkInsert('Guests', guests, {});
          console.log("Imported Guests")
        })
      }
      )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Guests', null, {});
    return queryInterface.bulkDelete('Invites', null, {});
  }
};
