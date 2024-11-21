const socks = require("./socks/index.js");
const cipher = require("./protoc/index.js");
const arch = require("./arch/index.js");

/**
  * Todo: separate to classes (refactor)
  * fpe ff1 non finished, brotli compression finished (requires dependencies)
**/

const interface = new socks();

if (!process.argv.includes("--client") && !process.argv.includes("--server")) {
  throw new TypeError("Critical! Failed to cparse args -> unknown type of app");
} else {
  const isClient = process.argv.includes("--client");
  const port = parseInt(process.argv[process.argv.indexOf("--port") + 1]) || 1080;
  const host = process.argv[process.argv.indexOf("--host") + 1] || "0.0.0.0";
  const cipherKey = process.argv[process.argv.indexOf("--private") + 1] || "test";

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
        console.log(`[adapter:0] casted msg`, info, data);
        
        return {
          status: isSucceed,
          data
        };
      });

      arch.on("data", data => {
        console.log(`[adapter:0] forwarding from server`, data);
        adapter.fake(data);
      });
    });
  } else {
    /**
      * For server: simply process the traffic synchroniously
    **/

   const cipherKey = process.argv[process.argv.indexOf("--private") + 1];
   cipher.set(cipherKey);
  }
}

console.log("[25%] Local proxy listening on 0.0.0.0:1080");
