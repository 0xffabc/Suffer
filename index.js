const socks = require("./socks/index.js");
const cipher = require("./protoc/index.js");
const arch = require("./arch/index.js");

/**
  * Todo: separate to classes (refactor)
  * fpe ff1 non finished, brotli compression finished (requires dependencies)
**/

const interface = new socks();

if (process.argv.length % 2 != 0) {
  throw new TypeError("Critical! Failed to cparse args -> (argv mod 2) not equal 0");
} else {
  const isClient = process.argv.includes("--client");
  const port = parseInt(process.argv[process.argv.indexOf("--port") + 1]) || 1080;
  const host = process.argv[process.argv.indexOf("--host") + 1] || "0.0.0.0";
  const cipherKey = process.argv[process.argv.indexOf("--private") + 1];

  /**
    * Initialize cipher and client -> server
    * Communication
  **/

  cipher.set(cipherKey);
  arch.init({
    port, cipher,
    mode: isClient ? "client" : "server",
    host, cipherKey
  });

  if (isClient) {
    /**
      * For client: We should redirect every message with encrypting it 
      * and decrypt server messages
    **/

    interface.on("connect", adapter => {
      adapter.addIntercept(async (data, info, cancel) => {
        const isSucceed = await arch.send(info.protocol, data);
        return {
          status: isSucceed,
          data
        };
      });

      arch.on("data", data => {
        adapter.fake(data);
      });
    });
  } else {
    /**
      * For server: simply process the traffic synchroniously
    **/

   const cipherKey = process.argv[process.argv.indexOf("--private") + 1];
   cipher.set(cipherKey);
   
    arch.start({
      method: process.argv.includes("--tcp") ? "TCP" : "UDP",
      port, host, cipher
    });
  }
}

console.log("[25%] Local proxy listening on 0.0.0.0:1080");
