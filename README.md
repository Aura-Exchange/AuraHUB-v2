<h3 align="center">Aura Exchange PCM</h3>
  <p align="center">
Private Collection Marketplace

<!-- ABOUT THE PROJECT -->

## About The Project



<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started (Self-Hosted)

### Prerequisites

1. Install [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)
3. Request free [Reservoir API key](https://reservoir.tools/request-api-key)

### Built With

- [ReservoirKit](https://docs.reservoir.tools/docs/reservoir-kit)
- [Reservoir Protocol and API](https://reservoirprotocol.github.io/)
- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Ethers.io](https://ethers.io/)
- [WAGMI](https://wagmi.sh/)
- [Stitches](https://stitches.dev/docs/variants)

### Installation

Fork this repo and follow these instructions to install dependancies.

With yarn:

```bash
$ yarn install
```

With NPM:

```bash
$ npm install
```

### Configuration

Aura PCM `.env.production` 

**Environment Variables**
| Environment Variable | Required | Description | Example |
|--------------------------------|----------|-------------------------------------------------------------------------------------|---------------------|
| NEXT_PUBLIC_ETH_COLLECTION_SET_ID | `false` | Use this to configure a community marketplace. This will only impact the mainnet network. Generate your collection set ID [here](https://docs.reservoir.tools/reference/postcollectionssetsv1). | f566ba09c14f56aedeed3f77e3ae7f5ff28b9177714d3827a87b7a182f8f90ff |
NEXT_PUBLIC_ALCHEMY_ID=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
NEXT_PUBLIC_HOST_URL=
NEXT_PUBLIC_MARKETPLACE_SOURCE=
ETH_RESERVOIR_API_KEY=

### Navbar 
For each PCM navbar, the Aura logo should redirect to https://{PROJECT_NAME}.auraexchange.org/{CHAIN}/{CONTRACT_ADDRESS} is a single collection PCM

If multiple collections, project founder can deside which collection for this page to be. 

### Run the App

Once you have your setup ready, run:

With yarn:

    $ yarn dev

With npm:

    $ npm run dev

### Deploy with Vercel

This is a Next.js app that can be easily deployed using [Vercel](https://vercel.com/). For more information on how to deploy your Github repository with Vercel visit their [docs](https://vercel.com/docs/concepts/projects/overview).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Twitter: [@AuraExchange](https://twitter.com/AuraExchange)
Project Link: [AuraHUB](https://hub.auraexchange.org)

<p align="right">(<a href="#top">back to top</a>)</p>
# AuraPCMBoilerplate
