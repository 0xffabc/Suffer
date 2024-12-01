class IpParser {
  parse(data) {
    const host = data.slice(1, 1 + data[0]).join('.');
    const port = (data[1 + data[0]] << 8) | data[2 + data[0]];
    const isUDP = data[data.length - 1] == 1;
    
    const totalLength = 3 + data[0];
    const splitComb = data.slice(totalLength, data.length);

    return { host, port, splitComb, isUDP };
  }
}

module.exports = IpParser;
