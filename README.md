# lovesense

[![Build Status](https://img.shields.io/travis/metafetish/lovesense-js.svg)](https://travis-ci.org/metafetish/lovesense-js) [![npm](https://img.shields.io/npm/v/lovesense.svg)](https://npmjs.com/package/lovesense) [![codeclimate coverage](https://codeclimate.com/github/metafetish/lovesense-js/badges/coverage.svg)](https://codeclimate.com/github/metafetish/lovesense-js) [![codeclimate health](https://codeclimate.com/github/metafetish/lovesense-js/badges/gpa.svg)](https://codeclimate.com/github/metafetish/lovesense-js)[![Patreon donate button](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/qdot)

lovesense is a library for controlling Lovense sex toys. The library
allows users to control all aspects of the toy
(vibration/rotation/inflation, depending on the toy), as well as
retrieving information like device type, status, battery level, and
accelerometer readings.

The library is currently available in the following languages:

- [Python](http://github.com/metafetish/lovesense-py)
- [Max/MSP](http://github.com/metafetish/lovesense-max)
- [Rust (with C Headers)](http://github.com/metafetish/lovesense-rs)
- [Javascript](http://github.com/metafetish/lovesense-js)

If you need an implementation in a language not currently supported by
lovesense, please file an issue on the github tracker of the relevant
project.

Please note that this project has no direct relation to the Lovense
company. These drivers have been developed/supported by the open
source community. Lovense has had no direct participation in this
project and most likely will not be able to answer questions or
provide support for any of the Lovesense drivers. 

If you require commercial support for programming for Lovense
products, it is recommended you go through the
[Official Lovense Developer Program](https://www.lovense.com/sextoys/developer).

## Javascript/Node.js Library and Platform Support

lovense-js is written to handle communications with Lovense toys
across both node.js and web technologies like WebBluetooth. Depending
on the desired toy, it can be used in local node applications, or on
webpages.

As a node.js library, lovesense-js can be used on the following
platforms with the toys listed:

- Windows - Support for Max, Nora, Lush toys available out of the box.
  Supports all Lovense toys if
  [noble + libusb + bluetooth dongle setup](https://github.com/sandeepmistry/node-bluetooth-hci-socket#windows) is
  used. Support for Windows 10 BLE coming in February.
- macOS - All lovense toys, assuming macOS 10.6+
- linux - All lovense toys, assuming bluez > 5.42

As a web library using WebBluetooth, lovesense-js can be used on the
following platforms with the Bluetooth LE based toys listed:

- Windows - No support currently. Waiting for Chrome to have Windows
  bluetooth support.
- macOS - Hush, Osci, Ambi, Edge, Domi, using Chrome 56+
- linux - Hush, Osci, Ambi, Edge, Domi, using Chrome 56+ (with
  experimental web extensions turned on) and bluez > 5.42
- Android - Supported using Android M
- ChromeOS - Supported

## Protocol Explanation

Protocol documentation is available
at
[the lovesense-docs site on readthedocs.org](https://lovesense-docs.readthedocs.org/).

The protocol documentation repository is available [at metafetish/lovesense-docs on github](http://github.com/metafetish/lovesense-docs).

## Support The Project

If you find this project helpful, you
can
[support Metafetish projects via Patreon](http://patreon.com/qdot)!
Every donation helps us afford more hardware to reverse, document, and
write code for!

## Thanks

Thanks to [PenTest Partners](https://www.pentestpartners.com/) for
[documenting their initial work in their blog](https://www.pentestpartners.com/blog/dicking-around-with-dildos-how-to-drive-a-vibrator-with-realterm/).

## Disclaimer

The Lovesense project is in no way affiliated with Lovense or any of
its partners. The documentation and libraries here have been produced
via clean room reverse engineering methods, and are provided with no
guarantees, as outlined by the license agreement. Usage of these
libraries and information is in no way condoned by Lovense and may
void the warranty of your toy.

## License

tl;dr: BSD 3-Clause License

Copyright (c) 2016, Metafetish Project
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
* Neither the name of the authors nor the names of its contributors
  may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY The Authors ''AS IS'' AND ANY EXPRESS
OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL The Authors BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE


