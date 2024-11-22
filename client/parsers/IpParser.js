class IpParser {
  parse(data) {
    let host_raw, host, port;
    const destAddrType = data[3];
    
    switch(destAddrType) {
      case 1:
        host_raw = data.slice(4, 8);
        host = host_raw.join('.');
        port = data.readUInt16BE(8);
        break;
      case 3:
        const addrLen = data[4];
        host_raw = data.slice(5, 5 + addrLen);
        host = host_raw.toString();
        port = data.readUInt16BE(5 + addrLen);
      break;
    }

    return { host_raw, host, port, destAddrType };
  }
}

module.exports = IpParser;
