const { Router } = require('express');
const request = require('request-promise')

const router = Router();

const url = "https://api.covid19india.org/state_district_wise.json";

const arrStateMapping = {
    "Andaman and Nicobar Islands": 1,
    "Andhra Pradesh": 2,
    "Arunachal Pradesh": 3,
    "Assam": 4,
    "Bihar": 5,
    "Chandigarh": 6,
    "Chhattisgarh": 7,
    "Dadra and Nagar Haveli": 8,
    "Daman and Diu": 9,
    "Delhi": 10,
    "Goa": 11,
    "Gujarat": 12,
    "Haryana": 13,
    "Himachal Pradesh": 14,
    "Jharkhand": 16,
    "Karnataka": 17,
    "Kerala": 18,
    "Lakshadweep": 19,
    "Madhya Pradesh": 20,
    "Maharashtra": 21,
    "Manipur": 22,
    "Meghalaya": 23,
    "Mizoram": 24,
    "Nagaland": 25,
    "Odisha": 26,
    "Puducherry": 27,
    "Punjab": 28,
    "Rajasthan": 29,
    "Sikkim": 30,
    "Tamil Nadu": 31,
    "Tripura": 32,
    "Uttar Pradesh": 33,
    "Uttaranchal": 34,
    "West Bengal": 35,
    "Jammu and Kashmir": 36,
    "Telangana": 37
}

/* GET index page. */
router.get('/get-covid-india', async (req, res, next) => {

    try{
        let apiData = await request({
            uri: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;',

            },
            json: true
        });

        const arrRawData = Object.entries(apiData)

        let arrStateDetails = []
        let strState
        let intStateId
        let objStateDetails
        let intConfirmed = 0
        arrRawData.forEach((arrState) => {
            strState = arrState[0]
            intStateId = arrStateMapping[strState]

            const arrDistricts = Object.entries(arrState[1]['districtData'])
            
            arrDistricts.forEach((arrDistrict) => {
                intConfirmed += parseInt(arrDistrict[1].confirmed)
            })

            objStateDetails = {
                    name: strState,
                    description: "Count: "+ intConfirmed,
                    color: "red",
                    zoomable: "no"
            }
            arrStateDetails[intStateId] = objStateDetails
            intConfirmed = 0
        });
        //console.log(arrStateDetails)
        res.send(arrStateDetails)
        
    }catch(error){
        console.log(error)
        res.send({
            status: "Error",
            message: error.message
        })
    }

    

    //res.send(apiData)
    
    //console.log(apiData)

});

module.exports = router;
