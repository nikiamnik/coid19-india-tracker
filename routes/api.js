const { Router } = require('express');
const request = require('request-promise')

const router = Router();

const urlStateWise = "https://api.covid19india.org/state_district_wise.json";
const urlCounryWise = "https://api.covid19india.org/data.json"

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
        //Getting all countrywise details from API
        let objCountryRawData = await request({
            uri: urlCounryWise,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;',

            },
            json: true
        });
        const {statewise} = objCountryRawData
        const intCountryTotalConfirmed = parseInt(statewise[0].confirmed)
        const intCountryTotalActive = parseInt(statewise[0].active)
        const intCountryTotalDeaths = parseInt(statewise[0].deaths)
        const intMaxConfirmedCount = parseInt(statewise[1].confirmed)

        //Getting the raw state wise data from API
        let objRawData = await request({
            uri: urlStateWise,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;',

            },
            json: true
        });

        const arrRawData = Object.entries(objRawData)
        let arrStateDetails = []
        let strState
        let intStateId
        let objStateDetails
        let intConfirmed = 0
        let tmpDescription = ""
        let strDescription = ""
        let strDistrict
        let strConfirmed
        let strStateColor

        arrRawData.forEach((arrState) => {
            strState = arrState[0]
            intStateId = arrStateMapping[strState]

            const arrDistricts = Object.entries(arrState[1]['districtData'])
            
            arrDistricts.forEach((arrDistrict) => {
                strDistrict = arrDistrict[0]
                strConfirmed = arrDistrict[1].confirmed
                tmpDescription +=  strDistrict+": "+strConfirmed+ "<br/>"
                intConfirmed += parseInt(strConfirmed)
            })

            strDescription += tmpDescription
            tmpDescription = ""

            let intCountRange = intMaxConfirmedCount / 5 
            let intMaxCounter = 0 
            let intMinCounter = 0
            const arrColors = ['#FDD5C3','#FCA487','#FA7051','#E8382C','#BB151A']
            for(let i=0; i<=4 ; i++){
                intMaxCounter += intCountRange
                if(intConfirmed >=intMinCounter &&  intConfirmed <= intMaxCounter){
                    strStateColor = arrColors[i]
                }
                intMinCounter += intCountRange
            }
            
            //console.log(dblCountRatio)
            
            //getting the state color by counts
            
            
            objStateDetails = {
                    name: "<u>"+strState+ "</u>",
                    description: "<br/><label style='color:red'>Total Confirmed: "+intConfirmed +"</label><br/>" +strDescription,
                    color: strStateColor,
                    zoomable: "no"
            }
            arrStateDetails[intStateId] = objStateDetails

            intMaxCount = 
            intConfirmed = 0
            strDescription = ""
            strStateColor = ""
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

});

module.exports = router;
