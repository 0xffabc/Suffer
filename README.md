 # Suffer 

> **Warning! This project is still under development. Don't use it on production servers, because you can be greylisted for proxy/vpn**

Project todo:

1. Refactor and split code by little parts - ✅
2. Add fpe encryption and packing - 🟠
3. Add UDP Support - ✅
 
 This project is a collection of my self made utils, experiments and solutions on bypassing complex models with DPI (Deep packet inspection) combined with VPN protocols blocking and aggressive censorship. It's mainly centered around Suffer VPN protocol server, which is meant to be easily deployable (Written in Node.js!) and easily configurable (All-default values with already good strength level), while maintaining main principles in case if it all will work fine.
 This project is easy to deploy on a real server, by using Docker. Which is the fanciest way to use it.

 ## Usage

 Download the client, run npm install and build the project.
Arguments for running the program are documented as below

--host - client connection addr / server bind url (set to 0.0.0.0)
--port - bind / connect port 
--(server / client) - mode marker

## DPI Information & prelude

 DPI (Deep packet inspection) is an infrastructure of packet analysers that determine source of that packet, applied protocol used in that packet. DPI is denoted as one of most dangerous utilities used for censorship. The main problem in Russia, lies in providers using completely differently tuned deep packet inspection, different versions of it (in some regions the release of TTTD is older, in Moscow it's the latest)

TTTD (Techincal tool of threats defence) is Roskomnadzor's successful skid of Chinese great firewall infrastructure. Rkn workers are so good, humane and ambitious, that they are testing full lockdown from foreign traffic, same as it's done in DPRK or China's GFW. Even while having a work of Chinese government which used way more advanced methods, they still managed to get out with lots of security holes.

This project makes TTTD **Suffer** in worst pain ever possible. It's what this chunk of python3/go abomination deserves for blocking youtube, discord, facebook, instagram, twitter, cloudflare CDNs, VPN protocols, and many more goods that adequate people use in their ordinary lives.
 
 DPI's are commonly classified by these groups:
 - Passive DPI. This type of DPI usually doesn't modify the packets and listens only to out traffic sent from client. Basically, it *can* be compared to MITM (Man-in-the-middle) attack. It can be combated in several ways: enabling DoH DNS server (e.g 1.1.1.1) with DNSSEC, enabling QUIC or HTTP/3, enabling TLS 1.3 and encrypted ClientHello, using local proxy server PAC file with a script made specifically for your provider, and not only that. However, I should mention that it's a best practice if you avoid triggering passive DPI. It's a hard, but beatable task to combat it after it was triggered.
 - Active (Aggressive) DPI. It's enabled by default in Russia, China and Iran. This DPI requires complex methods such as forced IP fragmentation at SNI even if it is encrypted, forced IPv6, fake ClientHello, mixed case in "Host" header of the HTTP request, additional space after "GET or POST", as well as adding additional dot in end of the domain, or even mixing it's case. Using VPN will be reviewed as the variant when your situation is extreme and requires frequent check of the situation.

In this documentation, every method of bypassing DPI will be covered with examples and code provided of how to use it.

The main target of this project is reaching maximum defence against DPI, using minimum effort.  

At first stage of bypassing DPI, we'll combat passive DPI.

You can spot it very easily when you're getting redirected from the desired website to provider's plug in replacement page.  

I'll show solution to bypassing passive DPI, via revealing the issue you will meet and how to solve it. At the end of this part, you'll be able to resolve slowed down domains, reduce DNS poisoning, encrypt your ClientHello and SNI which will reduce impact on blocked pages, and fina lly, unblock some pages. 

1. Enabling QUIC / HTTP3. This process will severely speed up most of pages like youtube and discord. QUIC allows to use UDP or datagram duplex streams, and acts way faster. For chromium based browsers, go to about://flags and switch on "Enable expiremental QUIC protocol" flag, then relaunch your browser. For firefox based browsers - go to about:config and enable "network.http.http3.enabled" flag. For safari browser - Settings > Safari > Advanced > Experimental Features > HTTP/3. However, many iPhone / Macbook users experience this flag to not work. I myself recommend switching to a browser that actually supports it - for example chromium based browsers or firefox based browsers.
2. 2. Setup secure and reliable DoH DNS, and it would be even better, if it runs on non-standart port (e.g 1253 for yandex DNS instead of 53). For android - go to private DNS settings and set dns provider hostname setting to "one.one.one.one", which is cloudflare's 1.1.1.1 DNS. Optionally, for less chances to get detected by the DPI, use IPv6 address of cloudflare dns -  2606:4700:4700::1111. It would grant you way more security. Same thing goes for iOS: Go to settings / Wi-Fi / select "info" icon on your wifi network, change DNS configuration from automatic to manual, press add server. If you want to use IPv6, which is more preferred variation, put  2606:4700:4700::1111, otherwise, if you will go by IPv4, use 1.1.1.1. It's very easy to setup in desktop chromium - go to privacy & security, enable "use secure DNS" and choose "Cloudflare DNS".
3. Enforcing TLS/3.0. It's one of the most important steps, without it websites will load slower and the SNI of website will be exposed to the DPI, which we don't want to.  To enable it in chromium, go to flags and enable "TLS/3.0 Early data" with "TLS/3.0 post-quantum key agreement" flags. iOS by default support TLS/3.0, so you don't have to go through this step on apple devices. To enable TLS/3.0 on firefox, go to about:config and enable those flags: "grease_http3_enable", "enable_kyber", and "grease_http" for encrypted ClientHello.
4. Enforce enrypted ClientHello. This step is complex and you have to research it yourself for your platform and conditions, furthermore, not all websites support it. It's counted as one of most effective DPI circumvention techniques you can do without help of external utilities.      

## Development

API Info

### class ClientTunnel(vpn_host: String(Vec<u8>(4).join('.')), vpn_port: u16, host_raw: Vec<u8>(4).join('.')), target_port: u8 or default=444u8, socket: net.Socket)

this.socket: instanceof net.Socket - Server and client communication socket

this.send: Buffer | TypedArray - Method for sending message to server
