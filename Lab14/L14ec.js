const fs = require('fs');


let filename = __dirname+'/user_data.json';

//scoping - available for entire program including app.post
let user_reg_data;

//If the file name exists synchronously, read data and parse data
if(fs.existsSync(filename)){
    //read contents of file synchronously
    let data = fs.readFileSync(filename, 'utf-8');

    //parse data into js object because above code returns the data as a string, but we want JSON formatting
    user_reg_data = JSON.parse(data);

    //create a stats object off of that file
    let user_stats = fs.statSync(filename);

    //stats size = size of the object
    let stats_size = user_stats.size;

    console.log(`The file name ${filename} has ${stats_size} characters.`);
} else {
console.log(`The file name ${filename} does not exist.`);
}


//part 4 of lab12 - creating username and pushing to json file - defining new user and password
let username = 'newuser';
user_reg_data[username] = {};
user_reg_data[username].password = 'newpass';
user_reg_data[username].email = 'newuser@user.com';

//use filesync to build a filename and use json stringify of the user reg data file, and to write into it we use utf-8 encoding
//writes updated user reg data back to the json file specified by this filename variable, and the updated info is from code above, and using fs write file sync (sync command). convert the js object into a json formatted string right into user data json.
fs.writeFileSync(filename, JSON.stringify(user_reg_data), 'utf-8');

let express = require('express');
let app = express();


app.use(express.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
let user_return = request.query.username || "";
let errorMessage = request.query.error || "";

let login_form = `
    <body>
            <div id="errMsg"></div>
    <form action="/login" method="POST">
    <input type="text" name="username" id="username" size="40" placeholder="enter username" ><br />
    <input type="password" name="password" size="40" placeholder="enter password"><br />
    <input type="submit" value="Submit" id="submit">
    </form>
    <script>
        document.getElementById("username").value = "${user_return}";
        let errMsg = "${errorMessage}";
        if (errMsg !== "") {
            document.getElementById("errMsg").innerHTML = errMsg;
        }
    </script>
    </body>
         `;
    response.send(login_form);
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not

    // Retrieve the user's entered information
    let username_entered = request.body['username'];
    let password_entered = request.body['password'];

    let response_msg = "";
    let errors = false;

    // Check if the username exists in user_reg_data, such as dport username exists
    if (typeof user_reg_data[username_entered] != 'undefined') {
        // Check if the password matches with the username
        if (password_entered == user_reg_data[username_entered].password) {
            response_msg = `${username_entered} is logged in.`;
        } else {
            response_msg = `Incorrect password.`;
            errors = true;
        }
    } else {
        response_msg = `${username_entered} does not exist.`;
        errors = true;
    }

    //if no errors, send response message
    if (!errors) {
        response.send(response_msg);
    } else {
        //reload page with error
        response.redirect(`./login?error=${response_msg}&username=${username_entered}`);
    }

});

app.listen(8080, () => console.log(`listening on port 8080`));

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
        <input type="email" name="email" size="40" placeholder="enter email"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
 });

 app.post ("/register", function (request, response) {
    // process a simple register form
    let new_user = request.body.username;

    let errors = false;
    let resp_msg = "";

    if (typeof user_reg_data[new_user] != 'undefined') {
        resp_msg = 'Username unavailable. Please enter a different username.';
        errors = true;
    } else if (request.body.password == request.body.repeat_password) {
        user_reg_data[new_user] = {};
        user_reg_data[new_user].name = request.body. name;
        user_reg_data[new_user].password = request.body .password;
        user_reg_data[new_user].email = request.body.email;
        
        fs.writeFileSync(filename, JSON.stringify (user_reg_data), 'utf-8');
        response.redirect( `./login`);

    } else {
        resp_msg = 'Repeat password does not match with password.'
        errors = true;
    }

    if (errors) {
    response.send (resp_msg) ;
    }
    });