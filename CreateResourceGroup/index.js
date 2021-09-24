const rp = require('request-promise');

const subscriptionId = "<subscriptionId here>"

function getToken() {
    //https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=javascript#obtain-tokens-for-azure-resources
    const options = {
        uri: `${process.env["IDENTITY_ENDPOINT"]}/?resource=https://management.azure.com&api-version=2019-08-01`,
        headers: {
            'X-IDENTITY-HEADER': process.env["IDENTITY_HEADER"]
        }
    };
    return rp(options)
}

function createRG(subscriptionId, resourceGroupName, token){

    //https://docs.microsoft.com/en-us/rest/api/resources/resource-groups/create-or-update
    const options = {
        method: "PUT",
        uri: `https://management.azure.com/subscriptions/${subscriptionId}/resourcegroups/${resourceGroupName}?api-version=2021-04-01`,
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: {
            location: "westus",

        },
        json: true
    }
    return rp(options)
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const {access_token} = JSON.parse(await getToken())

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(await createRG(subscriptionId, "resourceGroupName", access_token))
    };
}