# Agent

## Get started

- Connect your wallet to Gaianet and get the [api key](https://docs.gaianet.ai/getting-started/authentication).
- Configure the environment and use a Gaia domain/ any LLM as model service provider. Replace the env variables: `GAIANET_API_KEY`/ `OPENAI_API_KEY`, `ETHERSCAN_API_KEY`, `INFURA_API_KEY`
- Update the `modelProvider` in [agent.character.json](./characters/agent.character.json)

  ```bash
  cp .env.example .env
  ```

- Run the following commands to start the agent. (Optional) Reset the SQLite DB at [data/sqlite.db](./data/db.sqlite).

  ```bash
  # rm -rf ./data
  pnpm install
  pnpm build
  pnpm start "--character=characters/agent.character.json"
  ```

- To interact with the agent, try the following commands:
  ```
  explain logic in <CONTRACT_ADDRESS> on <CHAIN>
  get metadata in <CONTRACT_ADDRESS>, for token id <TOKEN_ID> on <CHAIN>
  ```

# Gaianet

## Get started

- Connect your wallet to Gaianet.
- Select a domain and start interacting with the agent.

## Contributing

### Run a node on AWS

- Launch a `t2-xlarge` (or instance type with at least 16GB RAM) instance with `GaiaNet_ubuntu22.04_arm64` x86 AMI.
- Make sure that SSH connections are allowed for the instance.
- SSH into the instance.
- Initialize a Gaia node with Qwen2-0.5b-instruct model.
  ```bash
  gaianet init --config https://raw.githubusercontent.com/GaiaNet-AI/node-configs/main/qwen2-0.5b-instruct/config.json
  gaianet config \
    --chat-ctx-size 32000 \
    --system-prompt <COPY_FROM_DOMAIN_SETTING>
  gaianet start
  ```

### Join the domain

- Register the node in Gaianet.
- Ensure that the node meets the domain’s requirements, using the same configuration provided above.
- Submit a join request to our domain.
