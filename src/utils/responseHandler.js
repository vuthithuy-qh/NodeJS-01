
const respond = (res, status, body) =>{
    res.status(status).json(body);
}


module.exports = {respond};