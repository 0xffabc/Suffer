
class Cipher {
  constructor(key = [0, 1, 0]) {
    this.key = key;
  }

  // !todo
  encrypt(data) {
    return data;
  }

  // !todo
  decrypt(data) {
    return data;
  }
  
  init(sender, receiver) {
    /**
      * To send a packet, sender calls "write" on receiver.
      * Therefore, if we want to forward decrypted packet 
      * We modify receiver's write 
      
      * HACK! setting '__proto__: null' makes it impossible
      * to detect the proxy via overwriting Object.prototype.get
      * and testing if something was caught
    **/

    receiver.write = new Proxy(receiver.write, {
      __proto__: null,
      apply: ((targetObj, thisObj, argsArr) => {
        argsArr[0] = this.decrypt(argsArr[0]);
        
        return targetObj.apply(thisObj, argsArr);
      }).bind(this)
    });

    /**
      * The sender should send only encrypted data
      * So we repeat the process in reverse order
    **/

    sender.write = new Proxy(sender.write, {
      __proto__: null,
      apply: ((targetObj, thisObj, argsArr) => {
        argsArr[0] = this.encrypt(argsArr[0]);
        
        return targetObj.apply(thisObj, argsArr);
      }).bind(this)
    });
  }
}

module.exports = Cipher;
