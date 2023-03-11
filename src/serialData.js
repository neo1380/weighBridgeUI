var port,
  textEncoder,
  // eslint-disable-next-line no-unused-vars
  writableStreamClosed,
  // eslint-disable-next-line no-unused-vars
  writer;

// const serialResultsDiv = document.getElementById("serialResults");
async function connectSerial() {
  try {
    // Prompt user to select any serial port.
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    // eslint-disable-next-line no-undef
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    return await listenToPort(true);
  } catch (e) {
    console.error("Serial Connection Failed" + e);
  }
}

async function listenToPort(flag) {
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
    return value;
  }
}

/* function appendToTerminal(newStuff) {
  return newStuff;
} */

export function formatValue(str) {
  // const str = "US,NT,-113.0254kg";
  if (typeof str === "undefined") return;
  const res = str
    .replace("US", "")
    .replace("NT", "")
    .replace("kg", "")
    .replace(/,/g, "");

  return Math.abs(res);
}
export function getSerialData() {
  console.log("Invoked serial data method,GET SERIAL METHOD....");
  connectSerial();
}

export async function readSerialData() {
  return await connectSerial();
}
