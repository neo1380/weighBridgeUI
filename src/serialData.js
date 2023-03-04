var port,
  textEncoder,
  // eslint-disable-next-line no-unused-vars
  writableStreamClosed,
  // eslint-disable-next-line no-unused-vars
  writer;

const serialResultsDiv = document.getElementById("serialResults");
async function connectSerial() {
  try {
    // Prompt user to select any serial port.
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    // eslint-disable-next-line no-undef
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    const value = await listenToPort();
    return value;
  } catch (e) {
    alert("Serial Connection Failed" + e);
  }
}

async function listenToPort() {
  // eslint-disable-next-line no-undef
  const textDecoder = new TextDecoderStream();
  // eslint-disable-next-line no-unused-vars
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  let i = 0;
  let weight = null;
  // Listen to data coming from the serial device.
  while (i === 0) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      console.log("[readLoop] DONE", done);
      reader.releaseLock();
      break;
    }
    i = 1;
    // value is a string.
    weight = appendToTerminal(value);
  }
  return weight;
}

async function appendToTerminal(newStuff) {
  if (serialResultsDiv) {
    serialResultsDiv.innerHTML += newStuff;
    if (serialResultsDiv.innerHTML.length > 3000)
      serialResultsDiv.innerHTML = serialResultsDiv.innerHTML.slice(
        serialResultsDiv.innerHTML.length - 3000
      );

    //scroll down to bottom of div
    serialResultsDiv.scrollTop = serialResultsDiv.scrollHeight;
  }

  return newStuff;
}

export function getSerialData() {
  console.log("Invoked serial data method....");
  connectSerial();
}

export function readSerialData() {
  console.log("Invoked read serial data method....");
  const value = (async () => {
    console.log(await connectSerial());
  })();
  console.log("Value from serial data...", value);
  return value;
}
