const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Obtén el token y el ID de chat desde las variables de entorno
const telegramToken = process.env.TELEGRAM_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

// Crea una instancia del bot de Telegram
const bot = new TelegramBot(telegramToken);

const checkStock = async () => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const url1 =
			"https://decathlon.com.uy/botas-de-nieve/108066-2696-botas-de-nieve-y-apreski-impermeables-ninos-26-37-quechua-sh100-cana-media-azul.html";
		const url2 =
			"https://decathlon.com.uy/deportes-de-invierno/108086-2700-botas-de-nieve-y-apreski-impermeables-mujer-quechua-sh100-warm.html";

		await page.goto(url2);

		const options = await page.$$eval(
			'select[name="group[5]"] option[data-stock=""]',
			(elements) => elements.map((element) => element.textContent.trim())
		);

		console.log("Las opciones habilitadas son:");
		let mensaje =
			"Hora: " +
			new Date().toLocaleString() +
			"\n" +
			"ATENCION!: Las opciones habilitadas son: \n";
		options.forEach((optionText) => {
			console.log(optionText);
			mensaje += optionText + "\n";
		});

		if (options.length === 0) {
			mensaje =
				"Hora: " +
				new Date().toLocaleString() +
				"\n" +
				"No se encontraron elementos habilitados en el select.";
			console.log(
				"No se encontraron elementos habilitados en el select."
			);
		}

		mensaje += "\n" + url2;
		// Envía el mensaje por Telegram
		bot.sendMessage(telegramChatId, mensaje);

		await browser.close();
	} catch (error) {
		console.error("Error al realizar la solicitud:", error.message);
	}
};

checkStock();
// Ejecutar la función cada 5 minutos (300,000 milisegundos)
setInterval(checkStock, 300000);
