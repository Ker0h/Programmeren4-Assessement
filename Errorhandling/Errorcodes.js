function missingProp(res) {
    res.status(412).json({
        "msg": "Een of meer properties in de request body ontbreken of zijn foutief",
        "code": 412,
        "datetime": new Date().format("d-M-Y H:m:s")
    })
}

function notFound(res) {
    res.status(404).json({
        "msg": "Niet gevonden (huisId bestaat niet)",
        "code": 412,
        "datetime": new Date().format("d-M-Y H:m:s")
    })
}


module.exports = {
    missingProp,
    notFound
};