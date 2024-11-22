class IpParser {
  parse(data) {
    const destinationLength = data[0];
    const destination = data.slice(1, 1 + destinationLength).join('.');
    const destPort = (data[1 + destinationLength] << 8) | data[2 + destinationLength];
    const totalLength = 3 + destinationLength;
    const splitComb = data.slice(totalLength, data.length);

    return { destinationLength, destination, destPort, splitComb };
  }
}

module.exports = IpParser;
