class IpParser {
  parse(data) {
    const host = data.slice(1, 1 + destinationLength).join('.');
    const port = (data[1 + destinationLength] << 8) | data[2 + destinationLength];
    
    const totalLength = 3 + destinationLength;
    const splitComb = data.slice(totalLength, data.length);

    return { host, port, splitComb };
  }
}

module.exports = IpParser;
