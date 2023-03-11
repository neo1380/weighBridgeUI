import { UpdateWeightData } from "./pages/WeightManagement";

var port,
  textEncoder,
  // eslint-disable-next-line no-unused-vars
  writableStreamClosed,
  // eslint-disable-next-line no-unused-vars
  writer;

// const serialResultsDiv = document.getElementById("serialResults");
export async function connectSerial() {
  try {
    // Prompt user to select any serial port.
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    // eslint-disable-next-line no-undef
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    await listenToPort();
  } catch (e) {
    console.error("Serial Connection Failed" + e);
    UpdateWeightData(e);
  }
}

async function listenToPort() {
  // eslint-disable-next-line no-undef
  const textDecoder = new TextDecoderStream();
  // eslint-disable-next-line no-unused-vars
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  // Listen to data coming from the serial device.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      console.log("[readLoop] DONE", done);
      reader.releaseLock();
      break;
    }
    // value is a string.
    appendToTerminal(value);
    UpdateWeightData(value);
  }
}

function appendToTerminal(newStuff) {
  console.log(newStuff);
}
