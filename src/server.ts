import ws from "ws";

import { initalizeGame } from "./game";
import { tryParseAndValidateMessage } from "./parser";
import { getPlayerRules } from "./rules";
import { reducer } from "./reducer";

async function main() {
  let gameState = initalizeGame(2);
  const server = new ws.Server({ port: 8080, host: "0.0.0.0" });

  // Mutate gamestate.
  server.on("connection", (ws) => {
    ws.on("message", async (message) => {
      const validatedMessage = await tryParseAndValidateMessage(
        message.toString()
      );
      if (!validatedMessage) {
        return;
      }

      // check if eligable to do action
      const playerRules = getPlayerRules(gameState);
      if (
        playerRules[validatedMessage.playerId].includes(
          validatedMessage.action.type
        )
      ) {
        console.log(
          "action allowed, performing...",
          validatedMessage.action.type
        );
        gameState = reducer(gameState, validatedMessage.action);
      }
    });
  });

  // Send state to clients.
  setInterval(() => {
    for (const client of Array.from(server.clients)) {
      client.send(
        JSON.stringify({
          state: gameState,
          possibleActions: getPlayerRules(gameState),
        })
      );
    }
  }, 1000);

  console.log("Server started at 0.0.0.0:8080");
}

main().catch((err) => console.error(err));
