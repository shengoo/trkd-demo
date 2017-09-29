/**
 * An application that uses a single credential for all its users can use this method to create a token.
 * The tokens have expiry timestamps associated with them and they must be renewed before they expire.
 * Note that you must use HTTPS when invoking this method.
 */

var request = require('request');

var url = "https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1";
var url2 = "http://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/TokenManagement_1/CreateImpersonationToken_3";
class TokenService{

    CreateToken(){

        var options = {
            url: url,
            headers: [
                {
                    name: 'content-type',
                    value: 'application/json'
                }
            ],
            json : {
                "CreateServiceToken_Request_1" :{
                    "Username": "trkd-demo-cs@thomsonreuters.com",
                    "ApplicationID": "trkddemoappcs",
                    "Password": "b2t3b45az"
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

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(`Token : ${body.CreateServiceToken_Response_1.Token}`);
                this.token = body.CreateServiceToken_Response_1.Token;
            }
        }

        request.post(options,callback)
    }

    CreateImpersonationToken(){
        var requestJson = `"{
        ""CreateImpersonationToken_Request_3"": {
            ""ApplicationID"": ""string"",
                ""Token"": null
        }`

    }";
    }

    hello(){
        console.log('hello')
    }
}

module.exports = new TokenService();