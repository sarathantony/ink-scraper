require("dotenv").config();

const { PDFParse } = require("pdf-parse");
const { extractNumbers } = require("../utils/common.utils");

async function getResults(serialNumber) {
  const url = `${process.env.TARGET_URL}${serialNumber}`;

  try {
    const parser = new PDFParse({ url });
    const result = await parser.getText();

    if (!result?.text) {
      throw new Error("No text content found in the PDF.");
    }

    const text = result.text.replace(/\s+/g, " ").trim();
    // Remove the date occurances as it could be a match(four digits) for year in dd/mm/yyyy.
    const sanitizedText = text.replace(
      /\b\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s+--\s+\d+\s+of\s+\d+\s+--/g,
      ""
    );
    const data = {
      serialNumber:
        sanitizedText.match(/LOTTERY\s+NO\.([A-Z]{1,3}-\d+)/i)?.[1].replace("-", "") ||
        null,
      date: sanitizedText.match(/\b\d{2}\/\d{2}\/\d{4}\b/)?.[0] || null,
      fiveThousand: extractNumbers(
        sanitizedText,
        /4th\s*Prize[-\s]*Rs\s*:?5000\/?-?\s*(.*?)5th\s*Prize/,
        /3rd Prize[-\s]*Rs\s*:?5000\/?-?\s*(.*?)4th Prize/
      ),
      twoThousand: extractNumbers(
        sanitizedText,
        /5th\s*Prize[-\s]*Rs\s*:?2000\/?-?\s*(.*?)6th\s*Prize/,
        /4th Prize[-\s]*Rs\s*:?2000\/?-?\s*(.*?)5th Prize/
      ),
      thousand: extractNumbers(
        sanitizedText,
        /6th\s*Prize[-\s]*Rs\s*:?1000\/?-?\s*(.*?)7th\s*Prize/,
        /5th Prize[-\s]*Rs\s*:?1000\/?-?\s*(.*?)6th Prize/
      ),
      fiveHundred: extractNumbers(
        sanitizedText,
        /7th\s*Prize[-\s]*Rs\s*:?500\/?-?\s*(.*?)8th\s*Prize/,
        /6th Prize[-\s]*Rs\s*:?500\/?-?\s*(.*?)7th Prize/
      ),
      twoHundred: extractNumbers(
        sanitizedText,
        /8th\s*Prize[-\s]*Rs\s*:?200\/?-?\s*(.*?)9th\s*Prize/,
        /7th Prize[-\s]*Rs\s*:?200\/?-?\s*(.*?)8th Prize/
      ),
      hundred: extractNumbers(
        sanitizedText,
        /9th\s*Prize[-\s]*Rs\s*:?100\/?-?\s*(.*?)The prize winners/i,
        /8th Prize[-\s]*Rs\s*:?100\/?-?\s*(.*?)The prize winners/i
      ),
    };

    return data;
  } catch (error) {
    console.error("Error while processing PDF:", error.message || error);
  }
}

module.exports = { getResults };
