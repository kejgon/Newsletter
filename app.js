//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded(
    { extended: true }
));

app.use(express.static("public"));//it's use to display our local files such as css, images in a folder called public


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);


    const url = "https://us18.api.mailchimp.com/3.0/lists/5c66ca2355";
    const options = {
        method: "POST",
        auth: "kejgon:bdf1549589ce9783c3a82b834c87570c-us18"
    };

    const request = https.request(url, options, (response) => {
        // console.log(response.statusCode)
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }



        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });



    });







    request.write(jsonData);

    request.end();




});

app.post("/failure", (req, res) => {
    res.redirect("/");
});


// --data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \






app.listen(process.env.PORT || 3000, () => {
    console.log("The server is running on port 3000");
});



//API KEY
//bdf1549589ce9783c3a82b834c87570c-us18
// List ID
// 5c66ca2355