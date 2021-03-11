const express = require('express');
const app = express();
const port = 8080;

const indexPage = `
	<html>
	<body>
	<script>
	const sse = new EventSource("/events");
	sse.addEventListener("message", (e) => {
		document.body.innerHTML += e.data + "<br />";
	});
	</script>
	</body>
	</html>
`;

app.get('/', (req, res) => res.send(indexPage));
app.get('/events', (req, res) => {
	console.log(`Client connected!`);
	req.socket.setTimeout(1000000);
	res.status(200).set({
		'connection': 'keep-alive',
		'cache-control': 'no-cache',
		'content-type': 'text/event-stream'
	});

	let count = 0;
	const timer = setInterval(() => {
		res.write(`data: ${++count}\n\n`);
		console.log(`Sending: ${count}`);
	}, 1000);

	req.on("close", () => {
		console.log(`Client disconnected!`);
		clearTimeout(timer);
	});
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


