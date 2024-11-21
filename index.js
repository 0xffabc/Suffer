let socks, interface;

const cipher = require("./protoc/index.js");

/**
  * Todo: separate to classes (refactor)
  * fpe ff1 non finished, brotli compression finished (requires dependencies)
**/

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
  
  if (isClient) {
    /**
      * For client: We should redirect every message with encrypting it 
      * and decrypt server messages
    **/

    socks = require("./socks/index.js");
    interface = new socks();

    interface.on("connect", adapter => {
      /**
        * For each connection:
        * Open client -> server adapter and forwsrd messages
        * via it using socks5 local proxy
      **/
      const arch = require("./arch/index.js");

      arch.init({                                               port, cipher,
        mode: isClient ? "client" : "server",
        host, cipherKey, interface
      });

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

      console.log(`[adapter:0] opening interface with unknown host`);
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
