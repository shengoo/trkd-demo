/**
 * An application that uses a single credential for all its users can use this method to create a token.
 * The tokens have expiry timestamps associated with them and they must be renewed before they expire.
 * Note that you must use HTTPS when invoking this method.
 */

var request = require('request');

const username = 'trkd-demo-cs@thomsonreuters.com',
    applicationId = 'trkddemoappcs',
    password = 'b2t3b45az';

var url = "https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1";
var url2 = "http://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/TokenManagement_1/CreateImpersonationToken_3";
const validateTokenUrl = "http://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/TokenManagement_1/ValidateToken_1";

const token = '14AF8DFFD2DBB3DFF05067B75EA27488BBEBAC031AC1FE0382F1BFBDDC0C8CDC23BB190DE21552FE739B07F2BCC1DF0C1999D2CABF9B8DC742105B8DC166B4F4A48A3EDE83B48748D691A77A8F8FC8A6D5FADC35298A842C2A33A6B1EF6545F2';

class TokenService {

    CreateToken() {

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

        /**
         * { CreateServiceToken_Response_1: {
         *  Expiration: '2017-09-29T10:53:29.9553389Z',
         *  Token: '' } } }
         * @param error
         * @param response
         * @param body
         */

        const callback = (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(`Token : ${body.CreateServiceToken_Response_1.Token}`);
                this.token = body.CreateServiceToken_Response_1.Token;
            }
        }

        request.post(options, callback)
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
            headers:{
                'X-Trkd-Auth-ApplicationID':applicationId,
                'X-Trkd-Auth-Token': token || this.token
            },
            json: requestJson
        };
        // console.log(options)
        request.post(options, (error, response, body) => {
            // console.log(error,response.statusCode)
            if (!error && response.statusCode == 200) {
                // console.log(error,response.statusCode)
                if(body.ValidateToken_Response_1.Valid){
                    console.log('valid')
                }else{
                    console.log('invalid')
                }
            }
            // console.log(JSON.stringify(body,'',4))
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