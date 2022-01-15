function getRandoms(cant) {
	let numbers = {};
	for (let i = 0; i < cant; i++) {
		const random = Math.floor(Math.random() * (1000 - 1) + 1);

		if (numbers[random.toString()]) {
			numbers[random.toString()]++;
		} else {
			numbers[random.toString()] = 1;
		}
	}
	return numbers;
}

process.on("message", (message) => {
	const numbers = getRandoms(message.cant);

	process.send(numbers);
	process.exit();
});

process.send("ok");
