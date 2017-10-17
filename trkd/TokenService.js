/**
 * An application that uses a single credential for all its users can use this method to create a token.
 * The tokens have expiry timestamps associated with them and they must be renewed before they expire.
 * Note that you must use HTTPS when invoking this method.
 */

var request = require('request');
var fs = require('fs');
var schedule = require('node-schedule');
var constants = require('../constants');

const username = 'trkd-demo-wm@thomsonreuters.com',
    applicationId = 'trkddemoappwm',
    password = 'r5c4z68bl';

var url = "https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1";
var url2 = "http://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/TokenManagement_1/CreateImpersonationToken_3";
const validateTokenUrl = "http://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/TokenManagement_1/ValidateToken_1";

const token = 'B0A258E5149256A5CABDAABA0CAF586832E543D845B2DDE5915365C024FB74B55C43AAB69C3DA9747904FD43E086D20B7FAEE61C2AB90B3C2D5969A44107F66B498C2D6D680C21150E9B6FAAA7B7839880A56BAABDE1DCDD35878871547E1297';

// {
//     "CreateServiceToken_Request_1" :{
//         "Username": "trkd-demo-wm@thomsonreuters.com",
//         "ApplicationID": "trkddemoappwm",
//         "Password": "r5c4z68bl"
//     }
// }

/**
 * Save token and expire time into files and memory.
 * Read from file in constructor.
 * Validate token.
 * Save in memory and file.
 */
class TokenService {

    getToken() {
        console.log('getToken')
        if (this.token && this.expireTime) {
            if (Date.now() < new Date(this.expireTime)) {
                console.log('return token from memory.');
                return this.token;
            } else {
                return this.CreateToken();
            }
        }
        else if (fs.existsSync(constants.tokenFilePath)) {
            try {
                var content = fs.readFileSync(constants.tokenFilePath, 'utf8');
                var cacheToken = JSON.parse(content);
                this.token = cacheToken.token;
                this.expireTime = cacheToken.expireTime;
                this.setupScheduler();
                console.log('return token from file.');
                return this.token;
            } catch (e) {
                console.log(e);
                return this.CreateToken();
            }
        } else {
            return this.CreateToken();
        }
    }

    setupScheduler(){
        schedule.scheduleJob(new Date(this.expireTime), () => {
            console.log(`refresh token ${Date.now().toUTCString()}`);
            this.CreateToken();
        });
        console.log(`set up scheduler to refresh token at ${new Date(this.expireTime).toUTCString()}`);
    }

    CreateToken() {
        console.log('create a new token')
        return new Promise((resolve, reject) => {
            var options = {
                url: url,
                json: {
                    "CreateServiceToken_Request_1": {
                        "Username": username,
                        "ApplicationID": applicationId,
                        "Password": password
                    }
                }
            };


            const callback = (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    // console.log(`Token : ${body.CreateServiceToken_Response_1.Token}`);
                    this.token = body.CreateServiceToken_Response_1.Token;
                    this.expireTime = body.CreateServiceToken_Response_1.Expiration;
                    this.setupScheduler();
                    var cacheData = {
                        token: this.token,
                        expireTime: this.expireTime
                    }
                    // fs.openSync(constants.tokenFilePath, 'w');
                    fs.writeFile(constants.tokenFilePath, JSON.stringify(cacheData), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(`Token saved in ${constants.tokenFilePath}!`);
                    });
                    resolve(body.CreateServiceToken_Response_1.Token)
                } else {
                    reject(body);
                }
            };

            request.post(options, callback)
        });
    }

    validateToken(token) {
        var requestJson = {
            ValidateToken_Request_1: {
                ApplicationID: applicationId,
                Token: token || this.token
            }
        };
        const options = {
            url: validateTokenUrl,
            headers: {
                'X-Trkd-Auth-ApplicationID': applicationId,
                'X-Trkd-Auth-Token': token || this.token
            },
            json: requestJson
        };
        // console.log(options)
        request.post(options, (error, response, body) => {
            // console.log(error,response.statusCode)
            if (!error && response.statusCode == 200) {
                // console.log(error,response.statusCode)
                if (body.ValidateToken_Response_1.Valid) {
                    console.log('valid')
                } else {
                    console.log('invalid')
                }
            } else {
                console.log(JSON.stringify(body, '', 4));
            }
        })
    }

    CreateImpersonationToken() {
        var requestJson = {
            CreateImpersonationToken_Request_3: {
                ApplicationID: applicationId,
                Token: this.token
            }
        };
        var options = {
            url: url2,
            headers: [
                {
                    name: 'content-type',
                    value: 'application/json'
                }
            ],
            json: requestJson
        };
        request.post(options, (error, response, body) => {
            console.log(JSON.stringify(body))
        })
    }

    hello() {
        console.log('hello')
    }
}

module
    .exports = new TokenService();