const endpointsJson = require('./endpoints.json');

function getAPI (req, res) {
    res.status(200).send({ endpoints: endpointsJson })
};

// function getTopics (req, res) {
//     res.status(200).send({  })
// }

module.exports = { getAPI };