require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const cors = require('cors');

const genAI = new GoogleGenerativeAI(process.env.GIMINI_KEY);

// Creat api thaty calls the ducntion
const app = express();
const port = 3080;
const options = {
	origin: ['http://localhost:5173/ '],
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
	const { message, currentModel } = req.body;

	if (!message) {
		return res.status(404).json({ message: 'Input can not empty' });
	}
	try {
		const model = genAI.getGenerativeModel({ model: `${currentModel}` });

		const result = await model.generateContent(message);

		res.status(201).json({ message: result.response.text() });
	} catch (error) {
		console.log(error);
	}
});
app.get('/models', async (req, res) => {
	const { default: fetch } = await import('node-fetch');
	try {
		const resonse = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GIMINI_KEY}`
		);
		const models = await resonse.json();

		res.status(200).json({ data: models });
	} catch (error) {
		console.log(error);
	}
});

app.listen(port, () => {
	console.log(`gpt-sudo running on port http://localhost:${port}`);
});
