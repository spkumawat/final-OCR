const vision = require('@google-cloud/vision');
const express = require('express');
const router = express.Router();
const IDCard = require('../models/idcard')
const multer = require('multer')
var upload = multer({dest: './uploads'})



const CREDENTIALS = JSON.parse(JSON.stringify(
    {
        "type": "service_account",
        "project_id": "omega-buckeye-341405",
        "private_key_id": "308da733362a880c98545f2463b8a5cfeaa8f686",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpTMhol/cEgcpg\nZPIG24kd7wEdHYaRa5qoW/ub4L8bydU1RvxSUvux8ziaq/lMk8RYAtOb0LYx/du4\ntHWFw/Z21d4Nt6SdcPlN4AooRIYGOOHd+LNnvPZOzZjxeoyY6OOftULL88O9TNsD\njERiV01gzmbn+OEsmP00e192KoWpB4vvsoc1WDSFF9ROG8Bc0Oxx/L7CAMYwa2KH\nL3LXzg9TOfGaxV+5c6drFu1+1D2qHnebDOllx0vq+7PGDcdy6TGezjSe5a87mTZ0\ni0ANykNj0QeI6P84i3Xm5O5Kfy1xUEXUYHOwRy2RnUynuvtamQCB7qcz4oFdSH7D\n7SrqeW0DAgMBAAECggEAA8DlDJSZ8GqkPwDd8NL7NkOvRaL68cxt8F+hs3IHKqmN\n5ZF+VKDsXaSj06IOc+kuyDi/0kuNToxvS6gMlvuiQj45nxo8NxVjIZve/cePJSIr\nt80kxR8GYvbh9jCeX2GCcm8FXRo5c7/5dxmsBnYjDAtncqss6t01d+1oT2lf70Bn\nUCvV7eHlsXUMkgYzXZ0hGiSRgm/fXbNBkYnj7EvtT5xoeOr7wkRg48KqK7nHOp1C\nkbX6emyVJU9+BGB61rii5CEeb8f0Bavh6fjzbrjjKkxPYgCcRMmMWdlvk5rA8NTz\nNgyvEp4+4EEMsUEpyouU/Zs6STVz+MnwZB8lmVT1SQKBgQDjqFCDBCPPZ+M/qGCn\nTfF/K6YVbb/2zUOX6y77IfqWeV0P58lgMelAk5Ko4c6yJpvVQpJTLP2b43P8MGgO\njRAhlb5LCz0Kll0cVCl0lPfxKVNRsgx6DO3m3E75y1RfB4RqCwKFKPWFgSpbGdze\neUZvfEX2rSehL7dJEKf49eXnLwKBgQC+YI0qH0OfMYMnwDMDPlspCthlfv/U7KXk\n5b5Q6ohPLRKao2ZLxj00QG0zGh+g8HvoHvICJ1Wn8ZIN8HjuxpQ94qbOG/V+1NJ2\neWFe/4xlDD8LPCuUmtJj+0uHbgTUegZYWdviUYaaDrNC5imwZnRMzfIAnVPzVvym\n+lrqVspibQKBgHYN9VpLjkpipByBs0VvDNmWh/S6yf4w6WlhYyaFs03Ot6yk1O+W\nUk/Tdw0us6H8lXjcocaSIR1ysNXJQFyzV/cikOCXflr8KGKlXi3/hie/9135B7FO\n/RtniWjNwP3ahxb6iJ8G43MMzSsa2Udg+l6bwiguGMvkU5aHFaPr2AGvAoGAeiQ6\nDX9XhEhg7Fz8naUhGZjys1Oi0bouyUe5LfL7F0lEuWACXrVGSULYjMPC7R+9b3SD\nMmyIISL04OqavB89tuK2wF/hxsjGaup/VVLBgYc034FwOHyIZUsx7ybgBG5xqbel\nQnOp1yd9TXub3aguD6TGEizeUq5JlNvk/ppGaJUCgYEAi1zr0NeWlaMp8frjXhyF\nGzkt5nl3hnADoyRB1XPA2VrG6G3BnfbDR8XnH4WAkeqgboJiNACnUV9D9OqbU996\nWXm0/SC65S5mfSKJ+4GPjGSR8OUQK6+Kx/Jj5tZJnVOKHYz4Dkr7spX+eRNi7o03\nVgsiH7u1SwMoEcHhs0zysSg=\n-----END PRIVATE KEY-----\n",
        "client_email": "quala-project@omega-buckeye-341405.iam.gserviceaccount.com",
        "client_id": "102692756936972640090",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/quala-project%40omega-buckeye-341405.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    }
))
const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
}

const client = new vision.ImageAnnotatorClient(CONFIG);

function searchAfter(stringResult, searchString) {
    let ans = "";
    let it = stringResult.lastIndexOf(searchString);
    it += searchString.length + 1;
    while (stringResult[it] != '\n') {
        ans += stringResult[it];
        it++;
    }
    return ans;
}
function searchBefore(stringResult, searchString) {
    let ans = "";
    let it = stringResult.lastIndexOf(searchString);
    it -= 2;
    while (stringResult[it] != '\n') {
        ans += stringResult[it];
        it--;
    }
    let reversed = ans.split('').reverse().join('');
    return reversed;
}



router.get('/getIds',async (req,res)=>{
    try {
     const idCard = await IDCard.find({})
     res.json(idCard)
    } catch (error) {
     console.log(error.message)
     res.status(500).json("Internal server Error")
    }
 })
 
router.post(
    '/add',upload.single('image'),async (req, res) => {
        console.log("object")
        console.log(req.file)
        let file_path = req.file.path
        try {
            let [result] = await client.textDetection(file_path);
            console.log(result);
            let stringResult = result.fullTextAnnotation.text;
            const identificationNumber = searchAfter(stringResult, "Thai National ID Card")
            const name = searchAfter(stringResult, "Name");
            const lastName = searchAfter(stringResult, "Last name");
            const birthDate = searchAfter(stringResult, "Date of Birth");
            const issueDate = searchBefore(stringResult, "Date of Issue")
            const expiryDate = searchBefore(stringResult, "Date of Expiry")
            try {
                const idCard = new IDCard({ identification_number: identificationNumber, name: name, last_name: lastName, date_of_birth: birthDate, date_of_issue: issueDate, date_of_expiry: expiryDate })
                await idCard.save();
                // res.redirect("http://localhost:3000/")
                res.json(idCard)
                console.log(idCard);
            } catch (error) {
                console.log(error.message)
                res.status(500).json("Internal server Error")
            }
        } catch (error) {
            console.log("errorroror",error.message)
            res.status(500).json("Internal server Error")
        }
    }
)

router.put("/update/:id",async (req,res)=>{
    const {identification_number,name,last_name,date_of_birth,date_of_issue,date_of_expiry} = req.body;
    const newId = {}
    newId.identification_number=identification_number;
    newId.name=name;
    newId.last_name=last_name;
    newId.date_of_birth=date_of_birth;
    newId.date_of_issue=date_of_issue;
    newId.date_of_expiry=date_of_expiry
    
    try {
    const idCard = await IDCard.findById(req.params.id)
    if(!idCard){return res.status(401).res("Not Found")}
    const updatedId = await IDCard.findByIdAndUpdate(req.params.id,{$set : newId},{new:true})
    res.json(updatedId)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server Error")
    }

})


router.delete("/delete/:id",async (req,res)=>{
    try {
    const  idCard= await IDCard.findById(req.params.id)
    if(!idCard){return res.status(401).res("Not Found")}
    const updatedId = await IDCard.findByIdAndDelete(req.params.id)
    res.send("Success")
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server Error")
    }
})

module.exports = router;