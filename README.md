# Passmarked-Phishtank

![NPM](https://img.shields.io/npm/dt/@passmarked/phishtank.svg)

[Phishtank](https://www.phishtank.com) catalog's known Phishing urls which is a awesome resource. The entire database is provided for download in various formats such as XML/CSV and JSON over at [www.phishtank.com/developer_info.php](https://www.phishtank.com/developer_info.php).

[Passmarked](http://passmarked.com?source=github&repo=phishtank) downloads the newest database every 6 hours and loads the entries into a local Redis server. Which is then queried to see if a site is hosing a Phishing attack while testing from the [@passmarked/malware](https://www.npmjs.com/package/@passmarked/malware) module. For those wishing to run the module locally this utility primes the Redis cache to be ready for use.

## Install

### NPM

```
npm install -g @passmarked/phishtank
```

View the project at [npmjs.com/package/@passmarked/phishtank](https://www.npmjs.com/package/@passmarked/phishtank).

### From Source

To build from source:

```bash
git clone git@github.com:passmarked/phishtank.git phishtank/
cd passmarked/
npm install
```

## Terminal Usage

```
passmarked-phishtank --host 127.0.0.1 --port 6379 blacklist.json
```

Which will result in:

```
processing blacklist.json:
loading blacklist...
Found 36019 records in blacklist
connecting to redis server: 127.0.0.1
connection to 127.0.0.1 success !
processing records from index 0 till 1000
processing records from index 1000 till 2000
processing records from index 2000 till 3000
processing records from index 3000 till 4000
processing records from index 4000 till 5000
processing records from index 5000 till 6000
processing records from index 6000 till 7000
processing records from index 7000 till 8000
processing records from index 8000 till 9000
processing records from index 9000 till 10000
processing records from index 10000 till 11000
processing records from index 11000 till 12000
processing records from index 12000 till 13000
processing records from index 13000 till 14000
processing records from index 14000 till 15000
processing records from index 15000 till 16000
processing records from index 16000 till 17000
processing records from index 17000 till 18000
processing records from index 18000 till 19000
processing records from index 19000 till 20000
processing records from index 20000 till 21000
processing records from index 21000 till 22000
processing records from index 22000 till 23000
processing records from index 23000 till 24000
processing records from index 24000 till 25000
processing records from index 25000 till 26000
processing records from index 26000 till 27000
processing records from index 27000 till 28000
processing records from index 28000 till 29000
processing records from index 29000 till 30000
processing records from index 30000 till 31000
processing records from index 31000 till 32000
processing records from index 32000 till 33000
processing records from index 33000 till 34000
processing records from index 34000 till 35000
processing records from index 35000 till 36000
processing records from index 36000 till 37000
Cached 36019 out of the 36019 known phishing attacks
```

## Options

The utility expects a few options:

```
passmarked-phishtank [--host 127.0.0.1] [--port 6379] blacklist.json blacklist2.json ...
```

The parameters provided:

* **host** - The address / ip of the Redis server to connect to, the utility does not try to authenticate and expects the Redis server to be secured on a local network and open for local connections.
* **port** - The port of the Redis server to connect to, the utility does not try to authenticate and expects the Redis server to be secured on a local network and open for local connections.

The res of the parameters provided are treated as the files to parse and try to add to the cache.


## License

Copyright 2016 Passmarked Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
