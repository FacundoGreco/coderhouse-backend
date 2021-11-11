const { admin } = require("./apiProducts.js");

//MIDDLEWARES
function validateId(req, res, next) {
	let id = req.params.id;
	if (!id) return next();

	id = Number(req.params.id);
	if (isNaN(id)) res.status(400).json({ error: "The ID entered is not a number." });
	else if (!Number.isInteger(id)) res.status(400).json({ error: "The ID entered is not an integer." });
	else {
		next();
	}
}

function validateIdProd(req, res, next) {
	let idProd = req.params.idProd;

	idProd = Number(req.params.idProd);
	if (isNaN(idProd)) res.status(400).json({ error: "The product ID entered is not a number." });
	else if (!Number.isInteger(idProd)) res.status(400).json({ error: "The product ID entered is not an integer." });
	else {
		next();
	}
}

function isAdmin(req, res, next) {
	if (admin) next();
	else res.status(403).json({ error: "You haven't got administrator privileges." });
}

exports.validateId = validateId;
exports.validateIdProd = validateIdProd;
exports.isAdmin = isAdmin;
