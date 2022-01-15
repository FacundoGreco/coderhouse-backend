import { Router } from "express";
const router = new Router();
import { fork } from "child_process";

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/:cant?", async (req, res) => {
	try {
		const { cant = 100000000 } = req.params;

		const forked = fork("src/randoms.js");

		forked.on("message", (message) => {
			if (message == "ok") {
				forked.send({ cant: cant });
			} else {
				res.json({
					numbers: JSON.stringify(message),
					os: process.platform,
					nodeVersion: process.version,
					rss: JSON.stringify(process.memoryUsage()),
					pid: process.pid,
					projectFolder: process.cwd(),
				});
			}
		});
	} catch (error) {
		res.status(500).json({ error: "Error while getting messages.", description: error.message });
	}
});

export { router };
